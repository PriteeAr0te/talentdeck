// src/pages/profile/edit-profile.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import API from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import UpdateProfileForm from '@/components/ui/UpdateProfileForm';
import { ProfileType } from '@/types/profile';
import { UpdateProfileSchema } from '@/lib/validators/profileValidators';
import { AxiosError } from 'axios';
import Seo from '@/components/layout/Seo';

export const mapProfileToFormValues = (profile: ProfileType): UpdateProfileSchema & {
  existingProfilePictureUrl?: string;
  existingProjectImageUrls?: string[];
} => {
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
    profilePicture: undefined,
    projectImages: undefined,
    existingProfilePictureUrl: profile.profilePicture || '',
    existingProjectImageUrls: profile.projectImages || [],
  };
};

const EditProfile: React.FC = () => {
  const { isLoggedIn,
    loading } = useAuth();
  const router = useRouter();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState<UpdateProfileSchema | null>(null);
  const [existingProfilePictureUrl, setExistingProfilePictureUrl] = useState<string | null>(null);
  const [existingProjectImageUrls, setExistingProjectImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (loading) return;

      if (!isLoggedIn) {
        router.push('/');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const response = await API.get('/profile/me');
        const mappedProfile = mapProfileToFormValues(response.data);
        console.log(mappedProfile)
        setProfile(mappedProfile);

        if (response.data.profilePicture) {
          setExistingProfilePictureUrl(response.data.profilePicture);
        }
        if (response.data.projectImages?.length) {
          setExistingProjectImageUrls(response.data.projectImages);
        }
      } catch (err: unknown) {
        const error = err as AxiosError<{ messege: string }>
        if (error.response?.status === 404) {
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
    <>
      <Seo
        title="Edit Your Profile – Keep Your TalentDeck Presence Updated"
        description="Update your TalentDeck profile anytime. Keep your portfolio fresh with new skills, images, and details that reflect your growth."
        url="https://talentdeck-next.netlify.app/edit"
      />
      <main className="bg-background min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-semibold mb-8 text-black dark:text-white">Edit Your Profile</h1>

          {loadingProfile ? (
            <p className="text-gray-500">Loading profile...</p>
          ) : profile ? (
            <UpdateProfileForm
              defaultValues={profile}
              existingProfilePictureUrl={existingProfilePictureUrl || ''}
              existingProjectImageUrls={existingProjectImageUrls}
            />
          ) : (
            <p className="text-gray-500">No profile data found.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default EditProfile;
