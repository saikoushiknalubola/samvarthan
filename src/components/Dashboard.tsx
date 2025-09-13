"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartPie,
  ChartLine,
  ChartBarIncreasing,
  LayoutDashboard,
  Percent,
  ChartNoAxesCombined,
  ChartSpline,
} from "lucide-react";

type KPI = {
  id: string;
  label: string;
  value: number;
  unit?: string;
  deltaPct?: number | null;
};

type StageDatum = {
  label: string;
  value: number;
};

type TrendPoint = {
  t: string | number;
  v: number;
};

type BarDatum = {
  label: string;
  value: number;
};

type Project = {
  id: string;
  name: string;
  subtitle?: string;
  updatedAt?: string;
  status?: "draft" | "active" | "archived";
};

export type DashboardProps = {
  className?: string;
  style?: React.CSSProperties;
  isLoading?: boolean;
  kpis?: KPI[];
  lifecycleStages?: StageDatum[];
  emissionTrend?: TrendPoint[];
  processComparison?: BarDatum[];
  recentProjects?: Project[];
  projectOptions?: { id: string; name: string }[];
  onQuickActionNewAssessment?: () => void;
  onQuickActionImportData?: () => void;
  onQuickActionCreateScenario?: () => void;
  onSearch?: (query: string) => void;
  title?: string;
};

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

