// import { useState } from "react";

// type TripStatus = "Completed" | "Scheduled" | "Cancelled" | "In Progress";
// type PaymentStatus = "Paid" | "Pending" | "Not billed";

// interface Contact {
//   name: string;
//   agency: string;
//   activeTrips: number;
//   role: string;
// }

// interface Trip {
//   datetime: string;
//   route: string;
//   passenger: string;
//   vehicle: string;
//   tripStatus: TripStatus;
//   payment: PaymentStatus;
//   amount: string;
//   invoice: string;
// }

// interface Agency {
//   id: string;
//   initials: string;
//   name: string;
//   contacts: Contact[];
//   trips: Trip[];
// }

// interface TripsPageProps {
//   dark: boolean;
// }

// const AGENCIES: Agency[] = [
//   {
//     id: "gtp",
//     initials: "GT",
//     name: "Global Travel Partners",
//     contacts: [
//       { name: "Sarah Lee",   agency: "Global Travel Partners", activeTrips: 42, role: "Primary"      },
//       { name: "John Smith",  agency: "City Events Agency",      activeTrips: 18, role: "Agency admin" },
//       { name: "Emily Chen",  agency: "Asia Connect Travel",     activeTrips:  9, role: "Contact"      },
//     ],
//     trips: [
//       { datetime: "Mar 14, 2025 · 09:30", route: "CDG → Paris center",    passenger: "Sarah Lee",  vehicle: "Business Sedan", tripStatus: "Completed", payment: "Paid",       amount: "€240.00", invoice: "#INV-8452" },
//       { datetime: "Mar 11, 2025 · 14:15", route: "Lyon → Geneva",          passenger: "John Smith", vehicle: "Van",            tripStatus: "Scheduled", payment: "Pending",    amount: "€680.00", invoice: "#INV-8429" },
//       { datetime: "Mar 07, 2025 · 17:45", route: "Nice airport → Cannes",  passenger: "Emily Chen", vehicle: "SUV",            tripStatus: "Completed", payment: "Paid",       amount: "€310.00", invoice: "#INV-8397" },
//       { datetime: "Mar 02, 2025 · 12:05", route: "Paris → Brussels",       passenger: "Sarah Lee",  vehicle: "Business Sedan", tripStatus: "Cancelled", payment: "Not billed", amount: "€0.00",   invoice: "-"        },
//       { datetime: "Feb 26, 2025 · 08:10", route: "Orly → Paris center",    passenger: "Sarah Lee",  vehicle: "Business Sedan", tripStatus: "Completed", payment: "Paid",       amount: "€190.00", invoice: "#INV-8213" },
//     ],
//   },
//   {
//     id: "cea",
//     initials: "CE",
//     name: "City Events Agency",
//     contacts: [
//       { name: "John Smith",   agency: "City Events Agency",  activeTrips: 18, role: "Primary" },
//       { name: "Laura Petit",  agency: "City Events Agency",  activeTrips:  6, role: "Contact" },
//     ],
//     trips: [
//       { datetime: "Mar 15, 2025 · 10:00", route: "Paris → Versailles",      passenger: "John Smith",  vehicle: "Van",            tripStatus: "Completed",  payment: "Paid",       amount: "€180.00", invoice: "#INV-9001" },
//       { datetime: "Mar 13, 2025 · 08:30", route: "CDG → Disneyland",        passenger: "Laura Petit", vehicle: "SUV",            tripStatus: "Scheduled",  payment: "Pending",    amount: "€220.00", invoice: "#INV-8990" },
//       { datetime: "Mar 09, 2025 · 16:20", route: "Marseille → Nice",        passenger: "John Smith",  vehicle: "Business Sedan", tripStatus: "In Progress",payment: "Pending",    amount: "€350.00", invoice: "#INV-8945" },
//       { datetime: "Mar 01, 2025 · 11:00", route: "Lyon → St-Exupéry",      passenger: "Laura Petit", vehicle: "Van",            tripStatus: "Cancelled",  payment: "Not billed", amount: "€0.00",   invoice: "-"        },
//     ],
//   },
//   {
//     id: "act",
//     initials: "AC",
//     name: "Asia Connect Travel",
//     contacts: [
//       { name: "Emily Chen",  agency: "Asia Connect Travel", activeTrips: 9, role: "Primary"      },
//       { name: "Li Wei",      agency: "Asia Connect Travel", activeTrips: 4, role: "Agency admin" },
//     ],
//     trips: [
//       { datetime: "Mar 16, 2025 · 07:45", route: "CDG → Paris 8e",          passenger: "Emily Chen", vehicle: "Business Sedan", tripStatus: "Completed",  payment: "Paid",    amount: "€95.00",  invoice: "#INV-9102" },
//       { datetime: "Mar 12, 2025 · 13:00", route: "Paris → Geneva",           passenger: "Li Wei",     vehicle: "Van",            tripStatus: "Scheduled",  payment: "Pending", amount: "€820.00", invoice: "#INV-9088" },
//       { datetime: "Mar 05, 2025 · 09:15", route: "Nice → Cannes",            passenger: "Emily Chen", vehicle: "SUV",            tripStatus: "Completed",  payment: "Paid",    amount: "€140.00", invoice: "#INV-9010" },
//     ],
//   },
// ];

