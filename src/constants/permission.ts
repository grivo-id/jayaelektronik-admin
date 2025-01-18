export enum Role {
    MANAGER = 'Manager',
    ADMIN = 'Admin',
    DEVELOPER = 'Developer',
}

export enum Permission {
    DASHBOARD = 'dashboard',
    ADMIN_PERMISSION = 'admin',
    LIST_ORDER_CUSTOMER = 'list_order_customer',
    PRODUCT = 'product',
    MANAGE_PRODUCT = 'manage_product',
    MANAGE_PRODUCT_CATEGORY = 'manage_product_category',
    MANAGE_PRODUCT_SUB_CATEGORY = 'manage_product_sub_category',
    MANAGE_COUPON_DISCOUNT = 'manage_coupon_discount',
    BANNER_PRODUCT = 'banner_product',
    MANAGE_HOME_BANNER = 'manage_home_banner',
    MANAGE_DEALS_OF_THE_WEEK = 'manage_deals_of_the_week',
    BLOG = 'blog',
    MANAGE_BLOG = 'manage_blog',
    MANAGE_BLOG_CATEGORY = 'manage_blog_category',
    MANAGE_KEYWORDS = 'manage_keywords',
    MANAGE_BRAND = 'manage_brand',

    MANAGER_PERMISSION = 'manager',
    MANAGE_USER = 'manage_user',
    MANAGE_ADMIN = 'manage_admin',

    SETTING = 'setting',
    ACCOUNT_PROFILE = 'account_profile',
}

export const RolePermissions: Record<Role, Permission[]> = {
    [Role.MANAGER]: Object.values(Permission),
    [Role.DEVELOPER]: Object.values(Permission),
    [Role.ADMIN]: [
        Permission.DASHBOARD,
        Permission.ADMIN_PERMISSION,
        Permission.LIST_ORDER_CUSTOMER,
        Permission.PRODUCT,
        Permission.MANAGE_PRODUCT,
        Permission.MANAGE_PRODUCT_CATEGORY,
        Permission.MANAGE_PRODUCT_SUB_CATEGORY,
        Permission.MANAGE_COUPON_DISCOUNT,
        Permission.BANNER_PRODUCT,
        Permission.MANAGE_HOME_BANNER,
        Permission.MANAGE_DEALS_OF_THE_WEEK,
        Permission.BLOG,
        Permission.MANAGE_BLOG,
        Permission.MANAGE_BLOG_CATEGORY,
        Permission.MANAGE_KEYWORDS,
        Permission.MANAGE_BRAND,
        Permission.SETTING,
        Permission.ACCOUNT_PROFILE,
    ],
};

export type User = {
    role: Role;
};
