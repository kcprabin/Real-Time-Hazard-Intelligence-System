import { NAV_ITEMS, P } from "../data/constants";
import { LiveBadge } from "./UI";

export default function Sidebar({ page, setPage, time, pulse, critCount }) {
  return (
    <div style={{
      width: 190, background: P.navy,
      display: "flex", flexDirection: "column",
      flexShrink: 0, borderRight: "1px solid #0a1e4a",
    }}>
      {/* Logo */}
      <div style={{ padding: "14px 14px 11px", borderBottom: "1px solid #1a3a6b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            background: "linear-gradient(135deg,#185FA5,#1D9E75)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>⚠️</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: "-0.2px" }}>RHIS</div>
            <div style={{ fontSize: 8, color: "#7a9abf", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Nepal NOC</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(item => {
          const active = page === item.id;
          const hasAlert = ["incidents"].includes(item.id);
          return (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "9px 11px", borderRadius: 9, border: "none",
              cursor: "pointer", width: "100%", textAlign: "left",
              background: active ? "rgba(255,255,255,0.12)" : "transparent",
              color: active ? "#fff" : "#8aabcc",
              fontWeight: active ? 700 : 500, fontSize: 12,
              transition: "all 0.15s", position: "relative",
              fontFamily: "inherit",
            }}>
              {active && (
                <div style={{
                  position: "absolute", left: 0, top: "20%", bottom: "20%",
                  width: 3, borderRadius: "0 2px 2px 0", background: "#378ADD",
                }} />
              )}
              <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
              {hasAlert && !active && (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: P.red, marginLeft: "auto" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div style={{ padding: "11px 13px", borderTop: "1px solid #1a3a6b" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
          <LiveBadge pulse={pulse} />
          <span style={{ fontSize: 9, color: "#7a9abf", fontFamily: "monospace", letterSpacing: "0.04em" }}>
            {time.toTimeString().slice(0, 8)}
          </span>
        </div>
        <div style={{ fontSize: 9, color: "#4a6a8a", lineHeight: 1.5 }}>
          {critCount} critical · 7 provinces<br />All sensors nominal
        </div>
      </div>
    </div>
  );
}