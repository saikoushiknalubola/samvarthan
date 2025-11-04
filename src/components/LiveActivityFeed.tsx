"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: number;
  projectName: string;
  metalType: string;
  status: string;
  updatedAt: string;
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/assessments?limit=10');
      const data = await response.json();
      setActivities(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      fetchActivities();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4 text-sky-600" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'in_progress':
        return 'text-sky-600 bg-sky-50 border-sky-200';
      default:
        return 'text-muted-foreground bg-secondary border-border';
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            Live Activity Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {lastUpdate.toLocaleTimeString()}
            </Badge>
            <Button
              onClick={fetchActivities}
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {activities.slice(0, 8).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className="group flex items-center gap-3 p-3 rounded-lg border hover:border-primary/40 hover:bg-accent/30 transition-all cursor-pointer"
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{activity.projectName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {activity.metalType}
                    </Badge>
                    <Badge className={cn("text-xs capitalize", getStatusColor(activity.status))}>
                      {activity.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">
                    {getRelativeTime(activity.updatedAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
