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
              <div className="absolute inset-0 bg-black/40 opacity-0 flex items-center justify-center transition-opacity">
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
          className="px-4 mt-2 bg-btn-primary text-gray-200 hover:text-foreground dark:text-foreground py-2.5 rounded-lg hover:bg-secondary cursor-pointer transition-all duration-150 disabled:opacity-50"
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
