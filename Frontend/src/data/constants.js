// ─── Color Palette ────────────────────────────────────────────────────────
export const P = {
  red:"#E24B4A", redL:"#FCEBEB", redM:"#F09595",
  amber:"#BA7517", amberL:"#FAEEDA", amberM:"#EF9F27",
  green:"#3B6D11", greenL:"#EAF3DE", greenM:"#97C459",
  blue:"#185FA5", blueL:"#E6F1FB", blueM:"#378ADD",
  teal:"#0F6E56", tealL:"#E1F5EE", tealM:"#1D9E75",
  gray:"#5F5E5A", grayL:"#F1EFE8", grayM:"#B4B2A9",
  navy:"#0f2a5e",
};

// ─── Severity colours ─────────────────────────────────────────────────────
export const SEV = {
  Critical: { bg:"#FCEBEB", text:"#E24B4A", dot:"#E24B4A" },
  High:     { bg:"#FAEEDA", text:"#BA7517", dot:"#EF9F27" },
  Medium:   { bg:"#E6F1FB", text:"#185FA5", dot:"#378ADD" },
  Low:      { bg:"#EAF3DE", text:"#3B6D11", dot:"#97C459" },
};

// ─── Hazard type icons ────────────────────────────────────────────────────
export const TYPE_ICON = {
  Earthquake:"🌋", Flood:"🌊", Landslide:"⛰",
  Heatwave:"🌡", Drought:"🏜", Blizzard:"❄", Wildfire:"🔥", Tsunami:"🌊",
};

// ─── Nepal SVG path ───────────────────────────────────────────────────────
export const NEPAL_PATH = "M 18,72 L 28,62 L 36,55 L 48,50 L 58,48 L 70,46 L 80,44 L 90,42 L 100,40 L 112,38 L 124,36 L 136,35 L 148,34 L 160,33 L 172,32 L 184,31 L 196,30 L 208,30 L 220,30 L 232,30 L 244,30 L 256,31 L 268,31 L 280,31 L 292,31 L 304,31 L 316,32 L 328,32 L 340,33 L 352,34 L 364,35 L 376,36 L 388,38 L 398,40 L 408,44 L 416,50 L 422,58 L 428,66 L 432,76 L 432,88 L 428,100 L 420,110 L 408,118 L 396,124 L 380,130 L 364,134 L 348,138 L 332,142 L 316,148 L 300,158 L 284,164 L 268,168 L 252,170 L 236,172 L 220,172 L 204,170 L 188,168 L 172,166 L 156,162 L 140,158 L 124,154 L 108,150 L 94,148 L 80,148 L 66,148 L 52,146 L 38,140 L 26,130 L 18,118 L 14,106 L 14,94 L 16,82 Z";

// ─── District hazard data ─────────────────────────────────────────────────
export const HAZARDS = [
  { id:1, name:"Kathmandu", lat:27.70, lng:85.32, type:"Earthquake", sev:"High",     wx:"⛅", temp:"22°C", wind:"12 km/h NE", humidity:"68%", rain:"4mm",  desc:"M4.2 tremor detected",           province:"Bagmati",       casualties:0, affected:1200 },
  { id:2, name:"Pokhara",   lat:28.21, lng:83.99, type:"Flood",      sev:"Critical", wx:"🌧", temp:"17°C", wind:"8 km/h W",   humidity:"85%", rain:"42mm", desc:"Seti river level critical",      province:"Gandaki",       casualties:3, affected:8400 },
  { id:3, name:"Biratnagar",lat:26.46, lng:87.27, type:"Flood",      sev:"High",     wx:"⛈", temp:"29°C", wind:"20 km/h S",  humidity:"91%", rain:"38mm", desc:"Monsoon flooding ongoing",        province:"Koshi",         casualties:1, affected:5200 },
  { id:4, name:"Butwal",    lat:27.70, lng:83.45, type:"Landslide",  sev:"Critical", wx:"🌧", temp:"24°C", wind:"15 km/h SW", humidity:"88%", rain:"28mm", desc:"Highway blocked, 3 sites",       province:"Lumbini",       casualties:5, affected:3100 },
  { id:5, name:"Dharan",    lat:26.81, lng:87.28, type:"Heatwave",   sev:"Medium",   wx:"☀", temp:"36°C", wind:"5 km/h E",   humidity:"52%", rain:"0mm",  desc:"Heat index 42°C",                province:"Koshi",         casualties:0, affected:900  },
  { id:6, name:"Nepalgunj", lat:28.05, lng:81.62, type:"Drought",    sev:"Medium",   wx:"☀", temp:"38°C", wind:"7 km/h NW",  humidity:"31%", rain:"0mm",  desc:"Rainfall 40% below avg",         province:"Lumbini",       casualties:0, affected:2800 },
  { id:7, name:"Jumla",     lat:29.27, lng:82.18, type:"Blizzard",   sev:"High",     wx:"❄", temp:"-4°C", wind:"35 km/h N",  humidity:"72%", rain:"0mm",  desc:"Heavy snowfall, roads cut",      province:"Karnali",       casualties:0, affected:640  },
  { id:8, name:"Janakpur",  lat:26.71, lng:85.93, type:"Flood",      sev:"High",     wx:"🌧", temp:"27°C", wind:"10 km/h SE", humidity:"87%", rain:"31mm", desc:"Bagmati tributaries rising",     province:"Madhesh",       casualties:2, affected:4700 },
];

