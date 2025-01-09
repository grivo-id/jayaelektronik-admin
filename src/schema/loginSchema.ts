import { z } from 'zod';

export const loginSchema = z.object({
    user_email: z.string().nonempty('Email is required').min(10, 'Email is required'),
    user_password: z.string().nonempty('Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
