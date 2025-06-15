import React, { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type PageVariant = "auth" | "form";

interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  page?: PageVariant;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputComponentProps>(
  ({ label, error, registration, page = "form", ...props }, ref) => {
    const isAuth = page === "auth";

    const { ref: formRef, ...restRegistration } = registration;

    return (
      <div className="mb-4 w-full">
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-base font-medium mb-1 ${
              isAuth ? "text-black dark:text-gray-900" : "text-black dark:text-gray-200"
            }`}
          >
            {label}
          </label>
        )}

        <input
          {...props}
          {...restRegistration}
          ref={(e) => {
            formRef(e); 
            if (typeof ref === "function") ref(e);
          }}
          className={`w-full border px-3 py-2.5 text-sm rounded-lg focus:outline-none ${
            isAuth
              ? "text-black dark:text-gray-800"
              : "text-black dark:text-gray-100"
          } ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-400 focus:border-primary"
          }`}
        />

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

InputComponent.displayName = "InputComponent";

export default InputComponent;
