import { useFieldArray, useFormContext } from "react-hook-form";
import InputComponent from "./InputComponent";

interface DynamicFieldListProps {
  name: string; // "socialLinks" or "portfolioLinks"
  label: string;
}

const DynamicFieldList: React.FC<DynamicFieldListProps> = ({ name, label }) => {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-base text-black font-medium">
          {label}
        </label>
        <button
          type="button"
          onClick={() => append({ label: "", url: "" })}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          + Add
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-end mb-3">
          <div className="w-1/2">
            <InputComponent
              label="Label"
              registration={register(`${name}.${index}.label` as const)}
              error={Array.isArray(errors[name]) ? errors[name][index]?.label?.message : undefined}
              id={`${name}.${index}.label`}
              name={`${name}.${index}.label`}
            />
          </div>
          <div className="w-1/2">
            <InputComponent
              label="URL"
              registration={register(`${name}.${index}.url` as const)}
              error={Array.isArray(errors[name]) ? errors[name][index]?.url?.message : undefined}
              id={`${name}.${index}.url`}
              name={`${name}.${index}.url`}
            />
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default DynamicFieldList;
