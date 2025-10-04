import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { environmentalImpacts, assessments } from '@/db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

// Industry benchmarks by metal type
const INDUSTRY_BENCHMARKS = {
  aluminium: { co2: 11.5, energy: 15500 },
  copper: { co2: 4.2, energy: 3800 },
  steel: { co2: 2.3, energy: 2000 }
};

// Calculate sustainability rating based on benchmark comparison
function calculateSustainabilityRating(benchmarkComparison: { co2Ratio: number; energyRatio: number }): string {
  const avgRatio = (benchmarkComparison.co2Ratio + benchmarkComparison.energyRatio) / 2;
  
  if (avgRatio <= 0.7) return 'Excellent';
  if (avgRatio <= 0.9) return 'Good';
  if (avgRatio <= 1.1) return 'Average';
  if (avgRatio <= 1.3) return 'Below Average';
  return 'Poor';
}

// Calculate benchmark comparison and add enhancements
async function enhanceImpactData(impact: any) {
  // Get assessment to determine metal type
  const assessment = await db.select()
    .from(assessments)
    .where(eq(assessments.id, impact.assessmentId))
    .limit(1);

  if (assessment.length === 0) {
    return { ...impact, benchmarkComparison: null, sustainabilityRating: null };
  }

  const metalType = assessment[0].metalType.toLowerCase();
  const benchmark = INDUSTRY_BENCHMARKS[metalType as keyof typeof INDUSTRY_BENCHMARKS];

  if (!benchmark || !impact.co2EmissionsTons || !impact.totalEnergyKwh) {
    return { ...impact, benchmarkComparison: null, sustainabilityRating: null };
  }

  // Calculate per-ton metrics (assuming quantity from material data or default to 1)
  const assumedQuantity = 1; // This could be enhanced by joining with material data
  const co2PerTon = impact.co2EmissionsTons / assumedQuantity;
  const energyPerTon = impact.totalEnergyKwh / assumedQuantity;

  const benchmarkComparison = {
    co2PerTon,
    energyPerTon,
    co2Benchmark: benchmark.co2,
    energyBenchmark: benchmark.energy,
    co2Ratio: co2PerTon / benchmark.co2,
    energyRatio: energyPerTon / benchmark.energy,
    co2Performance: co2PerTon <= benchmark.co2 ? 'Better' : 'Worse',
    energyPerformance: energyPerTon <= benchmark.energy ? 'Better' : 'Worse'
  };

  const sustainabilityRating = calculateSustainabilityRating(benchmarkComparison);

  return {
    ...impact,
    benchmarkComparison,
    sustainabilityRating
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessment_id');
    const co2Range = searchParams.get('co2_range');
    const calculatedAfter = searchParams.get('calculated_after');
    const energyRange = searchParams.get('energy_range');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(environmentalImpacts);
    const conditions = [];

    // Filter by assessment ID
    if (assessmentId) {
      const id = parseInt(assessmentId);
      if (isNaN(id)) {
        return NextResponse.json({ 
          error: "Invalid assessment_id",
          code: "INVALID_ASSESSMENT_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(environmentalImpacts.assessmentId, id));
    }

    // Filter by CO2 emissions range
    if (co2Range) {
      const rangeParts = co2Range.split('-');
      if (rangeParts.length === 2) {
        const min = parseFloat(rangeParts[0]);
        const max = parseFloat(rangeParts[1]);
        if (!isNaN(min) && !isNaN(max)) {
          conditions.push(gte(environmentalImpacts.co2EmissionsTons, min));
          conditions.push(lte(environmentalImpacts.co2EmissionsTons, max));
        }
      }
    }

    // Filter by energy consumption range
    if (energyRange) {
      const rangeParts = energyRange.split('-');
      if (rangeParts.length === 2) {
        const min = parseFloat(rangeParts[0]);
        const max = parseFloat(rangeParts[1]);
        if (!isNaN(min) && !isNaN(max)) {
          conditions.push(gte(environmentalImpacts.totalEnergyKwh, min));
          conditions.push(lte(environmentalImpacts.totalEnergyKwh, max));
        }
      }
    }

    // Filter by calculation date
    if (calculatedAfter) {
      const afterDate = new Date(calculatedAfter);
      if (!isNaN(afterDate.getTime())) {
        conditions.push(gte(environmentalImpacts.calculatedAt, afterDate.toISOString()));
      }
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(environmentalImpacts.calculatedAt))
      .limit(limit)
      .offset(offset);

    // Enhance each result with benchmark comparisons and sustainability ratings
    const enhancedResults = await Promise.all(
      results.map(result => enhanceImpactData(result))
    );

    return NextResponse.json(enhancedResults);
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
    const {
      assessmentId,
      co2EmissionsTons,
      totalEnergyKwh,
      totalWaterM3,
      totalWasteTons,
      calculatedAt
    } = requestBody;

    // Validate required fields
    if (!assessmentId) {
      return NextResponse.json({ 
        error: "assessment_id is required",
        code: "MISSING_ASSESSMENT_ID" 
      }, { status: 400 });
    }

    if (!calculatedAt) {
      return NextResponse.json({ 
        error: "calculated_at is required",
        code: "MISSING_CALCULATED_AT" 
      }, { status: 400 });
    }

    // Validate assessment_id is a valid integer
    const parsedAssessmentId = parseInt(assessmentId);
    if (isNaN(parsedAssessmentId)) {
      return NextResponse.json({ 
        error: "assessment_id must be a valid integer",
        code: "INVALID_ASSESSMENT_ID" 
      }, { status: 400 });
    }

    // Verify assessment exists
    const existingAssessment = await db.select()
      .from(assessments)
      .where(eq(assessments.id, parsedAssessmentId))
      .limit(1);

    if (existingAssessment.length === 0) {
      return NextResponse.json({ 
        error: "Assessment not found",
        code: "ASSESSMENT_NOT_FOUND" 
      }, { status: 400 });
    }

    // Validate positive values for impact metrics
    const validatePositiveValue = (value: any, fieldName: string) => {
      if (value !== undefined && value !== null && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
        return `${fieldName} must be a positive number`;
      }
      return null;
    };

    const validationErrors = [
      validatePositiveValue(co2EmissionsTons, 'co2EmissionsTons'),
      validatePositiveValue(totalEnergyKwh, 'totalEnergyKwh'),
      validatePositiveValue(totalWaterM3, 'totalWaterM3'),
      validatePositiveValue(totalWasteTons, 'totalWasteTons')
    ].filter(error => error !== null);

    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: validationErrors.join(', '),
        code: "VALIDATION_ERROR" 
      }, { status: 400 });
    }

    // Validate calculatedAt is a valid date
    const calculatedDate = new Date(calculatedAt);
    if (isNaN(calculatedDate.getTime())) {
      return NextResponse.json({ 
        error: "calculated_at must be a valid ISO date string",
        code: "INVALID_CALCULATED_AT" 
      }, { status: 400 });
    }

    // Check if environmental impact already exists for this assessment
    const existingImpact = await db.select()
      .from(environmentalImpacts)
      .where(eq(environmentalImpacts.assessmentId, parsedAssessmentId))
      .limit(1);

    const timestamp = new Date().toISOString();
    
    let result;
    
    if (existingImpact.length > 0) {
      // Update existing record
      const updateData: any = {
        updatedAt: timestamp
      };

      if (co2EmissionsTons !== undefined) updateData.co2EmissionsTons = parseFloat(co2EmissionsTons);
      if (totalEnergyKwh !== undefined) updateData.totalEnergyKwh = parseFloat(totalEnergyKwh);
      if (totalWaterM3 !== undefined) updateData.totalWaterM3 = parseFloat(totalWaterM3);
      if (totalWasteTons !== undefined) updateData.totalWasteTons = parseFloat(totalWasteTons);
      if (calculatedAt !== undefined) updateData.calculatedAt = calculatedDate.toISOString();

      result = await db.update(environmentalImpacts)
        .set(updateData)
        .where(eq(environmentalImpacts.assessmentId, parsedAssessmentId))
        .returning();
    } else {
      // Create new record
      const insertData = {
        assessmentId: parsedAssessmentId,
        co2EmissionsTons: co2EmissionsTons ? parseFloat(co2EmissionsTons) : null,
        totalEnergyKwh: totalEnergyKwh ? parseFloat(totalEnergyKwh) : null,
        totalWaterM3: totalWaterM3 ? parseFloat(totalWaterM3) : null,
        totalWasteTons: totalWasteTons ? parseFloat(totalWasteTons) : null,
        calculatedAt: calculatedDate.toISOString(),
        createdAt: timestamp,
        updatedAt: timestamp
      };

      result = await db.insert(environmentalImpacts)
        .values(insertData)
        .returning();
    }

    if (result.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to create/update environmental impact',
        code: "OPERATION_FAILED" 
      }, { status: 500 });
    }

    // Enhance the result with benchmark data
    const enhancedResult = await enhanceImpactData(result[0]);

    return NextResponse.json(enhancedResult, { status: existingImpact.length > 0 ? 200 : 201 });
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
    const {
      co2EmissionsTons,
      totalEnergyKwh,
      totalWaterM3,
      totalWasteTons,
      calculatedAt
    } = requestBody;

    // Check if record exists
    const existingRecord = await db.select()
      .from(environmentalImpacts)
      .where(eq(environmentalImpacts.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Environmental impact not found',
        code: "RECORD_NOT_FOUND" 
      }, { status: 404 });
    }

    // Validate positive values for impact metrics
    const validatePositiveValue = (value: any, fieldName: string) => {
      if (value !== undefined && value !== null && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
        return `${fieldName} must be a positive number`;
      }
      return null;
    };

    const validationErrors = [
      validatePositiveValue(co2EmissionsTons, 'co2EmissionsTons'),
      validatePositiveValue(totalEnergyKwh, 'totalEnergyKwh'),
      validatePositiveValue(totalWaterM3, 'totalWaterM3'),
      validatePositiveValue(totalWasteTons, 'totalWasteTons')
    ].filter(error => error !== null);

    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: validationErrors.join(', '),
        code: "VALIDATION_ERROR" 
      }, { status: 400 });
    }

    // Validate calculatedAt if provided
    if (calculatedAt) {
      const calculatedDate = new Date(calculatedAt);
      if (isNaN(calculatedDate.getTime())) {
        return NextResponse.json({ 
          error: "calculated_at must be a valid ISO date string",
          code: "INVALID_CALCULATED_AT" 
        }, { status: 400 });
      }
    }

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (co2EmissionsTons !== undefined) updateData.co2EmissionsTons = co2EmissionsTons ? parseFloat(co2EmissionsTons) : null;
    if (totalEnergyKwh !== undefined) updateData.totalEnergyKwh = totalEnergyKwh ? parseFloat(totalEnergyKwh) : null;
    if (totalWaterM3 !== undefined) updateData.totalWaterM3 = totalWaterM3 ? parseFloat(totalWaterM3) : null;
    if (totalWasteTons !== undefined) updateData.totalWasteTons = totalWasteTons ? parseFloat(totalWasteTons) : null;
    if (calculatedAt !== undefined) updateData.calculatedAt = new Date(calculatedAt).toISOString();

    const updated = await db.update(environmentalImpacts)
      .set(updateData)
      .where(eq(environmentalImpacts.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update environmental impact',
        code: "UPDATE_FAILED" 
      }, { status: 500 });
    }

    // Enhance the result with benchmark data
    const enhancedResult = await enhanceImpactData(updated[0]);

    return NextResponse.json(enhancedResult);
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
      .from(environmentalImpacts)
      .where(eq(environmentalImpacts.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Environmental impact not found',
        code: "RECORD_NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(environmentalImpacts)
      .where(eq(environmentalImpacts.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to delete environmental impact',
        code: "DELETE_FAILED" 
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Environmental impact deleted successfully',
      deletedRecord: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}