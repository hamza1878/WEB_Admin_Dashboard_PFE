import { useState } from "react";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";
import StatsRow from "./StatsRow.tsx";
import UsersTable from "./UsersTable.tsx";
import SystemStatus from "./SystemStatus.tsx";

export default function AdminDashboard() {
  const [dark, setDark] = useState(false);

  return (
    <div
      className={`flex min-h-screen text-sm ${
        dark ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Sidebar dark={dark} onToggleDark={() => setDark(!dark)} />

      <main className="flex-1 flex flex-col gap-4 p-5 min-w-0">
        <Header dark={dark} />
        <StatsRow dark={dark} />

        {/* Bottom grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1.3fr" }}>
          <UsersTable dark={dark} />
          <SystemStatus dark={dark} />
        </div>
      </main>
    </div>
  );
}
