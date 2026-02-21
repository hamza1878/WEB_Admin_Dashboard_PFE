import { useState } from "react";

type TicketStatus = "Open" | "Waiting for user" | "Resolved";

interface Message {
  from: "user" | "admin";
  author: string;
  time: string;
  content: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: string;
  user: string;
  agency: string;
  time: string;
  channel: string;
  messages: Message[];
  userInfo: {
    name: string;
    role: string;
    since: string;
    email: string;
    phone: string;
    agencyEmail: string;
  };
  tripInfo: {
    agency: string;
    tripId: string;
    payment: string;
    date: string;
    route: string;
    price: string;
    currentStatus: string;
  };
}

interface HelpCenterProps {
  dark: boolean;
}

const TICKETS: Ticket[] = [
  {
    id: "3241",
    subject: "Payment failed for airport transfer",
    status: "Open",
    priority: "High",
    user: "Sarah Lee",
    agency: "SkyRide",
    time: "5 min ago",
    channel: "In-app chat",
    messages: [
      { from: "user",  author: "Sarah Lee",    time: "09:21", content: "Hi, my card is not working when I try to pay for my trip to the airport." },
      { from: "admin", author: "Alex (Admin)", time: "09:23", content: "Hello Sarah, I can help you with that. Can you confirm if you tried another card or payment method?" },
      { from: "user",  author: "Sarah Lee",    time: "09:24", content: "I tried two cards. Both fail with the same error." },
    ],
    userInfo: { name: "Sarah Lee", role: "User", since: "2023", email: "sarah.lee@example.com", phone: "+33 6 12 34 56 78", agencyEmail: "support@skyride.com" },
    tripInfo: { agency: "SkyRide", tripId: "TR-98214", payment: "Visa", date: "12 Mar 2025 · 08:30", route: "City center → Airport", price: "€48.00", currentStatus: "Payment failed" },
  },
  {
    id: "3238",
    subject: "Driver did not arrive on time",
    status: "Waiting for user",
    priority: "Medium",
    user: "Ahmed Y.",
    agency: "CityMove",
    time: "18 min ago",
    channel: "In-app chat",
    messages: [
      { from: "user",  author: "Ahmed Y.",      time: "09:05", content: "My driver was 25 minutes late and I missed my flight." },
      { from: "admin", author: "Alex (Admin)",  time: "09:10", content: "I'm very sorry to hear that. Can you share your flight booking reference so I can assess compensation?" },
    ],
    userInfo: { name: "Ahmed Y.", role: "User", since: "2022", email: "ahmed.y@example.com", phone: "+33 7 98 76 54 32", agencyEmail: "support@citymove.com" },
    tripInfo: { agency: "CityMove", tripId: "TR-97890", payment: "Mastercard", date: "11 Mar 2025 · 06:00", route: "Hotel Lumière → CDG", price: "€62.00", currentStatus: "Completed (delayed)" },
  },
  {
    id: "3231",
    subject: "Need invoice for business trip",
    status: "Resolved",
    priority: "Low",
    user: "Maria G.",
    agency: "EuroCab",
    time: "1 h ago",
    channel: "Email",
    messages: [
      { from: "user",  author: "Maria G.",      time: "08:00", content: "Could you please send me a proper invoice for trip TR-97650? I need it for my expense report." },
      { from: "admin", author: "Alex (Admin)",  time: "08:15", content: "Of course! I've just generated invoice #INV-9201 and sent it to your email. Let me know if anything is missing." },
      { from: "user",  author: "Maria G.",      time: "08:20", content: "Perfect, received it. Thank you!" },
    ],
    userInfo: { name: "Maria G.", role: "Agency admin", since: "2021", email: "maria.g@eurocab.com", phone: "+39 3 11 22 33 44", agencyEmail: "billing@eurocab.com" },
    tripInfo: { agency: "EuroCab", tripId: "TR-97650", payment: "Wire transfer", date: "08 Mar 2025 · 14:00", route: "Rome Termini → FCO", price: "€95.00", currentStatus: "Completed" },
  },
  {
    id: "3229",
    subject: "Can't login to admin account",
    status: "Open",
    priority: "High",
    user: "Olivia",
    agency: "Premium Rides",
    time: "2 h ago",
    channel: "In-app chat",
    messages: [
      { from: "user",  author: "Olivia",        time: "07:45", content: "I've been locked out of my admin account since yesterday. Password reset email never arrives." },
      { from: "admin", author: "Alex (Admin)",  time: "07:55", content: "Hi Olivia, let me check your account on our end. Can you confirm the email address you're using?" },
      { from: "user",  author: "Olivia",        time: "08:00", content: "olivia@premiumrides.com" },
    ],
    userInfo: { name: "Olivia", role: "Agency admin", since: "2022", email: "olivia@premiumrides.com", phone: "+44 7 700 900 461", agencyEmail: "it@premiumrides.com" },
    tripInfo: { agency: "Premium Rides", tripId: "—", payment: "—", date: "—", route: "—", price: "—", currentStatus: "Account locked" },
  },
   {
    id: "3241",
    subject: "Payment failed for airport transfer",
    status: "Open",
    priority: "High",
    user: "Sarah Lee",
    agency: "SkyRide",
    time: "5 min ago",
    channel: "In-app chat",
    messages: [
      { from: "user",  author: "Sarah Lee",    time: "09:21", content: "Hi, my card is not working when I try to pay for my trip to the airport." },
      { from: "admin", author: "Alex (Admin)", time: "09:23", content: "Hello Sarah, I can help you with that. Can you confirm if you tried another card or payment method?" },
      { from: "user",  author: "Sarah Lee",    time: "09:24", content: "I tried two cards. Both fail with the same error." },
    ],
    userInfo: { name: "Sarah Lee", role: "User", since: "2023", email: "sarah.lee@example.com", phone: "+33 6 12 34 56 78", agencyEmail: "support@skyride.com" },
    tripInfo: { agency: "SkyRide", tripId: "TR-98214", payment: "Visa", date: "12 Mar 2025 · 08:30", route: "City center → Airport", price: "€48.00", currentStatus: "Payment failed" },
  },
  {
    id: "3238",
    subject: "Driver did not arrive on time",
    status: "Waiting for user",
    priority: "Medium",
    user: "Ahmed Y.",
    agency: "CityMove",
    time: "18 min ago",
    channel: "In-app chat",
    messages: [
      { from: "user",  author: "Ahmed Y.",      time: "09:05", content: "My driver was 25 minutes late and I missed my flight." },
      { from: "admin", author: "Alex (Admin)",  time: "09:10", content: "I'm very sorry to hear that. Can you share your flight booking reference so I can assess compensation?" },
    ],
    userInfo: { name: "Ahmed Y.", role: "User", since: "2022", email: "ahmed.y@example.com", phone: "+33 7 98 76 54 32", agencyEmail: "support@citymove.com" },
    tripInfo: { agency: "CityMove", tripId: "TR-97890", payment: "Mastercard", date: "11 Mar 2025 · 06:00", route: "Hotel Lumière → CDG", price: "€62.00", currentStatus: "Completed (delayed)" },
  },
  {
    id: "3231",
    subject: "Need invoice for business trip",
    status: "Resolved",
    priority: "Low",
    user: "Maria G.",
    agency: "EuroCab",
    time: "1 h ago",
    channel: "Email",
    messages: [
      { from: "user",  author: "Maria G.",      time: "08:00", content: "Could you please send me a proper invoice for trip TR-97650? I need it for my expense report." },
      { from: "admin", author: "Alex (Admin)",  time: "08:15", content: "Of course! I've just generated invoice #INV-9201 and sent it to your email. Let me know if anything is missing." },
      { from: "user",  author: "Maria G.",      time: "08:20", content: "Perfect, received it. Thank you!" },
    ],
    userInfo: { name: "Maria G.", role: "Agency admin", since: "2021", email: "maria.g@eurocab.com", phone: "+39 3 11 22 33 44", agencyEmail: "billing@eurocab.com" },
    tripInfo: { agency: "EuroCab", tripId: "TR-97650", payment: "Wire transfer", date: "08 Mar 2025 · 14:00", route: "Rome Termini → FCO", price: "€95.00", currentStatus: "Completed" },
  },
  {
    id: "3229",
    subject: "Can't login to admin account",
    status: "Open",
    priority: "High",
    user: "Olivia",
    agency: "Premium Rides",
    time: "2 h ago",
    channel: "In-app chat",
    messages: [
      { from: "user",  author: "Olivia",        time: "07:45", content: "I've been locked out of my admin account since yesterday. Password reset email never arrives." },
      { from: "admin", author: "Alex (Admin)",  time: "07:55", content: "Hi Olivia, let me check your account on our end. Can you confirm the email address you're using?" },
      { from: "user",  author: "Olivia",        time: "08:00", content: "olivia@premiumrides.com" },
    ],
    userInfo: { name: "Olivia", role: "Agency admin", since: "2022", email: "olivia@premiumrides.com", phone: "+44 7 700 900 461", agencyEmail: "it@premiumrides.com" },
    tripInfo: { agency: "Premium Rides", tripId: "—", payment: "—", date: "—", route: "—", price: "—", currentStatus: "Account locked" },
  },
   {
    id: "3241",
    subject: "Payment failed for airport transfer",
    status: "Open",
    priority: "High",
    user: "Sarah Lee",
    agency: "SkyRide",
    time: "5 min ago",
    channel: "In-app chat",
    messages: [
      { from: "user",  author: "Sarah Lee",    time: "09:21", content: "Hi, my card is not working when I try to pay for my trip to the airport." },
      { from: "admin", author: "Alex (Admin)", time: "09:23", content: "Hello Sarah, I can help you with that. Can you confirm if you tried another card or payment method?" },
      { from: "user",  author: "Sarah Lee",    time: "09:24", content: "I tried two cards. Both fail with the same error." },
    ],
    userInfo: { name: "Sarah Lee", role: "User", since: "2023", email: "sarah.lee@example.com", phone: "+33 6 12 34 56 78", agencyEmail: "support@skyride.com" },
    tripInfo: { agency: "SkyRide", tripId: "TR-98214", payment: "Visa", date: "12 Mar 2025 · 08:30", route: "City center → Airport", price: "€48.00", currentStatus: "Payment failed" },
  },
  {
    id: "3238",
    subject: "Driver did not arrive on time",
    status: "Waiting for user",
    priority: "Medium",
    user: "Ahmed Y.",
    agency: "CityMove",
    time: "18 min ago",
    channel: "In-app chat",
    messages: [
      { from: "user",  author: "Ahmed Y.",      time: "09:05", content: "My driver was 25 minutes late and I missed my flight." },
      { from: "admin", author: "Alex (Admin)",  time: "09:10", content: "I'm very sorry to hear that. Can you share your flight booking reference so I can assess compensation?" },
    ],
    userInfo: { name: "Ahmed Y.", role: "User", since: "2022", email: "ahmed.y@example.com", phone: "+33 7 98 76 54 32", agencyEmail: "support@citymove.com" },
    tripInfo: { agency: "CityMove", tripId: "TR-97890", payment: "Mastercard", date: "11 Mar 2025 · 06:00", route: "Hotel Lumière → CDG", price: "€62.00", currentStatus: "Completed (delayed)" },
  },
  {
    id: "3231",
    subject: "Need invoice for business trip",
    status: "Resolved",
    priority: "Low",
    user: "Maria G.",
    agency: "EuroCab",
    time: "1 h ago",
    channel: "Email",
    messages: [
      { from: "user",  author: "Maria G.",      time: "08:00", content: "Could you please send me a proper invoice for trip TR-97650? I need it for my expense report." },
      { from: "admin", author: "Alex (Admin)",  time: "08:15", content: "Of course! I've just generated invoice #INV-9201 and sent it to your email. Let me know if anything is missing." },
      { from: "user",  author: "Maria G.",      time: "08:20", content: "Perfect, received it. Thank you!" },
    ],
    userInfo: { name: "Maria G.", role: "Agency admin", since: "2021", email: "maria.g@eurocab.com", phone: "+39 3 11 22 33 44", agencyEmail: "billing@eurocab.com" },
    tripInfo: { agency: "EuroCab", tripId: "TR-97650", payment: "Wire transfer", date: "08 Mar 2025 · 14:00", route: "Rome Termini → FCO", price: "€95.00", currentStatus: "Completed" },
  },
  {
    id: "3229",
    subject: "Can't login to admin account",
    status: "Open",
    priority: "High",
    user: "Olivia",
    agency: "Premium Rides",
    time: "2 h ago",
    channel: "In-app chat",
    messages: [
      { from: "user",  author: "Olivia",        time: "07:45", content: "I've been locked out of my admin account since yesterday. Password reset email never arrives." },
      { from: "admin", author: "Alex (Admin)",  time: "07:55", content: "Hi Olivia, let me check your account on our end. Can you confirm the email address you're using?" },
      { from: "user",  author: "Olivia",        time: "08:00", content: "olivia@premiumrides.com" },
    ],
    userInfo: { name: "Olivia", role: "Agency admin", since: "2022", email: "olivia@premiumrides.com", phone: "+44 7 700 900 461", agencyEmail: "it@premiumrides.com" },
    tripInfo: { agency: "Premium Rides", tripId: "—", payment: "—", date: "—", route: "—", price: "—", currentStatus: "Account locked" },
  },
];

