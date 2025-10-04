"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingDown,
  TrendingUp,
  Zap,
  Droplets,
  Trash2,
  Recycle,
  ArrowRight,
  Download,
  Share2,
  BarChart3,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LCAResultsProps {
  assessmentId: number;
  className?: string;
}

interface EnvironmentalImpact {
  co2EmissionsTons: number;
  totalEnergyKwh: number;
  totalWaterM3: number;
  totalWasteTons: number;
  benchmarkComparison?: {
    co2PerTon: number;
    energyPerTon: number;
    co2Benchmark: number;
    energyBenchmark: number;
    co2Performance: string;
    energyPerformance: string;
  };
  sustainabilityRating?: string;
}

interface CircularityMetric {
  mciScore: number;
  recyclingPotentialPct: number;
  resourceEfficiencyScore: number;
  extendedProductLifeYears: number;
  reusePotentialPct: number;
  composite_score: number;
  circularity_grade: string;
}

interface Scenario {
  id: number;
  name: string;
  scenarioType: string;
  co2ReductionPct: number;
  costDifferencePct: number;
  feasibility_score: number;
  implementation_complexity: string;
}

export default function LCAResults({ assessmentId, className }: LCAResultsProps) {
  const [loading, setLoading] = useState(true);
  const [impacts, setImpacts] = useState<EnvironmentalImpact | null>(null);
  const [circularity, setCircularity] = useState<CircularityMetric | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [assessment, setAssessment] = useState<any>(null);

  useEffect(() => {
    fetchResults();
  }, [assessmentId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [assessmentRes, impactsRes, circularityRes, scenariosRes] = await Promise.all([
        fetch(`/api/assessments?id=${assessmentId}`),
        fetch(`/api/environmental-impacts?assessment_id=${assessmentId}`),
        fetch(`/api/circularity-metrics?assessment_id=${assessmentId}`),
        fetch(`/api/scenarios?assessment_id=${assessmentId}`),
      ]);

      const assessmentData = await assessmentRes.json();
      const impactsData = await impactsRes.json();
      const circularityData = await circularityRes.json();
      const scenariosData = await scenariosRes.json();

      setAssessment(assessmentData);
      if (impactsData.length > 0) setImpacts(impactsData[0]);
      if (circularityData.length > 0) setCircularity(circularityData[0]);
      setScenarios(scenariosData);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toFixed(decimals);
  };

  const getSustainabilityColor = (rating: string | undefined) => {
    switch (rating) {
      case "Excellent":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Good":
        return "text-green-600 bg-green-50 border-green-200";
      case "Average":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Below Average":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Poor":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-muted-foreground bg-secondary border-border";
    }
  };

  const getCircularityColor = (grade: string | undefined) => {
    switch (grade) {
      case "Excellent":
        return "bg-emerald-600";
      case "Good":
        return "bg-green-600";
      case "Fair":
        return "bg-yellow-600";
      case "Poor":
        return "bg-red-600";
      default:
        return "bg-muted";
    }
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-12", className)}>
        <div className="text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Loading assessment results...</p>
        </div>
      </div>
    );
  }

  if (!impacts) {
    return (
      <div className={cn("p-12 text-center", className)}>
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No results available yet. Complete the assessment to view results.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assessment Results</h2>
          <p className="text-muted-foreground mt-1">
            {assessment?.projectName || "LCA Assessment"} • {assessment?.metalType?.toUpperCase() || "Metal"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Sustainability Rating Badge */}
      {impacts.sustainabilityRating && (
        <Card className={cn("border-2", getSustainabilityColor(impacts.sustainabilityRating))}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {impacts.sustainabilityRating === "Excellent" || impacts.sustainabilityRating === "Good" ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <AlertCircle className="h-6 w-6" />
                )}
                <div>
                  <p className="font-semibold">Overall Sustainability Rating</p>
                  <p className="text-sm">Based on industry benchmarks and circularity metrics</p>
                </div>
              </div>
              <Badge variant="outline" className="text-base px-4 py-2 font-bold">
                {impacts.sustainabilityRating}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environmental Impact KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-emerald-600" />
              CO₂ Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(impacts.co2EmissionsTons)} <span className="text-sm font-normal text-muted-foreground">tCO₂e</span>
            </div>
            {impacts.benchmarkComparison && (
              <p className={cn(
                "text-xs mt-2 flex items-center gap-1",
                impacts.benchmarkComparison.co2Performance === "Better" ? "text-emerald-600" : "text-red-600"
              )}>
                {impacts.benchmarkComparison.co2Performance === "Better" ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3" />
                )}
                {impacts.benchmarkComparison.co2Performance} than industry average
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" />
              Energy Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(impacts.totalEnergyKwh)} <span className="text-sm font-normal text-muted-foreground">kWh</span>
            </div>
            {impacts.benchmarkComparison && (
              <p className={cn(
                "text-xs mt-2 flex items-center gap-1",
                impacts.benchmarkComparison.energyPerformance === "Better" ? "text-emerald-600" : "text-red-600"
              )}>
                {impacts.benchmarkComparison.energyPerformance === "Better" ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3" />
                )}
                {impacts.benchmarkComparison.energyPerformance} than industry average
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4 text-sky-600" />
              Water Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(impacts.totalWaterM3)} <span className="text-sm font-normal text-muted-foreground">m³</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Total water consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-orange-600" />
              Waste Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(impacts.totalWasteTons)} <span className="text-sm font-normal text-muted-foreground">tons</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Total waste produced</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="circularity" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="circularity">Circularity Metrics</TabsTrigger>
          <TabsTrigger value="flow">Material Flow</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        {/* Circularity Metrics Tab */}
        <TabsContent value="circularity" className="space-y-4 mt-6">
          {circularity ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Circularity Performance</CardTitle>
                  <CardDescription>
                    Material Circularity Indicator (MCI) and related circular economy metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Composite Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Circularity Score</span>
                      <Badge className={getCircularityColor(circularity.circularity_grade)}>
                        {circularity.circularity_grade}
                      </Badge>
                    </div>
                    <Progress value={circularity.composite_score * 100} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(circularity.composite_score * 100)}% of maximum circularity potential
                    </p>
                  </div>

                  {/* Individual Metrics */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">MCI Score</span>
                        <span className="text-sm font-semibold">{circularity.mciScore.toFixed(2)}</span>
                      </div>
                      <Progress value={circularity.mciScore * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Recycling Potential</span>
                        <span className="text-sm font-semibold">{circularity.recyclingPotentialPct.toFixed(1)}%</span>
                      </div>
                      <Progress value={circularity.recyclingPotentialPct} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resource Efficiency</span>
                        <span className="text-sm font-semibold">{circularity.resourceEfficiencyScore.toFixed(1)}/10</span>
                      </div>
                      <Progress value={circularity.resourceEfficiencyScore * 10} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Reuse Potential</span>
                        <span className="text-sm font-semibold">{circularity.reusePotentialPct.toFixed(1)}%</span>
                      </div>
                      <Progress value={circularity.reusePotentialPct} className="h-2" />
                    </div>
                  </div>

                  {/* Product Life Extension */}
                  <div className="rounded-lg border bg-secondary/30 p-4">
                    <div className="flex items-center gap-3">
                      <Recycle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Extended Product Life</p>
                        <p className="text-sm text-muted-foreground">
                          {circularity.extendedProductLifeYears.toFixed(0)} years additional lifespan
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No circularity metrics available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Material Flow Tab */}
        <TabsContent value="flow" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Flow Diagram</CardTitle>
              <CardDescription>
                Lifecycle material flow from extraction through end-of-life
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simplified Sankey-style visualization */}
              <div className="space-y-8 py-6">
                {/* Stage 1: Extraction */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right">
                    <p className="text-sm font-medium">Extraction</p>
                    <p className="text-xs text-muted-foreground">Raw Material</p>
                  </div>
                  <div className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center text-white font-semibold">
                    100%
                  </div>
                  <div className="w-16 text-xs text-muted-foreground">Virgin + Recycled</div>
                </div>

                {/* Stage 2: Processing */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right">
                    <p className="text-sm font-medium">Processing</p>
                    <p className="text-xs text-muted-foreground">Energy Intensive</p>
                  </div>
                  <div className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg flex items-center justify-center text-white font-semibold">
                    92%
                  </div>
                  <div className="w-16 text-xs text-muted-foreground">8% waste</div>
                </div>

                {/* Stage 3: Manufacturing */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right">
                    <p className="text-sm font-medium">Manufacturing</p>
                    <p className="text-xs text-muted-foreground">Product Creation</p>
                  </div>
                  <div className="flex-1 h-12 bg-gradient-to-r from-sky-500 to-sky-400 rounded-lg flex items-center justify-center text-white font-semibold">
                    85%
                  </div>
                  <div className="w-16 text-xs text-muted-foreground">7% scrap</div>
                </div>

                {/* Stage 4: Use Phase */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right">
                    <p className="text-sm font-medium">Use Phase</p>
                    <p className="text-xs text-muted-foreground">In Service</p>
                  </div>
                  <div className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg flex items-center justify-center text-white font-semibold">
                    85%
                  </div>
                  <div className="w-16 text-xs text-muted-foreground">Long life</div>
                </div>

                {/* Stage 5: End of Life */}
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right">
                    <p className="text-sm font-medium">End of Life</p>
                    <p className="text-xs text-muted-foreground">Recovery</p>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center text-white font-semibold">
                      {circularity?.recyclingPotentialPct.toFixed(0) || "70"}% Recycled
                    </div>
                    <div className="w-24 h-12 bg-gradient-to-r from-red-500 to-red-400 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                      {100 - (circularity?.recyclingPotentialPct || 70)}% Waste
                    </div>
                  </div>
                  <div className="w-16"></div>
                </div>

                {/* Circular loop indicator */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t">
                  <Recycle className="h-5 w-5 text-emerald-600" />
                  <p className="text-sm text-muted-foreground">
                    Circular economy potential: <span className="font-semibold text-foreground">
                      {circularity ? Math.round(circularity.composite_score * 100) : 65}%
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-4 mt-6">
          {scenarios.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {scenarios.map((scenario) => (
                <Card key={scenario.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{scenario.name}</CardTitle>
                        <Badge variant="outline" className="mt-2">{scenario.scenarioType}</Badge>
                      </div>
                      <Badge className={cn(
                        scenario.feasibility_score > 0.7 ? "bg-emerald-600" :
                        scenario.feasibility_score > 0.5 ? "bg-amber-600" : "bg-red-600"
                      )}>
                        {Math.round(scenario.feasibility_score * 100)}% Feasible
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">CO₂ Reduction</p>
                        <p className={cn(
                          "text-xl font-bold",
                          scenario.co2ReductionPct > 0 ? "text-emerald-600" : "text-red-600"
                        )}>
                          {scenario.co2ReductionPct > 0 ? "-" : "+"}{Math.abs(scenario.co2ReductionPct).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cost Difference</p>
                        <p className={cn(
                          "text-xl font-bold",
                          scenario.costDifferencePct < 0 ? "text-emerald-600" : "text-red-600"
                        )}>
                          {scenario.costDifferencePct > 0 ? "+" : ""}{scenario.costDifferencePct.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Complexity:</span>
                      <Badge variant="secondary">{scenario.implementation_complexity}</Badge>
                    </div>
                    <Button className="w-full" variant="outline" size="sm">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No scenarios created yet</p>
                <Button>
                  Create Scenario
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}