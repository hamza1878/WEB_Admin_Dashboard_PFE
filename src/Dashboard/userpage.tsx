import { USERS, STATUS_STYLES, type UserStatus } from "./constants";

interface UsersPageProps {
  dark: boolean;
  onSelectUser?: (name: string) => void;
}

const ROLE_STYLES: Record<string, string> = {
  Rider: "bg-blue-100 text-blue-700",
  Driver: "bg-violet-100 text-violet-700",
  Admin: "bg-gray-200 text-gray-700",
};

const ALL_USERS = [
  ...USERS,
  { name: "Aiko Tanaka", email: "aiko.t@example.com", role: "Driver", status: "active" as UserStatus, trips: 67 },
  { name: "Lucas Morel", email: "l.morel@example.com", role: "Rider", status: "active" as UserStatus, trips: 14 },
  { name: "Priya Nair", email: "priya.n@example.com", role: "Driver", status: "pending" as UserStatus, trips: 2 },
];

export default function UsersPage({ dark, onSelectUser }: UsersPageProps) {
  const card = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const divider = dark ? "border-gray-800" : "border-gray-100";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Users</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-500"}`}>
              {ALL_USERS.length} total
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${muted}`}>Manage riders, drivers and admins.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-medium"
          style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
          ＋ Add user
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total users", value: "128", sub: "+12 this week" },
          { label: "Active", value: "94", sub: "73% of total" },
          { label: "Pending", value: "17", sub: "Awaiting review" },
          { label: "Blocked", value: "7", sub: "Requires action" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-3 flex flex-col gap-1 ${card}`}>
            <span className={`text-xs ${muted}`}>{s.label}</span>
            <span className="text-xl font-semibold">{s.value}</span>
            <span className={`text-xs ${muted}`}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`rounded-xl border ${card}`}>
        {/* Toolbar */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${divider}`}>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs w-48 ${dark ? "bg-gray-800 border-gray-700 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
            🔍 Search users…
          </div>
          <div className="flex items-center gap-1.5">
            {["All", "Riders", "Drivers", "Admins"].map((f, i) => (
              <button key={f} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${i === 0 ? "text-white" : dark ? "text-gray-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
                style={i === 0 ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)" } : {}}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className={`grid text-xs font-medium px-4 py-2 ${muted} border-b ${divider}`}
          style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 0.7fr 0.5fr" }}>
          <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span>Trips</span><span></span>
        </div>

        {/* Rows */}
        {ALL_USERS.map((user, i) => (
          <div key={user.name}
            onClick={() => onSelectUser?.(user.name)}
            className={`grid px-4 py-3 text-xs items-center cursor-pointer transition-colors ${dark ? "hover:bg-gray-800" : "hover:bg-violet-50"} ${i > 0 ? `border-t ${divider}` : ""}`}
            style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr 0.7fr 0.5fr" }}>
            <div className="flex items-center gap-2">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-6 h-6 rounded-full bg-violet-100 shrink-0" />
              <span className="font-medium">{user.name}</span>
            </div>
            <span className={muted}>{user.email}</span>
            <span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[user.role]}`}>{user.role}</span></span>
            <span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[user.status]}`}>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></span>
            <span className="font-medium">{user.trips}</span>
            <button className="text-violet-500 hover:text-violet-400 text-xs">View →</button>
          </div>
        ))}
      </div>
    </div>
  );
}