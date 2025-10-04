import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { assessments, materialData, processingData, transportationData, environmentalImpacts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');

    // Validate assessment ID
    if (!assessmentId || isNaN(parseInt(assessmentId))) {
      return NextResponse.json({ 
        error: "Valid assessment ID is required",
        code: "INVALID_ASSESSMENT_ID" 
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
        code: "ASSESSMENT_NOT_FOUND" 
      }, { status: 404 });
    }

    const metalType = assessment[0].metalType;

    // Fetch all required data for calculations
    const [materials, processing, transportation] = await Promise.all([
      db.select().from(materialData).where(eq(materialData.assessmentId, id)),
      db.select().from(processingData).where(eq(processingData.assessmentId, id)),
      db.select().from(transportationData).where(eq(transportationData.assessmentId, id))
    ]);

    // Validate sufficient data exists for calculations
    if (materials.length === 0 || processing.length === 0) {
      return NextResponse.json({ 
        error: 'Insufficient data for calculations. Assessment must have material and processing data.',
        code: "INSUFFICIENT_DATA" 
      }, { status: 422 });
    }

    // Define energy intensity factors (kWh/kg)
    const energyIntensity = {
      'aluminium': 17.5, // 15-20 kWh/kg
      'copper': 4,       // 3-5 kWh/kg
      'steel': 2         // 1.5-2.5 kWh/kg
    };

    // Define transportation emission factors (kg CO2/ton-km)
    const transportEmissionFactors = {
      'truck': 0.089,
      'rail': 0.022,
      'ship': 0.015
    };

    // Calculate total energy consumption
    const totalEnergyKwh = processing.reduce((sum, record) => {
      return sum + (record.energyConsumptionKwh || 0);
    }, 0);

    // Calculate total water usage
    const totalWaterM3 = processing.reduce((sum, record) => {
      return sum + (record.waterUsageM3 || 0);
    }, 0);

    // Calculate total waste
    const totalWasteTons = processing.reduce((sum, record) => {
      return sum + (record.wasteGenerationTons || 0);
    }, 0);

    // Calculate CO2 emissions from energy consumption
    const energyIntensityFactor = energyIntensity[metalType as keyof typeof energyIntensity] || 2;
    const totalMaterialQuantity = materials.reduce((sum, material) => {
      return sum + (material.quantityTons || 0);
    }, 0);

    // CO2 from material extraction and processing (based on energy intensity and material quantity)
    const materialExtractionCO2 = totalMaterialQuantity * energyIntensityFactor * 0.5; // 0.5 kg CO2/kWh average grid factor

    // CO2 from energy consumption in processing
    const processingCO2 = totalEnergyKwh * 0.5; // 0.5 kg CO2/kWh average grid factor

    // Calculate transportation CO2 emissions
    const transportationCO2 = transportation.reduce((sum, transport) => {
      const distanceKm = transport.distanceKm || 0;
      const loadCapacityTons = transport.loadCapacityTons || 0;
      const emissionFactor = transportEmissionFactors[transport.mode as keyof typeof transportEmissionFactors] || 0.089;
      
      return sum + (distanceKm * loadCapacityTons * emissionFactor / 1000); // Convert kg to tons
    }, 0);

    // Total CO2 emissions (in tons)
    const co2EmissionsTons = (materialExtractionCO2 + processingCO2) / 1000 + transportationCO2;

    // Check if environmental impacts record already exists
    const existingImpacts = await db.select()
      .from(environmentalImpacts)
      .where(eq(environmentalImpacts.assessmentId, id))
      .limit(1);

    const calculatedAt = new Date().toISOString();
    const now = new Date().toISOString();

    const impactData = {
      co2EmissionsTons: Math.round(co2EmissionsTons * 1000000) / 1000000, // Round to 6 decimal places
      totalEnergyKwh: Math.round(totalEnergyKwh * 100) / 100, // Round to 2 decimal places
      totalWaterM3: Math.round(totalWaterM3 * 100) / 100, // Round to 2 decimal places
      totalWasteTons: Math.round(totalWasteTons * 1000000) / 1000000, // Round to 6 decimal places
      calculatedAt,
      updatedAt: now
    };

    let result;
    let statusCode;

    if (existingImpacts.length > 0) {
      // Update existing record
      result = await db.update(environmentalImpacts)
        .set(impactData)
        .where(eq(environmentalImpacts.assessmentId, id))
        .returning();
      statusCode = 200;
    } else {
      // Insert new record
      result = await db.insert(environmentalImpacts)
        .values({
          assessmentId: id,
          ...impactData,
          createdAt: now
        })
        .returning();
      statusCode = 201;
    }

    // Update assessment status to 'completed' if it was 'draft' or 'in_progress'
    if (assessment[0].status !== 'completed') {
      await db.update(assessments)
        .set({
          status: 'completed',
          updatedAt: now
        })
        .where(eq(assessments.id, id));
    }

    return NextResponse.json(result[0], { status: statusCode });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}