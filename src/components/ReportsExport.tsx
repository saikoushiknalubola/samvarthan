"use client"

import * as React from "react"
import {
  FileChartLine,
  FileChartPie,
  TableOfContents,
  SwatchBook,
  ChartBar,
  FileDigit,
  FileChartColumn,
} from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ReportTemplate = "executive" | "technical" | "compliance"
type Permission = "viewer" | "editor" | "owner"

interface ReportSectionConfig {
  summary: boolean
  methodology: boolean
  results: boolean
  charts: boolean
  tables: boolean
  recommendations: boolean
  appendix: boolean
}

interface BrandingOptions {
  includeLogo: boolean
  coverPage: boolean
  theme: "emerald" | "teal" | "ocean" | "amber" | "violet"
}

interface ReportRecord {
  id: string
  name: string
  template: ReportTemplate
  createdAt: string
  createdBy: string
  tags: string[]
}

export interface ReportsExportProps {
  className?: string
  initialReports?: ReportRecord[]
  onExportPDF?: (payload: unknown) => Promise<void> | void
  onExportCSV?: (payload: unknown) => Promise<void> | void
  onShare?: (link: string, permission: Permission) => Promise<void> | void
}

const TEMPLATE_LABEL: Record<ReportTemplate, string> = {
  executive: "Executive Summary",
  technical: "Detailed Technical",
  compliance: "Compliance Report",
}

const BRAND_THEME: Record<
  BrandingOptions["theme"],
  { name: string; bg: string; border: string; text: string; accent: string; chart: string[] }
> = {
  emerald: {
    name: "Emerald",
    bg: "bg-card",
    border: "border-border",
    text: "text-foreground",
    accent: "text-[var(--color-primary)]",
    chart: ["bg-[var(--color-chart-1)]", "bg-[var(--color-chart-2)]", "bg-[var(--color-chart-3)]"],
  },
  teal: {
    name: "Teal",
    bg: "bg-card",
    border: "border-border",
    text: "text-foreground",
    accent: "text-[var(--color-chart-2)]",
    chart: ["bg-[var(--color-chart-2)]", "bg-[var(--color-chart-3)]", "bg-[var(--color-chart-1)]"],
  },
  ocean: {
    name: "Ocean",
    bg: "bg-card",
    border: "border-border",
    text: "text-foreground",
    accent: "text-[var(--color-chart-3)]",
    chart: ["bg-[var(--color-chart-3)]", "bg-[var(--color-chart-1)]", "bg-[var(--color-chart-2)]"],
  },
  amber: {
    name: "Amber",
    bg: "bg-card",
    border: "border-border",
    text: "text-foreground",
    accent: "text-[var(--color-chart-4)]",
    chart: ["bg-[var(--color-chart-4)]", "bg-[var(--color-chart-1)]", "bg-[var(--color-chart-2)]"],
  },
  violet: {
    name: "Violet",
    bg: "bg-card",
    border: "border-border",
    text: "text-foreground",
    accent: "text-[var(--color-chart-5)]",
    chart: ["bg-[var(--color-chart-5)]", "bg-[var(--color-chart-1)]", "bg-[var(--color-chart-2)]"],
  },
}

const DEFAULT_SECTIONS: ReportSectionConfig = {
  summary: true,
  methodology: true,
  results: true,
  charts: true,
  tables: true,
  recommendations: true,
  appendix: false,
}

const DEFAULT_REPORTS: ReportRecord[] = [
  {
    id: "rpt_9f3c-001",
    name: "Q2 Emissions Executive Summary",
    template: "executive",
    createdAt: "2025-08-03T10:04:00.000Z",
    createdBy: "A. Gupta",
    tags: ["emissions", "quarterly", "board"],
  },
  {
    id: "rpt_9f3c-002",
    name: "Mine 14 LCA Technical Report",
    template: "technical",
    createdAt: "2025-08-18T13:32:00.000Z",
    createdBy: "J. Singh",
    tags: ["lca", "mine-14", "scenario-a"],
  },
  {
    id: "rpt_9f3c-003",
    name: "FY Compliance 2024-25",
    template: "compliance",
    createdAt: "2025-09-01T09:12:00.000Z",
    createdBy: "Compliance Bot",
    tags: ["regulatory", "submission"],
  },
]

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

