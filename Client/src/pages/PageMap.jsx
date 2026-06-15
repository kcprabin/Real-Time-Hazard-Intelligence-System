import { HAZARDS, SEV, TYPE_ICON } from "../data/constants";
import { Card } from "../components/UI";
import NepalMap from "../components/NepalMap";
import LiveFeed from "../components/LiveFeed";
import ChatPanel from "../components/ChatPanel";

export default function PageMap({ activity, selectedId, setSelectedId }) {
  const sel = HAZARDS.find(h => h.id === selectedId);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 270px", gap: 14, height: "calc(100vh - 130px)" }}>

      {/* LEFT — Live feed */}
      <LiveFeed activity={activity} />

      {/* CENTRE — Big map */}
      <Card style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <NepalMap hazards={HAZARDS} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        {sel ? (
          <div style={{
            margin: "0 12px 12px", padding: "12px 14px",
            background: "#f5f8ff", border: "1px solid #d0ddf5", borderRadius: 10,
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 26 }}>{TYPE_ICON[sel.type] || "⚠"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{sel.name}</div>
                <div style={{ fontSize: 11, color: "#5a6080", marginTop: 1 }}>{sel.province} · {sel.type}</div>
                <div style={{ fontSize: 11, color: "#5a6080", marginTop: 4 }}>{sel.desc}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap", fontSize: 11, color: "#5a6080" }}>
                  <span>🌡 {sel.temp}</span>
                  <span>💨 {sel.wind}</span>
                  <span>💧 {sel.humidity}</span>
                  <span>🌧 {sel.rain}</span>
                  <span>👥 {sel.affected.toLocaleString()} affected</span>
                </div>
              </div>
              <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9aa0b4", fontSize: 14 }}>✕</button>
            </div>
          </div>
        ) : (
          <div style={{
            margin: "0 12px 12px", padding: "9px", background: "#f8f9fc",
            border: "1px solid #e8edf5", borderRadius: 10,
            fontSize: 11, color: "#9aa0b4", textAlign: "center", flexShrink: 0,
          }}>
            Click a marker · or use ⛶ Full Map for immersive view
          </div>
        )}
      </Card>

      {/* RIGHT — Chat */}
      <ChatPanel hazards={HAZARDS} selectedId={selectedId} onSelectDistrict={setSelectedId} />
    </div>
  );
}