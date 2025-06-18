import { GetServerSideProps } from 'next';
import TalentProfile from '@/components/ui/TalentProfile';
import API from '@/lib/api';
import { ProfileType } from '@/types/profile';

interface Props {
  profile: ProfileType | null;
}

export default function TalentPublicPage({ profile }: Props) {
  // const router = useRouter();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-500 dark:text-red-300">
        <p>Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <TalentProfile profile={profile} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params!;

  try {
    const res = await API.get(`/profile/${username}`);
    return { props: { profile: res.data.data } };
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return { props: { profile: null } };
  }
};
