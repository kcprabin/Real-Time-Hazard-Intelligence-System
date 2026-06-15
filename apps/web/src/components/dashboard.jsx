import { useState, useEffect, useRef } from "react";

const colors = {
  red:"#E24B4A",
  redL:"#FCEBEB",
  redM:"#F09595",

  amber:"#BA7517",
  amberL:"#FAEEDA",
  amberM:"#EF9F27",

  green:"#3B6D11",
  greenL:"#EAF3DE",
  greenM:"#97C459",

  blue:"#185FA5",
  blueL:"#E6F1FB",
  blueM:"#378ADD",

  teal:"#0F6E56",
  tealL:"#E1F5EE",
  tealM:"#1D9E75",

  gray:"#5F5E5A",
  grayL:"#F1EFE8",
  grayM:"#B4B2A9",

  navy:"#0f2a5e",
};
const NEPAL_PATH = "M 18,72 L 28,62 L 36,55 L 48,50 L 58,48 L 70,46 L 80,44 L 90,42 L 100,40 L 112,38 L 124,36 L 136,35 L 148,34 L 160,33 L 172,32 L 184,31 L 196,30 L 208,30 L 220,30 L 232,30 L 244,30 L 256,31 L 268,31 L 280,31 L 292,31 L 304,31 L 316,32 L 328,32 L 340,33 L 352,34 L 364,35 L 376,36 L 388,38 L 398,40 L 408,44 L 416,50 L 422,58 L 428,66 L 432,76 L 432,88 L 428,100 L 420,110 L 408,118 L 396,124 L 380,130 L 364,134 L 348,138 L 332,142 L 316,148 L 300,158 L 284,164 L 268,168 L 252,170 L 236,172 L 220,172 L 204,170 L 188,168 L 172,166 L 156,162 L 140,158 L 124,154 L 108,150 L 94,148 L 80,148 L 66,148 L 52,146 L 38,140 L 26,130 L 18,118 L 14,106 L 14,94 L 16,82 Z";

const HAZARDS = [
  {id:1,name:"Kathmandu",lat:27.70,lng:85.32,type:"Earthquake",sev:"High",   wx:"⛅",temp:"22°C",wind:"12 km/h NE",humidity:"68%",rain:"4mm",desc:"M4.2 tremor detected",province:"Bagmati",casualties:0,affected:1200},
  {id:2,name:"Pokhara",  lat:28.21,lng:83.99,type:"Flood",     sev:"Critical",wx:"🌧",temp:"17°C",wind:"8 km/h W", humidity:"85%",rain:"42mm",desc:"Seti river level critical",province:"Gandaki",casualties:3,affected:8400},
  {id:3,name:"Biratnagar",lat:26.46,lng:87.27,type:"Flood",    sev:"High",   wx:"⛈",temp:"29°C",wind:"20 km/h S", humidity:"91%",rain:"38mm",desc:"Monsoon flooding ongoing",province:"Koshi",casualties:1,affected:5200},
  {id:4,name:"Butwal",   lat:27.70,lng:83.45,type:"Landslide", sev:"Critical",wx:"🌧",temp:"24°C",wind:"15 km/h SW",humidity:"88%",rain:"28mm",desc:"Highway blocked, 3 sites",province:"Lumbini",casualties:5,affected:3100},
  {id:5,name:"Dharan",   lat:26.81,lng:87.28,type:"Heatwave",  sev:"Medium", wx:"☀",temp:"36°C",wind:"5 km/h E",  humidity:"52%",rain:"0mm",desc:"Heat index 42°C",province:"Koshi",casualties:0,affected:900},
  {id:6,name:"Nepalgunj",lat:28.05,lng:81.62,type:"Drought",   sev:"Medium", wx:"☀",temp:"38°C",wind:"7 km/h NW", humidity:"31%",rain:"0mm",desc:"Rainfall 40% below avg",province:"Lumbini",casualties:0,affected:2800},
  {id:7,name:"Jumla",    lat:29.27,lng:82.18,type:"Blizzard",  sev:"High",   wx:"❄",temp:"-4°C",wind:"35 km/h N", humidity:"72%",rain:"0mm",desc:"Heavy snowfall, roads cut",province:"Karnali",casualties:0,affected:640},
  {id:8,name:"Janakpur", lat:26.71,lng:85.93,type:"Flood",     sev:"High",   wx:"🌧",temp:"27°C",wind:"10 km/h SE",humidity:"87%",rain:"31mm",desc:"Bagmati tributaries rising",province:"Madhesh",casualties:2,affected:4700},
];

const INIT_ACTIVITY = [
  {time:"14:32:05",event:"Seti river gauge exceeded danger mark — Pokhara",type:"critical"},
  {time:"14:31:50",event:"Landslide blocks Prithvi Highway near Butwal",type:"critical"},
  {time:"14:30:22",event:"Emergency teams deployed to Biratnagar district",type:"high"},
  {time:"14:29:10",event:"Flood warning issued: Bagmati tributaries rising",type:"high"},
  {time:"14:28:45",event:"Seismic alert M4.2 — Kathmandu Valley recorded",type:"medium"},
  {time:"14:27:30",event:"Heat advisory: Terai region temp above 38°C",type:"medium"},
  {time:"14:26:18",event:"Snowfall alert: Jumla roads cut off",type:"high"},
  {time:"14:25:02",event:"Rainfall deficit warning — Karnali zone",type:"medium"},
  {time:"14:24:10",event:"NDRRMA coordinators mobilised in 3 provinces",type:"low"},
  {time:"14:23:45",event:"Weather station network — 28 nodes online",type:"low"},
];

const AI_RESP = {
  default:(q)=>`Analysing: "${q}"\n\nBased on current RHIS data, highest-priority zones are Pokhara (Critical Flood) and Butwal (Critical Landslide). Risk elevated in 4 of 7 provinces. Recommend reviewing Gandaki and Lumbini province overlays immediately.`,
  flood:`Flood Status — Nepal\n\n• Pokhara (Seti River) — Critical, rising 8cm/hr\n• Biratnagar (Koshi Basin) — High, 82% capacity\n• Janakpur (Bagmati) — High, 76% capacity\n\nMonsoon forecast: Heavy rainfall next 48hrs. Pre-position emergency teams in Madhesh and Koshi provinces.`,
  earthquake:`Seismic Activity — Last 24hrs\n\n• M4.2 — Kathmandu Valley, 14:28 UTC\n• M3.1 — Dolakha District, 11:14 UTC\n• M2.8 — Sindhupalchok, 09:02 UTC\n\nAll below destructive threshold. No structural damage reported. Aftershock probability: 12% within 6 hrs.`,
  weather:`Weather Overview — Nepal\n\n• Terai (S): 36–38°C, Thunderstorms likely\n• Hills (Mid): 18–24°C, Rain possible\n• Mountain (N): -4 to 6°C, Heavy snowfall\n\nMonsoon active. Cumulative rainfall 22% above seasonal avg in eastern Nepal.`,
  help:`Available Commands:\n• "flood" — Flood situation\n• "earthquake" — Seismic summary\n• "weather" — Province weather\n• "status" — System status\n• "help" — This menu\n\nClick any map marker for district detail.`,
  status:`System Status — RHIS v4.2\n\n✓ Nepal Map: Online\n✓ Weather API: 28/28 stations active\n✓ Seismic Network: 14 sensors nominal\n✓ Flood Gauges: 31/34 online\n✓ Satellite: 6hr refresh\n✓ Alert Dispatch: Operational`,
};

const SEV = {
  Critical:{bg:"#FCEBEB",text:"#E24B4A",dot:"#E24B4A"},
  High:    {bg:"#FAEEDA",text:"#BA7517",dot:"#EF9F27"},
  Medium:  {bg:"#E6F1FB",text:"#185FA5",dot:"#378ADD"},
  Low:     {bg:"#EAF3DE",text:"#3B6D11",dot:"#97C459"},
};

const TYPE_ICON = {Earthquake:"🌋",Flood:"🌊",Landslide:"⛰",Heatwave:"🌡",Drought:"🏜",Blizzard:"❄",Wildfire:"🔥",Tsunami:"🌊"};

