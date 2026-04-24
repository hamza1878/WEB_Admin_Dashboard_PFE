import { useState, useEffect, useRef, useCallback } from "react";
import {
  Navigation, Wifi, WifiOff, Search, Filter, ChevronDown,
  LocateFixed, Layers, Minus, Plus, Radio, Clock,
  AlertCircle, CheckCircle2, Truck, Star, Phone,
  MessageSquare, X, Battery, ArrowUpRight,
} from "lucide-react";
import { C } from "./tokens";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Driver {
  id: string;
  name: string;
  avatar: string;
  status: "ACTIVE" | "EN ROUTE" | "IDLE" | "OFFLINE";
  lat: number;
  lng: number;
  speed: number;
  battery: number;
  rating: number;
  trips: number;
  eta?: string;
  destination?: string;
  bearing: number;
}

interface MapEvent {
  id: string;
  type: "surge" | "incident" | "hotspot";
  lat: number;
  lng: number;
  label: string;
  radius: number;
}

// ─── Mock live data ─────────────────────────────────────────────────────────

const INITIAL_DRIVERS: Driver[] = [
  { id: "D001", name: "Marcus Chen",     avatar: "MC", status: "EN ROUTE",  lat: 0.28, lng: 0.22, speed: 42, battery: 82, rating: 4.9, trips: 1204, eta: "4 min",  destination: "Union Square",    bearing: 45  },
  { id: "D002", name: "Elena Rodriguez", avatar: "ER", status: "ACTIVE",    lat: 0.45, lng: 0.48, speed: 0,  battery: 61, rating: 4.7, trips: 876,  eta: undefined, destination: undefined,         bearing: 120 },
  { id: "D003", name: "James Park",      avatar: "JP", status: "EN ROUTE",  lat: 0.62, lng: 0.35, speed: 38, battery: 94, rating: 4.8, trips: 2341, eta: "8 min",  destination: "SFO Terminal 2",  bearing: 200 },
  { id: "D004", name: "Sofia Diaz",      avatar: "SD", status: "IDLE",      lat: 0.38, lng: 0.65, speed: 0,  battery: 45, rating: 4.6, trips: 654,  eta: undefined, destination: undefined,         bearing: 90  },
  { id: "D005", name: "Amir Hassan",     avatar: "AH", status: "EN ROUTE",  lat: 0.72, lng: 0.58, speed: 55, battery: 77, rating: 4.9, trips: 3102, eta: "2 min",  destination: "Caltrain Station",bearing: 315 },
  { id: "D006", name: "Priya Nair",      avatar: "PN", status: "ACTIVE",    lat: 0.18, lng: 0.72, speed: 0,  battery: 33, rating: 4.5, trips: 421,  eta: undefined, destination: undefined,         bearing: 270 },
  { id: "D007", name: "Carlos Vega",     avatar: "CV", status: "OFFLINE",   lat: 0.55, lng: 0.18, speed: 0,  battery: 12, rating: 4.3, trips: 289,  eta: undefined, destination: undefined,         bearing: 0   },
  { id: "D008", name: "Yuki Tanaka",     avatar: "YT", status: "EN ROUTE",  lat: 0.82, lng: 0.42, speed: 31, battery: 88, rating: 4.8, trips: 1567, eta: "6 min",  destination: "Castro District", bearing: 160 },
];

const MAP_EVENTS: MapEvent[] = [
  { id: "E1", type: "surge",    lat: 0.25, lng: 0.30, label: "2.4× Surge",   radius: 0.09 },
  { id: "E2", type: "hotspot",  lat: 0.55, lng: 0.55, label: "High Demand",  radius: 0.07 },
  { id: "E3", type: "incident", lat: 0.42, lng: 0.22, label: "Road Closure", radius: 0.05 },
  { id: "E4", type: "surge",    lat: 0.75, lng: 0.65, label: "1.8× Surge",   radius: 0.06 },
];

const STATUS_CONFIG = {
  ACTIVE:   { color: C.success,       label: "Available",  pulse: true  },
  EN_ROUTE: { color: C.primaryPurple, label: "En Route",   pulse: true  },
  "EN ROUTE": { color: C.primaryPurple, label: "En Route", pulse: true  },
  IDLE:     { color: C.warning,       label: "Idle",       pulse: false },
  OFFLINE:  { color: C.gray7B,        label: "Offline",    pulse: false },
};