const STATUS_PILL: Record<TicketStatus, string> = {
  "Open":             "bg-amber-100 text-amber-700",
  "Waiting for user": "bg-gray-100 text-gray-500",
  "Resolved":         "bg-emerald-100 text-emerald-700",
};

const GRADIENT = "linear-gradient(135deg,#8b5cf6,#6d28d9)";

function InitialAvatar({ name, md }: { name: string; md?: boolean }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const sz = md ? "w-8 h-8 text-sm" : "w-6 h-6 text-xs";
  const palettes = ["from-violet-500 to-purple-700", "from-blue-500 to-indigo-600", "from-teal-500 to-emerald-600", "from-orange-500 to-amber-500"];
  const palette = palettes[name.charCodeAt(0) % palettes.length];
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${palette} flex items-center justify-center text-white font-bold shrink-0`}>
      {initials}
    </div>
  );
}

export default function HelpCenter({ dark }: HelpCenterProps) {
  const [activeFilter, setActiveFilter]     = useState("Open");
  const [selected, setSelected]             = useState<Ticket>(TICKETS[0]);
  const [search, setSearch]                 = useState("");
  const [reply, setReply]                   = useState("");
  const [note, setNote]                     = useState("");

  const page        = dark ? "bg-gray-950 text-gray-100"   : "bg-stone-100 text-gray-900";
  const card        = dark ? "bg-gray-900 border-gray-800"  : "bg-white border-gray-200";
  const inner       = dark ? "bg-gray-800 border-gray-700"  : "bg-stone-50 border-stone-200";
  const muted       = dark ? "text-gray-400"                : "text-gray-500";
  const divider     = dark ? "border-gray-800"              : "border-gray-100";
  const inputCls    = dark
    ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-violet-500"
    : "bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-violet-400";
  const ghostBtn    = dark
    ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50";
  const userBubble  = dark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-stone-100 border-stone-200 text-gray-800";
  const ticketHover = dark ? "hover:bg-gray-800" : "hover:bg-stone-50";
  const ticketActive = dark ? "bg-violet-900/30 border-violet-600" : "bg-violet-50 border-violet-400";
  const ticketBase   = dark ? "bg-gray-800 border-gray-700" : "bg-stone-50 border-stone-200";

  const filters = ["Open", "Waiting for user", "Resolved", "All"];

  const filtered = TICKETS.filter(t => {
    const statusOk = activeFilter === "All" || t.status === activeFilter;
    const searchOk = !search || [t.subject, t.user, t.id, t.agency].some(v => v.toLowerCase().includes(search.toLowerCase()));
    return statusOk && searchOk;
  });

  return (
    <div className={`min-h-screen p-5 transition-colors duration-300 ${page}`}>


      <div className="grid gap-4" style={{ gridTemplateColumns: "260px 1fr 300px" }}>

        <div className={`rounded-2xl border p-4 flex flex-col gap-3 ${card}`}>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold leading-tight">Tickets</p>
              <p className={`text-xs ${muted}`}>All problems reported by users and agencies.</p>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
              {TICKETS.filter(t => t.status === "Open").length} open
            </span>
          </div>

          <div className="relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by user, email or ticket ID"
              className={`w-full border rounded-lg pl-8 pr-3 py-2 text-xs outline-none transition-colors ${inputCls}`}
            />
            <svg className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${muted}`}
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  activeFilter === f
                    ? "text-white"
                    : dark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                style={activeFilter === f ? { background: GRADIENT } : {}}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto  max-h-[1/2] "   >
            {filtered.map(t => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`w-full text-left rounded-xl border p-3 transition-colors ${
                  selected.id === t.id ? ticketActive : `${ticketBase} ${ticketHover}`
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-xs font-semibold line-clamp-2 leading-snug flex-1">{t.subject}</p>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_PILL[t.status]}`}>
                    {t.status}
                  </span>
                </div>
                <p className={`text-xs truncate ${muted}`}>User: {t.user} · Agency: {t.agency}</p>
                <p className={`text-xs mt-0.5 ${muted}`}>{t.time}</p>
              </button>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border flex flex-col ${card}`} style={{ minHeight: "600px" }}>

          <div className={`px-5 py-4 border-b ${divider}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold mb-0.5">
                  #{selected.id} · {selected.subject}
                </p>
                <p className={`text-xs mb-2 ${muted}`}>
                  Chat with {selected.userInfo.name} to solve their problem.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_PILL[selected.status]}`}>
                    {selected.status}
                  </span>
                  <span className={`text-xs ${muted}`}>Priority: <strong className="text-orange-500">{selected.priority}</strong></span>
                  <span className={`text-xs ${muted}`}>Channel: {selected.channel}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${ghostBtn}`}>
                  Mark as resolved
                </button>
                <button className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${ghostBtn}`}>
                  Assign to admin
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 px-5 py-4 flex flex-col gap-4 overflow-y-auto">
            {selected.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.from === "admin" ? "self-end flex-row-reverse" : "self-start"} max-w-[80%]`}
              >
                <InitialAvatar name={msg.author} />
                <div>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed border ${
                      msg.from === "admin"
                        ? "text-white rounded-tr-sm border-transparent"
                        : `${userBubble} rounded-tl-sm`
                    }`}
                    style={msg.from === "admin" ? { background: GRADIENT } : {}}
                  >
                    {msg.content}
                  </div>
                  <p className={`text-xs mt-1 ${muted} ${msg.from === "admin" ? "text-right" : ""}`}>
                    {msg.author} · {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={`px-5 py-4 border-t ${divider}`}>
            <textarea
              rows={3}
              placeholder="Type your reply to the user, or use a saved response template."
              value={reply}
              onChange={e => setReply(e.target.value)}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors mb-3 ${inputCls}`}
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className={`w-8 h-8 flex items-center justify-center border rounded-full transition-colors ${ghostBtn}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                <button className={`w-8 h-8 flex items-center justify-center border rounded-full transition-colors ${ghostBtn}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              </div>
              <button
                disabled={!reply.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
                style={{ background: GRADIENT }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Send reply
              </button>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border p-4 flex flex-col gap-4 overflow-y-auto ${card}`} style={{ maxHeight: "720px" }}>

          <div>
            <p className="text-sm font-semibold mb-0.5">User &amp; trip summary</p>
            <p className={`text-xs mb-3 ${muted}`}>Key information to resolve the problem quickly.</p>

            <div className="flex items-center gap-3 mb-3">
              <InitialAvatar name={selected.userInfo.name} md />
              <div>
                <p className="text-sm font-semibold">{selected.userInfo.name}</p>
                <p className={`text-xs ${muted}`}>{selected.userInfo.role} · Member since {selected.userInfo.since}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                `Agency: ${selected.tripInfo.agency}`,
                `Trip ID: ${selected.tripInfo.tripId}`,
                `Payment method: ${selected.tripInfo.payment}`,
              ].map(chip => (
                <span key={chip} className={`text-xs px-2.5 py-1 rounded-full ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-500"}`}>
                  {chip}
                </span>
              ))}
            </div>

            <div className={`rounded-xl border p-3 flex flex-col gap-2 ${inner}`}>
              {[
                { label: "Trip date",      value: selected.tripInfo.date          },
                { label: "Route",          value: selected.tripInfo.route         },
                { label: "Total price",    value: selected.tripInfo.price         },
                { label: "Current status", value: selected.tripInfo.currentStatus },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center text-xs gap-2">
                  <span className={muted}>{row.label}</span>
                  <span className="font-semibold text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`border-t ${divider}`} />

          <div>
            <p className="text-sm font-semibold mb-0.5">Contact options</p>
            <p className={`text-xs mb-3 ${muted}`}>Reach the user or related admin if needed.</p>

            <div className={`rounded-xl border p-3 flex flex-col gap-2 mb-3 ${inner}`}>
              {[
                { label: "User email",   value: selected.userInfo.email       },
                { label: "User phone",   value: selected.userInfo.phone       },
                { label: "Agency admin", value: selected.userInfo.agencyEmail },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-start text-xs gap-2">
                  <span className={`shrink-0 ${muted}`}>{row.label}</span>
                  <span className="font-semibold text-right break-all">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {["Call user", "Email user", "Contact agency admin"].map(action => (
                <button key={action} className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${ghostBtn}`}>
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className={`border-t ${divider}`} />

          <div>
            <p className="text-sm font-semibold mb-0.5">Internal note</p>
            <p className={`text-xs mb-3 ${muted}`}>Share information with other admins. User cannot see this.</p>
            <textarea
              rows={3}
              placeholder="Add an internal note about this problem for your admin team."
              value={note}
              onChange={e => setNote(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2.5 text-xs outline-none resize-none transition-colors ${inputCls}`}
            />
            <button
              disabled={!note.trim()}
              className="mt-2 w-full py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
              style={{ background: GRADIENT }}
            >
              Save note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}