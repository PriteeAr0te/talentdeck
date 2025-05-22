import React from "react";
import { UseFieldArrayAppend, UseFieldArrayRemove, UseFormRegister, FieldErrors, UseFieldArrayUpdate, Control } from "react-hook-form";
import InputComponent from "./InputComponent";

interface DynamicLinksComponentProps {
  name: string;
  fields: { id: string }[];
  register: UseFormRegister<any>;
  errors: {
    label?: { message?: string };
    url?: { message?: string };
    isVisible?: { message?: string };
  }[] | undefined;
  append: UseFieldArrayAppend<any>;
  remove: UseFieldArrayRemove;
//   update: UseFieldArrayUpdate<any>;
  label: string;
  control: Control<any>;
}

const DynamicLinksComponent: React.FC<DynamicLinksComponentProps> = ({ name, fields, register, errors, append, remove, label, control }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-base text-black font-medium">{label}</label>
        <button
          type="button"
          onClick={() => append({ label: "", url: "" })}
          className="flex items-center text-primary dark:text-secondary text-sm font-medium hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentcolor"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg> <span className="ml-1">Add</span>
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputComponent
              label="Label"
              id={`${name}.${index}.label`}
              registration={register(`${name}.${index}.label`)}
              error={errors?.[index]?.label?.message}
              placeholder="e.g. GitHub, Behance"
            />
            <InputComponent
              label="URL"
              id={`${name}.${index}.url`}
              registration={register(`${name}.${index}.url`)}
              error={errors?.[index]?.url?.message}
              placeholder="e.g. https://github.com/yourname"
            />
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 text-gray-700 hover:text-red-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentcolor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default DynamicLinksComponent;
