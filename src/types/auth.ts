export interface User {
    user_id: string;
    user_email: string;
    role_code: string;
    role_name: string;
    user_fname: string;
    user_lname: string;
    user_phone: string | null;
    user_address: string | null;
    user_is_verified: boolean;
    user_last_active: string;
    user_created_date: string;
    user_updated_date: string;
}

export interface AuthData {
    user: User;
    token: string;
}

export interface LoginRequest {
    user_email: string;
    user_password: string;
}