// ─── Initial activity feed ────────────────────────────────────────────────
export const INIT_ACTIVITY = [
  { time:"14:32:05", event:"Seti river gauge exceeded danger mark — Pokhara",    type:"critical" },
  { time:"14:31:50", event:"Landslide blocks Prithvi Highway near Butwal",        type:"critical" },
  { time:"14:30:22", event:"Emergency teams deployed to Biratnagar district",     type:"high"     },
  { time:"14:29:10", event:"Flood warning issued: Bagmati tributaries rising",    type:"high"     },
  { time:"14:28:45", event:"Seismic alert M4.2 — Kathmandu Valley recorded",     type:"medium"   },
  { time:"14:27:30", event:"Heat advisory: Terai region temp above 38°C",         type:"medium"   },
  { time:"14:26:18", event:"Snowfall alert: Jumla roads cut off",                 type:"high"     },
  { time:"14:25:02", event:"Rainfall deficit warning — Karnali zone",             type:"medium"   },
  { time:"14:24:10", event:"NDRRMA coordinators mobilised in 3 provinces",        type:"low"      },
  { time:"14:23:45", event:"Weather station network — all 28 nodes online",       type:"low"      },
];

// ─── Live feed rolling events ─────────────────────────────────────────────
export const ROLLING_EVENTS = [
  { event:"River gauge update: Narayani +12cm in 30min",          type:"high"     },
  { event:"Rescue team dispatched — Butwal landslide zone",        type:"critical" },
  { event:"Thunderstorm approaching Kathmandu Valley",             type:"medium"   },
  { event:"Flood barrier check — Terai embankments nominal",       type:"medium"   },
  { event:"NDRRMA situation report #47 transmitted",               type:"low"      },
  { event:"New seismic event M2.6 — Gorkha district",             type:"medium"   },
  { event:"Monsoon intensifying — eastern Nepal bands",            type:"high"     },
  { event:"Evacuation route cleared — Sindhupalchok",              type:"low"      },
];

// ─── AI assistant canned responses ───────────────────────────────────────
export const AI_RESP = {
  default: (q) => `Analysing: "${q}"\n\nBased on current RHIS sensor feeds, highest-priority zones are Pokhara (Critical Flood) and Butwal (Critical Landslide). Risk elevated in 4 of 7 provinces. Recommend reviewing Gandaki and Lumbini province overlays immediately.`,
  flood:      `Flood Status — Nepal\n\n• Pokhara (Seti River) — Critical, rising 8 cm/hr\n• Biratnagar (Koshi Basin) — High, 82% capacity\n• Janakpur (Bagmati) — High, 76% capacity\n\nMonsoon forecast: Heavy rainfall next 48 hrs. Pre-position emergency teams in Madhesh and Koshi provinces.`,
  earthquake: `Seismic Activity — Last 24 hrs\n\n• M4.2 — Kathmandu Valley, 14:28 UTC\n• M3.1 — Dolakha District, 11:14 UTC\n• M2.8 — Sindhupalchok, 09:02 UTC\n\nAll below destructive threshold. No structural damage. Aftershock probability: 12% within 6 hrs.`,
  weather:    `Weather Overview — Nepal\n\n• Terai (S): 36–38°C, Thunderstorms likely\n• Hills (Mid): 18–24°C, Rain possible\n• Mountain (N): −4 to 6°C, Heavy snowfall\n\nMonsoon active. Cumulative rainfall 22% above seasonal avg in eastern Nepal.`,
  help:       `Available Commands\n\n• "flood"       — Flood situation report\n• "earthquake"  — Seismic summary\n• "weather"     — Province weather\n• "status"      — System status\n• "help"        — This menu\n\nYou can also click any map marker to query that district automatically.`,
  status:     `System Status — RHIS v4.2\n\n✓ Nepal Map Feed: Online\n✓ Weather API: 28/28 stations active\n✓ Seismic Network: 14 sensors nominal\n✓ Flood Gauges: 31/34 online\n✓ Satellite: 6 hr refresh cycle\n✓ Alert Dispatch: Operational\n\nLast full data sync: 14:32:05 UTC`,
};

// ─── Nav items ────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id:"overview",    icon:"🏠", label:"Overview"      },
  { id:"map",         icon:"🗺", label:"Live Map"       },
  { id:"incidents",   icon:"⚡", label:"Incidents"      },
  { id:"weather",     icon:"🌦", label:"Weather"        },
  { id:"analytics",   icon:"📊", label:"Analytics"      },
  { id:"settings",    icon:"⚙", label:"Settings"       },
];