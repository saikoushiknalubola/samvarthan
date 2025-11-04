"use client";

import { useEffect, useState, useCallback } from 'react';

export interface RealTimeStats {
  totalProjects: number;
  completedProjects: number;
  aggregateMetrics: {
    totalCO2Tons: number;
    totalEnergyKwh: number;
    totalWaterM3: number;
    totalWasteTons: number;
    avgCircularityScore: number;
    avgRecyclingRate: number;
  };
  trends: {
    co2Trend: number;
    energyTrend: number;
    waterTrend: number;
    wasteTrend: number;
  };
  metalTypeBreakdown: Record<string, {
    count: number;
    co2: number;
    energy: number;
    water: number;
    waste: number;
  }>;
  topPerformers: Array<{
    projectName: string;
    metalType: string;
    co2PerTon: number;
    mciScore: number;
    status: string;
  }>;
  recentActivity: Array<{
    id: number;
    projectName: string;
    metalType: string;
    status: string;
    updatedAt: string;
  }>;
  timestamp: string;
}

export function useRealTimeStats(options?: {
  metalType?: string;
  timeRange?: '7d' | '30d' | '90d' | 'all';
  refreshInterval?: number;
  autoRefresh?: boolean;
}) {
  const {
    metalType,
    timeRange = '30d',
    refreshInterval = 30000, // 30 seconds
    autoRefresh = true
  } = options || {};

  const [stats, setStats] = useState<RealTimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (metalType) params.append('metal_type', metalType);
      params.append('time_range', timeRange);

      const response = await fetch(`/api/dashboard/stats?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [metalType, timeRange]);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchStats]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    lastUpdated,
    refresh
  };
}
