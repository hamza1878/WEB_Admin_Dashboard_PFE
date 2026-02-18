interface HeaderProps {
  dark: boolean;
}

export default function Header({ dark }: HeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      {/* Left: title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Admin dashboard</h1>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: "#a855f720", color: "#a855f7" }}
          >
            ● Live
          </span>
        </div>
        <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
          Monitor trips, users and payments in real time.
        </p>
      </div>

      {/* Right: search + action */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs min-w-48 cursor-text ${
            dark
              ? "bg-gray-800 border-gray-700 text-gray-400"
              : "bg-white border-gray-200 text-gray-400"
          }`}
        >
          🔍 Search users, trips, IDs…
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white text-xs font-medium"
          style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}
        >
          ＋ New manual booking
        </button>
      </div>
    </div>
  );
}
