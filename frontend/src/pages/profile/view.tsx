'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import API from '@/lib/api';

interface ProfileData {
  username: string;
  headline?: string;
  category: string;
  bio?: string;
  skills: string[];
  tags?: string[];
  availableforwork: boolean;
  isVisible: boolean;
  profilePicture?: string;
  projectImages: string[];
  location: {
    city?: string;
    state?: string;
    country?: string;
  };
  socialLinks: { label: string; url: string; isVisible?: boolean }[];
  portfolioLinks: { label: string; url: string }[];
  createdAt: string;
  updatedAt: string;
}

const ViewProfile = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/profile/me');
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
    else router.push('/');
  }, [token, router]);

  if (loading) return <p className="text-center dark:text-white">Loading...</p>;
  if (!profile) return <p className="text-center dark:text-white">No profile data available</p>;

  const imageUrl = (path?: string) => {
    if (!path) return '';
    return path.includes('cloudinary') ? path : `http://localhost:5000/${path.split('uploads')[1]}`;
  };

  return (
    <div className="mx-auto px-4 md:px-10 xl:px-28 2xl:px-32 p-6 bg-background text-foreground">
      <div className="flex flex-col md:flex-row md:items-center gap-6 border-b pb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border">
          {profile.profilePicture ? (
            <Image
              src={imageUrl(profile.profilePicture)}
              alt="Profile"
              width={128}
              height={128}
              style={{ height: 'auto' }}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-4xl">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">{profile.username}</h1>
          <p className="py-2 text-xl font-semibold text-primary dark:text-gray-300">{profile.headline}</p>
          <p className="text-base mt-1 mb-2">{profile.category}</p>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            {profile.location.city}, {profile.location.state}, {profile.location.country}
          </p>
          <Link
            href="/profile/edit"
            className="mt-3 inline-block px-4 py-2 text-sm bg-primary font-medium text-white dark:text-[#0b060f] hover:text-foreground rounded hover:bg-secondary"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {profile.bio && (
          <section>
            <h2 className="text-lg font-medium mb-1">About</h2>
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{profile.bio}</p>
          </section>
        )}

        <section>
          <h2 className="text-lg font-medium mb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-bg-chip rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {profile.tags && profile.tags.length > 0 && (
          <section>
            <h2 className="text-lg font-medium mb-1">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-bg-chip rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-medium mb-2">Project Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profile.projectImages.map((img, idx) => (
              <div key={idx} className="relative w-full h-32 rounded overflow-hidden border">
                <Image
                  src={imageUrl(img)}
                  alt={`Project ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-2">Social Links</h2>
          <ul className="list-disc list-inside space-y-1">
            {profile.socialLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener" className="text-primary hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-2">Portfolio Links</h2>
          <ul className="list-disc list-inside space-y-1">
            {profile.portfolioLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener" className="text-primary hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ViewProfile;
