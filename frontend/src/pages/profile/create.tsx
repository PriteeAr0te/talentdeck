import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import CreateProfileForm from '@/components/profile/CreateProfileForm';

const CreateProfile: React.FC = () => {
    const { isLoggedIn, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        } else if(user?.profileCreated) {
            router.push(`/${user.username}`);
        }
    }, [isLoggedIn, user]);

    return (
        <main className="dark:bg-[#0A0011] bg-white">
         <div className='max-w-5xl mx-auto px-4 py-10'>
         <h1 className="text-3xl font-semibold mb-8 text-black">Create Your Profile</h1>
         <CreateProfileForm />
         </div>
        </main>
    );
};

export default CreateProfile;
