"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { SignUpFormData, SignUpSchema } from '@/app/schema/auth.schemas';
import { toast } from '@/components/ui/use-toast';

export default function CustomSignUpForm() {
    const { signUp, isLoaded, setActive } = useSignUp();
    const router = useRouter();
    const [otpSent, setOtpSent] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: zodResolver(SignUpSchema),
        mode: 'onChange',
    });

    const formatErrorCode = (code: string) => code.replace(/_/g, ' ');

    const onSubmit = async (data: SignUpFormData) => {
        if (!isLoaded) return;

        try {
            if (!otpSent) {
                await signUp.create({
                    emailAddress: data.email,
                    password: data.password,
                });
                await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                setOtpSent(true);
            } else {
                const verification = await signUp.attemptEmailAddressVerification({
                    code: data.otp || '',
                });

                if (verification.status === 'complete') {
                    await setActive({ session: verification.createdSessionId });
                    toast({
                        title: 'Success',
                        description: 'Hop on Matey!',
                    });
                    router.push('/dashboard');
                } else {
                    throw new Error('Verification failed');
                }
            }
        } catch (error: any) {
            if (error.errors && error.errors.length == 1) {
                const errorCode = formatErrorCode(error.errors[0].code);
                const errorMessage = error.errors[0].longMessage || 'An error occurred';

                toast({
                    title: errorCode,
                    description: errorMessage,
                    className: 'bg-red-50',
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Multiple errors or an unexpected error occurred',
                    className: 'bg-red-50',
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Email</label>
                <input {...register('email')} type="email" />
                {errors.email && <span>{errors.email.message}</span>}
            </div>
            <div>
                <label>Password</label>
                <input {...register('password')} type="password" />
                {errors.password && <span>{errors.password.message}</span>}
            </div>
            {otpSent && (
                <div>
                    <label>OTP</label>
                    <input {...register('otp')} type="text" />
                    {errors.otp && <span>{errors.otp.message}</span>}
                </div>
            )}
            <button type="submit">{otpSent ? 'Verify OTP' : 'Sign Up'}</button>
        </form>
    );
}
