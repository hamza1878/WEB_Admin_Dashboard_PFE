import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import {
  Car, DollarSign, Ticket, Star, Bell, Settings, Search,
  Download, Moon, Sun, Map, TrendingUp, TrendingDown,
  AlertTriangle, Zap, MoreVertical, Battery, ChevronRight,
  Activity, Users, MapPin, Shield, BarChart2, Cpu,
} from "lucide-react";

// ─── Color tokens (mirroring Flutter AppColors) ──────────────────────────────
const C = {
  primaryPurple: "#A855F7",
  secondaryPurple: "#7C3AED",
  darkBg: "#0B0B0F",
  darkSurface: "#1A1A22",
  darkBorder: "#222228",
  darkText: "#FFFFFF",
  lightBg: "#F4F4F8",
  lightSurface: "#FFFFFF",
  lightBorder: "#E5E7EB",
  lightText: "#121214",
  lightSubtext: "#6B7280",
  iconBgDark: "#2A1A3E",
  iconBgLight: "#F3E8FF",
  gray7B: "#7B7B85",
  grayE6: "#E6E6EA",
  success: "#4CAF50",
  error: "#FF3B30",
  warning: "#FF9500",
};

// ─── Mock data ─────────────────────────────────────────────────────────────
const revenueData = [
  { day: "Mon", revenue: 14200, rides: 1820 },
  { day: "Tue", revenue: 16800, rides: 2140 },
  { day: "Wed", revenue: 21400, rides: 2780 },
  { day: "Thu", revenue: 18900, rides: 2410 },
  { day: "Fri", revenue: 22100, rides: 2960 },
  { day: "Sat", revenue: 28400, rides: 3580 },
  { day: "Sun", revenue: 31200, rides: 3920 },
];

const supportData = [
  { time: "08:00", resolved: 45, pending: 12 },
  { time: "10:00", resolved: 72, pending: 19 },
  { time: "12:00", resolved: 58, pending: 8 },
  { time: "14:00", resolved: 83, pending: 15 },
  { time: "16:00", resolved: 67, pending: 10 },
  { time: "18:00", resolved: 91, pending: 6 },
];

const fleetData = [
  { id: "MOV-4822", status: "ACTIVE",      driver: "Marcus Chen",    location: "Mission District", battery: 82,  lat: 0.38, lng: 0.55 },
  { id: "MOV-9031", status: "EN ROUTE",    driver: "Elena Rodriguez", location: "SOMA",             battery: 45,  lat: 0.52, lng: 0.42 },
  { id: "MOV-2210", status: "MAINTENANCE", driver: null,              location: "Depot North",      battery: 12,  lat: 0.22, lng: 0.68 },
  { id: "MOV-5517", status: "ACTIVE",      driver: "James Park",     location: "Castro",           battery: 94,  lat: 0.65, lng: 0.35 },
  { id: "MOV-3304", status: "EN ROUTE",    driver: "Sofia Diaz",     location: "Tenderloin",       battery: 61,  lat: 0.45, lng: 0.58 },
  { id: "MOV-7729", status: "ACTIVE",      driver: "Amir Hassan",    location: "Nob Hill",         battery: 77,  lat: 0.30, lng: 0.45 },
];

const aiInsights = [
  "Deploy surge incentives in SOMA district for the next 45 minutes to balance demand.",
  "System predicted a 15% increase in weekend evening bookings.",
  "3 drivers approaching shift end in Mission District — pre-position replacements.",
];

const navItems = ["Dashboard", "Live Map", "Revenue", "AI Insights", "Fleet"];

// ─── Helpers ──────────────────────────────────────────────────────────────
function getBatteryColor(pct) {
  if (pct >= 60) return C.success;
  if (pct >= 30) return C.warning;
  return C.error;
}

function getStatusStyle(status) {
  switch (status) {
    case "ACTIVE":      return { bg: "rgba(76,175,80,.12)",    text: C.success };
    case "EN ROUTE":    return { bg: "rgba(168,85,247,.12)",   text: C.primaryPurple };
    case "MAINTENANCE": return { bg: "rgba(255,149,0,.12)",    text: C.warning };
    default:            return { bg: "rgba(123,123,133,.12)",  text: C.gray7B };
  }
}

