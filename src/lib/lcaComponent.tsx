"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BarChart3, Droplets, Zap, Recycle, Target, TrendingUp, Leaf } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, Title as ChartTitle } from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { motion } from "motion/react";
import { toast } from "sonner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  ChartTooltip,
  ChartLegend,
  ChartTitle
);

type Metal = "Aluminum" | "Copper" | "Steel";

interface LCAInput {
  metal: Metal;
  volumeTons: number;
  processType: "Primary" | "Recycled" | "Mixed";
  location: string;
  energySource: "Renewable" | "Mixed" | "Coal";
  transportDistanceKm: number;
  waterUsageKL?: number;
  energyConsumptionMJ?: number;
  recycledContentPct: number;
  productLifespanYears: number;
  endOfLifeScenario: "Landfill" | "Recycled" | "Reuse/Remanufacture";
  aiEstimateWater: boolean;
  aiEstimateEnergy: boolean;
}

interface ImpactResults {
  co2Kg: number;
  energyMJ: number;
  waterLiters: number;
  wasteKg: number;
}

interface CircularityMetrics {
  materialCircularityIndex: number;
  resourceEfficiencyPct: number;
  recyclingPotentialPct: number;
  lifespanScore: number;
}

interface ScenarioComparison {
  linear: ImpactResults & { costIndex: number; resourceEfficiencyPct: number };
  circular: ImpactResults & { costIndex: number; resourceEfficiencyPct: number };
  improvements: {
    co2Pct: number;
    energyPct: number;
    waterPct: number;
    wastePct: number;
    costPct: number;
    resourceEfficiencyPct: number;
  };
}

interface LCAComputed {
  input: LCAInput;
  impacts: ImpactResults;
  circularity: CircularityMetrics;
  comparison: ScenarioComparison;
}

const EMISSION_FACTORS = {
  Aluminum: { primary: 12.8, recycled: 1.2 },
  Copper: { primary: 4.2, recycled: 0.8 },
  Steel: { primary: 2.3, recycled: 0.5 },
};

const ENERGY_SOURCE_FACTORS = { Renewable: 0.05, Mixed: 0.65, Coal: 0.95 };

const BASE_WATER_KL_PER_TON = { Aluminum: 3.2, Copper: 2.1, Steel: 1.4 };
const BASE_ENERGY_MJ_PER_TON = { Aluminum: 15500, Copper: 4500, Steel: 2100 };

const EOL_SCORE = { Landfill: 0.1, Recycled: 0.9, "Reuse/Remanufacture": 0.8 };

