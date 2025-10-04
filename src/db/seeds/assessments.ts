import { db } from '@/db';
import { assessments } from '@/db/schema';

async function main() {
    const sampleAssessments = [
        {
            projectName: 'Sustainable Aluminium Smelting LCA Study',
            metalType: 'aluminium',
            status: 'completed',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-03-20').toISOString(),
        },
        {
            projectName: 'Circular Copper Supply Chain Assessment',
            metalType: 'copper',
            status: 'in_progress',
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: new Date('2024-04-05').toISOString(),
        },
        {
            projectName: 'Green Steel Production Feasibility Study',
            metalType: 'steel',
            status: 'draft',
            createdAt: new Date('2024-03-25').toISOString(),
            updatedAt: new Date('2024-03-25').toISOString(),
        }
    ];

    await db.insert(assessments).values(sampleAssessments);
    
    console.log('✅ Assessments seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});