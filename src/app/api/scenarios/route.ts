import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { scenarios, assessments } from '@/db/schema';
import { eq, like, and, or, desc, asc, between, gte, lte } from 'drizzle-orm';

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
        .from(scenarios)
        .where(eq(scenarios.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
      }

      // Calculate enhanced fields for single record
      const scenario = record[0];
      const enhancedScenario = await enhanceScenario(scenario);

      return NextResponse.json(enhancedScenario);
    }

    // List with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const assessmentId = searchParams.get('assessment_id');
    const scenarioType = searchParams.get('scenario_type');
    const co2ReductionRange = searchParams.get('co2_reduction_range');
    const feasible = searchParams.get('feasible');
    const sortField = searchParams.get('sort') || 'createdAt';
    const sortOrder = searchParams.get('order') === 'asc' ? asc : desc;

    let query = db.select().from(scenarios);
    let conditions = [];

    // Assessment ID filter
    if (assessmentId) {
      if (isNaN(parseInt(assessmentId))) {
        return NextResponse.json({ 
          error: "Valid assessment ID is required",
          code: "INVALID_ASSESSMENT_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(scenarios.assessmentId, parseInt(assessmentId)));
    }

    // Scenario type filter
    if (scenarioType) {
      if (!['baseline', 'circular', 'optimized'].includes(scenarioType)) {
        return NextResponse.json({ 
          error: "Scenario type must be 'baseline', 'circular', or 'optimized'",
          code: "INVALID_SCENARIO_TYPE" 
        }, { status: 400 });
      }
      conditions.push(eq(scenarios.scenarioType, scenarioType));
    }

    // CO2 reduction range filter
    if (co2ReductionRange) {
      const rangeParts = co2ReductionRange.split('-');
      if (rangeParts.length === 2) {
        const min = parseFloat(rangeParts[0]);
        const max = parseFloat(rangeParts[1]);
        if (!isNaN(min) && !isNaN(max)) {
          conditions.push(and(
            gte(scenarios.co2ReductionPct, min),
            lte(scenarios.co2ReductionPct, max)
          ));
        }
      }
    }

    // Search filter
    if (search) {
      const searchCondition = or(
        like(scenarios.name, `%${search}%`),
        like(scenarios.description, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const validSortFields = ['id', 'name', 'scenarioType', 'co2ReductionPct', 'costDifferencePct', 'createdAt', 'updatedAt'];
    if (validSortFields.includes(sortField)) {
      query = query.orderBy(sortOrder(scenarios[sortField]));
    } else {
      query = query.orderBy(desc(scenarios.createdAt));
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    // Enhance scenarios with calculations
    const enhancedResults = await Promise.all(
      results.map(async (scenario) => await enhanceScenario(scenario))
    );

    // Apply feasibility filter if requested
    let finalResults = enhancedResults;
    if (feasible === 'true') {
      finalResults = enhancedResults.filter(scenario => scenario.feasibility_score > 0.7);
    }

    return NextResponse.json(finalResults);

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
    const { assessment_id, assessmentId, name, description, scenario_type, scenarioType, co2_reduction_pct, co2ReductionPct, cost_difference_pct, costDifferencePct } = requestBody;

    // Normalize field names (support both snake_case and camelCase)
    const normalizedData = {
      assessmentId: assessment_id || assessmentId,
      name,
      description,
      scenarioType: scenario_type || scenarioType,
      co2ReductionPct: co2_reduction_pct || co2ReductionPct,
      costDifferencePct: cost_difference_pct || costDifferencePct
    };

    // Validation
    if (!normalizedData.assessmentId) {
      return NextResponse.json({ 
        error: "Assessment ID is required",
        code: "MISSING_ASSESSMENT_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(normalizedData.assessmentId.toString()))) {
      return NextResponse.json({ 
        error: "Valid assessment ID is required",
        code: "INVALID_ASSESSMENT_ID" 
      }, { status: 400 });
    }

    if (!normalizedData.name || normalizedData.name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and cannot be empty",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!normalizedData.scenarioType) {
      return NextResponse.json({ 
        error: "Scenario type is required",
        code: "MISSING_SCENARIO_TYPE" 
      }, { status: 400 });
    }

    if (!['baseline', 'circular', 'optimized'].includes(normalizedData.scenarioType)) {
      return NextResponse.json({ 
        error: "Scenario type must be 'baseline', 'circular', or 'optimized'",
        code: "INVALID_SCENARIO_TYPE" 
      }, { status: 400 });
    }

    // Validate assessment exists
    const assessmentExists = await db.select()
      .from(assessments)
      .where(eq(assessments.id, parseInt(normalizedData.assessmentId.toString())))
      .limit(1);

    if (assessmentExists.length === 0) {
      return NextResponse.json({ 
        error: "Referenced assessment does not exist",
        code: "ASSESSMENT_NOT_FOUND" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      assessmentId: parseInt(normalizedData.assessmentId.toString()),
      name: normalizedData.name.trim(),
      description: normalizedData.description ? normalizedData.description.trim() : null,
      scenarioType: normalizedData.scenarioType,
      co2ReductionPct: normalizedData.co2ReductionPct ? parseFloat(normalizedData.co2ReductionPct.toString()) : null,
      costDifferencePct: normalizedData.costDifferencePct ? parseFloat(normalizedData.costDifferencePct.toString()) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newRecord = await db.insert(scenarios)
      .values(sanitizedData)
      .returning();

    // Enhance the created scenario
    const enhancedScenario = await enhanceScenario(newRecord[0]);

    return NextResponse.json(enhancedScenario, { status: 201 });

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
    const { assessment_id, assessmentId, name, description, scenario_type, scenarioType, co2_reduction_pct, co2ReductionPct, cost_difference_pct, costDifferencePct } = requestBody;

    // Check if record exists
    const existingRecord = await db.select()
      .from(scenarios)
      .where(eq(scenarios.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    // Normalize field names
    const normalizedData = {
      assessmentId: assessment_id || assessmentId,
      name,
      description,
      scenarioType: scenario_type || scenarioType,
      co2ReductionPct: co2_reduction_pct || co2ReductionPct,
      costDifferencePct: cost_difference_pct || costDifferencePct
    };

    // Validation for provided fields
    if (normalizedData.assessmentId !== undefined) {
      if (isNaN(parseInt(normalizedData.assessmentId.toString()))) {
        return NextResponse.json({ 
          error: "Valid assessment ID is required",
          code: "INVALID_ASSESSMENT_ID" 
        }, { status: 400 });
      }

      // Validate assessment exists
      const assessmentExists = await db.select()
        .from(assessments)
        .where(eq(assessments.id, parseInt(normalizedData.assessmentId.toString())))
        .limit(1);

      if (assessmentExists.length === 0) {
        return NextResponse.json({ 
          error: "Referenced assessment does not exist",
          code: "ASSESSMENT_NOT_FOUND" 
        }, { status: 400 });
      }
    }

    if (normalizedData.name !== undefined && normalizedData.name.trim() === '') {
      return NextResponse.json({ 
        error: "Name cannot be empty",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    if (normalizedData.scenarioType !== undefined && !['baseline', 'circular', 'optimized'].includes(normalizedData.scenarioType)) {
      return NextResponse.json({ 
        error: "Scenario type must be 'baseline', 'circular', or 'optimized'",
        code: "INVALID_SCENARIO_TYPE" 
      }, { status: 400 });
    }

    // Build update object with only provided fields
    const updates = { updatedAt: new Date().toISOString() };

    if (normalizedData.assessmentId !== undefined) {
      updates.assessmentId = parseInt(normalizedData.assessmentId.toString());
    }
    if (normalizedData.name !== undefined) {
      updates.name = normalizedData.name.trim();
    }
    if (normalizedData.description !== undefined) {
      updates.description = normalizedData.description ? normalizedData.description.trim() : null;
    }
    if (normalizedData.scenarioType !== undefined) {
      updates.scenarioType = normalizedData.scenarioType;
    }
    if (normalizedData.co2ReductionPct !== undefined) {
      updates.co2ReductionPct = normalizedData.co2ReductionPct ? parseFloat(normalizedData.co2ReductionPct.toString()) : null;
    }
    if (normalizedData.costDifferencePct !== undefined) {
      updates.costDifferencePct = normalizedData.costDifferencePct ? parseFloat(normalizedData.costDifferencePct.toString()) : null;
    }

    const updated = await db.update(scenarios)
      .set(updates)
      .where(eq(scenarios.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Failed to update scenario' }, { status: 500 });
    }

    // Enhance the updated scenario
    const enhancedScenario = await enhanceScenario(updated[0]);

    return NextResponse.json(enhancedScenario);

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
      .from(scenarios)
      .where(eq(scenarios.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    const deleted = await db.delete(scenarios)
      .where(eq(scenarios.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Failed to delete scenario' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Scenario deleted successfully',
      deletedRecord: deleted[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

// Helper function to enhance scenarios with calculations
async function enhanceScenario(scenario: any) {
  try {
    // Get all scenarios for the same assessment to compare
    const relatedScenarios = await db.select()
      .from(scenarios)
      .where(eq(scenarios.assessmentId, scenario.assessmentId));

    // Find baseline scenario for comparison
    const baselineScenario = relatedScenarios.find(s => s.scenarioType === 'baseline');

    // Calculate feasibility score based on reduction targets vs industry benchmarks
    let feasibilityScore = 0.5; // Default neutral score

    if (scenario.co2ReductionPct !== null) {
      // Industry benchmarks: 
      // - Negative values (increase) reduce feasibility
      // - 0-20% reduction: moderate feasibility
      // - 20-50% reduction: high feasibility  
      // - 50%+ reduction: challenging but possible
      
      if (scenario.co2ReductionPct < 0) {
        feasibilityScore = Math.max(0, 0.3 + (scenario.co2ReductionPct / 100));
      } else if (scenario.co2ReductionPct <= 20) {
        feasibilityScore = 0.6 + (scenario.co2ReductionPct / 100);
      } else if (scenario.co2ReductionPct <= 50) {
        feasibilityScore = 0.8 + ((scenario.co2ReductionPct - 20) / 150);
      } else {
        feasibilityScore = Math.max(0.4, 0.9 - ((scenario.co2ReductionPct - 50) / 200));
      }

      // Adjust based on cost difference
      if (scenario.costDifferencePct !== null) {
        if (scenario.costDifferencePct < -50) { // High cost increase
          feasibilityScore *= 0.6;
        } else if (scenario.costDifferencePct < 0) { // Some cost increase
          feasibilityScore *= 0.8;
        } else if (scenario.costDifferencePct > 20) { // High savings
          feasibilityScore *= 1.2;
        }
      }
    }

    feasibilityScore = Math.min(1, Math.max(0, feasibilityScore));

    // Determine implementation complexity
    let implementationComplexity = 'Medium';

    if (scenario.scenarioType === 'baseline') {
      implementationComplexity = 'Low';
    } else if (scenario.scenarioType === 'circular') {
      if (scenario.co2ReductionPct && scenario.co2ReductionPct > 30) {
        implementationComplexity = 'High';
      } else {
        implementationComplexity = 'Medium';
      }
    } else if (scenario.scenarioType === 'optimized') {
      if (scenario.co2ReductionPct && scenario.co2ReductionPct > 50) {
        implementationComplexity = 'High';
      } else if (scenario.co2ReductionPct && scenario.co2ReductionPct > 20) {
        implementationComplexity = 'Medium';
      } else {
        implementationComplexity = 'Low';
      }
    }

    // Calculate comparison metrics
    let comparisonMetrics = {};
    if (baselineScenario && scenario.id !== baselineScenario.id) {
      comparisonMetrics = {
        co2_improvement_vs_baseline: baselineScenario.co2ReductionPct !== null && scenario.co2ReductionPct !== null
          ? scenario.co2ReductionPct - baselineScenario.co2ReductionPct
          : null,
        cost_difference_vs_baseline: baselineScenario.costDifferencePct !== null && scenario.costDifferencePct !== null
          ? scenario.costDifferencePct - baselineScenario.costDifferencePct
          : null
      };
    }

    return {
      ...scenario,
      feasibility_score: Math.round(feasibilityScore * 1000) / 1000, // Round to 3 decimal places
      implementation_complexity: implementationComplexity,
      comparison_metrics: comparisonMetrics,
      related_scenarios_count: relatedScenarios.length - 1 // Exclude self
    };

  } catch (error) {
    console.error('Error enhancing scenario:', error);
    // Return scenario with basic enhancement on error
    return {
      ...scenario,
      feasibility_score: 0.5,
      implementation_complexity: 'Medium',
      comparison_metrics: {},
      related_scenarios_count: 0
    };
  }
}