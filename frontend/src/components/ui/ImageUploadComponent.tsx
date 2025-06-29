'use client';

import { useEffect, useRef, useState, ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploadComponentProps {
  value: File[];
  onChange: (files: File[]) => void;
  label?: string;
  error?: string;
  existingImageUrls?: string[];
  onRetainUrlsChange?: (urlsToKeep: string[]) => void;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
  value,
  onChange,
  label = 'Upload Images',
  error,
  existingImageUrls = [],
  onRetainUrlsChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [retainedUrls, setRetainedUrls] = useState<string[]>(existingImageUrls);

  const [blobPreviews, setBlobPreviews] = useState<string[]>([]);

  useEffect(() => {
    const fileUrls = value.map(file => URL.createObjectURL(file));
    setBlobPreviews(fileUrls);

    return () => {
      fileUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [value]);

  useEffect(() => {
    onRetainUrlsChange?.(retainedUrls);
  }, [retainedUrls, onRetainUrlsChange]);

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files);
    onChange([...value, ...selected]);
  };

  const removeImage = (index: number) => {
    const totalExisting = retainedUrls.length;
    if (index < totalExisting) {
      const updated = [...retainedUrls];
      updated.splice(index, 1);
      setRetainedUrls(updated);
    } else {
      const adjustedIndex = index - totalExisting;
      const updated = [...value];
      updated.splice(adjustedIndex, 1);
      onChange(updated);
    }
  };

  const previews = [...retainedUrls, ...blobPreviews];

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-base font-medium text-black dark:text-white mb-2">
          {label}
        </label>
      )}

      <div
        className="border border-dashed border-gray-400 rounded-lg p-4 py-6 text-center cursor-pointer bg-background"
        onClick={() => inputRef.current?.click()}
      >
        <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zm9.75 6.75V5.25h1.5v7.5h3.75l-4.5 4.5-4.5-4.5h3.75z"
          />
        </svg>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">Click to upload images</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
      </div>

      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {previews.map((url, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border">
              <Image
                src={url}
                alt={`Preview ${idx}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-white cursor-pointer text-red-600 rounded-full w-6 h-6 text-sm flex items-center justify-center"
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
