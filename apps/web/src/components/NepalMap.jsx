import { useEffect, useRef, useState } from "react";
function ensureLeaflet(cb) {
  if (window.L) { cb(); return; }
  if (!document.getElementById("leaflet-css")) {
    const l = document.createElement("link");
    l.id = "leaflet-css"; l.rel = "stylesheet";
    l.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(l);
  }
  if (!document.getElementById("leaflet-js")) {
    const s = document.createElement("script");
    s.id = "leaflet-js";
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    s.onload = cb; document.head.appendChild(s);
  } else {
    const poll = setInterval(() => { if (window.L) { clearInterval(poll); cb(); } }, 80);
  }
}

const NEPAL_BOUNDS = [
  [26.25, 80.05], // Southwest
  [30.55, 88.25], // Northeast
];

export const PROVINCES = [
  { id:"koshi", name:"Koshi", center:[27.0, 87.3], zoom:9, color:"#E24B4A",
    districts:["Taplejung","Panchthar","Ilam","Dhankuta","Terhathum","Sankhuwasabha","Bhojpur","Solukhumbu","Okhaldhunga","Khotang","Udayapur","Saptari","Siraha","Morang","Sunsari"] },
  { id:"madhesh", name:"Madhesh", center:[26.7, 85.9], zoom:9, color:"#EF9F27",
    districts:["Sarlahi","Rautahat","Bara","Parsa","Dhanusha","Mahottari","Siraha","Saptari"] },
  { id:"bagmati", name:"Bagmati", center:[27.7, 85.5], zoom:9, color:"#378ADD",
    districts:["Kathmandu","Bhaktapur","Lalitpur","Kavrepalanchok","Sindhupalchok","Dolakha","Ramechhap","Sindhuli","Makwanpur","Chitwan","Nuwakot","Rasuwa","Dhading"] },
  { id:"gandaki", name:"Gandaki", center:[28.3, 84.0], zoom:9, color:"#1D9E75",
    districts:["Kaski","Tanahun","Syangja","Parbat","Baglung","Myagdi","Mustang","Manang","Lamjung","Gorkha","Nawalpur","Nawalparasi"] },
  { id:"lumbini", name:"Lumbini", center:[27.7, 83.3], zoom:9, color:"#BA7517",
    districts:["Rupandehi","Kapilvastu","Nawalparasi West","Arghakhanchi","Gulmi","Palpa","Pyuthan","Rolpa","Rukum East","Banke","Bardiya","Dang"] },
  { id:"karnali", name:"Karnali", center:[29.1, 82.3], zoom:8, color:"#5B6DD4",
    districts:["Surkhet","Dailekh","Jajarkot","Dolpa","Jumla","Kalikot","Mugu","Humla","Rukum West","Salyan"] },
  { id:"sudurpashchim", name:"Sudurpashchim", center:[29.1, 80.8], zoom:8, color:"#9C58C0",
    districts:["Kailali","Kanchanpur","Dadeldhura","Doti","Achham","Bajura","Bajhang","Darchula","Baitadi"] },
];

