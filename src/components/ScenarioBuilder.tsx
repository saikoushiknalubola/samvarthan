"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  GitCompare,
  Diff,
  ChartColumnBig,
  ChartNoAxesCombined,
  Columns3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Metrics = {
  emissions: number; // tCO2e
  energy: number; // MWh
  water: number; // m3
  waste: number; // t
};

type ScenarioParams = {
  recycling: number; // 0..100
  energySource: "grid" | "renewables" | "mixed";
  materialSubstitution: "none" | "low-impact" | "recycled";
  processing: "baseline" | "low-temp" | "electro";
};

export type Scenario = {
  id: string;
  name: string;
  metrics: Metrics;
  params: ScenarioParams;
  baseline?: boolean;
  saved?: boolean;
};

type FilterMode = "all" | "improved" | "regressed";

export interface ScenarioBuilderProps {
  className?: string;
  initialScenarios?: Scenario[];
  onSaveScenario?: (scenario: Scenario) => void;
  onReorder?: (scenarios: Scenario[]) => void;
}

const defaultBaseline: Scenario = {
  id: "baseline",
  name: "Baseline Assessment",
  baseline: true,
  metrics: {
    emissions: 1000,
    energy: 5000,
    water: 20000,
    waste: 800,
  },
  params: {
    recycling: 10,
    energySource: "grid",
    materialSubstitution: "none",
    processing: "baseline",
  },
};

function computeMetricsFromParams(base: Metrics, params: ScenarioParams): Metrics {
  // Simple deterministic model for demo purposes; keep performant and predictable
  // Recycling decreases emissions, energy, water, waste proportionally
  const r = params.recycling / 100; // 0..1
  // Energy source multipliers for emissions and energy
  const energyFactor =
    params.energySource === "renewables" ? 0.82 : params.energySource === "mixed" ? 0.93 : 1.0;
  const emissionEnergyCarbonFactor =
    params.energySource === "renewables" ? 0.7 : params.energySource === "mixed" ? 0.85 : 1.0;

  // Material substitution effect
  const materialFactors = {
    none: { emissions: 1.0, energy: 1.0, water: 1.0, waste: 1.0 },
    "low-impact": { emissions: 0.93, energy: 0.96, water: 0.94, waste: 0.98 },
    recycled: { emissions: 0.88, energy: 0.9, water: 0.9, waste: 0.92 },
  }[params.materialSubstitution];

  // Processing effect
  const processingFactors = {
    baseline: { emissions: 1.0, energy: 1.0, water: 1.0, waste: 1.0 },
    "low-temp": { emissions: 0.95, energy: 0.92, water: 0.98, waste: 1.0 },
    electro: { emissions: 0.9, energy: 0.88, water: 0.96, waste: 0.98 },
  }[params.processing];

  const recycleFactor = {
    emissions: 1 - r * 0.35,
    energy: 1 - r * 0.25,
    water: 1 - r * 0.3,
    waste: 1 - r * 0.5,
  };

  const metrics: Metrics = {
    emissions:
      base.emissions *
      recycleFactor.emissions *
      emissionEnergyCarbonFactor *
      materialFactors.emissions *
      processingFactors.emissions,
    energy:
      base.energy *
      recycleFactor.energy *
      energyFactor *
      materialFactors.energy *
      processingFactors.energy,
    water:
      base.water *
      recycleFactor.water *
      materialFactors.water *
      processingFactors.water,
    waste:
      base.waste *
      recycleFactor.waste *
      materialFactors.waste *
      processingFactors.waste,
  };

  return {
    emissions: Math.max(0, Math.round(metrics.emissions)),
    energy: Math.max(0, Math.round(metrics.energy)),
    water: Math.max(0, Math.round(metrics.water)),
    waste: Math.max(0, Math.round(metrics.waste)),
  };
}

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

function pctDiff(current: number, baseline: number) {
  if (baseline === 0) return 0;
  return ((current - baseline) / baseline) * 100;
}

function isImprovement(current: number, baseline: number) {
  return current < baseline;
}

const metricMeta: { key: keyof Metrics; label: string; unit: string; colorVar: string }[] = [
  { key: "emissions", label: "Emissions", unit: "tCO2e", colorVar: "var(--chart-1)" },
  { key: "energy", label: "Energy", unit: "MWh", colorVar: "var(--chart-2)" },
  { key: "water", label: "Water", unit: "m³", colorVar: "var(--chart-3)" },
  { key: "waste", label: "Waste", unit: "t", colorVar: "var(--chart-4)" },
];