export default function LCAAssessmentForm() {
  const [formData, setFormData] = useState<LCAInput>({
    metal: "Steel",
    volumeTons: 1000,
    processType: "Recycled",
    location: "Telangana",
    energySource: "Mixed",
    transportDistanceKm: 250,
    recycledContentPct: 70,
    productLifespanYears: 15,
    endOfLifeScenario: "Recycled",
    aiEstimateWater: true,
    aiEstimateEnergy: true,
  });

  const [results, setResults] = useState<LCAComputed | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "results">("form");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing simulation...");

  useEffect(() => {
    if (results) {
      setActiveTab("results");
    }
  }, [results]);

  const estimateMissing = (input: LCAInput): { energyConsumptionMJ: number; waterUsageKL: number } => {
    const baseEnergy = BASE_ENERGY_MJ_PER_TON[input.metal as keyof typeof BASE_ENERGY_MJ_PER_TON] as number;
    const energyConsumptionMJ = input.energyConsumptionMJ ?? baseEnergy * input.volumeTons * (ENERGY_SOURCE_FACTORS as any)[input.energySource];

    const baseWater = BASE_WATER_KL_PER_TON[input.metal as keyof typeof BASE_WATER_KL_PER_TON] as number;
    const waterUsageKL = input.waterUsageKL ?? baseWater * input.volumeTons * (input.processType === "Recycled" ? 0.4 : 1.0);

    return { energyConsumptionMJ, waterUsageKL };
  };

  const computeImpacts = (input: LCAInput): ImpactResults => {
    const ef = (EMISSION_FACTORS as any)[input.metal];
    const routeFactor = input.processType === "Recycled" ? ef.recycled : ef.primary;
    const productionCo2 = routeFactor * input.volumeTons * 1000;
    const transportCo2 = 0.045 * input.transportDistanceKm * input.volumeTons;
    const co2Kg = productionCo2 + transportCo2;
    const { energyConsumptionMJ, waterUsageKL } = estimateMissing(input);
    const wasteKg = input.volumeTons * 0.15 * (1 - input.recycledContentPct / 100) * 1000;
    return {
      co2Kg,
      energyMJ: energyConsumptionMJ,
      waterLiters: waterUsageKL * 1000,
      wasteKg,
    };
  };

  const computeCircularity = (input: LCAInput): CircularityMetrics => {
    const recycled = input.recycledContentPct;
    const eol = (EOL_SCORE as any)[input.endOfLifeScenario];
    const score = recycled * 0.4 + (input.productLifespanYears / 50) * 100 * 0.3 + eol * 100 * 0.3;
    const resourceEfficiencyPct = Math.min(100, Math.max(0, recycled * 0.6 + eol * 100 * 0.4));
    const recyclingPotentialPct = Math.min(100, Math.max(0, recycled + eol * 20));
    const lifespanScore = Math.min(100, (input.productLifespanYears / 50) * 100);
    return {
      materialCircularityIndex: Math.min(100, Math.max(0, score)),
      resourceEfficiencyPct,
      recyclingPotentialPct,
      lifespanScore,
    };
  };

  const buildComparison = (input: LCAInput, impacts: ImpactResults): ScenarioComparison => {
    const linearInput: LCAInput = { ...input, processType: "Primary", recycledContentPct: 0, energySource: "Coal", endOfLifeScenario: "Landfill" };
    const circularInput: LCAInput = { ...input, processType: "Recycled", recycledContentPct: Math.max(70, input.recycledContentPct), energySource: "Renewable", endOfLifeScenario: "Recycled" };
    const linearImpacts = computeImpacts(linearInput);
    const circularImpacts = computeImpacts(circularInput);
    const linearCost = linearImpacts.energyMJ * 0.0008 + linearInput.transportDistanceKm * linearInput.volumeTons * 0.02;
    const circularCost = circularImpacts.energyMJ * 0.0008 + circularInput.transportDistanceKm * circularInput.volumeTons * 0.02;
    const circularCirc = computeCircularity(circularInput);
    return {
      linear: { ...linearImpacts, costIndex: linearCost, resourceEfficiencyPct: 0 },
      circular: { ...circularImpacts, costIndex: circularCost, resourceEfficiencyPct: circularCirc.resourceEfficiencyPct },
      improvements: {
        co2Pct: ((linearImpacts.co2Kg - circularImpacts.co2Kg) / linearImpacts.co2Kg) * 100,
        energyPct: ((linearImpacts.energyMJ - circularImpacts.energyMJ) / linearImpacts.energyMJ) * 100,
        waterPct: ((linearImpacts.waterLiters - circularImpacts.waterLiters) / linearImpacts.waterLiters) * 100,
        wastePct: ((linearImpacts.wasteKg - circularImpacts.wasteKg) / linearImpacts.wasteKg) * 100,
        costPct: ((linearCost - circularCost) / linearCost) * 100,
        resourceEfficiencyPct: circularCirc.resourceEfficiencyPct,
      },
    };
  };

  const computeAll = (input: LCAInput): LCAComputed => {
    const impacts = computeImpacts(input);
    const circularity = computeCircularity(input);
    const comparison = buildComparison(input, impacts);
    return { input, impacts, circularity, comparison };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setProgress(0);
    setStatus("Initializing simulation...");

    setTimeout(() => { setProgress(40); setStatus("Computing environmental impacts..."); }, 1200);
    setTimeout(() => { setProgress(75); setStatus("Analyzing circularity metrics..."); }, 2400);
    setTimeout(() => {
      const res = computeAll(formData);
      setResults(res);
      setProcessing(false);
      toast.success("LCA assessment completed successfully!");
    }, 3600);
  };

  const impactChartData = useMemo(() => ({
    labels: ["CO₂ Emissions (kg)", "Energy Use (MJ)", "Water Use (L)", "Waste (kg)"],
    datasets: [{
      label: "Environmental Impact",
      data: results ? [results.impacts.co2Kg, results.impacts.energyMJ, results.impacts.waterLiters, results.impacts.wasteKg] : [0, 0, 0, 0],
      backgroundColor: ["#0ea5a5", "#06b6d4", "#2dd4bf", "#f59e0b"],
      borderRadius: 8,
    }],
  }), [results]);

  const scenarioChartData = useMemo(() => ({
    labels: ["CO₂", "Energy MJ", "Cost Index", "Resource %"],
    datasets: [
      { label: "Linear", data: results ? [results.comparison.linear.co2Kg, results.comparison.linear.energyMJ, results.comparison.linear.costIndex, results.comparison.linear.resourceEfficiencyPct] : [0, 0, 0, 0], borderColor: "#ef4444", backgroundColor: "#ef4444", tension: 0.3 },
      { label: "Circular", data: results ? [results.comparison.circular.co2Kg, results.comparison.circular.energyMJ, results.comparison.circular.costIndex, results.comparison.circular.resourceEfficiencyPct] : [0, 0, 0, 0], borderColor: "#0f766e", backgroundColor: "#0f766e", tension: 0.3 },
    ],
  }), [results]);

  const circularityChartData = useMemo(() => ({
    labels: ["Material Circularity", "Efficiency", "Recycling Potential"],
    datasets: [{
      label: "Circularity (%)",
      data: results ? [results.circularity.materialCircularityIndex, results.circularity.resourceEfficiencyPct, results.circularity.recyclingPotentialPct] : [0, 0, 0],
      backgroundColor: ["#0ea5a5", "#06b6d4", "#2dd4bf"],
      borderWidth: 0,
    }],
  }), [results]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {processing && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Processing Assessment</CardTitle>
              <CardDescription>AI-driven LCA simulation in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-secondary rounded-full h-2 mb-2">
                <motion.div
                  className="bg-emerald-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{status}</p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="text-emerald-600" />
              SAMVARTANA - LCA Assessment
            </CardTitle>
            <CardDescription>Telangana Metallurgical Circularity Analysis Platform</CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "form" | "results")} className="mb-6">
          <TabsList>
            <TabsTrigger value="form">Input Form</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Process Configuration</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Metal</Label>
                    <Select value={formData.metal} onValueChange={(v) => setFormData({ ...formData, metal: v as Metal })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["Aluminum", "Copper", "Steel"] as Metal[]).map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Volume (metric tons)</Label>
                    <Input type="number" value={formData.volumeTons} onChange={(e) => setFormData({ ...formData, volumeTons: Number(e.target.value) })} min={1} required />
                  </div>
                  <div>
                    <Label>Process Type</Label>
                    <Select value={formData.processType} onValueChange={(v) => setFormData({ ...formData, processType: v as "Primary" | "Recycled" | "Mixed" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Recycled">Recycled</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Energy & Resource Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Energy Source</Label>
                      <Select value={formData.energySource} onValueChange={(v) => setFormData({ ...formData, energySource: v as any })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Renewable">Renewable</SelectItem>
                          <SelectItem value="Mixed">Mixed</SelectItem>
                          <SelectItem value="Coal">Coal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Transport Distance (km)</Label>
                      <Input type="number" value={formData.transportDistanceKm} onChange={(e) => setFormData({ ...formData, transportDistanceKm: Number(e.target.value) })} min={0} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <Label>Water Usage (KL)</Label>
                      <Input type="number" value={formData.waterUsageKL || ""} onChange={(e) => setFormData({ ...formData, waterUsageKL: Number(e.target.value) || undefined })} min={0} placeholder="Auto-estimate if blank" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={formData.aiEstimateWater} onCheckedChange={(v) => setFormData({ ...formData, aiEstimateWater: Boolean(v) })} id="aiWater" />
                      <Label htmlFor="aiWater">AI Estimate Water</Label>
                    </div>
                    <div>
                      <Label>Energy Consumption (MJ)</Label>
                      <Input type="number" value={formData.energyConsumptionMJ || ""} onChange={(e) => setFormData({ ...formData, energyConsumptionMJ: Number(e.target.value) || undefined })} min={0} placeholder="Auto-estimate if blank" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={formData.aiEstimateEnergy} onCheckedChange={(v) => setFormData({ ...formData, aiEstimateEnergy: Boolean(v) })} id="aiEnergy" />
                      <Label htmlFor="aiEnergy">AI Estimate Energy</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Recycled Content (%)</Label>
                      <Input type="number" value={formData.recycledContentPct} onChange={(e) => setFormData({ ...formData, recycledContentPct: Number(e.target.value) })} min={0} max={100} required />
                    </div>
                    <div>
                      <Label>Product Lifespan (years)</Label>
                      <Input type="number" value={formData.productLifespanYears} onChange={(e) => setFormData({ ...formData, productLifespanYears: Number(e.target.value) })} min={0} required />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>End of Life Scenario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label>End of Life Scenario</Label>
                    <Select value={formData.endOfLifeScenario} onValueChange={(v) => setFormData({ ...formData, endOfLifeScenario: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Landfill">Landfill</SelectItem>
                        <SelectItem value="Recycled">Recycled</SelectItem>
                        <SelectItem value="Reuse/Remanufacture">Reuse/Remanufacture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? "Running Simulation..." : "Run Assessment"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="results">
            {results && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 />
                      Environmental Impact Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Bar data={impactChartData} options={{ plugins: { legend: { display: false } } }} />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target />
                        Scenario Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <Line data={scenarioChartData} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Recycle />
                        Circularity Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <Pie data={circularityChartData} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp />
                      Impact Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-md bg-muted">
                        <div className="text-2xl font-bold text-emerald-600">{results.impacts.co2Kg.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div className="text-sm text-muted-foreground">CO₂ Equivalent (kg)</div>
                      </div>
                      <div className="p-4 rounded-md bg-muted">
                        <div className="text-2xl font-bold text-cyan-600">{results.impacts.energyMJ.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div className="text-sm text-muted-foreground">Energy Use (MJ)</div>
                      </div>
                      <div className="p-4 rounded-md bg-muted">
                        <div className="text-2xl font-bold text-teal-600">{results.impacts.waterLiters.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div className="text-sm text-muted-foreground">Water Use (L)</div>
                      </div>
                      <div className="p-4 rounded-md bg-muted">
                        <div className="text-2xl font-bold text-amber-600">{results.impacts.wasteKg.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div className="text-sm text-muted-foreground">Waste (kg)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle />
                      Circular vs Linear Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <Badge variant="accent" className="text-xl px-3 py-1">-{results.comparison.improvements.co2Pct.toFixed(0)}%</Badge>
                        <div className="text-sm mt-1">CO₂ Reduction</div>
                      </div>
                      <div>
                        <Badge variant="accent" className="text-xl px-3 py-1">-{results.comparison.improvements.energyPct.toFixed(0)}%</Badge>
                        <div className="text-sm mt-1">Energy Reduction</div>
                      </div>
                      <div>
                        <Badge variant="accent" className="text-xl px-3 py-1">-{results.comparison.improvements.wastePct.toFixed(0)}%</Badge>
                        <div className="text-sm mt-1">Waste Reduction</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={() => setActiveTab("form")} className="w-full">
                  Back to Form
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}