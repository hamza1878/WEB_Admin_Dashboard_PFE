import { useState } from "react";

type TransactionStatus = "Paid" | "Pending" | "Failed";

interface Transaction {
  date: string;
  invoice: string;
  trip: string;
  amount: string;
  status: TransactionStatus;
  method: string;
}

interface Agency {
  id: string;
  initials: string;
  name: string;
  tags: string[];
  outstanding: string;
  outstandingTrend: string;
  paid30: string;
  paid30Trend: string;
  nextPayout: string;
  nextPayoutSub: string;
  transactions: Transaction[];
  totalInvoiced: string;
}

interface AgencyPaymentsProps {
  dark: boolean;
}

const AGENCIES: Agency[] = [
  {
    id: "ag1",
    initials: "AG",
    name: "Alpha Group",
    tags: ["Agency admin", "Airport transfers", "City rides", "Net 30 terms"],
    outstanding: "€4,230.00",
    outstandingTrend: "+€320 vs last month",
    paid30: "€12,480.00",
    paid30Trend: "↑ 18% vs previous",
    nextPayout: "Mar 28",
    nextPayoutSub: "Scheduled · Bank transfer",
    totalInvoiced: "€18,710.00",
    transactions: [
      { date: "Mar 12, 2025", invoice: "#INV-8452", trip: "CDG → Paris center",          amount: "€240.00",  status: "Paid",    method: "Card · **** 4821"   },
      { date: "Mar 10, 2025", invoice: "#INV-8429", trip: "Lyon → Geneva",                amount: "€680.00",  status: "Pending", method: "Wire transfer"       },
      { date: "Mar 08, 2025", invoice: "#INV-8397", trip: "Nice airport → Cannes",        amount: "€310.00",  status: "Paid",    method: "Card · **** 9033"   },
      { date: "Mar 03, 2025", invoice: "#INV-8321", trip: "Paris → Brussels",             amount: "€920.00",  status: "Failed",  method: "SEPA direct debit"   },
      { date: "Feb 28, 2025", invoice: "#INV-8274", trip: "Marseille → Aix-en-Provence", amount: "€160.00",  status: "Paid",    method: "Card · **** 4821"   },
    ],
  },
  {
    id: "bx1",
    initials: "BX",
    name: "BlueSky Transfers",
    tags: ["Premium", "Long distance", "Corporate", "Net 15 terms"],
    outstanding: "€7,890.00",
    outstandingTrend: "+€1,200 vs last month",
    paid30: "€31,200.00",
    paid30Trend: "↑ 32% vs previous",
    nextPayout: "Apr 4",
    nextPayoutSub: "Scheduled · SEPA",
    totalInvoiced: "€39,090.00",
    transactions: [
      { date: "Mar 14, 2025", invoice: "#INV-9112", trip: "Paris → London",       amount: "€1,200.00", status: "Paid",    method: "Wire transfer"     },
      { date: "Mar 11, 2025", invoice: "#INV-9087", trip: "Lyon → Zurich",        amount: "€950.00",   status: "Paid",    method: "Card · **** 3301" },
      { date: "Mar 07, 2025", invoice: "#INV-9043", trip: "Bordeaux → Madrid",    amount: "€1,640.00", status: "Pending", method: "SEPA direct debit" },
      { date: "Mar 02, 2025", invoice: "#INV-8990", trip: "Nice → Monaco",        amount: "€310.00",   status: "Paid",    method: "Card · **** 3301" },
      { date: "Feb 25, 2025", invoice: "#INV-8871", trip: "Paris → Amsterdam",    amount: "€1,100.00", status: "Failed",  method: "Wire transfer"     },
    ],
  },
  {
    id: "cr1",
    initials: "CR",
    name: "City Riders Co.",
    tags: ["Urban", "Short trips", "B2C", "Net 45 terms"],
    outstanding: "€1,150.00",
    outstandingTrend: "-€80 vs last month",
    paid30: "€5,340.00",
    paid30Trend: "↓ 4% vs previous",
    nextPayout: "Mar 31",
    nextPayoutSub: "Scheduled · Bank transfer",
    totalInvoiced: "€6,490.00",
    transactions: [
      { date: "Mar 13, 2025", invoice: "#INV-7741", trip: "Opéra → La Défense",       amount: "€45.00", status: "Paid",    method: "Card · **** 9920" },
      { date: "Mar 12, 2025", invoice: "#INV-7738", trip: "Gare du Nord → Orly",      amount: "€68.00", status: "Paid",    method: "Card · **** 9920" },
      { date: "Mar 10, 2025", invoice: "#INV-7720", trip: "Châtelet → Vincennes",     amount: "€32.00", status: "Pending", method: "Card · **** 1145" },
      { date: "Mar 05, 2025", invoice: "#INV-7698", trip: "Montmartre → Bastille",    amount: "€28.00", status: "Paid",    method: "Card · **** 9920" },
      { date: "Mar 01, 2025", invoice: "#INV-7650", trip: "CDG → Paris 8e",           amount: "€95.00", status: "Failed",  method: "Card · **** 1145" },
    ],
  },
];