export default function ScenarioBuilder({
  className,
  initialScenarios,
  onSaveScenario,
  onReorder,
}: ScenarioBuilderProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>(
    initialScenarios && initialScenarios.length
      ? initialScenarios
      : [defaultBaseline]
  );

  const baseline = useMemo(
    () => scenarios.find((s) => s.baseline) ?? scenarios[0],
    [scenarios]
  );

  const [builderName, setBuilderName] = useState("New Scenario");
  const [cloneFrom, setCloneFrom] = useState<string | undefined>(baseline?.id);
  const [params, setParams] = useState<ScenarioParams>({
    recycling: 25,
    energySource: "mixed",
    materialSubstitution: "low-impact",
    processing: "low-temp",
  });

  // Filtering and sorting
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [sortBy, setSortBy] = useState<keyof Metrics>("emissions");

  // drag-and-drop
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    if (!cloneFrom && baseline) setCloneFrom(baseline.id);
  }, [baseline, cloneFrom]);

  const handleCreateScenario = useCallback(() => {
    if (!baseline) return;
    const baseMetrics = baseline.metrics;
    const metrics = computeMetricsFromParams(baseMetrics, params);

    const newScenario: Scenario = {
      id: `scenario_${Date.now()}`,
      name: builderName.trim() || "Untitled Scenario",
      metrics,
      params: { ...params },
    };
    setScenarios((prev) => [...prev, newScenario]);
    toast.success("Scenario created", {
      description: "Your scenario has been added to the comparison.",
    });
  }, [baseline, builderName, params]);

  const handleCloneChange = useCallback(
    (id: string) => {
      setCloneFrom(id);
      const source = scenarios.find((s) => s.id === id);
      if (!source) return;
      // Seed params relative to difference from baseline if available, else defaults
      setParams((prev) => {
        const p = { ...prev };
        // No deep inference here; keep user-chosen params
        return p;
      });
    },
    [scenarios]
  );

  const filteredSortedScenarios = useMemo(() => {
    const list = scenarios.filter((s) => {
      if (!baseline || s.id === baseline.id) {
        // Baseline always visible regardless of filters; but still include in search match
        if (!search) return true;
        return s.name.toLowerCase().includes(search.toLowerCase());
      }
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      const diff = pctDiff(s.metrics[sortBy], baseline.metrics[sortBy]);
      if (filterMode === "improved") return diff < 0;
      if (filterMode === "regressed") return diff > 0;
      return true;
    });

    // Sort by selected metric delta vs baseline (baseline first)
    const sorted = list.slice().sort((a, b) => {
      if (baseline) {
        if (a.id === baseline.id) return -1;
        if (b.id === baseline.id) return 1;
        const da = pctDiff(a.metrics[sortBy], baseline.metrics[sortBy]);
        const db = pctDiff(b.metrics[sortBy], baseline.metrics[sortBy]);
        // improvements first (more negative first)
        return da - db;
      }
      return 0;
    });

    return sorted;
  }, [scenarios, baseline, search, filterMode, sortBy]);

  const handleSave = useCallback(
    (s: Scenario) => {
      const updated = scenarios.map((x) => (x.id === s.id ? { ...x, saved: true, name: s.name } : x));
      setScenarios(updated);
      onSaveScenario?.({ ...s, saved: true });
      toast.success("Scenario saved", {
        description: `"${s.name}" is now available for future reference.`,
      });
    },
    [onSaveScenario, scenarios]
  );

  const handleNameChange = useCallback(
    (id: string, name: string) => {
      setScenarios((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
    },
    []
  );

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (overIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from == null || from === overIndex) return;
    setScenarios((prev) => {
      const arr = prev.slice();
      const [moved] = arr.splice(from, 1);
      arr.splice(overIndex, 0, moved);
      onReorder?.(arr);
      return arr;
    });
  };

  // Optimization insights computed from param changes vs baseline
  const optimizationInsights = useMemo(() => {
    if (!baseline) return [];
    // Compute sensitivity per param by measuring change from baseline params to current builder params
    const baseParams = baseline.params;
    const base = baseline.metrics;

    const makeImpact = (p: Partial<ScenarioParams>, label: string) => {
      const next = computeMetricsFromParams(base, { ...baseParams, ...p });
      const delta = metricMeta.map((m) => ({
        key: m.key,
        value: pctDiff(next[m.key], base[m.key]),
      }));
      const totalImpact = delta.reduce((acc, d) => acc + Math.abs(d.value), 0) / delta.length;
      return { label, deltas: delta, totalImpact };
    };

    const impacts = [
      makeImpact({ recycling: params.recycling }, `Recycling to ${params.recycling}%`),
      makeImpact({ energySource: params.energySource }, `Energy: ${params.energySource}`),
      makeImpact(
        { materialSubstitution: params.materialSubstitution },
        `Material: ${params.materialSubstitution}`
      ),
      makeImpact({ processing: params.processing }, `Processing: ${params.processing}`),
    ];

    return impacts.sort((a, b) => a.totalImpact - b.totalImpact); // improvements (more negative) first
  }, [baseline, params]);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "w-full max-w-full bg-card rounded-2xl border border-border shadow-sm",
          "p-4 sm:p-6",
          className
        )}
        aria-label="Scenario comparison and analysis"
      >
        <div className="flex w-full items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <GitCompare className="size-5 text-[--sidebar-primary]" aria-hidden="true" />
            <h2 className="text-base sm:text-lg md:text-xl font-semibold tracking-tight truncate">
              Scenario Builder & Comparison
            </h2>
            <Badge variant="secondary" className="ml-1 rounded-full">
              LCA
            </Badge>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Comparison layout">
              <Columns3 className="size-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.message("Guide", { description: "Use the builder to create scenarios and compare side by side." })}>
              Help
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-secondary">
            <TabsTrigger value="builder" className="data-[state=active]:bg-card">
              <Diff className="mr-2 size-4" /> Create Scenario
            </TabsTrigger>
            <TabsTrigger value="compare" className="data-[state=active]:bg-card">
              <ChartNoAxesCombined className="mr-2 size-4" /> Compare & Optimize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-4">
            <Card className="w-full bg-secondary border-border p-4 sm:p-6 rounded-xl">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="scenario-name">Scenario name</Label>
                  <Input
                    id="scenario-name"
                    value={builderName}
                    onChange={(e) => setBuilderName(e.target.value)}
                    placeholder="e.g., 40% recycling + renewable energy"
                    className="bg-card"
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Clone from</Label>
                  <Select value={cloneFrom} onValueChange={handleCloneChange}>
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select a scenario to clone" />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} {s.baseline ? "(Baseline)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="grid gap-2">
                  <Label htmlFor="recycling">Recycling percentage</Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="recycling"
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={params.recycling}
                      onChange={(e) =>
                        setParams((p) => ({ ...p, recycling: Number(e.target.value) }))
                      }
                      className="w-full accent-[--primary]"
                      aria-label="Recycling percentage"
                    />
                    <Badge variant="outline" className="min-w-[3.5rem] justify-center">
                      {params.recycling}%
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Energy source</Label>
                  <Select
                    value={params.energySource}
                    onValueChange={(v: ScenarioParams["energySource"]) =>
                      setParams((p) => ({ ...p, energySource: v }))
                    }
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select energy mix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                      <SelectItem value="renewables">Renewables</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Material substitution</Label>
                  <Select
                    value={params.materialSubstitution}
                    onValueChange={(v: ScenarioParams["materialSubstitution"]) =>
                      setParams((p) => ({ ...p, materialSubstitution: v }))
                    }
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select material option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="low-impact">Low-impact</SelectItem>
                      <SelectItem value="recycled">Recycled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Processing method</Label>
                  <Select
                    value={params.processing}
                    onValueChange={(v: ScenarioParams["processing"]) =>
                      setParams((p) => ({ ...p, processing: v }))
                    }
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select processing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baseline">Baseline</SelectItem>
                      <SelectItem value="low-temp">Low-temperature</SelectItem>
                      <SelectItem value="electro">Electro-processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Compare changes against the baseline to see percentage improvements across key KPIs.
                </div>
                <Button onClick={handleCreateScenario} className="bg-[--primary] text-[--primary-foreground]">
                  <ChartColumnBig className="mr-2 size-4" />
                  Create Scenario
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="compare" className="mt-4">
            <div className="flex flex-col gap-4">
              <Card className="w-full p-4 sm:p-5 bg-secondary rounded-xl">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                  <div className="flex-1 min-w-0 grid gap-2">
                    <Label htmlFor="search">Filter scenarios</Label>
                    <Input
                      id="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name..."
                      className="bg-card"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                      value={filterMode}
                      onValueChange={(v: FilterMode) => setFilterMode(v)}
                    >
                      <SelectTrigger className="bg-card">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="improved">Improved</SelectItem>
                        <SelectItem value="regressed">Regressed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Sort by</Label>
                    <Select
                      value={sortBy}
                      onValueChange={(v: keyof Metrics) => setSortBy(v)}
                    >
                      <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emissions">Emissions</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="waste">Waste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredSortedScenarios.map((s, idx) => (
                  <Card
                    key={s.id}
                    role="group"
                    tabIndex={0}
                    aria-label={`${s.name} scenario card`}
                    draggable
                    onDragStart={onDragStart(scenarios.indexOf(s))}
                    onDragOver={onDragOver}
                    onDrop={onDrop(idx)}
                    className={cn(
                      "bg-card border-border rounded-xl p-4 sm:p-5 transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring]"
                    )}
                    style={{ cursor: "grab" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Input
                          value={s.name}
                          onChange={(e) => handleNameChange(s.id, e.target.value)}
                          className={cn(
                            "h-9 bg-secondary/60 border-transparent px-2 -mx-2",
                            "focus-visible:border-input focus-visible:bg-card"
                          )}
                          aria-label="Scenario name"
                        />
                        <div className="mt-1 flex items-center gap-2">
                          {s.baseline ? (
                            <Badge className="bg-[--accent] text-[--accent-foreground]">Baseline</Badge>
                          ) : (
                            <Badge variant="outline">Clone</Badge>
                          )}
                          {!s.baseline && baseline && (
                            <span className="text-xs text-muted-foreground">
                              vs {baseline.name}
                            </span>
                          )}
                        </div>
                      </div>
                      {!s.baseline && (
                        <div className="flex items-center gap-2 shrink-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSave(s)}
                                aria-label="Save scenario"
                              >
                                Save
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Save for future reference</TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>

                    {baseline && (
                      <div className="mt-4 grid gap-4">
                        <div className="grid grid-cols-4 gap-3">
                          {metricMeta.map((m) => {
                            const baseVal = baseline.metrics[m.key];
                            const val = s.metrics[m.key];
                            const diff = pctDiff(val, baseVal);
                            const improved = isImprovement(val, baseVal);
                            const color =
                              diff === 0
                                ? "text-muted-foreground"
                                : improved
                                ? "text-[--primary]"
                                : "text-[--destructive]";
                            const bg =
                              diff === 0
                                ? "bg-muted"
                                : improved
                                ? "bg-[--accent]"
                                : "bg-[--destructive]/10";
                            return (
                              <div key={m.key} className="min-w-0">
                                <div className="text-xs text-muted-foreground">{m.label}</div>
                                <div className="flex items-baseline gap-1">
                                  <div className="text-sm font-semibold">
                                    {formatNumber(val)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{m.unit}</div>
                                </div>
                                <div className={cn("mt-1 inline-flex items-center gap-1 rounded px-2 py-0.5", bg)}>
                                  <span className={cn("text-xs font-medium", color)}>
                                    {diff > 0 ? "+" : ""}
                                    {diff.toFixed(1)}%
                                  </span>
                                  <span className="sr-only">
                                    {improved ? "Improved" : diff === 0 ? "No change" : "Regressed"}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <ChartNoAxesCombined className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Metric comparison</span>
                          </div>
                          <div className="w-full max-w-full">
                            <div className="grid grid-cols-4 gap-3">
                              {metricMeta.map((m) => {
                                const baseVal = baseline.metrics[m.key];
                                const val = s.metrics[m.key];
                                const max = Math.max(baseVal, val);
                                // Avoid overflow and ensure always visible
                                const basePct = max ? (baseVal / max) * 100 : 0;
                                const valPct = max ? (val / max) * 100 : 0;
                                return (
                                  <div key={m.key} className="min-w-0">
                                    <div className="h-16 w-full max-w-full rounded-md bg-muted p-1">
                                      <div
                                        className="h-2 rounded-sm bg-foreground/20"
                                        style={{ width: `${basePct}%` }}
                                        aria-label={`${m.label} baseline bar`}
                                        title={`Baseline ${m.label}: ${formatNumber(baseVal)} ${m.unit}`}
                                      />
                                      <div
                                        className="mt-1.5 h-3 rounded-sm"
                                        style={{
                                          width: `${valPct}%`,
                                          backgroundColor: m.colorVar,
                                        }}
                                        aria-label={`${m.label} scenario bar`}
                                        title={`${s.name} ${m.label}: ${formatNumber(val)} ${m.unit}`}
                                      />
                                    </div>
                                    <div className="mt-1 text-[10px] text-muted-foreground">
                                      {m.label}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <div className="text-xs text-muted-foreground">Parameters</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="min-w-0">
                              <span className="text-muted-foreground">Recycling:</span>{" "}
                              <span className="font-medium">{s.params.recycling}%</span>
                            </div>
                            <div className="min-w-0">
                              <span className="text-muted-foreground">Energy:</span>{" "}
                              <span className="font-medium capitalize">{s.params.energySource}</span>
                            </div>
                            <div className="min-w-0">
                              <span className="text-muted-foreground">Material:</span>{" "}
                              <span className="font-medium">{s.params.materialSubstitution}</span>
                            </div>
                            <div className="min-w-0">
                              <span className="text-muted-foreground">Processing:</span>{" "}
                              <span className="font-medium">{s.params.processing}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              <Card className="w-full bg-secondary p-4 sm:p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <ChartColumnBig className="size-4 text-muted-foreground" />
                  <h3 className="text-sm sm:text-base font-semibold">Scenario optimization</h3>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="grid gap-3">
                    <div className="text-sm text-muted-foreground">
                      Most impactful changes based on your current parameter selections:
                    </div>
                    <div className="grid gap-3">
                      {optimizationInsights.slice(0, 3).map((ins, i) => (
                        <div
                          key={ins.label}
                          className="rounded-lg bg-card border border-border p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium text-sm">{i + 1}. {ins.label}</div>
                            <Badge variant="outline">
                              Avg Δ {(ins.totalImpact >= 0 ? "+" : "")}{ins.totalImpact.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-4 gap-2">
                            {ins.deltas.map((d) => {
                              const meta = metricMeta.find((m) => m.key === d.key)!;
                              const improved = d.value < 0;
                              const color =
                                d.value === 0
                                  ? "text-muted-foreground"
                                  : improved
                                  ? "text-[--primary]"
                                  : "text-[--destructive]";
                              return (
                                <div key={d.key} className="min-w-0">
                                  <div className="text-[10px] text-muted-foreground">{meta.label}</div>
                                  <div className={cn("text-xs font-medium", color)}>
                                    {d.value > 0 ? "+" : ""}
                                    {d.value.toFixed(1)}%
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {optimizationInsights.length === 0 && (
                        <div className="text-sm text-muted-foreground">No insights available.</div>
                      )}
                    </div>
                  </div>

                  {baseline && (
                    <div className="grid gap-3">
                      <div className="text-sm text-muted-foreground">
                        Aggregate comparison against baseline:
                      </div>
                      <div className="rounded-lg bg-card border border-border p-3">
                        <div className="grid gap-3">
                          {metricMeta.map((m) => {
                            // compute best scenario improvement
                            const best = scenarios.reduce(
                              (acc, s) => {
                                const d = pctDiff(s.metrics[m.key], baseline.metrics[m.key]);
                                if (d < acc.diff) return { name: s.name, diff: d };
                                return acc;
                              },
                              { name: baseline.name, diff: 0 }
                            );
                            const improved = best.diff < 0;
                            return (
                              <div key={m.key} className="grid items-center gap-2 sm:grid-cols-3">
                                <div className="text-sm font-medium">{m.label}</div>
                                <div className="h-2 rounded-full bg-muted sm:col-span-2 overflow-hidden">
                                  <div
                                    className="h-2"
                                    style={{
                                      width: `${Math.min(100, Math.abs(best.diff))}%`,
                                      backgroundColor: m.colorVar,
                                    }}
                                    aria-label={`${m.label} best improvement bar`}
                                    title={`${m.label} best: ${best.name} (${best.diff.toFixed(1)}%)`}
                                  />
                                </div>
                                <div className={cn("text-xs", improved ? "text-[--primary]" : "text-muted-foreground")}>
                                  {best.name} {improved ? best.diff.toFixed(1) + "%" : "0%"}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}