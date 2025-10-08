"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Factory, 
  Globe, 
  TrendingUp, 
  Recycle, 
  Zap, 
  Droplets, 
  Trash2,
  AlertTriangle,
  Target,
  BarChart3,
  TrendingDown,
  Leaf,
  Layers,
  Database,
  LineChart,
  Activity,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Percent,
  Gauge,
  Building2,
  Pickaxe,
  Package
} from "lucide-react";

// Dynamic imports with loading states
const EnhancedDashboard = dynamic(() => import("@/components/EnhancedDashboard"), {
  loading: () => <div className="space-y-4 p-3 sm:p-0"><Skeleton className="h-[400px] w-full" /></div>,
  ssr: false
});

const LCAWizard = dynamic(() => import("@/components/LCAWizard"), {
  loading: () => <div className="space-y-4 p-3 sm:p-0"><Skeleton className="h-[600px] w-full" /></div>,
  ssr: false
});

const LCAResults = dynamic(() => import("@/components/LCAResults"), {
  loading: () => <div className="space-y-4 p-3 sm:p-0"><Skeleton className="h-[500px] w-full" /></div>,
  ssr: false
});

const ScenarioBuilder = dynamic(() => import("@/components/ScenarioBuilder"), {
  loading: () => <div className="space-y-4 p-3 sm:p-0"><Skeleton className="h-[500px] w-full" /></div>,
  ssr: false
});

const ReportsExport = dynamic(() => import("@/components/ReportsExport"), {
  loading: () => <div className="space-y-4 p-3 sm:p-0"><Skeleton className="h-[500px] w-full" /></div>,
  ssr: false
});

// Premium Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