export default function ReportsExport({
  className,
  initialReports,
  onExportCSV,
  onExportPDF,
  onShare,
}: ReportsExportProps) {
  const [template, setTemplate] = React.useState<ReportTemplate>("executive")
  const [title, setTitle] = React.useState("Samvartana Sustainability Report")
  const [sections, setSections] = React.useState<ReportSectionConfig>(DEFAULT_SECTIONS)
  const [branding, setBranding] = React.useState<BrandingOptions>({ includeLogo: true, coverPage: true, theme: "emerald" })
  const [isExporting, setIsExporting] = React.useState<"pdf" | "csv" | null>(null)
  const [progress, setProgress] = React.useState(0)
  const [sharePermission, setSharePermission] = React.useState<Permission>("viewer")
  const [shareLink, setShareLink] = React.useState<string | null>(null)

  const [library] = React.useState<ReportRecord[]>(initialReports?.length ? initialReports : DEFAULT_REPORTS)
  const [search, setSearch] = React.useState("")
  const [filterTemplate, setFilterTemplate] = React.useState<ReportTemplate | "all">("all")

  // Simulate export progress
  React.useEffect(() => {
    if (!isExporting) return
    setProgress(8)
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 12)
        if (next >= 100) {
          clearInterval(id)
          setTimeout(() => {
            setIsExporting(null)
            setProgress(0)
            toast.success(`${isExporting === "pdf" ? "PDF" : "CSV"} export ready`, { duration: 2000 })
          }, 400)
        }
        return next
      })
    }, 300)
    return () => clearInterval(id)
  }, [isExporting])

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return library.filter((r) => {
      const matchesTemplate = filterTemplate === "all" ? true : r.template === filterTemplate
      const text = `${r.name} ${r.createdBy} ${r.tags.join(" ")} ${TEMPLATE_LABEL[r.template]}`.toLowerCase()
      const matchesQuery = q ? text.includes(q) : true
      return matchesTemplate && matchesQuery
    })
  }, [library, search, filterTemplate])

  function toggleSection(key: keyof ReportSectionConfig) {
    setSections((s) => ({ ...s, [key]: !s[key] }))
  }

  async function handleExport(kind: "pdf" | "csv") {
    if (isExporting) return
    setIsExporting(kind)
    setProgress(0)
    const payload = {
      title,
      template,
      sections,
      branding,
      generatedAt: new Date().toISOString(),
    }
    try {
      if (kind === "pdf") {
        await onExportPDF?.(payload)
      } else {
        await onExportCSV?.(payload)
      }
      toast.message(`Preparing ${kind.toUpperCase()}…`, { description: "We're applying Samvartana branding and layout." })
    } catch (e) {
      setIsExporting(null)
      setProgress(0)
      toast.error("Export failed", { description: e instanceof Error ? e.message : "Please try again." })
    }
  }

  async function handleShare() {
    try {
      let link = ""
      if (typeof window !== "undefined" && "crypto" in window) {
        const bytes = new Uint8Array(8)
        window.crypto.getRandomValues(bytes)
        const id = Array.from(bytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
        link = `${window.location.origin}/share/r/${id}`
      } else {
        link = `/share/r/${Math.random().toString(36).slice(2, 10)}`
      }
      setShareLink(link)
      await onShare?.(link, sharePermission)
      toast.success("Secure link generated", { description: `Permission: ${sharePermission}` })
    } catch (e) {
      toast.error("Could not generate link", { description: e instanceof Error ? e.message : "Try again later." })
    }
  }

  const theme = BRAND_THEME[branding.theme]

  return (
    <section className={["w-full max-w-full", className].filter(Boolean).join(" ")}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight">Reports & Export</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Build professional reports with Samvartana branding and export to PDF/CSV.</p>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2">
          <Button
            variant="secondary"
            className="bg-secondary text-foreground hover:bg-muted h-8 sm:h-9 text-xs sm:text-sm flex-1 sm:flex-none"
            onClick={() => {
              setTemplate("executive")
              setSections(DEFAULT_SECTIONS)
              setBranding({ includeLogo: true, coverPage: true, theme: "emerald" })
              setTitle("Samvartana Sustainability Report")
              toast.success("New report initialized")
            }}
          >
            New Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid grid-cols-3 w-full h-auto">
          <TabsTrigger value="builder" className="flex items-center gap-1 sm:gap-2 py-2 text-xs sm:text-sm">
            <FileChartLine className="size-3 sm:size-4" />
            <span className="hidden sm:inline">Builder</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-1 sm:gap-2 py-2 text-xs sm:text-sm">
            <ChartBar className="size-3 sm:size-4" />
            <span className="hidden sm:inline">Preview</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-1 sm:gap-2 py-2 text-xs sm:text-sm">
            <TableOfContents className="size-3 sm:size-4" />
            <span className="hidden sm:inline">Library</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-3 sm:mt-4">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-sm sm:text-base">Report configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 pt-0">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="report-title" className="text-xs sm:text-sm">Title</Label>
                    <Input
                      id="report-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter report title"
                      className="bg-card h-9 sm:h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template" className="text-xs sm:text-sm">Template</Label>
                    <Select
                      value={template}
                      onValueChange={(v: ReportTemplate) => setTemplate(v)}
                    >
                      <SelectTrigger id="template" className="bg-card h-9 sm:h-10 text-sm">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="executive">
                          <div className="flex items-center gap-2">
                            <FileChartPie className="size-4" />
                            Executive Summary
                          </div>
                        </SelectItem>
                        <SelectItem value="technical">
                          <div className="flex items-center gap-2">
                            <FileChartColumn className="size-4" />
                            Detailed Technical
                          </div>
                        </SelectItem>
                        <SelectItem value="compliance">
                          <div className="flex items-center gap-2">
                            <FileDigit className="size-4" />
                            Compliance Report
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-xs sm:text-sm">Sections</Label>
                    <div className="grid gap-2 sm:gap-3">
                      <SectionToggle
                        id="sec-summary"
                        label="Executive Summary"
                        checked={sections.summary}
                        onCheckedChange={() => toggleSection("summary")}
                      />
                      <SectionToggle
                        id="sec-methodology"
                        label="Methodology"
                        checked={sections.methodology}
                        onCheckedChange={() => toggleSection("methodology")}
                      />
                      <SectionToggle
                        id="sec-results"
                        label="Results & Discussion"
                        checked={sections.results}
                        onCheckedChange={() => toggleSection("results")}
                      />
                      <SectionToggle
                        id="sec-charts"
                        label="Charts & Visualizations"
                        checked={sections.charts}
                        onCheckedChange={() => toggleSection("charts")}
                      />
                      <SectionToggle
                        id="sec-tables"
                        label="Data Tables"
                        checked={sections.tables}
                        onCheckedChange={() => toggleSection("tables")}
                      />
                      <SectionToggle
                        id="sec-recommendations"
                        label="Recommendations"
                        checked={sections.recommendations}
                        onCheckedChange={() => toggleSection("recommendations")}
                      />
                      <SectionToggle
                        id="sec-appendix"
                        label="Appendix"
                        checked={sections.appendix}
                        onCheckedChange={() => toggleSection("appendix")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-xs sm:text-sm">Branding</Label>
                    <div className="flex items-center justify-between rounded-lg border p-2 sm:p-3 bg-secondary">
                      <div className="space-y-0.5 sm:space-y-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Include Samvartana logo</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Adds a branded header to all pages</p>
                      </div>
                      <Switch
                        checked={branding.includeLogo}
                        onCheckedChange={(v) => setBranding((b) => ({ ...b, includeLogo: v }))}
                        aria-label="Toggle logo"
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-2 sm:p-3 bg-secondary">
                      <div className="space-y-0.5 sm:space-y-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium">Cover page</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Insert a styled cover with summary</p>
                      </div>
                      <Switch
                        checked={branding.coverPage}
                        onCheckedChange={(v) => setBranding((b) => ({ ...b, coverPage: v }))}
                        aria-label="Toggle cover page"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme" className="text-xs sm:text-sm">Theme</Label>
                      <Select
                        value={branding.theme}
                        onValueChange={(v: BrandingOptions["theme"]) => setBranding((b) => ({ ...b, theme: v }))}
                      >
                        <SelectTrigger id="theme" className="bg-card h-9 sm:h-10 text-sm">
                          <SelectValue placeholder="Choose theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emerald">
                            <SwatchBook className="size-4 mr-2" />
                            Emerald
                          </SelectItem>
                          <SelectItem value="teal">
                            <SwatchBook className="size-4 mr-2" />
                            Teal
                          </SelectItem>
                          <SelectItem value="ocean">
                            <SwatchBook className="size-4 mr-2" />
                            Ocean
                          </SelectItem>
                          <SelectItem value="amber">
                            <SwatchBook className="size-4 mr-2" />
                            Amber
                          </SelectItem>
                          <SelectItem value="violet">
                            <SwatchBook className="size-4 mr-2" />
                            Violet
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleExport("pdf")}
                      className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-95 h-9 sm:h-10 text-sm flex-1 sm:flex-none"
                      disabled={!!isExporting}
                    >
                      <FileChartLine className="size-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleExport("csv")}
                      className="bg-secondary text-foreground hover:bg-muted h-9 sm:h-10 text-sm flex-1 sm:flex-none"
                      disabled={!!isExporting}
                    >
                      <FileChartColumn className="size-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Select value={sharePermission} onValueChange={(v: Permission) => setSharePermission(v)}>
                      <SelectTrigger className="w-full sm:w-[160px] bg-card h-9 sm:h-10 text-sm" aria-label="Share permission">
                        <SelectValue placeholder="Permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleShare} className="border-border h-9 sm:h-10 text-sm flex-1 sm:flex-none">
                      Share secure link
                    </Button>
                  </div>
                </div>

                {isExporting && (
                  <div aria-live="polite" className="rounded-lg border p-2 sm:p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs sm:text-sm font-medium">
                        Exporting {isExporting.toUpperCase()}…
                      </p>
                      <span className="text-xs text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5 sm:h-2" />
                  </div>
                )}

                {shareLink && (
                  <div className="rounded-lg border p-2 sm:p-3 bg-accent/40">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Share link (expires in 7 days)</p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Input readOnly value={shareLink} className="bg-card h-9 sm:h-10 text-xs sm:text-sm flex-1" />
                      <Button
                        variant="secondary"
                        className="bg-secondary text-foreground hover:bg-muted h-9 sm:h-10 text-sm"
                        onClick={() => {
                          if (typeof navigator !== "undefined" && "clipboard" in navigator) {
                            navigator.clipboard.writeText(shareLink)
                            toast.success("Link copied")
                          }
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-sm sm:text-base">Live preview</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <ReportPreview
                  title={title}
                  template={template}
                  sections={sections}
                  branding={branding}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-3 sm:mt-4">
          <Card>
            <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-sm sm:text-base">Full-page preview</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="rounded-xl border bg-card">
                <ScrollArea className="h-[400px] sm:h-[520px]">
                  <div className="p-3 sm:p-4 lg:p-6">
                    <ReportPreview
                      title={title}
                      template={template}
                      sections={sections}
                      branding={branding}
                      dense={false}
                    />
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="mt-3 sm:mt-4">
          <Card>
            <CardHeader className="pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-sm sm:text-base">Reports library</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Search by name, tag, or author"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-card h-9 sm:h-10 text-sm"
                    aria-label="Search reports"
                  />
                </div>
                <div className="w-full sm:w-[220px]">
                  <Select value={filterTemplate} onValueChange={(v: ReportTemplate | "all") => setFilterTemplate(v)}>
                    <SelectTrigger className="bg-card h-9 sm:h-10 text-sm">
                      <SelectValue placeholder="Filter template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All templates</SelectItem>
                      <SelectItem value="executive">Executive Summary</SelectItem>
                      <SelectItem value="technical">Detailed Technical</SelectItem>
                      <SelectItem value="compliance">Compliance Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableCaption className="text-xs text-muted-foreground">
                    Showing {filtered.length} {filtered.length === 1 ? "report" : "reports"}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px] text-xs sm:text-sm">Name</TableHead>
                      <TableHead className="text-xs sm:text-sm">Template</TableHead>
                      <TableHead className="text-xs sm:text-sm">Created</TableHead>
                      <TableHead className="text-xs sm:text-sm">Owner</TableHead>
                      <TableHead className="min-w-[180px] text-xs sm:text-sm">Tags</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id} className="hover:bg-secondary">
                        <TableCell className="font-medium break-words text-xs sm:text-sm">{r.name}</TableCell>
                        <TableCell>
                          <div className="inline-flex items-center gap-1.5 sm:gap-2">
                            {r.template === "executive" && <FileChartPie className="size-3 sm:size-4 text-[var(--color-primary)]" />}
                            {r.template === "technical" && <FileChartColumn className="size-3 sm:size-4 text-[var(--color-primary)]" />}
                            {r.template === "compliance" && <FileDigit className="size-3 sm:size-4 text-[var(--color-primary)]" />}
                            <span className="text-xs sm:text-sm">{TEMPLATE_LABEL[r.template]}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs sm:text-sm">{formatDate(r.createdAt)}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{r.createdBy}</TableCell>
                        <TableCell className="min-w-0">
                          <div className="flex flex-wrap gap-1">
                            {r.tags.map((t) => (
                              <Badge key={t} variant="secondary" className="bg-accent text-[var(--color-accent-foreground)] text-xs">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5 sm:gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-secondary text-foreground hover:bg-muted h-7 sm:h-8 text-xs"
                              onClick={() => {
                                setTitle(r.name)
                                setTemplate(r.template)
                                toast.success("Loaded report into builder")
                              }}
                            >
                              Load
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 sm:h-8 text-xs"
                              onClick={() => {
                                toast.message("Preparing PDF…")
                                handleExport("pdf")
                              }}
                            >
                              PDF
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground text-xs sm:text-sm">
                          No reports match your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}

function SectionToggle({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 sm:gap-4 rounded-md border p-2 sm:p-3 bg-secondary">
      <div className="min-w-0">
        <Label htmlFor={id} className="font-medium text-xs sm:text-sm">{label}</Label>
      </div>
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  )
}

function ReportPreview({
  title,
  template,
  sections,
  branding,
  dense = true,
}: {
  title: string
  template: ReportTemplate
  sections: ReportSectionConfig
  branding: BrandingOptions
  dense?: boolean
}) {
  const theme = BRAND_THEME[branding.theme]
  return (
    <div
      className={[
        "w-full max-w-full rounded-xl border",
        theme.bg,
        theme.border,
        dense ? "p-3 sm:p-4" : "p-4 sm:p-6 lg:p-8",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 pb-2 sm:pb-3 border-b">
        <div className="min-w-0">
          <h3 className={["text-sm sm:text-base lg:text-lg font-semibold leading-tight truncate", theme.text].join(" ")}>
            {title}
          </h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
            {TEMPLATE_LABEL[template]} • Generated {new Date().toLocaleDateString()}
          </p>
        </div>
        {branding.includeLogo && (
          <div className="shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="size-6 sm:size-8 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] grid place-items-center text-[10px] sm:text-xs font-bold">
                SV
              </div>
              <span className={["text-xs sm:text-sm font-semibold hidden sm:inline", theme.accent].join(" ")}>Samvartana</span>
            </div>
          </div>
        )}
      </div>

      {/* Cover */}
      {branding.coverPage && (
        <div className="mt-3 sm:mt-4 rounded-lg border bg-secondary p-2 sm:p-3 lg:p-4">
          <p className="text-xs sm:text-sm font-medium">Cover summary</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
            Scope: LCA KPIs for emissions, energy, water, waste across lifecycle stages. Prepared for internal and regulatory audiences.
          </p>
        </div>
      )}

      {/* Summary */}
      {sections.summary && (
        <SectionBlock icon={<FileChartPie className="size-3 sm:size-4" />} title="Executive Summary">
          <p className="text-xs sm:text-sm">
            Overall emissions decreased 8.4% QoQ driven by process optimization and energy source shifts. Water intensity improved 5.1%.
          </p>
        </SectionBlock>
      )}

      {/* Methodology */}
      {sections.methodology && (
        <SectionBlock icon={<TableOfContents className="size-3 sm:size-4" />} title="Methodology">
          <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
            <li>Standards: ISO 14040/44, GHG Protocol</li>
            <li>Scope: Mining operations, transport, processing, waste</li>
            <li>Data: Metered energy, fuel logs, water extraction permits</li>
          </ul>
        </SectionBlock>
      )}

      {/* Results */}
      {sections.results && (
        <SectionBlock icon={<FileChartLine className="size-3 sm:size-4" />} title="Key Results">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <KPI label="Emissions (tCO₂e)" value="12,430" delta="-8.4%" />
            <KPI label="Energy (MWh)" value="28,940" delta="-3.2%" />
            <KPI label="Water (ML)" value="4.12" delta="+1.1%" />
            <KPI label="Waste (t)" value="1,240" delta="-2.0%" />
          </div>
        </SectionBlock>
      )}

      {/* Charts */}
      {sections.charts && (
        <SectionBlock icon={<ChartBar className="size-3 sm:size-4" />} title="Charts & Visualizations">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <MiniBarChart title="Emissions by stage" bars={[68, 52, 44]} theme={theme.chart} labels={["Extraction", "Processing", "Transport"]} />
            <MiniBarChart title="Energy mix" bars={[62, 28, 10]} theme={theme.chart} labels={["Grid", "Diesel", "Renewables"]} />
          </div>
        </SectionBlock>
      )}

      {/* Tables */}
      {sections.tables && (
        <SectionBlock icon={<FileChartColumn className="size-3 sm:size-4" />} title="Data Table">
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Metric</TableHead>
                  <TableHead className="text-xs sm:text-sm">Unit</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Current</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Previous</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-xs sm:text-sm">Emissions</TableCell>
                  <TableCell className="text-xs sm:text-sm">tCO₂e</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">12,430</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">13,575</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs sm:text-sm">Energy</TableCell>
                  <TableCell className="text-xs sm:text-sm">MWh</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">28,940</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">29,880</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs sm:text-sm">Water</TableCell>
                  <TableCell className="text-xs sm:text-sm">ML</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">4.12</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm">4.07</TableCell>
                </TableRow>
              </TableBody>
              <TableCaption className="text-[10px] sm:text-xs text-muted-foreground">Table generated with Samvartana styling</TableCaption>
            </Table>
          </div>
        </SectionBlock>
      )}

      {/* Recommendations */}
      {sections.recommendations && (
        <SectionBlock icon={<SwatchBook className="size-3 sm:size-4" />} title="Recommendations">
          <ol className="list-decimal pl-4 sm:pl-5 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
            <li>Scale renewable procurement to 25% of energy mix.</li>
            <li>Electrify haulage in Mine 14 pilot route.</li>
            <li>Implement water recycling in processing circuit.</li>
          </ol>
        </SectionBlock>
      )}

      {/* Appendix */}
      {sections.appendix && (
        <SectionBlock icon={<TableOfContents className="size-3 sm:size-4" />} title="Appendix">
          <p className="text-xs sm:text-sm text-muted-foreground">Additional references, data dictionaries, and calculation factors.</p>
        </SectionBlock>
      )}
    </div>
  )
}

function SectionBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-3 sm:mt-4">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
        <span className="text-[var(--color-primary)]">{icon}</span>
        <h4 className="text-xs sm:text-sm font-semibold">{title}</h4>
      </div>
      <div className="text-foreground">{children}</div>
    </div>
  )
}

function KPI({ label, value, delta }: { label: string; value: string; delta: string }) {
  const isPositive = delta.trim().startsWith("-")
  return (
    <div className="rounded-lg border p-2 sm:p-3 bg-secondary">
      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{label}</p>
      <div className="flex items-end justify-between mt-1 gap-1">
        <span className="text-sm sm:text-base font-semibold">{value}</span>
        <span
          className={[
            "text-[10px] sm:text-xs font-medium",
            isPositive ? "text-[var(--color-primary)]" : "text-[var(--color-chart-4)]",
          ].join(" ")}
        >
          {delta}
        </span>
      </div>
    </div>
  )
}

function MiniBarChart({
  title,
  bars,
  labels,
  theme,
}: {
  title: string
  bars: number[]
  labels: string[]
  theme: string[]
}) {
  const max = Math.max(...bars, 100)
  return (
    <div className="rounded-lg border p-2 sm:p-3">
      <p className="text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2 truncate">{title}</p>
      <div className="space-y-1.5 sm:space-y-2">
        {bars.map((v, i) => {
          const width = Math.round((v / max) * 100)
          return (
            <div key={i} className="w-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{labels[i] ?? `Series ${i + 1}`}</span>
                <span className="text-[10px] sm:text-xs">{v}%</span>
              </div>
              <div className="h-1.5 sm:h-2 rounded bg-muted overflow-hidden">
                <div className={["h-1.5 sm:h-2 rounded", theme[i % theme.length]].join(" ")} style={{ width: `${width}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}