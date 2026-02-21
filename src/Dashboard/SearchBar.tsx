import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [focused, setFocused] = useState(false);

  return (
    <div className="h-screen flex justify-center items-center bg-gray-600">
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          focused ? "w-64" : "w-12"
        }`}
      >
        <input
          type="text"
          placeholder="Search..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-full p-3 pl-4 pr-12 text-base outline-none border-none
                     placeholder:text-transparent focus:placeholder:text-gray-500"
        />

        <FaSearch
          className="absolute top-1/2 right-4 -translate-y-1/2 text-white animate-shake"
        />
      </div>
    </div>
  );
}