import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  otp: z.string().optional(),
});

export const UserLoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(64, { message: 'Password cannot be longer than 64 characters' }),
});

export type SignUpFormData = z.infer<typeof SignUpSchema>;
export type SignInFormData = z.infer<typeof UserLoginSchema>;
