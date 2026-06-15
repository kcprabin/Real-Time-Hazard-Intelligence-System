import { P } from "../data/constants";
import { Card, CardHeader, ActivityDot } from "./UI";

export default function LiveFeed({ activity, compact = false }) {
  const typeColors = {
    critical: { bg: "#fff8f8", bar: P.red },
    high:     { bg: "#fffcf4", bar: P.amberM },
    medium:   { bg: "#f4f8ff", bar: P.blueM },
    low:      { bg: "#f4faf4", bar: P.greenM },
  };

  return (
    <Card style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <CardHeader
        title="Live Activity Feed"
        icon="📡"
        right={
          <div style={{
            fontSize: 9, background: P.redL, color: P.red,
            padding: "2px 8px", borderRadius: 4, fontWeight: 700,
            letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: P.red, display: "inline-block",
            }} />
            LIVE
          </div>
        }
      />

      {/* Count summary */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 8, padding: "10px 12px",
        borderBottom: "1px solid #eef0f5", flexShrink: 0,
      }}>
        {[
          { l: "Critical", v: activity.filter(a => a.type === "critical").length, c: P.red,    bg: P.redL    },
          { l: "High",     v: activity.filter(a => a.type === "high").length,     c: P.amber,  bg: P.amberL  },
          { l: "Medium",   v: activity.filter(a => a.type === "medium").length,   c: P.blue,   bg: P.blueL   },
          { l: "Low",      v: activity.filter(a => a.type === "low").length,      c: P.green,  bg: P.greenL  },
        ].map(b => (
          <div key={b.l} style={{ background: b.bg, borderRadius: 8, padding: "6px 9px" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: b.c }}>{b.v}</div>
            <div style={{ fontSize: 9, color: b.c, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.85 }}>{b.l}</div>
          </div>
        ))}
      </div>

      {/* Scrollable events */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
        {activity.map((a, i) => {
          const tc = typeColors[a.type] || {};
          return (
            <div key={i} style={{
              display: "flex", gap: 9, padding: "8px 13px",
              borderBottom: "1px solid #f5f6fa",
              alignItems: "flex-start",
              background: i === 0 ? tc.bg : "transparent",
              borderLeft: i === 0 ? `3px solid ${tc.bar}` : "3px solid transparent",
              transition: "background 0.3s",
            }}>
              <ActivityDot type={a.type} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 9, fontFamily: "monospace",
                  color: "#9aa0b4", marginBottom: 2, letterSpacing: "0.04em",
                }}>{a.time} UTC</div>
                <div style={{ fontSize: 11, color: "#2c3050", lineHeight: 1.45 }}>{a.event}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}