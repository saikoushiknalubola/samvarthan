"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  GitBranch,
  Sparkles,
} from "lucide-react";

type TimeSeriesData = {
  period: string;
  co2: number;
  energy: number;
  water: number;
  waste: number;
};

type ProcessBreakdown = {
  process: string;
  percentage: number;
  value: number;
  color: string;
};

type MaterialFlow = {
  stage: string;
  input: number;
  output: number;
  loss: number;
};

export default function AdvancedVisualizations({ projectId }: { projectId: number }) {
  const [historicalData, setHistoricalData] = useState<TimeSeriesData[]>([]);
  const [processData, setProcessData] = useState<ProcessBreakdown[]>([]);
  const [flowData, setFlowData] = useState<MaterialFlow[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<"co2" | "energy" | "water" | "waste">("co2");

  useEffect(() => {
    // Generate project-specific historical data (in production, fetch from API)
    generateHistoricalData(projectId);
    generateProcessData(projectId);
    generateFlowData(projectId);
  }, [projectId]);

  const generateHistoricalData = (id: number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const baseMultiplier = id * 1.2;
    
    const data = months.map((month, index) => ({
      period: month,
      co2: Math.round(800 * baseMultiplier * (1 - (index * 0.03)) + Math.random() * 100),
      energy: Math.round(250000 * baseMultiplier * (1 - (index * 0.025)) + Math.random() * 10000),
      water: Math.round(65000 * baseMultiplier * (1 - (index * 0.02)) + Math.random() * 5000),
      waste: Math.round(450 * baseMultiplier * (1 + (index * 0.01)) + Math.random() * 50),
    }));
    
    setHistoricalData(data);
  };

  const generateProcessData = (id: number) => {
    const processes = [
      { process: "Extraction", color: "#0f766e" },
      { process: "Processing", color: "#14b8a6" },
      { process: "Transport", color: "#06b6d4" },
      { process: "Refining", color: "#f59e0b" },
      { process: "Waste Handling", color: "#8b5cf6" },
    ];

    const total = 100;
    let remaining = total;
    
    const data = processes.map((p, i) => {
      const isLast = i === processes.length - 1;
      const percentage = isLast ? remaining : Math.round(Math.random() * (remaining / 2) + 10);
      remaining -= percentage;
      
      return {
        process: p.process,
        percentage,
        value: percentage * (1000 + id * 50),
        color: p.color,
      };
    });
    
    setProcessData(data);
  };

  const generateFlowData = (id: number) => {
    const stages = [
      { stage: "Raw Material", input: 10000, loss: 200 },
      { stage: "Crushing", input: 9800, loss: 300 },
      { stage: "Grinding", input: 9500, loss: 400 },
      { stage: "Smelting", input: 9100, loss: 600 },
      { stage: "Refining", input: 8500, loss: 200 },
      { stage: "Final Product", input: 8300, loss: 0 },
    ];

    const multiplier = 1 + (id * 0.1);
    const data = stages.map(s => ({
      stage: s.stage,
      input: Math.round(s.input * multiplier),
      output: Math.round((s.input - s.loss) * multiplier),
      loss: Math.round(s.loss * multiplier),
    }));
    
    setFlowData(data);
  };

  const metrics = [
    { id: "co2" as const, label: "CO₂ Emissions", unit: "tCO₂e", color: "emerald" },
    { id: "energy" as const, label: "Energy", unit: "kWh", color: "amber" },
    { id: "water" as const, label: "Water", unit: "m³", color: "sky" },
    { id: "waste" as const, label: "Waste", unit: "t", color: "purple" },
  ];

  const getMetricData = () => {
    return historicalData.map(d => d[selectedMetric]);
  };

  const getTrend = () => {
    const data = getMetricData();
    if (data.length < 2) return null;
    const first = data[0];
    const last = data[data.length - 1];
    const change = ((last - first) / first) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change < 0 ? "down" : "up",
    };
  };

  const maxValue = Math.max(...getMetricData());
  const trend = getTrend();

  return (
    <div className="space-y-6">
      {/* Historical Trends with Animation */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Historical Performance Trends
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {metrics.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMetric(m.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    selectedMetric === m.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-foreground hover:bg-accent"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trend && (
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant="outline"
                className={cn(
                  trend.direction === "down"
                    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                    : "text-amber-600 bg-amber-50 border-amber-200"
                )}
              >
                {trend.direction === "down" ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1" />
                )}
                {trend.value}% this year
              </Badge>
            </div>
          )}
          
          {/* Animated Line Chart */}
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="40"
                  y1={20 + i * 50}
                  x2="780"
                  y2={20 + i * 50}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                  opacity="0.3"
                />
              ))}

              {/* Data line */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d={historicalData
                  .map((d, i) => {
                    const x = 40 + (i * (740 / (historicalData.length - 1)));
                    const y = 220 - ((d[selectedMetric] / maxValue) * 180);
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Area fill */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d={
                  historicalData
                    .map((d, i) => {
                      const x = 40 + (i * (740 / (historicalData.length - 1)));
                      const y = 220 - ((d[selectedMetric] / maxValue) * 180);
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ") + " L 780 220 L 40 220 Z"
                }
                fill="var(--primary)"
              />

              {/* Data points */}
              {historicalData.map((d, i) => {
                const x = 40 + (i * (740 / (historicalData.length - 1)));
                const y = 220 - ((d[selectedMetric] / maxValue) * 180);
                return (
                  <motion.circle
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--primary)"
                    className="cursor-pointer hover:r-6 transition-all"
                  >
                    <title>
                      {d.period}: {d[selectedMetric].toLocaleString()} {metrics.find(m => m.id === selectedMetric)?.unit}
                    </title>
                  </motion.circle>
                );
              })}

              {/* X-axis labels */}
              {historicalData.map((d, i) => {
                const x = 40 + (i * (740 / (historicalData.length - 1)));
                return (
                  <text
                    key={i}
                    x={x}
                    y="235"
                    textAnchor="middle"
                    fontSize="11"
                    className="fill-muted-foreground"
                  >
                    {d.period}
                  </text>
                );
              })}

              {/* Y-axis values */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <text
                  key={i}
                  x="35"
                  y={220 - ratio * 180 + 4}
                  textAnchor="end"
                  fontSize="11"
                  className="fill-muted-foreground"
                >
                  {Math.round(maxValue * ratio).toLocaleString()}
                </text>
              ))}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Process Breakdown */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Lifecycle Stage Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processData.map((p, index) => (
              <motion.div
                key={p.process}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-medium">{p.process}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                      {p.value.toLocaleString()} tCO₂e
                    </span>
                    <Badge variant="outline">{p.percentage}%</Badge>
                  </div>
                </div>
                <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t flex items-center justify-between">
            <span className="font-semibold">Total Impact</span>
            <span className="text-lg font-bold">
              {processData.reduce((sum, p) => sum + p.value, 0).toLocaleString()} tCO₂e
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Material Flow Diagram */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Material Flow Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {flowData.map((flow, index) => (
              <motion.div
                key={flow.stage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="flex items-center gap-4">
                  {/* Stage indicator */}
                  <div className="flex-shrink-0 w-32">
                    <p className="text-sm font-medium">{flow.stage}</p>
                    <p className="text-xs text-muted-foreground">
                      {flow.loss > 0 ? `Loss: ${flow.loss.toLocaleString()} t` : "Final"}
                    </p>
                  </div>

                  {/* Flow bar */}
                  <div className="flex-1 space-y-1">
                    <div className="relative h-10 bg-secondary rounded-lg overflow-hidden">
                      {/* Input */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: index * 0.15 }}
                        className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 flex items-center px-3"
                      >
                        <span className="text-xs font-medium text-primary-foreground">
                          {flow.input.toLocaleString()} t
                        </span>
                      </motion.div>

                      {/* Loss overlay */}
                      {flow.loss > 0 && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(flow.loss / flow.input) * 100}%` }}
                          transition={{ duration: 0.8, delay: index * 0.15 + 0.5 }}
                          className="absolute right-0 inset-y-0 bg-red-500/30 flex items-center justify-end px-2"
                        >
                          <span className="text-xs font-medium text-red-700">
                            -{flow.loss.toLocaleString()} t
                          </span>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Efficiency indicator */}
                    {flow.loss > 0 && (
                      <p className="text-xs text-muted-foreground text-right">
                        Efficiency: {((flow.output / flow.input) * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>

                  {/* Output value */}
                  <div className="flex-shrink-0 w-24 text-right">
                    <p className="text-sm font-semibold">{flow.output.toLocaleString()} t</p>
                    <p className="text-xs text-muted-foreground">Output</p>
                  </div>
                </div>

                {/* Connector arrow */}
                {index < flowData.length - 1 && (
                  <div className="flex justify-center my-1">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 + 0.3 }}
                      className="text-primary"
                    >
                      ↓
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {flowData[0]?.input.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Initial Input</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {flowData.reduce((sum, f) => sum + f.loss, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Losses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {flowData[flowData.length - 1]?.output.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Final Output</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}