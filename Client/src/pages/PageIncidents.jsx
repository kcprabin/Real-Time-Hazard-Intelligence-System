import { useState } from "react";
import { HAZARDS, SEV, TYPE_ICON, P } from "../data/constants";
import { Card, CardHeader, StatTile, Badge } from "../components/UI";
import LiveFeed from "../components/LiveFeed";
import ChatPanel from "../components/ChatPanel";

export default function PageIncidents({ activity, selectedId, setSelectedId }) {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("sev");

  const SEV_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const FILTERS   = ["All", "Critical", "High", "Medium", "Flood", "Earthquake", "Landslide"];

  const filtered = HAZARDS.filter(h =>
    filter === "All" ? true : h.sev === filter || h.type === filter
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "sev")      return SEV_ORDER[a.sev] - SEV_ORDER[b.sev];
    if (sortBy === "affected") return b.affected - a.affected;
    return a.name.localeCompare(b.name);
  });

  const sel = HAZARDS.find(h => h.id === selectedId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <StatTile label="Total Incidents"  value={HAZARDS.length}                                       icon="📋" />
        <StatTile label="Critical"         value={HAZARDS.filter(h => h.sev === "Critical").length}     icon="🚨" delta="Immediate" deltaUp={false} />
        <StatTile label="Total Casualties" value={HAZARDS.reduce((s, h) => s + h.casualties, 0)}        icon="🚑" delta="Confirmed" />
        <StatTile label="Total Affected"   value={HAZARDS.reduce((s, h) => s + h.affected, 0)}          icon="👥" />
      </div>

      {/* 3-col layout */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 270px", gap: 14 }}>

        {/* LEFT — Live feed */}
        <LiveFeed activity={activity} />

        {/* CENTRE — Table */}
        <Card>
          <CardHeader
            title="Incident Registry"
            icon="📋"
            right={
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#9aa0b4" }}>Sort:</span>
                {[["sev", "Severity"], ["affected", "Affected"], ["name", "Name"]].map(([k, l]) => (
                  <button key={k} onClick={() => setSortBy(k)} style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 5, border: "none",
                    cursor: "pointer", fontFamily: "inherit",
                    background: sortBy === k ? P.navy : "#f0f3fa",
                    color: sortBy === k ? "#fff" : "#5a6080", fontWeight: 700,
                  }}>{l}</button>
                ))}
              </div>
            }
          />

          {/* Filter bar */}
          <div style={{ padding: "8px 14px", borderBottom: "1px solid #eef0f5", display: "flex", gap: 5, flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6,
                border: "none", cursor: "pointer", fontFamily: "inherit",
                background: filter === f ? P.navy : "#f0f3fa",
                color: filter === f ? "#fff" : "#5a6080",
              }}>{f}</button>
            ))}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fc" }}>
                  {["", "District", "Province", "Type", "Severity", "Affected", "Casualties", "Weather"].map((h, i) => (
                    <th key={i} style={{
                      fontSize: 10, color: "#9aa0b4", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      padding: "8px 12px", textAlign: "left",
                      borderBottom: "1px solid #eef0f5",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(h => (
                  <tr key={h.id}
                    onClick={() => setSelectedId(h.id === selectedId ? null : h.id)}
                    style={{
                      cursor: "pointer", borderBottom: "1px solid #f5f6fa",
                      background: selectedId === h.id ? "#f0f6ff" : "",
                    }}
                    onMouseEnter={e => { if (selectedId !== h.id) e.currentTarget.style.background = "#f8faff"; }}
                    onMouseLeave={e => { if (selectedId !== h.id) e.currentTarget.style.background = ""; }}
                  >
                    <td style={{ padding: "9px 12px", fontSize: 17 }}>{TYPE_ICON[h.type] || "⚠"}</td>
                    <td style={{ padding: "9px 12px", fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{h.name}</td>
                    <td style={{ padding: "9px 12px", fontSize: 11, color: "#5a6080" }}>{h.province}</td>
                    <td style={{ padding: "9px 12px", fontSize: 11, color: "#5a6080" }}>{h.type}</td>
                    <td style={{ padding: "9px 12px" }}><Badge label={h.sev} bg={SEV[h.sev]?.bg} color={SEV[h.sev]?.text} /></td>
                    <td style={{ padding: "9px 12px", fontSize: 12, fontWeight: 600 }}>{h.affected.toLocaleString()}</td>
                    <td style={{ padding: "9px 12px", fontSize: 12, color: h.casualties > 0 ? P.red : P.green, fontWeight: 700 }}>
                      {h.casualties > 0 ? `⚠ ${h.casualties}` : "✓ 0"}
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 13 }}>{h.wx} {h.temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail panel below table when selected */}
          {sel && (
            <div style={{ margin: "0 12px 12px", padding: "12px 14px", background: "#f5f8ff", border: "1px solid #d0ddf5", borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>
                  {TYPE_ICON[sel.type]} {sel.name}
                </div>
                <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9aa0b4" }}>✕</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[
                  ["Severity", sel.sev], ["Province", sel.province], ["Type", sel.type],
                  ["Temp", sel.temp], ["Wind", sel.wind], ["Humidity", sel.humidity],
                  ["Rainfall", sel.rain], ["Affected", sel.affected.toLocaleString()], ["Casualties", sel.casualties || "None"],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "#fff", borderRadius: 7, padding: "7px 9px" }}>
                    <div style={{ fontSize: 9, color: "#9aa0b4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* RIGHT — Chat */}
        <ChatPanel hazards={HAZARDS} selectedId={selectedId} onSelectDistrict={setSelectedId} />
      </div>
    </div>
  );
}