"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  StepBack,
  StepForward,
  RefreshCcw,
  LoaderCircle,
  CheckCheck,
  IterationCw,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

type OreType = "iron-ore" | "bauxite" | "copper";

type EnergySource = "grid-electricity" | "diesel-generator" | "natural-gas" | "renewables";
type TransportMode = "truck" | "rail" | "ship";
type FuelType = "diesel" | "gasoline" | "lng" | "electric";
type DisposalMethod = "landfill" | "incineration" | "backfill";

interface MaterialSelection {
  oreType: OreType | "";
  oreGradePct: number | "";
  moisturePct: number | "";
  quantityTons: number | "";
}

interface Processing {
  energySource: EnergySource | "";
  equipmentEfficiencyPct: number | "";
  wasteGenerationPct: number | "";
}

interface Transportation {
  distanceKm: number | "";
  mode: TransportMode | "";
  fuelType: FuelType | "";
}

interface UsePhase {
  lifespanYears: number | "";
  maintenancePerYear: number | "";
  maintenanceEnergyKWhPerYear: number | "";
}

interface EndOfLife {
  recyclingPct: number | "";
  disposalMethod: DisposalMethod | "";
}

export interface LCAData {
  material: MaterialSelection;
  processing: Processing;
  transportation: Transportation;
  usePhase: UsePhase;
  endOfLife: EndOfLife;
}

export interface LCAWizardProps {
  className?: string;
  initialData?: Partial<LCAData>;
  defaultOre?: OreType;
  draftKey?: string; // localStorage key for persistence
  onSaveDraft?: (data: LCAData) => Promise<void> | void;
  onSubmit?: (data: LCAData) => Promise<void> | void;
  onLoadDraft?: (data: LCAData) => void;
}

const stepNames = [
  "Material Selection",
  "Processing",
  "Transportation",
  "Use Phase",
  "End of Life",
  "Review & Submit",
] as const;

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

const oreDefaults: Record<OreType, Pick<MaterialSelection, "oreGradePct" | "moisturePct">> = {
  "iron-ore": { oreGradePct: 62, moisturePct: 8 },
  bauxite: { oreGradePct: 45, moisturePct: 10 },
  copper: { oreGradePct: 1.2, moisturePct: 6 },
};

const initialState: LCAData = {
  material: {
    oreType: "",
    oreGradePct: "",
    moisturePct: "",
    quantityTons: "",
  },
  processing: {
    energySource: "",
    equipmentEfficiencyPct: "",
    wasteGenerationPct: "",
  },
  transportation: {
    distanceKm: "",
    mode: "",
    fuelType: "",
  },
  usePhase: {
    lifespanYears: "",
    maintenancePerYear: "",
    maintenanceEnergyKWhPerYear: "",
  },
  endOfLife: {
    recyclingPct: "",
    disposalMethod: "",
  },
};

