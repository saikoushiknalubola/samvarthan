"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamic imports with loading states
const EnhancedDashboard = dynamic(() => import("@/components/EnhancedDashboard"), {
  loading: () => <div className="space-y-4 p-3 sm:p-0"><Skeleton className="h-[400px] w-full" /></div>,
  ssr: false
});

const LCAWizard = dynamic(() => import("@/components/LCAWizard"), {
  loading: () => <div className="space-y-4 p-3 sm:p-0"><Skeleton className="h-[600px] w-full" /></div>,
  ssr: false
});

const LCAResults = dynamic(() => import("@/components/LCAResults"), {
  loading: () => <div className="space-y-4 p-3 sm:p-0"><Skeleton className="h-[500px] w-full" /></div>,
  ssr: false
});

const ScenarioBuilder = dynamic(() => import("@/components/ScenarioBuilder"), {
  loading: () => <div className="space-y-4 p-3 sm:p-0"><Skeleton className="h-[500px] w-full" /></div>,
  ssr: false
});

const ReportsExport = dynamic(() => import("@/components/ReportsExport"), {
  loading: () => <div className="space-y-4 p-3 sm:p-0"><Skeleton className="h-[500px] w-full" /></div>,
  ssr: false
});

export default function Page() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);

  return (
    <div className="min-h-dvh w-full bg-background">
      {/* Header - Mobile-First Perfect */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Platform Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Comprehensive lifecycle assessment and analytics</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button 
                asChild 
                variant="default"
                className="flex-1 sm:flex-none h-9 sm:h-10 text-sm"
                onClick={() => toast.success("Starting new assessment...")}
              >
                <Link href="/lca">New Assessment</Link>
              </Button>
              <Button 
                asChild 
                variant="outline"
                className="flex-1 sm:flex-none h-9 sm:h-10 text-sm"
                onClick={() => toast.success("Opening scenarios...")}
              >
                <Link href="/scenarios">Scenarios</Link>
              </Button>
              <Button 
                asChild 
                variant="outline"
                className="flex-1 sm:flex-none h-9 sm:h-10 text-sm"
                onClick={() => toast.success("Opening reports...")}
              >
                <Link href="/reports">Reports</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile-First Perfect Spacing */}
      <main className="mx-auto max-w-screen-2xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Perfect Mobile TabsList */}
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="dashboard" className="py-2 text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="assessment" className="py-2 text-xs sm:text-sm">Assess</TabsTrigger>
            <TabsTrigger value="results" className="py-2 text-xs sm:text-sm">Results</TabsTrigger>
            <TabsTrigger value="scenarios" className="py-2 text-xs sm:text-sm">Scenarios</TabsTrigger>
            <TabsTrigger value="reports" className="py-2 text-xs sm:text-sm">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <EnhancedDashboard />
          </TabsContent>

          <TabsContent value="assessment" className="mt-4 sm:mt-6">
            <div className="rounded-xl sm:rounded-2xl border-2 border-border bg-card p-3 sm:p-4 lg:p-6">
              <LCAWizard draftKey="samvartana.lca.draft" />
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-4 sm:mt-6">
            <div className="rounded-xl sm:rounded-2xl border-2 border-border bg-card p-3 sm:p-4 lg:p-6">
              {selectedAssessmentId ? (
                <LCAResults assessmentId={selectedAssessmentId} />
              ) : (
                <div className="p-8 sm:p-12 text-center">
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">Select an assessment to view detailed results</p>
                  <Button 
                    onClick={() => {
                      setSelectedAssessmentId(1);
                      toast.success("Loading sample results...");
                    }}
                    className="h-9 sm:h-10"
                  >
                    View Sample Results
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="mt-4 sm:mt-6">
            <div className="rounded-xl sm:rounded-2xl border-2 border-border bg-card p-3 sm:p-4 lg:p-6">
              <ScenarioBuilder />
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-4 sm:mt-6">
            <div className="rounded-xl sm:rounded-2xl border-2 border-border bg-card p-3 sm:p-4 lg:p-6">
              <ReportsExport />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}