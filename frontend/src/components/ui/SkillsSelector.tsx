import { useState } from "react";
import {
  Control,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
  FieldValues,
} from "react-hook-form";

interface SkillsSelectorProps<T extends FieldValues> {
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  error?: string;
  control: Control<T>;
}

function SkillsSelector<T extends FieldValues>({
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
      !skills.includes(trimmed) &&
      skills.length < 10
    ) {
      const updatedSkills = [...skills, trimmed];
      setValue(name, updatedSkills as PathValue<T, typeof name>, {
        shouldValidate: true,
      });
    }

    setInputValue(""); 
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setValue(name, updatedSkills as PathValue<T, typeof name>, {
      shouldValidate: true,
    });
  };

  return (
    <div className="mb-4 w-full">
      <label className="block text-base font-medium text-black dark:text-white mb-1">
        Skills
      </label>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          placeholder="Type a skill and press Enter"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSkill();
            }
          }}
          className="flex-1 border text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
        />

        <button
          type="button"
          onClick={handleAddSkill}
          className="bg-primary text-white cursor-pointer dark:text-gray-900 font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-primary-dark transition"
        >
          Add
        </button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center bg-gray-200 dark:bg-gray-300 dark:text-gray-900 text-sm px-3 py-1 rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 text-gray-600 hover:text-red-500 cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      <p className="text-sm text-gray-500 mt-2">
        Max 10 skills ({skills.length}/10)
      </p>
    </div>
  );
}

export default SkillsSelector;
