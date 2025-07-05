import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import CreateProfileForm from '@/components/profile/CreateProfileForm';
import Seo from '@/components/layout/Seo';

const CreateProfile: React.FC = () => {
    const { isLoggedIn, user, loading, isProfileCreated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!isLoggedIn) {
            router.push('/');
        } else if (user && user?.profileCreated && router.pathname === "/profile/create") {
            router.push(`/profile/view`);
        }
    }, [isLoggedIn, user, loading, isProfileCreated, router]);


    return (
        <>
            <Seo
                title="Create Your TalentDeck Profile – Stand Out with Projects & Skills"
                description="Build your TalentDeck profile with your top projects, skills, and bio. Showcase your work and connect with recruiters — no resume needed."
                url="https://talentdeck-next.netlify.app/create"
            />
            <main className="dark:bg-[#0A0011] bg-white">
                <div className='max-w-5xl mx-auto px-4 py-10'>
                    <h1 className="text-3xl font-semibold mb-8 text-black">Create Your Profile</h1>
                    <CreateProfileForm />
                </div>
            </main>
        </>
    );
};

export default CreateProfile;