function nepalCoord(lat,lng){
  return {cx:Math.round(((lng-80.0)/(88.2-80.0))*420+20),cy:Math.round(((29.5-lat)/(29.5-26.3))*160+20)};
}


//  SHARED COMPONENTS
function Badge({label,bg,color,size=10}){
  return <span style={{fontSize:size,fontWeight:700,background:bg,color,padding:"2px 7px",borderRadius:4,textTransform:"uppercase",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{label}</span>;
}

function Card({children,style={}}){
  return <div style={{background:"#fff",border:"1px solid #e3e8f0",borderRadius:14,overflow:"hidden",...style}}>{children}</div>;
}

function CardHeader({title,right,icon}){
  return(
    <div style={{padding:"11px 16px",borderBottom:"1px solid #eef0f5",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        {icon&&<span style={{fontSize:14}}>{icon}</span>}
        <span style={{fontSize:12,fontWeight:700,color:"#1a1a2e"}}>{title}</span>
      </div>
      {right&&<div style={{display:"flex",alignItems:"center",gap:6}}>{right}</div>}
    </div>
  );
}

function StatTile({label,value,delta,deltaUp,icon,color=P.blue,bg="#f0f5ff"}){
  return(
    <div style={{background:"#fff",border:"1px solid #e3e8f0",borderRadius:12,padding:"14px 16px",display:"flex",flexDirection:"column",gap:4}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{fontSize:19,lineHeight:1}}>{icon}</div>
        {delta&&<span style={{fontSize:10,fontWeight:700,color:deltaUp?P.green:P.red,background:deltaUp?P.greenL:P.redL,padding:"1px 6px",borderRadius:4}}>{delta}</span>}
      </div>
      <div style={{fontSize:22,fontWeight:800,color:"#1a1a2e",letterSpacing:"-0.5px",marginTop:4}}>{typeof value==="number"&&value>999?value.toLocaleString():value}</div>
      <div style={{fontSize:10,color:"#7a8099",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</div>
    </div>
  );
}

function ActivityDot({type}){
  const c={critical:P.red,high:P.amberM,medium:P.blueM,low:P.greenM};
  return <div style={{width:7,height:7,borderRadius:"50%",flexShrink:0,marginTop:6,background:c[type]||P.gray}}/>;
}

function SeverityBar({label,count,total,color}){
  return(
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:11,color:"#5a6080",fontWeight:600}}>{label}</span>
        <span style={{fontSize:11,color,fontWeight:700}}>{count}</span>
      </div>
      <div style={{height:5,borderRadius:3,background:"#eef1f8"}}>
        <div style={{height:"100%",width:`${Math.round((count/total)*100)}%`,background:color,borderRadius:3,transition:"width 0.8s ease"}}/>
      </div>
    </div>
  );
}

function NepalMapSVG({hazards,selectedId,onSelect,showWeather}){
  return(
    <svg viewBox="0 0 460 200" style={{width:"100%",height:"100%"}}>
      <defs>
        <linearGradient id="nbg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ddeeff"/><stop offset="100%" stopColor="#c8d8f0"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="460" height="200" fill="#e8f0f8"/>
      <rect x="0" y="0" width="460" height="52" fill="#ddeeff" opacity="0.8"/>
      <rect x="0" y="52" width="460" height="85" fill="#d6ebd0" opacity="0.6"/>
      <rect x="0" y="137" width="460" height="63" fill="#d4e8c0" opacity="0.55"/>
      <path d={NEPAL_PATH} fill="#c2d8a8" stroke="#7aaa6a" strokeWidth="1.2"/>
      {[130,218,252,340].map(x=><line key={x} x1={x} y1="34" x2={x} y2="172" stroke="#9ab88a" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.5"/>)}
      <path d="M 85,50 Q 88,85 86,120 Q 84,148 80,168" fill="none" stroke="#5b9dd9" strokeWidth="1.1" opacity="0.5"/>
      <path d="M 160,44 Q 163,80 165,115 Q 167,148 168,170" fill="none" stroke="#5b9dd9" strokeWidth="1.1" opacity="0.5"/>
      <path d="M 250,40 Q 248,78 246,114 Q 244,148 242,170" fill="none" stroke="#5b9dd9" strokeWidth="1.3" opacity="0.55"/>
      <path d="M 348,42 Q 350,80 352,118 Q 354,150 356,170" fill="none" stroke="#5b9dd9" strokeWidth="1.1" opacity="0.5"/>
      {[55,90,130,170,215,255,290,330,370,410].map((x,i)=><ellipse key={i} cx={x} cy={24} rx={17} ry={8} fill="white" opacity="0.72"/>)}
      <text x="85" y="20" fontSize="7" fill="#4a6fa5" textAnchor="middle" fontWeight="600">Annapurna</text>
      <text x="173" y="18" fontSize="7" fill="#4a6fa5" textAnchor="middle" fontWeight="600">Manaslu</text>
      <text x="250" y="15" fontSize="7.5" fill="#2a4f8a" textAnchor="middle" fontWeight="700">Everest 8849m</text>
      <text x="338" y="18" fontSize="7" fill="#4a6fa5" textAnchor="middle" fontWeight="600">Kanchenjunga</text>
      <text x="58"  y="108" fontSize="8" fill="#4a7a42" textAnchor="middle" opacity="0.55">Sudurpashchim</text>
      <text x="100" y="118" fontSize="8" fill="#4a7a42" textAnchor="middle" opacity="0.55">Karnali</text>
      <text x="165" y="118" fontSize="8" fill="#4a7a42" textAnchor="middle" opacity="0.55">Lumbini</text>
      <text x="255" y="112" fontSize="8" fill="#4a7a42" textAnchor="middle" opacity="0.55">Gandaki</text>
      <text x="298" y="100" fontSize="8" fill="#4a7a42" textAnchor="middle" opacity="0.55">Bagmati</text>
      <text x="358" y="100" fontSize="8" fill="#4a7a42" textAnchor="middle" opacity="0.55">Madhesh</text>
      <text x="404" y="88" fontSize="8" fill="#4a7a42" textAnchor="middle" opacity="0.55">Koshi</text>
      {[100,200,300,400].map(x=><line key={x} x1={x} y1="0" x2={x} y2="200" stroke="#b8cca8" strokeWidth="0.25"/>)}
      {[60,120,160].map(y=><line key={y} x1="0" y1={y} x2="460" y2={y} stroke="#b8cca8" strokeWidth="0.25"/>)}
      {hazards.map(h=>{
        const{cx,cy}=nepalCoord(h.lat,h.lng);
        const col=SEV[h.sev]?.dot||P.gray;
        const active=selectedId===h.id;
        return(
          <g key={h.id} style={{cursor:"pointer"}} onClick={()=>onSelect(h.id===selectedId?null:h.id)}>
            {active&&<circle cx={cx} cy={cy} r="14" fill={col} opacity="0.12"/>}
            <circle cx={cx} cy={cy} r={active?7:5} fill={col} opacity="0.22"/>
            <circle cx={cx} cy={cy} r={active?5:4} fill={col} opacity="0.88"/>
            <circle cx={cx} cy={cy} r={active?5:4} fill="none" stroke="white" strokeWidth="0.8"/>
            {active&&<circle cx={cx} cy={cy} r="11" fill="none" stroke={col} strokeWidth="1" opacity="0.55" strokeDasharray="3 2"/>}
            {showWeather&&<text x={cx+7} y={cy-5} fontSize="10" fill="#1a1a2e">{h.wx}</text>}
          </g>
        );
      })}
      <rect x="4" y="175" width="128" height="22" rx="4" fill="white" opacity="0.88"/>
      {[["Critical",P.red],["High",P.amberM],["Medium",P.blueM]].map(([l,c],i)=>(
        <g key={l}><circle cx={13+i*44} cy={186} r="4" fill={c} opacity="0.88"/><text x={20+i*44} y={189} fontSize="7" fill="#333">{l}</text></g>
      ))}
    </svg>
  );
}


//  PAGE: OVERVIEW

function PageOverview({hazards,activity,selectedId,setSelectedId,navigateTo}){
  const crit=hazards.filter(h=>h.sev==="Critical").length;
  const high=hazards.filter(h=>h.sev==="High").length;
  const med=hazards.filter(h=>h.sev==="Medium").length;
  const totalAffected=hazards.reduce((s,h)=>s+h.affected,0);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Stat tiles */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        <StatTile label="Active Incidents" value={hazards.length} delta="+2 today" deltaUp={false} icon="⚡" color={P.red}/>
        <StatTile label="Critical Alerts" value={crit} delta="↑ from 1" deltaUp={false} icon="🚨" color={P.red}/>
        <StatTile label="People Affected" value={totalAffected} delta="+840" deltaUp={false} icon="👥" color={P.amber}/>
        <StatTile label="Provinces Active" value={7} delta="All 7" deltaUp={true} icon="📍" color={P.teal}/>
      </div>

      {/* Map + Feed row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14}}>
        <Card>
          <CardHeader title="Nepal — Live Hazard Overview" icon="🗺" right={
            <button onClick={()=>navigateTo("map")} style={{fontSize:10,padding:"3px 9px",borderRadius:6,border:"1px solid #d0ddf5",background:"#f0f5ff",color:P.blue,cursor:"pointer",fontWeight:700}}>Full Map →</button>
          }/>
          <div style={{height:260,padding:8}}>
            <NepalMapSVG hazards={hazards} selectedId={selectedId} onSelect={setSelectedId}/>
          </div>
          {selectedId&&(()=>{const h=hazards.find(x=>x.id===selectedId);return(
            <div style={{margin:"0 12px 10px",padding:"10px 13px",background:"#f5f8ff",border:"1px solid #d0ddf5",borderRadius:10,display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:22}}>{TYPE_ICON[h.type]||"⚠"}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e"}}>{h.name} — {h.type}</div>
                <div style={{fontSize:11,color:"#5a6080"}}>{h.desc}</div>
              </div>
              <Badge label={h.sev} bg={SEV[h.sev]?.bg} color={SEV[h.sev]?.text}/>
              <button onClick={()=>setSelectedId(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#9aa0b4",fontSize:13}}>✕</button>
            </div>
          );})()}
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card style={{flex:1}}>
            <CardHeader title="Live Feed" icon="📡" right={<span style={{fontSize:9,background:P.redL,color:P.red,padding:"1px 7px",borderRadius:4,fontWeight:700}}>● LIVE</span>}/>
            <div style={{maxHeight:220,overflowY:"auto",padding:"4px 0"}}>
              {activity.slice(0,8).map((a,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"6px 13px",borderBottom:"1px solid #f5f6fa",alignItems:"flex-start"}}>
                  <ActivityDot type={a.type}/>
                  <div><div style={{fontSize:10,fontFamily:"monospace",color:"#9aa0b4"}}>{a.time}</div>
                  <div style={{fontSize:11,color:"#2c3050",lineHeight:1.4}}>{a.event}</div></div>
                </div>
              ))}
            </div>
            <div style={{padding:"8px 13px",borderTop:"1px solid #eef0f5"}}>
              <button onClick={()=>navigateTo("activity")} style={{fontSize:10,color:P.blue,background:"none",border:"none",cursor:"pointer",fontWeight:700,padding:0}}>View all activity →</button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Severity Split" icon="📊"/>
            <div style={{padding:"10px 14px 14px"}}>
              <SeverityBar label="Critical" count={crit} total={hazards.length} color={P.red}/>
              <SeverityBar label="High" count={high} total={hazards.length} color={P.amberM}/>
              <SeverityBar label="Medium" count={med} total={hazards.length} color={P.blueM}/>
              <SeverityBar label="Low" count={hazards.length-crit-high-med} total={hazards.length} color={P.greenM}/>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick incident table */}
      <Card>
        <CardHeader title="Recent Incidents" icon="📋" right={
          <button onClick={()=>navigateTo("incidents")} style={{fontSize:10,padding:"3px 9px",borderRadius:6,border:"1px solid #d0ddf5",background:"#f0f5ff",color:P.blue,cursor:"pointer",fontWeight:700}}>View all →</button>
        }/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"#f8f9fc"}}>
                {["","District","Type","Province","Severity","Affected","Weather"].map((h,i)=>(
                  <th key={i} style={{fontSize:10,color:"#9aa0b4",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",padding:"8px 12px",textAlign:"left",borderBottom:"1px solid #eef0f5"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hazards.slice(0,5).map(h=>(
                <tr key={h.id} onClick={()=>setSelectedId(h.id)} style={{cursor:"pointer",borderBottom:"1px solid #f5f6fa"}} onMouseEnter={e=>e.currentTarget.style.background="#f8faff"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <td style={{padding:"9px 12px",fontSize:16}}>{TYPE_ICON[h.type]||"⚠"}</td>
                  <td style={{padding:"9px 12px",fontSize:12,fontWeight:600,color:"#1a1a2e"}}>{h.name}</td>
                  <td style={{padding:"9px 12px",fontSize:11,color:"#5a6080"}}>{h.type}</td>
                  <td style={{padding:"9px 12px",fontSize:11,color:"#5a6080"}}>{h.province}</td>
                  <td style={{padding:"9px 12px"}}><Badge label={h.sev} bg={SEV[h.sev]?.bg} color={SEV[h.sev]?.text}/></td>
                  <td style={{padding:"9px 12px",fontSize:12,fontWeight:600,color:"#1a1a2e"}}>{h.affected.toLocaleString()}</td>
                  <td style={{padding:"9px 12px",fontSize:13}}>{h.wx} {h.temp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
//  PAGE: LIVE MAP

function PageMap({hazards,selectedId,setSelectedId}){
  const [mode,setMode]=useState("hazard");
  const sel=hazards.find(h=>h.id===selectedId);
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:14,height:"calc(100vh - 130px)"}}>
      <Card style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <CardHeader title="Nepal — Interactive Hazard & Weather Map" icon="🗺" right={
          <div style={{display:"flex",background:"#f0f3fa",borderRadius:8,padding:3,gap:2}}>
            {[["hazard","⚡ Hazard"],["weather","🌦 Weather"]].map(([m,l])=>(
              <button key={m} onClick={()=>setMode(m)} style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:6,border:"none",cursor:"pointer",background:mode===m?"#fff":"transparent",color:mode===m?"#1a1a2e":"#7a8099",boxShadow:mode===m?"0 1px 4px #c0cce020":"none",transition:"all 0.15s"}}>{l}</button>
            ))}
          </div>
        }/>
        <div style={{flex:1,padding:10,minHeight:0}}>
          <NepalMapSVG hazards={hazards} selectedId={selectedId} onSelect={setSelectedId} showWeather={mode==="weather"}/>
        </div>
        {/* Terrain legend */}
        <div style={{padding:"8px 14px",borderTop:"1px solid #eef0f5",display:"flex",gap:16,alignItems:"center"}}>
          <span style={{fontSize:10,color:"#9aa0b4",fontWeight:600}}>Terrain:</span>
          {[["⛰ Himalaya","#ddeeff","#4a6fa5"],["🌿 Hills","#d6ebd0","#3a7a30"],["🌾 Terai","#d4e8c0","#5a7a30"]].map(([l,bg,c])=>(
            <div key={l} style={{fontSize:10,background:bg,color:c,padding:"2px 9px",borderRadius:4,fontWeight:600}}>{l}</div>
          ))}
          <span style={{marginLeft:"auto",fontSize:10,color:"#9aa0b4"}}>Click marker for details</span>
        </div>
      </Card>

      {/* Right panel */}
      <div style={{display:"flex",flexDirection:"column",gap:12,overflowY:"auto"}}>
        {sel?(
          <Card>
            <CardHeader title={sel.name} icon={TYPE_ICON[sel.type]||"⚠"}/>
            <div style={{padding:"14px 15px",display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <Badge label={sel.sev} bg={SEV[sel.sev]?.bg} color={SEV[sel.sev]?.text} size={11}/>
                <Badge label={sel.type} bg="#f0f3fa" color="#5a6080" size={11}/>
              </div>
              <div style={{fontSize:12,color:"#2c3050",lineHeight:1.5}}>{sel.desc}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["🌡 Temp",sel.temp],["💨 Wind",sel.wind],["💧 Humidity",sel.humidity],["🌧 Rain",sel.rain],["Province",sel.province],["Affected",sel.affected.toLocaleString()]].map(([k,v])=>(
                  <div key={k} style={{background:"#f8f9fc",borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:9,color:"#9aa0b4",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e"}}>{v}</div>
                  </div>
                ))}
              </div>
              {sel.casualties>0&&<div style={{background:P.redL,borderRadius:8,padding:"8px 10px",display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:14}}>🚑</span>
                <div><div style={{fontSize:10,fontWeight:700,color:P.red,textTransform:"uppercase"}}>Casualties Reported</div>
                <div style={{fontSize:13,fontWeight:700,color:P.red}}>{sel.casualties} confirmed</div></div>
              </div>}
            </div>
          </Card>
        ):(
          <div style={{background:"#fff",border:"1px solid #e3e8f0",borderRadius:14,padding:"20px 16px",textAlign:"center",color:"#9aa0b4",fontSize:12}}>
            <div style={{fontSize:28,marginBottom:8}}>📍</div>
            Click a marker on the map to view district details
          </div>
        )}

        <Card>
          <CardHeader title="All Districts" icon="📋"/>
          <div style={{maxHeight:360,overflowY:"auto"}}>
            {hazards.map(h=>(
              <div key={h.id} onClick={()=>setSelectedId(h.id===selectedId?null:h.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 13px",cursor:"pointer",borderBottom:"1px solid #f5f6fa",background:selectedId===h.id?"#f0f6ff":"transparent",borderLeft:selectedId===h.id?`3px solid ${P.blue}`:"3px solid transparent",transition:"background 0.12s"}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:SEV[h.sev]?.dot,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#1a1a2e"}}>{h.name}</div>
                  <div style={{fontSize:10,color:"#9aa0b4"}}>{h.type}</div>
                </div>
                <span style={{fontSize:13}}>{h.wx}</span>
                <Badge label={h.sev} bg={SEV[h.sev]?.bg} color={SEV[h.sev]?.text}/>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}


//  PAGE: INCIDENTS

function PageIncidents({hazards,selectedId,setSelectedId}){
  const [filter,setFilter]=useState("All");
  const [sortBy,setSortBy]=useState("sev");
  const filters=["All","Critical","High","Medium","Flood","Earthquake","Landslide"];
  const filtered=hazards.filter(h=>filter==="All"?true:h.sev===filter||h.type===filter);
  const sorted=[...filtered].sort((a,b)=>{
    if(sortBy==="sev"){const o={Critical:0,High:1,Medium:2,Low:3};return o[a.sev]-o[b.sev];}
    if(sortBy==="affected")return b.affected-a.affected;
    return a.name.localeCompare(b.name);
  });
  const sel=hazards.find(h=>h.id===selectedId);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {l:"Total Incidents",v:hazards.length,icon:"📋",delta:null},
          {l:"Critical",v:hazards.filter(h=>h.sev==="Critical").length,icon:"🚨",delta:"Immediate action"},
          {l:"Total Casualties",v:hazards.reduce((s,h)=>s+h.casualties,0),icon:"🚑",delta:"Confirmed"},
          {l:"Total Affected",v:hazards.reduce((s,h)=>s+h.affected,0),icon:"👥",delta:"Across 7 provinces"},
        ].map((s,i)=><StatTile key={i} label={s.l} value={s.v} delta={s.delta} icon={s.icon}/>)}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14}}>
        <Card>
          <CardHeader title="Incident Registry" icon="📋" right={
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <span style={{fontSize:10,color:"#9aa0b4"}}>Sort:</span>
              {[["sev","Severity"],["affected","Affected"],["name","Name"]].map(([k,l])=>(
                <button key={k} onClick={()=>setSortBy(k)} style={{fontSize:10,padding:"2px 8px",borderRadius:5,border:"none",cursor:"pointer",background:sortBy===k?"#1a3a6b":"#f0f3fa",color:sortBy===k?"#fff":"#5a6080",fontWeight:600}}>{l}</button>
              ))}
            </div>
          }/>
          {/* Filter bar */}
          <div style={{padding:"8px 14px",borderBottom:"1px solid #eef0f5",display:"flex",gap:6,flexWrap:"wrap"}}>
            {filters.map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:6,border:"none",cursor:"pointer",background:filter===f?"#1a3a6b":"#f0f3fa",color:filter===f?"#fff":"#5a6080"}}>{f}</button>
            ))}
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#f8f9fc"}}>
                {["","District","Province","Type","Severity","Affected","Casualties","Conditions"].map((h,i)=>(
                  <th key={i} style={{fontSize:10,color:"#9aa0b4",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",padding:"8px 12px",textAlign:"left",borderBottom:"1px solid #eef0f5"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {sorted.map(h=>(
                  <tr key={h.id} onClick={()=>setSelectedId(h.id===selectedId?null:h.id)} style={{cursor:"pointer",borderBottom:"1px solid #f5f6fa",background:selectedId===h.id?"#f0f6ff":""}} onMouseEnter={e=>{if(selectedId!==h.id)e.currentTarget.style.background="#f8faff"}} onMouseLeave={e=>{if(selectedId!==h.id)e.currentTarget.style.background=""}}>
                    <td style={{padding:"9px 12px",fontSize:17}}>{TYPE_ICON[h.type]||"⚠"}</td>
                    <td style={{padding:"9px 12px",fontSize:12,fontWeight:700,color:"#1a1a2e"}}>{h.name}</td>
                    <td style={{padding:"9px 12px",fontSize:11,color:"#5a6080"}}>{h.province}</td>
                    <td style={{padding:"9px 12px",fontSize:11,color:"#5a6080"}}>{h.type}</td>
                    <td style={{padding:"9px 12px"}}><Badge label={h.sev} bg={SEV[h.sev]?.bg} color={SEV[h.sev]?.text}/></td>
                    <td style={{padding:"9px 12px",fontSize:12,fontWeight:600}}>{h.affected.toLocaleString()}</td>
                    <td style={{padding:"9px 12px",fontSize:12,color:h.casualties>0?P.red:"#3B6D11",fontWeight:700}}>{h.casualties>0?`⚠ ${h.casualties}`:"✓ 0"}</td>
                    <td style={{padding:"9px 12px",fontSize:13}}>{h.wx} {h.temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail panel */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {sel?(
            <Card>
              <CardHeader title="Incident Detail" icon={TYPE_ICON[sel.type]||"⚠"}/>
              <div style={{padding:"14px 15px",display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontSize:16,fontWeight:800,color:"#1a1a2e"}}>{sel.name}</div>
                <Badge label={sel.sev} bg={SEV[sel.sev]?.bg} color={SEV[sel.sev]?.text} size={11}/>
                <div style={{fontSize:12,color:"#2c3050",lineHeight:1.6}}>{sel.desc}</div>
                <div style={{height:1,background:"#eef0f5"}}/>
                {[["District",sel.name],["Province",sel.province],["Hazard Type",sel.type],["People Affected",sel.affected.toLocaleString()],["Casualties",sel.casualties||"None reported"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                    <span style={{color:"#7a8099",fontWeight:600}}>{k}</span>
                    <span style={{color:"#1a1a2e",fontWeight:700}}>{v}</span>
                  </div>
                ))}
                {sel.casualties>0&&<div style={{background:P.redL,borderRadius:8,padding:"10px",marginTop:4}}>
                  <div style={{fontSize:11,fontWeight:700,color:P.red}}>🚑 {sel.casualties} casualties confirmed</div>
                  <div style={{fontSize:10,color:P.red,marginTop:2,opacity:0.8}}>Emergency response teams deployed</div>
                </div>}
              </div>
            </Card>
          ):(
            <div style={{background:"#fff",border:"1px solid #e3e8f0",borderRadius:14,padding:"24px 16px",textAlign:"center",color:"#9aa0b4",fontSize:12}}>
              <div style={{fontSize:28,marginBottom:8}}>📋</div>
              Select an incident from the table to view full details
            </div>
          )}
          <Card>
            <CardHeader title="By Hazard Type" icon="📊"/>
            <div style={{padding:"12px 14px"}}>
              {Object.entries(hazards.reduce((a,h)=>{a[h.type]=(a[h.type]||0)+1;return a},{})).map(([type,count])=>(
                <div key={type} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:14}}>{TYPE_ICON[type]||"⚠"}</span>
                  <span style={{fontSize:11,color:"#5a6080",flex:1,fontWeight:600}}>{type}</span>
                  <span style={{fontSize:11,fontWeight:700,color:"#1a1a2e"}}>{count}</span>
                  <div style={{width:60,height:4,borderRadius:2,background:"#eef1f8"}}>
                    <div style={{height:"100%",width:`${(count/hazards.length)*100}%`,background:P.blueM,borderRadius:2}}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


//  PAGE: WEATHER

function PageWeather({hazards,selectedId,setSelectedId}){
  const PROVINCES=[
    {name:"Koshi",emoji:"⛈",temp:"26–29°C",rain:"38mm",wind:"18 km/h",status:"Monsoon Active",color:P.blueM},
    {name:"Madhesh",emoji:"🌧",temp:"25–28°C",rain:"22mm",wind:"12 km/h",status:"Heavy Rain",color:P.blueM},
    {name:"Bagmati",emoji:"⛅",temp:"18–22°C",rain:"6mm",wind:"10 km/h",status:"Partly Cloudy",color:P.amberM},
    {name:"Gandaki",emoji:"🌧",temp:"14–18°C",rain:"42mm",wind:"8 km/h",status:"Flood Watch",color:P.red},
    {name:"Lumbini",emoji:"🌧",temp:"22–26°C",rain:"18mm",wind:"14 km/h",status:"Alert",color:P.amberM},
    {name:"Karnali",emoji:"❄",temp:"-6–4°C", rain:"0mm", wind:"32 km/h",status:"Blizzard",color:P.red},
    {name:"Sudurpashchim",emoji:"☀",temp:"30–35°C",rain:"0mm",wind:"8 km/h",status:"Heatwave",color:P.amberM},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Province cards */}
      <Card>
        <CardHeader title="Province Weather Overview" icon="🌦"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0}}>
          {PROVINCES.map((p,i)=>(
            <div key={p.name} style={{padding:"14px 15px",borderRight:i%4!==3?"1px solid #f0f2f8":"none",borderBottom:i<4?"1px solid #f0f2f8":"none"}}>
              <div style={{fontSize:26,marginBottom:4}}>{p.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,color:"#1a1a2e"}}>{p.name}</div>
              <div style={{fontSize:16,fontWeight:800,color:"#1a1a2e",margin:"4px 0"}}>{p.temp}</div>
              <div style={{fontSize:10,color:p.color,fontWeight:700,textTransform:"uppercase",background:p.color+"18",padding:"1px 6px",borderRadius:4,display:"inline-block"}}>{p.status}</div>
              <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:2}}>
                <div style={{fontSize:10,color:"#7a8099"}}>🌧 Rain: {p.rain}</div>
                <div style={{fontSize:10,color:"#7a8099"}}>💨 Wind: {p.wind}</div>
              </div>
            </div>
          ))}
          <div style={{padding:"14px 15px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",background:"#f8f9fc"}}>
            <div style={{fontSize:11,color:"#9aa0b4",textAlign:"center"}}>7/7 Provinces<br/>Monitored</div>
          </div>
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* District weather grid */}
        <Card>
          <CardHeader title="District Conditions" icon="🌡"/>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#f8f9fc"}}>
                {["District","Wx","Temp","Humidity","Rainfall","Wind"].map(h=>(
                  <th key={h} style={{fontSize:10,color:"#9aa0b4",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",padding:"8px 12px",textAlign:"left",borderBottom:"1px solid #eef0f5"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {hazards.map(h=>(
                  <tr key={h.id} onClick={()=>setSelectedId(h.id===selectedId?null:h.id)} style={{cursor:"pointer",borderBottom:"1px solid #f5f6fa",background:selectedId===h.id?"#f0f6ff":""}} onMouseEnter={e=>{if(selectedId!==h.id)e.currentTarget.style.background="#f8faff"}} onMouseLeave={e=>{if(selectedId!==h.id)e.currentTarget.style.background=""}}>
                    <td style={{padding:"8px 12px",fontSize:12,fontWeight:600,color:"#1a1a2e"}}>{h.name}</td>
                    <td style={{padding:"8px 12px",fontSize:17}}>{h.wx}</td>
                    <td style={{padding:"8px 12px",fontSize:12,fontWeight:700}}>{h.temp}</td>
                    <td style={{padding:"8px 12px",fontSize:12,color:"#5a6080"}}>{h.humidity}</td>
                    <td style={{padding:"8px 12px",fontSize:12,color:parseInt(h.rain)>20?P.blueM:"#5a6080",fontWeight:parseInt(h.rain)>20?700:400}}>{h.rain}</td>
                    <td style={{padding:"8px 12px",fontSize:11,color:"#5a6080"}}>{h.wind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Alerts */}
          <Card>
            <CardHeader title="Active Weather Alerts" icon="⚠"/>
            <div style={{padding:"8px 0"}}>
              {[
                {level:"Red",icon:"🔴",msg:"Flood warning — Gandaki & Koshi basins",detail:"Next 48hrs"},
                {level:"Red",icon:"🔴",msg:"Blizzard — Karnali mountain districts",detail:"Ongoing"},
                {level:"Orange",icon:"🟠",msg:"Heavy rain — Madhesh & Lumbini",detail:"Next 24hrs"},
                {level:"Orange",icon:"🟠",msg:"Heatwave — Sudurpashchim Terai",detail:"Next 72hrs"},
                {level:"Yellow",icon:"🟡",msg:"Thunderstorms — Bagmati region",detail:"Tonight"},
              ].map((a,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"8px 14px",borderBottom:"1px solid #f5f6fa",alignItems:"flex-start"}}>
                  <span style={{fontSize:13}}>{a.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#1a1a2e"}}>{a.msg}</div>
                    <div style={{fontSize:10,color:"#9aa0b4"}}>{a.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Monsoon Status" icon="🌧"/>
            <div style={{padding:"14px 15px",display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:"#5a6080",fontWeight:600}}>Onset Status</span>
                <span style={{fontSize:11,background:P.blueL,color:P.blue,padding:"2px 8px",borderRadius:4,fontWeight:700}}>Active</span>
              </div>
              {[["Cumulative Rainfall","22% above avg"],["Coverage","All 7 provinces"],["Intensity","Moderate–Heavy"],["Forecast (48hr)","Intensifying"],["Flood Risk","Elevated"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                  <span style={{color:"#7a8099"}}>{k}</span>
                  <span style={{color:"#1a1a2e",fontWeight:700}}>{v}</span>
                </div>
              ))}
              <div style={{height:1,background:"#eef0f5",margin:"2px 0"}}/>
              <div style={{fontSize:11,color:"#5a6080",lineHeight:1.5}}>Monsoon currently intensifying across eastern Nepal. Western districts experiencing heat stress. Mountain areas under blizzard conditions.</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


//  PAGE: ACTIVITY FEED

function PageActivity({activity}){
  const [typeFilter,setTypeFilter]=useState("all");
  const filtered=typeFilter==="all"?activity:activity.filter(a=>a.type===typeFilter);
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:14}}>
      <Card>
        <CardHeader title="Live Activity Log" icon="📡" right={
          <div style={{display:"flex",gap:6}}>
            {["all","critical","high","medium","low"].map(t=>(
              <button key={t} onClick={()=>setTypeFilter(t)} style={{fontSize:10,padding:"2px 8px",borderRadius:5,border:"none",cursor:"pointer",background:typeFilter===t?"#1a3a6b":"#f0f3fa",color:typeFilter===t?"#fff":"#5a6080",fontWeight:700,textTransform:"capitalize"}}>{t}</button>
            ))}
          </div>
        }/>
        <div style={{maxHeight:"calc(100vh - 220px)",overflowY:"auto"}}>
          {filtered.map((a,i)=>{
            const bg={critical:"#fff8f8",high:"#fffcf4",medium:"#f4f8ff",low:"#f4faf4"};
            return(
              <div key={i} style={{display:"flex",gap:12,padding:"12px 16px",borderBottom:"1px solid #f5f6fa",background:i===0?bg[a.type]:undefined,alignItems:"flex-start"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0}}>
                  <ActivityDot type={a.type}/>
                  {i<filtered.length-1&&<div style={{width:1,height:20,background:"#e8edf5"}}/>}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <span style={{fontSize:10,fontFamily:"monospace",color:"#9aa0b4",letterSpacing:"0.05em"}}>{a.time} UTC</span>
                    <Badge label={a.type} bg={{critical:P.redL,high:P.amberL,medium:P.blueL,low:P.greenL}[a.type]||P.grayL} color={{critical:P.red,high:P.amber,medium:P.blue,low:P.green}[a.type]||P.gray}/>
                  </div>
                  <div style={{fontSize:12,color:"#2c3050",lineHeight:1.5}}>{a.event}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card>
          <CardHeader title="Activity Summary" icon="📊"/>
          <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
            {[["critical",P.red],["high",P.amberM],["medium",P.blueM],["low",P.greenM]].map(([t,c])=>{
              const count=activity.filter(a=>a.type===t).length;
              return(
                <div key={t}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontSize:11,color:"#5a6080",fontWeight:600,textTransform:"capitalize"}}>{t}</span>
                    <span style={{fontSize:11,color:c,fontWeight:700}}>{count}</span>
                  </div>
                  <div style={{height:5,borderRadius:3,background:"#eef1f8"}}>
                    <div style={{height:"100%",width:`${(count/activity.length)*100}%`,background:c,borderRadius:3}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Data Sources" icon="🛰"/>
          <div style={{padding:"10px 14px"}}>
            {[["DHM Nepal","Hydrological","Online",P.teal],["NDRRMA","Disaster Mgmt","Online",P.teal],["NSC","Seismic","Online",P.teal],["USGS","Seismic","Online",P.teal],["IMD","Meteorology","Online",P.teal],["Satellite","Imagery","6hr lag",P.amberM]].map(([name,type,status,color])=>(
              <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid #f5f6fa"}}>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:"#1a1a2e"}}>{name}</div>
                  <div style={{fontSize:10,color:"#9aa0b4"}}>{type}</div>
                </div>
                <span style={{fontSize:10,color,fontWeight:700}}>● {status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="System Health" icon="💻"/>
          <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:6}}>
            {[["Sensors Online","28/28",P.teal],["Flood Gauges","31/34",P.amberM],["Seismic Nodes","14/14",P.teal],["Uptime","99.8%",P.teal]].map(([k,v,c])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                <span style={{color:"#7a8099"}}>{k}</span>
                <span style={{color:c,fontWeight:700}}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}


//  PAGE: ANALYTICS

function PageAnalytics({hazards}){
  const provinceData=[
    {name:"Koshi",incidents:2,risk:78,affected:5840,color:P.red},
    {name:"Madhesh",incidents:1,risk:62,affected:4700,color:P.amberM},
    {name:"Bagmati",incidents:1,risk:55,affected:1200,color:P.amberM},
    {name:"Gandaki",incidents:1,risk:88,affected:8400,color:P.red},
    {name:"Lumbini",incidents:2,risk:71,affected:5900,color:P.red},
    {name:"Karnali",incidents:1,risk:45,affected:640,color:P.blueM},
    {name:"Sudurpashchim",incidents:0,risk:38,affected:0,color:P.greenM},
  ];
  const maxAffected=Math.max(...provinceData.map(p=>p.affected));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        <StatTile label="Risk Index" value="6.8/10" icon="📈" delta="▲ High"/>
        <StatTile label="Avg Response Time" value="18min" icon="⏱" delta="↓ 3min" deltaUp={true}/>
        <StatTile label="Alert Accuracy" value="94%" icon="🎯" delta="+2%" deltaUp={true}/>
        <StatTile label="Trend 7d" value="↑ 12%" icon="📊" delta="Worsening" deltaUp={false}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* Province risk chart */}
        <Card>
          <CardHeader title="Province Risk Assessment" icon="📊"/>
          <div style={{padding:"14px 16px"}}>
            {provinceData.map(p=>(
              <div key={p.name} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:11,color:"#1a1a2e",fontWeight:600}}>{p.name}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:10,color:"#9aa0b4"}}>{p.incidents} incidents</span>
                    <span style={{fontSize:11,color:p.color,fontWeight:700}}>{p.risk}%</span>
                  </div>
                </div>
                <div style={{height:6,borderRadius:3,background:"#eef1f8"}}>
                  <div style={{height:"100%",width:`${p.risk}%`,background:p.color,borderRadius:3,transition:"width 1s ease"}}/>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Affected population */}
        <Card>
          <CardHeader title="Population Affected by Province" icon="👥"/>
          <div style={{padding:"14px 16px"}}>
            {provinceData.filter(p=>p.affected>0).sort((a,b)=>b.affected-a.affected).map(p=>(
              <div key={p.name} style={{display:"flex",gap:10,marginBottom:10,alignItems:"center"}}>
                <div style={{width:80,fontSize:11,color:"#5a6080",fontWeight:600,flexShrink:0}}>{p.name}</div>
                <div style={{flex:1,height:16,borderRadius:3,background:"#eef1f8",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(p.affected/maxAffected)*100}%`,background:p.color,borderRadius:3,display:"flex",alignItems:"center",paddingLeft:6}}>
                    <span style={{fontSize:9,color:"white",fontWeight:700,whiteSpace:"nowrap"}}>{p.affected>500?p.affected.toLocaleString():""}</span>
                  </div>
                </div>
                <span style={{fontSize:11,color:"#1a1a2e",fontWeight:700,width:50,textAlign:"right"}}>{p.affected.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Hazard type breakdown */}
        <Card>
          <CardHeader title="Hazard Distribution" icon="🔢"/>
          <div style={{padding:"14px 16px"}}>
            {Object.entries(hazards.reduce((a,h)=>{a[h.type]=(a[h.type]||0)+1;return a},{})).map(([type,count],i,arr)=>{
              const colors=[P.blueM,P.red,P.amberM,P.tealM,P.greenM,P.grayM];
              return(
                <div key={type} style={{display:"flex",gap:10,marginBottom:10,alignItems:"center"}}>
                  <span style={{fontSize:15,width:22}}>{TYPE_ICON[type]||"⚠"}</span>
                  <span style={{fontSize:11,color:"#5a6080",fontWeight:600,width:90,flexShrink:0}}>{type}</span>
                  <div style={{flex:1,height:14,borderRadius:3,background:"#eef1f8",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(count/hazards.length)*100}%`,background:colors[i%colors.length],borderRadius:3}}/>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:"#1a1a2e",width:16,textAlign:"right"}}>{count}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Timeline summary */}
        <Card>
          <CardHeader title="7-Day Incident Trend" icon="📅"/>
          <div style={{padding:"14px 16px"}}>
            {[["Mon","▃▃▃",3],["Tue","▅▅▅",5],["Wed","▄▄▄",4],["Thu","▆▆▆",6],["Fri","▇▇▇",7],["Sat","▅▅▅",5],["Sun","████",8]].map(([day,bar,count],i)=>(
              <div key={day} style={{display:"flex",gap:10,marginBottom:9,alignItems:"center"}}>
                <span style={{fontSize:10,color:"#9aa0b4",width:26,fontWeight:600}}>{day}</span>
                <div style={{flex:1,height:14,borderRadius:3,background:"#eef1f8",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(count/8)*100}%`,background:i===6?P.red:P.blueM,borderRadius:3}}/>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:i===6?P.red:"#1a1a2e",width:12,textAlign:"right"}}>{count}</span>
              </div>
            ))}
            <div style={{marginTop:12,padding:"10px",background:"#f8f9fc",borderRadius:8,fontSize:11,color:"#5a6080",lineHeight:1.5}}>
              Incidents trending upward. Sunday peak likely monsoon-related. Recommend elevated readiness for next 72hrs.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


//  PAGE: INTELLIGENCE (AI Chat)

function PageIntelligence({hazards,selectedId,setSelectedId}){
  const [msgs,setMsgs]=useState([
    {role:"assistant",text:"Hello, I'm the RHIS Intelligence Assistant.\n\nI have live access to hazard data, weather feeds, and incident reports across all 7 provinces of Nepal. How can I help you today?\n\nType help for available commands, or click a location on the map."}
  ]);
  const [input,setInput]=useState("");
  const [typing,setTyping]=useState(false);
  const chatEndRef=useRef(null);

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const send=(q)=>{
    const text=q||input.trim();
    if(!text)return;
    setInput("");
    setMsgs(p=>[...p,{role:"user",text}]);
    setTyping(true);
    setTimeout(()=>{
      const lower=text.toLowerCase();
      let resp;
      if(lower.includes("flood"))resp=AI_RESP.flood;
      else if(lower.includes("earth")||lower.includes("seism"))resp=AI_RESP.earthquake;
      else if(lower.includes("weather")||lower.includes("rain")||lower.includes("temp"))resp=AI_RESP.weather;
      else if(lower.includes("help"))resp=AI_RESP.help;
      else if(lower.includes("status"))resp=AI_RESP.status;
      else resp=AI_RESP.default(text);
      setMsgs(p=>[...p,{role:"assistant",text:resp}]);
      setTyping(false);
    },1100);
  };

  const handleMapSelect=(id)=>{
    setSelectedId(id===selectedId?null:id);
    if(id&&id!==selectedId){
      const h=hazards.find(x=>x.id===id);
      if(h){
        send(`Show detailed status report for ${h.name}`);
      }
    }
  };

  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14,height:"calc(100vh - 130px)"}}>
      {/* Chat */}
      <Card style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <CardHeader title="RHIS Intelligence Assistant" icon="🤖" right={
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:P.tealM}}/>
            <span style={{fontSize:10,color:P.teal,fontWeight:700}}>AI ACTIVE</span>
          </div>
        }/>

        {/* Quick commands */}
        <div style={{padding:"7px 12px",borderBottom:"1px solid #eef0f5",display:"flex",flexWrap:"wrap",gap:5}}>
          {["flood","earthquake","weather","status","help"].map(q=>(
            <button key={q} onClick={()=>send(q)} style={{fontSize:10,padding:"3px 10px",borderRadius:6,border:"1px solid #d8e0f0",background:"#f5f7fc",color:"#4a6080",cursor:"pointer",fontWeight:700}}>{q}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:10,minHeight:0}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="assistant"&&<div style={{fontSize:9,color:"#9aa0b4",marginBottom:3,marginLeft:2,fontWeight:600}}>RHIS AI</div>}
              <div style={{maxWidth:"85%",padding:"10px 13px",borderRadius:m.role==="user"?"12px 12px 3px 12px":"12px 12px 12px 3px",background:m.role==="user"?"#1a3a6b":"#f5f7fc",color:m.role==="user"?"#fff":"#2c3050",fontSize:12,lineHeight:1.6,whiteSpace:"pre-wrap"}}>
                {m.text}
              </div>
            </div>
          ))}
          {typing&&(
            <div style={{display:"flex",alignItems:"center",gap:4,padding:"8px 12px",background:"#f5f7fc",borderRadius:"12px 12px 12px 3px",width:"fit-content"}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:P.blueM,opacity:0.6,animation:`bounce 1s ease-in-out ${i*0.2}s infinite`}}/>)}
            </div>
          )}
          <div ref={chatEndRef}/>
        </div>

        {/* Input */}
        <div style={{padding:"10px 12px",borderTop:"1px solid #eef0f5",display:"flex",gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Ask about hazards, weather, incidents…"
            style={{flex:1,fontSize:12,padding:"8px 12px",borderRadius:9,border:"1px solid #d0daf0",background:"#f8f9fc",color:"#2c3050",outline:"none"}}/>
          <button onClick={()=>send()} style={{padding:"8px 16px",borderRadius:9,border:"none",background:P.navy,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Send</button>
        </div>
      </Card>

      {/* Map side panel */}
      <div style={{display:"flex",flexDirection:"column",gap:12,overflowY:"auto"}}>
        <Card style={{flex:"0 0 auto"}}>
          <CardHeader title="Select Location" icon="📍"/>
          <div style={{height:200,padding:8}}>
            <NepalMapSVG hazards={hazards} selectedId={selectedId} onSelect={handleMapSelect}/>
          </div>
        </Card>

        <Card>
          <CardHeader title="Districts" icon="🗂"/>
          <div style={{maxHeight:340,overflowY:"auto"}}>
            {hazards.map(h=>(
              <div key={h.id} onClick={()=>handleMapSelect(h.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 12px",cursor:"pointer",borderBottom:"1px solid #f5f6fa",background:selectedId===h.id?"#f0f6ff":"transparent",borderLeft:selectedId===h.id?`3px solid ${P.blue}`:"3px solid transparent",transition:"background 0.12s"}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:SEV[h.sev]?.dot,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#1a1a2e"}}>{h.name}</div>
                  <div style={{fontSize:10,color:"#9aa0b4"}}>{h.type}</div>
                </div>
                <span style={{fontSize:13}}>{h.wx}</span>
                <Badge label={h.sev} bg={SEV[h.sev]?.bg} color={SEV[h.sev]?.text}/>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}


//  PAGE: SETTINGS

function PageSettings(){
  const [notif,setNotif]=useState({critical:true,high:true,medium:false,low:false});
  const [refresh,setRefresh]=useState("30");
  const [unit,setUnit]=useState("metric");
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,maxWidth:900}}>
      <Card>
        <CardHeader title="Alert Notifications" icon="🔔"/>
        <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}}>
          {[["critical","Critical Alerts","Immediate response required",P.red],["high","High Alerts","Urgent attention needed",P.amberM],["medium","Medium Alerts","Monitor and prepare",P.blueM],["low","Low Alerts","Informational",P.greenM]].map(([key,label,desc,color])=>(
            <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:"#f8f9fc",borderRadius:9,border:`1px solid ${notif[key]?color+"30":"#e3e8f0"}`}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#1a1a2e"}}>{label}</div>
                <div style={{fontSize:11,color:"#7a8099"}}>{desc}</div>
              </div>
              <div onClick={()=>setNotif(n=>({...n,[key]:!n[key]}))} style={{width:36,height:20,borderRadius:10,background:notif[key]?color:"#d0d8e8",cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
                <div style={{position:"absolute",top:2,left:notif[key]?16:2,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 3px #0002"}}/>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Data & Display" icon="⚙"/>
        <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:"#5a6080",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Refresh Interval</div>
            <div style={{display:"flex",gap:6}}>
              {["10","30","60","120"].map(v=>(
                <button key={v} onClick={()=>setRefresh(v)} style={{flex:1,padding:"7px",borderRadius:7,border:"1px solid "+(refresh===v?P.blue:"#e0e6f0"),background:refresh===v?P.blueL:"#f8f9fc",color:refresh===v?P.blue:"#5a6080",fontWeight:700,fontSize:11,cursor:"pointer"}}>{v}s</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:"#5a6080",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>Units</div>
            <div style={{display:"flex",gap:6}}>
              {[["metric","Metric (°C, km)"],["imperial","Imperial (°F, mi)"]].map(([v,l])=>(
                <button key={v} onClick={()=>setUnit(v)} style={{flex:1,padding:"7px",borderRadius:7,border:"1px solid "+(unit===v?P.blue:"#e0e6f0"),background:unit===v?P.blueL:"#f8f9fc",color:unit===v?P.blue:"#5a6080",fontWeight:700,fontSize:11,cursor:"pointer"}}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{height:1,background:"#eef0f5"}}/>
          {[["Map Style","Terrain + Satellite"],["Language","English"],["Timezone","UTC (Nepal: UTC+5:45)"],["RHIS Version","4.2.1 — Latest"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
              <span style={{color:"#7a8099"}}>{k}</span>
              <span style={{color:"#1a1a2e",fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Data Source Configuration" icon="🛰"/>
        <div style={{padding:"12px 14px"}}>
          {[["DHM Nepal","Hydrology & Flood","Active","Connected"],["NDRRMA","Disaster Mgmt","Active","Connected"],["NSC","Seismic Monitor","Active","Connected"],["USGS Global","Earthquakes","Active","Connected"],["IMD India","Meteorology","Active","Connected"],["Satellite Feed","Imagery (6hr)","Degraded","Limited"],["MODIS","Fire Detection","Active","Connected"]].map(([name,type,status,conn])=>(
            <div key={name} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid #f5f6fa",alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:"#1a1a2e"}}>{name}</div>
                <div style={{fontSize:10,color:"#9aa0b4"}}>{type}</div>
              </div>
              <span style={{fontSize:10,color:status==="Active"?P.teal:P.amber,fontWeight:700}}>● {status}</span>
              <span style={{fontSize:10,color:"#9aa0b4"}}>{conn}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="About RHIS" icon="ℹ"/>
        <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{background:"linear-gradient(135deg,#0f2a5e,#185FA5)",borderRadius:10,padding:"16px",color:"white"}}>
            <div style={{fontSize:14,fontWeight:800,marginBottom:3}}>Real-time Hazard Intelligence System</div>
            <div style={{fontSize:10,opacity:0.8}}>Nepal National Operations Centre</div>
          </div>
          {[["Version","RHIS v4.2.1"],["Build","2025-05-20"],["Uptime","99.8% (30d)"],["Coverage","All 7 provinces, 77 districts"],["Sensors","28 weather + 14 seismic + 34 flood"],["Last Sync","14:32:05 UTC"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0",borderBottom:"1px solid #f5f6fa"}}>
              <span style={{color:"#7a8099"}}>{k}</span>
              <span style={{color:"#1a1a2e",fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


//  SIDEBAR NAV

const NAV_ITEMS = [
  {id:"overview",   icon:"🏠", label:"Overview"},
  {id:"map",        icon:"🗺", label:"Live Map"},
  {id:"incidents",  icon:"⚡", label:"Incidents"},
  {id:"weather",    icon:"🌦", label:"Weather"},
  {id:"activity",   icon:"📡", label:"Activity"},
  {id:"analytics",  icon:"📊", label:"Analytics"},
  {id:"intelligence",icon:"🤖",label:"Intelligence"},
  {id:"settings",   icon:"⚙", label:"Settings"},
];


//  ROOT APP

export default function App(){
  const [page,setPage]     = useState("overview");
  const [time,setTime]     = useState(new Date());
  const [pulse,setPulse]   = useState(false);
  const [selectedId,setSelectedId] = useState(null);
  const [activity,setActivity]     = useState(INIT_ACTIVITY);

  useEffect(()=>{
    const t=setInterval(()=>{setTime(new Date());setPulse(p=>!p);},1000);
    return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    const NEW=[
      {event:"River gauge update: Narayani +12cm in 30min",type:"high"},
      {event:"Rescue team dispatched — Butwal landslide",type:"critical"},
      {event:"Thunderstorm approaching Kathmandu Valley",type:"medium"},
      {event:"Flood barrier status — Terai embankments checked",type:"medium"},
      {event:"NDRRMA situation report #47 transmitted",type:"low"},
      {event:"New seismic event M2.6 — Gorkha district",type:"medium"},
    ];
    let idx=0;
    const t=setInterval(()=>{
      const ts=new Date().toTimeString().slice(0,8);
      setActivity(prev=>[{time:ts,...NEW[idx%NEW.length]},...prev.slice(0,19)]);
      idx++;
    },7000);
    return ()=>clearInterval(t);
  },[]);

  const crit=HAZARDS.filter(h=>h.sev==="Critical").length;

  const PAGE_TITLES={overview:"Overview",map:"Live Map",incidents:"Incidents",weather:"Weather",activity:"Activity Feed",analytics:"Analytics",intelligence:"AI Intelligence",settings:"Settings"};

  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:"#f2f5fb",overflow:"hidden"}}>

      {/* ── Sidebar ── */}
      <div style={{width:200,background:colors.navy,display:"flex",flexDirection:"column",flexShrink:0,borderRight:"1px solid #0a1e4a"}}>
        {/* Logo */}
        <div style={{padding:"16px 16px 12px",borderBottom:"1px solid #1a3a6b"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#185FA5,#1D9E75)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>⚠️</div>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:"-0.2px",lineHeight:1.2}}>RHIS</div>
              <div style={{fontSize:8,color:"#7a9abf",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>Nepal NOC</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{flex:1,padding:"8px 8px",display:"flex",flexDirection:"column",gap:2}}>
          {NAV_ITEMS.map(item=>{
            const active=page===item.id;
            const hasAlert=item.id==="incidents"||item.id==="activity";
            return(
              <button key={item.id} onClick={()=>setPage(item.id)} style={{
                display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:9,border:"none",cursor:"pointer",
                background:active?"rgba(255,255,255,0.12)":"transparent",
                color:active?"#fff":"#8aabcc",
                fontWeight:active?700:500,fontSize:12,
                textAlign:"left",width:"100%",transition:"all 0.15s",position:"relative",
              }}>
                <span style={{fontSize:15,lineHeight:1,flexShrink:0}}>{item.icon}</span>
                <span>{item.label}</span>
                {hasAlert&&!active&&<div style={{width:6,height:6,borderRadius:"50%",background:P.red,marginLeft:"auto",flexShrink:0}}/>}
                {active&&<div style={{position:"absolute",left:0,top:"20%",bottom:"20%",width:3,borderRadius:"0 2px 2px 0",background:"#378ADD"}}/>}
              </button>
            );
          })}
        </nav>

        {/* Bottom status */}
        <div style={{padding:"12px 14px",borderTop:"1px solid #1a3a6b"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:pulse?P.red:"#e88",boxShadow:pulse?`0 0 0 3px rgba(226,75,74,0.2)`:"none",transition:"all 0.5s"}}/>
            <span style={{fontSize:10,fontWeight:700,color:P.red,letterSpacing:"0.06em"}}>LIVE</span>
            <span style={{marginLeft:"auto",fontSize:9,color:"#7a9abf",fontFamily:"monospace"}}>{time.toTimeString().slice(0,8)}</span>
          </div>
          <div style={{fontSize:9,color:"#4a6a8a",lineHeight:1.4}}>
            {crit} critical · 7 provinces<br/>All sensors nominal
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Top bar */}
        <div style={{background:"#fff",borderBottom:"1px solid #e3e8f0",padding:"0 20px",height:50,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e"}}>{PAGE_TITLES[page]}</div>
            <div style={{fontSize:10,color:"#9aa0b4"}}>Real-time Hazard Intelligence System · Nepal</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            {/* Critical badge */}
            <div style={{background:P.redL,color:P.red,padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,display:"flex",gap:5}}>
              <span>🚨 {crit} Critical</span>
            </div>
            {/* Nav shortcuts */}
            {NAV_ITEMS.filter(n=>["overview","map","intelligence"].includes(n.id)).map(n=>(
              <button key={n.id} onClick={()=>setPage(n.id)} style={{fontSize:11,padding:"4px 10px",borderRadius:7,border:"1px solid #e0e6f0",background:page===n.id?"#f0f5ff":"#f8f9fc",color:page===n.id?P.blue:"#5a6080",cursor:"pointer",fontWeight:600,display:"flex",gap:5,alignItems:"center"}}>
                <span>{n.icon}</span><span>{n.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Page content */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          {page==="overview"    && <PageOverview    hazards={HAZARDS} activity={activity} selectedId={selectedId} setSelectedId={setSelectedId} navigateTo={setPage}/>}
          {page==="map"         && <PageMap         hazards={HAZARDS} selectedId={selectedId} setSelectedId={setSelectedId}/>}
          {page==="incidents"   && <PageIncidents   hazards={HAZARDS} selectedId={selectedId} setSelectedId={setSelectedId}/>}
          {page==="weather"     && <PageWeather     hazards={HAZARDS} selectedId={selectedId} setSelectedId={setSelectedId}/>}
          {page==="activity"    && <PageActivity    activity={activity}/>}
          {page==="analytics"   && <PageAnalytics   hazards={HAZARDS}/>}
          {page==="intelligence"&& <PageIntelligence hazards={HAZARDS} selectedId={selectedId} setSelectedId={setSelectedId}/>}
          {page==="settings"    && <PageSettings/>}
        </div>

        {/* Status bar */}
        <div style={{background:"#fff",borderTop:"1px solid #e3e8f0",padding:"4px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontSize:10,color:"#9aa0b4"}}>RHIS v4.2 · Nepal National Operations Centre · All times UTC · Refreshes every 30s</div>
          <div style={{display:"flex",gap:12}}>
            {["DHM","NDRRMA","NSC","USGS","IMD"].map(s=><span key={s} style={{fontSize:10,color:P.tealM,fontWeight:700}}>✓ {s}</span>)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-4px)}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#d0d8e8;border-radius:2px}
      `}</style>
    </div>
  );
}