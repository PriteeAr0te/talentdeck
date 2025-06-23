import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  FieldArrayWithId,
  ArrayPath,
  FieldValues,
  FieldArray,
  Path,
} from "react-hook-form";

interface DynamicLinksProps<T extends FieldValues, N extends ArrayPath<T>> {
  name: N;
  label: string;
  fields: FieldArrayWithId<T, N, "id">[];
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  append: UseFieldArrayAppend<T, N>;
  remove: UseFieldArrayRemove;
}

function DynamicLinksComponent<T extends FieldValues, N extends ArrayPath<T>>({
  name,
  label,
  fields,
  register,
  errors,
  append,
  remove,
}: DynamicLinksProps<T, N>) {
  const handleAdd = () => {
    append({ label: "", url: "", isVisible: true } as FieldArray<T, N>);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-base font-medium text-black dark:text-white">
          {label}
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center text-primary cursor-pointer dark:text-gray-300 text-sm font-medium hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 -960 960 960"
            width="20"
            fill="currentColor"
          >
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
          <span className="ml-1">Add</span>
        </button>
      </div>

      {fields.map((field, index) => {

        const fieldErrors = errors[name] as
          | {
              [key: number]: {
                label?: { message?: string };
                url?: { message?: string };
              };
            }
          | undefined;

        const labelError = fieldErrors?.[index]?.label?.message;
        const urlError = fieldErrors?.[index]?.url?.message;

        return (
          <div
            key={field.id}
            className="relative border border-gray-200 rounded-lg p-4 mb-4 dark:border-gray-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <input
                {...register(`${name}.${index}.label` as Path<T>)}
                placeholder="Label (e.g. GitHub)"
                className={`w-full border px-3 py-2.5 text-sm rounded-lg text-black dark:text-white dark:bg-[#1a1a1a] focus:outline-none ${
                  labelError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-500 focus:border-primary"
                }`}
              />
              {labelError && (
                <p className="text-red-500 text-sm mt-1">{labelError}</p>
              )}

              <input
                {...register(`${name}.${index}.url` as Path<T>)}
                placeholder="URL (e.g. https://github.com/yourname)"
                className={`w-full border px-3 py-2.5 text-sm rounded-lg text-black dark:text-white dark:bg-[#1a1a1a] focus:outline-none ${
                  urlError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-500 focus:border-primary"
                }`}
              />
              {urlError && (
                <p className="text-red-500 text-sm mt-1">{urlError}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 dark:text-gray-300 transition cursor-pointer"
              aria-label="Remove link"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

export { DynamicLinksComponent };