// ─── Sub-components ────────────────────────────────────────────────────────

function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: dark ? C.darkBorder : C.lightBorder,
        color: dark ? C.darkText : C.lightText,
      }}
    >
      {dark
        ? <Sun size={14} color={C.primaryPurple} />
        : <Moon size={14} color={C.secondaryPurple} />
      }
      <span style={{ fontSize: 12, fontWeight: 500 }}>
        {dark ? "Light" : "Dark"}
      </span>
    </button>
  );
}

function KPICard({ icon: Icon, label, value, delta, deltaUp, dark }) {
  return (
    <div
      className="rounded-xl p-4 border transition-all hover:scale-[1.02]"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: dark ? C.darkBorder : C.lightBorder,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: dark ? C.iconBgDark : C.iconBgLight }}
        >
          <Icon size={17} color={C.primaryPurple} />
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: dark ? C.gray7B : C.lightSubtext,
          }}
        >
          {label}
        </span>
        <span
          className="ml-auto flex items-center gap-0.5"
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: deltaUp ? C.success : C.error,
          }}
        >
          {deltaUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {delta}
        </span>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: dark ? C.darkText : C.lightText,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function HeatMapCanvas({ dark }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth || 600;
    const H = 240;
    canvas.width = W;
    canvas.height = H;

    ctx.fillStyle = dark ? "#0d1117" : "#1a2535";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = dark ? "rgba(168,85,247,.1)" : "rgba(168,85,247,.2)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 24) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Road lines
    ctx.strokeStyle = "rgba(168,85,247,.22)";
    ctx.lineWidth = 1;
    const roads = [
      [0, H * 0.4, W, H * 0.4], [0, H * 0.65, W, H * 0.65],
      [W * 0.25, 0, W * 0.25, H], [W * 0.5, 0, W * 0.5, H],
      [W * 0.75, 0, W * 0.75, H],
    ];
    roads.forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });

    // Hotspots
    const spots = [
      { x: 0.18, y: 0.30, r: 0.20, color: "rgba(255,59,48,.8)" },
      { x: 0.50, y: 0.55, r: 0.15, color: "rgba(255,149,0,.65)" },
      { x: 0.38, y: 0.25, r: 0.11, color: "rgba(255,149,0,.55)" },
      { x: 0.72, y: 0.38, r: 0.09, color: "rgba(75,159,255,.45)" },
      { x: 0.08, y: 0.72, r: 0.08, color: "rgba(255,59,48,.5)" },
      { x: 0.82, y: 0.70, r: 0.08, color: "rgba(75,159,255,.4)" },
      { x: 0.60, y: 0.15, r: 0.09, color: "rgba(255,149,0,.45)" },
      { x: 0.90, y: 0.20, r: 0.07, color: "rgba(75,159,255,.35)" },
    ];
    spots.forEach(({ x, y, r, color }) => {
      const gx = x * W, gy = y * H, gr = r * Math.min(W, H);
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    });

    // Vehicle dots
    fleetData.forEach((v) => {
      const bx = v.lng * W, by = v.lat * H;
      const col =
        v.status === "ACTIVE" ? C.success :
        v.status === "EN ROUTE" ? C.primaryPurple : C.warning;
      ctx.save();
      ctx.shadowColor = col;
      ctx.shadowBlur = 8;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px DM Sans, sans-serif";
      ctx.fillText(v.id.replace("MOV-", ""), bx + 7, by + 3);
    });
  }, [dark]);

  useEffect(() => {
    draw();
    const id = setInterval(draw, 3000);
    return () => clearInterval(id);
  }, [draw]);

  useEffect(() => {
    const ro = new ResizeObserver(draw);
    if (canvasRef.current) ro.observe(canvasRef.current.parentElement);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: 240, display: "block", borderRadius: "0 0 12px 12px" }}
    />
  );
}

