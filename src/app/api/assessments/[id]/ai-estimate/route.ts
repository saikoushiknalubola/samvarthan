import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { assessments, materialData, processingData, transportationData } from '@/db/schema';
import { eq, and, isNull, or } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const assessmentId = searchParams.get('id');

    // Validate assessment ID
    if (!assessmentId || isNaN(parseInt(assessmentId))) {
      return NextResponse.json({ 
        error: "Valid assessment ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const id = parseInt(assessmentId);

    // Check if assessment exists
    const assessment = await db.select()
      .from(assessments)
      .where(eq(assessments.id, id))
      .limit(1);

    if (assessment.length === 0) {
      return NextResponse.json({ 
        error: 'Assessment not found',
        code: 'ASSESSMENT_NOT_FOUND' 
      }, { status: 404 });
    }

    const metalType = assessment[0].metalType.toLowerCase();

    // Get all data records for the assessment with missing values
    const [materials, processing, transportation] = await Promise.all([
      db.select().from(materialData).where(eq(materialData.assessmentId, id)),
      db.select().from(processingData).where(eq(processingData.assessmentId, id)),
      db.select().from(transportationData).where(eq(transportationData.assessmentId, id))
    ]);

    // AI estimation benchmarks by metal type
    const benchmarks = {
      aluminium: {
        energyConsumption: { min: 15000, max: 18000 }, // kWh/ton
        waterUsage: { min: 300, max: 500 }, // m3/ton
        wasteGeneration: { min: 0.1, max: 0.2 } // tons/ton
      },
      copper: {
        energyConsumption: { min: 3000, max: 4500 },
        waterUsage: { min: 200, max: 400 },
        wasteGeneration: { min: 0.8, max: 1.2 }
      },
      steel: {
        energyConsumption: { min: 1800, max: 2200 },
        waterUsage: { min: 15, max: 25 },
        wasteGeneration: { min: 0.3, max: 0.5 }
      }
    };

    if (!benchmarks[metalType]) {
      return NextResponse.json({ 
        error: `Unsupported metal type: ${metalType}`,
        code: "UNSUPPORTED_METAL_TYPE" 
      }, { status: 400 });
    }

    const benchmark = benchmarks[metalType];
    let estimatedCount = 0;
    const estimatedFields = new Set<string>();

    // Helper function to calculate estimation factors
    const getEstimationFactors = (material: any) => {
      let oreFactor = 1.0;
      let extractionFactor = 1.0;
      let efficiencyFactor = 1.0;

      // Ore grade factor (lower grade = higher consumption)
      if (material.oreGradePct) {
        if (material.oreGradePct < 1.0) oreFactor = 1.3;
        else if (material.oreGradePct < 2.0) oreFactor = 1.15;
        else if (material.oreGradePct > 5.0) oreFactor = 0.85;
      }

      // Extraction method factor
      if (material.extractionMethod) {
        switch (material.extractionMethod) {
          case 'recycled': extractionFactor = 0.3; break;
          case 'underground': extractionFactor = 1.2; break;
          case 'open_pit': extractionFactor = 1.0; break;
          default: extractionFactor = 1.0;
        }
      }

      return { oreFactor, extractionFactor, efficiencyFactor };
    };

    // Helper function to estimate value within range
    const estimateValue = (min: number, max: number, factors: any) => {
      const baseFactor = factors.oreFactor * factors.extractionFactor * factors.efficiencyFactor;
      const baseValue = min + (max - min) * 0.6; // Use 60th percentile as baseline
      return Math.round(baseValue * baseFactor * 100) / 100;
    };

    // Process each processing data record
    for (const record of processing) {
      const material = materials.find(m => m.assessmentId === id);
      const factors = getEstimationFactors(material || {});
      
      const updates: any = {};
      let hasUpdates = false;

      // Estimate energy consumption
      if (record.energyConsumptionKwh === null) {
        updates.energyConsumptionKwh = estimateValue(
          benchmark.energyConsumption.min,
          benchmark.energyConsumption.max,
          factors
        );
        estimatedFields.add('energyConsumptionKwh');
        hasUpdates = true;
      }

      // Estimate water usage
      if (record.waterUsageM3 === null) {
        updates.waterUsageM3 = estimateValue(
          benchmark.waterUsage.min,
          benchmark.waterUsage.max,
          factors
        );
        estimatedFields.add('waterUsageM3');
        hasUpdates = true;
      }

      // Estimate waste generation
      if (record.wasteGenerationTons === null) {
        const quantityTons = material?.quantityTons || 1.0;
        const wastePerTon = estimateValue(
          benchmark.wasteGeneration.min,
          benchmark.wasteGeneration.max,
          factors
        );
        updates.wasteGenerationTons = Math.round(wastePerTon * quantityTons * 100) / 100;
        estimatedFields.add('wasteGenerationTons');
        hasUpdates = true;
      }

      // Estimate equipment efficiency if not provided
      if (record.equipmentEfficiencyPct === null) {
        // Base efficiency varies by extraction method
        let baseEfficiency = 75; // Default 75%
        if (material?.extractionMethod === 'recycled') baseEfficiency = 85;
        else if (material?.extractionMethod === 'underground') baseEfficiency = 70;
        
        updates.equipmentEfficiencyPct = baseEfficiency + Math.random() * 10 - 5; // ±5% variation
        estimatedFields.add('equipmentEfficiencyPct');
        hasUpdates = true;
      }

      if (hasUpdates) {
        updates.aiEstimated = true;
        updates.updatedAt = new Date().toISOString();

        await db.update(processingData)
          .set(updates)
          .where(eq(processingData.id, record.id));
        
        estimatedCount++;
      }
    }

    // Calculate confidence score based on data completeness
    const totalRecords = processing.length;
    const recordsWithMissingData = processing.filter(record => 
      record.energyConsumptionKwh === null || 
      record.waterUsageM3 === null || 
      record.wasteGenerationTons === null ||
      record.equipmentEfficiencyPct === null
    ).length;

    let confidenceScore = 0.9; // Start with high confidence

    // Reduce confidence based on missing supporting data
    if (!materials.length) confidenceScore -= 0.1;
    if (materials.some(m => !m.oreGradePct)) confidenceScore -= 0.05;
    if (materials.some(m => !m.extractionMethod)) confidenceScore -= 0.05;
    if (recordsWithMissingData > totalRecords * 0.5) confidenceScore -= 0.1;

    // Ensure confidence score is within range
    confidenceScore = Math.max(0.7, Math.min(0.9, confidenceScore));
    confidenceScore = Math.round(confidenceScore * 100) / 100;

    return NextResponse.json({
      estimated_count: estimatedCount,
      estimated_fields: Array.from(estimatedFields),
      confidence_score: confidenceScore
    }, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}