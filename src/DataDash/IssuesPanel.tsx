import { AlertTriangle, MapPin } from "lucide-react";
import { C } from "./tokens";

interface IssuesPanelProps {
  dark: boolean;
}

export function IssuesPanel({ dark }: IssuesPanelProps) {
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

      {/* Payment Spike */}
      <div
        className="rounded-lg p-3 mb-2"
        style={{
          background: "rgba(255,59,48,.06)",
          border: "1px solid rgba(255,59,48,.2)",
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle size={13} color={C.error} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.error }}>
            Payment Spike
          </span>
        </div>
        <p style={{ fontSize: 11, color: dark ? C.gray7B : C.lightSubtext, lineHeight: 1.5 }}>
          Abnormal failure rate in Region 4 (Stripe API Latency).
        </p>
      </div>

      {/* Low Driver Density */}
      <div
        className="rounded-lg p-3"
        style={{
          background: "rgba(255,149,0,.06)",
          border: "1px solid rgba(255,149,0,.2)",
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <MapPin size={13} color={C.warning} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.warning }}>
            Low Driver Density
          </span>
        </div>
        <p style={{ fontSize: 11, color: dark ? C.gray7B : C.lightSubtext, lineHeight: 1.5 }}>
          E. Market st. average wait time increased to 12 mins.
        </p>
      </div>
    </div>
  );
}
