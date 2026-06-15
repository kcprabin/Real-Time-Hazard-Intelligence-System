import { useState } from "react";
import { P } from "../data/constants";
import { Card, CardHeader, Toggle } from "../components/UI";
import LiveFeed from "../components/LiveFeed";
import ChatPanel from "../components/ChatPanel";
import { HAZARDS } from "../data/constants";

export default function PageSettings({ activity, selectedId, setSelectedId }) {
  const [notif,   setNotif]   = useState({ critical:true, high:true, medium:false, low:false });
  const [refresh, setRefresh] = useState("30");
  const [unit,    setUnit]    = useState("metric");

  const SOURCES = [
    { name:"DHM Nepal",    type:"Hydrology & Flood",  status:"Online",  color:P.teal  },
    { name:"NDRRMA",       type:"Disaster Mgmt",       status:"Online",  color:P.teal  },
    { name:"NSC",          type:"Seismic Monitor",     status:"Online",  color:P.teal  },
    { name:"USGS Global",  type:"Earthquakes",         status:"Online",  color:P.teal  },
    { name:"IMD India",    type:"Meteorology",         status:"Online",  color:P.teal  },
    { name:"Satellite",    type:"Imagery (6 hr)",      status:"Degraded",color:P.amberM},
    { name:"MODIS",        type:"Fire Detection",      status:"Online",  color:P.teal  },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 270px", gap: 14 }}>

      {/* LEFT */}
      <LiveFeed activity={activity} />

      {/* CENTRE */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignContent: "start" }}>

        {/* Notifications */}
        <Card>
          <CardHeader title="Alert Notifications" icon="🔔" />
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["critical", "Critical Alerts",  "Immediate response",  P.red    ],
              ["high",     "High Alerts",       "Urgent attention",    P.amberM ],
              ["medium",   "Medium Alerts",     "Monitor & prepare",   P.blueM  ],
              ["low",      "Low Alerts",        "Informational",       P.greenM ],
            ].map(([key, label, desc, color]) => (
              <div key={key} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 11px", background: "#f8f9fc", borderRadius: 9,
                border: `1px solid ${notif[key] ? color + "40" : "#e3e8f0"}`,
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{label}</div>
                  <div style={{ fontSize: 10, color: "#7a8099" }}>{desc}</div>
                </div>
                <Toggle on={notif[key]} onChange={v => setNotif(n => ({ ...n, [key]: v }))} color={color} />
              </div>
            ))}
          </div>
        </Card>

        {/* Display prefs */}
        <Card>
          <CardHeader title="Data & Display" icon="⚙" />
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#5a6080", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Refresh Interval</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["10", "30", "60", "120"].map(v => (
                  <button key={v} onClick={() => setRefresh(v)} style={{
                    flex: 1, padding: "7px", borderRadius: 7, fontFamily: "inherit",
                    border: `1px solid ${refresh === v ? P.blue : "#e0e6f0"}`,
                    background: refresh === v ? P.blueL : "#f8f9fc",
                    color: refresh === v ? P.blue : "#5a6080",
                    fontWeight: 700, fontSize: 11, cursor: "pointer",
                  }}>{v}s</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#5a6080", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Units</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["metric", "Metric (°C, km)"], ["imperial", "Imperial (°F, mi)"]].map(([v, l]) => (
                  <button key={v} onClick={() => setUnit(v)} style={{
                    flex: 1, padding: "7px", borderRadius: 7, fontFamily: "inherit",
                    border: `1px solid ${unit === v ? P.blue : "#e0e6f0"}`,
                    background: unit === v ? P.blueL : "#f8f9fc",
                    color: unit === v ? P.blue : "#5a6080",
                    fontWeight: 700, fontSize: 11, cursor: "pointer",
                  }}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ height: 1, background: "#eef0f5" }} />
            {[
              ["Map Style",  "Terrain + Satellite"],
              ["Language",   "English"],
              ["Timezone",   "UTC (Nepal: UTC+5:45)"],
              ["Version",    "RHIS v4.2.1 — Latest"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#7a8099" }}>{k}</span>
                <span style={{ color: "#1a1a2e", fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Data sources */}
        <Card>
          <CardHeader title="Data Source Config" icon="🛰" />
          <div style={{ padding: "10px 14px" }}>
            {SOURCES.map(s => (
              <div key={s.name} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #f5f6fa", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e" }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: "#9aa0b4" }}>{s.type}</div>
                </div>
                <span style={{ fontSize: 10, color: s.color, fontWeight: 700 }}>● {s.status}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* About */}
        <Card>
          <CardHeader title="About RHIS" icon="ℹ" />
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ background: "linear-gradient(135deg,#0f2a5e,#185FA5)", borderRadius: 10, padding: "16px", color: "white" }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 3 }}>Real-time Hazard Intelligence System</div>
              <div style={{ fontSize: 10, opacity: 0.8 }}>Nepal National Operations Centre</div>
            </div>
            {[
              ["Version",    "RHIS v4.2.1"],
              ["Coverage",   "All 7 provinces, 77 districts"],
              ["Sensors",    "28 wx · 14 seismic · 34 flood"],
              ["Uptime",     "99.8% (30 days)"],
              ["Last Sync",  "14:32:05 UTC"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", borderBottom: "1px solid #f5f6fa" }}>
                <span style={{ color: "#7a8099" }}>{k}</span>
                <span style={{ color: "#1a1a2e", fontWeight: 700 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* RIGHT — Chat */}
      <ChatPanel hazards={HAZARDS} selectedId={selectedId} onSelectDistrict={setSelectedId} />
    </div>
  );
}