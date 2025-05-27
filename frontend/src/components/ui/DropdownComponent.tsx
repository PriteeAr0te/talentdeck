"use client";

import { useEffect, useRef, useState } from "react";
import {
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

// ✅ 1. Add a generic type with constraint Record<string, any>
interface DropdownComponentProps<T extends Record<string, unknown>> {
  name: Path<T>;
  label?: string;
  setValue: UseFormSetValue<T>;
  watch?: UseFormWatch<T>;
  options: string[];
  error?: string;
}

function DropdownComponent<T extends Record<string, unknown>>({
  name,
  label,
  setValue,
  watch,
  options,
  error,
}: DropdownComponentProps<T>) {
  const [selected, setSelected] = useState<string>("Select a category");
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    if (watch) {
      const value = watch(name);
      if (typeof value === "string") {
        setSelected(value);
      }
    }
  }, [watch, name]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        detailsRef.current.removeAttribute("open");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    setValue(name, option as PathValue<T, typeof name>);
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-base font-medium text-black mb-2">
          {label}
        </label>
      )}

      <details
        ref={detailsRef}
        className="w-full cursor-pointer border border-gray-300 rounded-lg bg-white dark:bg-[#0A0011] relative z-10"
      >
        <summary className="list-none px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0A0011] hover:bg-background-hover rounded-lg dark:hover:bg-[#0A0011]">
          {selected}
        </summary>

        <ul className="w-full border-t text-black border-gray-300 bg-white dark:bg-[#0A0011] shadow-md rounded-b-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              className={`px-4 py-2 text-gray-800 cursor-pointer dark:text-gray-300 ${
                selected === option
                  ? "bg-background-active font-semibold"
                  : "hover:bg-background-hover"
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </details>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default DropdownComponent;
