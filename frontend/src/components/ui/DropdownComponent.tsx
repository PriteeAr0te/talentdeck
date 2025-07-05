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
  width?: string;
  placeholder?: string;
}

function DropdownComponent<FormValues extends FieldValues>({
  name,
  label,
  width="full",
  placeholder="Select an option",
  options,
  setValue,
  watch,
  error,
}: DropdownComponentProps<FormValues>) {
  const [selected, setSelected] = useState(placeholder);
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
    <div className={`mb-4 w-${width}`}>
      {label && (
        <label className="block text-base font-medium text-black mb-2 dark:text-white">
          {label}
        </label>
      )}

      <details
        ref={dropdownRef}
        className={`w-${width} cursor-pointer border border-gray-300 rounded-lg bg-transparent relative scale-z-105`}
      >
        <summary className={`list-none px-4 py-2 text-gray-700 dark:text-gray-300 bg-transparent rounded-lg ${width === 'fit' ? 'min-w-[240px]' : ''}`}>
          {selected}
        </summary>

        <ul className="w-full absolute top-10 left-0 border-t text-black border-gray-300 bg-background-secondary shadow-md rounded-lg max-h-62 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option}
              value={option}
              className={`px-4 py-2 cursor-pointer dark:text-gray-300 ${
                selected === option
                  ? "bg-accent font-semibold"
                  : "hover:bg-secondary"
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