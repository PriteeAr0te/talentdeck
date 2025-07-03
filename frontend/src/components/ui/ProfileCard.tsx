"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProfileType } from "@/types/profile";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileCard({ profile }: { profile: ProfileType }) {
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const { isLoggedIn, setUser, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && user?.bookmarks?.includes(profile._id)) {
      setBookmarked(true);
    }
  }, [isLoggedIn, user, profile._id]);

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to bookmark this profile.");
      router.push("/login");
      return;
    }

    try {
      const res = await API.post(`/profile/bookmarks/${profile._id}`);
      setBookmarked(res.data.bookmarked);
      console.log("bookmarked", res.data.bookmarked);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        console.log("Bookmarks: ", res.data.user)
      }
      toast.success(
        res.data.bookmarked
          ? "Profile bookmarked successfully!"
          : "Bookmark removed."
      );
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      toast.error("Something went wrong. Try again.");
    }
  };

  const handleCopy = async () => {
    const url = `${window.location.origin}/talent/${profile.username}`;
    await navigator.clipboard.writeText(url);
    toast.success("Profile link copied!");
  };

  return (
    <div className="border rounded-lg p-4 py-2 pb-4 bg-background-secondary shadow hover:shadow-lg transition h-full relative">
      <div className="w-full flex justify-end items-center gap-2 mb-2">

        {profile.availableforwork && (
          <span className="bg-bg-chip text-foreground px-2 py-1 text-xs rounded-full">
            Available
          </span>
        )}

        <button
          onClick={handleBookmark}
          className="text-gray-500 hover:text-primary cursor-pointer focus:outline-none"
          title="Bookmark this profile"
        >
          {bookmarked ? <AiFillStar size={18} /> : <AiOutlineStar size={18} />}
        </button>

        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-primary cursor-pointer focus:outine-none"
          title="Copy Profile Link"
        >
          <FiShare2 size={16} />
        </button>
      </div>

      <Link href={`/talent/${profile.username}`}>
        <div className="flex items-center gap-4">
          <Image
            src={profile.profilePicture || "/default-avatar.png"}
            alt={profile.username}
            width={70}
            height={70}
            className="rounded-full max-h-[70px] max-w-[70px] min-w-[70px] object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg">{profile.username}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile.headline}</p>
            <p className="text-xs text-purple-700 mt-2 dark:text-purple-300">{profile.category}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
