"use client";

import { useEffect, useRef, useState } from "react";

interface FilterDropdownProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  width?: string;
  placeholder?: string;
}

function FilterDropdownComponent({
  label,
  options,
  value,
  onChange,
  width = "full",
  placeholder = "Select an option",
}: FilterDropdownProps) {
  const [selected, setSelected] = useState(placeholder);
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (typeof value === "string") {
      setSelected(value || placeholder);
    }
  }, [value, placeholder]);

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        dropdownRef.current.open = false;
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange(option);
    if (dropdownRef.current) {
      dropdownRef.current.open = false;
    }
  };

  return (
    <div className={`w-${width}`}>
      {label && (
        <label className="block text-base font-medium text-black mb-2 dark:text-white">
          {label}
        </label>
      )}

      <details
        ref={dropdownRef}
        className={`w-${width} cursor-pointer border border-br-primary rounded-lg bg-transparent relative`}
      >
        <summary
          className={`list-none px-4 py-2 text-foreground dark:text-gray-300 bg-transparent rounded-lg ${
            width === "fit" ? "min-w-[240px]" : ""
          }`}
        >
          {options.includes(selected) ? selected : placeholder}
        </summary>

        <ul className="w-full absolute top-10 left-0 border-t text-black border-bg-primary bg-background-secondary shadow-md rounded-lg focus:outline-none max-h-62 overflow-y-auto z-50">
          {options.map((option) => (
            <li
              key={option}
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
    </div>
  );
}

export default FilterDropdownComponent;
