import { HAZARDS, P } from "../data/constants";
import { Card, CardHeader, StatTile } from "../components/UI";
import LiveFeed from "../components/LiveFeed";
import ChatPanel from "../components/ChatPanel";

const PROVINCES = [
  { name:"Koshi",          emoji:"⛈", temp:"26–29°C", rain:"38mm", wind:"18 km/h", status:"Monsoon Active", color:P.blueM  },
  { name:"Madhesh",        emoji:"🌧", temp:"25–28°C", rain:"22mm", wind:"12 km/h", status:"Heavy Rain",     color:P.blueM  },
  { name:"Bagmati",        emoji:"⛅", temp:"18–22°C", rain:"6mm",  wind:"10 km/h", status:"Partly Cloudy",  color:P.amberM },
  { name:"Gandaki",        emoji:"🌧", temp:"14–18°C", rain:"42mm", wind:"8 km/h",  status:"Flood Watch",    color:P.red    },
  { name:"Lumbini",        emoji:"🌧", temp:"22–26°C", rain:"18mm", wind:"14 km/h", status:"Alert",          color:P.amberM },
  { name:"Karnali",        emoji:"❄",  temp:"−6–4°C",  rain:"0mm",  wind:"32 km/h", status:"Blizzard",       color:P.red    },
  { name:"Sudurpashchim",  emoji:"☀",  temp:"30–35°C", rain:"0mm",  wind:"8 km/h",  status:"Heatwave",       color:P.amberM },
];

const ALERTS = [
  { icon:"🔴", msg:"Flood warning — Gandaki & Koshi basins",    detail:"Next 48 hrs"  },
  { icon:"🔴", msg:"Blizzard — Karnali mountain districts",     detail:"Ongoing"       },
  { icon:"🟠", msg:"Heavy rain — Madhesh & Lumbini",            detail:"Next 24 hrs"  },
  { icon:"🟠", msg:"Heatwave — Sudurpashchim Terai",            detail:"Next 72 hrs"  },
  { icon:"🟡", msg:"Thunderstorms — Bagmati region",            detail:"Tonight"       },
];

export default function PageWeather({ activity, selectedId, setSelectedId }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <StatTile label="Active Alerts"     value={5}      icon="⚠" delta="2 Red" deltaUp={false} />
        <StatTile label="Avg Temp (Terai)"  value="36°C"   icon="🌡" />
        <StatTile label="Monsoon Rainfall"  value="+22%"   icon="🌧" delta="Above avg" deltaUp={false} />
        <StatTile label="Wind Max"          value="35 km/h" icon="💨" delta="Karnali" />
      </div>

      {/* 3-column */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 270px", gap: 14 }}>

        {/* LEFT */}
        <LiveFeed activity={activity} />

        {/* CENTRE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Province cards */}
          <Card>
            <CardHeader title="Province Weather Overview" icon="🌦" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
              {PROVINCES.map((p, i) => (
                <div key={p.name} style={{
                  padding: "13px 14px",
                  borderRight: i % 4 !== 3 ? "1px solid #f0f2f8" : "none",
                  borderBottom: i < 4 ? "1px solid #f0f2f8" : "none",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 3 }}>{p.emoji}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e" }}>{p.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", margin: "3px 0" }}>{p.temp}</div>
                  <div style={{
                    fontSize: 9, color: p.color, fontWeight: 700, textTransform: "uppercase",
                    background: p.color + "18", padding: "1px 6px", borderRadius: 4,
                    display: "inline-block", marginBottom: 6,
                  }}>{p.status}</div>
                  <div style={{ fontSize: 10, color: "#7a8099" }}>🌧 {p.rain}</div>
                  <div style={{ fontSize: 10, color: "#7a8099" }}>💨 {p.wind}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* District table */}
          <Card>
            <CardHeader title="District Conditions" icon="🌡" />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8f9fc" }}>
                    {["District", "Wx", "Temp", "Humidity", "Rainfall", "Wind"].map(h => (
                      <th key={h} style={{ fontSize: 10, color: "#9aa0b4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", padding: "8px 12px", textAlign: "left", borderBottom: "1px solid #eef0f5" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HAZARDS.map(h => (
                    <tr key={h.id}
                      onClick={() => setSelectedId(h.id === selectedId ? null : h.id)}
                      style={{ cursor: "pointer", borderBottom: "1px solid #f5f6fa", background: selectedId === h.id ? "#f0f6ff" : "" }}
                      onMouseEnter={e => { if (selectedId !== h.id) e.currentTarget.style.background = "#f8faff"; }}
                      onMouseLeave={e => { if (selectedId !== h.id) e.currentTarget.style.background = ""; }}
                    >
                      <td style={{ padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "#1a1a2e" }}>{h.name}</td>
                      <td style={{ padding: "8px 12px", fontSize: 17 }}>{h.wx}</td>
                      <td style={{ padding: "8px 12px", fontSize: 12, fontWeight: 700 }}>{h.temp}</td>
                      <td style={{ padding: "8px 12px", fontSize: 12, color: "#5a6080" }}>{h.humidity}</td>
                      <td style={{ padding: "8px 12px", fontSize: 12, color: parseInt(h.rain) > 20 ? P.blueM : "#5a6080", fontWeight: parseInt(h.rain) > 20 ? 700 : 400 }}>{h.rain}</td>
                      <td style={{ padding: "8px 12px", fontSize: 11, color: "#5a6080" }}>{h.wind}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* RIGHT — Chat (replaces old weather alerts col) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ flex: "0 0 auto" }}>
            <CardHeader title="Active Weather Alerts" icon="⚠" />
            <div style={{ padding: "4px 0" }}>
              {ALERTS.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", borderBottom: "1px solid #f5f6fa", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 13 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1a2e" }}>{a.msg}</div>
                    <div style={{ fontSize: 10, color: "#9aa0b4" }}>{a.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ flex: 1 }}>
            <ChatPanel hazards={HAZARDS} selectedId={selectedId} onSelectDistrict={setSelectedId} />
          </div>
        </div>
      </div>
    </div>
  );
}