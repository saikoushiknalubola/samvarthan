"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  AlignStartVertical,
  AlignVerticalDistributeStart,
  AlignVerticalSpaceBetween,
  PanelLeft,
  PanelLeftDashed,
  PanelRight,
  LayoutPanelTop,
  ChevronsLeft,
  SeparatorHorizontal,
  PanelLeftOpen,
} from "lucide-react";

type IconKey =
  | "dashboard"
  | "input"
  | "analysis"
  | "scenarios"
  | "reports"
  | "settings";

type SidebarItem = {
  key: string;
  label: string;
  href?: string;
  icon?: IconKey;
};

interface SidebarProps {
  items?: SidebarItem[];
  currentPath?: string;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  fixed?: boolean;
  className?: string;
  style?: React.CSSProperties;
  storageKey?: string;
  brand?: {
    name?: string;
    shortName?: string;
  };
  onItemSelect?: (key: string) => void;
  controlledCollapsed?: boolean;
}

const ICON_MAP: Record<IconKey, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  dashboard: LayoutDashboard,
  input: AlignStartVertical,
  analysis: LayoutPanelTop,
  scenarios: PanelRight,
  reports: AlignVerticalSpaceBetween,
  settings: PanelLeftDashed,
};

const DEFAULT_ITEMS: SidebarItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { key: "input", label: "Input Wizard", href: "/input", icon: "input" },
  { key: "analysis", label: "Analysis", href: "/analysis", icon: "analysis" },
  { key: "scenarios", label: "Scenarios", href: "/scenarios", icon: "scenarios" },
  { key: "reports", label: "Reports", href: "/reports", icon: "reports" },
  { key: "settings", label: "Settings", href: "/settings", icon: "settings" },
];

