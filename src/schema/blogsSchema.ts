import { z } from 'zod';

export const createBlogSchema = z.object({
    blog_category_id: z.string().min(1, 'Kategori blog wajib dipilih'),
    blog_title: z
        .string()
        .min(1, 'Judul blog wajib diisi')
        .max(100, 'Judul blog maksimal 100 karakter')
        .regex(
            /^[a-zA-Z0-9\s\-]+$/,
            'Judul blog hanya boleh mengandung huruf, angka, spasi, dan tanda hubung (-). Tidak diperbolehkan menggunakan karakter spesial seperti ! @ # $ % ^ & * ( ) _ + = [ ] { } | ; : \' ", . < > / ?'
        ),
    blog_desc: z.string().min(1, 'Deskripsi blog wajib diisi'),
    blogKeywordNames: z.array(z.string()).min(1, 'Pilih minimal satu kata kunci'),
});

export type CreateBlogPayload = z.infer<typeof createBlogSchema>;
