'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

interface ProfilePhotoUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  error?: string;
  existingImageUrl?: string;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  value,
  onChange,
  label = 'Profile Photo',
  error,
  existingImageUrl,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const fileUrl = URL.createObjectURL(value);
      setPreviewUrl(fileUrl);

      return () => URL.revokeObjectURL(fileUrl);
    }

    if (existingImageUrl) {
      const fullUrl = existingImageUrl.startsWith('http')
        ? existingImageUrl
        : `https://res.cloudinary.com/dmhocuxlk/image/upload/${existingImageUrl}`;
      setPreviewUrl(fullUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [value, existingImageUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const getInitial = () => {
    return user?.email?.[0]?.toUpperCase() || '?';
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>

      <div className="flex items-center gap-6">

        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300 group">
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt="Profile Preview"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-4.553a1 1 0 10-1.414-1.414L13.586 8.586a2 2 0 11-2.828 2.828l-4.553 4.553a1 1 0 001.414 1.414L11 12.414a2 2 0 012.828-2.828z"
                  />
                </svg>
              </div>
            </>
          ) : (
            <span className="w-full h-full text-5xl flex items-center justify-center text-gray-500 dark:text-gray-300">
              {getInitial()}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-100 cursor-pointer"
        >
          Upload
        </button>

        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ProfilePhotoUpload;
