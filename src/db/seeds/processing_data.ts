import { db } from '@/db';
import { processingData } from '@/db/schema';

async function main() {
    const sampleProcessingData = [
        // Aluminium Assessment (Assessment ID 1) - High energy intensity
        {
            assessmentId: 1,
            energySource: 'grid_electricity',
            energyConsumptionKwh: 16500.0,
            equipmentEfficiencyPct: 78.5,
            wasteGenerationTons: 0.15,
            waterUsageM3: 380.0,
            processType: 'smelting',
            aiEstimated: false,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            assessmentId: 1,
            energySource: 'renewable',
            energyConsumptionKwh: 2500.0,
            equipmentEfficiencyPct: 82.0,
            wasteGenerationTons: 0.08,
            waterUsageM3: 75.0,
            processType: 'refining',
            aiEstimated: true,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },

        // Copper Assessment (Assessment ID 2) - Medium energy intensity
        {
            assessmentId: 2,
            energySource: 'grid_electricity',
            energyConsumptionKwh: 320.0,
            equipmentEfficiencyPct: 75.0,
            wasteGenerationTons: 1.0,
            waterUsageM3: 32.0,
            processType: 'crushing',
            aiEstimated: false,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            assessmentId: 2,
            energySource: 'natural_gas',
            energyConsumptionKwh: 3800.0,
            equipmentEfficiencyPct: 72.5,
            wasteGenerationTons: 0.4,
            waterUsageM3: 320.0,
            processType: 'smelting',
            aiEstimated: false,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            assessmentId: 2,
            energySource: 'grid_electricity',
            energyConsumptionKwh: 650.0,
            equipmentEfficiencyPct: 78.0,
            wasteGenerationTons: 0.15,
            waterUsageM3: 45.0,
            processType: 'refining',
            aiEstimated: true,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },

        // Steel Assessment (Assessment ID 3) - Lower energy intensity due to recycling
        {
            assessmentId: 3,
            energySource: 'grid_electricity',
            energyConsumptionKwh: 200.0,
            equipmentEfficiencyPct: 85.0,
            wasteGenerationTons: 0.25,
            waterUsageM3: 15.0,
            processType: 'grinding',
            aiEstimated: false,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            assessmentId: 3,
            energySource: 'renewable',
            energyConsumptionKwh: 2000.0,
            equipmentEfficiencyPct: 88.5,
            wasteGenerationTons: 0.4,
            waterUsageM3: 20.0,
            processType: 'smelting',
            aiEstimated: false,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        }
    ];

    await db.insert(processingData).values(sampleProcessingData);
    
    console.log('✅ Processing data seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});