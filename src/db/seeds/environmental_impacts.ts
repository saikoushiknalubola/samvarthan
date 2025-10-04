import { db } from '@/db';
import { environmentalImpacts } from '@/db/schema';

async function main() {
    const sampleImpacts = [
        {
            assessmentId: 1,
            co2EmissionsTons: 10.2,
            totalEnergyKwh: 18500.0,
            totalWaterM3: 395.5,
            totalWasteTons: 0.18,
            calculatedAt: new Date('2024-12-05T14:30:00Z').toISOString(),
            createdAt: new Date('2024-12-05T14:30:00Z').toISOString(),
            updatedAt: new Date('2024-12-05T14:30:00Z').toISOString(),
        },
        {
            assessmentId: 1,
            co2EmissionsTons: 11.8,
            totalEnergyKwh: 19200.0,
            totalWaterM3: 420.3,
            totalWasteTons: 0.22,
            calculatedAt: new Date('2024-12-03T09:15:00Z').toISOString(),
            createdAt: new Date('2024-12-03T09:15:00Z').toISOString(),
            updatedAt: new Date('2024-12-03T09:15:00Z').toISOString(),
        },
        {
            assessmentId: 2,
            co2EmissionsTons: 7.4,
            totalEnergyKwh: 5200.0,
            totalWaterM3: 310.8,
            totalWasteTons: 1.25,
            calculatedAt: new Date('2024-11-22T16:45:00Z').toISOString(),
            createdAt: new Date('2024-11-22T16:45:00Z').toISOString(),
            updatedAt: new Date('2024-11-22T16:45:00Z').toISOString(),
        },
        {
            assessmentId: 2,
            co2EmissionsTons: 8.1,
            totalEnergyKwh: 4800.0,
            totalWaterM3: 285.2,
            totalWasteTons: 1.35,
            calculatedAt: new Date('2024-11-18T11:20:00Z').toISOString(),
            createdAt: new Date('2024-11-18T11:20:00Z').toISOString(),
            updatedAt: new Date('2024-11-18T11:20:00Z').toISOString(),
        },
        {
            assessmentId: 3,
            co2EmissionsTons: 4.2,
            totalEnergyKwh: 2400.0,
            totalWaterM3: 32.5,
            totalWasteTons: 0.55,
            calculatedAt: new Date('2024-12-04T13:10:00Z').toISOString(),
            createdAt: new Date('2024-12-04T13:10:00Z').toISOString(),
            updatedAt: new Date('2024-12-04T13:10:00Z').toISOString(),
        },
        {
            assessmentId: 3,
            co2EmissionsTons: 3.8,
            totalEnergyKwh: 2650.0,
            totalWaterM3: 38.7,
            totalWasteTons: 0.62,
            calculatedAt: new Date('2024-12-06T10:25:00Z').toISOString(),
            createdAt: new Date('2024-12-06T10:25:00Z').toISOString(),
            updatedAt: new Date('2024-12-06T10:25:00Z').toISOString(),
        }
    ];

    await db.insert(environmentalImpacts).values(sampleImpacts);
    
    console.log('✅ Environmental impacts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});