// const TRIP_STATUS_STYLES: Record<TripStatus, string> = {
//   Completed:   "bg-emerald-100 text-emerald-700",
//   Scheduled:   "bg-amber-100 text-amber-700",
//   Cancelled:   "bg-red-100 text-red-600",
//   "In Progress":"bg-blue-100 text-blue-700",
// };

// const PAY_STATUS_STYLES: Record<PaymentStatus, string> = {
//   Paid:        "text-emerald-600 font-semibold",
//   Pending:     "text-amber-600 font-semibold",
//   "Not billed":"text-gray-400",
// };

// const GRADIENT = "linear-gradient(135deg,#8b5cf6,#6d28d9)";

// function SelectField({ value, onChange, options, dark }: {
//   value: string; onChange: (v: string) => void; options: string[]; dark: boolean;
// }) {
//   return (
//     <div className="relative flex-1 min-w-[160px]">
//       <select
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         className={`w-full appearance-none border rounded-lg pl-3 pr-7 py-2 text-sm cursor-pointer outline-none transition-colors ${
//           dark
//             ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-violet-500"
//             : "bg-white border-gray-200 text-gray-700 focus:border-violet-400"
//         }`}
//       >
//         {options.map(o => <option key={o}>{o}</option>)}
//       </select>
//       <svg className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${dark ? "text-gray-500" : "text-gray-400"}`}
//         fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//         <path d="M6 9l6 6 6-6" />
//       </svg>
//     </div>
//   );
// }

// export default function TripsPage({ dark }: TripsPageProps) {
//   const [selectedId, setSelectedId]       = useState<string | null>(null);
//   const [agencyOpen, setAgencyOpen]       = useState(false);
//   const [period, setPeriod]               = useState("Last 30 days");
//   const [tripStatus, setTripStatus]       = useState("All trip statuses");
//   const [payStatus, setPayStatus]         = useState("All payment statuses");
//   const [vehicle, setVehicle]             = useState("All vehicle types");
//   const [search, setSearch]               = useState("");

//   const agency = AGENCIES.find(a => a.id === selectedId) ?? null;

//   const filteredTrips = (agency?.trips ?? []).filter(t => {
//     if (tripStatus !== "All trip statuses" && t.tripStatus !== tripStatus) return false;
//     if (payStatus !== "All payment statuses" && t.payment !== payStatus) return false;
//     if (vehicle !== "All vehicle types" && t.vehicle !== vehicle) return false;
//     if (search && ![t.passenger, t.invoice, t.route].some(v => v.toLowerCase().includes(search.toLowerCase()))) return false;
//     return true;
//   });

//   const page     = dark ? "bg-gray-950 text-gray-100"   : "bg-stone-100 text-gray-900";
//   const card     = dark ? "bg-gray-900 border-gray-800"  : "bg-white border-gray-200";
//   const inner    = dark ? "bg-gray-800 border-gray-700"  : "bg-stone-50 border-stone-200";
//   const muted    = dark ? "text-gray-400"                : "text-gray-400";
//   const divCls   = dark ? "border-gray-800"              : "border-gray-100";
//   const hoverRow = dark ? "hover:bg-gray-800"            : "hover:bg-stone-50";
//   const theadCls = dark ? "bg-gray-800 text-gray-400"    : "bg-stone-50 text-gray-400";
//   const btnGhost = dark
//     ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
//     : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";
//   const inputCls = dark
//     ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-violet-500"
//     : "bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-violet-400";
//   const tagCls   = dark ? "bg-gray-700 text-gray-300"    : "bg-gray-100 text-gray-500";
//   const emptyBox = dark ? "border-gray-700 text-gray-600": "border-gray-200 text-gray-300";

