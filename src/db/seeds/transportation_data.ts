import { db } from '@/db';
import { transportationData } from '@/db/schema';

async function main() {
    const sampleTransportationData = [
        // Aluminium Assessment (ID 1) - Truck transport
        {
            assessmentId: 1,
            distanceKm: 185.5,
            mode: 'truck',
            fuelType: 'diesel',
            loadCapacityTons: 28.5,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            assessmentId: 1,
            distanceKm: 245.3,
            mode: 'truck',
            fuelType: 'diesel',
            loadCapacityTons: 32.0,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        // Aluminium Assessment (ID 1) - Rail transport
        {
            assessmentId: 1,
            distanceKm: 950.0,
            mode: 'rail',
            fuelType: 'electric',
            loadCapacityTons: 95.5,
            createdAt: new Date('2024-01-16').toISOString(),
            updatedAt: new Date('2024-01-16').toISOString(),
        },
        {
            assessmentId: 1,
            distanceKm: 1125.7,
            mode: 'rail',
            fuelType: 'diesel',
            loadCapacityTons: 110.2,
            createdAt: new Date('2024-01-16').toISOString(),
            updatedAt: new Date('2024-01-16').toISOString(),
        },
        // Aluminium Assessment (ID 1) - Ship transport
        {
            assessmentId: 1,
            distanceKm: 3200.0,
            mode: 'ship',
            fuelType: 'marine_diesel',
            loadCapacityTons: 750.0,
            createdAt: new Date('2024-01-17').toISOString(),
            updatedAt: new Date('2024-01-17').toISOString(),
        },
        {
            assessmentId: 1,
            distanceKm: 4500.5,
            mode: 'ship',
            fuelType: 'LNG',
            loadCapacityTons: 920.8,
            createdAt: new Date('2024-01-17').toISOString(),
            updatedAt: new Date('2024-01-17').toISOString(),
        },
        // Copper Assessment (ID 2) - Truck transport (mine to processing)
        {
            assessmentId: 2,
            distanceKm: 85.2,
            mode: 'truck',
            fuelType: 'diesel',
            loadCapacityTons: 35.5,
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            assessmentId: 2,
            distanceKm: 125.7,
            mode: 'truck',
            fuelType: 'diesel',
            loadCapacityTons: 38.2,
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        // Copper Assessment (ID 2) - Rail transport
        {
            assessmentId: 2,
            distanceKm: 650.0,
            mode: 'rail',
            fuelType: 'diesel',
            loadCapacityTons: 125.5,
            createdAt: new Date('2024-01-19').toISOString(),
            updatedAt: new Date('2024-01-19').toISOString(),
        },
        {
            assessmentId: 2,
            distanceKm: 720.8,
            mode: 'rail',
            fuelType: 'diesel',
            loadCapacityTons: 142.3,
            createdAt: new Date('2024-01-19').toISOString(),
            updatedAt: new Date('2024-01-19').toISOString(),
        },
        // Copper Assessment (ID 2) - Ship transport (international)
        {
            assessmentId: 2,
            distanceKm: 5200.0,
            mode: 'ship',
            fuelType: 'marine_diesel',
            loadCapacityTons: 980.5,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            assessmentId: 2,
            distanceKm: 7500.3,
            mode: 'ship',
            fuelType: 'marine_diesel',
            loadCapacityTons: 1150.7,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        // Steel Assessment (ID 3) - Truck transport (local/regional)
        {
            assessmentId: 3,
            distanceKm: 165.0,
            mode: 'truck',
            fuelType: 'diesel',
            loadCapacityTons: 27.5,
            createdAt: new Date('2024-01-21').toISOString(),
            updatedAt: new Date('2024-01-21').toISOString(),
        },
        {
            assessmentId: 3,
            distanceKm: 210.8,
            mode: 'truck',
            fuelType: 'diesel',
            loadCapacityTons: 29.2,
            createdAt: new Date('2024-01-21').toISOString(),
            updatedAt: new Date('2024-01-21').toISOString(),
        },
        // Steel Assessment (ID 3) - Rail transport (electric for sustainability)
        {
            assessmentId: 3,
            distanceKm: 520.0,
            mode: 'rail',
            fuelType: 'electric',
            loadCapacityTons: 75.5,
            createdAt: new Date('2024-01-22').toISOString(),
            updatedAt: new Date('2024-01-22').toISOString(),
        },
        {
            assessmentId: 3,
            distanceKm: 680.3,
            mode: 'rail',
            fuelType: 'electric',
            loadCapacityTons: 92.8,
            createdAt: new Date('2024-01-22').toISOString(),
            updatedAt: new Date('2024-01-22').toISOString(),
        },
        // Steel Assessment (ID 3) - Ship transport (LNG for cleaner fuel)
        {
            assessmentId: 3,
            distanceKm: 2100.0,
            mode: 'ship',
            fuelType: 'LNG',
            loadCapacityTons: 580.0,
            createdAt: new Date('2024-01-23').toISOString(),
            updatedAt: new Date('2024-01-23').toISOString(),
        },
        {
            assessmentId: 3,
            distanceKm: 2850.5,
            mode: 'ship',
            fuelType: 'LNG',
            loadCapacityTons: 720.3,
            createdAt: new Date('2024-01-23').toISOString(),
            updatedAt: new Date('2024-01-23').toISOString(),
        }
    ];

    await db.insert(transportationData).values(sampleTransportationData);
    
    console.log('✅ Transportation data seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});