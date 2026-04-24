// import { useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "sonner";
// import { AuthProvider } from "./contexts/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import LoginWithIntro from "./auth/LoginWithIntro";
// import VerifyEmailChange from "./auth/VerifyEmailChange";
// import Shell from "./routes/ShellRoutes";

// import { INITIAL_VEHICLES } from "./Dashboard/Vehicles/Vehiclespage";
// import type { Vehicle } from "./Dashboard/Vehicles/Vehiclespage";

// import "./App.css";
// import "./Dashboard/travelsync-design-system.css";

// export default function App() {
//   const [dark, setDark] = useState(() => localStorage.getItem("dark") === "true");

//   // ── Vehicles
//   const [vehicles,    setVehicles]    = useState<Vehicle[]>(INITIAL_VEHICLES);
//   const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

//   function toggleDark() {
//     const next = !dark;
//     setDark(next);
//     localStorage.setItem("dark", String(next));
//     document.documentElement.classList.toggle("dark", next);
//   }

//   return (
//     <BrowserRouter>
//       <Toaster richColors position="top-right" />
//       <AuthProvider>
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="/login" element={<LoginWithIntro />} />
//           <Route path="/verify-email-change" element={<VerifyEmailChange />} />

//           <Route
//             path="/dashboard/*"
//             element={
//               <ProtectedRoute>
//                 <Shell
//                   dark={dark}
//                   onToggleDark={toggleDark}
//                   vehicles={vehicles}
//                   setVehicles={setVehicles}
//                   editVehicle={editVehicle}
//                   setEditVehicle={setEditVehicle}
//                 />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }
import { useState, useEffect } from "react";
import { Car, DollarSign, Ticket, Star, Download, Map } from "lucide-react";
import { C } from "./DataDash/tokens";
import { NavBar } from "./DataDash/NavBar";
import { KPICard } from "./DataDash/KPICard";
import { HeatMapCanvas } from "./DataDash/HeatMapCanvas";
import { RevenueChart } from "./DataDash/RevenueChart";
import { SupportChart } from "./DataDash/SupportChart";
import { StatsStrip } from "./DataDash/StatsStrip";
import { FleetTable } from "./DataDash/FleetTable";
import { AIStrategyPanel } from "./DataDash/AIStrategyPanel";
import { IssuesPanel } from "./DataDash/IssuesPanel";
import { LiveMapPage } from "./DataDash/Livemappage";
import { AIInsightsPage } from "./DataDash/Aiinsightspage";


export default function App() {
  const [dark, setDark] = useState<boolean>(true);
  const [activeNav, setActiveNav] = useState<string>("Dashboard");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [liveTime, setLiveTime] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const bg      = dark ? C.darkBg      : C.lightBg;
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border  = dark ? C.darkBorder  : C.lightBorder;
  const text    = dark ? C.darkText    : C.lightText;
  const sub     = dark ? C.gray7B      : C.lightSubtext;

  return (
    <div
      style={{
        background: bg,
        color: text,
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        transition: "background .25s, color .25s",
      }}
    >
      {/* ── Navigation ──────────────────────────────────────────── */}
      <NavBar
        dark={dark}
        onToggle={() => setDark((d) => !d)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* ── Page routing ────────────────────────────────────────── */}
      {activeNav === "Live Map" && (
        <div style={{ padding: "20px 24px" }}>
          <LiveMapPage dark={dark} />
        </div>
      )}

      {activeNav === "AI Insights" && (
        <div style={{ padding: "20px 24px" }}>
          <AIInsightsPage dark={dark} />
        </div>
      )}

      {(activeNav === "Dashboard" || activeNav === "Revenue" || activeNav === "Fleet") && (
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>
              Mobility OS Overview
            </h1>
            <p style={{ fontSize: 12, color: sub, marginTop: 2 }}>
              Real-time performance metrics and demand intelligence
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <span style={{ fontSize: 11, color: sub }}>
              {liveTime.toLocaleTimeString()}
            </span>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
              style={{ background: surface, borderColor: border, color: text }}
            >
              📅 Last 24 Hours
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{
                background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`,
                border: "none",
              }}
            >
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        {/* ── KPI Grid ────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
          <KPICard dark={dark} icon={Car}        label="Total Rides"       value="14,282"   delta="+12.5%" deltaUp />
          <KPICard dark={dark} icon={DollarSign} label="Revenue (USD)"     value="$128,402" delta="+8.2%"  deltaUp />
          <KPICard dark={dark} icon={Ticket}     label="Support Tickets"   value="242"      delta="-4.1%"  deltaUp={false} />
          <KPICard dark={dark} icon={Star}       label="Satisfaction Rate" value="4.82/5"   delta="+0.2"   deltaUp />
        </div>

        {/* ── Map + Right column ──────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
          {/* Live Heatmap */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: surface, borderColor: border }}
          >
            <div className="flex items-center gap-2 p-3 px-4">
              <Map size={14} color={C.primaryPurple} />
              <span style={{ fontSize: 13, fontWeight: 600, color: text }}>
                City Demand Density
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded animate-pulse"
                style={{ background: C.error, color: "#fff", fontSize: 10 }}
              >
                LIVE
              </span>
              <div className="ml-auto flex gap-3">
                {[
                  { label: "Low",  color: "#4B9FFF" },
                  { label: "Med",  color: C.warning },
                  { label: "High", color: C.error   },
                ].map(({ label, color }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1"
                    style={{ fontSize: 11, color: sub }}
                  >
                    <span
                      style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: color, display: "inline-block",
                      }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <HeatMapCanvas dark={dark} />
          </div>

          {/* Issues + AI */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <IssuesPanel dark={dark} />
            <AIStrategyPanel dark={dark} />
          </div>
        </div>

        {/* ── Charts Row ──────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <RevenueChart dark={dark} />
          <SupportChart dark={dark} />
        </div>

        {/* ── Stats Strip ─────────────────────────────────────────── */}
        <StatsStrip dark={dark} />

        {/* ── Fleet Table ─────────────────────────────────────────── */}
        <FleetTable dark={dark} showAll={showAll} setShowAll={setShowAll} />
      </div>
      )} {/* end Dashboard/Revenue/Fleet conditional */}

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        className="flex items-center justify-between px-6 py-4 border-t text-xs"
        style={{ borderColor: border, color: sub }}
      >
        <span>Analytics Pro &nbsp;·&nbsp; © 2024 Mobility OS Global</span>
        <div className="flex gap-5">
          {["Privacy Policy", "System Status", "Documentation", "Support"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ color: sub, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.primaryPurple)}
              onMouseLeave={(e) => (e.currentTarget.style.color = sub)}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}