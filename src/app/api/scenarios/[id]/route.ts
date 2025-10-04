import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { scenarios, assessments, environmentalImpacts } from '@/db/schema';
import { eq, and, ne, desc } from 'drizzle-orm';

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

    // Get scenario with assessment data
    const scenario = await db.select({
      id: scenarios.id,
      assessmentId: scenarios.assessmentId,
      name: scenarios.name,
      description: scenarios.description,
      scenarioType: scenarios.scenarioType,
      co2ReductionPct: scenarios.co2ReductionPct,
      costDifferencePct: scenarios.costDifferencePct,
      createdAt: scenarios.createdAt,
      updatedAt: scenarios.updatedAt,
      projectName: assessments.projectName,
      metalType: assessments.metalType,
      assessmentStatus: assessments.status
    })
    .from(scenarios)
    .leftJoin(assessments, eq(scenarios.assessmentId, assessments.id))
    .where(eq(scenarios.id, parseInt(id)))
    .limit(1);

    if (scenario.length === 0) {
      return NextResponse.json({ 
        error: 'Scenario not found' 
      }, { status: 404 });
    }

    const currentScenario = scenario[0];

    // Get other scenarios in same assessment for comparison
    const otherScenarios = await db.select()
      .from(scenarios)
      .where(and(
        eq(scenarios.assessmentId, currentScenario.assessmentId),
        ne(scenarios.id, parseInt(id))
      ))
      .orderBy(desc(scenarios.createdAt));

    // Get environmental impacts for baseline comparison
    const environmentalData = await db.select()
      .from(environmentalImpacts)
      .where(eq(environmentalImpacts.assessmentId, currentScenario.assessmentId))
      .orderBy(desc(environmentalImpacts.calculatedAt))
      .limit(1);

    // Calculate impact projections
    const baselineImpacts = environmentalData[0];
    let impactProjections = null;

    if (baselineImpacts && currentScenario.co2ReductionPct !== null) {
      const projectedCO2 = baselineImpacts.co2EmissionsTons * (1 - (currentScenario.co2ReductionPct / 100));
      const co2Savings = baselineImpacts.co2EmissionsTons - projectedCO2;
      
      impactProjections = {
        projectedCO2EmissionsTons: Math.round(projectedCO2 * 100) / 100,
        co2SavingsTons: Math.round(co2Savings * 100) / 100,
        co2ReductionPct: currentScenario.co2ReductionPct,
        costDifferencePct: currentScenario.costDifferencePct,
        baselineCO2EmissionsTons: baselineImpacts.co2EmissionsTons
      };
    }

    // Calculate feasibility score
    const feasibilityScore = calculateFeasibilityScore(
      currentScenario.co2ReductionPct,
      currentScenario.costDifferencePct
    );

    // Generate implementation recommendations
    const recommendations = generateRecommendations(
      currentScenario.scenarioType,
      currentScenario.co2ReductionPct,
      currentScenario.costDifferencePct,
      currentScenario.metalType
    );

    const response = {
      ...currentScenario,
      feasibilityScore,
      impactProjections,
      recommendations,
      comparison: {
        otherScenarios: otherScenarios.map(s => ({
          id: s.id,
          name: s.name,
          scenarioType: s.scenarioType,
          co2ReductionPct: s.co2ReductionPct,
          costDifferencePct: s.costDifferencePct
        })),
        totalScenariosInAssessment: otherScenarios.length + 1
      }
    };

    return NextResponse.json(response);
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

    const body = await request.json();
    const {
      name,
      description,
      scenarioType,
      co2ReductionPct,
      costDifferencePct
    } = body;

    // Check if scenario exists
    const existingScenario = await db.select()
      .from(scenarios)
      .where(eq(scenarios.id, parseInt(id)))
      .limit(1);

    if (existingScenario.length === 0) {
      return NextResponse.json({ 
        error: 'Scenario not found' 
      }, { status: 404 });
    }

    // Validate scenario type if changed
    const validScenarioTypes = ['baseline', 'circular', 'optimized'];
    if (scenarioType && !validScenarioTypes.includes(scenarioType)) {
      return NextResponse.json({ 
        error: "Invalid scenario type. Must be: baseline, circular, or optimized",
        code: "INVALID_SCENARIO_TYPE" 
      }, { status: 422 });
    }

    // Validate reduction percentages
    if (co2ReductionPct !== undefined && (co2ReductionPct < 0 || co2ReductionPct > 100)) {
      return NextResponse.json({ 
        error: "CO2 reduction percentage must be between 0 and 100",
        code: "INVALID_CO2_REDUCTION" 
      }, { status: 400 });
    }

    if (costDifferencePct !== undefined && (costDifferencePct < -100 || costDifferencePct > 1000)) {
      return NextResponse.json({ 
        error: "Cost difference percentage must be between -100 and 1000",
        code: "INVALID_COST_DIFFERENCE" 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (scenarioType !== undefined) updateData.scenarioType = scenarioType;
    if (co2ReductionPct !== undefined) updateData.co2ReductionPct = co2ReductionPct;
    if (costDifferencePct !== undefined) updateData.costDifferencePct = costDifferencePct;

    // Update scenario
    const updated = await db.update(scenarios)
      .set(updateData)
      .where(eq(scenarios.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update scenario' 
      }, { status: 500 });
    }

    // Calculate new feasibility score if reduction percentages changed
    const updatedScenario = updated[0];
    const feasibilityScore = calculateFeasibilityScore(
      updatedScenario.co2ReductionPct,
      updatedScenario.costDifferencePct
    );

    return NextResponse.json({
      ...updatedScenario,
      feasibilityScore
    });
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

    // Check if scenario exists and get its details
    const existingScenario = await db.select()
      .from(scenarios)
      .where(eq(scenarios.id, parseInt(id)))
      .limit(1);

    if (existingScenario.length === 0) {
      return NextResponse.json({ 
        error: 'Scenario not found' 
      }, { status: 404 });
    }

    const scenario = existingScenario[0];

    // Business logic: Check if this is a baseline scenario with dependencies
    if (scenario.scenarioType === 'baseline') {
      const otherScenarios = await db.select()
        .from(scenarios)
        .where(and(
          eq(scenarios.assessmentId, scenario.assessmentId),
          ne(scenarios.id, parseInt(id))
        ));

      if (otherScenarios.length > 0) {
        return NextResponse.json({ 
          error: "Cannot delete baseline scenario when other scenarios depend on it",
          code: "BASELINE_SCENARIO_DEPENDENCY" 
        }, { status: 422 });
      }
    }

    // Delete scenario
    const deleted = await db.delete(scenarios)
      .where(eq(scenarios.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to delete scenario' 
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Scenario deleted successfully',
      deletedScenario: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

function calculateFeasibilityScore(co2ReductionPct: number | null, costDifferencePct: number | null): number | null {
  if (co2ReductionPct === null || costDifferencePct === null) {
    return null;
  }

  // Simple feasibility scoring: Higher CO2 reduction is better, lower cost increase is better
  const environmentalScore = Math.min(co2ReductionPct / 50 * 50, 50); // Max 50 points for environmental impact
  const economicScore = costDifferencePct <= 0 ? 50 : Math.max(50 - (costDifferencePct / 2), 0); // Max 50 points for economic feasibility

  return Math.round((environmentalScore + economicScore) * 100) / 100;
}

function generateRecommendations(
  scenarioType: string,
  co2ReductionPct: number | null,
  costDifferencePct: number | null,
  metalType: string | null
): string[] {
  const recommendations = [];

  if (scenarioType === 'baseline') {
    recommendations.push("Consider implementing circular economy practices to reduce environmental impact");
    recommendations.push("Evaluate opportunities for energy efficiency improvements");
  }

  if (scenarioType === 'circular') {
    recommendations.push("Focus on increasing recycled content percentage");
    recommendations.push("Implement waste reduction strategies throughout the supply chain");
    recommendations.push("Consider product life extension initiatives");
  }

  if (scenarioType === 'optimized') {
    recommendations.push("Monitor performance metrics closely during implementation");
    recommendations.push("Consider phased rollout to manage risks and costs");
  }

  if (co2ReductionPct !== null) {
    if (co2ReductionPct < 10) {
      recommendations.push("Consider more aggressive CO2 reduction targets to maximize environmental benefit");
    } else if (co2ReductionPct > 50) {
      recommendations.push("Excellent CO2 reduction target - ensure implementation plan is realistic");
    }
  }

  if (costDifferencePct !== null) {
    if (costDifferencePct > 25) {
      recommendations.push("High cost increase - consider cost mitigation strategies or phased implementation");
    } else if (costDifferencePct < 0) {
      recommendations.push("Cost-saving scenario - prioritize for immediate implementation");
    }
  }

  if (metalType) {
    if (metalType === 'aluminium') {
      recommendations.push("Focus on energy-intensive smelting process optimizations for aluminium");
    } else if (metalType === 'copper') {
      recommendations.push("Consider copper recovery from electronic waste streams");
    } else if (metalType === 'steel') {
      recommendations.push("Evaluate electric arc furnace adoption for steel production");
    }
  }

  return recommendations.length > 0 ? recommendations : ["Review scenario parameters and consider optimization opportunities"];
}