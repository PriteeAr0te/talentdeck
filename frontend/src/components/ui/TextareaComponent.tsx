import React, { TextareaHTMLAttributes, useState, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaComponentProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  maxLength?: number;
}

const TextareaComponent = React.forwardRef<HTMLTextAreaElement, TextareaComponentProps>(
  ({ id, label, error, registration, maxLength = 500, ...props }, ref) => {
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
      if (props.defaultValue && typeof props.defaultValue === "string") {
        setCharCount(props.defaultValue.length);
      }
    }, [props.defaultValue]);

    const { ref: formRef, ...restRegistration } = registration;

    return (
      <div className="mb-4 w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
            {label}
          </label>
        )}

        <textarea
          id={id}
          {...props}
          {...restRegistration}
          ref={(el) => {
            formRef(el);
            if (typeof ref === "function") ref(el);
          }}
          maxLength={maxLength}
          onInput={(e) => {
            setCharCount(e.currentTarget.value.length);
            props.onInput?.(e);
          }}
          className={`resize-none w-full border rounded-md p-2 text-sm shadow-sm text-black dark:text-gray-200 ${
            error ? "border-red-500" : "border-gray-300 dark:border-gray-400 focus:border-primary"
          } focus:outline-none`}
        />

        {/* Here instead of <textarea/> i want to use <RichTextEditor/> */}

        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{charCount}/{maxLength} characters</span>
          {error && <span className="text-red-500">{error}</span>}
        </div>
      </div>
    );
  }
);

TextareaComponent.displayName = "TextareaComponent";
export default TextareaComponent;
