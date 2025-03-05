import { z } from 'zod';

export const getCreateBannerPopupSchema = () =>
    z.object({
        banner_popup_title: z.string().nonempty('Title is required'),
        banner_popup_image: z.string().optional(),
        banner_popup_is_show: z.boolean().default(true),
        banner_popup_expired_date: z.string().nonempty('Expired date is required'),
    });

export type CreateBannerPopupPayload = z.infer<ReturnType<typeof getCreateBannerPopupSchema>>;
