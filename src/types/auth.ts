export interface User {
    user_id?: string;
    role_id?: number;
    role_name?: string;
    role_code?: string;
    user_fname?: string;
    user_lname?: string;
    user_email?: string;
    user_phone?: string;
    user_address?: string;
    user_is_active?: boolean;
    user_is_verified?: boolean;
    user_last_active?: string;
    user_created_date?: string;
    user_updated_date?: string;
}

export interface AuthData {
    user: User;
    token: string;
}

export interface LoginRequest {
    user_email: string;
    user_password: string;
}
