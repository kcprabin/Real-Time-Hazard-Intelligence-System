import { useState } from "react";
import { P } from "../data/constants";

// ─── Province colours (matching reference image style) ────────────────────
const PROVINCE_COLORS = {
  sudurpashchim: { fill:"#9B59B6", stroke:"#7D3C98", name:"Sudurpashchim" },
  karnali:       { fill:"#1ABC9C", stroke:"#148F77", name:"Karnali"        },
  lumbini:       { fill:"#E67E22", stroke:"#CA6F1E", name:"Lumbini"        },
  bagmati:       { fill:"#2980B9", stroke:"#1A5276", name:"Bagmati"        },
  gandaki:       { fill:"#27AE60", stroke:"#1E8449", name:"Gandaki"        },
  madhesh:       { fill:"#E74C3C", stroke:"#B03A2E", name:"Madhesh"        },
  koshi:         { fill:"#F1C40F", stroke:"#B7950B", name:"Koshi"          },
};

// ─── All 77 districts with province, approximate SVG coords ───────────────
// SVG viewBox: 0 0 1000 400  (Nepal's ~5:2 aspect ratio)
const DISTRICTS = [
  // SUDURPASHCHIM (west)
  { id:"darchula",      name:"Darchula",      province:"sudurpashchim", cx:28,  cy:62  },
  { id:"baitadi",       name:"Baitadi",        province:"sudurpashchim", cx:52,  cy:88  },
  { id:"dadeldhura",    name:"Dadeldhura",     province:"sudurpashchim", cx:52,  cy:118 },
  { id:"doti",          name:"Doti",           province:"sudurpashchim", cx:80,  cy:108 },
  { id:"achham",        name:"Achham",         province:"sudurpashchim", cx:78,  cy:138 },
  { id:"bajhang",       name:"Bajhang",        province:"sudurpashchim", cx:60,  cy:75  },
  { id:"bajura",        name:"Bajura",         province:"sudurpashchim", cx:88,  cy:82  },
  { id:"kanchanpur",    name:"Kanchanpur",     province:"sudurpashchim", cx:32,  cy:172 },
  { id:"kailali",       name:"Kailali",        province:"sudurpashchim", cx:72,  cy:172 },
  // KARNALI
  { id:"humla",         name:"Humla",          province:"karnali",       cx:118, cy:52  },
  { id:"mugu",          name:"Mugu",           province:"karnali",       cx:148, cy:62  },
  { id:"kalikot",       name:"Kalikot",        province:"karnali",       cx:135, cy:100 },
  { id:"jumla",         name:"Jumla",          province:"karnali",       cx:162, cy:82  },
  { id:"dolpa",         name:"Dolpa",          province:"karnali",       cx:192, cy:68  },
  { id:"dailekh",       name:"Dailekh",        province:"karnali",       cx:115, cy:130 },
  { id:"jajarkot",      name:"Jajarkot",       province:"karnali",       cx:148, cy:120 },
  { id:"rukum_west",    name:"Rukum West",     province:"karnali",       cx:180, cy:118 },
  { id:"salyan",        name:"Salyan",         province:"karnali",       cx:125, cy:155 },
  { id:"surkhet",       name:"Surkhet",        province:"karnali",       cx:105, cy:162 },
  // LUMBINI
  { id:"mustang_lum",   name:"Mustang",        province:"lumbini",       cx:242, cy:52  },
  { id:"myagdi",        name:"Myagdi",         province:"lumbini",       cx:228, cy:112 },
  { id:"baglung",       name:"Baglung",        province:"lumbini",       cx:218, cy:138 },
  { id:"parbat",        name:"Parbat",         province:"lumbini",       cx:240, cy:152 },
  { id:"gulmi",         name:"Gulmi",          province:"lumbini",       cx:222, cy:172 },
  { id:"palpa",         name:"Palpa",          province:"lumbini",       cx:248, cy:178 },
  { id:"arghakhanchi",  name:"Arghakhanchi",   province:"lumbini",       cx:210, cy:188 },
  { id:"kapilvastu",    name:"Kapilvastu",     province:"lumbini",       cx:205, cy:212 },
  { id:"rupandehi",     name:"Rupandehi",      province:"lumbini",       cx:232, cy:212 },
  { id:"nawalparasi_w", name:"Nawalparasi W",  province:"lumbini",       cx:258, cy:205 },
  { id:"pyuthan",       name:"Pyuthan",        province:"lumbini",       cx:185, cy:162 },
  { id:"rolpa",         name:"Rolpa",          province:"lumbini",       cx:178, cy:145 },
  { id:"rukum_east",    name:"Rukum East",     province:"lumbini",       cx:194, cy:130 },
  { id:"dang",          name:"Dang",           province:"lumbini",       cx:160, cy:175 },
  { id:"banke",         name:"Banke",          province:"lumbini",       cx:135, cy:188 },
  { id:"bardiya",       name:"Bardiya",        province:"lumbini",       cx:112, cy:188 },
  // GANDAKI
  { id:"manang",        name:"Manang",         province:"gandaki",       cx:292, cy:72  },
  { id:"mustang",       name:"Mustang",        province:"gandaki",       cx:278, cy:45  },
  { id:"kaski",         name:"Kaski",          province:"gandaki",       cx:278, cy:130 },
  { id:"lamjung",       name:"Lamjung",        province:"gandaki",       cx:298, cy:108 },
  { id:"gorkha",        name:"Gorkha",         province:"gandaki",       cx:318, cy:108 },
  { id:"tanahun",       name:"Tanahun",        province:"gandaki",       cx:292, cy:148 },
  { id:"syangja",       name:"Syangja",        province:"gandaki",       cx:264, cy:148 },
  { id:"nawalpur",      name:"Nawalpur",       province:"gandaki",       cx:290, cy:178 },
  { id:"nawalparasi_e", name:"Nawalparasi E",  province:"gandaki",       cx:314, cy:192 },
  // BAGMATI
  { id:"rasuwa",        name:"Rasuwa",         province:"bagmati",       cx:340, cy:72  },
  { id:"nuwakot",       name:"Nuwakot",        province:"bagmati",       cx:352, cy:98  },
  { id:"dhading",       name:"Dhading",        province:"bagmati",       cx:336, cy:118 },
  { id:"kathmandu",     name:"Kathmandu",      province:"bagmati",       cx:368, cy:118 },
  { id:"bhaktapur",     name:"Bhaktapur",      province:"bagmati",       cx:386, cy:122 },
  { id:"lalitpur",      name:"Lalitpur",       province:"bagmati",       cx:374, cy:134 },
  { id:"kavrepalanchok",name:"Kavrepalanchok", province:"bagmati",       cx:398, cy:118 },
  { id:"sindhupalchok", name:"Sindhupalchok",  province:"bagmati",       cx:392, cy:94  },
  { id:"dolakha",       name:"Dolakha",        province:"bagmati",       cx:422, cy:98  },
  { id:"ramechhap",     name:"Ramechhap",      province:"bagmati",       cx:420, cy:122 },
  { id:"sindhuli",      name:"Sindhuli",       province:"bagmati",       cx:412, cy:152 },
  { id:"makwanpur",     name:"Makwanpur",      province:"bagmati",       cx:360, cy:158 },
  { id:"chitwan",       name:"Chitwan",        province:"bagmati",       cx:340, cy:188 },
  // MADHESH
  { id:"sarlahi",       name:"Sarlahi",        province:"madhesh",       cx:390, cy:198 },
  { id:"rautahat",      name:"Rautahat",       province:"madhesh",       cx:362, cy:208 },
  { id:"bara",          name:"Bara",           province:"madhesh",       cx:340, cy:218 },
  { id:"parsa",         name:"Parsa",          province:"madhesh",       cx:318, cy:218 },
  { id:"dhanusha",      name:"Dhanusha",       province:"madhesh",       cx:428, cy:198 },
  { id:"mahottari",     name:"Mahottari",      province:"madhesh",       cx:412, cy:208 },
  { id:"siraha",        name:"Siraha",         province:"madhesh",       cx:460, cy:192 },
  { id:"saptari",       name:"Saptari",        province:"madhesh",       cx:490, cy:202 },
  // KOSHI
  { id:"solukhumbu",    name:"Solukhumbu",     province:"koshi",         cx:456, cy:98  },
  { id:"okhaldhunga",   name:"Okhaldhunga",    province:"koshi",         cx:464, cy:128 },
  { id:"khotang",       name:"Khotang",        province:"koshi",         cx:486, cy:138 },
  { id:"udayapur",      name:"Udayapur",       province:"koshi",         cx:502, cy:162 },
  { id:"bhojpur",       name:"Bhojpur",        province:"koshi",         cx:516, cy:118 },
  { id:"dhankuta",      name:"Dhankuta",       province:"koshi",         cx:534, cy:122 },
  { id:"terhathum",     name:"Terhathum",      province:"koshi",         cx:544, cy:105 },
  { id:"sankhuwasabha", name:"Sankhuwasabha",  province:"koshi",         cx:530, cy:78  },
  { id:"taplejung",     name:"Taplejung",      province:"koshi",         cx:558, cy:68  },
  { id:"panchthar",     name:"Panchthar",      province:"koshi",         cx:562, cy:102 },
  { id:"ilam",          name:"Ilam",           province:"koshi",         cx:562, cy:128 },
  { id:"jhapa",         name:"Jhapa",          province:"koshi",         cx:560, cy:162 },
  { id:"morang",        name:"Morang",         province:"koshi",         cx:538, cy:158 },
  { id:"sunsari",       name:"Sunsari",        province:"koshi",         cx:520, cy:172 },
];

