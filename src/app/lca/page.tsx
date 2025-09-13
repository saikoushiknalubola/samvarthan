import Link from "next/link"
import LCAAssessmentForm from "@/lib/lca"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              SAMVARTANA - Circular Mining Intelligence Platform
            </h1>
            <h2 className="text-lg font-medium text-primary mb-4">
              Ministry of Mines | JNARDDC Initiative
            </h2>
            <p className="text-base text-muted-foreground mb-4">
              Comprehensive Life Cycle Assessment tool for evaluating environmental impacts of mining operations and promoting sustainable practices in the mineral sector
            </p>
            <Link 
              href="/platform" 
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              ← Back to Platform Dashboard
            </Link>
          </div>

          {/* Visual KPIs for consistency with dashboard UI */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            <div className="rounded-xl border border-border bg-secondary p-5">
              <p className="text-sm text-muted-foreground">CO₂ Emissions</p>
              <p className="mt-2 text-2xl font-semibold">9,420 <span className="text-base font-normal text-muted-foreground">tCO₂e</span></p>
              <p className="mt-1 text-xs text-emerald-700">-3.1% vs last cycle</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-5">
              <p className="text-sm text-muted-foreground">Energy Consumption</p>
              <p className="mt-2 text-2xl font-semibold">2.74M <span className="text-base font-normal text-muted-foreground">kWh</span></p>
              <p className="mt-1 text-xs text-emerald-700">+1.2% efficiency</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-5">
              <p className="text-sm text-muted-foreground">Water Usage</p>
              <p className="mt-2 text-2xl font-semibold">760k <span className="text-base font-normal text-muted-foreground">m³</span></p>
              <p className="mt-1 text-xs text-emerald-700">-0.9% vs baseline</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-5">
              <p className="text-sm text-muted-foreground">Waste Generation</p>
              <p className="mt-2 text-2xl font-semibold">5,100 <span className="text-base font-normal text-muted-foreground">t</span></p>
              <p className="mt-1 text-xs text-emerald-700">+0.6% recovered</p>
            </div>
          </div>

          {/* Wizard progress hint */}
          <div className="mt-6 max-w-5xl mx-auto">
            <div className="rounded-lg border border-border bg-secondary p-3 text-sm text-muted-foreground">
              Follow the steps below: Project → Inventory → Impact → Circularity → Results
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <LCAAssessmentForm />
        </div>
      </div>
    </div>
  )
}