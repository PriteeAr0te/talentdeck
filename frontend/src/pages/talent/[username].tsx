import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TalentProfile from "@/components/ui/TalentProfile";
import { ProfileType } from "@/types/profile";
import Seo from "@/components/layout/Seo";
import API from "@/lib/api";

export default function TalentPublicPage() {
  const router = useRouter();
  const { username } = router.query;

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        const res = await API.get(`/profile/${username}`);
        setProfile(res.data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-500 dark:text-red-300">
        <p>Profile not found.</p>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${profile.username} – TalentDeck`}
        description={profile.headline}
        url={`https://talentdeck-next.netlify.app/talent/${profile.username}`}
      />
      <div className="min-h-screen text-gray-900 dark:text-white p-6">
        <TalentProfile profile={profile} />
      </div>
    </>
  );
}
