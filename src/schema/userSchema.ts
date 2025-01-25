import { z } from 'zod';

export const getCreateUserSchema = () =>
    z.object({
        role_id: z.number().refine((val) => val !== 0, {
            message: 'Role is required',
        }),
        user_fname: z.string().nonempty('First name is required'),
        user_lname: z.string().nonempty('Last name is required'),
        user_email: z.string().nonempty('Email is required').email('Invalid email address'),
        user_password: z
            .string()
            .min(6, 'Password must be at least 6 characters long and contain 1 uppercase letter')
            .regex(/[A-Z]/, 'Password must be at least 6 characters long and contain 1 uppercase letter'),
        user_phone: z.string().nonempty('Phone number is required'),
        user_address: z.string().nonempty('Address is required'),
    });

export const getUpdateUserSchema = () =>
    z.object({
        role_id: z.number().refine((val) => val !== 0, {
            message: 'Role is required',
        }),
        user_fname: z.string().nonempty('First name is required'),
        user_lname: z.string().nonempty('Last name is required'),
        user_is_active: z.boolean(),
        user_is_verified: z.boolean(),
    });

export const getUpdateUserProfileSchema = () =>
    z
        .object({
            user_fname: z.string().optional(),
            user_lname: z.string().optional(),
            user_email: z.string().email().optional(),
            user_phone: z.string().optional(),
            user_address: z.string().optional(),
            user_password: z.string().optional(),
            user_confirm_password: z.string().optional(),
        })
        .refine((data) => data.user_password === data.user_confirm_password, {
            message: 'Passwords do not match',
            path: ['user_confirm_password'],
        });

export type CreateUserPayload = z.infer<ReturnType<typeof getCreateUserSchema>>;
export type UpdateUserPayload = z.infer<ReturnType<typeof getUpdateUserSchema>>;
export type UpdateUserProfilePayload = z.infer<ReturnType<typeof getUpdateUserProfileSchema>>;
