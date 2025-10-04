import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transportationData, assessments } from '@/db/schema';
import { eq, like, and, or, desc, asc, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }
      
      const record = await db.select()
        .from(transportationData)
        .where(eq(transportationData.id, parseInt(id)))
        .limit(1);
      
      if (record.length === 0) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }
      
      // Calculate efficiency metrics for single record
      const recordWithMetrics = calculateEfficiencyMetrics(record[0]);
      return NextResponse.json(recordWithMetrics);
    }
    
    // List with filtering, pagination, and search
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const assessmentId = searchParams.get('assessment_id');
    const mode = searchParams.get('mode');
    const fuelType = searchParams.get('fuel_type');
    const distanceRange = searchParams.get('distance_range');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    let query = db.select().from(transportationData);
    const conditions = [];
    
    // Filter by assessment_id
    if (assessmentId && !isNaN(parseInt(assessmentId))) {
      conditions.push(eq(transportationData.assessmentId, parseInt(assessmentId)));
    }
    
    // Filter by mode
    if (mode && ['truck', 'rail', 'ship'].includes(mode)) {
      conditions.push(eq(transportationData.mode, mode));
    }
    
    // Filter by fuel_type
    if (fuelType) {
      conditions.push(eq(transportationData.fuelType, fuelType));
    }
    
    // Filter by distance range (format: "100-1000")
    if (distanceRange) {
      const [minDistance, maxDistance] = distanceRange.split('-').map(d => parseFloat(d));
      if (!isNaN(minDistance) && !isNaN(maxDistance)) {
        conditions.push(
          and(
            gte(transportationData.distanceKm, minDistance),
            lte(transportationData.distanceKm, maxDistance)
          )
        );
      }
    }
    
    // Search across text fields
    if (search) {
      const searchCondition = or(
        like(transportationData.mode, `%${search}%`),
        like(transportationData.fuelType, `%${search}%`)
      );
      conditions.push(searchCondition);
    }
    
    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    const sortColumn = transportationData[sort as keyof typeof transportationData] || transportationData.createdAt;
    query = order === 'desc' 
      ? query.orderBy(desc(sortColumn))
      : query.orderBy(asc(sortColumn));
    
    const results = await query.limit(limit).offset(offset);
    
    // Calculate efficiency metrics for all records
    const resultsWithMetrics = results.map(calculateEfficiencyMetrics);
    
    return NextResponse.json(resultsWithMetrics);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { assessmentId, distanceKm, mode, loadCapacityTons, fuelType } = requestBody;
    
    // Validate required fields
    if (!assessmentId || isNaN(parseInt(assessmentId))) {
      return NextResponse.json({ 
        error: "Valid assessment_id is required",
        code: "MISSING_ASSESSMENT_ID" 
      }, { status: 400 });
    }
    
    if (!distanceKm || distanceKm <= 0) {
      return NextResponse.json({ 
        error: "distance_km is required and must be positive",
        code: "INVALID_DISTANCE" 
      }, { status: 400 });
    }
    
    if (!mode || !['truck', 'rail', 'ship'].includes(mode)) {
      return NextResponse.json({ 
        error: "mode is required and must be 'truck', 'rail', or 'ship'",
        code: "INVALID_MODE" 
      }, { status: 400 });
    }
    
    if (!loadCapacityTons || loadCapacityTons <= 0) {
      return NextResponse.json({ 
        error: "load_capacity_tons is required and must be positive",
        code: "INVALID_LOAD_CAPACITY" 
      }, { status: 400 });
    }
    
    // Validate assessment exists
    const existingAssessment = await db.select()
      .from(assessments)
      .where(eq(assessments.id, parseInt(assessmentId)))
      .limit(1);
    
    if (existingAssessment.length === 0) {
      return NextResponse.json({ 
        error: "Referenced assessment does not exist",
        code: "ASSESSMENT_NOT_FOUND" 
      }, { status: 400 });
    }
    
    // Prepare insert data
    const insertData = {
      assessmentId: parseInt(assessmentId),
      distanceKm: parseFloat(distanceKm),
      mode: mode.toLowerCase(),
      loadCapacityTons: parseFloat(loadCapacityTons),
      fuelType: fuelType ? fuelType.trim() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newRecord = await db.insert(transportationData)
      .values(insertData)
      .returning();
    
    // Calculate efficiency metrics for response
    const recordWithMetrics = calculateEfficiencyMetrics(newRecord[0]);
    
    return NextResponse.json(recordWithMetrics, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }
    
    const requestBody = await request.json();
    const { assessmentId, distanceKm, mode, loadCapacityTons, fuelType } = requestBody;
    
    // Check if record exists
    const existingRecord = await db.select()
      .from(transportationData)
      .where(eq(transportationData.id, parseInt(id)))
      .limit(1);
    
    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    
    const updates: any = {
      updatedAt: new Date().toISOString()
    };
    
    // Validate and prepare updates
    if (assessmentId !== undefined) {
      if (!assessmentId || isNaN(parseInt(assessmentId))) {
        return NextResponse.json({ 
          error: "assessment_id must be a valid integer",
          code: "INVALID_ASSESSMENT_ID" 
        }, { status: 400 });
      }
      
      // Validate assessment exists
      const existingAssessment = await db.select()
        .from(assessments)
        .where(eq(assessments.id, parseInt(assessmentId)))
        .limit(1);
      
      if (existingAssessment.length === 0) {
        return NextResponse.json({ 
          error: "Referenced assessment does not exist",
          code: "ASSESSMENT_NOT_FOUND" 
        }, { status: 400 });
      }
      
      updates.assessmentId = parseInt(assessmentId);
    }
    
    if (distanceKm !== undefined) {
      if (distanceKm <= 0) {
        return NextResponse.json({ 
          error: "distance_km must be positive",
          code: "INVALID_DISTANCE" 
        }, { status: 400 });
      }
      updates.distanceKm = parseFloat(distanceKm);
    }
    
    if (mode !== undefined) {
      if (!['truck', 'rail', 'ship'].includes(mode)) {
        return NextResponse.json({ 
          error: "mode must be 'truck', 'rail', or 'ship'",
          code: "INVALID_MODE" 
        }, { status: 400 });
      }
      updates.mode = mode.toLowerCase();
    }
    
    if (loadCapacityTons !== undefined) {
      if (loadCapacityTons <= 0) {
        return NextResponse.json({ 
          error: "load_capacity_tons must be positive",
          code: "INVALID_LOAD_CAPACITY" 
        }, { status: 400 });
      }
      updates.loadCapacityTons = parseFloat(loadCapacityTons);
    }
    
    if (fuelType !== undefined) {
      updates.fuelType = fuelType ? fuelType.trim() : null;
    }
    
    const updated = await db.update(transportationData)
      .set(updates)
      .where(eq(transportationData.id, parseInt(id)))
      .returning();
    
    // Calculate efficiency metrics for response
    const recordWithMetrics = calculateEfficiencyMetrics(updated[0]);
    
    return NextResponse.json(recordWithMetrics);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }
    
    // Check if record exists
    const existingRecord = await db.select()
      .from(transportationData)
      .where(eq(transportationData.id, parseInt(id)))
      .limit(1);
    
    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    
    const deleted = await db.delete(transportationData)
      .where(eq(transportationData.id, parseInt(id)))
      .returning();
    
    return NextResponse.json({
      message: 'Transportation data deleted successfully',
      deletedRecord: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

// Helper function to calculate efficiency metrics
function calculateEfficiencyMetrics(record: any) {
  const tonKmEfficiency = record.distanceKm && record.loadCapacityTons 
    ? record.distanceKm * record.loadCapacityTons 
    : 0;
  
  // Estimate fuel consumption based on mode and distance (L/100km base rates)
  const fuelConsumptionRates = {
    truck: 35,    // L/100km
    rail: 4,      // L/100km (more efficient)
    ship: 2       // L/100km (most efficient)
  };
  
  const baseRate = fuelConsumptionRates[record.mode as keyof typeof fuelConsumptionRates] || 35;
  const estimatedFuelConsumptionL = record.distanceKm 
    ? (record.distanceKm / 100) * baseRate
    : 0;
  
  // Calculate fuel efficiency (ton-km per liter)
  const fuelEfficiencyTonKmPerL = estimatedFuelConsumptionL > 0 
    ? tonKmEfficiency / estimatedFuelConsumptionL 
    : 0;
  
  // Estimate CO2 emissions based on fuel type (kg CO2/L)
  const co2EmissionFactors = {
    diesel: 2.68,
    gasoline: 2.31,
    lng: 1.92,
    electric: 0.5, // Grid average
    hydrogen: 0.0  // Green hydrogen
  };
  
  const emissionFactor = record.fuelType 
    ? co2EmissionFactors[record.fuelType as keyof typeof co2EmissionFactors] || 2.68
    : 2.68; // Default to diesel
  
  const estimatedCo2EmissionsKg = estimatedFuelConsumptionL * emissionFactor;
  
  return {
    ...record,
    calculatedMetrics: {
      tonKmEfficiency,
      estimatedFuelConsumptionL: Math.round(estimatedFuelConsumptionL * 100) / 100,
      fuelEfficiencyTonKmPerL: Math.round(fuelEfficiencyTonKmPerL * 100) / 100,
      estimatedCo2EmissionsKg: Math.round(estimatedCo2EmissionsKg * 100) / 100,
      efficiencyRating: getEfficiencyRating(record.mode, fuelEfficiencyTonKmPerL)
    }
  };
}

// Helper function to determine efficiency rating
function getEfficiencyRating(mode: string, fuelEfficiency: number): string {
  const thresholds = {
    truck: { excellent: 15, good: 10, fair: 5 },
    rail: { excellent: 50, good: 30, fair: 15 },
    ship: { excellent: 100, good: 60, fair: 30 }
  };
  
  const modeThresholds = thresholds[mode as keyof typeof thresholds] || thresholds.truck;
  
  if (fuelEfficiency >= modeThresholds.excellent) return 'excellent';
  if (fuelEfficiency >= modeThresholds.good) return 'good';
  if (fuelEfficiency >= modeThresholds.fair) return 'fair';
  return 'poor';
}