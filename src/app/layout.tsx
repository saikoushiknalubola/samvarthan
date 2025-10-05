import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "SAMVARTANA - Circular Mining Intelligence Platform",
  description: "AI-assisted LCA and circular mining intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />

        {/* Single Global Header Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur-md shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold tracking-tight">SAMVARTANA</h1>
                    <p className="text-xs text-muted-foreground">Circular Mining Intelligence</p>
                  </div>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                  <Link href="/" className="text-foreground/70 hover:text-foreground transition-colors">Home</Link>
                  <Link href="/platform" className="text-foreground/70 hover:text-foreground transition-colors">Platform</Link>
                  <Link href="/lca" className="text-foreground/70 hover:text-foreground transition-colors">LCA</Link>
                  <Link href="/scenarios" className="text-foreground/70 hover:text-foreground transition-colors">Scenarios</Link>
                  <Link href="/reports" className="text-foreground/70 hover:text-foreground transition-colors">Reports</Link>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                  <Link href="/lca">Start Assessment</Link>
                </Button>
                <Button asChild size="sm" className="shadow-md hover:shadow-lg transition-all">
                  <Link href="/platform">Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {children}
        <Toaster />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}