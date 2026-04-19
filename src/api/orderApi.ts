import { ApiResponse } from '../types/api';
import { axiosInstance } from './base';
import { Order } from '../types/orderType';

export interface GetAllOrderPayload {
    startDate?: string;
    endDate?: string;
    order_is_completed?: string;
    order_search?: string;
}

export const ApiGetAllOrder = async (params: Record<string, any>, body?: Partial<GetAllOrderPayload>) => {
    const processedBody = body
        ? {
              ...body,
              order_is_completed: body.order_is_completed ? body.order_is_completed === 'true' : undefined,
          }
        : undefined;

    const filteredBody = processedBody ? Object.fromEntries(Object.entries(processedBody).filter(([_, value]) => value !== null && value !== undefined)) : undefined;

    const response = await axiosInstance.post<ApiResponse<Order[]>>('/orders/all', filteredBody, { params });
    return response.data;
};

export const ApiUpdateOrderCompletion = async (id: string) => {
    const response = await axiosInstance.patch<ApiResponse<Order>>(`/orders/is-completed/${id}`);

    return response.data;
};

export const ApiUpdateOrderUserVerified = async (id: string) => {
    const response = await axiosInstance.patch<ApiResponse<Order>>(`/orders/user-verified/${id}`);

    return response.data;
};

export const ApiGetOrderById = async (orderId: string) => {
    const response = await axiosInstance.get<ApiResponse<Order>>(`/orders`, {
        params: { order_id: orderId },
    });

    return response.data;
};

export const ApiDeleteOrder = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
};

export const ApiDownloadOrder = async (params: Record<string, any>, body?: GetAllOrderPayload) => {
    const response = await axiosInstance.post('orders/download', body, {
        params,
        responseType: 'arraybuffer',
        headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
    });

    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition ? decodeURIComponent(contentDisposition.split('filename=')[1].replace(/['"]/g, '')) : 'orders.xlsx';

    return {
        data: new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        filename,
    };
};

export const ApiGetOrdersByEmail = async ({ email, page, limit }: { email: string; page: number; limit: number }) => {
    const response = await axiosInstance.get<ApiResponse<Order[]>>('/orders/by-email', {
        params: {
            order_email: email,
            page,
            limit,
            sort: 'created_at:desc',
        },
    });
    return response.data;
};

export const ApiGetOrderStats = async (params?: { startDate?: string; endDate?: string; order_is_completed?: string }) => {
    const filteredParams = params ? Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== null && value !== undefined && value !== '')) : undefined;
    const response = await axiosInstance.get<ApiResponse<{
        total_orders: number;
        completed_orders: number;
        pending_orders: number;
        total_revenue: number;
    }>>('/orders/stats', { params: filteredParams });
    return response.data;
};
