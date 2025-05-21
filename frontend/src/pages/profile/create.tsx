import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

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
        <>
            <div>Create Profile</div>
        </>
    );
};

export default CreateProfile;
