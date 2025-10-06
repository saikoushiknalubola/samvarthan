"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AdvancedVisualizations from "@/components/AdvancedVisualizations";
import {
  TrendingDown,
  TrendingUp,
  Zap,
  Droplets,
  Trash2,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  BarChart3,
  ChevronDown,
} from "lucide-react";

type Project = {
  id: number;
  projectName: string;
  metalType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type EnvironmentalImpact = {
  id: number;
  assessmentId: number;
  co2EmissionsTons: number | null;
  totalEnergyKwh: number | null;
  totalWaterM3: number | null;
  totalWasteTons: number | null;
  benchmarkComparison: {
    co2PerTon: number;
    energyPerTon: number;
    co2Benchmark: number;
    energyBenchmark: number;
    co2Ratio: number;
    energyRatio: number;
    co2Performance: string;
    energyPerformance: string;
  } | null;
  sustainabilityRating: string | null;
};

type Recommendation = {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "emissions" | "energy" | "water" | "waste" | "circularity";
  potentialReduction: string;
};

export default function EnhancedDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [impacts, setImpacts] = useState<EnvironmentalImpact[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch impacts when project changes
  useEffect(() => {
    if (selectedProject) {
      fetchImpacts(selectedProject.id);
    }
  }, [selectedProject]);

  // Generate recommendations when impacts change
  useEffect(() => {
    if (impacts.length > 0 && selectedProject) {
      generateRecommendations(impacts[0], selectedProject);
    }
  }, [impacts, selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/assessments?limit=10");
      const data = await response.json();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImpacts = async (assessmentId: number) => {
    try {
      const response = await fetch(`/api/environmental-impacts?assessment_id=${assessmentId}`);
      const data = await response.json();
      setImpacts(data);
    } catch (error) {
      console.error("Error fetching impacts:", error);
    }
  };

  const generateRecommendations = (impact: EnvironmentalImpact, project: Project) => {
    const recs: Recommendation[] = [];
    
    if (impact.benchmarkComparison) {
      const { co2Ratio, energyRatio, co2Performance, energyPerformance } = impact.benchmarkComparison;

      if (co2Performance === "Worse") {
        recs.push({
          id: "co2-reduction",
          title: "Optimize CO₂ Emissions",
          description: `Your ${project.metalType} project is ${((co2Ratio - 1) * 100).toFixed(1)}% above industry benchmarks. Consider renewable energy sources and process optimization.`,
          impact: co2Ratio > 1.3 ? "high" : "medium",
          category: "emissions",
          potentialReduction: `${((co2Ratio - 1) * 100).toFixed(0)}% reduction possible`,
        });
      }

      if (energyRatio > 1.1) {
        recs.push({
          id: "energy-efficiency",
          title: "Improve Energy Efficiency",
          description: `Energy consumption is ${((energyRatio - 1) * 100).toFixed(1)}% above optimal levels. Upgrade to high-efficiency equipment and implement energy recovery systems.`,
          impact: energyRatio > 1.3 ? "high" : "medium",
          category: "energy",
          potentialReduction: `${((energyRatio - 1) * 100).toFixed(0)}% savings achievable`,
        });
      }

      if (impact.totalWaterM3 && impact.totalWaterM3 > 500000) {
        recs.push({
          id: "water-recycling",
          title: "Implement Water Recycling",
          description: "High water usage detected. Install closed-loop water recycling systems to reduce freshwater consumption by up to 60%.",
          impact: "medium",
          category: "water",
          potentialReduction: "60% water reduction",
        });
      }

      if (impact.totalWasteTons && impact.totalWasteTons > 3000) {
        recs.push({
          id: "waste-recovery",
          title: "Enhanced Waste Recovery",
          description: "Significant waste generation identified. Implement tailings reprocessing and slag utilization programs.",
          impact: "medium",
          category: "waste",
          potentialReduction: "40% waste reduction",
        });
      }
    }

    // Add circularity recommendations
    recs.push({
      id: "circularity",
      title: "Increase Material Circularity",
      description: `Integrate recycled ${project.metalType} feedstock and design for recyclability to improve Material Circularity Index (MCI).`,
      impact: "high",
      category: "circularity",
      potentialReduction: "30% virgin material reduction",
    });

    setRecommendations(recs);
  };

  const currentImpact = impacts[0];

  const kpis = useMemo(() => {
    if (!currentImpact) return [];
    
    return [
      {
        id: "co2",
        label: "CO₂ Emissions",
        value: currentImpact.co2EmissionsTons || 0,
        unit: "tCO₂e",
        trend: currentImpact.benchmarkComparison?.co2Performance === "Better" ? "down" : "up",
        trendValue: currentImpact.benchmarkComparison ? 
          `${Math.abs((currentImpact.benchmarkComparison.co2Ratio - 1) * 100).toFixed(1)}%` : null,
        icon: TrendingDown,
        color: "emerald",
      },
      {
        id: "energy",
        label: "Energy Usage",
        value: currentImpact.totalEnergyKwh || 0,
        unit: "kWh",
        trend: currentImpact.benchmarkComparison?.energyPerformance === "Better" ? "down" : "up",
        trendValue: currentImpact.benchmarkComparison ?
          `${Math.abs((currentImpact.benchmarkComparison.energyRatio - 1) * 100).toFixed(1)}%` : null,
        icon: Zap,
        color: "amber",
      },
      {
        id: "water",
        label: "Water Usage",
        value: currentImpact.totalWaterM3 || 0,
        unit: "m³",
        trend: "down",
        trendValue: null,
        icon: Droplets,
        color: "sky",
      },
      {
        id: "waste",
        label: "Waste Generated",
        value: currentImpact.totalWasteTons || 0,
        unit: "t",
        trend: "up",
        trendValue: null,
        icon: Trash2,
        color: "purple",
      },
    ];
  }, [currentImpact]);

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return n.toFixed(0);
  };

  const getRatingColor = (rating: string | null) => {
    switch (rating) {
      case "Excellent": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Good": return "text-teal-600 bg-teal-50 border-teal-200";
      case "Average": return "text-amber-600 bg-amber-50 border-amber-200";
      case "Below Average": return "text-orange-600 bg-orange-50 border-orange-200";
      case "Poor": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-muted-foreground bg-secondary border-border";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-amber-600 bg-amber-50 border-amber-200";
      case "low": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      default: return "text-muted-foreground bg-secondary border-border";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Selector & Status - FIXED */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                {/* Improved Project Selector */}
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border-2 border-border bg-background hover:bg-accent transition-colors w-full sm:w-auto sm:min-w-[280px]"
                  >
                    <span className="font-bold text-lg truncate">
                      {selectedProject?.projectName || "Select Project"}
                    </span>
                    <ChevronDown className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0",
                      isDropdownOpen && "rotate-180"
                    )} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                      {projects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project);
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0",
                            selectedProject?.id === project.id && "bg-primary/10 font-semibold"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate">{project.projectName}</span>
                            <Badge variant="outline" className="capitalize flex-shrink-0 text-xs">
                              {project.metalType}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Updated: {new Date(project.updatedAt).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <Badge variant="outline" className="capitalize flex-shrink-0">
                  {selectedProject?.metalType}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated: {selectedProject ? new Date(selectedProject.updatedAt).toLocaleDateString() : "—"}
              </p>
            </div>
            {currentImpact?.sustainabilityRating && (
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sustainability Rating</p>
                  <Badge className={cn("text-sm px-4 py-1.5", getRatingColor(currentImpact.sustainabilityRating))}>
                    {currentImpact.sustainabilityRating}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="wait">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "border-2 hover:shadow-lg transition-all duration-300",
                `hover:border-${kpi.color}-200`
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center",
                      `bg-gradient-to-br from-${kpi.color}-100 to-${kpi.color}-50`
                    )}>
                      <kpi.icon className={cn("h-6 w-6", `text-${kpi.color}-600`)} />
                    </div>
                    {kpi.trendValue && (
                      <Badge variant="outline" className={cn(
                        kpi.trend === "down" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : 
                        "text-amber-600 bg-amber-50 border-amber-200"
                      )}>
                        {kpi.trend === "down" ? "↓" : "↑"} {kpi.trendValue}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{kpi.label}</p>
                  <div className="flex items-baseline gap-2">
                    <motion.p
                      key={kpi.value}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold"
                    >
                      {formatNumber(kpi.value)}
                    </motion.p>
                    <span className="text-sm text-muted-foreground">{kpi.unit}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Advanced Visualizations - NEW! */}
      {selectedProject && (
        <AdvancedVisualizations projectId={selectedProject.id} />
      )}

      {/* Benchmark Comparison */}
      {currentImpact?.benchmarkComparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Industry Benchmark Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CO2 Benchmark */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">CO₂ Emissions per Ton</p>
                    <Badge className={cn(
                      currentImpact.benchmarkComparison.co2Performance === "Better" ?
                      "text-emerald-600 bg-emerald-50 border-emerald-200" :
                      "text-red-600 bg-red-50 border-red-200"
                    )}>
                      {currentImpact.benchmarkComparison.co2Performance}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Project</span>
                      <span className="font-semibold">{currentImpact.benchmarkComparison.co2PerTon.toFixed(2)} tCO₂e</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Industry Avg</span>
                      <span className="font-semibold">{currentImpact.benchmarkComparison.co2Benchmark.toFixed(2)} tCO₂e</span>
                    </div>
                    <div className="relative h-3 bg-secondary rounded-full overflow-hidden mt-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(currentImpact.benchmarkComparison.co2Ratio * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full",
                          currentImpact.benchmarkComparison.co2Performance === "Better" ?
                          "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                          "bg-gradient-to-r from-red-500 to-red-600"
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Energy Benchmark */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">Energy Consumption per Ton</p>
                    <Badge className={cn(
                      currentImpact.benchmarkComparison.energyPerformance === "Better" ?
                      "text-emerald-600 bg-emerald-50 border-emerald-200" :
                      "text-red-600 bg-red-50 border-red-200"
                    )}>
                      {currentImpact.benchmarkComparison.energyPerformance}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Project</span>
                      <span className="font-semibold">{formatNumber(currentImpact.benchmarkComparison.energyPerTon)} kWh</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Industry Avg</span>
                      <span className="font-semibold">{formatNumber(currentImpact.benchmarkComparison.energyBenchmark)} kWh</span>
                    </div>
                    <div className="relative h-3 bg-secondary rounded-full overflow-hidden mt-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(currentImpact.benchmarkComparison.energyRatio * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className={cn(
                          "h-full rounded-full",
                          currentImpact.benchmarkComparison.energyPerformance === "Better" ?
                          "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                          "bg-gradient-to-r from-red-500 to-red-600"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Intelligent Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex gap-4 p-4 rounded-lg border-2 hover:border-primary/40 transition-colors"
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                      rec.impact === "high" ? "bg-red-100" : rec.impact === "medium" ? "bg-amber-100" : "bg-emerald-100"
                    )}>
                      <Target className={cn(
                        "h-5 w-5",
                        rec.impact === "high" ? "text-red-600" : rec.impact === "medium" ? "text-amber-600" : "text-emerald-600"
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge className={cn("flex-shrink-0", getImpactColor(rec.impact))}>
                          {rec.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-primary border-primary/30">
                          {rec.potentialReduction}
                        </Badge>
                        <Button size="sm" variant="ghost" className="h-7 text-xs">
                          Learn More <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {!currentImpact && !loading && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Impact Data Available</h3>
            <p className="text-muted-foreground mb-6">
              Complete an LCA assessment to view environmental impact data and recommendations.
            </p>
            <Button asChild>
              <a href="/lca">Start Assessment</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}