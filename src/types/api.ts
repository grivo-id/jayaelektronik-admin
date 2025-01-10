import { User } from './auth';

interface PaginationResponse {
    totalData: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ApiResponse<T> {
    success: string;
    message: string;
    data: T;
    pagination: PaginationResponse;
}

interface ApiGetOneResponse<T> {
    status: string;
    message: string;
    data: T;
}

interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
    errors: string[];
}

interface FetchError {
    message: string;
    code?: string;
    status?: number;
}

export type { ApiResponse, PaginationResponse, FetchError, LoginResponse, ApiGetOneResponse };
