import ReportsExport from "@/components/ReportsExport";
import Dashboard from "@/components/Dashboard";

export default function Page() {
  const kpis = [
    { id: "co2", label: "CO₂ Emissions", value: 1200, unit: "tCO₂e", deltaPct: -1.5 },
    { id: "energy", label: "Energy Consumption", value: 850000, unit: "kWh", deltaPct: 3.0 },
    { id: "water", label: "Water Usage", value: 2400, unit: "m³", deltaPct: -0.3 },
    { id: "waste", label: "Waste Generation", value: 800, unit: "t", deltaPct: 0.1 },
  ];

  const lifecycleStages = [
    { label: "Mining", value: 30 },
    { label: "Processing", value: 32 },
    { label: "Transport", value: 12 },
    { label: "Smelting/Refining", value: 18 },
    { label: "Waste Handling/Other", value: 8 },
  ];

  const emissionTrend = [
    { t: "Jan", v: 1.4 },
    { t: "Feb", v: 1.35 },
    { t: "Mar", v: 1.45 },
    { t: "Apr", v: 1.25 },
    { t: "May", v: 1.3 },
    { t: "Jun", v: 1.35 },
    { t: "Jul", v: 1.2 },
    { t: "Aug", v: 1.25 },
    { t: "Sep", v: 1.15 },
    { t: "Oct", v: 1.2 },
    { t: "Nov", v: 1.1 },
    { t: "Dec", v: 1.2 },
  ];

  const processComparison = [
    { label: "Drilling", value: 8 },
    { label: "Hauling", value: 12 },
    { label: "Crushing", value: 15 },
    { label: "Grinding", value: 25 },
    { label: "Smelting", value: 20 },
  ];

  const recentProjects = [
    { id: "1", name: "Baseline Study", subtitle: "Global", updatedAt: "2d ago", status: "active" },
    { id: "2", name: "Efficiency Analysis", subtitle: "Global", updatedAt: "5d ago", status: "draft" },
    { id: "3", name: "Compliance Review", subtitle: "Global", updatedAt: "1w ago", status: "active" },
  ];

  const projectOptions = [
    { id: "1", name: "Baseline Scenario" },
    { id: "2", name: "Optimized Operations" },
    { id: "3", name: "Target Analysis" },
  ];

  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      <header className="border-b border-border/80 bg-card/75">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Reports & Export</h1>
            <p className="text-sm text-muted-foreground">Export decision-ready outputs with traceable metadata and professional formatting</p>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
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
      </main>
    </div>
  );
}