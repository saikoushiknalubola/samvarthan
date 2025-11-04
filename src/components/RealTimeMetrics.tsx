"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";
import {
  TrendingDown,
  TrendingUp,
  Zap,
  Droplets,
  Trash2,
  RefreshCw,
  Activity,
  Clock,
  Minus,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RealTimeMetricsProps {
  metalType?: string;
  timeRange?: '7d' | '30d' | '90d' | 'all';
  className?: string;
}

export default function RealTimeMetrics({ 
  metalType, 
  timeRange = '30d',
  className 
}: RealTimeMetricsProps) {
  const { stats, loading, error, lastUpdated, refresh } = useRealTimeStats({
    metalType,
    timeRange,
    refreshInterval: 30000,
    autoRefresh: true
  });

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return n.toFixed(0);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0.5) return TrendingUp;
    if (trend < -0.5) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (trend: number, isPositiveGood: boolean = false) => {
    if (Math.abs(trend) < 0.5) return "text-muted-foreground";
    if (isPositiveGood) {
      return trend > 0 ? "text-emerald-600" : "text-red-600";
    }
    return trend < 0 ? "text-emerald-600" : "text-red-600";
  };

  if (loading && !stats) {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4", className)}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 sm:h-40 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-destructive/20">
        <CardContent className="p-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Failed to load real-time data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={handleRefresh} size="sm" variant="outline" className="ml-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const metrics = [
    {
      id: "co2",
      label: "CO₂ Emissions",
      value: stats.aggregateMetrics.totalCO2Tons,
      unit: "tCO₂e",
      trend: stats.trends.co2Trend,
      icon: TrendingDown,
      color: "emerald",
      isPositiveGood: false
    },
    {
      id: "energy",
      label: "Energy Usage",
      value: stats.aggregateMetrics.totalEnergyKwh,
      unit: "kWh",
      trend: stats.trends.energyTrend,
      icon: Zap,
      color: "amber",
      isPositiveGood: false
    },
    {
      id: "water",
      label: "Water Usage",
      value: stats.aggregateMetrics.totalWaterM3,
      unit: "m³",
      trend: stats.trends.waterTrend,
      icon: Droplets,
      color: "sky",
      isPositiveGood: false
    },
    {
      id: "waste",
      label: "Waste Generated",
      value: stats.aggregateMetrics.totalWasteTons,
      unit: "t",
      trend: stats.trends.wasteTrend,
      icon: Trash2,
      color: "purple",
      isPositiveGood: false
    },
  ];

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-sm font-semibold">Live Metrics</span>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Loading...'}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <AnimatePresence mode="wait">
          {metrics.map((metric, index) => {
            const TrendIcon = getTrendIcon(metric.trend);
            const trendColor = getTrendColor(metric.trend, metric.isPositiveGood);

            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className={cn(
                  "border-2 hover:shadow-lg transition-all duration-300 relative overflow-hidden",
                  `hover:border-${metric.color}-200`
                )}>
                  {/* Animated background pulse */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 opacity-5",
                      `bg-${metric.color}-500`
                    )}
                    animate={{
                      opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  <CardContent className="p-4 sm:p-5 lg:p-6 relative z-10">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={cn(
                        "h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl flex items-center justify-center",
                        `bg-gradient-to-br from-${metric.color}-100 to-${metric.color}-50`
                      )}>
                        <metric.icon className={cn("h-5 w-5 sm:h-6 sm:w-6", `text-${metric.color}-600`)} />
                      </div>
                      {metric.trend !== 0 && (
                        <Badge variant="outline" className={cn("text-xs", trendColor)}>
                          <TrendIcon className="h-3 w-3 mr-1" />
                          {Math.abs(metric.trend).toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
                      {metric.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <motion.p
                        key={metric.value}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl sm:text-3xl font-bold"
                      >
                        {formatNumber(metric.value)}
                      </motion.p>
                      <span className="text-sm text-muted-foreground">{metric.unit}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Additional Metrics Row */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.totalProjects}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Projects</p>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.completedProjects}</p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">
              {stats.aggregateMetrics.avgCircularityScore.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Avg MCI Score</p>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-sky-600">
              {stats.aggregateMetrics.avgRecyclingRate.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Recycling Rate</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