export default function Page() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);

  return (
    <div className="min-h-dvh w-full bg-background">
      {/* Header - Mobile-First Perfect with Premium Animation */}
      <motion.header 
        className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Platform Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Comprehensive lifecycle assessment and circularity analytics</p>
            </motion.div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-2 w-full"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp} className="flex-1 sm:flex-none">
                <Button 
                  asChild 
                  variant="default"
                  className="w-full h-9 sm:h-10 text-sm shadow-lg hover:shadow-xl transition-all"
                  onClick={() => toast.success("Starting new assessment...")}
                >
                  <Link href="/lca">New Assessment</Link>
                </Button>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex-1 sm:flex-none">
                <Button 
                  asChild 
                  variant="outline"
                  className="w-full h-9 sm:h-10 text-sm"
                  onClick={() => toast.success("Opening scenarios...")}
                >
                  <Link href="/scenarios">Scenarios</Link>
                </Button>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex-1 sm:flex-none">
                <Button 
                  asChild 
                  variant="outline"
                  className="w-full h-9 sm:h-10 text-sm"
                  onClick={() => toast.success("Opening reports...")}
                >
                  <Link href="/reports">Reports</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Mobile-First Perfect Spacing */}
      <main className="mx-auto max-w-screen-2xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Enhanced LCA Data Visualization Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-card via-card to-accent/10 border-2 border-border shadow-2xl p-4 sm:p-6 lg:p-8"
        >
          <div className="mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-5"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Circular Mining Intelligence</span>
            </motion.div>
            <motion.h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Real-Time Environmental Performance
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Data-driven insights for Aluminium, Copper, and Steel production with complete lifecycle transparency 
              from extraction through end-of-life recovery.
            </motion.p>
          </div>

          {/* NEW: Material Flow Visualization */}
          <motion.div 
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Material Flow Analysis - Current Operations
            </h3>
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
                {/* Extraction Stage */}
                <div className="relative">
                  <div className="rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300 p-4 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Pickaxe className="h-5 w-5 text-amber-700" />
                      <h4 className="font-bold text-sm">Extraction</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Ore Grade:</span>
                        <span className="font-semibold">2.4%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Material In:</span>
                        <span className="font-semibold">10,000 t</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Recovery:</span>
                        <span className="font-semibold text-emerald-600">94.2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Processing Stage */}
                <div className="relative">
                  <div className="rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 p-4 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Factory className="h-5 w-5 text-blue-700" />
                      <h4 className="font-bold text-sm">Processing</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Efficiency:</span>
                        <span className="font-semibold">91.8%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Energy Use:</span>
                        <span className="font-semibold">18.2 MJ/kg</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Output:</span>
                        <span className="font-semibold text-emerald-600">8,650 t</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Use Phase */}
                <div className="relative">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 border-2 border-emerald-300 p-4 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-emerald-700" />
                      <h4 className="font-bold text-sm">Use Phase</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Lifespan:</span>
                        <span className="font-semibold">25-40 yr</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">In Service:</span>
                        <span className="font-semibold">8,650 t</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Degradation:</span>
                        <span className="font-semibold">~2% loss</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Collection */}
                <div className="relative">
                  <div className="rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-300 p-4 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Recycle className="h-5 w-5 text-purple-700" />
                      <h4 className="font-bold text-sm">Collection</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Collection:</span>
                        <span className="font-semibold">82%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Recovered:</span>
                        <span className="font-semibold">7,090 t</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground text-red-600">Landfill:</span>
                        <span className="font-semibold text-red-600">1,560 t</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Recycling */}
                <div className="relative">
                  <div className="rounded-xl bg-gradient-to-br from-teal-100 to-teal-50 border-2 border-teal-300 p-4 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="h-5 w-5 text-teal-700" />
                      <h4 className="font-bold text-sm">Recycling</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Recycled:</span>
                        <span className="font-semibold text-emerald-600">5,100 t</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Energy Save:</span>
                        <span className="font-semibold text-emerald-600">85-95%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">CO₂ Avoid:</span>
                        <span className="font-semibold text-emerald-600">8,200 t</span>
                      </div>
                    </div>
                  </div>
                  {/* Circular loop arrow visual */}
                  <div className="hidden md:flex absolute -bottom-12 left-1/2 transform -translate-x-1/2 items-center gap-1">
                    <div className="text-xs text-emerald-600 font-semibold whitespace-nowrap">↻ Back to Processing</div>
                  </div>
                </div>
              </div>

              {/* Flow indicators */}
              <div className="mt-6 pt-4 border-t border-slate-300 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Virgin Material: 41.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-teal-500" />
                  <span className="text-muted-foreground">Recycled Material: 58.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Material Loss: 13.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">Waste to Landfill: 18%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* NEW: Environmental Impact Breakdown by Material */}
          <motion.div 
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Environmental Impact by Material Type
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Aluminium */}
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 p-5 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-base">Aluminium</h4>
                  <div className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-semibold text-emerald-700">
                    76% Circular
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">CO₂ Emissions (kg/kg)</span>
                      <span className="font-semibold">9.2</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-400 to-red-500" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Energy (MJ/kg)</span>
                      <span className="font-semibold">45.8</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Water Usage (L/kg)</span>
                      <span className="font-semibold">1,280</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-400 to-sky-500" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-300 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Virgin vs Recycled:</span>
                      <span className="font-semibold">24% / 76%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-600">Recycling Energy Savings:</span>
                      <span className="font-semibold text-emerald-600">95%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Copper */}
              <div className="rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 p-5 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-base">Copper</h4>
                  <div className="px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-xs font-semibold text-sky-700">
                    68% Circular
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">CO₂ Emissions (kg/kg)</span>
                      <span className="font-semibold">3.8</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-400 to-red-500" style={{ width: '38%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Energy (MJ/kg)</span>
                      <span className="font-semibold">68.4</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Water Usage (L/kg)</span>
                      <span className="font-semibold">440</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-400 to-sky-500" style={{ width: '27%' }} />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-orange-300 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Virgin vs Recycled:</span>
                      <span className="font-semibold">32% / 68%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-600">Recycling Energy Savings:</span>
                      <span className="font-semibold text-emerald-600">85%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Steel */}
              <div className="rounded-xl bg-gradient-to-br from-zinc-50 to-slate-100 border-2 border-zinc-300 p-5 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-base">Steel</h4>
                  <div className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-semibold text-amber-700">
                    85% Circular
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">CO₂ Emissions (kg/kg)</span>
                      <span className="font-semibold">1.9</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-400 to-red-500" style={{ width: '19%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Energy (MJ/kg)</span>
                      <span className="font-semibold">20.1</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '37%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Water Usage (L/kg)</span>
                      <span className="font-semibold">95</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-400 to-sky-500" style={{ width: '6%' }} />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-zinc-300 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Virgin vs Recycled:</span>
                      <span className="font-semibold">15% / 85%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-600">Recycling Energy Savings:</span>
                      <span className="font-semibold text-emerald-600">74%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* NEW: Water & Energy Management Dashboard */}
          <motion.div 
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              Resource Efficiency Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Water Management */}
              <div className="rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border-2 border-sky-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Water Management</h4>
                    <p className="text-xs text-muted-foreground">Consumption & Recycling</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Fresh Water Intake</span>
                      <span className="font-bold">760,000 m³/month</span>
                    </div>
                    <div className="h-3 bg-sky-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-sky-600" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Recycled Water</span>
                      <span className="font-bold text-emerald-600">542,000 m³/month</span>
                    </div>
                    <div className="h-3 bg-sky-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: '71%' }} />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-sky-300 grid grid-cols-2 gap-3">
                    <div className="text-center p-2 rounded-lg bg-white/60">
                      <p className="text-xl font-bold text-sky-700">71.3%</p>
                      <p className="text-xs text-muted-foreground">Recycling Rate</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/60">
                      <p className="text-xl font-bold text-sky-700">218k m³</p>
                      <p className="text-xs text-muted-foreground">Net Consumption</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Management */}
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Energy Mix</h4>
                    <p className="text-xs text-muted-foreground">Source Breakdown</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Renewable Energy</span>
                      <span className="font-bold text-emerald-600">658,000 kWh</span>
                    </div>
                    <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: '24%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Grid Energy (Coal)</span>
                      <span className="font-bold">2,082,000 kWh</span>
                    </div>
                    <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-red-600" style={{ width: '76%' }} />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-amber-300 grid grid-cols-2 gap-3">
                    <div className="text-center p-2 rounded-lg bg-white/60">
                      <p className="text-xl font-bold text-emerald-600">24%</p>
                      <p className="text-xs text-muted-foreground">Renewable</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/60">
                      <p className="text-xl font-bold text-amber-700">18.2 MJ/kg</p>
                      <p className="text-xs text-muted-foreground">Intensity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* NEW: Waste Stream Analysis */}
          <motion.div 
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-primary" />
              Waste Management & Recovery
            </h3>
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <div className="text-center p-4 rounded-lg bg-white/70 border border-purple-200">
                  <p className="text-xs text-muted-foreground mb-1">Tailings</p>
                  <p className="text-2xl font-bold text-purple-700">38,500 t</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">42% recovered</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/70 border border-purple-200">
                  <p className="text-xs text-muted-foreground mb-1">Slag</p>
                  <p className="text-2xl font-bold text-purple-700">12,200 t</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">85% repurposed</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/70 border border-purple-200">
                  <p className="text-xs text-muted-foreground mb-1">Scrap Metal</p>
                  <p className="text-2xl font-bold text-purple-700">5,100 t</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">100% recycled</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/70 border border-purple-200">
                  <p className="text-xs text-muted-foreground mb-1">Hazardous</p>
                  <p className="text-2xl font-bold text-red-700">280 t</p>
                  <p className="text-xs text-muted-foreground mt-1">Safely disposed</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-lg bg-white/70 border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <p className="font-semibold text-sm">Recovered</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600 mb-1">42,380 t</p>
                  <p className="text-xs text-muted-foreground">75.8% of total waste</p>
                </div>
                <div className="p-4 rounded-lg bg-white/70 border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Recycle className="h-5 w-5 text-sky-600" />
                    <p className="font-semibold text-sm">Repurposed</p>
                  </div>
                  <p className="text-2xl font-bold text-sky-600 mb-1">10,370 t</p>
                  <p className="text-xs text-muted-foreground">18.6% construction use</p>
                </div>
                <div className="p-4 rounded-lg bg-white/70 border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <p className="font-semibold text-sm">Landfilled</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600 mb-1">3,130 t</p>
                  <p className="text-xs text-muted-foreground">5.6% to disposal</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* NEW: Regional Performance Comparison */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              India vs Global Mining Performance
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* India Operations */}
              <div className="rounded-xl bg-gradient-to-br from-primary/5 to-emerald-50 border-2 border-primary/30 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Your Operations - India</h4>
                    <p className="text-xs text-emerald-600 font-medium">Top 15% Performer</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/70">
                    <span className="text-sm text-muted-foreground">CO₂ Intensity</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">420 kg/t</span>
                      <span className="text-xs text-emerald-600 font-semibold">↓ 12.5%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/70">
                    <span className="text-sm text-muted-foreground">Energy Efficiency</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">18.2 MJ/kg</span>
                      <span className="text-xs text-emerald-600 font-semibold">↓ 18.8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/70">
                    <span className="text-sm text-muted-foreground">Water Intensity</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">1.8 m³/t</span>
                      <span className="text-xs text-emerald-600 font-semibold">↓ 21.7%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Benchmarks */}
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold">Industry Benchmarks</h4>
                    <p className="text-xs text-muted-foreground">Global Averages</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/70">
                    <span className="text-sm text-muted-foreground">India Average</span>
                    <span className="font-bold text-orange-600">480 kg CO₂/t</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/70">
                    <span className="text-sm text-muted-foreground">Global Average</span>
                    <span className="font-bold text-muted-foreground">450 kg CO₂/t</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/70">
                    <span className="text-sm text-muted-foreground">Best Practice (Norway)</span>
                    <span className="font-bold text-emerald-600">340 kg CO₂/t</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-white/70">
                    <span className="text-sm text-muted-foreground">Reduction Potential</span>
                    <span className="font-bold text-primary">↓ 80 kg (19%)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Tabs with Premium Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            {/* Perfect Mobile TabsList */}
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="dashboard" className="py-2 text-xs sm:text-sm data-[state=active]:shadow-lg transition-all">Overview</TabsTrigger>
              <TabsTrigger value="assessment" className="py-2 text-xs sm:text-sm data-[state=active]:shadow-lg transition-all">Assess</TabsTrigger>
              <TabsTrigger value="results" className="py-2 text-xs sm:text-sm data-[state=active]:shadow-lg transition-all">Results</TabsTrigger>
              <TabsTrigger value="scenarios" className="py-2 text-xs sm:text-sm data-[state=active]:shadow-lg transition-all">Scenarios</TabsTrigger>
              <TabsTrigger value="reports" className="py-2 text-xs sm:text-sm data-[state=active]:shadow-lg transition-all">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <EnhancedDashboard />
              </motion.div>
            </TabsContent>

            <TabsContent value="assessment" className="mt-4 sm:mt-6">
              <motion.div 
                className="rounded-xl sm:rounded-2xl border-2 border-border bg-card p-3 sm:p-4 lg:p-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <LCAWizard draftKey="samvartana.lca.draft" />
              </motion.div>
            </TabsContent>

            <TabsContent value="results" className="mt-4 sm:mt-6">
              <motion.div 
                className="rounded-xl sm:rounded-2xl border-2 border-border bg-card p-3 sm:p-4 lg:p-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {selectedAssessmentId ? (
                  <LCAResults assessmentId={selectedAssessmentId} />
                ) : (
                  <div className="p-8 sm:p-12 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Database className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">Select an assessment to view detailed results</p>
                      <Button 
                        onClick={() => {
                          setSelectedAssessmentId(1);
                          toast.success("Loading sample results...");
                        }}
                        className="h-9 sm:h-10 shadow-lg hover:shadow-xl transition-all"
                      >
                        View Sample Results
                      </Button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="scenarios" className="mt-4 sm:mt-6">
              <motion.div 
                className="rounded-xl sm:rounded-2xl border-2 border-border bg-card p-3 sm:p-4 lg:p-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <ScenarioBuilder />
              </motion.div>
            </TabsContent>

            <TabsContent value="reports" className="mt-4 sm:mt-6">
              <motion.div 
                className="rounded-xl sm:rounded-2xl border-2 border-border bg-card p-3 sm:p-4 lg:p-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <ReportsExport />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}