// ─── Per-district hazard data ─────────────────────────────────────────────
const DISTRICT_DATA = {
  kathmandu:     { rainfall:42,  floodRisk:55, landslideRisk:62, affected:12000, casualties:0,  temp:"22°C", status:"Watch"    },
  kaski:         { rainfall:128, floodRisk:88, landslideRisk:74, affected:84000, casualties:3,  temp:"17°C", status:"Critical" },
  morang:        { rainfall:96,  floodRisk:82, landslideRisk:48, affected:52000, casualties:1,  temp:"29°C", status:"High"     },
  rupandehi:     { rainfall:74,  floodRisk:68, landslideRisk:91, affected:31000, casualties:5,  temp:"24°C", status:"Critical" },
  sunsari:       { rainfall:8,   floodRisk:22, landslideRisk:18, affected:9000,  casualties:0,  temp:"36°C", status:"Low"      },
  banke:         { rainfall:4,   floodRisk:35, landslideRisk:12, affected:28000, casualties:0,  temp:"38°C", status:"Medium"   },
  jumla:         { rainfall:0,   floodRisk:14, landslideRisk:44, affected:6400,  casualties:0,  temp:"-4°C", status:"High"     },
  dhanusha:      { rainfall:62,  floodRisk:76, landslideRisk:28, affected:47000, casualties:2,  temp:"27°C", status:"High"     },
  taplejung:     { rainfall:88,  floodRisk:72, landslideRisk:85, affected:18000, casualties:1,  temp:"18°C", status:"High"     },
  sindhupalchok: { rainfall:54,  floodRisk:62, landslideRisk:88, affected:22000, casualties:4,  temp:"20°C", status:"Critical" },
  dolakha:       { rainfall:48,  floodRisk:55, landslideRisk:82, affected:16000, casualties:2,  temp:"18°C", status:"High"     },
  chitwan:       { rainfall:66,  floodRisk:71, landslideRisk:38, affected:38000, casualties:0,  temp:"28°C", status:"High"     },
  sarlahi:       { rainfall:52,  floodRisk:74, landslideRisk:22, affected:36000, casualties:3,  temp:"26°C", status:"High"     },
  rautahat:      { rainfall:48,  floodRisk:70, landslideRisk:18, affected:32000, casualties:2,  temp:"27°C", status:"High"     },
  kailali:       { rainfall:22,  floodRisk:48, landslideRisk:25, affected:34000, casualties:0,  temp:"32°C", status:"Medium"   },
  bardiya:       { rainfall:44,  floodRisk:78, landslideRisk:32, affected:28000, casualties:0,  temp:"30°C", status:"High"     },
  rolpa:         { rainfall:58,  floodRisk:58, landslideRisk:79, affected:14000, casualties:1,  temp:"22°C", status:"High"     },
  myagdi:        { rainfall:72,  floodRisk:65, landslideRisk:82, affected:11000, casualties:2,  temp:"16°C", status:"High"     },
  gorkha:        { rainfall:62,  floodRisk:60, landslideRisk:75, affected:19000, casualties:1,  temp:"19°C", status:"High"     },
  makwanpur:     { rainfall:70,  floodRisk:72, landslideRisk:68, affected:27000, casualties:0,  temp:"24°C", status:"High"     },
};

