import { useState } from "react";
import DriverModal from "./DriverModalProps";

// ─── Types ────────────────────────────────────────────────────────────────────
type Accent = "violet" | "emerald" | "amber" | "blue";
type PaymentStatus = "paid" | "pending" | "refunded";
type PayoutType = "success" | "warning" | "purple" | "destructive";

interface Payment {
  date: string;
  ref: string;
  client: string;
  method: string;
  driver: string;
  vehicle: string;
  driverSeed: string;
  amount: string;
  paymentStatus: PaymentStatus;
  payout: string;
  payoutType: PayoutType;
}

interface PaymentsPageProps {
  dark: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PAYMENTS: Payment[] = [
  { date: "Mar 14, 2025", ref: "#8452A", client: "Emma Watson",    method: "Credit Card (Stripe)", driver: "Thomas Anderson", vehicle: "Mercedes E-Class", driverSeed: "Thomas",  amount: "€240.00", paymentStatus: "paid",     payout: "Cleared: €180.00",    payoutType: "success"     },
  { date: "Mar 16, 2025", ref: "#8429B", client: "John Smith",     method: "Corporate Billing",    driver: "Marcus Chen",     vehicle: "V-Class",          driverSeed: "Marcus",  amount: "€658.00", paymentStatus: "pending",  payout: "Pending: €520.00",    payoutType: "warning"     },
  { date: "Mar 18, 2025", ref: "#8397C", client: "Emily Chen",     method: "Credit Card (Stripe)", driver: "Lucia Gomez",     vehicle: "Range Rover",      driverSeed: "Lucia",   amount: "€310.00", paymentStatus: "paid",     payout: "Processing: €230.00", payoutType: "purple"      },
  { date: "Mar 20, 2025", ref: "#8320D", client: "Michael Scott",  method: "PayPal",               driver: "James Mbeki",     vehicle: "Audi A6",          driverSeed: "James",   amount: "€150.00", paymentStatus: "refunded", payout: "Cancelled",           payoutType: "destructive" },
  { date: "Mar 22, 2025", ref: "#8291E", client: "Sophie Laurent", method: "Credit Card (Stripe)", driver: "Thomas Anderson", vehicle: "Mercedes E-Class", driverSeed: "Thomas2", amount: "€185.00", paymentStatus: "paid",     payout: "Cleared: €140.00",    payoutType: "success"     },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AgencyPaymentsData({ dark }: PaymentsPageProps) {
  const [statusFilter, setStatusFilter] = useState("All");

  // ── theme tokens (same logic as all other pages) ──────────────────────────
  const card         = dark ? "bg-gray-900 border-gray-800"  : "bg-white border-gray-200";
  const heading      = dark ? "text-gray-100"                : "text-gray-900";
  const muted        = dark ? "text-gray-400"                : "text-gray-500";
  const divider      = dark ? "border-gray-800"              : "border-gray-200";
  const thead        = dark ? "bg-gray-800 border-gray-700"  : "bg-gray-50 border-gray-200";
  const rowHover     = dark ? "hover:bg-gray-800"            : "hover:bg-violet-50";
  const rowBorder    = dark ? "border-gray-800"              : "border-gray-100";
  const tdText       = dark ? "text-gray-300"                : "text-gray-700";
  const tdMuted      = dark ? "text-gray-500"                : "text-gray-400";
  const exportBtn    = dark
    ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";
  const filterBar    = dark
    ? "bg-gray-900 border-gray-800"
    : "bg-white border-gray-200";
  const filterChip   = dark
    ? "border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200"
    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100";
  const datePicker   = dark
    ? "border-gray-700 bg-gray-800 text-gray-300"
    : "border-gray-200 bg-gray-50 text-gray-700";
  // ──────────────────────────────────────────────────────────────────────────

  const filtered = PAYMENTS.filter(
    (p) => statusFilter === "All" || p.paymentStatus === statusFilter
  );

  const accentColors: Record<Accent, string> = {
    violet:  dark ? "bg-violet-900/30 text-violet-400"   : "bg-violet-100 text-violet-600",
    emerald: dark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-600",
    amber:   dark ? "bg-amber-900/30 text-amber-400"     : "bg-amber-100 text-amber-600",
    blue:    dark ? "bg-blue-900/30 text-blue-400"       : "bg-blue-100 text-blue-600",
  };

  const paymentStatusConfig: Record<PaymentStatus, { icon: string; label: string; cls: string }> = {
    paid:     { icon: "✓", label: "Paid",            cls: dark ? "text-emerald-400" : "text-emerald-600" },
    pending:  { icon: "⏱", label: "Pending 30 Days", cls: dark ? "text-amber-400"  : "text-amber-600"   },
    refunded: { icon: "✕", label: "Refunded",         cls: dark ? "text-gray-400"   : "text-gray-500"    },
  };

  const payoutBadge: Record<PayoutType, string> = {
    success:     dark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-100 text-emerald-700",
    warning:     dark ? "bg-amber-900/40 text-amber-400"     : "bg-amber-100 text-amber-700",
    purple:      dark ? "bg-violet-900/40 text-violet-400"   : "bg-violet-100 text-violet-700",
    destructive: dark ? "bg-red-900/40 text-red-400"         : "bg-red-100 text-red-700",
  };

  const stats: { label: string; value: string; icon: string; accent: Accent }[] = [
    { label: "Total Revenue",    value: "€42,850", icon: "📊", accent: "violet"  },
    { label: "Paid & Cleared",   value: "€36,120", icon: "✅", accent: "emerald" },
    { label: "Pending (Unpaid)", value: "€6,730",  icon: "⏳", accent: "amber"   },
    { label: "Driver Payouts",   value: "€28,500", icon: "💳", accent: "blue"    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <div className="  flex flex-col gap-5">

      {/* Header */}
      <div className=" overflow-auto flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${heading}`}>Payments Overview</h1>
          <p className={`text-xs mt-0.5 ${muted}`}>
            Track incoming revenues, pending balances, and driver payouts.
          </p>
        </div>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium border transition-colors ${exportBtn}`}
        >
            <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        Open Driver Modal test 
      </button>

      <DriverModal 
        isOpen={open}
        onClose={() => setOpen(false)}
      />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-3xl border p-5 flex flex-col gap-2 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${card}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs ${muted}`}>{s.label}</span>
              <span className={`text-base w-8 h-8 rounded-xl flex items-center justify-center ${accentColors[s.accent]}`}>
                {s.icon}
              </span>
            </div>
            <span className={`text-2xl font-semibold tracking-tight ${heading}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-3xl border flex-wrap shadow-sm ${filterBar}`}>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs cursor-pointer ${datePicker}`}>
          📅 <span>Mar 1 – Mar 31, 2025</span> <span className={muted}>▾</span>
        </div>

        {["All", "paid", "pending", "refunded"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-2xl border text-xs font-medium transition-all duration-200 ${
              statusFilter === f ? "text-white border-transparent" : filterChip
            }`}
            style={statusFilter === f ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)" } : {}}
          >
            {f === "All" ? "All Status" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}

        <span className={`ml-auto text-xs ${muted}`}>{filtered.length} records</span>
        <button
          className="px-3 py-1.5 rounded-2xl text-xs font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className={`rounded-3xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden ${card}`}>
        {/* Column headers */}
        <div
          className={`grid text-[10px] font-semibold uppercase tracking-wider px-5 py-3 border-b ${thead}`}
          style={{ gridTemplateColumns: "1fr 1.4fr 1.6fr 0.8fr 1.1fr 1.2fr 0.7fr" }}
        >
          {["Date & Ref", "Client / Passenger", "Driver Info", "Amount", "Payment Status", "Driver Payout", "Action"].map((h, i) => (
            <span key={h} className={i === 6 ? "text-right" : ""}>{h}</span>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className={`px-5 py-10 text-center text-sm ${muted}`}>
            No payments match your filters.
          </div>
        ) : (
          filtered.map((p, i) => {
            const ps = paymentStatusConfig[p.paymentStatus];
            return (
              <div
                key={p.ref}
                className={`grid px-5 py-4 text-xs items-center transition-colors ${rowHover} ${i > 0 ? `border-t ${rowBorder}` : ""}`}
                style={{ gridTemplateColumns: "1fr 1.4fr 1.6fr 0.8fr 1.1fr 1.2fr 0.7fr" }}
              >
                {/* Date & Ref */}
                <div>
                  <p className={`font-medium ${heading}`}>{p.date}</p>
                  <p className={`mt-0.5 ${tdMuted}`}>{p.ref}</p>
                </div>

                {/* Client */}
                <div>
                  <p className={`font-medium ${heading}`}>{p.client}</p>
                  <p className={`mt-0.5 ${tdMuted}`}>{p.method}</p>
                </div>

                {/* Driver */}
                <div className="flex items-center gap-2">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.driverSeed}`}
                    alt={p.driver}
                    className="w-7 h-7 rounded-full bg-violet-100 shrink-0"
                  />
                  <div>
                    <p className={`font-medium ${heading}`}>{p.driver}</p>
                    <p className={`mt-0.5 ${tdMuted}`}>{p.vehicle}</p>
                  </div>
                </div>

                {/* Amount */}
                <p className={`font-semibold ${p.paymentStatus === "refunded" ? `line-through ${tdMuted}` : heading}`}>
                  {p.amount}
                </p>

                {/* Payment Status */}
                <div className={`flex items-center gap-1.5 font-medium ${ps.cls}`}>
                  <span>{ps.icon}</span>
                  <span>{ps.label}</span>
                </div>

                {/* Payout Badge */}
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block w-fit ${payoutBadge[p.payoutType]}`}>
                  {p.payout}
                </span>

                {/* Action */}
                <div className="text-right">
                  {p.paymentStatus !== "refunded" ? (
                    <button className="text-violet-500 hover:text-violet-400 font-medium transition-colors">
                      View Invoice
                    </button>
                  ) : (
                    <span className={tdMuted}>N/A</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}