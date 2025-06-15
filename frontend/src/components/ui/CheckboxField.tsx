import React from "react";

interface CheckboxFieldProps {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  label,
  checked,
  onChange,
}) => {
  const checkboxId = id || label.replace(/\s+/g, "-").toLowerCase(); // fallback ID

  return (
    <div className="flex items-center mb-2">
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="form-checkbox h-5 w-5 text-primary border-gray-300 dark:border-gray-600 focus:ring-primary focus:outline-none"
      />
      <label htmlFor={checkboxId} className="ml-2 text-sm text-black dark:text-gray-300">
        {label}
      </label>
    </div>
  );
};

export default CheckboxField;
