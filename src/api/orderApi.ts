import { ApiResponse } from '../types/api';
import { axiosInstance } from './base';
import { Order } from '../types/orderType';

export interface GetAllOrderPayload {
    startDate: string;
    endDate: string;
    order_is_completed?: string;
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
