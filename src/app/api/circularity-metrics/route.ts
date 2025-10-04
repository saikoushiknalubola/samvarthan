import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { circularityMetrics, assessments } from '@/db/schema';
import { eq, like, and, or, desc, asc, gte, lte, between } from 'drizzle-orm';

// Helper function to calculate composite score
function calculateCompositeScore(metrics: {
  mciScore?: number | null;
  recyclingPotentialPct?: number | null;
  resourceEfficiencyScore?: number | null;
  reusePotentialPct?: number | null;
}): number | null {
  const weights = {
    mci: 0.4,
    recycling: 0.25,
    resourceEfficiency: 0.2,
    reuse: 0.15
  };

  let totalWeight = 0;
  let weightedSum = 0;

  if (metrics.mciScore !== null && metrics.mciScore !== undefined) {
    weightedSum += metrics.mciScore * weights.mci;
    totalWeight += weights.mci;
  }

  if (metrics.recyclingPotentialPct !== null && metrics.recyclingPotentialPct !== undefined) {
    weightedSum += (metrics.recyclingPotentialPct / 100) * weights.recycling;
    totalWeight += weights.recycling;
  }

  if (metrics.resourceEfficiencyScore !== null && metrics.resourceEfficiencyScore !== undefined) {
    weightedSum += (metrics.resourceEfficiencyScore / 10) * weights.resourceEfficiency;
    totalWeight += weights.resourceEfficiency;
  }

  if (metrics.reusePotentialPct !== null && metrics.reusePotentialPct !== undefined) {
    weightedSum += (metrics.reusePotentialPct / 100) * weights.reuse;
    totalWeight += weights.reuse;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : null;
}

// Helper function to calculate circularity grade
function calculateCircularityGrade(compositeScore: number | null): string | null {
  if (compositeScore === null) return null;
  
  if (compositeScore > 0.8) return 'Excellent';
  if (compositeScore >= 0.6) return 'Good';
  if (compositeScore >= 0.4) return 'Fair';
  return 'Poor';
}

// Helper function to add calculated fields to record
function enhanceRecord(record: any) {
  const compositeScore = calculateCompositeScore({
    mciScore: record.mciScore,
    recyclingPotentialPct: record.recyclingPotentialPct,
    resourceEfficiencyScore: record.resourceEfficiencyScore,
    reusePotentialPct: record.reusePotentialPct
  });
  
  return {
    ...record,
    composite_score: compositeScore,
    circularity_grade: calculateCircularityGrade(compositeScore)
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const assessmentId = searchParams.get('assessment_id');
    const mciRange = searchParams.get('mci_range');
    const grade = searchParams.get('grade');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Single record by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(circularityMetrics)
        .where(eq(circularityMetrics.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ error: 'Circularity metric not found' }, { status: 404 });
      }

      return NextResponse.json(enhanceRecord(record[0]));
    }

    // List with filtering
    let query = db.select().from(circularityMetrics);
    let conditions = [];

    // Filter by assessment_id
    if (assessmentId) {
      if (isNaN(parseInt(assessmentId))) {
        return NextResponse.json({ 
          error: "Valid assessment ID is required",
          code: "INVALID_ASSESSMENT_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(circularityMetrics.assessmentId, parseInt(assessmentId)));
    }

    // Filter by MCI score range
    if (mciRange) {
      const rangeParts = mciRange.split('-');
      if (rangeParts.length === 2) {
        const min = parseFloat(rangeParts[0]);
        const max = parseFloat(rangeParts[1]);
        if (!isNaN(min) && !isNaN(max) && min >= 0 && max <= 1 && min <= max) {
          conditions.push(
            and(
              gte(circularityMetrics.mciScore, min),
              lte(circularityMetrics.mciScore, max)
            )
          );
        }
      }
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sort === 'mciScore' ? circularityMetrics.mciScore :
                      sort === 'recyclingPotentialPct' ? circularityMetrics.recyclingPotentialPct :
                      sort === 'resourceEfficiencyScore' ? circularityMetrics.resourceEfficiencyScore :
                      sort === 'updatedAt' ? circularityMetrics.updatedAt :
                      circularityMetrics.createdAt;

    query = query.orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn));

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    // Enhance results with calculated fields and filter by grade if requested
    let enhancedResults = results.map(enhanceRecord);

    // Filter by grade after calculation
    if (grade) {
      const gradeFilter = grade.toLowerCase();
      const gradeMap: { [key: string]: string } = {
        'excellent': 'Excellent',
        'good': 'Good',
        'fair': 'Fair',
        'poor': 'Poor'
      };
      
      if (gradeMap[gradeFilter]) {
        enhancedResults = enhancedResults.filter(record => 
          record.circularity_grade === gradeMap[gradeFilter]
        );
      }
    }

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
      mciScore,
      recyclingPotentialPct,
      resourceEfficiencyScore,
      extendedProductLifeYears,
      reusePotentialPct
    } = requestBody;

    // Validate required fields
    if (!assessmentId) {
      return NextResponse.json({ 
        error: "Assessment ID is required",
        code: "MISSING_ASSESSMENT_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(assessmentId))) {
      return NextResponse.json({ 
        error: "Valid assessment ID is required",
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
        error: "Assessment not found",
        code: "ASSESSMENT_NOT_FOUND" 
      }, { status: 400 });
    }

    // Validate optional fields
    if (mciScore !== undefined && mciScore !== null) {
      if (typeof mciScore !== 'number' || mciScore < 0 || mciScore > 1) {
        return NextResponse.json({ 
          error: "MCI score must be between 0 and 1",
          code: "INVALID_MCI_SCORE" 
        }, { status: 400 });
      }
    }

    if (recyclingPotentialPct !== undefined && recyclingPotentialPct !== null) {
      if (typeof recyclingPotentialPct !== 'number' || recyclingPotentialPct < 0 || recyclingPotentialPct > 100) {
        return NextResponse.json({ 
          error: "Recycling potential must be between 0 and 100",
          code: "INVALID_RECYCLING_POTENTIAL" 
        }, { status: 400 });
      }
    }

    if (resourceEfficiencyScore !== undefined && resourceEfficiencyScore !== null) {
      if (typeof resourceEfficiencyScore !== 'number' || resourceEfficiencyScore < 0 || resourceEfficiencyScore > 10) {
        return NextResponse.json({ 
          error: "Resource efficiency score must be between 0 and 10",
          code: "INVALID_RESOURCE_EFFICIENCY" 
        }, { status: 400 });
      }
    }

    if (extendedProductLifeYears !== undefined && extendedProductLifeYears !== null) {
      if (typeof extendedProductLifeYears !== 'number' || extendedProductLifeYears < 0) {
        return NextResponse.json({ 
          error: "Extended product life years must be a positive number",
          code: "INVALID_PRODUCT_LIFE" 
        }, { status: 400 });
      }
    }

    if (reusePotentialPct !== undefined && reusePotentialPct !== null) {
      if (typeof reusePotentialPct !== 'number' || reusePotentialPct < 0 || reusePotentialPct > 100) {
        return NextResponse.json({ 
          error: "Reuse potential must be between 0 and 100",
          code: "INVALID_REUSE_POTENTIAL" 
        }, { status: 400 });
      }
    }

    // Create the record
    const insertData = {
      assessmentId: parseInt(assessmentId),
      mciScore: mciScore || null,
      recyclingPotentialPct: recyclingPotentialPct || null,
      resourceEfficiencyScore: resourceEfficiencyScore || null,
      extendedProductLifeYears: extendedProductLifeYears || null,
      reusePotentialPct: reusePotentialPct || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newRecord = await db.insert(circularityMetrics)
      .values(insertData)
      .returning();

    return NextResponse.json(enhanceRecord(newRecord[0]), { status: 201 });

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
      mciScore,
      recyclingPotentialPct,
      resourceEfficiencyScore,
      extendedProductLifeYears,
      reusePotentialPct
    } = requestBody;

    // Check if record exists
    const existingRecord = await db.select()
      .from(circularityMetrics)
      .where(eq(circularityMetrics.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Circularity metric not found' }, { status: 404 });
    }

    // Validate assessment ID if provided
    if (assessmentId !== undefined) {
      if (!assessmentId || isNaN(parseInt(assessmentId))) {
        return NextResponse.json({ 
          error: "Valid assessment ID is required",
          code: "INVALID_ASSESSMENT_ID" 
        }, { status: 400 });
      }

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

    // Validate optional fields
    if (mciScore !== undefined && mciScore !== null) {
      if (typeof mciScore !== 'number' || mciScore < 0 || mciScore > 1) {
        return NextResponse.json({ 
          error: "MCI score must be between 0 and 1",
          code: "INVALID_MCI_SCORE" 
        }, { status: 400 });
      }
    }

    if (recyclingPotentialPct !== undefined && recyclingPotentialPct !== null) {
      if (typeof recyclingPotentialPct !== 'number' || recyclingPotentialPct < 0 || recyclingPotentialPct > 100) {
        return NextResponse.json({ 
          error: "Recycling potential must be between 0 and 100",
          code: "INVALID_RECYCLING_POTENTIAL" 
        }, { status: 400 });
      }
    }

    if (resourceEfficiencyScore !== undefined && resourceEfficiencyScore !== null) {
      if (typeof resourceEfficiencyScore !== 'number' || resourceEfficiencyScore < 0 || resourceEfficiencyScore > 10) {
        return NextResponse.json({ 
          error: "Resource efficiency score must be between 0 and 10",
          code: "INVALID_RESOURCE_EFFICIENCY" 
        }, { status: 400 });
      }
    }

    if (extendedProductLifeYears !== undefined && extendedProductLifeYears !== null) {
      if (typeof extendedProductLifeYears !== 'number' || extendedProductLifeYears < 0) {
        return NextResponse.json({ 
          error: "Extended product life years must be a positive number",
          code: "INVALID_PRODUCT_LIFE" 
        }, { status: 400 });
      }
    }

    if (reusePotentialPct !== undefined && reusePotentialPct !== null) {
      if (typeof reusePotentialPct !== 'number' || reusePotentialPct < 0 || reusePotentialPct > 100) {
        return NextResponse.json({ 
          error: "Reuse potential must be between 0 and 100",
          code: "INVALID_REUSE_POTENTIAL" 
        }, { status: 400 });
      }
    }

    // Prepare update data
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (assessmentId !== undefined) updates.assessmentId = parseInt(assessmentId);
    if (mciScore !== undefined) updates.mciScore = mciScore;
    if (recyclingPotentialPct !== undefined) updates.recyclingPotentialPct = recyclingPotentialPct;
    if (resourceEfficiencyScore !== undefined) updates.resourceEfficiencyScore = resourceEfficiencyScore;
    if (extendedProductLifeYears !== undefined) updates.extendedProductLifeYears = extendedProductLifeYears;
    if (reusePotentialPct !== undefined) updates.reusePotentialPct = reusePotentialPct;

    const updated = await db.update(circularityMetrics)
      .set(updates)
      .where(eq(circularityMetrics.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Circularity metric not found' }, { status: 404 });
    }

    return NextResponse.json(enhanceRecord(updated[0]));

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
      .from(circularityMetrics)
      .where(eq(circularityMetrics.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Circularity metric not found' }, { status: 404 });
    }

    const deleted = await db.delete(circularityMetrics)
      .where(eq(circularityMetrics.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Circularity metric not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Circularity metric deleted successfully',
      deleted: enhanceRecord(deleted[0])
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}