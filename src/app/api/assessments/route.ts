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
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

const METAL_TYPES = ['aluminium', 'copper', 'steel'] as const;
const STATUS_TYPES = ['draft', 'in_progress', 'completed'] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const metalType = searchParams.get('metal_type');
    const status = searchParams.get('status');
    const include = searchParams.get('include');
    const id = searchParams.get('id');

    // Single record fetch with optional related data
    if (id) {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      if (include === 'all') {
        // Fetch assessment with all related data using joins
        const assessment = await db.select()
          .from(assessments)
          .where(eq(assessments.id, parsedId))
          .limit(1);

        if (assessment.length === 0) {
          return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        const [materialDataRecords, processingDataRecords, transportationDataRecords, 
               circularityMetricsRecords, environmentalImpactsRecords, scenariosRecords] = await Promise.all([
          db.select().from(materialData).where(eq(materialData.assessmentId, parsedId)),
          db.select().from(processingData).where(eq(processingData.assessmentId, parsedId)),
          db.select().from(transportationData).where(eq(transportationData.assessmentId, parsedId)),
          db.select().from(circularityMetrics).where(eq(circularityMetrics.assessmentId, parsedId)),
          db.select().from(environmentalImpacts).where(eq(environmentalImpacts.assessmentId, parsedId)),
          db.select().from(scenarios).where(eq(scenarios.assessmentId, parsedId))
        ]);

        return NextResponse.json({
          ...assessment[0],
          materialData: materialDataRecords,
          processingData: processingDataRecords,
          transportationData: transportationDataRecords,
          circularityMetrics: circularityMetricsRecords,
          environmentalImpacts: environmentalImpactsRecords,
          scenarios: scenariosRecords
        });
      } else {
        const assessment = await db.select()
          .from(assessments)
          .where(eq(assessments.id, parsedId))
          .limit(1);

        if (assessment.length === 0) {
          return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        return NextResponse.json(assessment[0]);
      }
    }

    // List with filters
    let query = db.select().from(assessments);
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(assessments.projectName, `%${search}%`),
          like(assessments.metalType, `%${search}%`)
        )
      );
    }

    if (metalType && METAL_TYPES.includes(metalType as any)) {
      conditions.push(eq(assessments.metalType, metalType));
    }

    if (status && STATUS_TYPES.includes(status as any)) {
      conditions.push(eq(assessments.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const results = await query
      .orderBy(desc(assessments.createdAt))
      .limit(limit)
      .offset(offset);

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
    const { projectName, metalType, status } = requestBody;

    // Validate required fields
    if (!projectName || typeof projectName !== 'string' || projectName.trim() === '') {
      return NextResponse.json({ 
        error: "Project name is required and cannot be empty",
        code: "MISSING_PROJECT_NAME" 
      }, { status: 400 });
    }

    if (!metalType || !METAL_TYPES.includes(metalType)) {
      return NextResponse.json({ 
        error: "Metal type is required and must be one of: aluminium, copper, steel",
        code: "INVALID_METAL_TYPE" 
      }, { status: 400 });
    }

    if (status && !STATUS_TYPES.includes(status)) {
      return NextResponse.json({ 
        error: "Status must be one of: draft, in_progress, completed",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    const insertData = {
      projectName: projectName.trim(),
      metalType,
      status: status || 'draft',
      createdAt: now,
      updatedAt: now
    };

    const newAssessment = await db.insert(assessments)
      .values(insertData)
      .returning();

    return NextResponse.json(newAssessment[0], { status: 201 });

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

    const parsedId = parseInt(id);
    const requestBody = await request.json();
    const { projectName, metalType, status } = requestBody;

    // Check if record exists
    const existing = await db.select()
      .from(assessments)
      .where(eq(assessments.id, parsedId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Validate fields if provided
    if (projectName !== undefined && (typeof projectName !== 'string' || projectName.trim() === '')) {
      return NextResponse.json({ 
        error: "Project name cannot be empty",
        code: "INVALID_PROJECT_NAME" 
      }, { status: 400 });
    }

    if (metalType !== undefined && !METAL_TYPES.includes(metalType)) {
      return NextResponse.json({ 
        error: "Metal type must be one of: aluminium, copper, steel",
        code: "INVALID_METAL_TYPE" 
      }, { status: 400 });
    }

    if (status !== undefined && !STATUS_TYPES.includes(status)) {
      return NextResponse.json({ 
        error: "Status must be one of: draft, in_progress, completed",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (projectName !== undefined) {
      updates.projectName = projectName.trim();
    }
    if (metalType !== undefined) {
      updates.metalType = metalType;
    }
    if (status !== undefined) {
      updates.status = status;
    }

    const updated = await db.update(assessments)
      .set(updates)
      .where(eq(assessments.id, parsedId))
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

    const parsedId = parseInt(id);

    // Check if record exists
    const existing = await db.select()
      .from(assessments)
      .where(eq(assessments.id, parsedId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const deleted = await db.delete(assessments)
      .where(eq(assessments.id, parsedId))
      .returning();

    return NextResponse.json({
      message: 'Assessment deleted successfully',
      deletedRecord: deleted[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}