import { useState } from "react";
import {
  Control,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
  FieldValues,
} from "react-hook-form";

interface TagsSelectorProps<T extends FieldValues> {
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  error?: string;
    control: Control<T>;
}

function TagsSelector<T extends FieldValues>({
  name,
  setValue,
  watch,
  error,
}: TagsSelectorProps<T>) {
  const [inputValue, setInputValue] = useState("");

  const tags = (watch(name) || []) as string[];

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const updated = [...tags, trimmed];
      setValue(name, updated as PathValue<T, typeof name>, {
        shouldValidate: true,
      });
    }
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = tags.filter((tag) => tag !== tagToRemove);
    setValue(name, updated as PathValue<T, typeof name>, {
      shouldValidate: true,
    });
  };

  return (
    <div className="mb-4 w-full">
      <label className="block text-base font-medium text-black dark:text-white mb-1">
        Tags <span className="text-gray-500 text-sm">(optional)</span>
      </label>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="Add a tag and press Enter"
          className="flex-1 border text-black dark:text-white dark:bg-[#1a1a1a] placeholder:text-gray-600 dark:placeholder:text-gray-400 border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
        />

        <button
          type="button"
          onClick={handleAddTag}
          className="bg-primary text-white text-sm px-4 py-2.5 rounded-lg hover:bg-primary-dark transition"
        >
          Add
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center bg-gray-200 dark:bg-gray-300 dark:text-gray-900 text-sm px-3 py-1 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-gray-600 hover:text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default TagsSelector;
