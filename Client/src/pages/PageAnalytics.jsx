import { HAZARDS, TYPE_ICON, P } from "../data/constants";
import { Card, CardHeader, StatTile } from "../components/UI";
import LiveFeed from "../components/LiveFeed";
import ChatPanel from "../components/ChatPanel";

const PROVINCE_DATA = [
  { name:"Koshi",         incidents:2, risk:78, affected:5840, color:P.red    },
  { name:"Madhesh",       incidents:1, risk:62, affected:4700, color:P.amberM },
  { name:"Bagmati",       incidents:1, risk:55, affected:1200, color:P.amberM },
  { name:"Gandaki",       incidents:1, risk:88, affected:8400, color:P.red    },
  { name:"Lumbini",       incidents:2, risk:71, affected:5900, color:P.red    },
  { name:"Karnali",       incidents:1, risk:45, affected:640,  color:P.blueM  },
  { name:"Sudurpashchim", incidents:0, risk:38, affected:0,    color:P.greenM },
];

const WEEK = [
  { day:"Mon", count:3 }, { day:"Tue", count:5 }, { day:"Wed", count:4 },
  { day:"Thu", count:6 }, { day:"Fri", count:7 }, { day:"Sat", count:5 }, { day:"Sun", count:8 },
];

export default function PageAnalytics({ activity, selectedId, setSelectedId }) {
  const maxAffected = Math.max(...PROVINCE_DATA.map(p => p.affected));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        <StatTile label="Risk Index"         value="6.8/10" icon="📈" delta="▲ High"    deltaUp={false} />
        <StatTile label="Avg Response Time"  value="18 min" icon="⏱"  delta="↓ 3 min"  deltaUp={true}  />
        <StatTile label="Alert Accuracy"     value="94%"    icon="🎯" delta="+2%"        deltaUp={true}  />
        <StatTile label="7-day Trend"        value="↑ 12%"  icon="📊" delta="Worsening"  deltaUp={false} />
      </div>

      {/* 3-column */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 270px", gap: 14 }}>

        {/* LEFT */}
        <LiveFeed activity={activity} />

        {/* CENTRE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Province risk */}
            <Card>
              <CardHeader title="Province Risk Assessment" icon="📊" />
              <div style={{ padding: "14px 16px" }}>
                {PROVINCE_DATA.map(p => (
                  <div key={p.name} style={{ marginBottom: 11 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: "#1a1a2e", fontWeight: 600 }}>{p.name}</span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: "#9aa0b4" }}>{p.incidents} incidents</span>
                        <span style={{ fontSize: 11, color: p.color, fontWeight: 700 }}>{p.risk}%</span>
                      </div>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "#eef1f8" }}>
                      <div style={{ height: "100%", width: `${p.risk}%`, background: p.color, borderRadius: 3, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Affected population */}
            <Card>
              <CardHeader title="Population Affected" icon="👥" />
              <div style={{ padding: "14px 16px" }}>
                {PROVINCE_DATA.filter(p => p.affected > 0).sort((a, b) => b.affected - a.affected).map(p => (
                  <div key={p.name} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                    <div style={{ width: 80, fontSize: 10, color: "#5a6080", fontWeight: 600, flexShrink: 0 }}>{p.name}</div>
                    <div style={{ flex: 1, height: 16, borderRadius: 3, background: "#eef1f8", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(p.affected / maxAffected) * 100}%`, background: p.color, borderRadius: 3, display: "flex", alignItems: "center", paddingLeft: 5 }}>
                        <span style={{ fontSize: 9, color: "white", fontWeight: 700, whiteSpace: "nowrap" }}>{p.affected > 500 ? p.affected.toLocaleString() : ""}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: "#1a1a2e", fontWeight: 700, width: 46, textAlign: "right" }}>{p.affected.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Hazard distribution */}
            <Card>
              <CardHeader title="Hazard Distribution" icon="🔢" />
              <div style={{ padding: "14px 16px" }}>
                {Object.entries(HAZARDS.reduce((a, h) => { a[h.type] = (a[h.type] || 0) + 1; return a; }, {})).map(([type, count], i) => {
                  const colors = [P.blueM, P.red, P.amberM, P.tealM, P.greenM, P.grayM];
                  return (
                    <div key={type} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 15, width: 22 }}>{TYPE_ICON[type] || "⚠"}</span>
                      <span style={{ fontSize: 11, color: "#5a6080", fontWeight: 600, width: 80, flexShrink: 0 }}>{type}</span>
                      <div style={{ flex: 1, height: 12, borderRadius: 3, background: "#eef1f8", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(count / HAZARDS.length) * 100}%`, background: colors[i % colors.length], borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", width: 14, textAlign: "right" }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 7-day trend */}
            <Card>
              <CardHeader title="7-Day Incident Trend" icon="📅" />
              <div style={{ padding: "14px 16px" }}>
                {WEEK.map(({ day, count }, i) => (
                  <div key={day} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "#9aa0b4", width: 26, fontWeight: 600 }}>{day}</span>
                    <div style={{ flex: 1, height: 14, borderRadius: 3, background: "#eef1f8", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(count / 8) * 100}%`, background: i === 6 ? P.red : P.blueM, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: i === 6 ? P.red : "#1a1a2e", width: 12, textAlign: "right" }}>{count}</span>
                  </div>
                ))}
                <div style={{ marginTop: 10, padding: "9px 10px", background: "#f8f9fc", borderRadius: 8, fontSize: 11, color: "#5a6080", lineHeight: 1.5 }}>
                  Incidents trending upward. Peak on Sunday likely monsoon-related. Recommend elevated readiness for next 72 hrs.
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT — Chat */}
        <ChatPanel hazards={HAZARDS} selectedId={selectedId} onSelectDistrict={setSelectedId} />
      </div>
    </div>
  );
}