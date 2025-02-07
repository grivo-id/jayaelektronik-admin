import { ApiResponse } from '../types/api';
import { axiosInstance } from './base';
import { Order } from '../types/orderType';

export interface GetAllOrderPayload {
    startDate: string;
    endDate: string;
}

export const ApiGetAllOrder = async (params: Record<string, any>, body?: GetAllOrderPayload) => {
    const response = await axiosInstance.post<ApiResponse<Order[]>>('/orders/all', body, { params });

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
