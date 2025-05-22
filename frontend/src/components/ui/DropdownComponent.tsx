"use client";

import { useEffect, useRef, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { CreateProfileSchema } from "@/lib/validators/profileValidators";

interface DropdownComponentProps {
  name: keyof CreateProfileSchema;
  label?: string;
  register: UseFormRegister<CreateProfileSchema>;
  setValue: UseFormSetValue<CreateProfileSchema>;
  options: CreateProfileSchema["category"][];
  error?: string;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  name,
  label,
  register,
  setValue,
  options,
  error,
}) => {
  const [selected, setSelected] = useState<string>("Select a category");
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  // Close dropdown when clicking outside
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
    setValue(name, option as CreateProfileSchema["category"]);
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-base font-medium text-black mb-2">
          {label}
        </label>
      )}

      <details ref={detailsRef} className="w-full cursor-pointer border border-gray-300 rounded-lg bg-white dark:bg-[#0A0011] relative z-10">
        <summary className="list-none px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0A0011] hover:bg-background-hover rounded-lg dark:hover:bg-[#0A0011]">
          {selected}
        </summary>

        <ul className="w-full border-t text-black border-gray-300 bg-white dark:bg-[#0A0011] shadow-md rounded-b-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              className={`px-4 py-2 text-gray-800 cursor-pointer dark:text-gray-300 ${
                selected === option ? "bg-background-active font-semibold" : "hover:bg-background-hover"
              }`}
              onClick={() => handleSelect(option)}
            >
              {/* <input
                type="radio"
                value={option}
                {...register(name)}
                className="hidden"
                checked={selected === option}
                readOnly
              /> */}
              {option}
            </li>
          ))}
        </ul>
      </details>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DropdownComponent;
