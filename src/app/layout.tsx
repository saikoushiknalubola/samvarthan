import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
            <div className="flex h-16 sm:h-18 items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-8">
                <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
                  <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all flex-shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 bg-primary">
                    <img 
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/samvatana-draft-logo-1759812040224.jpeg"
                      alt="SAMVARTANA Logo"
                      className="h-full w-full object-cover scale-150"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">SAMVARTANA</h1>
                    <p className="text-xs sm:text-sm text-primary font-semibold truncate">Circular Mining Intelligence</p>
                  </div>
                </Link>
                <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
                  <Link href="/" className="text-foreground/70 hover:text-foreground transition-colors">Home</Link>
                  <Link href="/platform" className="text-foreground/70 hover:text-foreground transition-colors">Platform</Link>
                  <Link href="/lca" className="text-foreground/70 hover:text-foreground transition-colors">LCA</Link>
                  <Link href="/scenarios" className="text-foreground/70 hover:text-foreground transition-colors">Scenarios</Link>
                  <Link href="/reports" className="text-foreground/70 hover:text-foreground transition-colors">Reports</Link>
                </nav>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button asChild variant="ghost" size="sm" className="hidden sm:flex h-9 sm:h-10 text-xs sm:text-sm">
                  <Link href="/lca">Start Assessment</Link>
                </Button>
                <Button asChild size="sm" className="shadow-md hover:shadow-lg transition-all h-9 sm:h-10 text-xs sm:text-sm">
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