//   return (
//     <div className={`min-h-screen p-6 transition-colors duration-300 ${page}`}>

//       <div className="flex items-start justify-between mb-5">
//         <div>
//           <div className="flex items-center gap-3 mb-1">
//             <h1 className="text-xl font-bold tracking-tight">Agency trips</h1>
//             <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-500"}`}>
//               Trips dashboard
//             </span>
//           </div>
//           <p className={`text-sm ${muted}`}>
//             Browse and filter all trips linked to agencies and their billing contacts.
//           </p>
//         </div>
//         {/* <div className="flex items-center gap-2 shrink-0">
//           <button className={`px-4 py-2 text-sm font-medium border rounded-xl transition-colors ${btnGhost}`}>
//             Back to agencies
//           </button>
//           <button
//             className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-opacity"
//             style={{ background: GRADIENT }}
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//               <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
//             </svg>
//             Create manual trip
//           </button>
//         </div> */}
//       </div>

//       <div className="grid grid-cols-5 gap-4 mb-4">

//         <div className={`col-span-2 rounded-2xl border p-5 transition-colors ${card}`}>
//           <p className="text-sm font-semibold mb-0.5">Agency &amp; contact</p>
//           <p className={`text-xs mb-4 ${muted}`}>Select an agency to see trips linked to it.</p>

//           <div className="relative mb-4">
//             <button
//               onClick={() => setAgencyOpen(!agencyOpen)}
//               className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 text-left transition-colors ${
//                 dark ? "bg-gray-800 border-gray-700 hover:bg-gray-700" : "bg-stone-50 border-gray-200 hover:bg-stone-100"
//               }`}
//             >
//               <div
//                 style={{ background: agency ? GRADIENT : undefined }}
//                 {...(!agency ? { className: `w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${dark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}` } : {})}
//               >
//                 {agency ? agency.initials : "?"}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold truncate">{agency?.name ?? "Select an agency"}</p>
//                 <p className={`text-xs ${muted}`}>Ex: Sarah Lee · Main billing contact</p>
//               </div>
//               <svg className={`w-4 h-4 shrink-0 transition-transform ${agencyOpen ? "rotate-180" : ""} ${muted}`}
//                 fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path d="M6 9l6 6 6-6" />
//               </svg>
//             </button>

//             {agencyOpen && (
//               <div className={`absolute z-20 top-full mt-1 w-full rounded-xl border shadow-xl overflow-hidden ${
//                 dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
//               }`}>
//                 {AGENCIES.map(a => (
//                   <button
//                     key={a.id}
//                     onClick={() => { setSelectedId(a.id); setAgencyOpen(false); }}
//                     className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
//                       selectedId === a.id
//                         ? dark ? "bg-violet-900/40 text-violet-300" : "bg-violet-50 text-violet-700"
//                         : dark ? "hover:bg-gray-800" : "hover:bg-stone-50"
//                     }`}
//                   >
//                     <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
//                       style={{ background: GRADIENT }}>{a.initials}</div>
//                     <div>
//                       <p className="text-sm font-semibold">{a.name}</p>
//                       <p className={`text-xs ${muted}`}>{a.contacts.length} contacts · {a.trips.length} trips</p>
//                     </div>
//                     {selectedId === a.id && (
//                       <svg className="ml-auto w-4 h-4 text-violet-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                         <polyline points="20 6 9 17 4 12" />
//                       </svg>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col gap-2">
//             {(agency?.contacts ?? [
//               { name: "Sarah Lee",  agency: "Global Travel Partners", activeTrips: 42, role: "Primary"      },
//               { name: "John Smith", agency: "City Events Agency",      activeTrips: 18, role: "Agency admin" },
//               { name: "Emily Chen", agency: "Asia Connect Travel",     activeTrips:  9, role: "Contact"      },
//             ]).map(c => (
//               <div key={c.name} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 transition-colors cursor-pointer ${inner} ${hoverRow}`}>
//                 <div>
//                   <p className="text-sm font-semibold">{c.name}</p>
//                   <p className={`text-xs ${muted}`}>{c.agency} · {c.activeTrips} active trips</p>
//                 </div>
//                 <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagCls}`}>{c.role}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={`col-span-3 rounded-2xl border p-5 transition-colors ${card}`}>
//           <p className="text-sm font-semibold mb-0.5">Trip filters</p>
//           <p className={`text-xs mb-4 ${muted}`}>Filter by period, status, payment and vehicle type.</p>

