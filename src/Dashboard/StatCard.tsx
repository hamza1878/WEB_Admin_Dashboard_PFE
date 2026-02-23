interface StatCardProps {
  title: string;
  value: string;
  tag: string;
  trend: string;
  note: string;
  warning: boolean;
  dark: boolean;
}

export default function StatCard({ title, value, tag, trend, note, warning, dark }: StatCardProps) {
  return (
    <div
      className={` bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300flex flex-col gap-2 ${
        dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
          {title}
        </span>
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full ${
            dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
          }`}
        >
          {tag}
        </span>
      </div>

      <div className="text-xl font-semibold">{value}</div>

      <div className={`text-xs flex gap-1 ${warning ? "text-amber-400" : "text-emerald-500"}`}>
        <span>{trend}</span>
        <span className={dark ? "text-gray-500" : "text-gray-400"}>{note}</span>
      </div>
    </div>
  );
}
