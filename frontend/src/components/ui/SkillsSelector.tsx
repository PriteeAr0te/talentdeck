import React, { useState } from "react";
import { UseFormSetValue, UseFormWatch, Control, Path, PathValue } from "react-hook-form";
import { CreateProfileSchema } from "@/lib/validators/profileValidators";

interface SkillsSelectorProps<T extends Record<string, any>> {
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  error?: string;
  control: Control<T>;
}

function SkillsSelector<T extends Record<string, any>>({
  name,
  setValue,
  watch,
  error,
}: SkillsSelectorProps<T>) {
  const [inputValue, setInputValue] = useState("");

  const skills = (watch(name) || []) as string[];

  const handleAddSkill = () => {
    const trimmed = inputValue.trim();
    if (
      trimmed &&
      Array.isArray(skills) &&
      !skills.includes(trimmed) &&
      skills.length < 10
    ) {
      const updated = [...skills, trimmed];
      setValue(name, updated as PathValue<T, Path<T>>, { shouldValidate: true });
    }
    setInputValue("");
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = skills.filter((s) => s !== skill);
    setValue(name, updated as PathValue<T, Path<T>>, { shouldValidate: true });
  };

  return (
    <div className="mb-4 w-full">
      <label className="block text-base text-black font-medium mb-1">Skills</label>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
          placeholder="Type a skill and press Enter"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="bg-primary text-white text-sm px-4 py-2.5 rounded-lg hover:bg-primary-dark transition"
        >
          Add
        </button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center bg-gray-200 text-sm text-black px-3 py-1 rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 text-gray-600 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18"
                  viewBox="0 -960 960 960"
                  width="18"
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
      <p className="text-sm text-gray-500 mt-2">{`Max 10 skills. (${skills.length}/10)`}</p>
    </div>
  );
}

export default SkillsSelector;
