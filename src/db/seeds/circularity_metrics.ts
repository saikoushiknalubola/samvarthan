import { db } from '@/db';
import { circularityMetrics } from '@/db/schema';

async function main() {
    const sampleCircularityMetrics = [
        // Aluminium Assessment (ID 1) - GOOD circular performance
        {
            assessmentId: 1,
            mciScore: 0.65,
            recyclingPotentialPct: 88.5,
            resourceEfficiencyScore: 7.2,
            extendedProductLifeYears: 32.0,
            reusePotentialPct: 68.0,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            assessmentId: 1,
            mciScore: 0.62,
            recyclingPotentialPct: 91.2,
            resourceEfficiencyScore: 7.8,
            extendedProductLifeYears: 38.5,
            reusePotentialPct: 72.5,
            createdAt: new Date('2024-01-16').toISOString(),
            updatedAt: new Date('2024-01-16').toISOString(),
        },
        // Copper Assessment (ID 2) - EXCELLENT circular performance
        {
            assessmentId: 2,
            mciScore: 0.79,
            recyclingPotentialPct: 94.8,
            resourceEfficiencyScore: 8.4,
            extendedProductLifeYears: 75.0,
            reusePotentialPct: 85.2,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            assessmentId: 2,
            mciScore: 0.82,
            recyclingPotentialPct: 96.7,
            resourceEfficiencyScore: 8.9,
            extendedProductLifeYears: 88.5,
            reusePotentialPct: 87.8,
            createdAt: new Date('2024-01-21').toISOString(),
            updatedAt: new Date('2024-01-21').toISOString(),
        },
        // Steel Assessment (ID 3) - FAIR circular performance
        {
            assessmentId: 3,
            mciScore: 0.45,
            recyclingPotentialPct: 76.3,
            resourceEfficiencyScore: 6.1,
            extendedProductLifeYears: 42.0,
            reusePotentialPct: 58.5,
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: new Date('2024-01-25').toISOString(),
        },
        {
            assessmentId: 3,
            mciScore: 0.48,
            recyclingPotentialPct: 81.7,
            resourceEfficiencyScore: 6.8,
            extendedProductLifeYears: 45.5,
            reusePotentialPct: 64.2,
            createdAt: new Date('2024-01-26').toISOString(),
            updatedAt: new Date('2024-01-26').toISOString(),
        },
        // Additional varied samples for testing
        {
            assessmentId: 1,
            mciScore: 0.58,
            recyclingPotentialPct: 85.9,
            resourceEfficiencyScore: 7.0,
            extendedProductLifeYears: 28.5,
            reusePotentialPct: 65.8,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            assessmentId: 2,
            mciScore: 0.77,
            recyclingPotentialPct: 92.4,
            resourceEfficiencyScore: 8.1,
            extendedProductLifeYears: 65.8,
            reusePotentialPct: 82.3,
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: new Date('2024-02-05').toISOString(),
        },
    ];

    await db.insert(circularityMetrics).values(sampleCircularityMetrics);
    
    console.log('✅ Circularity metrics seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});