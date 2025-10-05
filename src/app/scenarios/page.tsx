import React from "react";
import ScenarioBuilder from "@/components/ScenarioBuilder";
import Dashboard from "@/components/Dashboard";

export default function Page() {
  const kpis = [
    { id: "co2", label: "CO₂ Emissions", value: 9420, unit: "tCO₂e", deltaPct: -3.1 },
    { id: "energy", label: "Energy Consumption", value: 2740000, unit: "kWh", deltaPct: 1.2 },
    { id: "water", label: "Water Usage", value: 760000, unit: "m³", deltaPct: -0.9 },
    { id: "waste", label: "Waste Generation", value: 5100, unit: "t", deltaPct: 0.6 },
  ];
  const lifecycleStages = [
    { label: "Mining", value: 33 },
    { label: "Processing", value: 27 },
    { label: "Transport", value: 16 },
    { label: "Smelting/Refining", value: 15 },
    { label: "Waste Handling/Other", value: 9 },
  ];
  const emissionTrend = [
    { t: "Jan", v: 980 },
    { t: "Feb", v: 940 },
    { t: "Mar", v: 1010 },
    { t: "Apr", v: 965 },
    { t: "May", v: 930 },
    { t: "Jun", v: 905 },
    { t: "Jul", v: 890 },
    { t: "Aug", v: 910 },
    { t: "Sep", v: 900 },
    { t: "Oct", v: 885 },
    { t: "Nov", v: 870 },
    { t: "Dec", v: 860 },
  ];
  const processComparison = [
    { label: "Drilling", value: 48 },
    { label: "Hauling", value: 58 },
    { label: "Crushing", value: 41 },
    { label: "Grinding", value: 66 },
    { label: "Smelting", value: 52 },
  ];
  const recentProjects = [
    { id: "p1", name: "Bauxite Mine LCA", subtitle: "Open-cast", updatedAt: "2h ago", status: "active" },
    { id: "p2", name: "Limestone Chain LCA", subtitle: "Cement route", updatedAt: "1d ago", status: "draft" },
    { id: "p3", name: "Urban Metal Recycling LCA", subtitle: "Urban mining", updatedAt: "3d ago", status: "active" },
  ];
  const projectOptions = [
    { id: "proj-001", name: "Bauxite Operations" },
    { id: "proj-002", name: "Limestone Chain" },
    { id: "proj-003", name: "Recycling Facility" },
  ];

  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      <header className="border-b border-border/80 bg-card/75">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Scenario Builder & Comparison</h1>
          <p className="mt-2 text-sm text-muted-foreground">Build and compare circularity pathways and quantify impact deltas.</p>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
          <ScenarioBuilder />
        </div>

        <Dashboard
          title="Scenario Impact KPIs"
          kpis={kpis}
          lifecycleStages={lifecycleStages}
          emissionTrend={emissionTrend}
          processComparison={processComparison}
          recentProjects={recentProjects}
          projectOptions={projectOptions}
        />
      </main>
    </div>
  );
}