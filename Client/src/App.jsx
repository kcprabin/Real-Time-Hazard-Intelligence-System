import { useState, useEffect } from "react";
import { HAZARDS, P } from "./data/constants";
import { useClock, useActivityFeed } from "./hooks/useRHIS";
import Sidebar  from "./components/Sidebar";
import TopBar   from "./components/TopBar";

import PageOverview  from "./pages/PageOverview";
import PageMap       from "./pages/PageMap";
import PageIncidents from "./pages/PageIncidents";
import PageWeather   from "./pages/PageWeather";
import PageAnalytics from "./pages/PageAnalytics";
import PageSettings  from "./pages/PageSettings";

export default function App() {
  const [page, setPage]           = useState("overview");
  const [selectedId, setSelectedId] = useState(null);
  const { time, pulse }           = useClock();
  const activity                  = useActivityFeed();

  //  Theme State Logic 
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("rhis-theme");
      if (savedTheme) return savedTheme;

      // Fallback to system OS preferences if no history exists
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemPrefersDark ? "dark" : "light";
    }
    return "light";
  });

  // Sync the current theme state to the DOM and local storage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("rhis-theme", theme);
  }, [theme]);

  const critCount = HAZARDS.filter(h => h.sev === "Critical").length;

  // Added theme and setTheme into sharedProps so your pages/components can access them if needed
  const sharedProps = { activity, selectedId, setSelectedId, theme, setTheme };

  return (
    <div style={{
      display: "flex", 
      height: "100vh", 
      overflow: "hidden",
      fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
      background: "var(--rhis-bg-main)",
      color: "var(--rhis-text-main)",
      transition: "background 0.3s ease, color 0.3s ease"
    }}>
      {/*  Sidebar  */}
      <Sidebar page={page} setPage={setPage} time={time} pulse={pulse} critCount={critCount} />

      {/*  Main column  */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar (Pass theme state variables here so you can place the toggle buttons inside it) */}
        <TopBar page={page} setPage={setPage} critCount={critCount} theme={theme} setTheme={setTheme} />

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
          {page === "overview"  && <PageOverview  {...sharedProps} />}
          {page === "map"       && <PageMap       {...sharedProps} />}
          {page === "incidents" && <PageIncidents {...sharedProps} />}
          {page === "weather"   && <PageWeather   {...sharedProps} />}
          {page === "analytics" && <PageAnalytics {...sharedProps} />}
          {page === "settings"  && <PageSettings  {...sharedProps} />}
        </div>

        {/* Status bar */}
        <div style={{
          background: "var(--rhis-bg-surface)", 
          borderTop: "1px solid var(--rhis-border)",
          padding: "4px 20px", 
          display: "flex",
          justifyContent: "space-between", 
          alignItems: "center", 
          flexShrink: 0,
          transition: "background 0.3s ease, border-color 0.3s ease"
        }}>
          <div style={{ fontSize: 10, color: "var(--rhis-text-muted)" }}>
            RHIS v4.2 · Nepal National Operations Centre · All times UTC · Refreshes every 30s
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["DHM", "NDRRMA", "NSC", "USGS", "IMD"].map(s => (
              <span key={s} style={{ fontSize: 10, color: P.tealM, fontWeight: 700 }}>✓ {s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Global CSS Variables Configuration & Animations */}
      <style>{`
        /* ── Bright/Light Theme Values ── */
        :root {
          --rhis-bg-main: #f2f5fb;
          --rhis-bg-surface: #ffffff;
          --rhis-text-main: #1e293b;
          --rhis-text-muted: #9aa0b4;
          --rhis-border: #e3e8f0;
        }

        /* ── Dark Theme Values ── */
        [data-theme="dark"] {
          --rhis-bg-main: #0f172a;
          --rhis-bg-surface: #1e293b;
          --rhis-text-main: #f8fafc;
          --rhis-text-muted: #64748b;
          --rhis-border: #334155;
        }

        @keyframes rhisBounce {
          0%,80%,100% { transform:translateY(0) }
          40%          { transform:translateY(-4px) }
        }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#d0d8e8; border-radius:2px; }
        * { box-sizing:border-box; }
      `}</style>
    </div>
  );
}