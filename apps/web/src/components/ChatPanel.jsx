import { useState, useEffect, useRef } from "react";
import { AI_RESP, SEV, TYPE_ICON, P } from "../data/constants";
import { Card, CardHeader, Badge } from "./UI";

export default function ChatPanel({ hazards, selectedId, onSelectDistrict }) {
  const [msgs, setMsgs] = useState([
    {
      role: "assistant",
      text: "Hello — I'm the RHIS Intelligence Assistant.\n\nI have live access to hazard data, weather feeds, and incident reports across all 7 provinces of Nepal.\n\nType help for available commands, or click any map marker to query a district automatically.",
    },
  ]);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const endRef              = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  // When user selects a district from the map, auto-fire a query
  useEffect(() => {
    if (!selectedId) return;
    const h = hazards.find(x => x.id === selectedId);
    if (!h) return;
    fireQuery(`District status report for ${h.name}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const fireQuery = (text) => {
    setMsgs(p => [...p, { role: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      let resp;
      if (lower.includes("flood"))                             resp = AI_RESP.flood;
      else if (lower.includes("earth") || lower.includes("seism")) resp = AI_RESP.earthquake;
      else if (lower.includes("weather") || lower.includes("rain") || lower.includes("temp")) resp = AI_RESP.weather;
      else if (lower.includes("help"))                         resp = AI_RESP.help;
      else if (lower.includes("status"))                       resp = AI_RESP.status;
      else if (lower.includes("district status report for ")) {
        const name = text.replace("District status report for ", "");
        const h = hazards.find(x => x.name === name);
        if (h) {
          resp = `${h.name} — District Report\n\nHazard: ${h.type}\nSeverity: ${h.sev}\nProvince: ${h.province}\n\nWeather: ${h.wx} ${h.temp}\nWind: ${h.wind}  |  Humidity: ${h.humidity}  |  Rain: ${h.rain}\n\nSituation: ${h.desc}\nAffected: ${h.affected.toLocaleString()} people\nCasualties: ${h.casualties > 0 ? h.casualties + " confirmed" : "None reported"}\n\nRecommendation: ${h.sev === "Critical" ? "⚠ Immediate evacuation advisory in effect. Emergency services on standby." : "Continue monitoring. Alert status active. Review evacuation routes."}`;
        } else {
          resp = AI_RESP.default(text);
        }
      } else {
        resp = AI_RESP.default(text);
      }
      setMsgs(p => [...p, { role: "assistant", text: resp }]);
      setTyping(false);
    }, 1100);
  };

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setInput("");
    fireQuery(t);
  };

  const QUICK = ["flood", "earthquake", "weather", "status", "help"];

  return (
    <Card style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <CardHeader
        title="RHIS Intelligence"
        icon="🤖"
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: P.tealM }} />
            <span style={{ fontSize: 9, color: P.teal, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Active</span>
          </div>
        }
      />

      {/* Quick-fire buttons */}
      <div style={{
        padding: "7px 11px", borderBottom: "1px solid #eef0f5",
        display: "flex", flexWrap: "wrap", gap: 5, flexShrink: 0,
      }}>
        {QUICK.map(q => (
          <button key={q} onClick={() => fireQuery(q)} style={{
            fontSize: 10, padding: "3px 9px", borderRadius: 6,
            border: "1px solid #d8e0f0", background: "#f5f7fc",
            color: "#4a6080", cursor: "pointer", fontWeight: 700,
          }}>{q}</button>
        ))}
      </div>

      {/* Message thread */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "12px 12px", display: "flex", flexDirection: "column", gap: 9,
      }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ fontSize: 9, color: "#9aa0b4", marginBottom: 3, marginLeft: 3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>RHIS AI</div>
            )}
            <div style={{
              maxWidth: "90%",
              padding: "9px 12px",
              borderRadius: m.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
              background: m.role === "user" ? P.navy : "#f5f7fc",
              color: m.role === "user" ? "#fff" : "#2c3050",
              fontSize: 11, lineHeight: 1.6, whiteSpace: "pre-wrap",
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "8px 12px", background: "#f5f7fc",
            borderRadius: "12px 12px 12px 3px", width: "fit-content",
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: P.blueM, opacity: 0.65,
                animation: `rhisBounce 1s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* District selector shortcut */}
      <div style={{ borderTop: "1px solid #eef0f5", padding: "7px 11px", flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#9aa0b4", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick District Query</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {hazards.map(h => (
            <button key={h.id} onClick={() => { onSelectDistrict(h.id); }} style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 5,
              border: `1px solid ${SEV[h.sev]?.dot}40`,
              background: SEV[h.sev]?.bg, color: SEV[h.sev]?.text,
              cursor: "pointer", fontWeight: 600,
            }}>{h.wx} {h.name}</button>
          ))}
        </div>
      </div>

      {/* Text input */}
      <div style={{
        padding: "9px 10px", borderTop: "1px solid #eef0f5",
        display: "flex", gap: 7, flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about hazards, weather…"
          style={{
            flex: 1, fontSize: 11, padding: "7px 11px",
            borderRadius: 9, border: "1px solid #d0daf0",
            background: "#f8f9fc", color: "#2c3050", outline: "none",
          }}
        />
        <button onClick={send} style={{
          padding: "7px 14px", borderRadius: 9, border: "none",
          background: P.navy, color: "#fff",
          fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}>↗</button>
      </div>
    </Card>
  );
}