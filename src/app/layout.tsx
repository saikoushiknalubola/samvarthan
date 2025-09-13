import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Link from "next/link";

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

        {/* Global Header Navigation */}
        <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
            <div className="flex h-14 items-center justify-between gap-4">
              <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-foreground">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm">SV</span>
                <span>SAMVARTANA</span>
              </Link>
              <nav className="flex items-center gap-4 sm:gap-6 text-sm">
                <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
                <Link href="/platform" className="text-foreground/80 hover:text-foreground transition-colors">Platform</Link>
                <Link href="/lca" className="text-foreground/80 hover:text-foreground transition-colors">LCA</Link>
                <Link href="/scenarios" className="text-foreground/80 hover:text-foreground transition-colors">Scenarios</Link>
                <Link href="/reports" className="text-foreground/80 hover:text-foreground transition-colors">Reports</Link>
              </nav>
            </div>
          </div>
        </header>

        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}