//           <div className="flex flex-wrap gap-2 mb-3">
//             <SelectField dark={dark} value={period}     onChange={setPeriod}
//               options={["Last 30 days", "Last 7 days", "Last 90 days", "This year"]} />
//             <SelectField dark={dark} value={tripStatus} onChange={setTripStatus}
//               options={["All trip statuses", "Completed", "Scheduled", "Cancelled", "In Progress"]} />
//             <SelectField dark={dark} value={payStatus}  onChange={setPayStatus}
//               options={["All payment statuses", "Paid", "Pending", "Not billed"]} />
//             <SelectField dark={dark} value={vehicle}    onChange={setVehicle}
//               options={["All vehicle types", "Business Sedan", "Van", "SUV"]} />
//           </div>

//           <div className="flex gap-2">
//             <div className="relative flex-1">
//               <input
//                 type="text"
//                 placeholder="Search by passenger, ref or city…"
//                 value={search}
//                 onChange={e => setSearch(e.target.value)}
//                 className={`w-full border rounded-lg pl-9 pr-3 py-2 text-sm outline-none transition-colors ${inputCls}`}
//               />
//               <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${muted}`}
//                 fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
//               </svg>
//             </div>
//             <button
//               onClick={() => { setPeriod("Last 30 days"); setTripStatus("All trip statuses"); setPayStatus("All payment statuses"); setVehicle("All vehicle types"); setSearch(""); }}
//               className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${btnGhost}`}
//             >
//               Reset
//             </button>
//             <button
//               className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
//               style={{ background: GRADIENT }}
//             >
//               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                 <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
//               </svg>
//               Apply filters
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className={`rounded-2xl border p-5 transition-colors ${card}`}>
//         <div className="flex items-start justify-between mb-4">
//           <div>
//             <p className="text-sm font-semibold mb-0.5">
//               Trips for selected agency
//               {agency && (
//                 <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
//                   {filteredTrips.length} result{filteredTrips.length !== 1 ? "s" : ""}
//                 </span>
//               )}
//             </p>
//             <p className={`text-xs ${muted}`}>Complete list of trips with status, payment and invoice info.</p>
//           </div>
//           <button className={`px-3.5 py-1.5 text-xs font-medium border rounded-lg transition-colors ${btnGhost}`}>
//             Export CSV
//           </button>
//         </div>

//         {agency ? (
//           <div className="overflow-hidden rounded-xl border border-inherit">
//             <table className="w-full text-sm border-collapse">
//               <thead>
//                 <tr className={theadCls}>
//                   {["Date & time", "From → To", "Passenger", "Vehicle", "Trip status", "Payment", "Amount", "Invoice"].map(h => (
//                     <th key={h} className={`px-3 py-2.5 text-left text-xs font-medium border-b ${divCls}`}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTrips.length === 0 ? (
//                   <tr>
//                     <td colSpan={8}>
//                       <div className={`flex flex-col items-center justify-center py-12 ${muted}`}>
//                         <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//                           <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
//                         </svg>
//                         <p className="text-sm font-medium">No trips match your filters</p>
//                         <p className="text-xs mt-1">Try adjusting or resetting the filters above</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredTrips.map((t, i) => (
//                   <tr key={i} className={`transition-colors cursor-pointer ${hoverRow} ${i < filteredTrips.length - 1 ? `border-b ${divCls}` : ""}`}>
//                     <td className={`px-3 py-3 text-xs whitespace-nowrap ${muted}`}>{t.datetime}</td>
//                     <td className="px-3 py-3 text-sm font-medium whitespace-nowrap">{t.route}</td>
//                     <td className="px-3 py-3 text-sm">{t.passenger}</td>
//                     <td className={`px-3 py-3 text-xs whitespace-nowrap ${muted}`}>{t.vehicle}</td>
//                     <td className="px-3 py-3">
//                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${TRIP_STATUS_STYLES[t.tripStatus]}`}>
//                         {t.tripStatus}
//                       </span>
//                     </td>
//                     <td className={`px-3 py-3 text-xs whitespace-nowrap ${PAY_STATUS_STYLES[t.payment]}`}>{t.payment}</td>
//                     <td className="px-3 py-3 text-sm font-bold font-mono whitespace-nowrap">{t.amount}</td>
//                     <td className={`px-3 py-3 text-xs font-semibold font-mono ${t.invoice !== "-" ? "text-violet-500" : muted}`}>
//                       {t.invoice}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className={`flex flex-col items-center justify-center py-16 rounded-xl border border-dashed ${emptyBox}`}>
//             <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//               <circle cx="12" cy="12" r="10" />
//               <path d="M8 12h8M12 8l4 4-4 4" />
//             </svg>
//             <p className="text-sm font-medium">No agency selected</p>
//             <p className="text-xs mt-1">Pick an agency above to see its trips</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState } from "react";