export default function Sidebar({
  items = DEFAULT_ITEMS,
  currentPath,
  defaultCollapsed = false,
  onCollapsedChange,
  fixed = true,
  className = "",
  style,
  storageKey = "samvartana.sidebar.collapsed",
  brand = { name: "Samvartana", shortName: "SV" },
  onItemSelect,
  controlledCollapsed,
}: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  // hydrate internal state only when uncontrolled
  useEffect(() => {
    setMounted(true);
    if (controlledCollapsed !== undefined) return;
    try {
      const fromStorage =
        typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
      if (fromStorage === "1") setCollapsed(true);
      if (fromStorage === "0") setCollapsed(false);
    } catch {
      // ignore storage errors
    }
  }, [storageKey, controlledCollapsed]);

  // persist changes to storage and notify parent for both controlled and uncontrolled
  useEffect(() => {
    if (!mounted) return;
    const value = controlledCollapsed !== undefined ? controlledCollapsed : collapsed;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, value ? "1" : "0");
      }
    } catch {
      // ignore
    }
    onCollapsedChange?.(value);
  }, [collapsed, controlledCollapsed, mounted, onCollapsedChange, storageKey]);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : collapsed;

  const toggle = useCallback(() => {
    if (controlledCollapsed !== undefined) {
      onCollapsedChange?.(!isCollapsed);
      return;
    }
    setCollapsed((c) => !c);
  }, [controlledCollapsed, isCollapsed, onCollapsedChange]);

  const computedItems = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        _Icon: ICON_MAP[(it.icon as IconKey) ?? "dashboard"] || LayoutDashboard,
      })),
    [items]
  );

  const WrapperTag = "nav";

  const isActive = useCallback(
    (href?: string) => {
      if (!href) return false;
      if (!currentPath && typeof window !== "undefined") {
        try {
          return window.location.pathname === href;
        } catch {
          return false;
        }
      }
      return currentPath === href;
    },
    [currentPath]
  );

  return (
    <>
      {isCollapsed && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Expand sidebar"
          className="fixed left-3 top-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#1a2332] text-white/90 hover:text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]"
        >
          <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
      <WrapperTag
        aria-label="Primary"
        aria-hidden={isCollapsed}
        className={[
          fixed ? "fixed left-0 top-0 h-dvh" : "",
          "z-40",
          "bg-[#1a2332]",
          "text-white",
          "w-[260px]",
          isCollapsed ? "border-0" : "border-r border-white/10",
          isCollapsed ? "pointer-events-none" : "pointer-events-auto",
          "transition-[width] duration-300 ease-in-out",
          isCollapsed ? "w-0 overflow-hidden" : "w-[260px]",
          "select-none",
          "will-change-[width]",
          "print:hidden",
          className,
        ].join(" ")}
        style={style}
      >
        <div className="flex h-full w-full flex-col">
          {/* Brand */}
          <div
            className={[
              "flex items-center",
              "px-4",
              isCollapsed ? "py-4" : "py-5",
              "border-b border-white/10",
              "min-h-[64px]",
            ].join(" ")}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <span
                  className={[
                    "block font-semibold tracking-[-0.01em]",
                    "text-white",
                    "text-base sm:text-lg",
                    isCollapsed ? "sr-only" : "",
                  ].join(" ")}
                >
                  {brand?.name ?? "Samvartana"}
                </span>
                <span
                  className={[
                    "block text-xs text-white/60",
                    isCollapsed ? "sr-only" : "",
                  ].join(" ")}
                >
                  LCA Platform
                </span>
                {isCollapsed ? (
                  <span className="sr-only">{brand?.shortName ?? "SV"}</span>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={toggle}
              className={[
                "ml-auto inline-flex items-center justify-center",
                "h-9 w-9 rounded-md",
                "text-white/80 hover:text-white",
                "bg-white/5 hover:bg-white/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]",
                "transition-colors",
              ].join(" ")}
            >
              <ChevronsLeft
                className={[
                  "h-5 w-5 transition-transform duration-300",
                  isCollapsed ? "rotate-180" : "rotate-0",
                ].join(" ")}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Primary Navigation */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <ul role="list" className="py-3">
              {computedItems.slice(0, 4).map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.key}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={[
                          "group flex items-center gap-3 mx-2 my-1",
                          "rounded-md px-2 py-2.5",
                          "transition-colors",
                          active
                            ? "bg-[#0f766e] text-white"
                            : "text-white/85 hover:text-white hover:bg-white/5",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]",
                        ].join(" ")}
                        aria-current={active ? "page" : undefined}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span
                          className={[
                            "min-w-0 truncate",
                            isCollapsed ? "sr-only" : "block",
                          ].join(" ")}
                        >
                          {item.label}
                        </span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onItemSelect?.(item.key)}
                        className={[
                          "group flex w-full items-center gap-3 mx-2 my-1",
                          "rounded-md px-2 py-2.5",
                          "transition-colors",
                          "text-white/85 hover:text-white hover:bg-white/5",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]",
                        ].join(" ")}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span className={isCollapsed ? "sr-only" : "truncate"}>{item.label}</span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Divider */}
            <div className="px-2 py-2">
              <div className="flex items-center gap-2">
                <div className="h-px w-full bg-white/10" />
              </div>
            </div>

            {/* Secondary Navigation */}
            <ul role="list" className="pb-3">
              {computedItems.slice(4).map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.key}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={[
                          "group flex items-center gap-3 mx-2 my-1",
                          "rounded-md px-2 py-2.5",
                          "transition-colors",
                          active
                            ? "bg-[#0f766e] text-white"
                            : "text-white/85 hover:text-white hover:bg-white/5",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]",
                        ].join(" ")}
                        aria-current={active ? "page" : undefined}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span
                          className={[
                            "min-w-0 truncate",
                            isCollapsed ? "sr-only" : "block",
                          ].join(" ")}
                        >
                          {item.label}
                        </span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onItemSelect?.(item.key)}
                        className={[
                          "group flex w-full items-center gap-3 mx-2 my-1",
                          "rounded-md px-2 py-2.5",
                          "transition-colors",
                          "text-white/85 hover:text-white hover:bg-white/5",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]",
                        ].join(" ")}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <span className={isCollapsed ? "sr-only" : "truncate"}>{item.label}</span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer / Collapse Toggle */}
          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={toggle}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={[
                "w-full inline-flex items-center justify-center gap-2",
                "rounded-md px-3 py-2.5",
                "bg-white/5 hover:bg-white/10 text-white/85 hover:text-white",
                "transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]",
              ].join(" ")}
            >
              <ChevronsLeft
                className={[
                  "h-4 w-4 transition-transform duration-300",
                  isCollapsed ? "rotate-180" : "rotate-0",
                ].join(" ")}
                aria-hidden="true"
              />
              <span className={isCollapsed ? "sr-only" : "text-sm font-medium"}>Collapse</span>
            </button>
            <div className="mt-2 text-[11px] leading-4 text-white/45 text-center">
              {isCollapsed ? (
                <span className="sr-only">Telangana Mining LCA</span>
              ) : (
                "Telangana Mining & Metallurgy LCA"
              )}
            </div>
          </div>
        </div>
      </WrapperTag>
    </>
  );
}