function getDistrictData(id) {
  if (DISTRICT_DATA[id]) return DISTRICT_DATA[id];
  const s = id.charCodeAt(0) + id.charCodeAt(Math.floor(id.length / 2));
  return {
    rainfall:      Math.round(5 + (s % 90)),
    floodRisk:     Math.round(10 + (s % 70)),
    landslideRisk: Math.round(10 + ((s * 3) % 72)),
    affected:      Math.round((5 + s % 45) * 1000),
    casualties:    s % 9 === 0 ? s % 4 + 1 : 0,
    temp:          `${18 + (s % 18)}°C`,
    status:        ["Low","Medium","High","Critical"][s % 4],
  };
}

function riskColor(v) {
  if (v >= 75) return "#E24B4A";
  if (v >= 50) return "#EF9F27";
  if (v >= 30) return "#f0c040";
  return "#97C459";
}
function riskLabel(v) {
  if (v >= 75) return "Critical";
  if (v >= 50) return "High";
  if (v >= 30) return "Moderate";
  return "Low";
}

// ─── Nepal boundary (simplified outer hull) ───────────────────────────────
const NEPAL_BORDER = "M8,158 L10,140 L18,118 L22,100 L28,82 L35,68 L42,58 L52,48 L62,38 L72,30 L84,24 L96,20 L110,16 L126,14 L140,12 L158,10 L176,10 L194,10 L210,10 L226,10 L242,10 L258,10 L274,10 L290,10 L306,10 L322,10 L338,10 L354,10 L370,10 L386,10 L400,12 L414,14 L428,16 L442,18 L454,20 L464,24 L474,28 L482,32 L490,38 L498,44 L506,50 L514,56 L520,64 L524,72 L526,82 L526,92 L524,102 L520,112 L514,120 L506,128 L498,136 L490,144 L484,152 L480,160 L476,170 L472,178 L466,186 L458,194 L450,200 L440,206 L428,210 L416,214 L404,216 L390,218 L376,220 L362,222 L348,224 L334,226 L320,228 L306,228 L292,226 L278,224 L264,222 L250,220 L236,218 L222,216 L208,214 L194,212 L180,210 L166,208 L152,206 L138,202 L124,198 L110,194 L96,190 L84,186 L72,180 L62,174 L52,168 L42,162 L30,160 Z";

