import { P } from "../data/constants";

// ─── Badge ────────────────────────────────────────────────────────────────
export function Badge({ label, bg, color, size = 10 }) {
  return (
    <span style={{
      fontSize: size, fontWeight: 700, background: bg, color,
      padding: "2px 7px", borderRadius: 4,
      textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e3e8f0",
      borderRadius: 14, overflow: "hidden", ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Card header row ──────────────────────────────────────────────────────
export function CardHeader({ title, icon, right }) {
  return (
    <div style={{
      padding: "11px 16px", borderBottom: "1px solid #eef0f5",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{title}</span>
      </div>
      {right && <div style={{ display: "flex", alignItems: "center", gap: 6 }}>{right}</div>}
    </div>
  );
}

// ─── KPI tile ─────────────────────────────────────────────────────────────
export function StatTile({ label, value, delta, deltaUp, icon }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e3e8f0",
      borderRadius: 12, padding: "14px 16px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 20, lineHeight: 1 }}>{icon}</div>
        {delta && (
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: deltaUp ? P.green : P.red,
            background: deltaUp ? P.greenL : P.redL,
            padding: "1px 6px", borderRadius: 4,
          }}>{delta}</span>
        )}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.5px", marginTop: 4 }}>
        {typeof value === "number" && value > 999 ? value.toLocaleString() : value}
      </div>
      <div style={{ fontSize: 10, color: "#7a8099", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {label}
      </div>
    </div>
  );
}

// ─── Horizontal severity bar ──────────────────────────────────────────────
export function SeverityBar({ label, count, total, color }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "#5a6080", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 11, color, fontWeight: 700 }}>{count}</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "#eef1f8" }}>
        <div style={{
          height: "100%",
          width: `${Math.max(4, Math.round((count / total) * 100))}%`,
          background: color, borderRadius: 3, transition: "width 0.8s ease",
        }} />
      </div>
    </div>
  );
}

// ─── Coloured dot for activity feed ──────────────────────────────────────
export function ActivityDot({ type }) {
  const c = { critical: P.red, high: P.amberM, medium: P.blueM, low: P.greenM };
  return (
    <div style={{
      width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
      marginTop: 6, background: c[type] || P.gray,
    }} />
  );
}

// ─── Pulsing LIVE badge ───────────────────────────────────────────────────
export function LiveBadge({ pulse }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: pulse ? P.red : "#e88",
        boxShadow: pulse ? `0 0 0 3px rgba(226,75,74,0.22)` : "none",
        transition: "all 0.5s",
      }} />
      <span style={{ fontSize: 9, fontWeight: 700, color: P.red, letterSpacing: "0.07em" }}>LIVE</span>
    </div>
  );
}

// Toggle switch 
export function Toggle({ on, onChange, color = P.tealM }) {
  return (
    <div onClick={() => onChange(!on)} style={{
      width: 36, height: 20, borderRadius: 10,
      background: on ? color : "#d0d8e8",
      cursor: "pointer", position: "relative", transition: "background 0.2s",
    }}>
      <div style={{
        position: "absolute", top: 2,
        left: on ? 16 : 2,
        width: 16, height: 16, borderRadius: "50%",
        background: "white", transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }} />
    </div>
  );
}