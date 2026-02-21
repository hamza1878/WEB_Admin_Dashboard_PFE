import { useState } from "react";

interface HeaderProps {
  dark: boolean;
}

export default function Header({ dark }: HeaderProps) {
    const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Admin dashboard</h1>
         <span
  className="text-xs font-medium px-2 py-0.5 rounded-full
             bg-purple-500/20 text-purple-500
             transition-all duration-200
             hover:bg-purple-600 hover:text-white"
>
  ● Live
</span>
        </div>
        <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
          Monitor trips, users and payments in real time.
        </p>
      </div>

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
  onClick={() => setShowModal(true)}
  className="group flex items-center overflow-hidden
             w-10 hover:w-48 focus:w-48
             transition-all duration-300 ease-in-out
             px-3 py-2 rounded-full text-white text-sm font-medium
             bg-gradient-to-r from-purple-500 to-purple-700"
>
  <span className="text-lg leading-none">＋</span>

  <span
    className="ml-2 whitespace-nowrap opacity-0
               group-hover:opacity-100 group-focus:opacity-100
               transition-opacity duration-200"
  >
          New manual booking
  </span>
</button>
      </div>
    </div>
  );
}