function getStatusCfg(s: string) {
  return STATUS_CONFIG[s as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.OFFLINE;
}

// ─── Canvas Map ─────────────────────────────────────────────────────────────

function LiveMapCanvas({
  drivers,
  selectedId,
  onSelect,
}: {
  drivers: Driver[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrame = useRef<number>(0);
  const pulseRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    pulseRef.current = (pulseRef.current + 0.03) % (Math.PI * 2);
    const pulse = pulseRef.current;

    // ── Background ───────────────────────────────────────────────
    ctx.fillStyle = "#080C14";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(168,85,247,.07)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // ── Road network ─────────────────────────────────────────────
    const roads = [
      // Horizontal arterials
      { x1: 0, y1: H * 0.20, x2: W, y2: H * 0.20, w: 2 },
      { x1: 0, y1: H * 0.38, x2: W, y2: H * 0.38, w: 3 },
      { x1: 0, y1: H * 0.55, x2: W, y2: H * 0.55, w: 2 },
      { x1: 0, y1: H * 0.72, x2: W, y2: H * 0.72, w: 3 },
      { x1: 0, y1: H * 0.88, x2: W, y2: H * 0.88, w: 1.5 },
      // Vertical arterials
      { x1: W * 0.15, y1: 0, x2: W * 0.15, y2: H, w: 1.5 },
      { x1: W * 0.32, y1: 0, x2: W * 0.32, y2: H, w: 3 },
      { x1: W * 0.52, y1: 0, x2: W * 0.52, y2: H, w: 2 },
      { x1: W * 0.70, y1: 0, x2: W * 0.70, y2: H, w: 3 },
      { x1: W * 0.85, y1: 0, x2: W * 0.85, y2: H, w: 1.5 },
      // Diagonal
      { x1: 0, y1: H * 0.6, x2: W * 0.45, y2: 0, w: 2 },
      { x1: W * 0.3, y1: H, x2: W, y2: H * 0.1, w: 2 },
    ];
    roads.forEach(({ x1, y1, x2, y2, w }) => {
      ctx.strokeStyle = "rgba(100,120,160,.22)";
      ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      // Road glow
      ctx.strokeStyle = "rgba(168,85,247,.06)";
      ctx.lineWidth = w + 4;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });

    // ── City blocks (fill between roads) ─────────────────────────
    const blocks = [
      [W * 0.15, H * 0.20, W * 0.17, H * 0.18],
      [W * 0.32, H * 0.38, W * 0.20, H * 0.17],
      [W * 0.52, H * 0.20, W * 0.18, H * 0.18],
      [W * 0.70, H * 0.38, W * 0.15, H * 0.17],
      [W * 0.15, H * 0.55, W * 0.17, H * 0.17],
      [W * 0.32, H * 0.55, W * 0.20, H * 0.17],
      [W * 0.52, H * 0.55, W * 0.18, H * 0.17],
      [W * 0.70, H * 0.55, W * 0.15, H * 0.17],
    ];
    blocks.forEach(([x, y, w, h]) => {
      ctx.fillStyle = "rgba(20,30,50,.6)";
      ctx.fillRect(x, y, w, h);
    });

    // ── Map events (surge / hotspot / incident) ───────────────────
    MAP_EVENTS.forEach((ev) => {
      const ex = ev.lng * W, ey = ev.lat * H;
      const er = ev.radius * Math.min(W, H);
      const animR = er + Math.sin(pulse) * 8;

      const colors = {
        surge:    { core: "rgba(255,149,0,.25)",  ring: "rgba(255,149,0,.6)"  },
        hotspot:  { core: "rgba(168,85,247,.2)",  ring: "rgba(168,85,247,.5)" },
        incident: { core: "rgba(255,59,48,.2)",   ring: "rgba(255,59,48,.6)"  },
      };
      const col = colors[ev.type];

      // Animated ring
      ctx.strokeStyle = col.ring;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5 + Math.sin(pulse) * 0.5;
      ctx.beginPath(); ctx.arc(ex, ey, animR, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;

      // Fill
      const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, er);
      g.addColorStop(0, col.core);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();

      // Label
      ctx.fillStyle = col.ring;
      ctx.font = "bold 10px 'DM Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(ev.label, ex, ey - er - 6);
    });

    // ── Driver markers ────────────────────────────────────────────
    drivers.forEach((d) => {
      const dx = d.lng * W, dy = d.lat * H;
      const cfg = getStatusCfg(d.status);
      const isSelected = d.id === selectedId;
      const isOffline = d.status === "OFFLINE";

      // Pulse ring for active drivers
      if (cfg.pulse && !isOffline) {
        const pR = isSelected ? 22 : 16;
        const pAlpha = 0.3 + Math.sin(pulse + d.lat * 10) * 0.2;
        ctx.strokeStyle = cfg.color;
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.globalAlpha = pAlpha;
        ctx.beginPath(); ctx.arc(dx, dy, pR + Math.sin(pulse) * 3, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.arc(dx, dy, 18, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Direction arrow (if moving)
      if (d.speed > 0) {
        const rad = (d.bearing * Math.PI) / 180;
        const arrowLen = 22;
        const ax = dx + Math.sin(rad) * arrowLen;
        const ay = dy - Math.cos(rad) * arrowLen;
        ctx.strokeStyle = cfg.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(ax, ay); ctx.stroke();
        // Arrowhead
        ctx.fillStyle = cfg.color;
        ctx.beginPath();
        ctx.arc(ax, ay, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Outer glow
      ctx.shadowColor = cfg.color;
      ctx.shadowBlur = isSelected ? 20 : 10;

      // Main dot
      ctx.fillStyle = isOffline ? "#2a2a35" : cfg.color;
      ctx.beginPath(); ctx.arc(dx, dy, isSelected ? 10 : 8, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // Inner icon (initials)
      ctx.fillStyle = isOffline ? C.gray7B : "#fff";
      ctx.font = `bold ${isSelected ? 7 : 6}px 'DM Sans', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(d.avatar[0], dx, dy);
      ctx.textBaseline = "alphabetic";
    });

    animFrame.current = requestAnimationFrame(draw);
  }, [drivers, selectedId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    animFrame.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrame.current);
      ro.disconnect();
    };
  }, [draw]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);

      let closest: Driver | null = null;
      let minDist = 30;
      drivers.forEach((d) => {
        const dx = d.lng * canvas.width - mx;
        const dy = d.lat * canvas.height - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) { minDist = dist; closest = d; }
      });
      if (closest) onSelect((closest as Driver).id);
    },
    [drivers, onSelect]
  );

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{ width: "100%", height: "100%", display: "block", cursor: "crosshair" }}
    />
  );
}

// ─── Driver Card (sidebar) ──────────────────────────────────────────────────

function DriverCard({
  driver,
  selected,
  onClick,
  dark,
}: {
  driver: Driver;
  selected: boolean;
  onClick: () => void;
  dark: boolean;
}) {
  const cfg = getStatusCfg(driver.status);

  return (
    <div
      onClick={onClick}
      className="rounded-xl border p-3 cursor-pointer transition-all"
      style={{
        background: selected
          ? dark ? "rgba(168,85,247,.12)" : "rgba(168,85,247,.08)"
          : dark ? C.darkSurface : C.lightSurface,
        borderColor: selected ? C.primaryPurple : dark ? C.darkBorder : C.lightBorder,
        marginBottom: 8,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 relative"
          style={{ background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})` }}
        >
          {driver.avatar}
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
            style={{
              background: cfg.color,
              borderColor: dark ? C.darkSurface : C.lightSurface,
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 12, fontWeight: 600, color: dark ? C.darkText : C.lightText }}>
              {driver.name}
            </span>
            <Star size={10} color={C.warning} fill={C.warning} />
            <span style={{ fontSize: 10, color: C.warning, fontWeight: 600 }}>{driver.rating}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{ background: `${cfg.color}22`, color: cfg.color, fontSize: 10 }}
            >
              {cfg.label}
            </span>
            {driver.speed > 0 && (
              <span style={{ fontSize: 10, color: dark ? C.gray7B : C.lightSubtext }}>
                {driver.speed} km/h
              </span>
            )}
          </div>
        </div>

        {/* Battery */}
        <div className="flex flex-col items-end gap-1">
          <span style={{ fontSize: 10, fontWeight: 700, color: driver.battery < 30 ? C.error : dark ? C.gray7B : C.lightSubtext }}>
            {driver.battery}%
          </span>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: dark ? C.darkBorder : C.grayE6, overflow: "hidden" }}>
            <div style={{ width: `${driver.battery}%`, height: "100%", borderRadius: 2, background: driver.battery < 30 ? C.error : driver.battery < 60 ? C.warning : C.success }} />
          </div>
        </div>
      </div>

      {driver.destination && (
        <div className="flex items-center gap-1.5 mt-2 pt-2" style={{ borderTop: `1px solid ${dark ? C.darkBorder : C.lightBorder}` }}>
          <Navigation size={10} color={C.primaryPurple} />
          <span style={{ fontSize: 10, color: dark ? C.gray7B : C.lightSubtext }} className="truncate">
            → {driver.destination}
          </span>
          {driver.eta && (
            <span style={{ fontSize: 10, fontWeight: 700, color: C.primaryPurple, marginLeft: "auto", flexShrink: 0 }}>
              ETA {driver.eta}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Selected Driver Detail Panel ───────────────────────────────────────────

function DriverDetailPanel({
  driver,
  dark,
  onClose,
}: {
  driver: Driver;
  dark: boolean;
  onClose: () => void;
}) {
  const cfg = getStatusCfg(driver.status);

  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: dark ? C.darkSurface : C.lightSurface,
        borderColor: C.primaryPurple,
        boxShadow: `0 0 24px rgba(168,85,247,.2)`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${C.primaryPurple}, ${C.secondaryPurple})` }}
          >
            {driver.avatar}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: dark ? C.darkText : C.lightText }}>{driver.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star size={11} color={C.warning} fill={C.warning} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.warning }}>{driver.rating}</span>
              <span style={{ fontSize: 11, color: dark ? C.gray7B : C.lightSubtext }}>· {driver.trips.toLocaleString()} trips</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ color: dark ? C.gray7B : C.lightSubtext, background: "none", border: "none", cursor: "pointer" }}>
          <X size={16} />
        </button>
      </div>

      {/* Status badge */}
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4"
        style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}40` }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
        {driver.speed > 0 && (
          <span style={{ fontSize: 11, color: dark ? C.gray7B : C.lightSubtext, marginLeft: "auto" }}>
            {driver.speed} km/h
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Battery",  value: `${driver.battery}%`, color: driver.battery < 30 ? C.error : C.success },
          { label: "Speed",    value: driver.speed > 0 ? `${driver.speed} km/h` : "Stationary", color: C.primaryPurple },
          { label: "ETA",      value: driver.eta ?? "—",    color: C.warning },
          { label: "Vehicle",  value: driver.id,            color: dark ? C.gray7B : C.lightSubtext },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-lg p-2.5"
            style={{ background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.03)" }}
          >
            <p style={{ fontSize: 10, color: dark ? C.gray7B : C.lightSubtext, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {driver.destination && (
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4" style={{ background: dark ? "rgba(168,85,247,.08)" : "rgba(168,85,247,.05)" }}>
          <Navigation size={12} color={C.primaryPurple} />
          <div>
            <p style={{ fontSize: 10, color: dark ? C.gray7B : C.lightSubtext }}>Destination</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: dark ? C.darkText : C.lightText }}>{driver.destination}</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {[
          { icon: Phone,        label: "Call"    },
          { icon: MessageSquare,label: "Message" },
          { icon: Truck,        label: "Reassign"},
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex-1 flex flex-col items-center gap-1 rounded-lg py-2.5 border text-xs font-medium transition-all hover:border-purple-500"
            style={{
              background: dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.02)",
              borderColor: dark ? C.darkBorder : C.lightBorder,
              color: dark ? C.gray7B : C.lightSubtext,
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main LiveMapPage ────────────────────────────────────────────────────────

export function LiveMapPage({ dark }: { dark: boolean }) {
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [zoom, setZoom] = useState(1);
  const [isLive, setIsLive] = useState(true);
  const [tick, setTick] = useState(0);

  // Simulate real-time movement
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      setDrivers((prev) =>
        prev.map((d) => {
          if (d.status === "OFFLINE" || d.speed === 0) return d;
          const rad = (d.bearing * Math.PI) / 180;
          const step = 0.0008;
          return {
            ...d,
            lat: Math.max(0.05, Math.min(0.95, d.lat + Math.cos(rad) * step * -1 + (Math.random() - 0.5) * 0.0003)),
            lng: Math.max(0.05, Math.min(0.95, d.lng + Math.sin(rad) * step + (Math.random() - 0.5) * 0.0003)),
            bearing: (d.bearing + (Math.random() - 0.5) * 4) % 360,
          };
        })
      );
      setTick((t) => t + 1);
    }, 800);
    return () => clearInterval(id);
  }, [isLive]);

  const filtered = drivers.filter((d) => {
    const matchName = d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchName && matchStatus;
  });

  const selectedDriver = drivers.find((d) => d.id === selectedId) ?? null;
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border = dark ? C.darkBorder : C.lightBorder;
  const text = dark ? C.darkText : C.lightText;
  const sub = dark ? C.gray7B : C.lightSubtext;

  const counts = {
    total: drivers.length,
    active: drivers.filter((d) => d.status === "ACTIVE" || d.status === "EN ROUTE").length,
    idle: drivers.filter((d) => d.status === "IDLE").length,
    offline: drivers.filter((d) => d.status === "OFFLINE").length,
  };

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 56px - 40px)", minHeight: 600 }}>

      {/* ── Left Sidebar ─────────────────────────────────────────── */}
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {[
            { label: "On Duty",  value: counts.active,  color: C.success        },
            { label: "Idle",     value: counts.idle,    color: C.warning        },
            { label: "Offline",  value: counts.offline, color: C.gray7B         },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border p-3 text-center" style={{ background: surface, borderColor: border }}>
              <p style={{ fontSize: 20, fontWeight: 700, color }}>{value}</p>
              <p style={{ fontSize: 10, color: sub, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="rounded-xl border p-3" style={{ background: surface, borderColor: border }}>
          <div className="flex items-center gap-2 rounded-lg px-3 h-8 mb-2" style={{ background: dark ? C.darkBorder : C.grayE6 }}>
            <Search size={13} color={sub} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search driver or ID…"
              className="bg-transparent outline-none text-xs w-full"
              style={{ color: text }}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["ALL", "ACTIVE", "EN ROUTE", "IDLE", "OFFLINE"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-2 py-1 rounded text-xs font-semibold transition-all"
                style={{
                  background: statusFilter === s ? C.primaryPurple : dark ? C.darkBorder : C.grayE6,
                  color: statusFilter === s ? "#fff" : sub,
                  border: "none",
                }}
              >
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Driver list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <p style={{ fontSize: 12, color: sub, textAlign: "center", padding: "24px 0" }}>No drivers found</p>
          ) : (
            filtered.map((d) => (
              <DriverCard
                key={d.id}
                driver={d}
                selected={d.id === selectedId}
                onClick={() => setSelectedId(d.id === selectedId ? null : d.id)}
                dark={dark}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Map Area ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Map toolbar */}
        <div className="flex items-center gap-3 rounded-xl border px-4 h-11" style={{ background: surface, borderColor: border, flexShrink: 0 }}>
          {/* Live indicator */}
          <button
            onClick={() => setIsLive((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: isLive ? "rgba(76,175,80,.12)" : "rgba(123,123,133,.1)",
              color: isLive ? C.success : sub,
              border: `1px solid ${isLive ? C.success + "44" : border}`,
            }}
          >
            {isLive ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isLive ? "LIVE" : "PAUSED"}
          </button>

          {isLive && (
            <div className="flex items-center gap-1.5">
              <Radio size={11} color={C.success} />
              <span style={{ fontSize: 10, color: sub }}>Updated {tick}s ago</span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: border }}>
              <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: dark ? C.darkBorder : C.grayE6, color: text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Minus size={10} />
              </button>
              <span style={{ fontSize: 10, color: sub, minWidth: 32, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(2, z + 0.25))} style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: dark ? C.darkBorder : C.grayE6, color: text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plus size={10} />
              </button>
            </div>

            <button className="w-8 h-8 rounded-lg border flex items-center justify-center" style={{ background: surface, borderColor: border }}>
              <Layers size={13} color={sub} />
            </button>
            <button className="w-8 h-8 rounded-lg border flex items-center justify-center" style={{ background: surface, borderColor: border }}>
              <LocateFixed size={13} color={C.primaryPurple} />
            </button>
          </div>
        </div>

        {/* Map canvas */}
        <div
          className="rounded-xl border overflow-hidden relative"
          style={{ flex: 1, background: "#080C14", borderColor: border }}
        >
          <LiveMapCanvas drivers={filtered} selectedId={selectedId} onSelect={setSelectedId} />

          {/* Legend overlay */}
          <div
            className="absolute bottom-4 left-4 rounded-xl border px-3 py-2.5 flex items-center gap-4"
            style={{ background: "rgba(8,12,20,.85)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(8px)" }}
          >
            {[
              { color: C.success,        label: "Available"  },
              { color: C.primaryPurple,  label: "En Route"   },
              { color: C.warning,        label: "Idle"       },
              { color: C.gray7B,         label: "Offline"    },
              { color: "#FF9500",        label: "Surge Zone" },
              { color: "#FF3B30",        label: "Incident"   },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5" style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
                {label}
              </span>
            ))}
          </div>

          {/* Active count overlay */}
          <div
            className="absolute top-4 right-4 rounded-xl border px-3 py-2"
            style={{ background: "rgba(8,12,20,.85)", borderColor: "rgba(168,85,247,.25)", backdropFilter: "blur(8px)" }}
          >
            <p style={{ fontSize: 10, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Units</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: C.success, lineHeight: 1.2 }}>{counts.active}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>of {counts.total} total</p>
          </div>
        </div>
      </div>

      {/* ── Right panel (driver detail) ──────────────────────────── */}
      {selectedDriver && (
        <div style={{ width: 260, flexShrink: 0 }}>
          <DriverDetailPanel
            driver={selectedDriver}
            dark={dark}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </div>
  );
}