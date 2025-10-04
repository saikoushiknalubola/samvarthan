import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { processingData, assessments } from '@/db/schema';
import { eq, like, and, or, desc, asc, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const assessmentId = searchParams.get('assessment_id');
    const processType = searchParams.get('process_type');
    const aiEstimated = searchParams.get('ai_estimated');
    const energyRange = searchParams.get('energy_range');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    let query = db.select().from(processingData);
    const conditions = [];
    
    // Filter by assessment_id
    if (assessmentId && !isNaN(parseInt(assessmentId))) {
      conditions.push(eq(processingData.assessmentId, parseInt(assessmentId)));
    }
    
    // Filter by process_type
    if (processType && ['crushing', 'grinding', 'smelting', 'refining'].includes(processType)) {
      conditions.push(eq(processingData.processType, processType));
    }
    
    // Filter by ai_estimated
    if (aiEstimated !== null) {
      const isAiEstimated = aiEstimated === 'true';
      conditions.push(eq(processingData.aiEstimated, isAiEstimated));
    }
    
    // Filter by energy consumption range
    if (energyRange) {
      const [min, max] = energyRange.split('-').map(val => parseFloat(val));
      if (!isNaN(min) && !isNaN(max) && min >= 0 && max >= min) {
        conditions.push(
          and(
            gte(processingData.energyConsumptionKwh, min),
            lte(processingData.energyConsumptionKwh, max)
          )
        );
      }
    }
    
    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    const orderFunc = order === 'asc' ? asc : desc;
    if (sort === 'createdAt') {
      query = query.orderBy(orderFunc(processingData.createdAt));
    } else if (sort === 'energyConsumptionKwh') {
      query = query.orderBy(orderFunc(processingData.energyConsumptionKwh));
    } else if (sort === 'processType') {
      query = query.orderBy(orderFunc(processingData.processType));
    }
    
    const results = await query.limit(limit).offset(offset);
    
    return NextResponse.json(results);
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
      energySource,
      energyConsumptionKwh,
      equipmentEfficiencyPct,
      wasteGenerationTons,
      waterUsageM3,
      processType,
      aiEstimated = false
    } = requestBody;
    
    // Validate required fields
    if (!assessmentId) {
      return NextResponse.json({
        error: "Assessment ID is required",
        code: "MISSING_ASSESSMENT_ID"
      }, { status: 400 });
    }
    
    if (!processType) {
      return NextResponse.json({
        error: "Process type is required",
        code: "MISSING_PROCESS_TYPE"
      }, { status: 400 });
    }
    
    if (!energyConsumptionKwh) {
      return NextResponse.json({
        error: "Energy consumption is required",
        code: "MISSING_ENERGY_CONSUMPTION"
      }, { status: 400 });
    }
    
    // Validate assessment_id is valid integer
    if (isNaN(parseInt(assessmentId))) {
      return NextResponse.json({
        error: "Assessment ID must be a valid number",
        code: "INVALID_ASSESSMENT_ID"
      }, { status: 400 });
    }
    
    // Validate process_type
    if (!['crushing', 'grinding', 'smelting', 'refining'].includes(processType)) {
      return NextResponse.json({
        error: "Process type must be one of: crushing, grinding, smelting, refining",
        code: "INVALID_PROCESS_TYPE"
      }, { status: 400 });
    }
    
    // Validate energy_consumption_kwh is positive
    if (energyConsumptionKwh <= 0) {
      return NextResponse.json({
        error: "Energy consumption must be positive",
        code: "INVALID_ENERGY_CONSUMPTION"
      }, { status: 400 });
    }
    
    // Validate equipment_efficiency_pct if provided
    if (equipmentEfficiencyPct !== undefined && equipmentEfficiencyPct !== null) {
      if (equipmentEfficiencyPct < 0 || equipmentEfficiencyPct > 100) {
        return NextResponse.json({
          error: "Equipment efficiency must be between 0 and 100",
          code: "INVALID_EFFICIENCY"
        }, { status: 400 });
      }
    }
    
    // Check if assessment exists
    const existingAssessment = await db.select()
      .from(assessments)
      .where(eq(assessments.id, parseInt(assessmentId)))
      .limit(1);
    
    if (existingAssessment.length === 0) {
      return NextResponse.json({
        error: "Assessment not found",
        code: "ASSESSMENT_NOT_FOUND"
      }, { status: 404 });
    }
    
    // Apply efficiency calculations
    let adjustedEnergyConsumption = energyConsumptionKwh;
    if (equipmentEfficiencyPct && equipmentEfficiencyPct > 0) {
      adjustedEnergyConsumption = energyConsumptionKwh / (equipmentEfficiencyPct / 100);
    }
    
    const insertData = {
      assessmentId: parseInt(assessmentId),
      energySource: energySource?.trim() || null,
      energyConsumptionKwh: adjustedEnergyConsumption,
      equipmentEfficiencyPct: equipmentEfficiencyPct || null,
      wasteGenerationTons: wasteGenerationTons || null,
      waterUsageM3: waterUsageM3 || null,
      processType: processType.trim(),
      aiEstimated: Boolean(aiEstimated),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newRecord = await db.insert(processingData)
      .values(insertData)
      .returning();
    
    return NextResponse.json(newRecord[0], { status: 201 });
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
      assessmentId,
      energySource,
      energyConsumptionKwh,
      equipmentEfficiencyPct,
      wasteGenerationTons,
      waterUsageM3,
      processType,
      aiEstimated
    } = requestBody;
    
    // Check if record exists
    const existingRecord = await db.select()
      .from(processingData)
      .where(eq(processingData.id, parseInt(id)))
      .limit(1);
    
    if (existingRecord.length === 0) {
      return NextResponse.json({
        error: "Processing record not found",
        code: "RECORD_NOT_FOUND"
      }, { status: 404 });
    }
    
    // Validate fields if provided
    if (assessmentId !== undefined) {
      if (isNaN(parseInt(assessmentId))) {
        return NextResponse.json({
          error: "Assessment ID must be a valid number",
          code: "INVALID_ASSESSMENT_ID"
        }, { status: 400 });
      }
      
      // Check if assessment exists
      const existingAssessment = await db.select()
        .from(assessments)
        .where(eq(assessments.id, parseInt(assessmentId)))
        .limit(1);
      
      if (existingAssessment.length === 0) {
        return NextResponse.json({
          error: "Assessment not found",
          code: "ASSESSMENT_NOT_FOUND"
        }, { status: 404 });
      }
    }
    
    if (processType !== undefined && !['crushing', 'grinding', 'smelting', 'refining'].includes(processType)) {
      return NextResponse.json({
        error: "Process type must be one of: crushing, grinding, smelting, refining",
        code: "INVALID_PROCESS_TYPE"
      }, { status: 400 });
    }
    
    if (energyConsumptionKwh !== undefined && energyConsumptionKwh <= 0) {
      return NextResponse.json({
        error: "Energy consumption must be positive",
        code: "INVALID_ENERGY_CONSUMPTION"
      }, { status: 400 });
    }
    
    if (equipmentEfficiencyPct !== undefined && equipmentEfficiencyPct !== null) {
      if (equipmentEfficiencyPct < 0 || equipmentEfficiencyPct > 100) {
        return NextResponse.json({
          error: "Equipment efficiency must be between 0 and 100",
          code: "INVALID_EFFICIENCY"
        }, { status: 400 });
      }
    }
    
    const updates: any = {
      updatedAt: new Date().toISOString()
    };
    
    if (assessmentId !== undefined) updates.assessmentId = parseInt(assessmentId);
    if (energySource !== undefined) updates.energySource = energySource?.trim() || null;
    if (wasteGenerationTons !== undefined) updates.wasteGenerationTons = wasteGenerationTons;
    if (waterUsageM3 !== undefined) updates.waterUsageM3 = waterUsageM3;
    if (processType !== undefined) updates.processType = processType.trim();
    if (aiEstimated !== undefined) updates.aiEstimated = Boolean(aiEstimated);
    if (equipmentEfficiencyPct !== undefined) updates.equipmentEfficiencyPct = equipmentEfficiencyPct;
    
    // Apply efficiency calculations if energy consumption or efficiency is being updated
    if (energyConsumptionKwh !== undefined) {
      const currentEfficiency = equipmentEfficiencyPct !== undefined ? equipmentEfficiencyPct : existingRecord[0].equipmentEfficiencyPct;
      let adjustedEnergyConsumption = energyConsumptionKwh;
      
      if (currentEfficiency && currentEfficiency > 0) {
        adjustedEnergyConsumption = energyConsumptionKwh / (currentEfficiency / 100);
      }
      
      updates.energyConsumptionKwh = adjustedEnergyConsumption;
    } else if (equipmentEfficiencyPct !== undefined && existingRecord[0].energyConsumptionKwh) {
      // Recalculate energy consumption based on new efficiency
      const baseConsumption = existingRecord[0].equipmentEfficiencyPct 
        ? existingRecord[0].energyConsumptionKwh * (existingRecord[0].equipmentEfficiencyPct / 100)
        : existingRecord[0].energyConsumptionKwh;
      
      if (equipmentEfficiencyPct > 0) {
        updates.energyConsumptionKwh = baseConsumption / (equipmentEfficiencyPct / 100);
      }
    }
    
    const updated = await db.update(processingData)
      .set(updates)
      .where(eq(processingData.id, parseInt(id)))
      .returning();
    
    return NextResponse.json(updated[0]);
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
      .from(processingData)
      .where(eq(processingData.id, parseInt(id)))
      .limit(1);
    
    if (existingRecord.length === 0) {
      return NextResponse.json({
        error: "Processing record not found",
        code: "RECORD_NOT_FOUND"
      }, { status: 404 });
    }
    
    const deleted = await db.delete(processingData)
      .where(eq(processingData.id, parseInt(id)))
      .returning();
    
    return NextResponse.json({
      message: "Processing record deleted successfully",
      deletedRecord: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}