type TripStatus = "completed" | "scheduled" | "cancelled";
type PaymentStatus = "paid" | "pending" | "refunded";

interface Trip {
  id: string;
  date: string;
  time: string;
  from: string;
  to: string;
  passenger: string;
  ref: string;
  vehicle: string;
  vehicleModel: string;
  tripStatus: TripStatus;
  paymentStatus: PaymentStatus;
  amount: string;
}
interface TripsPageProps {
  dark: boolean;
}
const TRIPS: Trip[] = [
  { id: "1", date: "Mar 14, 2025", time: "09:30 AM", from: "CDG Airport", to: "Paris Center", passenger: "Emma Watson", ref: "#8452A", vehicle: "Business Sedan", vehicleModel: "Mercedes E-Class", tripStatus: "completed", paymentStatus: "paid", amount: "€240.00" },
  { id: "2", date: "Mar 16, 2025", time: "14:15 PM", from: "Lyon Station", to: "Geneva Center", passenger: "John Smith", ref: "#8429B", vehicle: "Luxury Van", vehicleModel: "V-Class", tripStatus: "scheduled", paymentStatus: "paid", amount: "€658.00" },
  { id: "3", date: "Mar 18, 2025", time: "17:45 PM", from: "Nice Airport", to: "Cannes", passenger: "Emily Chen", ref: "#8397C", vehicle: "Premium SUV", vehicleModel: "Range Rover", tripStatus: "scheduled", paymentStatus: "pending", amount: "€310.00" },
  { id: "4", date: "Mar 20, 2025", time: "12:05 PM", from: "Paris Center", to: "Brussels Airport", passenger: "Michael Scott", ref: "#8320D", vehicle: "Business Sedan", vehicleModel: "Audi A6", tripStatus: "cancelled", paymentStatus: "refunded", amount: "€0.00" },
];

const STATUS_STYLES: Record<TripStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-gray-200 text-gray-600",
};

export default function TripsPage({ dark }: TripsPageProps) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const filtered = TRIPS.filter((t) => {
    const matchStatus =
      statusFilter === "All" || t.tripStatus === statusFilter;
    const matchPayment =
      paymentFilter === "All" || t.paymentStatus === paymentFilter;
    return matchStatus && matchPayment;
  });

  return (
    <div className="min-h-screen bg-gray-150 from-gray-50 to-purple-50 p-10 space-y-10">

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Trips Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Monitor bookings, revenue and trip performance.
          </p>
        </div>

        <button className="px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
          style={{ background: "#7C3AED" }}>
          + New Trip
        </button>
      </header>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: "Total Trips", value: "1,248" },
          { label: "Completed", value: "982" },
          { label: "Scheduled", value: "245" },
          { label: "Revenue", value: "€42,850" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-4">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none"
        >
          <option value="All">All Status</option>
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none"
        >
          <option value="All">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Date", "Route","driver", "Passenger", "Vehicle", "Status", "Payment", "Amount"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-widest text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((trip) => (
              <tr
                key={trip.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-gray-900">
                    {trip.date}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {trip.time}
                  </p>
                </td>

                <td className="px-6 py-5 text-sm text-gray-700">
                  {trip.from} → {trip.to}
                </td>
 <td className="px-6 py-5 text-sm text-gray-700">
                  driver
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-gray-900">
                    {trip.passenger}
                  </p>
                  <p className="text-xs text-gray-400">
                    {trip.ref}
                  </p>
                </td>

                <td className="px-6 py-5 text-sm text-gray-700">
                  {trip.vehicle}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[trip.tripStatus]}`}
                  >
                    {trip.tripStatus}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${PAYMENT_STYLES[trip.paymentStatus]}`}
                  >
                    {trip.paymentStatus}
                  </span>
                </td>

                <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                  {trip.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}