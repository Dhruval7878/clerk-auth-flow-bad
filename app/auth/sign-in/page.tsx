'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { SignInFormData, UserLoginSchema } from '@/app/schema/auth.schemas';
import { useToast } from '@/components/ui/use-toast';

export default function SignInPage() {
    const { signIn, isLoaded, setActive } = useSignIn();
    const router = useRouter();
    const { toast } = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
        resolver: zodResolver(UserLoginSchema),
        mode: 'onChange',
    });

    const formatErrorCode = (code: string) => {
        return code.replace(/_/g, ' ');
    };

    const onSubmit = async (data: SignInFormData) => {
        if (!isLoaded) return;

        try {
            const response = await signIn.create({
                identifier: data.email,
                password: data.password,
            });

            if (response.status === 'complete') {
                await setActive({ session: response.createdSessionId });
                toast({
                    title: 'Success',
                    description: 'Welcome back!',
                });
                router.push('/dashboard');
            }
        } catch (error: any) {
            if (error.errors && error.errors.length > 0) {
                const errorCode = formatErrorCode(error.errors[0].code);
                const errorMessage = error.errors[0].longMessage;

                toast({
                    title: errorCode,
                    description: errorMessage,
                    className: 'bg-red-50',
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Multiple errors or an unexpected error occurred.',
                    className: 'bg-red-50',
                });
            }
        }
    };

    return (
        <div className="container">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div>
                    <label>Email</label>
                    <input className='bg-purple-400' type="email" {...register('email')} />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" className='bg-purple-400' {...register('password')} />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting}>
                    Sign In
                </button>
            </form>
        </div>
    );
}
