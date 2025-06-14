import { CreateProfileSchema } from "@/lib/validators/profileValidators";
import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  FieldArrayWithId,
  Path,
} from "react-hook-form";

type LinkItem = {
  label: string;
  url: string;
  isVisible?: boolean;
};

type BaseProps = {
  register: UseFormRegister<CreateProfileSchema>;
  errors: FieldErrors<CreateProfileSchema>;
  label: string;
  remove: UseFieldArrayRemove;
};

type DynamicLinksProps =
  | {
    name: "socialLinks";
    fields: FieldArrayWithId<CreateProfileSchema, "socialLinks", "id">[];
    append: UseFieldArrayAppend<CreateProfileSchema, "socialLinks">;
  } & BaseProps
  | {
    name: "portfolioLinks";
    fields: FieldArrayWithId<CreateProfileSchema, "portfolioLinks", "id">[];
    append: UseFieldArrayAppend<CreateProfileSchema, "portfolioLinks">;
  } & BaseProps;

function DynamicLinksComponent({
  name,
  fields,
  register,
  errors,
  append,
  remove,
  label,
}: DynamicLinksProps) {
  const handleAppend = () => {
    const newItem: LinkItem = { label: "", url: "", isVisible: true };
    append(newItem);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-base text-black font-medium">{label}</label>
        <button
          type="button"
          onClick={handleAppend}
          className="flex items-center text-primary dark:text-secondary text-sm font-medium hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="22"
            viewBox="0 -960 960 960"
            width="22"
            fill="currentcolor"
          >
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
          <span className="ml-1">Add</span>
        </button>
      </div>

      {fields.map((field, index) => {
        const labelError = errors[name]?.[index]?.label?.message;
        const urlError = errors[name]?.[index]?.url?.message;
        return (
          <div
            key={field.id}
            className="border border-gray-200 rounded-lg p-4 mb-4 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 me-2">
              <input
                {...register(`${name}.${index}.label` as Path<CreateProfileSchema>)}
                placeholder="Label (e.g. GitHub)"
                className={`w-full border px-3 py-2.5 text-black text-sm rounded-lg focus:outline-none ${
                  labelError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary"
                }`}
              />
              {labelError && (
                <p className="text-red-600 text-sm mt-1">{labelError}</p>
              )}

              <input
                {...register(`${name}.${index}.url` as Path<CreateProfileSchema>)}
                placeholder="URL (e.g. https://github.com/yourname)"
                className={`w-full border px-3 py-2.5 text-black text-sm rounded-lg focus:outline-none ${
                  urlError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary"
                }`}
              />
              {urlError && (
                <p className="text-red-600 text-sm mt-1">{urlError}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 dark:text-gray-400 text-gray-700 hover:text-red-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22"
                viewBox="0 -960 960 960"
                width="22"
                fill="currentcolor"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export { DynamicLinksComponent };
