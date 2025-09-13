"use client";

import React from "react";

export default function Page() {
  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      <header className="border-b border-border/80 bg-card/75">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            SAMVARTANA - Circular Mining Intelligence Platform
          </h1>
          <p className="mt-2 text-base sm:text-lg text-muted-foreground">
            AI-assisted Life Cycle Assessment and circular mining intelligence
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-12">
        {/* Hero */}
        <section className="rounded-2xl bg-card shadow-sm border border-border p-6 sm:p-10">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold">Accelerate the transition to a circular minerals economy</h2>
              <p className="mt-4 text-muted-foreground">
                Run AI-assisted Life Cycle Assessments (LCA) for Aluminium, Copper, and Steel. Quantify emissions,
                energy, water, waste, and circularity metrics. Compare linear vs circular pathways and export
                decision-ready reports for stakeholders.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/lca" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-primary-foreground font-medium hover:opacity-90">
                  Start LCA Assessment
                </a>
                <a href="/platform" className="inline-flex items-center justify-center rounded-md bg-secondary px-5 py-3 text-foreground font-medium hover:bg-secondary/80">
                  Open Platform Dashboard
                </a>
              </div>
            </div>
            <div className="relative rounded-xl border border-border bg-secondary p-6">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" /> Environmental Impact: CO₂, Energy, Water, Waste</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-sky-600" /> Circularity Metrics: MCI, Resource Efficiency, Recycling Potential</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-amber-600" /> AI Estimation for missing parameters</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-purple-600" /> Material Flow Visualization & Scenario Comparison</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-teal-700" /> Region-adaptable baselines and factors</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Highlights / Visual KPIs */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">CO₂ Emissions</p>
            <p className="mt-2 text-2xl font-semibold">9,420 <span className="text-base font-normal text-muted-foreground">tCO₂e</span></p>
            <p className="mt-1 text-xs text-emerald-700">-3.1% vs last cycle</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Energy Consumption</p>
            <p className="mt-2 text-2xl font-semibold">2.74M <span className="text-base font-normal text-muted-foreground">kWh</span></p>
            <p className="mt-1 text-xs text-emerald-700">+1.2% efficiency</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Water Usage</p>
            <p className="mt-2 text-2xl font-semibold">760k <span className="text-base font-normal text-muted-foreground">m³</span></p>
            <p className="mt-1 text-xs text-emerald-700">-0.9% vs baseline</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Waste Generation</p>
            <p className="mt-2 text-2xl font-semibold">5,100 <span className="text-base font-normal text-muted-foreground">t</span></p>
            <p className="mt-1 text-xs text-emerald-700">+0.6% recovered</p>
          </div>
        </section>

        {/* Features */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          <h3 className="text-xl sm:text-2xl font-semibold">Why SAMVARTANA</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-secondary p-5">
              <p className="font-medium">End-to-end LCA</p>
              <p className="mt-1 text-sm text-muted-foreground">From raw material extraction to end-of-life, across multiple commodities.</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary p-5">
              <p className="font-medium">Scenario Builder</p>
              <p className="mt-1 text-sm text-muted-foreground">Compare linear vs circular pathways and quantify the deltas.</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary p-5">
              <p className="font-medium">Visual Analytics</p>
              <p className="mt-1 text-sm text-muted-foreground">KPI cards, trends and flow diagrams designed for decision-makers.</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary p-5">
              <p className="font-medium">AI Assistance</p>
              <p className="mt-1 text-sm text-muted-foreground">Estimate gaps responsibly with transparent assumptions.</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary p-5">
              <p className="font-medium">Exportable Reports</p>
              <p className="mt-1 text-sm text-muted-foreground">Stakeholder-ready outputs with traceable metadata.</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary p-5">
              <p className="font-medium">Region-adaptable Data</p>
              <p className="mt-1 text-sm text-muted-foreground">Adapt factors to your geography and facility context.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-border bg-primary text-primary-foreground p-6 sm:p-10 text-center">
          <h3 className="text-2xl font-semibold">Ready to run your first assessment?</h3>
          <p className="mt-2 opacity-90">Start with the LCA Wizard or explore the platform dashboard.</p>
          <div className="mt-5 flex justify-center gap-3">
            <a href="/lca" className="inline-flex items-center justify-center rounded-md bg-card px-5 py-3 text-foreground font-medium hover:opacity-90">Start LCA</a>
            <a href="/platform" className="inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-3 font-medium hover:bg-white/10">Open Platform</a>
          </div>
        </section>
      </main>
    </div>
  );
}