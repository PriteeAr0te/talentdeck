import React, { InputHTMLAttributes, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type PageVariant = "auth" | "form";

interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  page?: PageVariant;
  field?: string;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputComponentProps>(
  ({ label, error, registration, field= "", page = "form", type, ...props }, ref) => {
    const isAuth = page === "auth";
    const { ref: formRef, ...restRegistration } = registration;

    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password";

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="mb-4 w-full relative">
        {label && (
          <label
            htmlFor={props.id}
            className={`block ${field === 'location' ? 'text-sm' : 'text-base'} font-medium mb-1 ${isAuth ? "text-foreground" : "text-black dark:text-gray-200"
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
          type={isPasswordField && showPassword ? "text" : type}
          className={`w-full border px-3 py-2.5 text-foreground/90 text-sm rounded-lg focus:outline-none placeholder:text-foreground/60 ${isAuth
              ? "text-foreground/90"
              : ""
            } ${error
              ? "border-red-500 focus:ring-red-500"
              : "border-br-primary focus:border-primary"
            } pr-10`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-[40px] transform text-foreground focus:outline-none hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

InputComponent.displayName = "InputComponent";

export default InputComponent;
