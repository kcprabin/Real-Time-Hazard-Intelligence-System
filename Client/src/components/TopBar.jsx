import { P, NAV_ITEMS } from "../data/constants";

const PAGE_TITLES = {
  overview:  "Overview",
  map:       "Live Map",
  incidents: "Incidents",
  weather:   "Weather",
  analytics: "Analytics",
  settings:  "Settings",
};

export default function TopBar({ page, setPage, critCount, theme, setTheme }) {
  return (
    <div style={{
      background: "var(--rhis-bg-surface)", 
      borderBottom: "1px solid var(--rhis-border)",
      padding: "0 20px", 
      height: 50,
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      flexShrink: 0,
      transition: "background 0.3s ease, border-color 0.3s ease"
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--rhis-text-main)" }}>
          {PAGE_TITLES[page]}
        </div>
        <div style={{ fontSize: 10, color: "var(--rhis-text-muted)" }}>
          Real-time Hazard Intelligence System · Nepal
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Critical Hazards Indicator */}
        <div style={{
          background: P.redL, 
          color: P.red,
          padding: "3px 11px", 
          borderRadius: 6,
          fontSize: 11, 
          fontWeight: 700, 
          display: "flex", 
          gap: 5, 
          alignItems: "center",
        }}>
          🚨 <span>{critCount} Critical</span>
        </div>

        {/* Shortcut pills */}
        {NAV_ITEMS.filter(n => ["overview", "map", "incidents"].includes(n.id)).map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            fontSize: 11, 
            padding: "4px 10px", 
            borderRadius: 7,
            border: "1px solid var(--rhis-border)",
            background: page === n.id ? "var(--rhis-bg-main)" : "var(--rhis-bg-surface)",
            color: page === n.id ? P.blue : "var(--rhis-text-main)",
            cursor: "pointer", 
            fontWeight: 600,
            display: "flex", 
            gap: 5, 
            alignItems: "center",
            fontFamily: "inherit",
            transition: "all 0.2s ease"
          }}>
            <span>{n.icon}</span><span>{n.label}</span>
          </button>
        ))}

        {/* Vertical Divider line */}
        <div style={{ width: 1, height: 20, background: "var(--rhis-border)" }}></div>

        {/*  Theme Toggles  */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {/* Bright Theme Button */}
          <button
            onClick={() => setTheme("light")}
            disabled={theme === "light"}
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 6,
              fontWeight: 600,
              cursor: theme === "light" ? "not-allowed" : "pointer",
              border: "1px solid var(--rhis-border)",
              background: theme === "light" ? "#2563eb" : "var(--rhis-bg-surface)",
              color: theme === "light" ? "#ffffff" : "var(--rhis-text-main)",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.2s ease"
            }}
          >
            ☀️ Bright
          </button>

          {/* Dark Theme Button */}
          <button
            onClick={() => setTheme("dark")}
            disabled={theme === "dark"}
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 6,
              fontWeight: 600,
              cursor: theme === "dark" ? "not-allowed" : "pointer",
              border: "1px solid var(--rhis-border)",
              background: theme === "dark" ? "#3b82f6" : "var(--rhis-bg-surface)",
              color: theme === "dark" ? "#ffffff" : "var(--rhis-text-main)",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.2s ease"
            }}
          >
            🌙 Dark
          </button>
        </div>

      </div>
    </div>
  );
}