// ─── Gauge semicircle ─────────────────────────────────────────────────────
function SemiGauge({ value, color, label }) {
  const r = 38, cx = 50, cy = 48;
  const angle = (value / 100) * 180;
  const toRad = d => (d * Math.PI) / 180;
  const x2 = cx + r * Math.cos(toRad(180 - angle));
  const y2 = cy - r * Math.sin(toRad(angle > 0 ? 180 - angle : 0));
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <svg width="100" height="60" viewBox="0 0 100 60">
        {/* Track */}
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
          fill="none" stroke="#eef1f8" strokeWidth="9" strokeLinecap="round"/>
        {/* Value arc */}
        {value > 0 && (
          <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2}`}
            fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"/>
        )}
        {/* Centre text */}
        <text x={cx} y={cy+1} textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>{value}</text>
        {/* Scale ticks */}
        {[0,25,50,75,100].map(v=>{
          const a=toRad(180-(v/100)*180);
          return <line key={v} x1={cx+(r-5)*Math.cos(a)} y1={cy-(r-5)*Math.sin(a*(Math.PI/180)<Math.PI?1:0)*0-(r-5)*Math.sin(toRad((v/100)*180))} x2={cx+(r+2)*Math.cos(a)} y2={cy-(r+2)*Math.sin(toRad((v/100)*180))} stroke="#ddd" strokeWidth="1"/>;
        })}
      </svg>
      <div style={{ fontSize:10, fontWeight:700, color, textTransform:"uppercase", letterSpacing:"0.06em", marginTop:-6 }}>
        {riskLabel(value)}
      </div>
      <div style={{ fontSize:9, color:"#9aa0b4", marginTop:1 }}>{label}</div>
    </div>
  );
}

function Bar({ value, max, color, label, unit="" }) {
  const pct = Math.min(100, Math.round((value/max)*100));
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:11, color:"#5a6080", fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:12, fontWeight:800, color }}>{value}{unit}</span>
      </div>
      <div style={{ height:7, borderRadius:4, background:"#eef1f8", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${color}88,${color})`, borderRadius:4, transition:"width 0.9s ease" }}/>
      </div>
    </div>
  );
}

