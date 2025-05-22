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
    const [charCount, setCharCount] = useState(props.defaultValue?.toString().length || 0);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
    };

    return (
      <div className="mb-4 w-full">
        {label && (
          <label htmlFor={props.id} className="block text-base text-black font-medium mb-1">
            {label}
          </label>
        )}

        <textarea
          {...props}
          {...registration}
          ref={ref}
          maxLength={maxLength}
          onInput={handleInput}
          className={`w-full border px-3 py-2.5 text-black text-sm rounded-lg focus:outline-none resize-none ${
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary"
          }`}
        />

        <div className="mt-1 flex justify-between items-center text-sm">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <span className="text-gray-500">{`${charCount}/${maxLength}`}</span>
          )}
        </div>
      </div>
    );
  }
);

TextareaComponent.displayName = "TextareaComponent";

export default TextareaComponent;
