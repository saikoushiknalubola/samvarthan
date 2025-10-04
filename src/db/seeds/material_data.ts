import { db } from '@/db';
import { materialData } from '@/db/schema';

async function main() {
    const sampleMaterialData = [
        // Aluminium Assessment (ID 1) materials
        {
            assessmentId: 1,
            oreType: 'Bauxite',
            oreGradePct: 48.5,
            moisturePct: 9.2,
            quantityTons: 750.0,
            extractionMethod: 'open_pit',
            recycledContentPct: 22.0,
            virginMaterialPct: 78.0,
            createdAt: new Date('2024-10-15').toISOString(),
            updatedAt: new Date('2024-10-15').toISOString(),
        },
        {
            assessmentId: 1,
            oreType: 'Bauxite',
            oreGradePct: 52.1,
            moisturePct: 11.5,
            quantityTons: 890.0,
            extractionMethod: 'open_pit',
            recycledContentPct: 18.5,
            virginMaterialPct: 81.5,
            createdAt: new Date('2024-10-20').toISOString(),
            updatedAt: new Date('2024-10-20').toISOString(),
        },
        {
            assessmentId: 1,
            oreType: 'Bauxite',
            oreGradePct: 46.8,
            moisturePct: 10.1,
            quantityTons: 625.0,
            extractionMethod: 'open_pit',
            recycledContentPct: 25.0,
            virginMaterialPct: 75.0,
            createdAt: new Date('2024-11-02').toISOString(),
            updatedAt: new Date('2024-11-02').toISOString(),
        },
        // Copper Assessment (ID 2) materials
        {
            assessmentId: 2,
            oreType: 'Chalcopyrite',
            oreGradePct: 1.2,
            moisturePct: 7.8,
            quantityTons: 2400.0,
            extractionMethod: 'underground',
            recycledContentPct: 35.0,
            virginMaterialPct: 65.0,
            createdAt: new Date('2024-10-08').toISOString(),
            updatedAt: new Date('2024-10-08').toISOString(),
        },
        {
            assessmentId: 2,
            oreType: 'Bornite',
            oreGradePct: 0.9,
            moisturePct: 8.5,
            quantityTons: 2850.0,
            extractionMethod: 'underground',
            recycledContentPct: 38.5,
            virginMaterialPct: 61.5,
            createdAt: new Date('2024-10-25').toISOString(),
            updatedAt: new Date('2024-10-25').toISOString(),
        },
        {
            assessmentId: 2,
            oreType: 'Chalcopyrite',
            oreGradePct: 1.4,
            moisturePct: 6.2,
            quantityTons: 2150.0,
            extractionMethod: 'underground',
            recycledContentPct: 32.0,
            virginMaterialPct: 68.0,
            createdAt: new Date('2024-11-10').toISOString(),
            updatedAt: new Date('2024-11-10').toISOString(),
        },
        // Steel Assessment (ID 3) materials
        {
            assessmentId: 3,
            oreType: 'Magnetite',
            oreGradePct: 62.5,
            moisturePct: 6.8,
            quantityTons: 1850.0,
            extractionMethod: 'recycled',
            recycledContentPct: 85.0,
            virginMaterialPct: 15.0,
            createdAt: new Date('2024-09-28').toISOString(),
            updatedAt: new Date('2024-09-28').toISOString(),
        },
        {
            assessmentId: 3,
            oreType: 'Hematite',
            oreGradePct: 64.2,
            moisturePct: 5.5,
            quantityTons: 2200.0,
            extractionMethod: 'recycled',
            recycledContentPct: 82.5,
            virginMaterialPct: 17.5,
            createdAt: new Date('2024-10-12').toISOString(),
            updatedAt: new Date('2024-10-12').toISOString(),
        },
        {
            assessmentId: 3,
            oreType: 'Magnetite',
            oreGradePct: 63.8,
            moisturePct: 7.2,
            quantityTons: 1950.0,
            extractionMethod: 'recycled',
            recycledContentPct: 88.0,
            virginMaterialPct: 12.0,
            createdAt: new Date('2024-11-18').toISOString(),
            updatedAt: new Date('2024-11-18').toISOString(),
        }
    ];

    await db.insert(materialData).values(sampleMaterialData);
    
    console.log('✅ Material data seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});