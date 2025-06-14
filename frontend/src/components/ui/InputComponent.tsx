import React, { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputComponentProps>(
  ({ label, error, registration, ...props }) => {
    return (
      <div className="mb-4 w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-base dark:text-gray-900 text-black font-medium mb-1"
          >
            {label}
          </label>
        )}

        <input
          {...props}
          {...registration}
          className={`w-full border px-3 py-2.5 text-black text-sm rounded-lg focus:outline-none ${
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-400 focus:border-primary"
          }`}
        />

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

InputComponent.displayName = "InputComponent";

export default InputComponent;
