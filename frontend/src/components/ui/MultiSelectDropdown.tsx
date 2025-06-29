// components/ui/MultiSelectDropdown.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface MultiSelectDropdownProps {
  label?: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  width?: string;
  placeholder?: string;
}

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  width = "full",
  placeholder = "Select options",
}: MultiSelectDropdownProps) {
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>(placeholder);

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

  useEffect(() => {
    if (selected.length === 0) {
      setSelectedLabel(placeholder);
    } else if (selected.length <= 2) {
      setSelectedLabel(selected.join(", "));
    } else {
      setSelectedLabel(`${selected.slice(0, 2).join(", ")}, +${selected.length - 2} more`);
    }
  }, [selected, placeholder]);

  const handleSelect = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
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
        className={`w-${width} cursor-pointer border border-br-primary rounded-lg bg-transparent relative`}
      >
        <summary
          className={`list-none px-4 py-2 text-gray-700 dark:text-gray-300 bg-transparent ${
            width === "fit" ? "min-w-[240px]" : ""
          }`}
        >
          {selectedLabel}
        </summary>

        <ul className="w-full absolute top-10 left-0 border text-black border-br-primary bg-background-secondary shadow-md rounded-lg max-h-62 overflow-y-auto z-50">
          {options.map((option) => (
            <li
              key={option}
              className={`px-4 py-2 cursor-pointer dark:text-gray-300 flex items-center gap-2 hover:bg-secondary ${
                selected.includes(option) ? "bg-accent/50 font-semibold" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                readOnly
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              {option}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
