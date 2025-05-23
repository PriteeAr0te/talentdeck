'use client';

import { useRef, ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploadComponentProps {
  value: File[];
  onChange: (files: File[]) => void;
  label?: string;
  error?: string;
}

const ImageUploadComponent = ({
  value,
  onChange,
  label = 'Upload Images',
  error,
}: ImageUploadComponentProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const selectedFiles = Array.from(fileList);
    onChange([...value, ...selectedFiles]);
  };

  const removeImage = (index: number) => {
    const updatedFiles = [...value];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles);
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-base font-medium text-black mb-2">{label}</label>}

      <div
        className="border border-dashed border-gray-400 rounded-lg p-4 py-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
        onClick={() => inputRef.current?.click()}
      >
        <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zm9.75 6.75V5.25h1.5v7.5h3.75l-4.5 4.5-4.5-4.5h3.75z"
          />
        </svg>
        <p className="text-sm text-gray-600 mt-4">Click to upload images</p>
        <p className="text-xs text-gray-600 mt-2">PNG, JPG, GIF up to 10MB</p>
      </div>

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleFiles}
      />

      {value.length > 0 && (
        <div className="mt-4 flex gap-4 flex-wrap">
          {value.map((file, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border">
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview ${idx}`}
                fill
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 text-red-600 bg-white rounded-full w-6 h-6 text-center"
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
