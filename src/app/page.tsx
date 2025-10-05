"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  BarChart3, 
  Recycle, 
  FileText, 
  TrendingDown,
  Zap,
  Globe,
  Shield,
  Target,
  Award,
  Brain,
  ChevronRight,
  Layers,
  LineChart,
  Leaf,
  Factory,
  Workflow
} from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-background via-background to-accent/20">
      {/* Premium Header */}
      <header className="border-b border-border/40 bg-card/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">SAMVARTANA</h1>
                <p className="text-xs text-muted-foreground">Circular Mining Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/lca">Start Assessment</Link>
              </Button>
              <Button asChild size="sm" className="shadow-md">
                <Link href="/platform">
                  Dashboard
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {/* Premium Hero Section */}
        <section className="pt-8 pb-12">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Award-Winning Circular Economy Platform</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Transform Mining with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-600 to-teal-600 mt-2">
                AI-Powered Circularity
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The world's first comprehensive platform for Life Cycle Assessment and circular mining intelligence. 
              Accelerate your transition to sustainable mineral processing with AI-assisted insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all gap-2 text-base">
                <Link href="/lca">
                  <Sparkles className="h-5 w-5" />
                  Start LCA Assessment
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="shadow-md hover:shadow-lg transition-all gap-2 text-base border-2">
                <Link href="/platform">
                  <BarChart3 className="h-5 w-5" />
                  Open Platform
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Key Metrics Dashboard Preview */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-12">
            <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingDown className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">-3.1%</div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">CO₂ Emissions</p>
              <p className="text-3xl font-bold">9,420<span className="text-lg font-normal text-muted-foreground ml-1">tCO₂e</span></p>
            </div>

            <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-amber-200 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700">+1.2%</div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Energy Efficiency</p>
              <p className="text-3xl font-bold">2.74M<span className="text-lg font-normal text-muted-foreground ml-1">kWh</span></p>
            </div>

            <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-sky-200 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Recycle className="h-6 w-6 text-sky-600" />
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded-full bg-sky-50 text-sky-700">-0.9%</div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Water Usage</p>
              <p className="text-3xl font-bold">760k<span className="text-lg font-normal text-muted-foreground ml-1">m³</span></p>
            </div>

            <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-700">+0.6%</div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Waste Recovered</p>
              <p className="text-3xl font-bold">5,100<span className="text-lg font-normal text-muted-foreground ml-1">t</span></p>
            </div>
          </div>
        </section>

        {/* What is SAMVARTANA Section */}
        <section className="rounded-3xl bg-gradient-to-br from-card to-accent/5 border border-border shadow-xl p-8 sm:p-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">About the Platform</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">What is SAMVARTANA?</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Sanskrit for "completion of a cycle" — representing the full circular transformation of materials
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">AI-Powered Intelligence</h4>
                    <p className="text-muted-foreground">
                      Advanced machine learning models estimate missing LCA parameters using industry benchmarks, 
                      ensuring comprehensive assessments even with incomplete data.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Workflow className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">End-to-End LCA</h4>
                    <p className="text-muted-foreground">
                      Track environmental impact from raw material extraction through processing, use phase, 
                      and end-of-life for Aluminium, Copper, and Steel.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <Recycle className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Circularity First</h4>
                    <p className="text-muted-foreground">
                      Calculate Material Circularity Index (MCI), recycling potential, and resource efficiency 
                      to quantify circular economy performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <LineChart className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Visual Analytics</h4>
                    <p className="text-muted-foreground">
                      Interactive material flow diagrams, KPI dashboards, and scenario comparisons 
                      make complex data accessible to decision-makers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Scenario Comparison</h4>
                    <p className="text-muted-foreground">
                      Compare linear vs circular pathways with feasibility scores, cost analysis, 
                      and implementation roadmaps for strategic planning.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Factory className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Industry-Specific</h4>
                    <p className="text-muted-foreground">
                      Region-adaptable emission factors, processing parameters, and benchmarks 
                      tailored to mining industry requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
              <p className="text-lg font-medium mb-2">
                <Shield className="inline h-5 w-5 text-primary mr-2" />
                Built for India's Ministry of Mines
              </p>
              <p className="text-muted-foreground">
                Designed to accelerate India's transition to a circular minerals economy with 
                transparent, traceable, and actionable environmental intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Premium Features Grid */}
        <section>
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose SAMVARTANA</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive features designed for mining professionals, sustainability teams, and policy makers
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Comprehensive LCA Reports</h4>
              <p className="text-muted-foreground text-sm">
                Generate stakeholder-ready reports with CO₂, energy, water, waste metrics, and circularity scores 
                traceable to transparent assumptions.
              </p>
            </div>

            <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">AI Gap Filling</h4>
              <p className="text-muted-foreground text-sm">
                Intelligent estimation for missing parameters using metal-specific industry benchmarks 
                with full transparency on data sources.
              </p>
            </div>

            <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Material Flow Visualization</h4>
              <p className="text-muted-foreground text-sm">
                Interactive Sankey diagrams showing lifecycle stages from extraction to end-of-life 
                with circular economy loops.
              </p>
            </div>

            <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Scenario Builder</h4>
              <p className="text-muted-foreground text-sm">
                Compare multiple pathways with feasibility analysis, cost-benefit metrics, 
                and implementation complexity scores.
              </p>
            </div>

            <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Region-Adaptable</h4>
              <p className="text-muted-foreground text-sm">
                Customize emission factors, energy grids, and processing parameters 
                for your specific geography and facility context.
              </p>
            </div>

            <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Sustainability Ratings</h4>
              <p className="text-muted-foreground text-sm">
                Automated grading system comparing performance against industry benchmarks 
                with actionable improvement recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-emerald-700 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Operations?</h3>
            <p className="text-lg opacity-90 mb-8">
              Join the circular economy revolution. Start your first Life Cycle Assessment today 
              and discover opportunities for sustainable mineral processing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="shadow-xl hover:shadow-2xl transition-all text-base">
                <Link href="/lca">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start LCA Assessment
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white shadow-xl text-base">
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

      {/* Premium Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">SAMVARTANA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Circular Mining Intelligence Platform. Built for Ministry of Mines, India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}