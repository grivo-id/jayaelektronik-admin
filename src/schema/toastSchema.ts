import { z } from 'zod';

export const getCreateToastSchema = () =>
    z.object({
        toast_title: z.string().min(1, 'Toast title is required'),
        toast_message: z.string().min(1, 'Toast message is required'),
        toast_expired_date: z
            .string()
            .min(1, 'Expired date is required')
            .refine((date) => !isNaN(Date.parse(date)), {
                message: 'Invalid date format',
            }),
    });

export const getUpdateToastSchema = () =>
    z.object({
        user_id: z.string().nonempty('User ID is required'),
        toast_title: z.string().nonempty('Title is required'),
        toast_message: z.string().nonempty('Message is required'),
        toast_expired_date: z.string().datetime('Invalid date format'),
    });

export type CreateToastPayload = z.infer<ReturnType<typeof getCreateToastSchema>>;
export type UpdateToastPayload = z.infer<ReturnType<typeof getUpdateToastSchema>>;
