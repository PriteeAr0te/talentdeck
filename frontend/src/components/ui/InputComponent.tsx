import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    registration: UseFormRegisterReturn;
}

const InputField: React.FC<InputFieldProps> = ({ label, error, registration, ...input }) => {
    return (
        <>
            <div className="mb-4">
                <label htmlFor={input.id} className="block text-base text-black font-medium mb-1">
                    {label}
                </label>

                <input
                    {...registration}
                    {...input}
                    className={`w-full border px-3 py-2.5 text-black text-sm rounded-lg focus:outline-none  ${error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-primary"
                        }`}
                />
                {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}

            </div>
        </>
    )
}

export default InputField;