import { NAV_ITEMS, NAV_SUPPORT, type NavItem } from "./constants";

interface SidebarProps {
  dark: boolean;
  onToggleDark: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

interface NavSectionProps {
  label: string;
  items: NavItem[];
  dark: boolean;
  activePage: string;
  onNavigate: (page: string) => void;
}

interface SidebarFooterProps {
  dark: boolean;
  onToggleDark: () => void;
}

export default function Sidebar({ dark, onToggleDark, activePage, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`w-60 min-h-screen sticky top-0 flex flex-col gap-4 px-3 py-4 border-r shrink-0 ${
        dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 pb-2">
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-bold text-base"
          style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}
        >
          A
        </div>
        <div>
          <div className="text-sm font-semibold leading-none">Admin Center</div>
          <div className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
            Web console
          </div>
        </div>
      </div>

      <NavSection label="Overview" items={NAV_ITEMS} dark={dark} activePage={activePage} onNavigate={onNavigate} />
      <NavSection label="Support & settings" items={NAV_SUPPORT} dark={dark} activePage={activePage} onNavigate={onNavigate} />

      <div className="flex-1" />
      <SidebarFooter dark={dark} onToggleDark={onToggleDark} />
    </aside>
  );
}

function NavSection({ label, items, dark, activePage, onNavigate }: NavSectionProps) {
  return (
    <div>
      <div className={`text-xs font-semibold uppercase tracking-widest px-2 mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>
        {label}
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = activePage === item.page;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page)}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-sm font-medium transition-all duration-200 w-full ${
                isActive
                  ? "text-white scale-[1.01]"
                  : dark
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              style={isActive ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)" } : {}}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SidebarFooter({ dark, onToggleDark }: SidebarFooterProps) {
  return (
    <div className={`pt-3 border-t ${dark ? "border-gray-800" : "border-gray-200"}`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-purple-200">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Alex Martin</div>
          <div className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>Super admin</div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onToggleDark}
            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors ${
              dark ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-200 bg-white text-gray-500"
            }`}
          >
            {dark ? "☀" : "🌙"}
          </button>
          <button className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${dark ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-200 bg-white text-gray-500"}`}>
            ↩
          </button>
        </div>
      </div>
    </div>
  );
}