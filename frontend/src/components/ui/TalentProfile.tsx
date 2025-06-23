import { ProfileType } from '@/types/profile';
import Image from 'next/image';
import { JSX } from 'react';
import {
  FaGithub,
  FaLinkedin,
  FaDribbble,
  FaBehance,
  FaYoutube,
  FaGlobe,
} from 'react-icons/fa';

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
          <h1 className="text-3xl font-bold">{profile.username}</h1>
          {profile.headline && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{profile.headline}</p>
          )}
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
                style={{ height: 'auto' }}
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
