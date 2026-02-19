import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsRow from "./StatsRow";
import UsersTable from "./UsersTable";
import SystemStatus from "./SystemStatus";
import UsersPage from "./userpage";

import UsersCreate from "./UsersCreate";

// Pages order — used to determine slide direction
const PAGE_ORDER = ["dashboard", "users", "trips", "payments", "help", "settings", "security"];

interface PageProps {
  dark: boolean;
  onSelectUser?: (name: string) => void;
  onNavigate?: (page: string) => void;
}

function PlaceholderPage({ dark, title, icon, description }: { dark: boolean; title: string; icon: string; description: string }) {
  return (
    <div className="flex p-4 flex-col items-center justify-center flex-1 gap-3 py-24">
      <div className="text-5xl">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>{description}</p>
    </div>
  );
}

function renderPage(page: string, props: PageProps) {
  switch (page) {
    case "dashboard":
      return (
        <>
          <Header dark={props.dark} />
          <StatsRow dark={props.dark} />
          <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1.3fr" }}>
            <UsersTable dark={props.dark} onSelectUser={props.onSelectUser} />
            <SystemStatus dark={props.dark} />
          </div>
        </>
      );
    case "users":
      return <UsersPage dark={props.dark} onSelectUser={props.onSelectUser} />;
    case "trips":
      return <UsersPage dark={props.dark} />;
    case "payments":
      return <UsersPage dark={props.dark} />;
    case "help":
      return <PlaceholderPage dark={props.dark} title="Help center" icon="🎧" description="Browse docs, open tickets and contact support." />;
    case "settings":
      return <PlaceholderPage dark={props.dark} title="Settings" icon="⚙️" description="Configure your admin preferences." />;
    case "security":
      return <PlaceholderPage dark={props.dark} title="Security" icon="🛡" description="Manage permissions, 2FA and audit logs." />;
    default:
      return null;
  }
}

export default function AdminDashboard() {
  const [dark, setDark] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // For slide animation
  const [displayPage, setDisplayPage] = useState("dashboard");
  const [slideClass, setSlideClass] = useState("");
  const prevPageRef = useRef("dashboard");

  const navigate = (page: string) => {
    if (page === activePage) return;

    const prevIdx = PAGE_ORDER.indexOf(prevPageRef.current);
    const nextIdx = PAGE_ORDER.indexOf(page);
    const direction = nextIdx >= prevIdx ? "left" : "right";

    // Animate out
    setSlideClass(direction === "left" ? "animate-slide-out-left" : "animate-slide-out-right");

    setTimeout(() => {
      prevPageRef.current = page;
      setDisplayPage(page);
      setActivePage(page);
      setSelectedUser(null);
      setSlideClass(direction === "left" ? "animate-slide-in-right" : "animate-slide-in-left");
    }, 180);

    setTimeout(() => setSlideClass(""), 360);
  };

  return (
    <>
      <style>{`
        @keyframes slideOutLeft  { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(-28px); } }
        @keyframes slideOutRight { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(28px); } }
        @keyframes slideInRight  { from { opacity:0; transform:translateX(28px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInLeft   { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:translateX(0); } }
        .animate-slide-out-left  { animation: slideOutLeft  0.18s ease forwards; }
        .animate-slide-out-right { animation: slideOutRight 0.18s ease forwards; }
        .animate-slide-in-right  { animation: slideInRight  0.18s ease forwards; }
        .animate-slide-in-left   { animation: slideInLeft   0.18s ease forwards; }
      `}</style>

      <div
        className={`flex min-h-screen text-sm overflow-hidden ${dark ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Sidebar */}
        <Sidebar
          dark={dark}
          onToggleDark={() => setDark(!dark)}
          activePage={activePage}
          onNavigate={navigate}
        />

        {/* Content area */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* Main page — shrinks when panel open */}
          <main
            className={`flex flex-col gap-4 p-6 min-w-0 overflow-y-auto transition-all duration-300 ease-in-out ${
              selectedUser ? "w-1/2" : "w-full"
            }`}
          >
            <div className={slideClass}>
              {renderPage(displayPage, {
                dark,
                onSelectUser: (name) => setSelectedUser(name),
                onNavigate: navigate,
              })}
            </div>
          </main>

          {/* Sliding panel */}
          <aside
            className={`transition-all duration-300 ease-in-out overflow-y-auto border-l ${
              dark ? "border-gray-800" : "border-gray-200"
            } ${selectedUser ? "w-1/2 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}
          >
            {selectedUser && (
              <UsersCreate
                dark={dark}
                prefillName={selectedUser}
                onClose={() => setSelectedUser(null)}
              />
            )}
          </aside>
        </div>
      </div>
    </>
  );
}