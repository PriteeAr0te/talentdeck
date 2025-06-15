"use client";

import { useEffect, useRef, useState } from "react";
import {
  UseFormSetValue,
  UseFormWatch,
  Path,
  PathValue,
  FieldValues,
} from "react-hook-form";

interface DropdownComponentProps<FormValues extends FieldValues> {
  name: Path<FormValues>;
  label?: string;
  options: string[];
  setValue: UseFormSetValue<FormValues>;
  watch?: UseFormWatch<FormValues>;
  error?: string;
}

function DropdownComponent<FormValues extends FieldValues>({
  name,
  label,
  options,
  setValue,
  watch,
  error,
}: DropdownComponentProps<FormValues>) {
  const [selected, setSelected] = useState("Select an option");
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (watch) {
      const value = watch(name);
      if (typeof value === "string") {
        setSelected(value);
      }
    }
  }, [watch, name]);

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        dropdownRef.current.open = false;
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    setValue(name, option as PathValue<FormValues, typeof name>);
    if (dropdownRef.current) {
      dropdownRef.current.open = false;
    }
  };

  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="block text-base font-medium text-black mb-2 dark:text-white">
          {label}
        </label>
      )}

      <details
        ref={dropdownRef}
        className="w-full cursor-pointer border border-gray-300 rounded-lg bg-white dark:bg-[#0A0011] relative z-10"
      >
        <summary className="list-none px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0A0011] hover:bg-background-hover rounded-lg dark:hover:bg-[#0A0011]">
          {selected}
        </summary>

        <ul className="w-full border-t text-black border-gray-300 bg-white dark:bg-[#0A0011] shadow-md rounded-b-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              className={`px-4 py-2 cursor-pointer dark:text-gray-300 ${
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
