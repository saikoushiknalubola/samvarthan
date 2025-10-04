import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Assessments table - Main LCA projects
export const assessments = sqliteTable('assessments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectName: text('project_name').notNull(),
  metalType: text('metal_type').notNull(), // 'aluminium', 'copper', 'steel'
  status: text('status').notNull().default('draft'), // 'draft', 'in_progress', 'completed'
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Material data table - Raw material inputs and circularity
export const materialData = sqliteTable('material_data', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assessmentId: integer('assessment_id').references(() => assessments.id),
  oreType: text('ore_type'),
  oreGradePct: real('ore_grade_pct'),
  moisturePct: real('moisture_pct'),
  quantityTons: real('quantity_tons'),
  extractionMethod: text('extraction_method'), // 'open_pit', 'underground', 'recycled'
  recycledContentPct: real('recycled_content_pct'),
  virginMaterialPct: real('virgin_material_pct'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Processing data table - Energy and process information
export const processingData = sqliteTable('processing_data', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assessmentId: integer('assessment_id').references(() => assessments.id),
  energySource: text('energy_source'),
  energyConsumptionKwh: real('energy_consumption_kwh'),
  equipmentEfficiencyPct: real('equipment_efficiency_pct'),
  wasteGenerationTons: real('waste_generation_tons'),
  waterUsageM3: real('water_usage_m3'),
  processType: text('process_type'), // 'crushing', 'grinding', 'smelting', 'refining'
  aiEstimated: integer('ai_estimated', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Transportation data table - Logistics and transport impacts
export const transportationData = sqliteTable('transportation_data', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assessmentId: integer('assessment_id').references(() => assessments.id),
  distanceKm: real('distance_km'),
  mode: text('mode'), // 'truck', 'rail', 'ship'
  fuelType: text('fuel_type'),
  loadCapacityTons: real('load_capacity_tons'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Circularity metrics table - Circular economy indicators
export const circularityMetrics = sqliteTable('circularity_metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assessmentId: integer('assessment_id').references(() => assessments.id),
  mciScore: real('mci_score'), // Material Circularity Indicator
  recyclingPotentialPct: real('recycling_potential_pct'),
  resourceEfficiencyScore: real('resource_efficiency_score'),
  extendedProductLifeYears: real('extended_product_life_years'),
  reusePotentialPct: real('reuse_potential_pct'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Environmental impacts table - Calculated LCA results
export const environmentalImpacts = sqliteTable('environmental_impacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assessmentId: integer('assessment_id').references(() => assessments.id),
  co2EmissionsTons: real('co2_emissions_tons'),
  totalEnergyKwh: real('total_energy_kwh'),
  totalWaterM3: real('total_water_m3'),
  totalWasteTons: real('total_waste_tons'),
  calculatedAt: text('calculated_at').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Scenarios table - Different pathway comparisons
export const scenarios = sqliteTable('scenarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  assessmentId: integer('assessment_id').references(() => assessments.id),
  name: text('name').notNull(),
  description: text('description'),
  scenarioType: text('scenario_type').notNull(), // 'baseline', 'circular', 'optimized'
  co2ReductionPct: real('co2_reduction_pct'),
  costDifferencePct: real('cost_difference_pct'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});