function CustomTooltip({ active, payload, label, dark, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-lg"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: dark ? C.darkBorder : C.lightBorder,
        fontSize: 12,
      }}
    >
      <p style={{ color: dark ? C.gray7B : C.lightSubtext, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

function NavBar({ dark, onToggle, activeNav, setActiveNav }) {
  return (
    <nav
      className="flex items-center gap-1 px-5 h-14 border-b sticky top-0 z-20"
      style={{
        background: dark ? "rgba(11,11,15,.92)" : "rgba(244,244,248,.92)",
        borderColor: dark ? C.darkBorder : C.lightBorder,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <span
        className="mr-4 font-bold text-sm tracking-tight"
        style={{
          background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Analytics Pro
      </span>

      {/* Nav links */}
      {navItems.map((item) => (
        <button
          key={item}
          onClick={() => setActiveNav(item)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: activeNav === item
              ? dark ? C.iconBgDark : C.iconBgLight
              : "transparent",
            color: activeNav === item
              ? C.primaryPurple
              : dark ? C.gray7B : C.lightSubtext,
          }}
        >
          {item}
        </button>
      ))}

      {/* Search */}
      <div
        className="ml-4 flex items-center gap-2 px-3 h-8 rounded-lg border flex-1 max-w-[220px]"
        style={{
          background: dark ? C.darkBorder : C.grayE6,
          borderColor: dark ? C.darkBorder : C.lightBorder,
        }}
      >
        <Search size={13} color={dark ? C.gray7B : C.lightSubtext} />
        <input
          placeholder="Search analytics…"
          className="bg-transparent outline-none text-xs w-full"
          style={{ color: dark ? C.darkText : C.lightText }}
        />
      </div>

      {/* Right icons */}
      <div className="ml-auto flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-lg border flex items-center justify-center relative"
          style={{
            background: dark ? C.darkSurface : C.lightSurface,
            borderColor: dark ? C.darkBorder : C.lightBorder,
          }}
        >
          <Bell size={15} color={dark ? C.gray7B : C.lightSubtext} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: C.error }}
          />
        </button>
        <button
          className="w-8 h-8 rounded-lg border flex items-center justify-center"
          style={{
            background: dark ? C.darkSurface : C.lightSurface,
            borderColor: dark ? C.darkBorder : C.lightBorder,
          }}
        >
          <Settings size={15} color={dark ? C.gray7B : C.lightSubtext} />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})`, color: "#fff" }}
        >
          M
        </div>
        <ThemeToggle dark={dark} onToggle={onToggle} />
      </div>
    </nav>
  );
}

function IssuesPanel({ dark }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: dark ? C.darkBorder : C.lightBorder,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 13, fontWeight: 600, color: dark ? C.darkText : C.lightText }}>
          Critical Issues
        </span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded"
          style={{ background: C.error, color: "#fff", fontSize: 10 }}
        >
          2 NEW
        </span>
      </div>

      <div
        className="rounded-lg p-3 mb-2"
        style={{
          background: "rgba(255,59,48,.06)",
          border: `1px solid rgba(255,59,48,.2)`,
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle size={13} color={C.error} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.error }}>Payment Spike</span>
        </div>
        <p style={{ fontSize: 11, color: dark ? C.gray7B : C.lightSubtext, lineHeight: 1.5 }}>
          Abnormal failure rate in Region 4 (Stripe API Latency).
        </p>
      </div>

      <div
        className="rounded-lg p-3"
        style={{
          background: "rgba(255,149,0,.06)",
          border: `1px solid rgba(255,149,0,.2)`,
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <MapPin size={13} color={C.warning} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.warning }}>Low Driver Density</span>
        </div>
        <p style={{ fontSize: 11, color: dark ? C.gray7B : C.lightSubtext, lineHeight: 1.5 }}>
          E. Market st. average wait time increased to 12 mins.
        </p>
      </div>
    </div>
  );
}

function AIStrategyPanel({ dark }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: `linear-gradient(135deg, ${C.secondaryPurple}, ${C.primaryPurple})`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Cpu size={16} color="rgba(255,255,255,.9)" />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>AI Strategy</span>
      </div>
      {aiInsights.map((insight, i) => (
        <p
          key={i}
          className="mb-2 pl-3 italic"
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,.85)",
            borderLeft: "2px solid rgba(255,255,255,.3)",
            lineHeight: 1.6,
          }}
        >
          "{insight}"
        </p>
      ))}
      <button
        className="w-full mt-2 py-2 rounded-lg font-semibold transition-all hover:bg-white/20"
        style={{
          background: "rgba(255,255,255,.12)",
          border: "1px solid rgba(255,255,255,.2)",
          color: "#fff",
          fontSize: 12,
        }}
      >
        View Full Analysis →
      </button>
    </div>
  );
}

function FleetTable({ dark, showAll, setShowAll }) {
  const rows = showAll ? fleetData : fleetData.slice(0, 3);

  return (
    <div
      className="rounded-xl border"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: dark ? C.darkBorder : C.lightBorder,
      }}
    >
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13, fontWeight: 600, color: dark ? C.darkText : C.lightText }}>
            Fleet Monitoring
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.primaryPurple }}>1,204 Units</span>
        </div>
        <button
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: C.primaryPurple }}
        >
          View Detailed Fleet <ChevronRight size={12} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${dark ? C.darkBorder : C.lightBorder}` }}>
              {["Vehicle ID", "Status", "Driver", "Location", "Battery/Fuel", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "6px 12px 8px",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: dark ? C.gray7B : C.lightSubtext,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((v, i) => {
              const { bg, text } = getStatusStyle(v.status);
              const batColor = getBatteryColor(v.battery);
              return (
                <tr
                  key={v.id}
                  style={{
                    borderBottom: i < rows.length - 1
                      ? `1px solid ${dark ? C.darkBorder : C.lightBorder}`
                      : "none",
                    transition: "background .15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = dark ? "rgba(168,85,247,.04)" : "rgba(168,85,247,.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: 11,
                        fontWeight: 500,
                        color: C.primaryPurple,
                      }}
                    >
                      {v.id}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: bg,
                        color: text,
                      }}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: v.driver ? (dark ? C.darkText : C.lightText) : (dark ? C.gray7B : C.lightSubtext),
                      fontStyle: v.driver ? "normal" : "italic",
                    }}
                  >
                    {v.driver ?? "Unassigned"}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: dark ? C.gray7B : C.lightSubtext,
                    }}
                  >
                    {v.location}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div
                      style={{
                        width: 80,
                        height: 5,
                        borderRadius: 3,
                        background: dark ? C.darkBorder : C.grayE6,
                        overflow: "hidden",
                        marginBottom: 3,
                      }}
                    >
                      <div
                        style={{
                          width: `${v.battery}%`,
                          height: "100%",
                          background: batColor,
                          borderRadius: 3,
                          transition: "width .6s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: batColor }}>
                      {v.battery}%
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <button style={{ color: dark ? C.gray7B : C.lightSubtext, background: "none", border: "none", cursor: "pointer" }}>
                      <MoreVertical size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setShowAll((p) => !p)}
        className="w-full py-3 border-t text-xs font-semibold tracking-widest uppercase transition-colors"
        style={{
          borderColor: dark ? C.darkBorder : C.lightBorder,
          color: dark ? C.gray7B : C.lightSubtext,
          background: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.primaryPurple)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = dark ? C.gray7B : C.lightSubtext)
        }
      >
        {showAll ? "Show Less" : "See All Vehicles"}
      </button>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function AnalyticsPro() {
  const [dark, setDark] = useState(true);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [showAll, setShowAll] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const bg = dark ? C.darkBg : C.lightBg;
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border = dark ? C.darkBorder : C.lightBorder;
  const text = dark ? C.darkText : C.lightText;
  const sub = dark ? C.gray7B : C.lightSubtext;
  const gridColor = dark ? "rgba(34,34,40,.7)" : "rgba(229,231,235,.8)";
  const tickColor = dark ? C.gray7B : C.lightSubtext;

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
      <NavBar
        dark={dark}
        onToggle={() => setDark((d) => !d)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Page header */}
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

        {/* KPI grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
          <KPICard dark={dark} icon={Car}        label="Total Rides"      value="14,282"   delta="+12.5%" deltaUp />
          <KPICard dark={dark} icon={DollarSign} label="Revenue (USD)"    value="$128,402" delta="+8.2%"  deltaUp />
          <KPICard dark={dark} icon={Ticket}     label="Support Tickets"  value="242"      delta="-4.1%"  deltaUp={false} />
          <KPICard dark={dark} icon={Star}       label="Satisfaction Rate" value="4.82/5"  delta="+0.2"   deltaUp />
        </div>

        {/* Map + right column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
          {/* Map */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: surface, borderColor: border }}
          >
            <div className="flex items-center gap-2 p-3 px-4">
              <Map size={14} color={C.primaryPurple} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>City Demand Density</span>
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
                  { label: "High", color: C.error },
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

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <IssuesPanel dark={dark} />
            <AIStrategyPanel dark={dark} />
          </div>
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Revenue line chart */}
          <div
            className="rounded-xl border p-4"
            style={{ background: surface, borderColor: border }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>Revenue Trends</p>
                <p style={{ fontSize: 11, color: sub, marginTop: 1 }}>
                  Daily gross revenue across all sectors
                </p>
              </div>
              <select
                className="text-xs rounded-lg border px-2 py-1"
                style={{ background: dark ? C.darkBorder : C.grayE6, borderColor: border, color: text, fontFamily: "inherit" }}
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.primaryPurple} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={C.primaryPurple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip dark={dark} prefix="$" />} />
                <Area
                  type="monotone" dataKey="revenue" name="Revenue"
                  stroke={C.primaryPurple} strokeWidth={2.5}
                  fill="url(#revGrad)" dot={{ fill: C.primaryPurple, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Support bar chart */}
          <div
            className="rounded-xl border p-4"
            style={{ background: surface, borderColor: border }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>Support Resolution</p>
                <p style={{ fontSize: 11, color: sub, marginTop: 1 }}>
                  Response efficiency by hourly block
                </p>
              </div>
              <div className="flex gap-3">
                {[
                  { label: "Resolved", color: C.primaryPurple },
                  { label: "Pending",  color: "rgba(168,85,247,.35)" },
                ].map(({ label, color }) => (
                  <span key={label} className="flex items-center gap-1" style={{ fontSize: 11, color: sub }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={supportData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="time" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip dark={dark} />} />
                <Bar dataKey="resolved" name="Resolved" fill={C.primaryPurple} radius={[3, 3, 0, 0]} />
                <Bar dataKey="pending"  name="Pending"  fill="rgba(168,85,247,.35)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
          {[
            { icon: Activity, label: "Avg Trip Duration",  value: "18.4 min", delta: "-2.1 min",  up: true  },
            { icon: Users,    label: "Active Drivers",     value: "847",       delta: "+34",        up: true  },
            { icon: Shield,   label: "Safety Score",       value: "97.2%",     delta: "+0.8%",      up: true  },
            { icon: BarChart2,label: "Utilization Rate",   value: "73.5%",     delta: "-1.2%",      up: false },
          ].map(({ icon: Icon, label, value, delta, up }) => (
            <div
              key={label}
              className="rounded-xl border p-3"
              style={{ background: surface, borderColor: border }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: dark ? C.iconBgDark : C.iconBgLight }}
                >
                  <Icon size={14} color={C.primaryPurple} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: sub }}>
                  {label}
                </span>
              </div>
              <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>{value}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: up ? C.success : C.error, marginTop: 2 }}>
                {up ? "↑" : "↓"} {delta} vs yesterday
              </p>
            </div>
          ))}
        </div>

        {/* Fleet table */}
        <FleetTable dark={dark} showAll={showAll} setShowAll={setShowAll} />
      </div>

      {/* Footer */}
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