export default function LCAWizard({
  className,
  initialData,
  defaultOre,
  draftKey,
  onSaveDraft,
  onSubmit,
  onLoadDraft,
}: LCAWizardProps) {
  const [step, setStep] = React.useState<StepIndex>(0);
  const [data, setData] = React.useState<LCAData>(() => {
    const base = { ...initialState };
    if (defaultOre) {
      base.material.oreType = defaultOre;
      const d = oreDefaults[defaultOre];
      base.material.oreGradePct = d.oreGradePct;
      base.material.moisturePct = d.moisturePct;
    }
    if (initialData) {
      return deepMerge(base, initialData);
    }
    return base;
  });

  const [saving, setSaving] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Load draft on mount if available and not overridden by initialData
  React.useEffect(() => {
    if (!draftKey) return;
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(draftKey) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as LCAData;
        setData((prev) => deepMerge(prev, parsed));
        onLoadDraft?.(parsed);
        toast.success("Draft loaded from this browser");
      }
    } catch {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  const totalSteps = stepNames.length;
  const progressPct = Math.round(((step + 1) / totalSteps) * 100);

  function update<K extends keyof LCAData>(section: K, updater: Partial<LCAData[K]>) {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], ...updater } }));
  }

  function validateStep(s: StepIndex): { ok: boolean; messages: string[] } {
    const messages: string[] = [];
    switch (s) {
      case 0: {
        const m = data.material;
        if (!m.oreType) messages.push("Please select an ore type.");
        if (!isNumberIn(m.oreGradePct, 0, 100)) messages.push("Ore grade must be between 0 and 100%.");
        if (!isNumberIn(m.moisturePct, 0, 100)) messages.push("Moisture must be between 0 and 100%.");
        if (!isPositive(m.quantityTons)) messages.push("Quantity must be a positive number (tons).");
        break;
      }
      case 1: {
        const p = data.processing;
        if (!p.energySource) messages.push("Select an energy source.");
        if (!isNumberIn(p.equipmentEfficiencyPct, 0, 100)) messages.push("Equipment efficiency must be 0–100%.");
        if (!isNumberIn(p.wasteGenerationPct, 0, 100)) messages.push("Waste generation must be 0–100%.");
        break;
      }
      case 2: {
        const t = data.transportation;
        if (!isPositive(t.distanceKm)) messages.push("Distance must be a positive number (km).");
        if (!t.mode) messages.push("Select a transport mode.");
        if (!t.fuelType) messages.push("Select a fuel type.");
        break;
      }
      case 3: {
        const u = data.usePhase;
        if (!isPositive(u.lifespanYears)) messages.push("Lifespan must be a positive number (years).");
        if (!isNumberIn(u.maintenancePerYear, 0, 365)) messages.push("Maintenance per year must be between 0 and 365.");
        if (!isNumberIn(u.maintenanceEnergyKWhPerYear, 0, Number.MAX_SAFE_INTEGER)) messages.push("Maintenance energy must be 0 or greater.");
        break;
      }
      case 4: {
        const e = data.endOfLife;
        if (!isNumberIn(e.recyclingPct, 0, 100)) messages.push("Recycling percentage must be 0–100%.");
        if (!e.disposalMethod) messages.push("Select a disposal method.");
        break;
      }
      default:
        break;
    }
    return { ok: messages.length === 0, messages };
  }

  function next() {
    const { ok, messages } = validateStep(step);
    if (!ok) {
      toast.error("Please fix the highlighted fields.", {
        description: messages.join(" "),
      });
      return;
    }
    setStep((s) => Math.min((s + 1) as StepIndex, (totalSteps - 1) as StepIndex));
  }

  function prev() {
    setStep((s) => Math.max((s - 1) as StepIndex, 0 as StepIndex));
  }

  async function handleSaveDraft() {
    const payload = data;
    setSaving(true);
    try {
      if (draftKey && typeof window !== "undefined") {
        window.localStorage.setItem(draftKey, JSON.stringify(payload));
      }
      await onSaveDraft?.(payload);
      toast.success("Draft saved");
    } catch (e) {
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setData(initialState);
    setStep(0);
    toast.message("Form cleared");
  }

  async function handleSubmit() {
    // validate all steps before submit
    const allIssues = ([] as string[]).concat(
      ...([0, 1, 2, 3, 4] as StepIndex[]).map((s) => validateStep(s).messages)
    );
    if (allIssues.length) {
      toast.error("Please resolve all validation errors before submitting.", {
        description: allIssues.join(" "),
      });
      setStep(0);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit?.(data);
      toast.success("Assessment submitted");
    } catch {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Card
        className={cn(
          "w-full max-w-full bg-card text-foreground shadow-sm border rounded-[var(--radius)]",
          className
        )}
      >
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-xl sm:text-2xl tracking-tight">LCA Data Wizard</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Provide lifecycle data across each phase. You can save progress anytime.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {draftKey ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (!draftKey || typeof window === "undefined") return;
                    const raw = window.localStorage.getItem(draftKey);
                    if (!raw) {
                      toast.message("No saved draft found in this browser");
                      return;
                    }
                    try {
                      const parsed = JSON.parse(raw) as LCAData;
                      setData(parsed);
                      onLoadDraft?.(parsed);
                      toast.success("Draft loaded");
                    } catch {
                      toast.error("Failed to load draft");
                    }
                  }}
                >
                  Load Draft
                </Button>
              ) : null}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleReset}
                aria-label="Clear form"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={progressPct} className="h-2" />
            <StepBar current={step} />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {step === 0 && (
            <Section title="Material Selection" description="Specify ore characteristics and quantity.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Ore Type"
                  required
                  tooltip="Select the primary ore for this assessment."
                  error={!data.material.oreType ? "Required" : ""}
                >
                  <Select
                    value={data.material.oreType}
                    onValueChange={(v: OreType) => {
                      const defaults = oreDefaults[v];
                      update("material", {
                        oreType: v,
                        oreGradePct:
                          data.material.oreGradePct === "" ? defaults.oreGradePct : data.material.oreGradePct,
                        moisturePct:
                          data.material.moisturePct === "" ? defaults.moisturePct : data.material.moisturePct,
                      });
                    }}
                  >
                    <SelectTrigger aria-label="Ore Type">
                      <SelectValue placeholder="Select ore type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iron-ore">Iron ore</SelectItem>
                      <SelectItem value="bauxite">Bauxite</SelectItem>
                      <SelectItem value="copper">Copper</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  label="Ore Grade (%)"
                  required
                  tooltip="Average metal content as a percentage."
                  error={!isNumberIn(data.material.oreGradePct, 0, 100) ? "Enter 0–100" : ""}
                  help="Typical defaults auto-fill per ore type."
                >
                  <Input
                    inputMode="decimal"
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={toStr(data.material.oreGradePct)}
                    onChange={(e) =>
                      update("material", { oreGradePct: toNumEmpty(e.currentTarget.value) })
                    }
                    aria-invalid={!isNumberIn(data.material.oreGradePct, 0, 100)}
                    aria-describedby="ore-grade-help"
                  />
                </Field>

                <Field
                  label="Moisture (%)"
                  required
                  tooltip="Average moisture content as a percentage."
                  error={!isNumberIn(data.material.moisturePct, 0, 100) ? "Enter 0–100" : ""}
                >
                  <Input
                    inputMode="decimal"
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={toStr(data.material.moisturePct)}
                    onChange={(e) =>
                      update("material", { moisturePct: toNumEmpty(e.currentTarget.value) })
                    }
                    aria-invalid={!isNumberIn(data.material.moisturePct, 0, 100)}
                  />
                </Field>

                <Field
                  label="Quantity (tons)"
                  required
                  tooltip="Total mass considered for this assessment."
                  error={!isPositive(data.material.quantityTons) ? "Enter a positive number" : ""}
                >
                  <Input
                    inputMode="decimal"
                    type="number"
                    min={0}
                    step="0.1"
                    value={toStr(data.material.quantityTons)}
                    onChange={(e) =>
                      update("material", { quantityTons: toNumEmpty(e.currentTarget.value) })
                    }
                    aria-invalid={!isPositive(data.material.quantityTons)}
                  />
                </Field>
              </div>
            </Section>
          )}

          {step === 1 && (
            <Section title="Processing" description="Define energy and process performance.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Energy Source"
                  required
                  tooltip="Primary energy used in processing."
                  error={!data.processing.energySource ? "Required" : ""}
                >
                  <Select
                    value={data.processing.energySource}
                    onValueChange={(v: EnergySource) => update("processing", { energySource: v })}
                  >
                    <SelectTrigger aria-label="Energy Source">
                      <SelectValue placeholder="Select energy source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid-electricity">Grid electricity</SelectItem>
                      <SelectItem value="diesel-generator">Diesel generator</SelectItem>
                      <SelectItem value="natural-gas">Natural gas</SelectItem>
                      <SelectItem value="renewables">Renewables</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  label="Equipment Efficiency (%)"
                  required
                  tooltip="Overall equipment effectiveness in percent."
                  error={!isNumberIn(data.processing.equipmentEfficiencyPct, 0, 100) ? "Enter 0–100" : ""}
                >
                  <Input
                    inputMode="decimal"
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={toStr(data.processing.equipmentEfficiencyPct)}
                    onChange={(e) =>
                      update("processing", { equipmentEfficiencyPct: toNumEmpty(e.currentTarget.value) })
                    }
                    aria-invalid={!isNumberIn(data.processing.equipmentEfficiencyPct, 0, 100)}
                  />
                </Field>

                <Field
                  label="Waste Generation (% of input)"
                  required
                  tooltip="Mass lost as waste relative to input."
                  error={!isNumberIn(data.processing.wasteGenerationPct, 0, 100) ? "Enter 0–100" : ""}
                >
                  <Input
                    inputMode="decimal"
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={toStr(data.processing.wasteGenerationPct)}
                    onChange={(e) =>
                      update("processing", { wasteGenerationPct: toNumEmpty(e.currentTarget.value) })
                    }
                    aria-invalid={!isNumberIn(data.processing.wasteGenerationPct, 0, 100)}
                  />
                </Field>
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Transportation" description="Distance, mode, and fuel details.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Distance (km)"
                  required
                  tooltip="Total transport distance from processing to next stage."
                  error={!isPositive(data.transportation.distanceKm) ? "Enter a positive number" : ""}
                >
                  <Input
                    inputMode="decimal"
                    type="number"
                    min={0}
                    step="0.1"
                    value={toStr(data.transportation.distanceKm)}
                    onChange={(e) =>
                      update("transportation", { distanceKm: toNumEmpty(e.currentTarget.value) })
                    }
                    aria-invalid={!isPositive(data.transportation.distanceKm)}
                  />
                </Field>

                <Field
                  label="Mode"
                  required
                  tooltip="Primary transportation mode."
                  error={!data.transportation.mode ? "Required" : ""}
                >
                  <Select
                    value={data.transportation.mode}
                    onValueChange={(v: TransportMode) => update("transportation", { mode: v })}
                  >
                    <SelectTrigger aria-label="Transport Mode">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="rail">Rail</SelectItem>
                      <SelectItem value="ship">Ship</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  label="Fuel Type"
                  required
                  tooltip="Fuel used for the selected mode."
                  error={!data.transportation.fuelType ? "Required" : ""}
                >
                  <Select
                    value={data.transportation.fuelType}
                    onValueChange={(v: FuelType) => update("transportation", { fuelType: v })}
                  >
                    <SelectTrigger aria-label="Fuel Type">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="lng">LNG</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </Section>
          )}

          {step === 3 && (
            <Section title="Use Phase" description="Expected in-service behavior of the product.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Lifespan (years)"
                  required
                  tooltip="Expected useful life of the product."
                  error={!isPositive(data.usePhase.lifespanYears) ? "Enter a positive number" : ""}
                >
                  <Input
                    inputMode="numeric"
                    type="number"
                    min={0}
                    step="1"
                    value={toStr(data.usePhase.lifespanYears)}
                    onChange={(e) =>
                      update("usePhase", { lifespanYears: toNumEmpty(e.currentTarget.value) })
                    }
                    aria-invalid={!isPositive(data.usePhase.lifespanYears)}
                  />
                </Field>

                <Field
                  label="Maintenance (events/year)"
                  required
                  tooltip="Average scheduled and unscheduled maintenance frequency."
                  error={!isNumberIn(data.usePhase.maintenancePerYear, 0, 365) ? "Enter 0–365" : ""}
                >
                  <Input
                    inputMode="numeric"
                    type="number"
                    min={0}
                    max={365}
                    step="1"
                    value={toStr(data.usePhase.maintenancePerYear)}
                    onChange={(e) =>
                      update("usePhase", { maintenancePerYear: toNumEmpty(e.currentTarget.value) })
                    }
                    aria-invalid={!isNumberIn(data.usePhase.maintenancePerYear, 0, 365)}
                  />
                </Field>

                <Field
                  label="Maintenance Energy (kWh/year)"
                  required
                  tooltip="Energy required to perform maintenance annually."
                  error={!isNumberIn(data.usePhase.maintenanceEnergyKWhPerYear, 0, Number.MAX_SAFE_INTEGER) ? "Enter 0 or greater" : ""}
                >
                  <Input
                    inputMode="decimal"
                    type="number"
                    min={0}
                    step="0.1"
                    value={toStr(data.usePhase.maintenanceEnergyKWhPerYear)}
                    onChange={(e) =>
                      update("usePhase", {
                        maintenanceEnergyKWhPerYear: toNumEmpty(e.currentTarget.value),
                      })
                    }
                    aria-invalid={
                      !isNumberIn(
                        data.usePhase.maintenanceEnergyKWhPerYear,
                        0,
                        Number.MAX_SAFE_INTEGER
                      )
                    }
                  />
                </Field>
              </div>
            </Section>
          )}

          {step === 4 && (
            <Section title="End of Life" description="Recycling and disposal strategy.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Recycling (%)"
                  required
                  tooltip="Portion of mass recycled at end-of-life."
                  error={!isNumberIn(data.endOfLife.recyclingPct, 0, 100) ? "Enter 0–100" : ""}
                >
                  <Input
                    inputMode="decimal"
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={toStr(data.endOfLife.recyclingPct)}
                    onChange={(e) =>
                      update("endOfLife", { recyclingPct: toNumEmpty(e.currentTarget.value) })
                    }
                    aria-invalid={!isNumberIn(data.endOfLife.recyclingPct, 0, 100)}
                  />
                </Field>

                <Field
                  label="Disposal Method"
                  required
                  tooltip="Primary end-of-life disposal pathway for non-recycled material."
                  error={!data.endOfLife.disposalMethod ? "Required" : ""}
                >
                  <Select
                    value={data.endOfLife.disposalMethod}
                    onValueChange={(v: DisposalMethod) => update("endOfLife", { disposalMethod: v })}
                  >
                    <SelectTrigger aria-label="Disposal Method">
                      <SelectValue placeholder="Select disposal method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landfill">Landfill</SelectItem>
                      <SelectItem value="incineration">Incineration</SelectItem>
                      <SelectItem value="backfill">Backfill</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </Section>
          )}

          {step === 5 && (
            <Section title="Review & Submit" description="Verify your inputs before submitting.">
              <div className="space-y-6">
                <SummaryBlock title="Material Selection" onEdit={() => setStep(0)}>
                  <KeyValue label="Ore Type" value={presentOre(data.material.oreType)} />
                  <KeyValue label="Ore Grade (%)" value={fmtNum(data.material.oreGradePct)} />
                  <KeyValue label="Moisture (%)" value={fmtNum(data.material.moisturePct)} />
                  <KeyValue label="Quantity (tons)" value={fmtNum(data.material.quantityTons)} />
                </SummaryBlock>

                <SummaryBlock title="Processing" onEdit={() => setStep(1)}>
                  <KeyValue label="Energy Source" value={presentEnergy(data.processing.energySource)} />
                  <KeyValue label="Equipment Efficiency (%)" value={fmtNum(data.processing.equipmentEfficiencyPct)} />
                  <KeyValue label="Waste Generation (%)" value={fmtNum(data.processing.wasteGenerationPct)} />
                </SummaryBlock>

                <SummaryBlock title="Transportation" onEdit={() => setStep(2)}>
                  <KeyValue label="Distance (km)" value={fmtNum(data.transportation.distanceKm)} />
                  <KeyValue label="Mode" value={presentMode(data.transportation.mode)} />
                  <KeyValue label="Fuel Type" value={presentFuel(data.transportation.fuelType)} />
                </SummaryBlock>

                <SummaryBlock title="Use Phase" onEdit={() => setStep(3)}>
                  <KeyValue label="Lifespan (years)" value={fmtNum(data.usePhase.lifespanYears)} />
                  <KeyValue label="Maintenance (events/year)" value={fmtNum(data.usePhase.maintenancePerYear)} />
                  <KeyValue label="Maintenance Energy (kWh/year)" value={fmtNum(data.usePhase.maintenanceEnergyKWhPerYear)} />
                </SummaryBlock>

                <SummaryBlock title="End of Life" onEdit={() => setStep(4)}>
                  <KeyValue label="Recycling (%)" value={fmtNum(data.endOfLife.recyclingPct)} />
                  <KeyValue label="Disposal Method" value={presentDisposal(data.endOfLife.disposalMethod)} />
                </SummaryBlock>
              </div>
            </Section>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={prev}
              disabled={step === 0}
              aria-label="Previous step"
            >
              <StepBack className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {step < totalSteps - 1 ? (
              <Button onClick={next} aria-label="Next step">
                Next
                <StepForward className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                aria-label="Submit assessment"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <CheckCheck className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saving}
              aria-label="Save draft"
            >
              {saving ? (
                <>
                  <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <IterationCw className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
            {step < totalSteps - 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setStep((totalSteps - 1) as StepIndex)}>
                    Skip to Review
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">You can review and submit after all required fields are valid.</TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-full">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="w-full max-w-full">{children}</div>
    </div>
  );
}

function Field({
  label,
  tooltip,
  help,
  required,
  error,
  children,
}: {
  label: string;
  tooltip?: string;
  help?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  const id = React.useId();
  return (
    <div className="w-full max-w-full space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {required ? <span className="text-destructive">*</span> : null}
        </Label>
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                aria-label={`${label} help`}
                className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold cursor-default select-none"
              >
                ?
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs break-words">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      <div className="min-w-0">{React.cloneElement(children as React.ReactElement, { id })}</div>
      {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function SummaryBlock({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="rounded-lg border bg-secondary/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-semibold">{title}</h4>
        {onEdit ? (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-44 min-w-0 shrink-0 text-sm text-muted-foreground">{label}</div>
      <Separator orientation="vertical" className="h-5" />
      <div className="min-w-0 text-sm font-medium break-words">{value}</div>
    </div>
  );
}

function StepBar({ current }: { current: number }) {
  return (
    <div className="w-full max-w-full">
      <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {stepNames.map((name, idx) => {
          const isActive = idx === current;
          const isDone = idx < current;
          return (
            <li
              key={name}
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-2 min-w-0",
                isActive
                  ? "bg-accent text-foreground border-accent"
                  : isDone
                  ? "bg-secondary text-foreground"
                  : "bg-card text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                  isDone ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}
                aria-hidden
              >
                {idx + 1}
              </span>
              <span className={cn("truncate text-xs sm:text-sm", isActive ? "font-semibold" : "font-medium")}>
                {name}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Utilities */

function toNumEmpty(v: string): number | "" {
  if (v === "" || v === null || v === undefined) return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : "";
}

function toStr(v: number | "" | undefined): string {
  return v === "" || v === undefined ? "" : String(v);
}

function isPositive(v: number | "" | undefined): boolean {
  return typeof v === "number" && v > 0;
}

function isNumberIn(v: number | "" | undefined, min: number, max: number): boolean {
  return typeof v === "number" && v >= min && v <= max;
}

function deepMerge<T>(base: T, partial?: Partial<T>): T {
  if (!partial) return base;
  const result: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const k in partial) {
    const pv = (partial as any)[k];
    const bv = (base as any)[k];
    if (pv && typeof pv === "object" && !Array.isArray(pv)) {
      result[k] = deepMerge(bv ?? {}, pv);
    } else if (pv !== undefined) {
      result[k] = pv;
    }
  }
  return result as T;
}

function presentOre(v: MaterialSelection["oreType"]): string {
  switch (v) {
    case "iron-ore":
      return "Iron ore";
    case "bauxite":
      return "Bauxite";
    case "copper":
      return "Copper";
    default:
      return "-";
  }
}
function presentEnergy(v: Processing["energySource"]): string {
  switch (v) {
    case "grid-electricity":
      return "Grid electricity";
    case "diesel-generator":
      return "Diesel generator";
    case "natural-gas":
      return "Natural gas";
    case "renewables":
      return "Renewables";
    default:
      return "-";
  }
}
function presentMode(v: Transportation["mode"]): string {
  switch (v) {
    case "truck":
      return "Truck";
    case "rail":
      return "Rail";
    case "ship":
      return "Ship";
    default:
      return "-";
  }
}
function presentFuel(v: Transportation["fuelType"]): string {
  switch (v) {
    case "diesel":
      return "Diesel";
    case "gasoline":
      return "Gasoline";
    case "lng":
      return "LNG";
    case "electric":
      return "Electric";
    default:
      return "-";
  }
}
function presentDisposal(v: EndOfLife["disposalMethod"]): string {
  switch (v) {
    case "landfill":
      return "Landfill";
    case "incineration":
      return "Incineration";
    case "backfill":
      return "Backfill";
    default:
      return "-";
  }
}
function fmtNum(v: number | "" | undefined): string {
  return typeof v === "number" ? String(v) : "-";
}