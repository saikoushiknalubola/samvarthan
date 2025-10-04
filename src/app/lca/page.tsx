"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ArrowLeft, Save, CheckCircle2, Calculator, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface ProjectData {
  projectName: string;
  metalType: "aluminium" | "copper" | "steel" | "";
}

interface MaterialData {
  oreType: string;
  oreGradePct: string;
  moisturePct: string;
  quantityTons: string;
  extractionMethod: "open_pit" | "underground" | "recycled" | "";
  recycledContentPct: string;
}

interface ProcessingData {
  energySource: string;
  energyConsumptionKwh: string;
  processType: "crushing" | "grinding" | "smelting" | "refining" | "";
  equipmentEfficiencyPct: string;
  wasteGenerationTons: string;
  waterUsageM3: string;
}

interface TransportationData {
  distanceKm: string;
  mode: "truck" | "rail" | "ship" | "";
  fuelType: string;
  loadCapacityTons: string;
}

interface CircularityData {
  mciScore: string;
  recyclingPotentialPct: string;
  resourceEfficiencyScore: string;
  extendedProductLifeYears: string;
  reusePotentialPct: string;
}

export default function LCAPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [aiEstimating, setAiEstimating] = useState(false);
  const [aiEstimatedFields, setAiEstimatedFields] = useState<Set<string>>(new Set());

  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: "",
    metalType: "",
  });

  const [materialData, setMaterialData] = useState<MaterialData>({
    oreType: "",
    oreGradePct: "",
    moisturePct: "",
    quantityTons: "",
    extractionMethod: "",
    recycledContentPct: "",
  });

  const [processingData, setProcessingData] = useState<ProcessingData>({
    energySource: "",
    energyConsumptionKwh: "",
    processType: "",
    equipmentEfficiencyPct: "",
    wasteGenerationTons: "",
    waterUsageM3: "",
  });

  const [transportationData, setTransportationData] = useState<TransportationData>({
    distanceKm: "",
    mode: "",
    fuelType: "",
    loadCapacityTons: "",
  });

  const [circularityData, setCircularityData] = useState<CircularityData>({
    mciScore: "",
    recyclingPotentialPct: "",
    resourceEfficiencyScore: "",
    extendedProductLifeYears: "",
    reusePotentialPct: "",
  });

  const progress = (currentStep / 6) * 100;

  const stepTitles = {
    1: "Project Setup",
    2: "Material Data",
    3: "Processing",
    4: "Transportation",
    5: "Circularity Metrics",
    6: "Review & Submit",
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      // Create or update assessment
      if (!assessmentId) {
        const res = await fetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName: projectData.projectName,
            metalType: projectData.metalType,
            status: "draft",
          }),
        });
        const data = await res.json();
        setAssessmentId(data.id);
        toast.success("Draft saved successfully");
      } else {
        await fetch(`/api/assessments?id=${assessmentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName: projectData.projectName,
            metalType: projectData.metalType,
            status: "in_progress",
          }),
        });
        toast.success("Progress saved");
      }
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handleAIEstimate = async () => {
    if (!assessmentId) {
      toast.error("Please save your project first");
      return;
    }

    setAiEstimating(true);
    try {
      const res = await fetch(`/api/assessments/${assessmentId}/ai-estimate?id=${assessmentId}`, {
        method: "POST",
      });
      const data = await res.json();

      // Update UI to show which fields were estimated
      const estimatedFieldsSet = new Set(data.estimated_fields || []);
      setAiEstimatedFields(estimatedFieldsSet);

      toast.success(`AI estimated ${data.estimated_count} parameters with ${Math.round(data.confidence_score * 100)}% confidence`, {
        description: "Estimated values have been applied. You can still modify them manually.",
      });

      // Optionally fetch updated processing data to show estimated values
      const processingRes = await fetch(`/api/processing-data?assessment_id=${assessmentId}`);
      const processingDataArray = await processingRes.json();
      if (processingDataArray.length > 0) {
        const latest = processingDataArray[0];
        setProcessingData({
          energySource: latest.energySource || "",
          energyConsumptionKwh: latest.energyConsumptionKwh?.toString() || "",
          processType: latest.processType || "",
          equipmentEfficiencyPct: latest.equipmentEfficiencyPct?.toString() || "",
          wasteGenerationTons: latest.wasteGenerationTons?.toString() || "",
          waterUsageM3: latest.waterUsageM3?.toString() || "",
        });
      }
    } catch (error) {
      toast.error("AI estimation failed");
    } finally {
      setAiEstimating(false);
    }
  };

  const handleSubmit = async () => {
    if (!assessmentId) {
      toast.error("Please save your project first");
      return;
    }

    setCalculating(true);
    try {
      // Save all data sections
      await Promise.all([
        fetch("/api/material-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentId,
            oreType: materialData.oreType,
            oreGradePct: parseFloat(materialData.oreGradePct),
            moisturePct: parseFloat(materialData.moisturePct),
            quantityTons: parseFloat(materialData.quantityTons),
            extractionMethod: materialData.extractionMethod,
            recycledContentPct: parseFloat(materialData.recycledContentPct),
          }),
        }),
        fetch("/api/processing-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentId,
            energySource: processingData.energySource,
            energyConsumptionKwh: parseFloat(processingData.energyConsumptionKwh),
            processType: processingData.processType,
            equipmentEfficiencyPct: parseFloat(processingData.equipmentEfficiencyPct),
            wasteGenerationTons: parseFloat(processingData.wasteGenerationTons),
            waterUsageM3: parseFloat(processingData.waterUsageM3),
          }),
        }),
        fetch("/api/transportation-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentId,
            distanceKm: parseFloat(transportationData.distanceKm),
            mode: transportationData.mode,
            fuelType: transportationData.fuelType,
            loadCapacityTons: parseFloat(transportationData.loadCapacityTons),
          }),
        }),
        fetch("/api/circularity-metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentId,
            mciScore: parseFloat(circularityData.mciScore),
            recyclingPotentialPct: parseFloat(circularityData.recyclingPotentialPct),
            resourceEfficiencyScore: parseFloat(circularityData.resourceEfficiencyScore),
            extendedProductLifeYears: parseFloat(circularityData.extendedProductLifeYears),
            reusePotentialPct: parseFloat(circularityData.reusePotentialPct),
          }),
        }),
      ]);

      // Calculate environmental impacts
      const calcRes = await fetch(`/api/assessments/${assessmentId}/calculate?assessmentId=${assessmentId}`, {
        method: "POST",
      });
      const impacts = await calcRes.json();

      toast.success("Assessment completed successfully!");
      // Redirect to results or platform dashboard
      window.location.href = `/platform`;
    } catch (error) {
      toast.error("Failed to submit assessment");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-background text-foreground py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            LCA Assessment Wizard
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete Life Cycle Assessment for {projectData.metalType || "metals"} with AI-assisted estimations
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of 6: {stepTitles[currentStep]}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{stepTitles[currentStep]}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Define your project and select the metal type"}
              {currentStep === 2 && "Enter material characteristics and extraction details"}
              {currentStep === 3 && "Specify energy consumption and processing parameters"}
              {currentStep === 4 && "Define transportation logistics and distances"}
              {currentStep === 5 && "Assess circularity and sustainability metrics"}
              {currentStep === 6 && "Review all data and submit for calculation"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Project Setup */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Sustainable Aluminium Smelting Study"
                    value={projectData.projectName}
                    onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="metalType">Metal Type *</Label>
                  <Select
                    value={projectData.metalType}
                    onValueChange={(value: any) => setProjectData({ ...projectData, metalType: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select metal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aluminium">Aluminium</SelectItem>
                      <SelectItem value="copper">Copper</SelectItem>
                      <SelectItem value="steel">Steel</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    AI models will use metal-specific benchmarks for estimations
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Material Data */}
            {currentStep === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="oreType">Ore Type</Label>
                  <Input
                    id="oreType"
                    placeholder="e.g., Bauxite, Chalcopyrite"
                    value={materialData.oreType}
                    onChange={(e) => setMaterialData({ ...materialData, oreType: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="oreGradePct">Ore Grade (%)</Label>
                  <Input
                    id="oreGradePct"
                    type="number"
                    placeholder="e.g., 48.5"
                    value={materialData.oreGradePct}
                    onChange={(e) => setMaterialData({ ...materialData, oreGradePct: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="moisturePct">Moisture Content (%)</Label>
                  <Input
                    id="moisturePct"
                    type="number"
                    placeholder="e.g., 9.2"
                    value={materialData.moisturePct}
                    onChange={(e) => setMaterialData({ ...materialData, moisturePct: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="quantityTons">Quantity (tons) *</Label>
                  <Input
                    id="quantityTons"
                    type="number"
                    placeholder="e.g., 750"
                    value={materialData.quantityTons}
                    onChange={(e) => setMaterialData({ ...materialData, quantityTons: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="extractionMethod">Extraction Method</Label>
                  <Select
                    value={materialData.extractionMethod}
                    onValueChange={(value: any) => setMaterialData({ ...materialData, extractionMethod: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open_pit">Open Pit Mining</SelectItem>
                      <SelectItem value="underground">Underground Mining</SelectItem>
                      <SelectItem value="recycled">Recycled Material</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recycledContentPct">Recycled Content (%)</Label>
                  <Input
                    id="recycledContentPct"
                    type="number"
                    placeholder="e.g., 22"
                    value={materialData.recycledContentPct}
                    onChange={(e) => setMaterialData({ ...materialData, recycledContentPct: e.target.value })}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Higher recycled content improves circularity metrics
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Processing Data */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-accent/50 border-accent p-4 flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">AI-Assisted Parameter Estimation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave fields empty to use AI estimation based on {projectData.metalType} industry benchmarks
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAIEstimate}
                    disabled={aiEstimating || !assessmentId}
                    variant="secondary"
                  >
                    {aiEstimating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Estimating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Estimate
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="energySource">Energy Source</Label>
                    <Input
                      id="energySource"
                      placeholder="e.g., Grid Electricity, Renewable"
                      value={processingData.energySource}
                      onChange={(e) => setProcessingData({ ...processingData, energySource: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="energyConsumptionKwh" className="flex items-center gap-2">
                      Energy Consumption (kWh) *
                      {aiEstimatedFields.has('energyConsumptionKwh') && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI Estimated
                        </Badge>
                      )}
                    </Label>
                    <Input
                      id="energyConsumptionKwh"
                      type="number"
                      placeholder="e.g., 16500"
                      value={processingData.energyConsumptionKwh}
                      onChange={(e) => setProcessingData({ ...processingData, energyConsumptionKwh: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="processType">Process Type *</Label>
                    <Select
                      value={processingData.processType}
                      onValueChange={(value: any) => setProcessingData({ ...processingData, processType: value })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select process" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crushing">Crushing</SelectItem>
                        <SelectItem value="grinding">Grinding</SelectItem>
                        <SelectItem value="smelting">Smelting</SelectItem>
                        <SelectItem value="refining">Refining</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="equipmentEfficiencyPct" className="flex items-center gap-2">
                      Equipment Efficiency (%)
                      {aiEstimatedFields.has('equipmentEfficiencyPct') && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI Estimated
                        </Badge>
                      )}
                    </Label>
                    <Input
                      id="equipmentEfficiencyPct"
                      type="number"
                      placeholder="e.g., 78.5"
                      value={processingData.equipmentEfficiencyPct}
                      onChange={(e) => setProcessingData({ ...processingData, equipmentEfficiencyPct: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wasteGenerationTons" className="flex items-center gap-2">
                      Waste Generation (tons)
                      {aiEstimatedFields.has('wasteGenerationTons') && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI Estimated
                        </Badge>
                      )}
                    </Label>
                    <Input
                      id="wasteGenerationTons"
                      type="number"
                      placeholder="e.g., 0.15"
                      value={processingData.wasteGenerationTons}
                      onChange={(e) => setProcessingData({ ...processingData, wasteGenerationTons: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="waterUsageM3" className="flex items-center gap-2">
                      Water Usage (m³)
                      {aiEstimatedFields.has('waterUsageM3') && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI Estimated
                        </Badge>
                      )}
                    </Label>
                    <Input
                      id="waterUsageM3"
                      type="number"
                      placeholder="e.g., 380"
                      value={processingData.waterUsageM3}
                      onChange={(e) => setProcessingData({ ...processingData, waterUsageM3: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Transportation Data */}
            {currentStep === 4 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="distanceKm">Distance (km) *</Label>
                  <Input
                    id="distanceKm"
                    type="number"
                    placeholder="e.g., 185.5"
                    value={transportationData.distanceKm}
                    onChange={(e) => setTransportationData({ ...transportationData, distanceKm: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="mode">Transport Mode *</Label>
                  <Select
                    value={transportationData.mode}
                    onValueChange={(value: any) => setTransportationData({ ...transportationData, mode: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="rail">Rail</SelectItem>
                      <SelectItem value="ship">Ship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Input
                    id="fuelType"
                    placeholder="e.g., Diesel, Electric, LNG"
                    value={transportationData.fuelType}
                    onChange={(e) => setTransportationData({ ...transportationData, fuelType: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="loadCapacityTons">Load Capacity (tons) *</Label>
                  <Input
                    id="loadCapacityTons"
                    type="number"
                    placeholder="e.g., 28.5"
                    value={transportationData.loadCapacityTons}
                    onChange={(e) => setTransportationData({ ...transportationData, loadCapacityTons: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Circularity Metrics */}
            {currentStep === 5 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="mciScore">
                    MCI Score (0-1)
                    <Badge variant="secondary" className="ml-2">Optional</Badge>
                  </Label>
                  <Input
                    id="mciScore"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 0.65"
                    value={circularityData.mciScore}
                    onChange={(e) => setCircularityData({ ...circularityData, mciScore: e.target.value })}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Material Circularity Indicator
                  </p>
                </div>
                <div>
                  <Label htmlFor="recyclingPotentialPct">Recycling Potential (%)</Label>
                  <Input
                    id="recyclingPotentialPct"
                    type="number"
                    placeholder="e.g., 88.5"
                    value={circularityData.recyclingPotentialPct}
                    onChange={(e) => setCircularityData({ ...circularityData, recyclingPotentialPct: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="resourceEfficiencyScore">Resource Efficiency (0-10)</Label>
                  <Input
                    id="resourceEfficiencyScore"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 7.2"
                    value={circularityData.resourceEfficiencyScore}
                    onChange={(e) => setCircularityData({ ...circularityData, resourceEfficiencyScore: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="extendedProductLifeYears">Product Life Extension (years)</Label>
                  <Input
                    id="extendedProductLifeYears"
                    type="number"
                    placeholder="e.g., 32"
                    value={circularityData.extendedProductLifeYears}
                    onChange={(e) => setCircularityData({ ...circularityData, extendedProductLifeYears: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="reusePotentialPct">Reuse Potential (%)</Label>
                  <Input
                    id="reusePotentialPct"
                    type="number"
                    placeholder="e.g., 68"
                    value={circularityData.reusePotentialPct}
                    onChange={(e) => setCircularityData({ ...circularityData, reusePotentialPct: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="rounded-lg border bg-secondary/30 p-4">
                  <h3 className="font-semibold mb-3">Project Information</h3>
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Project Name:</dt>
                      <dd className="font-medium">{projectData.projectName || "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Metal Type:</dt>
                      <dd className="font-medium capitalize">{projectData.metalType || "—"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border bg-secondary/30 p-4">
                  <h3 className="font-semibold mb-3">Material Data</h3>
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Quantity:</dt>
                      <dd className="font-medium">{materialData.quantityTons || "—"} tons</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Recycled Content:</dt>
                      <dd className="font-medium">{materialData.recycledContentPct || "—"}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Extraction Method:</dt>
                      <dd className="font-medium capitalize">{materialData.extractionMethod.replace("_", " ") || "—"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border bg-secondary/30 p-4">
                  <h3 className="font-semibold mb-3">Processing & Transportation</h3>
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Energy Consumption:</dt>
                      <dd className="font-medium">{processingData.energyConsumptionKwh || "—"} kWh</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Transport Distance:</dt>
                      <dd className="font-medium">{transportationData.distanceKm || "—"} km</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Transport Mode:</dt>
                      <dd className="font-medium capitalize">{transportationData.mode || "—"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg bg-accent/50 border-accent p-4">
                  <div className="flex items-start gap-3">
                    <Calculator className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Ready to Calculate Environmental Impacts</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        AI models will estimate any missing parameters and calculate CO₂ emissions, energy footprint, water usage, and circularity metrics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saving || !projectData.projectName || !projectData.metalType}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>

            {currentStep < 6 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={calculating}>
                {calculating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Submit & Calculate
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}