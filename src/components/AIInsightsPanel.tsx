"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Target,
  Zap,
  RefreshCw,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsight {
  category: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  potentialSavings: string;
  impact: string;
  confidence: number;
}

interface PriorityAction {
  action: string;
  description: string;
  expectedImpact: string;
  timeline: string;
  complexity: string;
}

interface AIInsightsData {
  insights: AIInsight[];
  overallScore: number;
  scoreGrade: string;
  priorityActions: PriorityAction[];
  predictions: {
    nextQuarterCO2: number;
    energySavingsPotential: number;
    circularityImprovementPotential: number;
    costSavingsEstimate: number;
  };
  generatedAt: string;
}

interface AIInsightsPanelProps {
  assessmentId: number;
  className?: string;
}

export default function AIInsightsPanel({ assessmentId, className }: AIInsightsPanelProps) {
  const [data, setData] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/ai-insights?assessment_id=${assessmentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch AI insights');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assessmentId) {
      fetchInsights();
    }
  }, [assessmentId]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-muted-foreground bg-secondary border-border';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-teal-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card className={cn("border-2", className)}>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className={cn("border-2 border-destructive/20", className)}>
        <CardContent className="p-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <p className="font-semibold text-destructive">Failed to load AI insights</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={fetchInsights} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary animate-pulse" />
              AI Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 rounded-xl bg-card border-2 border-border">
                <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                <motion.p 
                  className={cn("text-6xl font-bold mb-2", getScoreColor(data.overallScore))}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {data.overallScore}
                </motion.p>
                <Badge className={cn("text-sm px-4 py-1", getSeverityColor(
                  data.overallScore >= 75 ? 'low' : data.overallScore >= 60 ? 'medium' : 'high'
                ))}>
                  {data.scoreGrade}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                  <span className="text-sm text-muted-foreground">Predicted CO₂ (Next Quarter)</span>
                  <span className="font-bold">{data.predictions.nextQuarterCO2.toLocaleString()} t</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                  <span className="text-sm text-muted-foreground">Energy Savings Potential</span>
                  <span className="font-bold text-emerald-600">{data.predictions.energySavingsPotential.toLocaleString()} kWh</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
                  <span className="text-sm text-muted-foreground">Cost Savings (Est.)</span>
                  <span className="font-bold text-primary">₹{data.predictions.costSavingsEstimate.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights List */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Intelligent Insights
            <Badge variant="outline" className="ml-auto">{data.insights.length} insights</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {data.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="group p-4 rounded-xl border-2 hover:border-primary/40 transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0",
                    insight.severity === 'high' ? "bg-red-100" :
                    insight.severity === 'medium' ? "bg-amber-100" : "bg-emerald-100"
                  )}>
                    {insight.impact === 'positive' ? (
                      <CheckCircle2 className={cn("h-6 w-6", 
                        insight.severity === 'low' ? "text-emerald-600" : "text-muted-foreground"
                      )} />
                    ) : (
                      <AlertCircle className={cn("h-6 w-6",
                        insight.severity === 'high' ? "text-red-600" :
                        insight.severity === 'medium' ? "text-amber-600" : "text-emerald-600"
                      )} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-base">{insight.title}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={cn("text-xs", getSeverityColor(insight.severity))}>
                          {insight.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {(insight.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {insight.description}
                    </p>

                    <div className="rounded-lg bg-accent/50 p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-primary mb-1">Recommendation</p>
                          <p className="text-sm leading-relaxed">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-primary border-primary/30">
                        <Zap className="h-3 w-3 mr-1" />
                        {insight.potentialSavings}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {insight.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Priority Actions */}
      {data.priorityActions.length > 0 && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Priority Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.priorityActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.5 }}
                className="p-4 rounded-lg border-2 border-border hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h5 className="font-bold text-sm">{action.action}</h5>
                  <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                    {action.complexity} complexity
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="text-emerald-600 bg-emerald-50 border-emerald-200">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {action.expectedImpact}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Timeline: {action.timeline}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button onClick={fetchInsights} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Insights
        </Button>
      </div>
    </div>
  );
}
