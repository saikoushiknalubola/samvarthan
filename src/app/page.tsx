"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  Download
} from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-dvh w-full">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20 sm:space-y-24">
        {/* Hero Section with Visual Impact */}
        <section className="pt-8 sm:pt-12 pb-12 sm:pb-16">
          <div className="text-center max-w-5xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8 animate-fade-in">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Professional LCA Platform for Mining Industry</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight">
              <span className="block">Transform Mining with</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-600 to-teal-600 mt-2 sm:mt-3">
                Data-Driven Circularity
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
              Comprehensive Life Cycle Assessment and circular mining intelligence. 
              Accelerate sustainable mineral processing with data-driven insights.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
              <Button 
                asChild 
                size="lg" 
                className="shadow-lg hover:shadow-xl transition-all gap-2 text-base h-12 px-8 w-full sm:w-auto"
                onClick={() => toast.success("Starting LCA Assessment...")}
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
                onClick={() => toast.success("Opening Platform Dashboard...")}
              >
                <Link href="/platform">
                  <BarChart3 className="h-5 w-5" />
                  Open Platform
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Live Metrics Dashboard */}
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-card to-accent/10 border border-border shadow-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Live Platform Metrics
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Real-time
                </div>
              </div>
              
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="group rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                    </div>
                    <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">-3.1%</div>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">CO₂ Emissions</p>
                  <p className="text-2xl sm:text-3xl font-bold">9,420<span className="text-base sm:text-lg font-normal text-muted-foreground ml-1">tCO₂e</span></p>
                </div>

                <div className="group rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 hover:shadow-xl hover:border-amber-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                    </div>
                    <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">+1.2%</div>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Energy Efficiency</p>
                  <p className="text-2xl sm:text-3xl font-bold">2.74M<span className="text-base sm:text-lg font-normal text-muted-foreground ml-1">kWh</span></p>
                </div>

                <div className="group rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 hover:shadow-xl hover:border-sky-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Recycle className="h-5 w-5 sm:h-6 sm:w-6 text-sky-600" />
                    </div>
                    <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">-0.9%</div>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Water Usage</p>
                  <p className="text-2xl sm:text-3xl font-bold">760k<span className="text-base sm:text-lg font-normal text-muted-foreground ml-1">m³</span></p>
                </div>

                <div className="group rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                    <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">+0.6%</div>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Waste Recovered</p>
                  <p className="text-2xl sm:text-3xl font-bold">5,100<span className="text-base sm:text-lg font-normal text-muted-foreground ml-1">t</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is SAMVARTANA - Enhanced Visual Section */}
        <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-card via-card to-accent/5 border border-border shadow-2xl p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(15,118,110,0.05),transparent)]" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">About SAMVARTANA</span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">What is SAMVARTANA?</h3>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Sanskrit for <span className="font-semibold text-foreground">"completion of a cycle"</span> — representing the full circular transformation of materials in mining
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
              <div className="space-y-4 sm:space-y-6">
                <div className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300">
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
                </div>

                <div className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300">
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
                </div>

                <div className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300">
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
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300">
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
                </div>

                <div className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300">
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
                </div>

                <div className="group flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl hover:bg-accent/30 transition-all duration-300">
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
                </div>
              </div>
            </div>

            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-50/50 border-2 border-primary/30 p-6 sm:p-8 text-center shadow-lg">
              <p className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex flex-col sm:flex-row items-center justify-center gap-2">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Built for India's Ministry of Mines
              </p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
                Designed to accelerate India's transition to a circular minerals economy with 
                transparent, traceable, and actionable environmental intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Core Features - Problem Statement Alignment */}
        <section>
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Platform Capabilities</span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Complete LCA Solution</h3>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              End-to-end features covering every aspect of the circular mining economy problem statement
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">LCA Reports</h4>
              <p className="text-muted-foreground leading-relaxed">
                Stakeholder-ready reports with CO₂, energy, water, waste metrics, and circularity scores 
                traceable to transparent assumptions.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">Smart Gap Filling</h4>
              <p className="text-muted-foreground leading-relaxed">
                Intelligent estimation for missing parameters using metal-specific industry benchmarks 
                with full transparency on data sources.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Workflow className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">Material Flow Diagrams</h4>
              <p className="text-muted-foreground leading-relaxed">
                Interactive Sankey visualizations showing lifecycle stages from extraction to end-of-life 
                with circular economy loops.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">Scenario Builder</h4>
              <p className="text-muted-foreground leading-relaxed">
                Compare multiple pathways with feasibility analysis, cost-benefit metrics, 
                and implementation complexity scores.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">Region-Adaptable</h4>
              <p className="text-muted-foreground leading-relaxed">
                Customize emission factors, energy grids, and processing parameters 
                for your specific geography and facility.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-border bg-card p-7 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                <Download className="h-7 w-7 text-white" />
              </div>
              <h4 className="font-bold text-xl mb-3">Export & Integration</h4>
              <p className="text-muted-foreground leading-relaxed">
                Download comprehensive reports in multiple formats and integrate with existing 
                sustainability management systems.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-emerald-700 to-teal-700 text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h3 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">Ready to Transform Your Operations?</h3>
            <p className="text-xl opacity-95 mb-10 leading-relaxed">
              Join the circular economy revolution. Start your first Life Cycle Assessment today 
              and discover opportunities for sustainable mineral processing.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
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
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm mt-16 sm:mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col gap-6">
            {/* Top Row - Logo and Copyright */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center shadow-lg">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-base">SAMVARTANA</span>
                  <p className="text-xs text-muted-foreground">Circular Mining Intelligence</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                © 2025 Circular Mining Intelligence Platform. Built for Ministry of Mines, India.
              </p>
            </div>
            
            {/* Bottom Row - Team Chakra */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
        </div>
      </footer>
    </div>
  );
}