function formatNumber(n: number) {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

export default function Dashboard({
  className,
  style,
  isLoading = false,
  kpis,
  lifecycleStages,
  emissionTrend,
  processComparison,
  recentProjects,
  projectOptions,
  onQuickActionNewAssessment,
  onQuickActionImportData,
  onQuickActionCreateScenario,
  onSearch,
  title = "Dashboard",
}: DashboardProps) {
  // Demo fallbacks for visual completeness
  const fallbackKPIs: KPI[] = [
    { id: "co2", label: "CO₂ Emissions", value: 12840, unit: "tCO₂e", deltaPct: -4.2 },
    { id: "energy", label: "Energy Consumption", value: 3_250_000, unit: "kWh", deltaPct: 2.1 },
    { id: "water", label: "Water Usage", value: 980_000, unit: "m³", deltaPct: -1.4 },
    { id: "waste", label: "Waste Generation", value: 6200, unit: "t", deltaPct: 0.8 },
  ];
  const fallbackStages: StageDatum[] = [
    { label: "Extraction", value: 35 },
    { label: "Processing", value: 28 },
    { label: "Transport", value: 18 },
    { label: "Refining", value: 12 },
    { label: "Other", value: 7 },
  ];
  const fallbackTrend: TrendPoint[] = [
    { t: "Jan", v: 1200 },
    { t: "Feb", v: 1150 },
    { t: "Mar", v: 1300 },
    { t: "Apr", v: 1180 },
    { t: "May", v: 1100 },
    { t: "Jun", v: 1050 },
    { t: "Jul", v: 980 },
  ];
  const fallbackBars: BarDatum[] = [
    { label: "Drilling", value: 42 },
    { label: "Hauling", value: 55 },
    { label: "Crushing", value: 38 },
    { label: "Grinding", value: 62 },
    { label: "Smelting", value: 49 },
  ];
  const fallbackProjects: Project[] = [
    { id: "p1", name: "Copper Basin LCA", subtitle: "Phase II", updatedAt: "2h ago", status: "active" },
    { id: "p2", name: "Iron Ridge Assessment", subtitle: "Exploration", updatedAt: "1d ago", status: "draft" },
    { id: "p3", name: "Lithium Valley Study", subtitle: "Pilot", updatedAt: "3d ago", status: "active" },
  ];
  const fallbackProjectOptions = [
    { id: "proj-001", name: "Copper Basin" },
    { id: "proj-002", name: "Iron Ridge" },
    { id: "proj-003", name: "Lithium Valley" },
  ];

  const kpiData = kpis && kpis.length ? kpis : fallbackKPIs;
  const stageData = lifecycleStages && lifecycleStages.length ? lifecycleStages : fallbackStages;
  const trendData = emissionTrend && emissionTrend.length ? emissionTrend : fallbackTrend;
  const barData = processComparison && processComparison.length ? processComparison : fallbackBars;
  const projects = recentProjects && recentProjects.length ? recentProjects : fallbackProjects;
  const projectSelect = projectOptions && projectOptions.length ? projectOptions : fallbackProjectOptions;

  return (
    <section
      className={cn(
        "w-full max-w-full rounded-[var(--radius)] bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        className
      )}
      style={style}
      aria-label="LCA Dashboard"
    >
      {/* Top Bar */}
      <div className="w-full rounded-t-[var(--radius)] bg-card shadow-sm border border-border">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold leading-tight truncate">{title}</h1>
              <p className="text-xs text-muted-foreground">Lifecycle Analysis Overview</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="w-full sm:w-64">
              <Select aria-label="Select project">
                <SelectTrigger className="bg-secondary/70 border-border">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projectSelect.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-72">
              <form
                role="search"
                aria-label="Search projects"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const data = new FormData(form);
                  const q = String(data.get("q") || "");
                  onSearch?.(q);
                }}
              >
                <Input
                  name="q"
                  type="search"
                  inputMode="search"
                  placeholder="Search projects, processes..."
                  className="bg-secondary/70 border-border"
                />
              </form>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 ring-1 ring-border">
                <AvatarFallback className="bg-accent text-accent-foreground">GV</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-3">
        <Button
          type="button"
          onClick={onQuickActionNewAssessment}
          className="justify-start h-auto items-start flex-col gap-1 rounded-[var(--radius-sm)] bg-card hover:bg-accent text-foreground border border-border shadow-sm p-4"
          aria-label="Start new assessment"
        >
          <div className="flex items-center gap-2">
            <ChartNoAxesCombined className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="font-semibold">New Assessment</span>
          </div>
          <span className="text-xs text-muted-foreground text-left">
            Create a lifecycle assessment for a project or scenario.
          </span>
        </Button>
        <Button
          type="button"
          onClick={onQuickActionImportData}
          className="justify-start h-auto items-start flex-col gap-1 rounded-[var(--radius-sm)] bg-card hover:bg-accent text-foreground border border-border shadow-sm p-4"
          aria-label="Import data"
        >
          <div className="flex items-center gap-2">
            <ChartBarIncreasing className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="font-semibold">Import Data</span>
          </div>
          <span className="text-xs text-muted-foreground text-left">
            Bring in activity data from CSV or integrations.
          </span>
        </Button>
        <Button
          type="button"
          onClick={onQuickActionCreateScenario}
          className="justify-start h-auto items-start flex-col gap-1 rounded-[var(--radius-sm)] bg-card hover:bg-accent text-foreground border border-border shadow-sm p-4"
          aria-label="Create scenario"
        >
          <div className="flex items-center gap-2">
            <ChartLine className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="font-semibold">New Scenario</span>
          </div>
          <span className="text-xs text-muted-foreground text-left">
            Compare process changes and reduction strategies.
          </span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(isLoading ? Array.from({ length: 4 }) : kpiData).map((k, i) =>
          isLoading ? (
            <Card
              key={`kpi-skel-${i}`}
              className="border border-border bg-card/70 rounded-[var(--radius)] shadow-sm"
            >
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-7 w-32 mb-4" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ) : (
            <Card
              key={k.id}
              className="group border border-border bg-card rounded-[var(--radius)] shadow-sm hover:shadow transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">
                  {k.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-semibold">
                    {formatNumber(k.value)}
                    {k.unit ? <span className="ml-1 text-sm text-muted-foreground">{k.unit}</span> : null}
                  </div>
                  {typeof k.deltaPct === "number" ? (
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium",
                        k.deltaPct < 0 ? "text-primary" : "text-foreground"
                      )}
                      aria-label={`Change ${k.deltaPct < 0 ? "decrease" : "increase"} ${Math.abs(
                        k.deltaPct
                      ).toFixed(1)} percent`}
                    >
                      <Percent className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
                      {k.deltaPct > 0 ? "+" : ""}
                      {k.deltaPct.toFixed(1)}%
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
                <MiniSparkline
                  data={trendData.map((d) => d.v * (0.7 + (i * 0.06)))} // slight variation per card
                  className="h-10"
                  color="var(--chart-2)"
                />
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 mt-4">
        <Card className="border border-border bg-card rounded-[var(--radius)] shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ChartPie className="h-4 w-4 text-primary" aria-hidden="true" />
                Lifecycle Stage Breakdown
              </CardTitle>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                % of total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-44 w-full rounded-[var(--radius-sm)]" />
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            ) : stageData && stageData.length ? (
              <div className="flex flex-col gap-4">
                <ResponsiveDonut data={stageData} />
                <Legend items={stageData.map((d, idx) => ({ label: d.label, color: colors[idx % colors.length] }))} />
              </div>
            ) : (
              <EmptyState message="No lifecycle stage data available." />
            )}
          </CardContent>
        </Card>

        <Card className="border border-border bg-card rounded-[var(--radius)] shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ChartLine className="h-4 w-4 text-primary" aria-hidden="true" />
                Emission Trend Over Time
              </CardTitle>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                tCO₂e
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-56 w-full rounded-[var(--radius-sm)]" />
            ) : trendData && trendData.length ? (
              <ResponsiveLine data={trendData} />
            ) : (
              <EmptyState message="No trend data available." />
            )}
          </CardContent>
        </Card>

        <Card className="border border-border bg-card rounded-[var(--radius)] shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ChartBarIncreasing className="h-4 w-4 text-primary" aria-hidden="true" />
                Process Comparison
              </CardTitle>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Index
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-56 w-full rounded-[var(--radius-sm)]" />
            ) : barData && barData.length ? (
              <ResponsiveBars data={barData} />
            ) : (
              <EmptyState message="No process comparison data available." />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="mt-6">
        <Card className="border border-border bg-card rounded-[var(--radius)] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`proj-skel-${i}`}
                    className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border p-3"
                  >
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              : projects.map((p, i) => (
                  <div
                    key={p.id}
                    className="group flex items-center gap-3 rounded-[var(--radius-sm)] border border-border bg-secondary/50 hover:bg-accent transition-colors p-3"
                  >
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-foreground"
                      style={{ backgroundColor: colors[i % colors.length] }}
                      aria-hidden="true"
                    >
                      <span className="text-sm font-semibold">{p.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate">{p.name}</p>
                        {p.status ? (
                          <Badge
                            className={cn(
                              "h-5 rounded-full text-[10px] px-2",
                              p.status === "active" ? "bg-accent text-accent-foreground" : "",
                              p.status === "draft" ? "bg-secondary text-foreground" : "",
                              p.status === "archived" ? "bg-muted text-muted-foreground" : ""
                            )}
                          >
                            {p.status}
                          </Badge>
                        ) : null}
                      </div>
                      <small className="block text-muted-foreground truncate">
                        {p.subtitle ? `${p.subtitle} • ` : ""}
                        {p.updatedAt ? `Updated ${p.updatedAt}` : ""}
                      </small>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/**
 * Mini sparkline for KPI cards using SVG path
 */
function MiniSparkline({
  data,
  className,
  color = "var(--chart-1)",
}: {
  data: number[];
  className?: string;
  color?: string;
}) {
  const points = useMemo(() => {
    const w = 240;
    const h = 40;
    if (!data.length) return { d: "", w, h };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const step = w / Math.max(1, data.length - 1);
    const pts = data.map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / span) * (h - 4) - 2;
      return [x, y];
    });
    const d = pts
      .map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`))
      .join(" ");
    return { d, w, h, pts };
  }, [data]);

  if (!data.length) {
    return <div className={cn("w-full h-10 bg-secondary rounded", className)} />;
  }

  return (
    <div className={cn("w-full", className)} role="img" aria-label="Sparkline trend">
      <svg viewBox={`0 0 ${points.w} ${points.h}`} className="w-full h-full overflow-visible">
        <path d={points.d} fill="none" stroke={color} strokeWidth={2} />
        {Array.isArray(points.pts) && points.pts.length ? (
          <circle
            cx={points.pts[points.pts.length - 1][0]}
            cy={points.pts[points.pts.length - 1][1]}
            r={3}
            fill={color}
          />
        ) : null}
      </svg>
    </div>
  );
}

/**
 * Donut chart
 */
function ResponsiveDonut({ data }: { data: StageDatum[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = 70;
  const stroke = 18;
  const c = Math.PI * 2 * radius;

  let acc = 0;
  const arcs = data.map((d, i) => {
    const portion = total ? d.value / total : 0;
    const len = portion * c;
    const dasharray = `${len} ${c - len}`;
    const dashoffset = -acc;
    acc += len;
    return {
      color: colors[i % colors.length],
      dasharray,
      dashoffset,
      label: d.label,
      value: d.value,
      portion,
    };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
      <div className="relative mx-auto">
        <svg width="180" height="180" viewBox="0 0 180 180" className="block">
          <g transform="translate(90,90)">
            <circle r={radius} fill="transparent" stroke="var(--muted)" strokeWidth={stroke} />
            {arcs.map((a, i) => (
              <circle
                key={i}
                r={radius}
                fill="transparent"
                stroke={a.color}
                strokeWidth={stroke}
                strokeDasharray={a.dasharray}
                strokeDashoffset={a.dashoffset}
                strokeLinecap="butt"
                transform="rotate(-90)"
              />
            ))}
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground"
              fontSize="14"
              fontWeight={600}
            >
              {total ? "100%" : "0%"}
            </text>
          </g>
        </svg>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: colors[i % colors.length] }}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
              <p className="truncate">{d.label}</p>
              <small className="text-muted-foreground">
                {total ? Math.round((d.value / total) * 100) : 0}%
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Line chart
 */
function ResponsiveLine({ data }: { data: TrendPoint[] }) {
  const w = 480;
  const h = 220;
  const pad = 28;

  const nums = data.map((d) => d.v);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = max - min || 1;

  const stepX = (w - pad * 2) / Math.max(1, data.length - 1);

  const pts = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((d.v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });

  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(" ");

  const gridY = 4;
  const gridLines = Array.from({ length: gridY + 1 }, (_, i) => {
    const y = pad + ((h - pad * 2) / gridY) * i;
    return y;
    // Note: visually inverted due to SVG coord system
  });

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
        {/* Grid */}
        {gridLines.map((gy, i) => (
          <line
            key={i}
            x1={pad}
            x2={w - pad}
            y1={h - gy}
            y2={h - gy}
            stroke="var(--muted)"
            strokeWidth={1}
            opacity={0.6}
          />
        ))}
        {/* Line */}
        <path d={path} fill="none" stroke="var(--chart-3)" strokeWidth={2.5} />
        {/* Area shadow */}
        <path
          d={`${path} L ${w - pad},${h - pad} L ${pad},${h - pad} Z`}
          fill="var(--chart-3)"
          opacity={0.12}
        />
        {/* Points */}
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="var(--chart-3)" />
        ))}
        {/* X labels */}
        {data.map((d, i) => (
          <text
            key={`x-${i}`}
            x={pad + i * stepX}
            y={h - 6}
            fontSize="10"
            textAnchor="middle"
            className="fill-muted-foreground"
          >
            {String(d.t)}
          </text>
        ))}
        {/* Y min/max */}
        <text x={6} y={h - pad} fontSize="10" className="fill-muted-foreground">
          {Math.round(min)}
        </text>
        <text x={6} y={pad + 10} fontSize="10" className="fill-muted-foreground">
          {Math.round(max)}
        </text>
      </svg>
    </div>
  );
}

/**
 * Bars chart
 */
function ResponsiveBars({ data }: { data: BarDatum[] }) {
  const w = 480;
  const h = 220;
  const pad = 28;
  const max = Math.max(...data.map((d) => d.value), 1);
  const innerW = w - pad * 2;
  const barGap = 12;
  const barW = (innerW - barGap * (data.length - 1)) / data.length;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
        {/* Axis */}
        <line x1={pad} x2={w - pad} y1={h - pad} y2={h - pad} stroke="var(--muted)" strokeWidth={1} />
        {/* Bars */}
        {data.map((d, i) => {
          const height = ((d.value / max) * (h - pad * 2)) | 0;
          const x = pad + i * (barW + barGap);
          const y = h - pad - height;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={height}
                rx={6}
                fill={colors[i % colors.length]}
                className="transition-opacity hover:opacity-90"
              />
              <text
                x={x + barW / 2}
                y={h - pad + 14}
                fontSize="10"
                textAnchor="middle"
                className="fill-muted-foreground"
              >
                {d.label}
              </text>
            </g>
          );
        })}
        {/* Max tick */}
        <text x={w - pad} y={pad} fontSize="10" textAnchor="end" className="fill-muted-foreground">
          {Math.round(max)}
        </text>
      </svg>
    </div>
  );
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: it.color }} aria-hidden="true" />
          <small className="text-muted-foreground">{it.label}</small>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 p-6 rounded-[var(--radius-sm)] bg-secondary/40 border border-border">
      <ChartSpline className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}