'use client';

import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { toast } from '@/components/ui/use-toast';

export default function SignOutButton() {
    const { signOut } = useClerk();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast({
                title: 'Success',
                description: 'Logged out!',
            });
            router.push('/auth/sign-in');
        } catch (error: any) {
            toast({
                title: error.errors[0].code,
                description: error.errors[0].longMessage,
            });
        }
    };

    return (
        <button onClick={handleSignOut}>Sign out</button>
    );
};
