import { z } from 'zod';

export const getLoginSchema = () =>
    z.object({
        user_email: z.string().nonempty('Email is required'),
        user_password: z.string().nonempty('Password is required'),
    });

export type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;