// ─── Four analysis panels ─────────────────────────────────────────────────
function DistrictPanels({ districtId, districtName, provinceName, riskMode, setRiskMode, onClose }) {
  const d = getDistrictData(districtId);
  const activeRisk = riskMode === "flood" ? d.floodRisk : d.landslideRisk;
  const rainfallStatus = d.rainfall > 80 ? { label:"Heavy", color:"#E24B4A", bg:"#FCEBEB" }
    : d.rainfall > 40 ? { label:"Moderate", color:"#BA7517", bg:"#FAEEDA" }
    : { label:"Normal", color:"#3B6D11", bg:"#EAF3DE" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10, animation:"slideUp 0.35s ease" }}>
      {/* Panel header bar */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"9px 15px", background:"#fff",
        border:"1px solid #e3e8f0", borderRadius:10,
        boxShadow:"0 1px 4px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:riskColor(activeRisk) }}/>
          <div>
            <span style={{ fontSize:14, fontWeight:800, color:"#1a1a2e" }}>{districtName}</span>
            <span style={{ fontSize:11, color:"#9aa0b4", marginLeft:8 }}>· {provinceName} Province · District Analysis</span>
          </div>
          <div style={{ marginLeft:8, background:riskColor(activeRisk)+"18", color:riskColor(activeRisk), fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>
            {d.status}
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {/* Risk mode toggle */}
          <div style={{ display:"flex", background:"#f0f3fa", borderRadius:8, padding:3, gap:2 }}>
            {[["flood","🌊 Flood Risk","#378ADD"],["landslide","⛰ Landslide Risk","#EF9F27"]].map(([m,l,c])=>(
              <button key={m} onClick={()=>setRiskMode(m)} style={{
                fontSize:10, fontWeight:700, padding:"5px 12px", borderRadius:6,
                border:"none", cursor:"pointer", fontFamily:"inherit",
                background:riskMode===m?c:"transparent",
                color:riskMode===m?"#fff":"#7a8099",
                transition:"all 0.15s",
              }}>{l}</button>
            ))}
          </div>
          <button onClick={onClose} style={{
            background:"#f5f5f5", border:"1px solid #e0e0e0",
            color:"#666", fontSize:11, fontWeight:700,
            padding:"5px 12px", borderRadius:7, cursor:"pointer", fontFamily:"inherit",
          }}>✕ Deselect</button>
        </div>
      </div>

      {/* 4 panels */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>

        {/* 1 — Rainfall */}
        <div style={{ background:"#fff", border:"1px solid #e3e8f0", borderRadius:13, padding:"15px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"#E8F4FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🌧</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#1a1a2e" }}>Rainfall</div>
          </div>
          <div style={{ fontSize:32, fontWeight:900, color:"#378ADD", letterSpacing:"-1.5px", lineHeight:1 }}>
            {d.rainfall}<span style={{ fontSize:15, fontWeight:600, color:"#9aa0b4" }}> mm</span>
          </div>
          <div style={{ fontSize:10, color:"#9aa0b4", marginBottom:12, marginTop:2 }}>24-hour accumulation</div>
          <Bar value={d.rainfall} max={160} color={d.rainfall>80?"#E24B4A":d.rainfall>40?"#EF9F27":"#378ADD"} label="Intensity" unit=" mm"/>
          <div style={{ marginTop:10, padding:"7px 9px", borderRadius:8, background:rainfallStatus.bg }}>
            <div style={{ fontSize:10, fontWeight:700, color:rainfallStatus.color }}>
              {d.rainfall>80?"⚠ Heavy — Flood risk elevated":d.rainfall>40?"⚡ Moderate — Monitor levels":"✓ Normal range"}
            </div>
            <div style={{ fontSize:10, color:rainfallStatus.color, opacity:0.75, marginTop:1 }}>Status: {rainfallStatus.label}</div>
          </div>
        </div>

        {/* 2 — Areas Affected */}
        <div style={{ background:"#fff", border:"1px solid #e3e8f0", borderRadius:13, padding:"15px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"#FFF3E0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>👥</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#1a1a2e" }}>Areas Affected</div>
          </div>
          <div style={{ fontSize:32, fontWeight:900, color:"#BA7517", letterSpacing:"-1.5px", lineHeight:1 }}>
            {d.affected>999?`${(d.affected/1000).toFixed(1)}k`:d.affected}
            <span style={{ fontSize:13, fontWeight:600, color:"#9aa0b4" }}> people</span>
          </div>
          <div style={{ fontSize:10, color:"#9aa0b4", marginBottom:12, marginTop:2 }}>Estimated at-risk population</div>
          <Bar value={Math.min(100,Math.round(d.affected/1000))} max={100} color="#EF9F27" label="Coverage %" unit="%"/>
          <div style={{ marginTop:10 }}>
            {d.casualties>0?(
              <div style={{ padding:"7px 9px", borderRadius:8, background:"#FCEBEB" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#E24B4A" }}>🚑 {d.casualties} casualties confirmed</div>
                <div style={{ fontSize:10, color:"#E24B4A", opacity:0.75, marginTop:1 }}>Emergency response active</div>
              </div>
            ):(
              <div style={{ padding:"7px 9px", borderRadius:8, background:"#EAF3DE" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#3B6D11" }}>✓ No casualties reported</div>
                <div style={{ fontSize:10, color:"#3B6D11", opacity:0.75, marginTop:1 }}>Monitoring in progress</div>
              </div>
            )}
          </div>
        </div>

        {/* 3 — Active risk gauge */}
        <div style={{ background:"#fff", border:`2px solid ${riskColor(activeRisk)}28`, borderRadius:13, padding:"15px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:riskColor(activeRisk)+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>
              {riskMode==="flood"?"🌊":"⛰"}
            </div>
            <div style={{ fontSize:12, fontWeight:700, color:"#1a1a2e" }}>
              {riskMode==="flood"?"Flood Risk Index":"Landslide Risk Index"}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", paddingTop:4 }}>
            <SemiGauge value={activeRisk} color={riskColor(activeRisk)} label={riskMode==="flood"?"Flood Index":"Landslide Index"}/>
          </div>
          <div style={{ marginTop:8, display:"flex", gap:4, justifyContent:"center", flexWrap:"wrap" }}>
            {[["Low","#97C459"],["Moderate","#f0c040"],["High","#EF9F27"],["Critical","#E24B4A"]].map(([l,c])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", gap:3 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:c }}/>
                <span style={{ fontSize:9, color:"#9aa0b4" }}>{l}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:8, padding:"5px 8px", borderRadius:7, background:riskColor(activeRisk)+"12", textAlign:"center" }}>
            <span style={{ fontSize:10, fontWeight:700, color:riskColor(activeRisk) }}>
              {riskLabel(activeRisk)} — {riskMode==="flood"?"Flood":"Landslide"} Risk
            </span>
          </div>
        </div>

        {/* 4 — Comparison + details */}
        <div style={{ background:"#fff", border:"1px solid #e3e8f0", borderRadius:13, padding:"15px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"#F0F4FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>📊</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#1a1a2e" }}>Risk Comparison</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:12 }}>
            <Bar value={d.floodRisk}     max={100} color="#378ADD" label="🌊 Flood Risk"     unit="%"/>
            <Bar value={d.landslideRisk} max={100} color="#EF9F27" label="⛰ Landslide Risk" unit="%"/>
            <Bar value={d.rainfall}      max={160} color="#1D9E75" label="🌧 Rainfall"       unit=" mm"/>
          </div>
          <div style={{ height:1, background:"#eef0f5", marginBottom:8 }}/>
          <div style={{ fontSize:11, color:"#5a6080" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span>Temperature</span>
              <strong style={{ color:"#1a1a2e" }}>{d.temp}</strong>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span>Primary Risk</span>
              <strong style={{ color:d.floodRisk>d.landslideRisk?"#378ADD":"#EF9F27" }}>
                {d.floodRisk>d.landslideRisk?"Flood":"Landslide"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SVG Nepal map ─────────────────────────────────────────────────────────
function NepalSVG({ districts, selectedDistrict, hoveredDistrict, onHover, onSelect, riskMode }) {
  const viewBox = "0 0 590 240";

  return (
    <svg viewBox={viewBox} style={{ width:"100%", height:"100%", display:"block" }}>
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.18)"/>
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Sky / background */}
      <rect x="0" y="0" width="590" height="240" fill="#f8fafc"/>

      {/* Draw each district as a Voronoi-ish polygon approximated by circle */}
      {districts.map(d => {
        const prov     = PROVINCE_COLORS[d.province];
        const isHover  = hoveredDistrict === d.id;
        const isSel    = selectedDistrict === d.id;
        const data     = getDistrictData(d.id);
        const risk     = riskMode==="flood" ? data.floodRisk : data.landslideRisk;
        const rCol     = riskColor(risk);

        // base fill: province colour, dimmed if something else selected
        let fill = prov.fill;
        if (selectedDistrict && !isSel) fill = prov.fill + "88";
        if (isSel) fill = rCol;

        // radius sized by neighbours (proxy: use fixed but vary slightly)
        const baseR = 14;
        const r = isSel ? baseR + 3 : isHover ? baseR + 2 : baseR;

        return (
          <g key={d.id}
            style={{ cursor:"pointer" }}
            onMouseEnter={() => onHover(d.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(d.id)}
          >
            <circle
              cx={d.cx} cy={d.cy} r={r}
              fill={fill}
              stroke={isSel ? rCol : prov.stroke}
              strokeWidth={isSel ? 2.5 : isHover ? 1.8 : 1.2}
              filter={isSel ? "url(#glow)" : undefined}
              style={{ transition:"all 0.15s" }}
            />
            {/* District label — only if not too crowded */}
            {(isSel || isHover || r > 13) && (
              <text
                x={d.cx} y={d.cy + (r > 14 ? r + 8 : r + 7)}
                textAnchor="middle"
                fontSize={isSel ? 8 : 7}
                fontWeight={isSel ? "800" : "600"}
                fill={isSel ? rCol : "#334"}
                style={{ pointerEvents:"none", userSelect:"none" }}
              >{d.name}</text>
            )}
            {/* Risk overlay dot */}
            {isSel && (
              <circle cx={d.cx} cy={d.cy} r={r+6}
                fill="none" stroke={rCol} strokeWidth="1.5"
                strokeDasharray="4 3" opacity="0.7"
              />
            )}
          </g>
        );
      })}

      {/* Province name labels */}
      {Object.entries(PROVINCE_COLORS).map(([pid, pc]) => {
        const pDists = districts.filter(d => d.province === pid);
        if (!pDists.length) return null;
        const avgX = pDists.reduce((s,d)=>s+d.cx,0)/pDists.length;
        const minY = Math.min(...pDists.map(d=>d.cy)) - 18;
        return (
          <text key={pid} x={avgX} y={Math.max(12, minY)}
            textAnchor="middle" fontSize="9" fontWeight="800"
            fill={pc.stroke} opacity="0.7"
            style={{ pointerEvents:"none", userSelect:"none" }}
          >{pc.name.toUpperCase()}</text>
        );
      })}

      {/* Compass rose */}
      <g transform="translate(564,18)">
        <circle cx="0" cy="0" r="13" fill="white" stroke="#ddd" strokeWidth="0.8"/>
        <text x="0"  y="-5" textAnchor="middle" fontSize="7" fontWeight="800" fill="#333">N</text>
        <polygon points="0,-11 3,-4 -3,-4" fill="#E24B4A"/>
        <polygon points="0,11 3,4 -3,4"   fill="#888"/>
        <text x="0"  y="14" textAnchor="middle" fontSize="5.5" fill="#888">S</text>
        <text x="-11" y="2.5" textAnchor="middle" fontSize="5.5" fill="#888">W</text>
        <text x="11"  y="2.5" textAnchor="middle" fontSize="5.5" fill="#888">E</text>
      </g>

      {/* NEPAL title */}
      <text x="295" y="16" textAnchor="middle" fontSize="16" fontWeight="900"
        fill="#C0392B" letterSpacing="3" style={{ userSelect:"none" }}>NEPAL</text>
    </svg>
  );
}

// ─── Province legend ──────────────────────────────────────────────────────
function ProvinceLegend({ selectedProvince, setSelectedProvince, selectedDistrict }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      <button onClick={()=>setSelectedProvince(null)} style={{
        fontSize:10, padding:"3px 10px", borderRadius:6, border:"none",
        cursor:"pointer", fontFamily:"inherit", fontWeight:700,
        background:!selectedProvince?"#1a3a6b":"#f0f3fa",
        color:!selectedProvince?"#fff":"#5a6080",
      }}>All</button>
      {Object.entries(PROVINCE_COLORS).map(([pid,pc])=>(
        <button key={pid} onClick={()=>setSelectedProvince(p=>p===pid?null:pid)} style={{
          fontSize:10, padding:"3px 10px", borderRadius:6, border:"none",
          cursor:"pointer", fontFamily:"inherit", fontWeight:700,
          background:selectedProvince===pid?pc.fill:"#f0f3fa",
          color:selectedProvince===pid?"#fff":"#5a6080",
          outline:selectedProvince===pid?`2px solid ${pc.stroke}`:"none",
          transition:"all 0.15s",
        }}>{pc.name}</button>
      ))}
    </div>
  );
}

// ─── Exported component ───────────────────────────────────────────────────
export default function NepalMap({ hazards, selectedId, onSelect }) {
  const [hoveredDistrict,  setHoveredDistrict]  = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [riskMode,         setRiskMode]         = useState("flood");
  const [fullscreen,       setFullscreen]       = useState(false);

  const visibleDistricts = selectedProvince
    ? DISTRICTS.filter(d => d.province === selectedProvince)
    : DISTRICTS;

  const selectedDistrictObj = DISTRICTS.find(d => d.id === selectedDistrict);
  const selectedProvinceInfo = selectedDistrictObj
    ? PROVINCE_COLORS[selectedDistrictObj.province]
    : null;

  const handleSelect = (id) => {
    setSelectedDistrict(d => d === id ? null : id);
  };

  const MapContent = ({ height = 300 }) => (
    <div style={{ height, transition:"height 0.4s ease", minHeight:0, position:"relative", background:"#f8fafc", borderRadius:8, overflow:"hidden", border:"1px solid #e3e8f0" }}>
      <NepalSVG
        districts={visibleDistricts}
        selectedDistrict={selectedDistrict}
        hoveredDistrict={hoveredDistrict}
        onHover={setHoveredDistrict}
        onSelect={handleSelect}
        riskMode={riskMode}
      />
      {/* Hover tooltip */}
      {hoveredDistrict && (() => {
        const d = DISTRICTS.find(x=>x.id===hoveredDistrict);
        const dat = getDistrictData(hoveredDistrict);
        const pc = PROVINCE_COLORS[d?.province];
        return (
          <div style={{
            position:"absolute", top:10, right:10, zIndex:10,
            background:"rgba(255,255,255,0.97)", border:"1px solid #e0e8f5",
            borderRadius:10, padding:"10px 13px",
            boxShadow:"0 4px 16px rgba(0,0,0,0.12)", minWidth:160,
          }}>
            <div style={{ fontSize:13, fontWeight:800, color:"#1a1a2e", marginBottom:3 }}>{d?.name}</div>
            <div style={{ fontSize:10, color:pc?.fill, fontWeight:700, marginBottom:6 }}>{pc?.name} Province</div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              {[["🌧 Rainfall",`${dat.rainfall} mm`],["🌊 Flood Risk",`${dat.floodRisk}%`],["⛰ Landslide",`${dat.landslideRisk}%`],["👥 Affected",dat.affected.toLocaleString()]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", gap:12, fontSize:11 }}>
                  <span style={{ color:"#7a8099" }}>{k}</span>
                  <span style={{ fontWeight:700, color:"#1a1a2e" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:6, fontSize:10, color:"#9aa0b4", textAlign:"center" }}>Click to analyse</div>
          </div>
        );
      })()}
    </div>
  );

  return (
    <>
      <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:0 }}>

        {/*Toolbar*/}
        <div style={{ padding:"9px 14px", borderBottom:"1px solid #eef0f5", flexShrink:0, display:"flex", flexDirection:"column", gap:7 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:14 }}>🗺</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#1a1a2e" }}>Nepal — District Map</span>
              {selectedDistrict && selectedDistrictObj && (
                <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#9aa0b4" }}>
                  <span>›</span>
                  <span style={{ color:PROVINCE_COLORS[selectedDistrictObj.province]?.fill, fontWeight:700 }}>
                    {PROVINCE_COLORS[selectedDistrictObj.province]?.name}
                  </span>
                  <span>›</span>
                  <span style={{ color:"#1a1a2e", fontWeight:700 }}>{selectedDistrictObj.name}</span>
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              {selectedDistrict && (
                <button onClick={()=>setSelectedDistrict(null)} style={{ fontSize:10, padding:"3px 9px", borderRadius:6, border:"1px solid #e0e6f0", background:"#f8f9fc", color:"#5a6080", cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>
                  ← Back to full map
                </button>
              )}
              <button onClick={()=>setFullscreen(true)} style={{ fontSize:10, fontWeight:700, padding:"4px 11px", borderRadius:7, border:"1px solid #d0ddf5", background:"#f0f5ff", color:"#185FA5", cursor:"pointer", fontFamily:"inherit" }}>
                ⛶ Full Map
              </button>
            </div>
          </div>
          {/* Province filter + legend */}
          <ProvinceLegend selectedProvince={selectedProvince} setSelectedProvince={setSelectedProvince} selectedDistrict={selectedDistrict}/>
          <div style={{ fontSize:9, color:"#b0b8c8" }}>
            {selectedProvince
              ? `Showing ${visibleDistricts.length} districts of ${PROVINCE_COLORS[selectedProvince]?.name} — hover to preview · click to analyse`
              : "Hover district to preview · Click to open analysis panels · Filter by province above"}
          </div>
        </div>

        {/*Map (shrinks when district selected) */}
        <div style={{ padding:"10px 12px 0", flexShrink:0 }}>
          <MapContent height={selectedDistrict ? 200 : 310}/>
        </div>

        {/* Analysis panels (slide in when district selected) */}
        {selectedDistrict && selectedDistrictObj && (
          <div style={{ padding:"10px 12px 12px", overflowY:"auto", flex:1 }}>
            <DistrictPanels
              districtId={selectedDistrict}
              districtName={selectedDistrictObj.name}
              provinceName={selectedProvinceInfo?.name || ""}
              riskMode={riskMode}
              setRiskMode={setRiskMode}
              onClose={()=>setSelectedDistrict(null)}
            />
          </div>
        )}

        {/*  Footer  */}
        {!selectedDistrict && (
          <div style={{ padding:"5px 14px", borderTop:"1px solid #eef0f5", flexShrink:0, marginTop:"auto" }}>
            <span style={{ fontSize:10, color:"#9aa0b4" }}>77 districts · 7 provinces · Hover for preview · Click for full analysis</span>
          </div>
        )}
      </div>

      {/*  Fullscreen overlay  */}
      {fullscreen && (
        <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", flexDirection:"column", background:"#0a1428" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 20px", background:"#0f2a5e", borderBottom:"1px solid #1a3a6b", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:16 }}>🗺</span>
              <span style={{ fontSize:13, fontWeight:800, color:"#fff" }}>Nepal — All 77 Districts</span>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <ProvinceLegend selectedProvince={selectedProvince} setSelectedProvince={setSelectedProvince}/>
            </div>
            <button onClick={()=>setFullscreen(false)} style={{ background:"rgba(255,255,255,0.12)", border:"none", color:"#fff", fontSize:12, fontWeight:700, padding:"6px 16px", borderRadius:8, cursor:"pointer" }}>✕ Close</button>
          </div>
          <div style={{ flex:1, padding:16, display:"flex", flexDirection:"column", gap:12, minHeight:0, overflowY:"auto" }}>
            <div style={{ flex:"0 0 auto", height:420, background:"#f8fafc", borderRadius:12, overflow:"hidden" }}>
              <NepalSVG
                districts={visibleDistricts}
                selectedDistrict={selectedDistrict}
                hoveredDistrict={hoveredDistrict}
                onHover={setHoveredDistrict}
                onSelect={handleSelect}
                riskMode={riskMode}
              />
            </div>
            {selectedDistrict && selectedDistrictObj && (
              <DistrictPanels
                districtId={selectedDistrict}
                districtName={selectedDistrictObj.name}
                provinceName={selectedProvinceInfo?.name||""}
                riskMode={riskMode}
                setRiskMode={setRiskMode}
                onClose={()=>setSelectedDistrict(null)}
              />
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </>
  );
}