"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import LCAResults from "@/components/LCAResults";

// Dynamic imports with loading states to fix loading issues
const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  loading: () => <div className="space-y-4"><Skeleton className="h-[400px] w-full" /></div>,
  ssr: false
});

const LCAWizard = dynamic(() => import("@/components/LCAWizard"), {
  loading: () => <div className="space-y-4"><Skeleton className="h-[600px] w-full" /></div>,
  ssr: false
});

const ScenarioBuilder = dynamic(() => import("@/components/ScenarioBuilder"), {
  loading: () => <div className="space-y-4"><Skeleton className="h-[500px] w-full" /></div>,
  ssr: false
});

const ReportsExport = dynamic(() => import("@/components/ReportsExport"), {
  loading: () => <div className="space-y-4"><Skeleton className="h-[500px] w-full" /></div>,
  ssr: false
});

type Section = "dashboard" | "lca" | "scenarios" | "reports" | "results";

export default function Page() {
  const [section, setSection] = React.useState<Section>("dashboard");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);

  // Generic sample KPIs and datasets (no region-specific references)
  const kpis = useMemo(
    () => [
      { id: "co2", label: "CO₂ Emissions", value: 9420, unit: "tCO₂e", deltaPct: -3.1 },
      { id: "energy", label: "Energy Consumption", value: 2740000, unit: "kWh", deltaPct: 1.2 },
      { id: "water", label: "Water Usage", value: 760000, unit: "m³", deltaPct: -0.9 },
      { id: "waste", label: "Waste Generation", value: 5100, unit: "t", deltaPct: 0.6 },
    ],
    []
  );
  const lifecycleStages = useMemo(
    () => [
      { label: "Mining", value: 33 },
      { label: "Processing", value: 27 },
      { label: "Transport", value: 16 },
      { label: "Smelting/Refining", value: 15 },
      { label: "Waste Handling/Other", value: 9 },
    ],
    []
  );
  const emissionTrend = useMemo(
    () => [
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
    ],
    []
  );
  const processComparison = useMemo(
    () => [
      { label: "Drilling", value: 48 },
      { label: "Hauling", value: 58 },
      { label: "Crushing", value: 41 },
      { label: "Grinding", value: 66 },
      { label: "Smelting", value: 52 },
    ],
    []
  );
  const recentProjects = useMemo(
    () => [
      { id: "p1", name: "Bauxite Mine LCA", subtitle: "Open-cast", updatedAt: "2h ago", status: "active" as const },
      { id: "p2", name: "Limestone Chain LCA", subtitle: "Cement route", updatedAt: "1d ago", status: "draft" as const },
      { id: "p3", name: "Urban Metal Recycling LCA", subtitle: "Urban mining", updatedAt: "3d ago", status: "active" as const },
    ],
    []
  );
  const projectOptions = useMemo(
    () => [
      { id: "proj-001", name: "Bauxite Operations" },
      { id: "proj-002", name: "Limestone Chain" },
      { id: "proj-003", name: "Recycling Facility" },
    ],
    []
  );

  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      {/* Local page tabs (header contains global nav) */}
      <header className="border-b border-border/80 bg-card/75">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Platform Dashboard</h1>
              <p className="text-sm text-muted-foreground">Overview of projects, impacts, and activity</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="secondary"><Link href="/lca">Start LCA</Link></Button>
              <Button asChild variant="secondary"><Link href="/scenarios">Scenarios</Link></Button>
              <Button asChild variant="secondary"><Link href="/reports">Reports</Link></Button>
            </div>
          </div>
          <div className="mt-4 inline-flex rounded-lg border border-border bg-secondary p-1">
            <button
              className={[
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                section === "dashboard" ? "bg-card text-foreground" : "text-foreground/70 hover:text-foreground",
              ].join(" ")}
              onClick={() => setSection("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={[
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                section === "lca" ? "bg-card text-foreground" : "text-foreground/70 hover:text-foreground",
              ].join(" ")}
              onClick={() => setSection("lca")}
            >
              LCA
            </button>
            <button
              className={[
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                section === "results" ? "bg-card text-foreground" : "text-foreground/70 hover:text-foreground",
              ].join(" ")}
              onClick={() => setSection("results")}
            >
              Results
            </button>
            <button
              className={[
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                section === "scenarios" ? "bg-card text-foreground" : "text-foreground/70 hover:text-foreground",
              ].join(" ")}
              onClick={() => setSection("scenarios")}
            >
              Scenarios
            </button>
            <button
              className={[
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                section === "reports" ? "bg-card text-foreground" : "text-foreground/70 hover:text-foreground",
              ].join(" ")}
              onClick={() => setSection("reports")}
            >
              Reports
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 py-6">
        {section === "dashboard" && (
          <Dashboard
            title="Platform Overview"
            kpis={kpis}
            lifecycleStages={lifecycleStages}
            emissionTrend={emissionTrend}
            processComparison={processComparison}
            recentProjects={recentProjects}
            projectOptions={projectOptions}
          />
        )}

        {section === "lca" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <LCAWizard draftKey="samvartana.lca.draft" />
          </div>
        )}

        {section === "results" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            {selectedAssessmentId ? (
              <LCAResults assessmentId={selectedAssessmentId} />
            ) : (
              <div className="p-12 text-center">
                <p className="text-muted-foreground mb-4">Select an assessment to view results</p>
                <Button onClick={() => setSelectedAssessmentId(1)}>View Sample Results</Button>
              </div>
            )}
          </div>
        )}

        {section === "scenarios" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
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
          </div>
        )}

        {section === "reports" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <ReportsExport />
            </div>
            <Dashboard
              title="Reporting KPIs"
              kpis={kpis}
              lifecycleStages={lifecycleStages}
              emissionTrend={emissionTrend}
              processComparison={processComparison}
              recentProjects={recentProjects}
              projectOptions={projectOptions}
            />
          </div>
        )}
      </main>
    </div>
  );
}