"use client";

import { useRef } from "react";
import Image from "next/image";
import { Control } from "react-hook-form";
import { CreateProfileSchema } from "@/lib/validators/profileValidators";

interface ImageUploadComponentProps {
  label?: string;
  name: string;
  multiple?: boolean;
  control: Control<CreateProfileSchema>;
  preview: File[];
  setPreview: React.Dispatch<React.SetStateAction<File[]>>;
  setFiles: (files: File[]) => void; // NEW
  error?: string;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
  label,
  name,
  multiple = false,
  control,
  preview,
  setPreview,
  setFiles,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const updated = multiple ? [...preview, ...newFiles] : newFiles.slice(0, 1);
    setPreview(updated);
    setFiles(updated); // Set file objects
  };

  const removeImage = (index: number) => {
    const updated = [...preview];
    updated.splice(index, 1);
    setPreview(updated);
    setFiles(updated); // Update file list
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-base font-medium text-black mb-2">{label}</label>}
      <div
        className="border border-dashed border-gray-400 rounded-lg p-4 py-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
        onClick={() => inputRef.current?.click()}
      >
        <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M1.5 6a2.25 2.25..." clipRule="evenodd" />
        </svg>
        <p className="text-sm text-gray-600 mt-4">Click to upload {multiple ? "images" : "an image"}</p>
        <p className="text-xs text-gray-600 mt-2">PNG, JPG, GIF up to 10MB</p>
      </div>

      <input
        name={name}
        type="file"
        ref={inputRef}
        className="hidden"
        multiple={multiple}
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {preview.length > 0 && (
        <div className="mt-4 flex gap-4 flex-wrap">
          {preview.map((file, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border">
              <Image src={URL.createObjectURL(file)} alt="preview" fill className="rounded object-cover" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-[0px] right-[4px] text-red-600 px-1 w-6 cursor-pointer bg-white rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploadComponent;

