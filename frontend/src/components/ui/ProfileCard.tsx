"use client";

import { ProfileType } from "@/types/profile";
import Image from "next/image";
import Link from "next/link";
import { Copy } from "lucide-react";

export default function ProfileCard({ profile }: { profile: ProfileType }) {
  const handleCopy = async () => {
    const url = `${window.location.origin}/talent/${profile.username}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="border rounded-xl p-4 bg-white dark:bg-[#0A0011] shadow hover:shadow-lg transition h-full relative">
      <Link href={`/talent/${profile.username}`}>
        <div className="flex items-center gap-4 mb-3">
          <Image
            src={profile.profilePicture || "/default-avatar.png"}
            alt={profile.username}
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg">{profile.username}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.headline}</p>
            <p className="text-xs text-purple-700 dark:text-purple-300">{profile.category}</p>
          </div>
        </div>
      </Link>

      {profile.availableforwork && (
        <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
          Available
        </span>
      )}

      <button
        onClick={handleCopy}
        className="absolute bottom-3 right-3 text-gray-500 hover:text-primary cursor-pointer"
        title="Copy Profile Link"
      >
        <Copy size={16} />
      </button>
    </div>
  );
}