const STATUS_STYLES: Record<TransactionStatus, string> = {
  Paid:    "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed:  "bg-red-100 text-red-600",
};

const STATUS_DOT: Record<TransactionStatus, string> = {
  Paid:    "bg-emerald-500",
  Pending: "bg-amber-400",
  Failed:  "bg-red-500",
};

const BILLING = [
  { label: "Billing currency",    sub: "Default currency for invoices",              value: "EUR (€)",         highlight: false },
  { label: "Payment terms",       sub: "Time allowed before an invoice is due",      value: "Net 30",          highlight: false },
  { label: "Payout frequency",    sub: "How often agency receives payouts",          value: "Weekly · Fridays",highlight: false },
  { label: "Bank account",        sub: "Last 4 digits · IBAN",                       value: "FR76 **** 2341",  highlight: false },
  { label: "Auto reconciliation", sub: "Match payments to trips automatically",      value: "Enabled",         highlight: true  },
];

const GRADIENT = "linear-gradient(135deg,#8b5cf6,#6d28d9)";

function SelectField({
  value,
  onChange,
  options,
  dark,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  dark: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`appearance-none border rounded-lg pl-3 pr-7 py-2 text-sm cursor-pointer outline-none transition-colors ${
          dark
            ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-violet-500"
            : "bg-white border-gray-200 text-gray-700 focus:border-violet-400"
        }`}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <svg
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${dark ? "text-gray-500" : "text-gray-400"}`}
        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

export default function AgencyPaymentsData({ dark }: AgencyPaymentsProps) {
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [agencyOpen, setAgencyOpen]             = useState(false);
  const [period, setPeriod]                     = useState("This month");
  const [statusFilter, setStatusFilter]         = useState("All statuses");
  const [methodFilter, setMethodFilter]         = useState("All payment methods");
  const [activeTab, setActiveTab]               = useState(0);

  const agency = AGENCIES.find(a => a.id === selectedAgencyId) ?? null;

  const page      = dark ? "bg-gray-950 text-gray-100"  : "bg-stone-100 text-gray-900";
  const card      = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const inner     = dark ? "bg-gray-800 border-gray-700" : "bg-stone-50 border-stone-200";
  const muted     = dark ? "text-gray-400"               : "text-gray-400";
  const subtle    = dark ? "text-gray-500"               : "text-gray-500";
  const divCls    = dark ? "border-gray-800"             : "border-gray-100";
  const hoverRow  = dark ? "hover:bg-gray-800"           : "hover:bg-stone-50";
  const btnGhost  = dark
    ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";
  const resetBtn  = dark
    ? "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
    : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200";
  const tagCls    = dark ? "bg-gray-800 text-gray-400"   : "bg-gray-100 text-gray-500";
  const headTh    = dark ? "text-gray-500"               : "text-gray-400";
  const emptyBox  = dark ? "border-gray-700 text-gray-600" : "border-gray-200 text-gray-300";

  return (
    <div className={`min-h-screen p-2 transition-colors duration-300 ${page}`}>

      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold tracking-tight">Agency payments – Sarah Lee</h1>
            <span className="text-sm font-medium text-violet-500 cursor-pointer hover:underline">
              Payments dashboard
            </span>
          </div>
          <p className={`text-sm ${muted}`}>
            Track invoices, payouts and outstanding balances for this agency contact.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${btnGhost}`}>
            Back to agency
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-opacity"
            style={{ background: GRADIENT }}
          >
            <span className="text-base leading-none">+</span> Create manual invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-4">

        <div className={`col-span-2 rounded-2xl border p-5 transition-colors ${card}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold mb-0.5">Agency &amp; contact</p>
              <p className={`text-xs ${muted}`}>Main billing contact and current account status.</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${
              dark ? "bg-gray-800 border-gray-700 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-400"
            }`}>
              Ex: Sarah Lee
            </span>
          </div>

          <div className="relative mb-4">
            <button
              onClick={() => setAgencyOpen(!agencyOpen)}
              className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors text-left ${
                dark ? "bg-gray-800 border-gray-700 hover:bg-gray-700" : "bg-stone-50 border-gray-200 hover:bg-stone-100"
              }`}
            >
              {agency ? (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: GRADIENT }}
                >
                  {agency.initials}
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  dark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"
                }`}>
                  ?
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{agency?.name ?? "Select an agency"}</p>
                <p className={`text-xs ${muted}`}>Choose an agency from the list to see its payments</p>
              </div>
              <svg
                className={`w-4 h-4 shrink-0 transition-transform ${agencyOpen ? "rotate-180" : ""} ${muted}`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {agencyOpen && (
              <div className={`absolute z-20 top-full mt-1 w-full rounded-xl border shadow-xl overflow-hidden ${
                dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
              }`}>
                {AGENCIES.map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedAgencyId(a.id); setAgencyOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      selectedAgencyId === a.id
                        ? dark ? "bg-violet-900/40 text-violet-300" : "bg-violet-50 text-violet-700"
                        : dark ? "hover:bg-gray-800" : "hover:bg-stone-50"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: GRADIENT }}
                    >
                      {a.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{a.name}</p>
                      <p className={`text-xs ${muted}`}>{a.tags[0]} · {a.tags[2]}</p>
                    </div>
                    {selectedAgencyId === a.id && (
                      <svg className="ml-auto w-4 h-4 text-violet-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {(agency?.tags ?? ["Agency admin", "Airport transfers", "City rides", "Net 30 terms"]).map(t => (
              <span key={t} className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagCls}`}>{t}</span>
            ))}
          </div>

          <div className={`border-t mb-4 ${divCls}`} />

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Outstanding balance", value: agency?.outstanding    ?? "—", trend: agency?.outstandingTrend, green: true  },
              { label: "Paid last 30 days",   value: agency?.paid30         ?? "—", trend: agency?.paid30Trend,      green: true  },
              { label: "Next payout date",    value: agency?.nextPayout     ?? "—", trend: agency?.nextPayoutSub,    green: false },
            ].map(s => (
              <div key={s.label} className={`rounded-xl border p-3 ${inner}`}>
                <p className={`text-xs mb-1 ${muted}`}>{s.label}</p>
                <p className="text-lg font-bold font-mono">{s.value}</p>
                <p className={`text-xs mt-0.5 ${
                  s.green && (s.trend?.startsWith("+") || s.trend?.startsWith("↑"))
                    ? "text-emerald-500"
                    : muted
                }`}>
                  {s.trend ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={`col-span-3 rounded-2xl border p-5 transition-colors ${card}`}>
          <p className="text-sm font-semibold mb-0.5">Payments overview</p>
          <p className={`text-xs mb-4 ${muted}`}>Filter by period, status and payment method.</p>

          <div className="flex items-center gap-2 mb-4">
            <SelectField dark={dark} value={period}       onChange={setPeriod}       options={["This month", "Last 30 days", "Last 90 days", "This year"]} />
            <SelectField dark={dark} value={statusFilter} onChange={setStatusFilter} options={["All statuses", "Paid", "Pending", "Failed"]} />
            <SelectField dark={dark} value={methodFilter} onChange={setMethodFilter} options={["All payment methods", "Card", "Wire transfer", "SEPA direct debit"]} />
            <div className="ml-auto flex gap-2">
              <button className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${resetBtn}`}>
                Reset
              </button>
              <button
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: GRADIENT }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Apply
              </button>
            </div>
          </div>

          <div className={`flex items-center justify-between rounded-xl border px-5 py-4 mb-5 ${inner}`}>
            <span className={`text-sm ${subtle}`}>Total invoiced this period</span>
            <span className="text-xl font-bold font-mono">{agency?.totalInvoiced ?? "—"}</span>
          </div>

          <div className={`border-t pt-4 flex ${divCls}`}>
            {["Completed payments", "Pending approvals", "Failed or refunded"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                style={{ textAlign: i === 0 ? "left" : i === 1 ? "center" : "right" }}
                className={`flex-1 text-sm pb-1 font-medium transition-colors border-b-2 ${
                  activeTab === i
                    ? "text-violet-500 border-violet-500"
                    : `${muted} border-transparent hover:text-gray-500`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">

        <div className={`col-span-3 rounded-2xl border p-5 transition-colors ${card}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold mb-0.5">Recent transactions</p>
              <p className={`text-xs ${muted}`}>Last payments linked to Sarah Lee and this agency.</p>
            </div>
            <button className={`px-3.5 py-1.5 text-xs font-medium border rounded-lg transition-colors ${btnGhost}`}>
              Export CSV
            </button>
          </div>

          {agency ? (
            <table className="w-full">
              <thead>
                <tr className={`border-b ${divCls}`}>
                  {["Date", "Invoice", "Trip", "Amount", "Status", "Method"].map(h => (
                    <th key={h} className={`pb-2.5 text-left text-xs font-medium px-2 first:pl-0 last:pr-0 ${headTh}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agency.transactions.map((tx, i) => (
                  <tr
                    key={i}
                    className={`cursor-pointer transition-colors ${hoverRow} ${
                      i < agency.transactions.length - 1 ? `border-b ${divCls}` : ""
                    }`}
                  >
                    <td className={`py-3 px-2 pl-0 text-xs whitespace-nowrap ${muted}`}>{tx.date}</td>
                    <td className="py-3 px-2 text-xs font-semibold text-violet-500 font-mono">{tx.invoice}</td>
                    <td className="py-3 px-2 text-sm font-medium">{tx.trip}</td>
                    <td className="py-3 px-2 text-sm font-bold font-mono whitespace-nowrap">{tx.amount}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[tx.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[tx.status]}`} />
                        {tx.status}
                      </span>
                    </td>
                    <td className={`py-3 px-2 pr-0 text-xs whitespace-nowrap ${muted}`}>{tx.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={`flex flex-col items-center justify-center py-14 rounded-xl border border-dashed ${emptyBox}`}>
              <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="3" /><path d="M2 10h20" />
              </svg>
              <p className="text-sm font-medium">No agency selected</p>
              <p className="text-xs mt-1">Pick an agency above to see its transactions</p>
            </div>
          )}
        </div>

        <div className={`col-span-2 rounded-2xl border p-5 transition-colors ${card}`}>
          <p className="text-sm font-semibold mb-0.5">Billing summary</p>
          <p className={`text-xs mb-4 ${muted}`}>Key billing details and payout configuration.</p>

          <div className="flex flex-col">
            {BILLING.map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className={`text-xs mt-0.5 ${muted}`}>{item.sub}</p>
                  </div>
                  {item.highlight ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                      {item.value}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold font-mono">{item.value}</span>
                  )}
                </div>
                {i < BILLING.length - 1 && <div className={`border-t ${divCls}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}