function ProvinceSelector({ selectedProvince, setSelectedProvince }) {
  return (
    <div style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      background: "rgba(255, 255, 255, 0.92)",
      padding: "10px 12px",
      borderRadius: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      backdropFilter: "blur(6px)",
      minWidth: "130px",
    }}>
      <button
        onClick={() => setSelectedProvince(null)}
        style={{
          padding: "5px 14px",
          borderRadius: "20px",
          border: selectedProvince === null ? "2px solid #2c3e50" : "1px solid #d0d7e0",
          background: selectedProvince === null ? "#2c3e50" : "white",
          color: selectedProvince === null ? "white" : "#2c3e50",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: "600",
          fontFamily: "inherit",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
      >
        🇳🇵 All Nepal
      </button>
      {PROVINCES.map(p => (
        <button
          key={p.id}
          onClick={() => setSelectedProvince(p.id === selectedProvince ? null : p.id)}
          style={{
            padding: "5px 14px",
            borderRadius: "20px",
            border: selectedProvince === p.id ? `2px solid ${p.color}` : "1px solid #d0d7e0",
            background: selectedProvince === p.id ? p.color : "white",
            color: selectedProvince === p.id ? "white" : "#2c3e50",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}

function LeafletMap({ center, zoom, markers, onDistrictClick, selectedProvince, selectedDistrict }) {
  const ref     = useRef(null);
  const mapRef  = useRef(null);
  const mRef    = useRef({});

  useEffect(() => {
    ensureLeaflet(() => {
      if (mapRef.current) return;
      const L = window.L;

      const map = L.map(ref.current, {
        center,
        zoom,
        zoomControl: true,
        maxBounds: NEPAL_BOUNDS,
        maxBoundsViscosity: 1.0,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap contributors",
        noWrap: true,
      }).addTo(map);

      mapRef.current = map;
      refreshMarkers(L, map, markers, onDistrictClick, selectedProvince, selectedDistrict);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        mRef.current = {};
      }
    };
   
  }, []);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;
    Object.values(mRef.current).forEach(m => m.remove());
    mRef.current = {};
    refreshMarkers(L, mapRef.current, markers, onDistrictClick, selectedProvince, selectedDistrict);
  }, [markers, selectedProvince, selectedDistrict]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (selectedDistrict) {
      const prov = PROVINCES.find(p => p.districts.includes(selectedDistrict));
      if (prov) mapRef.current.flyTo(prov.center, prov.zoom + 1, { duration: 0.8 });
    } else if (selectedProvince) {
      const prov = PROVINCES.find(p => p.id === selectedProvince);
      if (prov) mapRef.current.flyTo(prov.center, prov.zoom, { duration: 0.8 });
    } else {
      mapRef.current.flyTo([28.3, 84.1], 7, { duration: 0.8 });
    }
  }, [selectedProvince, selectedDistrict]);

  function refreshMarkers(L, map, markers, onClick, selProv, selDist) {
    markers.forEach(m => {
      const isSelected = selDist ? m.name === selDist : (selProv ? m.provinceId === selProv : false);
      const size = isSelected ? 22 : 14;

      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${m.hazardColor};
          border:${isSelected ? "3px" : "2px"} solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const mk = L.marker([m.lat, m.lng], { icon });
      mk.bindTooltip(`<b>${m.name}</b>`, { direction: "top", offset: [0, -8] });
      mk.on("click", () => onClick(m.name));
      mk.addTo(map);
      mRef.current[m.name] = mk;
    });
  }

  return <div ref={ref} style={{ width: "100%", height: "100%", position: "relative" }} />;
}


export default function NepalMap({ hazards, selectedId, onSelect }) {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const province = PROVINCES.find(p => p.id === selectedProvince);

 
  const markers = [];
  
  if (selectedProvince) {
   
    const prov = PROVINCES.find(p => p.id === selectedProvince);
    if (prov) {
     
      prov.districts.forEach((d, index) => {
        const hazard = hazards.find(h => h.name === d);
        const baseLat = prov.center[0] + (Math.random() * 0.6 - 0.3);
        const baseLng = prov.center[1] + (Math.random() * 0.6 - 0.3);
        
        markers.push({
          name: d,
          provinceId: prov.id,
          lat: hazard?.lat || baseLat,
          lng: hazard?.lng || baseLng,
          hazardColor: hazard?.color || prov.color,
        });
      });
    }
  } else {
  
    if (hazards && hazards.length > 0) {
      hazards.forEach(h => {
        markers.push({
          name: h.name,
          lat: h.lat,
          lng: h.lng,
          hazardColor: h.color || "#378ADD",
        });
      });
    } else {
      
      PROVINCES.forEach(p => {
        markers.push({
          name: p.name,
          provinceId: p.id,
          lat: p.center[0],
          lng: p.center[1],
          hazardColor: p.color,
        });
      });
    }
  }

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <LeafletMap
        center={province ? province.center : [28.3, 84.1]}
        zoom={province ? province.zoom : 7}
        markers={markers}
        onDistrictClick={(n) => {
          setSelectedDistrict(n);
          if (onSelect) onSelect(n);
        }}
        selectedProvince={selectedProvince}
        selectedDistrict={selectedDistrict}
      />
      
      
      <ProvinceSelector 
        selectedProvince={selectedProvince} 
        setSelectedProvince={setSelectedProvince} 
      />
      
      
      <div style={{
        position: "absolute",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.95)",
        padding: "10px 20px",
        borderRadius: "10px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        fontSize: "13px",
        color: "#2c3e50",
        textAlign: "center",
        maxWidth: "90%"
      }}>
        {selectedProvince ? (
          <>
            <strong style={{ color: PROVINCES.find(p => p.id === selectedProvince)?.color }}>
              {PROVINCES.find(p => p.id === selectedProvince)?.name}
            </strong>
            {" · "}
            {PROVINCES.find(p => p.id === selectedProvince)?.districts.length} districts
            {selectedDistrict && ` · Selected: ${selectedDistrict}`}
          </>
        ) : (
          "Click a province button above to explore districts"
        )}
      </div>
    </div>
  );
}