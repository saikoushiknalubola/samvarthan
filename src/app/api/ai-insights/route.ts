import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { 
  assessments, 
  environmentalImpacts, 
  circularityMetrics,
  materialData,
  processingData
} from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// AI-Powered Insights Generation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessment_id');

    if (!assessmentId || isNaN(parseInt(assessmentId))) {
      return NextResponse.json({ 
        error: "Valid assessment ID is required",
        code: "INVALID_ASSESSMENT_ID" 
      }, { status: 400 });
    }

    const id = parseInt(assessmentId);

    // Fetch assessment and related data
    const [assessment] = await db.select()
      .from(assessments)
      .where(eq(assessments.id, id))
      .limit(1);

    if (!assessment) {
      return NextResponse.json({ 
        error: 'Assessment not found' 
      }, { status: 404 });
    }

    const [impacts, circularity, materials, processing] = await Promise.all([
      db.select().from(environmentalImpacts).where(eq(environmentalImpacts.assessmentId, id)).limit(1),
      db.select().from(circularityMetrics).where(eq(circularityMetrics.assessmentId, id)).limit(1),
      db.select().from(materialData).where(eq(materialData.assessmentId, id)),
      db.select().from(processingData).where(eq(processingData.assessmentId, id))
    ]);

    const impact = impacts[0];
    const circularityData = circularity[0];

    // Generate AI insights based on data
    const insights: any[] = [];
    let overallScore = 0;
    let scoreCount = 0;

    // Industry benchmarks by metal type
    const benchmarks: Record<string, any> = {
      aluminium: { 
        co2: 11.5, 
        energy: 15500, 
        water: 1500, 
        waste: 0.15,
        recyclingRate: 65
      },
      copper: { 
        co2: 4.2, 
        energy: 3800, 
        water: 350, 
        waste: 1.0,
        recyclingRate: 55
      },
      steel: { 
        co2: 2.3, 
        energy: 2000, 
        water: 100, 
        waste: 0.4,
        recyclingRate: 70
      }
    };

    const metalType = assessment.metalType.toLowerCase();
    const benchmark = benchmarks[metalType];

    if (!benchmark || !impact) {
      return NextResponse.json({
        insights: [],
        overallScore: 0,
        priorityActions: [],
        predictions: {}
      });
    }

    // Analyze CO2 emissions
    if (impact.co2EmissionsTons) {
      const totalMaterial = materials.reduce((sum, m) => sum + (m.quantityTons || 0), 0);
      if (totalMaterial > 0) {
        const co2PerTon = impact.co2EmissionsTons / totalMaterial;
        const ratio = co2PerTon / benchmark.co2;
        
        if (ratio > 1.2) {
          insights.push({
            category: 'emissions',
            severity: 'high',
            title: 'High Carbon Emissions Detected',
            description: `Your CO₂ emissions are ${((ratio - 1) * 100).toFixed(1)}% above industry benchmarks for ${metalType}.`,
            recommendation: 'Implement renewable energy sources, optimize combustion processes, and increase recycled material content to reduce emissions.',
            potentialSavings: `Reduce by ${(impact.co2EmissionsTons * 0.3).toFixed(0)} tCO₂e annually`,
            impact: 'high',
            confidence: 0.92
          });
          overallScore += 40;
        } else if (ratio > 1.0) {
          insights.push({
            category: 'emissions',
            severity: 'medium',
            title: 'CO₂ Emissions Above Target',
            description: `Emissions are ${((ratio - 1) * 100).toFixed(1)}% above optimal levels.`,
            recommendation: 'Consider energy efficiency upgrades and process optimization.',
            potentialSavings: `Reduce by ${(impact.co2EmissionsTons * 0.15).toFixed(0)} tCO₂e annually`,
            impact: 'medium',
            confidence: 0.88
          });
          overallScore += 65;
        } else {
          insights.push({
            category: 'emissions',
            severity: 'low',
            title: 'Excellent Carbon Performance',
            description: `Your emissions are ${((1 - ratio) * 100).toFixed(1)}% below industry average.`,
            recommendation: 'Maintain current practices and explore carbon credit opportunities.',
            potentialSavings: 'Carbon credit potential',
            impact: 'positive',
            confidence: 0.95
          });
          overallScore += 90;
        }
        scoreCount++;
      }
    }

    // Analyze Energy Efficiency
    if (impact.totalEnergyKwh) {
      const totalMaterial = materials.reduce((sum, m) => sum + (m.quantityTons || 0), 0);
      if (totalMaterial > 0) {
        const energyPerTon = impact.totalEnergyKwh / totalMaterial;
        const ratio = energyPerTon / benchmark.energy;
        
        if (ratio > 1.15) {
          insights.push({
            category: 'energy',
            severity: 'high',
            title: 'Energy Efficiency Improvement Needed',
            description: `Energy consumption is ${((ratio - 1) * 100).toFixed(1)}% above industry standards.`,
            recommendation: 'Upgrade to high-efficiency equipment, implement waste heat recovery, and optimize process scheduling.',
            potentialSavings: `Save ${(impact.totalEnergyKwh * 0.25).toFixed(0)} kWh annually`,
            impact: 'high',
            confidence: 0.89
          });
          overallScore += 50;
        } else {
          insights.push({
            category: 'energy',
            severity: 'low',
            title: 'Good Energy Efficiency',
            description: 'Energy consumption is within acceptable range.',
            recommendation: 'Continue monitoring and explore renewable energy integration.',
            potentialSavings: 'Optimization potential available',
            impact: 'medium',
            confidence: 0.85
          });
          overallScore += 75;
        }
        scoreCount++;
      }
    }

    // Analyze Circularity
    if (circularityData) {
      const mciScore = circularityData.mciScore || 0;
      
      if (mciScore < 0.5) {
        insights.push({
          category: 'circularity',
          severity: 'high',
          title: 'Low Circularity Score',
          description: `Material Circularity Index of ${mciScore.toFixed(2)} indicates significant linear economy practices.`,
          recommendation: 'Increase recycled content, design for recyclability, and establish take-back programs.',
          potentialSavings: `Improve MCI to ${(mciScore + 0.3).toFixed(2)} achievable`,
          impact: 'high',
          confidence: 0.91
        });
        overallScore += 45;
      } else if (mciScore < 0.7) {
        insights.push({
          category: 'circularity',
          severity: 'medium',
          title: 'Moderate Circularity Performance',
          description: `MCI score of ${mciScore.toFixed(2)} shows room for circular economy improvements.`,
          recommendation: 'Enhance material recovery systems and increase recycled feedstock.',
          potentialSavings: `Improve MCI to ${(mciScore + 0.2).toFixed(2)}`,
          impact: 'medium',
          confidence: 0.87
        });
        overallScore += 70;
      } else {
        insights.push({
          category: 'circularity',
          severity: 'low',
          title: 'Strong Circular Economy Practices',
          description: `Excellent MCI score of ${mciScore.toFixed(2)} demonstrates circular economy leadership.`,
          recommendation: 'Share best practices and explore advanced circular models.',
          potentialSavings: 'Industry leadership opportunity',
          impact: 'positive',
          confidence: 0.94
        });
        overallScore += 95;
      }
      scoreCount++;
    }

    // Analyze Recycling Rates
    const avgRecycling = materials.length > 0
      ? materials.reduce((sum, m) => sum + (m.recycledContentPct || 0), 0) / materials.length
      : 0;

    if (avgRecycling < benchmark.recyclingRate) {
      insights.push({
        category: 'recycling',
        severity: 'medium',
        title: 'Increase Recycled Material Content',
        description: `Current recycling rate of ${avgRecycling.toFixed(1)}% is below the ${benchmark.recyclingRate}% industry target for ${metalType}.`,
        recommendation: 'Source more recycled feedstock, establish partnerships with recycling facilities, and optimize sorting processes.',
        potentialSavings: `Increase to ${benchmark.recyclingRate}% saves energy and reduces virgin material costs`,
        impact: 'high',
        confidence: 0.90
      });
      overallScore += 55;
    } else {
      insights.push({
        category: 'recycling',
        severity: 'low',
        title: 'Excellent Recycling Performance',
        description: `Recycling rate of ${avgRecycling.toFixed(1)}% exceeds industry standards.`,
        recommendation: 'Maintain high standards and explore closed-loop systems.',
        potentialSavings: 'Best practice achieved',
        impact: 'positive',
        confidence: 0.93
      });
      overallScore += 92;
    }
    scoreCount++;

    // Calculate final score
    const finalScore = scoreCount > 0 ? Math.round(overallScore / scoreCount) : 0;

    // Generate priority actions
    const highPriorityInsights = insights.filter(i => i.severity === 'high');
    const priorityActions = highPriorityInsights.map(insight => ({
      action: insight.title,
      description: insight.recommendation,
      expectedImpact: insight.potentialSavings,
      timeline: '3-6 months',
      complexity: insight.impact === 'high' ? 'medium' : 'low'
    }));

    // Add general recommendations if score is low
    if (finalScore < 70) {
      priorityActions.push({
        action: 'Comprehensive Process Audit',
        description: 'Conduct detailed assessment of all processes to identify optimization opportunities.',
        expectedImpact: '15-25% overall improvement potential',
        timeline: '1-2 months',
        complexity: 'low'
      });
    }

    // Generate predictions
    const predictions = {
      nextQuarterCO2: impact.co2EmissionsTons ? 
        Math.round(impact.co2EmissionsTons * (1 - (finalScore > 70 ? 0.05 : 0.02))) : 0,
      energySavingsPotential: impact.totalEnergyKwh ? 
        Math.round(impact.totalEnergyKwh * (finalScore > 70 ? 0.10 : 0.20)) : 0,
      circularityImprovementPotential: circularityData?.mciScore ?
        Math.min(1.0, circularityData.mciScore + (finalScore > 70 ? 0.05 : 0.15)) : 0,
      costSavingsEstimate: impact.totalEnergyKwh ?
        Math.round((impact.totalEnergyKwh * 0.12 * 0.15) + (impact.co2EmissionsTons || 0) * 50) : 0
    };

    return NextResponse.json({
      insights: insights.sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return (severityOrder[a.severity] || 3) - (severityOrder[b.severity] || 3);
      }),
      overallScore: finalScore,
      scoreGrade: finalScore >= 90 ? 'Excellent' : 
                  finalScore >= 75 ? 'Good' : 
                  finalScore >= 60 ? 'Fair' : 'Needs Improvement',
      priorityActions,
      predictions,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Insights error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}
