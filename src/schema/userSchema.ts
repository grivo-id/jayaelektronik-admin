import { z } from 'zod';

export const getCreateUserSchema = () =>
    z.object({
        role_id: z.number().refine((val) => val !== 0, {
            message: 'Role is required',
        }),
        user_fname: z.string().nonempty('First name is required'),
        user_lname: z.string().nonempty('Last name is required'),
        user_email: z.string().nonempty('Email is required').email('Invalid email address'),
        user_password: z.string().nonempty('Password is required'),
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

export type CreateUserPayload = z.infer<ReturnType<typeof getCreateUserSchema>>;
export type UpdateUserPayload = z.infer<ReturnType<typeof getUpdateUserSchema>>;
