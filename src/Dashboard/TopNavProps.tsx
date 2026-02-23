interface TopNavProps {
  onSearch?: (q: string) => void;
}

export default function TravelSyncTopNav({ onSearch }: TopNavProps) {
  return (
    <nav className="w-full h-12 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-2xl flex items-center justify-center text-white font-bold text-base" style={{ background: "#9d73ff" }}>
          T
        </div>
        <span className="text-base font-semibold text-gray-900 tracking-tight">TravelSync Agency</span>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="w-[420px] h-10 bg-white border border-gray-200 rounded-full flex items-center px-4 gap-3 text-gray-400 text-sm cursor-text">
          <span>🔍</span>
          <span>Search trips, passengers, or references...</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          🔔
        </button>
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-purple-100">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah Lee" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 leading-none">Sarah Lee</span>
            <span className="text-xs text-gray-400 mt-0.5">Agency Manager</span>
          </div>
          <span className="text-gray-400 text-xs ml-1">▾</span>
        </div>
      </div>
    </nav>
  );
}