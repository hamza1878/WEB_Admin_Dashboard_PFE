import { useRef, useEffect, useCallback } from "react";
import { fleetData } from "./mockData";
import { C } from "./tokens";

interface HeatMapCanvasProps {
  dark: boolean;
}

interface Spot {
  x: number;
  y: number;
  r: number;
  color: string;
}

interface Road {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function HeatMapCanvas({ dark }: HeatMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    // Roads
    ctx.strokeStyle = "rgba(168,85,247,.22)";
    ctx.lineWidth = 1;
    const roads: Road[] = [
      { x1: 0,        y1: H * 0.4,  x2: W,        y2: H * 0.4  },
      { x1: 0,        y1: H * 0.65, x2: W,         y2: H * 0.65 },
      { x1: W * 0.25, y1: 0,        x2: W * 0.25,  y2: H        },
      { x1: W * 0.5,  y1: 0,        x2: W * 0.5,   y2: H        },
      { x1: W * 0.75, y1: 0,        x2: W * 0.75,  y2: H        },
    ];
    roads.forEach(({ x1, y1, x2, y2 }) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });

    // Hotspots
    const spots: Spot[] = [
      { x: 0.18, y: 0.30, r: 0.20, color: "rgba(255,59,48,.8)"   },
      { x: 0.50, y: 0.55, r: 0.15, color: "rgba(255,149,0,.65)"  },
      { x: 0.38, y: 0.25, r: 0.11, color: "rgba(255,149,0,.55)"  },
      { x: 0.72, y: 0.38, r: 0.09, color: "rgba(75,159,255,.45)" },
      { x: 0.08, y: 0.72, r: 0.08, color: "rgba(255,59,48,.5)"   },
      { x: 0.82, y: 0.70, r: 0.08, color: "rgba(75,159,255,.4)"  },
      { x: 0.60, y: 0.15, r: 0.09, color: "rgba(255,149,0,.45)"  },
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
      const bx = v.lng * W;
      const by = v.lat * H;
      const col =
        v.status === "ACTIVE"   ? C.success :
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
    const parent = canvasRef.current?.parentElement;
    if (parent) ro.observe(parent);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: 240,
        display: "block",
        borderRadius: "0 0 12px 12px",
      }}
    />
  );
}
