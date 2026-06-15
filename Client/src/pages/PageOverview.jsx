import { HAZARDS, SEV, TYPE_ICON, P } from "../data/constants";
import { Card, CardHeader, StatTile, SeverityBar, Badge } from "../components/UI";
import NepalMap from "../components/NepalMap";
import LiveFeed from "../components/LiveFeed";
import ChatPanel from "../components/ChatPanel";

export default function PageOverview({ activity, selectedId, setSelectedId }) {
  const crit  = HAZARDS.filter(h => h.sev === "Critical").length;
  const high  = HAZARDS.filter(h => h.sev === "High").length;
  const med   = HAZARDS.filter(h => h.sev === "Medium").length;
  const total = HAZARDS.length;
  const totalAffected = HAZARDS.reduce((s, h) => s + h.affected, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>

      {/* ── KPI strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, flexShrink: 0 }}>
        <StatTile label="Active Incidents"  value={total}         icon="⚡" delta="+2 today"       deltaUp={false} />
        <StatTile label="Critical Alerts"   value={crit}          icon="🚨" delta="Immediate action" deltaUp={false} />
        <StatTile label="People Affected"   value={totalAffected} icon="👥" delta="+840 today"      deltaUp={false} />
        <StatTile label="Provinces Covered" value={7}             icon="📍" delta="All 7 active"    deltaUp={true}  />
      </div>

      {/* ── 3-column main area ── */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 280px", gap: 14, flex: 1, minHeight: 0 }}>

        {/* LEFT — Live feed */}
        <LiveFeed activity={activity} />

        {/* CENTRE — Map + selected detail */}
        <Card style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <NepalMap hazards={HAZARDS} selectedId={selectedId} onSelect={setSelectedId} />
          </div>

          {/* Selected district strip */}
          {selectedId ? (() => {
            const h = HAZARDS.find(x => x.id === selectedId);
            return (
              <div style={{
                margin: "0 12px 12px", padding: "10px 13px",
                background: "#f5f8ff", border: "1px solid #d0ddf5", borderRadius: 10,
                display: "flex", gap: 11, alignItems: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 22 }}>{TYPE_ICON[h.type] || "⚠"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{h.name} — {h.type}</div>
                  <div style={{ fontSize: 11, color: "#5a6080" }}>{h.desc} · {h.wx} {h.temp}</div>
                </div>
                <Badge label={h.sev} bg={SEV[h.sev]?.bg} color={SEV[h.sev]?.text} />
                <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9aa0b4", fontSize: 14 }}>✕</button>
              </div>
            );
          })() : (
            <div style={{
              margin: "0 12px 12px", padding: "8px 13px",
              background: "#f8f9fc", border: "1px solid #e8edf5",
              borderRadius: 10, fontSize: 11, color: "#9aa0b4", textAlign: "center", flexShrink: 0,
            }}>
              Click any marker on the map to view district details
            </div>
          )}

          {/* Severity bars */}
          <div style={{ padding: "0 14px 14px", flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#9aa0b4", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Severity Breakdown</div>
            <SeverityBar label="Critical" count={crit} total={total} color={P.red} />
            <SeverityBar label="High"     count={high} total={total} color={P.amberM} />
            <SeverityBar label="Medium"   count={med}  total={total} color={P.blueM} />
            <SeverityBar label="Low"      count={total - crit - high - med} total={total} color={P.greenM} />
          </div>
        </Card>

        {/* RIGHT — Chat */}
        <ChatPanel hazards={HAZARDS} selectedId={selectedId} onSelectDistrict={setSelectedId} />
      </div>
    </div>
  );
}