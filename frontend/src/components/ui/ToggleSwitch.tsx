import React from "react";

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
  error?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  error,
}) => {
  const inputId = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-base font-medium text-black">
          {label}
        </label>

        <div className="relative inline-block w-11 h-6">
          <input
            type="checkbox"
            id={inputId}
            checked={checked}
            onChange={onChange}
            className="peer hidden"
          />
          <div className="absolute inset-0 bg-gray-300 rounded-full peer-checked:bg-primary transition-colors"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
        </div>
      </div>

      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

ToggleSwitch.displayName = "ToggleSwitch";

export default ToggleSwitch;
