import { CreateProfileSchema } from "@/lib/validators/profileValidators";
import React, { useState } from "react";
import {
  UseFormSetValue,
  UseFormWatch,
  Path,
  PathValue,
} from "react-hook-form";

interface TagsSelectorProps {
  name: Path<CreateProfileSchema>;
  setValue: UseFormSetValue<CreateProfileSchema>;
  watch: UseFormWatch<CreateProfileSchema>;
  error?: string;
}

const TagsSelector: React.FC<TagsSelectorProps> = ({
  name,
  setValue,
  watch,
  error,
}) => {
  const [inputValue, setInputValue] = useState("");
  const tags = (watch(name) || []) as string[];

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setValue(name, [...tags, trimmed] as PathValue<CreateProfileSchema, Path<CreateProfileSchema>>, {
        shouldValidate: true,
      });
    }
    setInputValue("");
  };

  const handleRemoveTag = (tag: string) => {
    const updated = tags.filter((t) => t !== tag);
    setValue(name, updated as PathValue<CreateProfileSchema, Path<CreateProfileSchema>>, {
      shouldValidate: true,
    });
  };

  return (
    <div className="mb-4 w-full">
      <label className="block text-base text-black font-medium mb-1">
        Tags <span className="text-gray-500">(optional)</span>
      </label>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
          placeholder="Add a tag and press Enter"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
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
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center bg-gray-100 text-sm text-black px-3 py-1 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-gray-600 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default TagsSelector;
