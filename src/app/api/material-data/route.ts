import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { materialData, assessments } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const assessmentId = searchParams.get('assessment_id');
    const extractionMethod = searchParams.get('extraction_method');
    const metalType = searchParams.get('metal_type');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    // Single record fetch
    const id = searchParams.get('id');
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }
      
      const record = await db.select({
        id: materialData.id,
        assessmentId: materialData.assessmentId,
        oreType: materialData.oreType,
        oreGradePct: materialData.oreGradePct,
        moisturePct: materialData.moisturePct,
        quantityTons: materialData.quantityTons,
        extractionMethod: materialData.extractionMethod,
        recycledContentPct: materialData.recycledContentPct,
        virginMaterialPct: materialData.virginMaterialPct,
        createdAt: materialData.createdAt,
        updatedAt: materialData.updatedAt,
        assessment: {
          id: assessments.id,
          projectName: assessments.projectName,
          metalType: assessments.metalType,
          status: assessments.status
        }
      })
      .from(materialData)
      .leftJoin(assessments, eq(materialData.assessmentId, assessments.id))
      .where(eq(materialData.id, parseInt(id)))
      .limit(1);
      
      if (record.length === 0) {
        return NextResponse.json({ error: 'Material data record not found' }, { status: 404 });
      }
      
      return NextResponse.json(record[0]);
    }

    // List query with joins and filtering
    let query = db.select({
      id: materialData.id,
      assessmentId: materialData.assessmentId,
      oreType: materialData.oreType,
      oreGradePct: materialData.oreGradePct,
      moisturePct: materialData.moisturePct,
      quantityTons: materialData.quantityTons,
      extractionMethod: materialData.extractionMethod,
      recycledContentPct: materialData.recycledContentPct,
      virginMaterialPct: materialData.virginMaterialPct,
      createdAt: materialData.createdAt,
      updatedAt: materialData.updatedAt,
      assessment: {
        id: assessments.id,
        projectName: assessments.projectName,
        metalType: assessments.metalType,
        status: assessments.status
      }
    })
    .from(materialData)
    .leftJoin(assessments, eq(materialData.assessmentId, assessments.id));

    // Build where conditions
    const whereConditions = [];

    if (assessmentId) {
      whereConditions.push(eq(materialData.assessmentId, parseInt(assessmentId)));
    }

    if (extractionMethod) {
      whereConditions.push(eq(materialData.extractionMethod, extractionMethod));
    }

    if (metalType) {
      whereConditions.push(eq(assessments.metalType, metalType));
    }

    if (search) {
      whereConditions.push(
        or(
          like(materialData.oreType, `%${search}%`),
          like(materialData.extractionMethod, `%${search}%`)
        )
      );
    }

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // Apply sorting
    const orderBy = order === 'asc' ? asc : desc;
    const sortColumn = sort === 'quantityTons' ? materialData.quantityTons :
                      sort === 'oreGradePct' ? materialData.oreGradePct :
                      sort === 'extractionMethod' ? materialData.extractionMethod :
                      materialData.createdAt;
    
    query = query.orderBy(orderBy(sortColumn));

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
      oreType,
      oreGradePct,
      moisturePct,
      quantityTons,
      extractionMethod,
      recycledContentPct
    } = requestBody;

    // Validate required fields
    if (!assessmentId) {
      return NextResponse.json({ 
        error: "Assessment ID is required",
        code: "MISSING_ASSESSMENT_ID" 
      }, { status: 400 });
    }

    if (!quantityTons) {
      return NextResponse.json({ 
        error: "Quantity in tons is required",
        code: "MISSING_QUANTITY_TONS" 
      }, { status: 400 });
    }

    // Validate quantity is positive
    if (quantityTons <= 0) {
      return NextResponse.json({ 
        error: "Quantity must be a positive number",
        code: "INVALID_QUANTITY" 
      }, { status: 400 });
    }

    // Validate percentage ranges
    if (oreGradePct !== undefined && oreGradePct !== null && (oreGradePct < 0 || oreGradePct > 100)) {
      return NextResponse.json({ 
        error: "Ore grade percentage must be between 0 and 100",
        code: "INVALID_ORE_GRADE" 
      }, { status: 400 });
    }

    if (moisturePct !== undefined && moisturePct !== null && (moisturePct < 0 || moisturePct > 100)) {
      return NextResponse.json({ 
        error: "Moisture percentage must be between 0 and 100",
        code: "INVALID_MOISTURE_PCT" 
      }, { status: 400 });
    }

    if (recycledContentPct !== undefined && recycledContentPct !== null && (recycledContentPct < 0 || recycledContentPct > 100)) {
      return NextResponse.json({ 
        error: "Recycled content percentage must be between 0 and 100",
        code: "INVALID_RECYCLED_CONTENT_PCT" 
      }, { status: 400 });
    }

    // Validate extraction method
    if (extractionMethod && !['open_pit', 'underground', 'recycled'].includes(extractionMethod)) {
      return NextResponse.json({ 
        error: "Extraction method must be 'open_pit', 'underground', or 'recycled'",
        code: "INVALID_EXTRACTION_METHOD" 
      }, { status: 400 });
    }

    // Validate assessment exists
    const existingAssessment = await db.select()
      .from(assessments)
      .where(eq(assessments.id, parseInt(assessmentId)))
      .limit(1);

    if (existingAssessment.length === 0) {
      return NextResponse.json({ 
        error: "Assessment not found",
        code: "ASSESSMENT_NOT_FOUND" 
      }, { status: 400 });
    }

    // Calculate virgin material percentage
    const virginMaterialPct = recycledContentPct !== undefined && recycledContentPct !== null 
      ? 100 - recycledContentPct 
      : null;

    // Prepare insert data
    const insertData = {
      assessmentId: parseInt(assessmentId),
      oreType: oreType?.trim() || null,
      oreGradePct: oreGradePct || null,
      moisturePct: moisturePct || null,
      quantityTons: parseFloat(quantityTons),
      extractionMethod: extractionMethod || null,
      recycledContentPct: recycledContentPct || null,
      virginMaterialPct: virginMaterialPct,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newRecord = await db.insert(materialData)
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
      oreType,
      oreGradePct,
      moisturePct,
      quantityTons,
      extractionMethod,
      recycledContentPct
    } = requestBody;

    // Check record exists
    const existingRecord = await db.select()
      .from(materialData)
      .where(eq(materialData.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Material data record not found' }, { status: 404 });
    }

    // Validate fields if provided
    if (quantityTons !== undefined && quantityTons <= 0) {
      return NextResponse.json({ 
        error: "Quantity must be a positive number",
        code: "INVALID_QUANTITY" 
      }, { status: 400 });
    }

    if (oreGradePct !== undefined && oreGradePct !== null && (oreGradePct < 0 || oreGradePct > 100)) {
      return NextResponse.json({ 
        error: "Ore grade percentage must be between 0 and 100",
        code: "INVALID_ORE_GRADE" 
      }, { status: 400 });
    }

    if (moisturePct !== undefined && moisturePct !== null && (moisturePct < 0 || moisturePct > 100)) {
      return NextResponse.json({ 
        error: "Moisture percentage must be between 0 and 100",
        code: "INVALID_MOISTURE_PCT" 
      }, { status: 400 });
    }

    if (recycledContentPct !== undefined && recycledContentPct !== null && (recycledContentPct < 0 || recycledContentPct > 100)) {
      return NextResponse.json({ 
        error: "Recycled content percentage must be between 0 and 100",
        code: "INVALID_RECYCLED_CONTENT_PCT" 
      }, { status: 400 });
    }

    if (extractionMethod && !['open_pit', 'underground', 'recycled'].includes(extractionMethod)) {
      return NextResponse.json({ 
        error: "Extraction method must be 'open_pit', 'underground', or 'recycled'",
        code: "INVALID_EXTRACTION_METHOD" 
      }, { status: 400 });
    }

    // Validate assessment exists if being updated
    if (assessmentId) {
      const existingAssessment = await db.select()
        .from(assessments)
        .where(eq(assessments.id, parseInt(assessmentId)))
        .limit(1);

      if (existingAssessment.length === 0) {
        return NextResponse.json({ 
          error: "Assessment not found",
          code: "ASSESSMENT_NOT_FOUND" 
        }, { status: 400 });
      }
    }

    // Build update object
    const updates = { updatedAt: new Date().toISOString() };

    if (assessmentId !== undefined) updates.assessmentId = parseInt(assessmentId);
    if (oreType !== undefined) updates.oreType = oreType?.trim() || null;
    if (oreGradePct !== undefined) updates.oreGradePct = oreGradePct || null;
    if (moisturePct !== undefined) updates.moisturePct = moisturePct || null;
    if (quantityTons !== undefined) updates.quantityTons = parseFloat(quantityTons);
    if (extractionMethod !== undefined) updates.extractionMethod = extractionMethod || null;
    if (recycledContentPct !== undefined) {
      updates.recycledContentPct = recycledContentPct || null;
      updates.virginMaterialPct = recycledContentPct !== null ? 100 - recycledContentPct : null;
    }

    const updated = await db.update(materialData)
      .set(updates)
      .where(eq(materialData.id, parseInt(id)))
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

    // Check record exists
    const existingRecord = await db.select()
      .from(materialData)
      .where(eq(materialData.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Material data record not found' }, { status: 404 });
    }

    const deleted = await db.delete(materialData)
      .where(eq(materialData.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Material data record deleted successfully',
      record: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}