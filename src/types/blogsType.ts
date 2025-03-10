import { BlogKeyword } from './blogKeywordsType';

export interface Blog {
    blog_id: string;
    user_id: string;
    blog_category_id: string;
    blog_banner_image: string;
    blog_title: string;
    blog_desc: string;
    blog_created_date: string;
    user_name: string;
    blog_category_name: string;
    blog_keywords: BlogKeyword[];
}
