// src/pages/profile/edit-profile.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import UpdateProfileForm from '@/components/ui/UpdateProfileForm';
import API from '@/lib/api';
import { ProfileType } from '@/types/profile';
import { UpdateProfileSchema } from '@/lib/validators/profileValidators';

export const mapProfileToFormValues = (profile: ProfileType): UpdateProfileSchema => {
  return {
    username: profile.username || '',
    headline: profile.headline || '',
    category: profile.category || 'Software Developer',
    location: {
      city: profile.location?.city || '',
      state: profile.location?.state || '',
      country: profile.location?.country || '',
    },
    bio: profile.bio || '',
    skills: profile.skills || [],
    tags: profile.tags || [],
    availableforwork: profile.availableforwork ?? false,
    isVisible: profile.isVisible ?? true,
    portfolioLinks: profile.portfolioLinks?.length
      ? profile.portfolioLinks
      : [{ label: '', url: '' }],
    socialLinks: profile.socialLinks?.length
      ? profile.socialLinks.map((link) => ({ ...link, isVisible: link.isVisible ?? true }))
      : [{ label: '', url: '', isVisible: true }],
    profilePicture: profile.profilePicture || '',
    projectImages: profile.projectImages || [],
  };
};

const EditProfile: React.FC = () => {
  const { isLoggedIn, user, loading } = useAuth();
  const router = useRouter();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState<UpdateProfileSchema | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (loading) return;

      if (!isLoggedIn) {
        router.push('/login');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const response = await API.get('/profile/me');
        const mappedProfile = mapProfileToFormValues(response.data);
        setProfile(mappedProfile);
        console.log(mappedProfile)
      } catch (err: any) {
        if (err.response?.status === 404) {
          router.push('/profile/create');
        } else {
          toast.error('Failed to fetch profile.');
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [isLoggedIn, loading, router]);

  return (
    <main className="dark:bg-[#0A0011] bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-8 text-black dark:text-white">Edit Your Profile</h1>

        {loadingProfile ? (
          <p className="text-gray-500">Loading profile...</p>
        ) : profile ? (
          <UpdateProfileForm defaultValues={profile} />
        ) : (
          <p className="text-gray-500">No profile data found.</p>
        )}
      </div>
    </main>
  );
};

export default EditProfile;
