import { User } from './auth';

interface PaginationResponse {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

interface ApiResponse<T> {
    status: string;
    message: string;
    data: {
        results: T[];
        pagination: PaginationResponse;
    };
    errors: string[];
}

interface ApiGetOneResponse<T> {
    status: string;
    message: string;
    data: T;
    errors: string[];
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
