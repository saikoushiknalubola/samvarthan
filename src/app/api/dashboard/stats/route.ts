import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { 
  assessments, 
  environmentalImpacts, 
  circularityMetrics,
  materialData,
  processingData
} from '@/db/schema';
import { desc, sql, eq } from 'drizzle-orm';

// Real-time dashboard statistics endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metalType = searchParams.get('metal_type');
    const timeRange = searchParams.get('time_range') || '30d'; // 7d, 30d, 90d, all

    // Get time filter
    const now = new Date();
    let startDate = new Date(0); // Beginning of time
    if (timeRange === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (timeRange === '90d') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }

    // Get all assessments for the period
    let assessmentsQuery = db.select()
      .from(assessments)
      .where(sql`${assessments.createdAt} >= ${startDate.toISOString()}`);

    if (metalType) {
      assessmentsQuery = db.select()
        .from(assessments)
        .where(sql`${assessments.metalType} = ${metalType} AND ${assessments.createdAt} >= ${startDate.toISOString()}`);
    }

    const allAssessments = await assessmentsQuery;
    const assessmentIds = allAssessments.map(a => a.id);

    if (assessmentIds.length === 0) {
      return NextResponse.json({
        totalProjects: 0,
        completedProjects: 0,
        aggregateMetrics: {
          totalCO2Tons: 0,
          totalEnergyKwh: 0,
          totalWaterM3: 0,
          totalWasteTons: 0,
          avgCircularityScore: 0,
          avgRecyclingRate: 0
        },
        trends: {
          co2Trend: 0,
          energyTrend: 0,
          waterTrend: 0,
          wasteTrend: 0
        },
        metalTypeBreakdown: {},
        topPerformers: [],
        recentActivity: []
      });
    }

    // Get environmental impacts
    const impacts = await db.select()
      .from(environmentalImpacts)
      .where(sql`${environmentalImpacts.assessmentId} IN (${sql.join(assessmentIds, sql`, `)})`);

    // Get circularity metrics
    const circularityData = await db.select()
      .from(circularityMetrics)
      .where(sql`${circularityMetrics.assessmentId} IN (${sql.join(assessmentIds, sql`, `)})`);

    // Get material data for recycling rates
    const materials = await db.select()
      .from(materialData)
      .where(sql`${materialData.assessmentId} IN (${sql.join(assessmentIds, sql`, `)})`);

    // Calculate aggregate metrics
    const totalCO2 = impacts.reduce((sum, i) => sum + (i.co2EmissionsTons || 0), 0);
    const totalEnergy = impacts.reduce((sum, i) => sum + (i.totalEnergyKwh || 0), 0);
    const totalWater = impacts.reduce((sum, i) => sum + (i.totalWaterM3 || 0), 0);
    const totalWaste = impacts.reduce((sum, i) => sum + (i.totalWasteTons || 0), 0);

    const avgMCI = circularityData.length > 0
      ? circularityData.reduce((sum, c) => sum + (c.mciScore || 0), 0) / circularityData.length
      : 0;

    const avgRecycling = materials.length > 0
      ? materials.reduce((sum, m) => sum + (m.recycledContentPct || 0), 0) / materials.length
      : 0;

    // Calculate trends (compare to previous period)
    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousImpacts = await db.select()
      .from(environmentalImpacts)
      .where(sql`${environmentalImpacts.calculatedAt} >= ${previousPeriodStart.toISOString()} AND ${environmentalImpacts.calculatedAt} < ${startDate.toISOString()}`);

    const prevCO2 = previousImpacts.reduce((sum, i) => sum + (i.co2EmissionsTons || 0), 0);
    const prevEnergy = previousImpacts.reduce((sum, i) => sum + (i.totalEnergyKwh || 0), 0);
    const prevWater = previousImpacts.reduce((sum, i) => sum + (i.totalWaterM3 || 0), 0);
    const prevWaste = previousImpacts.reduce((sum, i) => sum + (i.totalWasteTons || 0), 0);

    const co2Trend = prevCO2 > 0 ? ((totalCO2 - prevCO2) / prevCO2) * 100 : 0;
    const energyTrend = prevEnergy > 0 ? ((totalEnergy - prevEnergy) / prevEnergy) * 100 : 0;
    const waterTrend = prevWater > 0 ? ((totalWater - prevWater) / prevWater) * 100 : 0;
    const wasteTrend = prevWaste > 0 ? ((totalWaste - prevWaste) / prevWaste) * 100 : 0;

    // Metal type breakdown
    const metalBreakdown: Record<string, any> = {};
    for (const assessment of allAssessments) {
      if (!metalBreakdown[assessment.metalType]) {
        metalBreakdown[assessment.metalType] = {
          count: 0,
          co2: 0,
          energy: 0,
          water: 0,
          waste: 0
        };
      }
      metalBreakdown[assessment.metalType].count++;
      
      const impact = impacts.find(i => i.assessmentId === assessment.id);
      if (impact) {
        metalBreakdown[assessment.metalType].co2 += impact.co2EmissionsTons || 0;
        metalBreakdown[assessment.metalType].energy += impact.totalEnergyKwh || 0;
        metalBreakdown[assessment.metalType].water += impact.totalWaterM3 || 0;
        metalBreakdown[assessment.metalType].waste += impact.totalWasteTons || 0;
      }
    }

    // Top performers (lowest CO2 per ton)
    const topPerformers = await Promise.all(
      allAssessments.slice(0, 5).map(async (assessment) => {
        const impact = impacts.find(i => i.assessmentId === assessment.id);
        const circularity = circularityData.find(c => c.assessmentId === assessment.id);
        const material = materials.find(m => m.assessmentId === assessment.id);
        
        const co2PerTon = impact && material?.quantityTons 
          ? (impact.co2EmissionsTons || 0) / material.quantityTons 
          : 0;

        return {
          projectName: assessment.projectName,
          metalType: assessment.metalType,
          co2PerTon: Math.round(co2PerTon * 100) / 100,
          mciScore: circularity?.mciScore || 0,
          status: assessment.status
        };
      })
    );

    // Sort by CO2 per ton (ascending - lower is better)
    topPerformers.sort((a, b) => a.co2PerTon - b.co2PerTon);

    // Recent activity
    const recentActivity = allAssessments
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
      .map(assessment => ({
        id: assessment.id,
        projectName: assessment.projectName,
        metalType: assessment.metalType,
        status: assessment.status,
        updatedAt: assessment.updatedAt
      }));

    const completedCount = allAssessments.filter(a => a.status === 'completed').length;

    return NextResponse.json({
      totalProjects: allAssessments.length,
      completedProjects: completedCount,
      aggregateMetrics: {
        totalCO2Tons: Math.round(totalCO2 * 100) / 100,
        totalEnergyKwh: Math.round(totalEnergy),
        totalWaterM3: Math.round(totalWater),
        totalWasteTons: Math.round(totalWaste * 100) / 100,
        avgCircularityScore: Math.round(avgMCI * 100) / 100,
        avgRecyclingRate: Math.round(avgRecycling * 10) / 10
      },
      trends: {
        co2Trend: Math.round(co2Trend * 10) / 10,
        energyTrend: Math.round(energyTrend * 10) / 10,
        waterTrend: Math.round(waterTrend * 10) / 10,
        wasteTrend: Math.round(wasteTrend * 10) / 10
      },
      metalTypeBreakdown: metalBreakdown,
      topPerformers: topPerformers.slice(0, 5),
      recentActivity,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}
