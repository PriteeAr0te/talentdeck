import { useAuth } from '@/hooks/useAuth';
import API from '@/lib/api';
import { ProfileType } from '@/types/profile';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { JSX, useEffect, useState } from 'react';
import { AiFillLike, AiFillStar, AiOutlineLike, AiOutlineStar } from 'react-icons/ai';
import {
  FaGithub,
  FaLinkedin,
  FaDribbble,
  FaBehance,
  FaYoutube,
  FaGlobe,
} from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Props {
  profile: ProfileType;
}

const iconMap: Record<string, JSX.Element> = {
  Github: <FaGithub />,
  LinkedIn: <FaLinkedin />,
  Dribbble: <FaDribbble />,
  Behance: <FaBehance />,
  YouTube: <FaYoutube />,
  Portfolio: <FaGlobe />,
};

export default function TalentProfile({ profile }: Props) {
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (!user?.id || !Array.isArray(profile.likes)) return;

    const userLiked = profile.likes.some((like) => {
      if (typeof like === "string") return like === user.id;
      if (typeof like === "object" && "_id" in like) return like._id === user.id;
      return false;
    });

    setLiked(userLiked);
  }, [user?.id, profile.likes]);

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to bookmark this profile.");
      router.push("/login");
      return;
    }

    try {
      const res = await API.post(`/profile/bookmarks/${profile._id}`);
      setBookmarked(res.data.bookmarked);
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

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to like this profile.");
      return;
    }

    try {
      const res = await API.post(`/profile/likes/${profile._id}`);
      const hasLiked = res.data.liked;

      setLiked(hasLiked);

      if (hasLiked) {
        profile.likes?.push({ _id: user!.id });
      } else {
        profile.likes = profile.likes?.filter((like) =>
          typeof like === "string"
            ? like !== user!.id
            : (like as { _id: string })._id !== user!.id
        );
      }

    } catch (err) {
      toast.error("Something went wrong.");
      console.log("Like toggle failed:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Image
          src={profile.profilePicture || '/default-avatar.png'}
          alt={profile.username}
          width={120}
          height={120}
          style={{ height: 'auto', maxHeight: '120px', maxWidth: '120px', objectFit: 'cover' }}
          priority={true}
          className="rounded-full object-cover border shadow-md"
        />
        <div className="text-center md:text-left">
          <div className="flex items-center gap-5 justify-start mb-2">
            <h1 className="text-3xl font-bold">{profile.username}</h1>

            <button
              onClick={handleBookmark}
              className="dark:text-gray-100 mt-2 hover:text-primary cursor-pointer focus:outline-none"
              title="Bookmark this profile"
            >
              {bookmarked ? <AiFillStar size={22} /> : <AiOutlineStar size={22} />}
            </button>

            <button
              onClick={handleCopy}
              className="dark:text-gray-100 mt-2 hover:text-primary cursor-pointer focus:outine-none"
              title="Copy Profile Link"
            >
              <FiShare2 size={22} />
            </button>

            <span
              className="dark:text-gray-100 mt-2 flex items-center gap-1"
            >
              <button
                className='hover:text-primary cursor-pointer focus:outine-none'
                title="React to this profile"
                onClick={handleLike}>
                {liked ? <AiFillLike size={22} /> : <AiOutlineLike size={22} />}
              </button>
            </span>
          </div>
          {profile.headline && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{profile.headline}</p>
          )}
          <a href={`mailto:${user?.email}`} className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.email}
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {profile.category} • {profile.location.city}, {profile.location.country}
          </p>
        </div>
      </div>

      {profile.bio && (
        <div>
          <h3 className="text-xl font-semibold mb-2">About</h3>
          <p className="text-gray-800 dark:text-gray-300 text-base leading-relaxed">
            {profile.bio}
          </p>
        </div>
      )}

      {profile.skills?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(profile.tags) && profile.tags?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(profile.portfolioLinks) && profile.portfolioLinks.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Portfolio</h3>
          <div className="flex flex-wrap gap-4 text-lg">
            {profile.portfolioLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-300 transition"
              >
                {iconMap[link.label] || <FaGlobe />} {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(profile.socialLinks) && profile.socialLinks.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Portfolio</h3>
          <div className="flex flex-wrap gap-4 text-lg">
            {profile.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-300 transition"
              >
                {iconMap[link.label] || <FaGlobe />} {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(profile.projectImages) && profile.projectImages?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Projects</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profile.projectImages.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Project ${index + 1}`}
                width={400}
                height={300}
                style={{ height: '300px' }}
                priority={true}
                className="w-full h-auto object-cover rounded-md border dark:border-gray-700"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
