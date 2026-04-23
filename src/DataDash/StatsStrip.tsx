import { Activity, Users, Shield, BarChart2, type LucideIcon } from "lucide-react";
import { C } from "./tokens";

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: string;
  up: boolean;
}

const STATS: StatItem[] = [
  { icon: Activity,  label: "Avg Trip Duration", value: "18.4 min", delta: "-2.1 min", up: true  },
  { icon: Users,     label: "Active Drivers",     value: "847",      delta: "+34",      up: true  },
  { icon: Shield,    label: "Safety Score",       value: "97.2%",    delta: "+0.8%",    up: true  },
  { icon: BarChart2, label: "Utilization Rate",   value: "73.5%",    delta: "-1.2%",    up: false },
];

interface StatsStripProps {
  dark: boolean;
}

export function StatsStrip({ dark }: StatsStripProps) {
  const surface = dark ? C.darkSurface : C.lightSurface;
  const border = dark ? C.darkBorder : C.lightBorder;
  const text = dark ? C.darkText : C.lightText;
  const sub = dark ? C.gray7B : C.lightSubtext;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
      {STATS.map(({ icon: Icon, label, value, delta, up }) => (
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
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: sub,
              }}
            >
              {label}
            </span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px", color: text }}>
            {value}
          </p>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: up ? C.success : C.error,
              marginTop: 2,
            }}
          >
            {up ? "↑" : "↓"} {delta} vs yesterday
          </p>
        </div>
      ))}
    </div>
  );
}
