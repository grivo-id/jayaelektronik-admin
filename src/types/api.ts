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
        token: {
            value: string;
            expiresIn: number;
        };
    };
    errors: string[];
}

interface FetchError {
    message: string;
    code?: string;
    status?: number;
}

interface UploadResponse {
    nameFile: string;
    fileUrl: string;
}

interface QueryParams {
    page?: number;
    limit?: number;
    sort?: string;
}

export type { ApiResponse, PaginationResponse, FetchError, LoginResponse, ApiGetOneResponse, UploadResponse, QueryParams };
