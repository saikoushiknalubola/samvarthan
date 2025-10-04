import { db } from '@/db';
import { scenarios } from '@/db/schema';

async function main() {
    const sampleScenarios = [
        // Aluminium Assessment (ID 1) scenarios
        {
            assessmentId: 1,
            name: 'Current Linear Production',
            description: 'Traditional aluminium production using virgin bauxite ore with conventional energy sources. No circular economy interventions implemented.',
            scenarioType: 'baseline',
            co2ReductionPct: 0.0,
            costDifferencePct: 0.0,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            assessmentId: 1,
            name: 'Increased Recycling & Renewable Energy',
            description: 'Enhanced aluminium recycling from post-consumer waste combined with 60% renewable electricity for smelting operations.',
            scenarioType: 'circular',
            co2ReductionPct: 40.5,
            costDifferencePct: 12.5,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            assessmentId: 1,
            name: 'Full Circular Economy Implementation',
            description: 'Complete circular system with 85% recycled content, 100% renewable energy, and closed-loop manufacturing processes.',
            scenarioType: 'optimized',
            co2ReductionPct: 60.2,
            costDifferencePct: 6.8,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        // Copper Assessment (ID 2) scenarios
        {
            assessmentId: 2,
            name: 'Traditional Mining & Processing',
            description: 'Conventional copper extraction from low-grade ores using standard mining and processing techniques without circular interventions.',
            scenarioType: 'baseline',
            co2ReductionPct: 0.0,
            costDifferencePct: 0.0,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            assessmentId: 2,
            name: 'Enhanced Recycling from E-Waste',
            description: 'Systematic recovery of copper from electronic waste streams with improved pyrometallurgical and hydrometallurgical processes.',
            scenarioType: 'circular',
            co2ReductionPct: 45.3,
            costDifferencePct: 7.8,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            assessmentId: 2,
            name: 'Closed-Loop Copper Economy',
            description: 'Fully integrated circular system with urban mining, bioleaching technologies, and 90% material recovery rates from end-of-life products.',
            scenarioType: 'optimized',
            co2ReductionPct: 65.7,
            costDifferencePct: -3.2,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        // Steel Assessment (ID 3) scenarios
        {
            assessmentId: 3,
            name: 'Current Steel Production Mix',
            description: 'Traditional steel production using 70% blast furnace and 30% electric arc furnace with standard coking coal and grid electricity.',
            scenarioType: 'baseline',
            co2ReductionPct: 0.0,
            costDifferencePct: 0.0,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            assessmentId: 3,
            name: 'Scrap-Based Electric Arc Furnace',
            description: 'Transition to 80% scrap-based steel production using electric arc furnaces with improved energy efficiency and scrap sorting technologies.',
            scenarioType: 'circular',
            co2ReductionPct: 50.1,
            costDifferencePct: 10.2,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            assessmentId: 3,
            name: 'Green Hydrogen Steel Production',
            description: 'Revolutionary direct reduction using green hydrogen with renewable electricity, eliminating coal dependency and maximizing scrap utilization.',
            scenarioType: 'optimized',
            co2ReductionPct: 75.4,
            costDifferencePct: 17.6,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
    ];

    await db.insert(scenarios).values(sampleScenarios);
    
    console.log('✅ Scenarios seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});