import React, { TextareaHTMLAttributes, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaComponentProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  maxLength?: number;
}

const TextareaComponent = React.forwardRef<HTMLTextAreaElement, TextareaComponentProps>(
  ({ label, error, registration, maxLength = 500, ...props }, ref) => {
    const [charCount, setCharCount] = useState(0);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
    };

    return (
      <div className="mb-4 w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          {...props}
          {...registration}
          ref={(el) => {
            if (typeof ref === "function") ref(el);
            else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;

            if (registration?.ref) registration.ref(el);
          }}
          maxLength={maxLength}
          onInput={(e) => {
            handleInput(e as React.ChangeEvent<HTMLTextAreaElement>);
            props.onInput?.(e);
          }}
          className={`resize-none w-full border text-black dark:text-gray-200 rounded-md p-2 text-sm shadow-sm ${
            error ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:border-primary`}
        />
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
