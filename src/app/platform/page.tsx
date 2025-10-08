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
  Activity
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
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Comprehensive lifecycle assessment and analytics</p>
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
        {/* LCA Problem Statement & Industry Context Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-gradient-to-br from-card via-card to-accent/10 border-2 border-border shadow-2xl p-4 sm:p-6 lg:p-8"
        >
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Mining Industry LCA Context</span>
            </motion.div>
            <motion.h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Addressing Global Mining Challenges
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Mining accounts for 4-7% of global GHG emissions. SAMVARTANA enables data-driven circularity 
              to reduce environmental impact across aluminium, copper, and steel production lifecycles.
            </motion.p>
          </div>

          {/* Industry Statistics Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="group rounded-xl border-2 border-border bg-card p-4 sm:p-5 hover:shadow-xl hover:border-red-200 hover:-translate-y-1 transition-all duration-300"
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Factory className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">Critical</div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Global Mining Emissions</p>
              <p className="text-2xl sm:text-3xl font-bold">4-7<span className="text-base sm:text-lg font-normal text-muted-foreground ml-1">%</span></p>
              <p className="text-xs text-muted-foreground mt-2">of total GHG emissions</p>
            </motion.div>

            <motion.div 
              className="group rounded-xl border-2 border-border bg-card p-4 sm:p-5 hover:shadow-xl hover:border-amber-200 hover:-translate-y-1 transition-all duration-300"
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">High</div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Energy Intensity</p>
              <p className="text-2xl sm:text-3xl font-bold">11<span className="text-base sm:text-lg font-normal text-muted-foreground ml-1">%</span></p>
              <p className="text-xs text-muted-foreground mt-2">of global energy use</p>
            </motion.div>

            <motion.div 
              className="group rounded-xl border-2 border-border bg-card p-4 sm:p-5 hover:shadow-xl hover:border-sky-200 hover:-translate-y-1 transition-all duration-300"
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-sky-600" />
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">Urgent</div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Water Consumption</p>
              <p className="text-2xl sm:text-3xl font-bold">3<span className="text-base sm:text-lg font-normal text-muted-foreground ml-1">%</span></p>
              <p className="text-xs text-muted-foreground mt-2">of global freshwater</p>
            </motion.div>

            <motion.div 
              className="group rounded-xl border-2 border-border bg-card p-4 sm:p-5 hover:shadow-xl hover:border-purple-200 hover:-translate-y-1 transition-all duration-300"
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">Growing</div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Waste Generation</p>
              <p className="text-2xl sm:text-3xl font-bold">100B<span className="text-base sm:text-lg font-normal text-muted-foreground ml-1">t</span></p>
              <p className="text-xs text-muted-foreground mt-2">tonnes annually</p>
            </motion.div>
          </motion.div>

          {/* Circular Economy Potential */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4 sm:p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Recycle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Circular Economy Opportunity</h3>
                  <p className="text-sm text-muted-foreground">Material recycling potential</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Aluminium</p>
                  <p className="text-2xl font-bold text-emerald-700">95%</p>
                  <p className="text-xs text-muted-foreground">energy savings</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Copper</p>
                  <p className="text-2xl font-bold text-emerald-700">85%</p>
                  <p className="text-xs text-muted-foreground">energy savings</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Steel</p>
                  <p className="text-2xl font-bold text-emerald-700">74%</p>
                  <p className="text-xs text-muted-foreground">energy savings</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-teal-50 border-2 border-primary/30 p-4 sm:p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">Platform Goal</h3>
                  <p className="text-xs text-muted-foreground">Impact reduction target</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">CO₂ Reduction</span>
                  <span className="text-lg font-bold text-primary">-45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Circularity Index</span>
                  <span className="text-lg font-bold text-primary">+60%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* NEW: Lifecycle Stage Breakdown */}
          <motion.div
            className="mb-6 pt-6 border-t border-border"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h4 className="text-sm sm:text-base font-semibold mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Current Operation - Lifecycle Stage Analysis
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 p-3 sm:p-4 hover:shadow-lg transition-all">
                <p className="text-xs text-muted-foreground mb-1">Extraction</p>
                <p className="text-xl sm:text-2xl font-bold text-red-700">3,820</p>
                <p className="text-xs text-muted-foreground">tCO₂e</p>
                <div className="mt-2 pt-2 border-t border-red-200">
                  <p className="text-xs text-emerald-600 font-medium">-2.1% vs baseline</p>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 p-3 sm:p-4 hover:shadow-lg transition-all">
                <p className="text-xs text-muted-foreground mb-1">Processing</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-700">3,140</p>
                <p className="text-xs text-muted-foreground">tCO₂e</p>
                <div className="mt-2 pt-2 border-t border-amber-200">
                  <p className="text-xs text-emerald-600 font-medium">-4.8% vs baseline</p>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-sky-50 to-cyan-50 border-2 border-sky-200 p-3 sm:p-4 hover:shadow-lg transition-all">
                <p className="text-xs text-muted-foreground mb-1">Transportation</p>
                <p className="text-xl sm:text-2xl font-bold text-sky-700">1,460</p>
                <p className="text-xs text-muted-foreground">tCO₂e</p>
                <div className="mt-2 pt-2 border-t border-sky-200">
                  <p className="text-xs text-emerald-600 font-medium">-1.2% vs baseline</p>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-3 sm:p-4 hover:shadow-lg transition-all">
                <p className="text-xs text-muted-foreground mb-1">End-of-Life</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-700">1,000</p>
                <p className="text-xs text-muted-foreground">tCO₂e</p>
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <p className="text-xs text-emerald-600 font-medium">-5.1% vs baseline</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* NEW: Real-Time Processing Metrics */}
          <motion.div
            className="pt-6 border-t border-border"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h4 className="text-sm sm:text-base font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Real-Time Processing Efficiency Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border-2 border-border bg-card p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-sm">Material Recovery</h5>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Current Rate</span>
                      <span className="font-semibold">82.4%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[82%] bg-gradient-to-r from-emerald-500 to-emerald-600" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Daily Average:</span>
                    <span className="font-semibold">80.1%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-semibold text-primary">85.0%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-border bg-card p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-sm">Energy Efficiency</h5>
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Current Usage</span>
                      <span className="font-semibold">18.2 MJ/kg</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[76%] bg-gradient-to-r from-amber-500 to-amber-600" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Daily Average:</span>
                    <span className="font-semibold">19.4 MJ/kg</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-semibold text-primary">16.5 MJ/kg</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-border bg-card p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-sm">Waste Reduction</h5>
                  <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Current Rate</span>
                      <span className="font-semibold">74.8%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[75%] bg-gradient-to-r from-sky-500 to-sky-600" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Daily Average:</span>
                    <span className="font-semibold">72.3%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-semibold text-primary">78.0%</span>
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
          transition={{ duration: 0.8, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
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