"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BarChart3, 
  Recycle, 
  FileText, 
  TrendingDown,
  Zap,
  Globe,
  Shield,
  Target,
  Database,
  Layers,
  LineChart,
  Leaf,
  Factory,
  Workflow,
  TrendingUp,
  Download,
  Sparkles,
  Users
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function Page() {
  return (
    <div className="min-h-dvh w-full">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20 sm:space-y-24">
        {/* Hero Section with Visual Impact */}
        <section className="pt-8 sm:pt-12 pb-12 sm:pb-16">
          <div className="text-center max-w-5xl mx-auto mb-12 sm:mb-16">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">AI-Powered LCA Platform for Mining Industry</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <span className="block">Transform Mining with</span>
              <motion.span 
                className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-600 to-teal-600 mt-2 sm:mt-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              >
                Data-Driven Circularity
              </motion.span>
            </motion.h2>
            
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
            >
              Comprehensive Life Cycle Assessment and circular mining intelligence. 
              Accelerate sustainable mineral processing with real-time, AI-driven insights.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
            >
              <Button 
                asChild 
                size="lg" 
                className="shadow-lg hover:shadow-xl transition-all gap-2 text-base h-12 px-8 w-full sm:w-auto"
              >
                <Link href="/lca">
                  <BarChart3 className="h-5 w-5" />
                  Start LCA Assessment
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="shadow-md hover:shadow-lg transition-all gap-2 text-base border-2 h-12 px-8 w-full sm:w-auto"
              >
                <Link href="/platform">
                  <BarChart3 className="h-5 w-5" />
                  Open Platform
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* What is SAMVARTANA - Enhanced Visual Section */}
        <motion.section 
          className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-card via-card to-accent/5 border border-border shadow-2xl p-6 sm:p-10 lg:p-14 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(15,118,110,0.05),transparent)]" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">About SAMVARTANA</span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">What is SAMVARTANA?</h3>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Sanskrit for <span className="font-semibold text-foreground">"completion of a cycle"</span> — representing the full circular transformation of materials in mining
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="space-y-4 sm:space-y-6">
                <motion.div 
                  className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300"
                  variants={slideInLeft}
                >
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <Database className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-base sm:text-lg mb-2">Intelligent Data Analysis</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Advanced analytics estimate missing LCA parameters using industry benchmarks, 
                      ensuring comprehensive assessments with incomplete data.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300"
                  variants={slideInLeft}
                >
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <Workflow className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-base sm:text-lg mb-2">End-to-End LCA</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Track environmental impact from extraction through processing, use phase, 
                      and end-of-life for Aluminium, Copper, and Steel.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300"
                  variants={slideInLeft}
                >
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <Recycle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-base sm:text-lg mb-2">Circularity First</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Calculate Material Circularity Index (MCI), recycling potential, and resource efficiency 
                      to quantify circular economy performance.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <motion.div 
                  className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300"
                  variants={slideInRight}
                >
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <LineChart className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-base sm:text-lg mb-2">Visual Analytics</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Interactive material flow diagrams, KPI dashboards, and scenario comparisons 
                      make complex data accessible to stakeholders.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300"
                  variants={slideInRight}
                >
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <Target className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-base sm:text-lg mb-2">Scenario Comparison</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Compare linear vs circular pathways with feasibility scores, cost analysis, 
                      and implementation roadmaps for planning.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300"
                  variants={slideInRight}
                >
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                    <Factory className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-base sm:text-lg mb-2">Industry-Specific</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Region-adaptable emission factors, processing parameters, and benchmarks 
                      tailored to mining industry requirements.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-50/50 border-2 border-primary/30 p-6 sm:p-8 text-center shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex flex-col sm:flex-row items-center justify-center gap-2">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Built for India's Ministry of Mines
              </p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
                Designed to accelerate India's transition to a circular minerals economy with 
                transparent, traceable, and actionable environmental intelligence.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Core Features - Problem Statement Alignment */}
        <section>
          <motion.div 
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Platform Capabilities</span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Complete LCA Solution</h3>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              End-to-end features covering every aspect of the circular mining economy problem statement
            </p>
          </motion.div>

          <motion.div 
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              variants={fadeInUp}
            >
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">LCA Reports</h4>
              <p className="text-muted-foreground leading-relaxed">
                Stakeholder-ready reports with CO₂, energy, water, waste metrics, and circularity scores 
                traceable to transparent assumptions.
              </p>
            </motion.div>

            <motion.div 
              className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              variants={fadeInUp}
            >
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">Smart Gap Filling</h4>
              <p className="text-muted-foreground leading-relaxed">
                Intelligent estimation for missing parameters using metal-specific industry benchmarks 
                with full transparency on data sources.
              </p>
            </motion.div>

            <motion.div 
              className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              variants={fadeInUp}
            >
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Workflow className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">Material Flow Diagrams</h4>
              <p className="text-muted-foreground leading-relaxed">
                Interactive Sankey visualizations showing lifecycle stages from extraction to end-of-life 
                with circular economy loops.
              </p>
            </motion.div>

            <motion.div 
              className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              variants={fadeInUp}
            >
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">Scenario Builder</h4>
              <p className="text-muted-foreground leading-relaxed">
                Compare multiple pathways with feasibility analysis, cost-benefit metrics, 
                and implementation complexity scores.
              </p>
            </motion.div>

            <motion.div 
              className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              variants={fadeInUp}
            >
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">Region-Adaptable</h4>
              <p className="text-muted-foreground leading-relaxed">
                Customize emission factors, energy grids, and processing parameters 
                for your specific geography and facility.
              </p>
            </motion.div>

            <motion.div 
              className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              variants={fadeInUp}
            >
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Download className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">Export & Integration</h4>
              <p className="text-muted-foreground leading-relaxed">
                Download comprehensive reports in multiple formats and integrate with existing 
                sustainability management systems.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* NEW: Regional & Industry Benchmarks Section */}
        <motion.section
          className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-card to-accent/10 border border-border shadow-2xl p-6 sm:p-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="text-center mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Industry Benchmarks</span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Performance Against Global Standards</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Compare your operations with regional and global mining industry benchmarks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="rounded-xl bg-card border-2 border-border p-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                India Mining Sector Performance
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">CO₂ Intensity (kg/tonne)</span>
                    <span className="text-sm font-semibold">420 vs 480 (avg)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[87%] bg-gradient-to-r from-emerald-500 to-emerald-600" />
                  </div>
                  <p className="text-xs text-emerald-600 font-medium mt-1">12.5% better than average</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Energy Efficiency (MJ/kg)</span>
                    <span className="text-sm font-semibold">18.2 vs 22.4 (avg)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[81%] bg-gradient-to-r from-sky-500 to-sky-600" />
                  </div>
                  <p className="text-xs text-emerald-600 font-medium mt-1">18.8% better than average</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Water Usage (m³/tonne)</span>
                    <span className="text-sm font-semibold">1.8 vs 2.3 (avg)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-gradient-to-r from-cyan-500 to-cyan-600" />
                  </div>
                  <p className="text-xs text-emerald-600 font-medium mt-1">21.7% better than average</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl bg-card border-2 border-border p-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Global Industry Leaders
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-semibold text-sm">Norway</p>
                      <p className="text-xs text-muted-foreground">Best Practice</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">340</p>
                    <p className="text-xs text-muted-foreground">kg CO₂/t</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-sky-50 border border-sky-200">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-semibold text-sm">Canada</p>
                      <p className="text-xs text-muted-foreground">Leading Practice</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sky-700">380</p>
                    <p className="text-xs text-muted-foreground">kg CO₂/t</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-semibold text-sm">Your Operation</p>
                      <p className="text-xs text-muted-foreground">Top Performer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">420</p>
                    <p className="text-xs text-muted-foreground">kg CO₂/t</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted-foreground text-white flex items-center justify-center text-xs font-bold">-</div>
                    <div>
                      <p className="font-semibold text-sm">Industry Average</p>
                      <p className="text-xs text-muted-foreground">Global Baseline</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-muted-foreground">480</p>
                    <p className="text-xs text-muted-foreground">kg CO₂/t</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section - Enhanced */}
        <motion.section 
          className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-emerald-700 to-teal-700 text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent)]" />
          <motion.div 
            className="relative z-10 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">Ready to Transform Your Operations?</h3>
            <p className="text-xl opacity-95 mb-10 leading-relaxed">
              Join the circular economy revolution. Start your first Life Cycle Assessment today 
              and discover opportunities for sustainable mineral processing.
            </p>
            <motion.div 
              className="flex flex-wrap justify-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button asChild size="lg" variant="secondary" className="shadow-2xl hover:shadow-3xl transition-all text-base h-14 px-10 font-semibold">
                <Link href="/lca">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Start LCA Assessment
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white/40 bg-white/15 hover:bg-white/25 text-white shadow-2xl text-base h-14 px-10 font-semibold backdrop-blur-sm">
                <Link href="/platform">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Explore Platform
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer with Animated Logo and Premium Developer Credits */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm mt-16 sm:mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col gap-6">
            {/* Top Row - Logo and Copyright */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="relative h-12 w-12 rounded-full overflow-hidden shadow-xl flex-shrink-0 ring-2 ring-primary/20 bg-primary"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: {
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 360,
                    transition: { duration: 0.8, ease: "easeOut" }
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-emerald-500 to-teal-500 opacity-50 blur-xl"
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <img 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/samvatana-draft-logo-1759812040224.jpeg"
                    alt="SAMVARTANA Logo"
                    className="h-full w-full object-cover scale-150 relative z-10"
                  />
                </motion.div>
                <div>
                  <span className="font-bold text-lg">SAMVARTANA</span>
                  <p className="text-xs text-primary font-semibold">Circular Mining Intelligence</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                © 2025 Circular Mining Intelligence Platform. Built for Ministry of Mines, India.
              </p>
            </div>
            
            {/* Middle Row - Team Chakra */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-6 border-b border-border/40">
              <p className="text-sm font-semibold text-foreground">Developed by Team Chakra</p>
              <div className="flex items-center gap-3">
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/team-chakra-1759712744400.jpeg"
                  alt="Team Chakra Logo"
                  className="h-12 w-auto object-contain rounded-lg shadow-md"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">SR University</p>
                  <p className="text-xs text-muted-foreground">Warangal</p>
                </div>
              </div>
            </div>

            {/* Bottom Row - Premium Developer Credits */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-primary/5 via-emerald-50/50 to-teal-50/50 border-2 border-primary/20 p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg ring-2 ring-primary/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Users className="h-7 w-7 text-white" />
                </motion.div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-muted-foreground">Developed by</p>
                  <p className="text-lg font-bold text-primary">Saikoushik Nalubola</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="default"
                  size="default"
                  className="shadow-lg hover:shadow-xl transition-all gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white border-none h-11 px-6"
                >
                  <a 
                    href="https://www.linkedin.com/in/saikoushik-nalubola-081a551a8/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <svg 
                      className="h-5 w-5 fill-current" 
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Connect on LinkedIn
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}