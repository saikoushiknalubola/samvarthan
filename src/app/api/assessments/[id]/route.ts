import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { 
  assessments, 
  materialData, 
  processingData, 
  transportationData, 
  circularityMetrics, 
  environmentalImpacts, 
  scenarios 
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const assessmentId = parseInt(id);

    // Get main assessment
    const assessment = await db.select()
      .from(assessments)
      .where(eq(assessments.id, assessmentId))
      .limit(1);

    if (assessment.length === 0) {
      return NextResponse.json({ 
        error: 'Assessment not found' 
      }, { status: 404 });
    }

    // Get all related data using separate queries
    const [
      materialDataRecords,
      processingDataRecords,
      transportationDataRecords,
      circularityMetricsRecords,
      environmentalImpactsRecords,
      scenariosRecords
    ] = await Promise.all([
      db.select().from(materialData).where(eq(materialData.assessmentId, assessmentId)),
      db.select().from(processingData).where(eq(processingData.assessmentId, assessmentId)),
      db.select().from(transportationData).where(eq(transportationData.assessmentId, assessmentId)),
      db.select().from(circularityMetrics).where(eq(circularityMetrics.assessmentId, assessmentId)),
      db.select().from(environmentalImpacts).where(eq(environmentalImpacts.assessmentId, assessmentId)),
      db.select().from(scenarios).where(eq(scenarios.assessmentId, assessmentId))
    ]);

    // Build response with nested arrays
    const result = {
      ...assessment[0],
      material_data: materialDataRecords,
      processing_data: processingDataRecords,
      transportation_data: transportationDataRecords,
      circularity_metrics: circularityMetricsRecords,
      environmental_impacts: environmentalImpactsRecords,
      scenarios: scenariosRecords
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('GET error:', error);
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

    const assessmentId = parseInt(id);
    const requestBody = await request.json();

    // Validate metal_type if provided
    if (requestBody.metal_type && !['aluminium', 'copper', 'steel'].includes(requestBody.metal_type)) {
      return NextResponse.json({ 
        error: "metal_type must be 'aluminium', 'copper', or 'steel'",
        code: "INVALID_METAL_TYPE" 
      }, { status: 400 });
    }

    // Validate status if provided
    if (requestBody.status && !['draft', 'in_progress', 'completed'].includes(requestBody.status)) {
      return NextResponse.json({ 
        error: "status must be 'draft', 'in_progress', or 'completed'",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Check if assessment exists
    const existingAssessment = await db.select()
      .from(assessments)
      .where(eq(assessments.id, assessmentId))
      .limit(1);

    if (existingAssessment.length === 0) {
      return NextResponse.json({ 
        error: 'Assessment not found' 
      }, { status: 404 });
    }

    // Prepare update data, mapping camelCase to snake_case for database
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (requestBody.project_name !== undefined) updateData.projectName = requestBody.project_name;
    if (requestBody.metal_type !== undefined) updateData.metalType = requestBody.metal_type;
    if (requestBody.status !== undefined) updateData.status = requestBody.status;
    if (requestBody.projectName !== undefined) updateData.projectName = requestBody.projectName;
    if (requestBody.metalType !== undefined) updateData.metalType = requestBody.metalType;

    // Update assessment
    const updated = await db.update(assessments)
      .set(updateData)
      .where(eq(assessments.id, assessmentId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Assessment not found' 
      }, { status: 404 });
    }

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

    const assessmentId = parseInt(id);

    // Check if assessment exists
    const existingAssessment = await db.select()
      .from(assessments)
      .where(eq(assessments.id, assessmentId))
      .limit(1);

    if (existingAssessment.length === 0) {
      return NextResponse.json({ 
        error: 'Assessment not found' 
      }, { status: 404 });
    }

    // Cascade delete all related data first
    await Promise.all([
      db.delete(materialData).where(eq(materialData.assessmentId, assessmentId)),
      db.delete(processingData).where(eq(processingData.assessmentId, assessmentId)),
      db.delete(transportationData).where(eq(transportationData.assessmentId, assessmentId)),
      db.delete(circularityMetrics).where(eq(circularityMetrics.assessmentId, assessmentId)),
      db.delete(environmentalImpacts).where(eq(environmentalImpacts.assessmentId, assessmentId)),
      db.delete(scenarios).where(eq(scenarios.assessmentId, assessmentId))
    ]);

    // Delete the main assessment
    const deleted = await db.delete(assessments)
      .where(eq(assessments.id, assessmentId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Assessment not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Assessment and all related data deleted successfully',
      deleted: deleted[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}