"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Recycle,
  TrendingUp,
  Leaf,
  RotateCw,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CircularityData {
  id: number;
  assessmentId: number;
  mciScore: number | null;
  recyclingPotentialPct: number | null;
  resourceEfficiencyScore: number | null;
  extendedProductLifeYears: number | null;
  reusePotentialPct: number | null;
  composite_score: number | null;
  circularity_grade: string | null;
}

interface CircularityScoreCardProps {
  assessmentId: number;
  className?: string;
}

export default function CircularityScoreCard({ assessmentId, className }: CircularityScoreCardProps) {
  const [data, setData] = useState<CircularityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCircularity = async () => {
      try {
        const response = await fetch(`/api/circularity-metrics?assessment_id=${assessmentId}`);
        const result = await response.json();
        if (result.length > 0) {
          setData(result[0]);
        }
      } catch (error) {
        console.error('Error fetching circularity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCircularity();
  }, [assessmentId]);

  const getGradeColor = (grade: string | null) => {
    switch (grade) {
      case 'Excellent':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Good':
        return 'text-teal-600 bg-teal-50 border-teal-200';
      case 'Fair':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-muted-foreground bg-secondary border-border';
    }
  };

  if (loading) {
    return (
      <Card className={cn("border-2", className)}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const metrics = [
    {
      label: "MCI Score",
      value: data.mciScore,
      max: 1,
      icon: Recycle,
      color: "emerald",
      formatter: (v: number) => v.toFixed(2)
    },
    {
      label: "Recycling Potential",
      value: data.recyclingPotentialPct,
      max: 100,
      icon: RotateCw,
      color: "sky",
      formatter: (v: number) => `${v.toFixed(0)}%`
    },
    {
      label: "Resource Efficiency",
      value: data.resourceEfficiencyScore,
      max: 10,
      icon: Leaf,
      color: "teal",
      formatter: (v: number) => `${v.toFixed(1)}/10`
    },
    {
      label: "Reuse Potential",
      value: data.reusePotentialPct,
      max: 100,
      icon: TrendingUp,
      color: "purple",
      formatter: (v: number) => `${v.toFixed(0)}%`
    }
  ];

  return (
    <Card className={cn("border-2 border-primary/20 bg-gradient-to-br from-card to-emerald-50/20", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          Material Circularity Index
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Overall Score */}
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-emerald-50 border-2 border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Overall MCI Score</p>
          <motion.p
            className="text-5xl font-bold text-primary mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {data.mciScore?.toFixed(2) || '0.00'}
          </motion.p>
          {data.circularity_grade && (
            <Badge className={cn("text-sm px-4 py-1", getGradeColor(data.circularity_grade))}>
              {data.circularity_grade}
            </Badge>
          )}
        </div>

        {/* Individual Metrics */}
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            if (metric.value === null) return null;
            const percentage = (metric.value / metric.max) * 100;

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <metric.icon className={cn("h-4 w-4", `text-${metric.color}-600`)} />
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  <span className="text-sm font-bold">{metric.formatter(metric.value)}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 + 0.3 }}
                    className={cn(
                      "h-full rounded-full",
                      `bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600`
                    )}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Extended Product Life */}
        {data.extendedProductLifeYears && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
              <span className="text-sm text-muted-foreground">Extended Product Life</span>
              <span className="font-bold text-primary">{data.extendedProductLifeYears} years</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
