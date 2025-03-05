import { CreateBannerPopupPayload } from '../schema/bannerPopupSchema';
import { ApiResponse } from '../types/api';
import { BannerPopup } from '../types/bannerType';
import { axiosInstance } from './base';

export const ApiGetAllBannerPopup = async (params: Record<string, any>) => {
    const response = await axiosInstance.get<ApiResponse<BannerPopup[]>>('/banner-popups', { params });
    return response.data;
};

export const ApiCreateBannerPopup = async (payload: CreateBannerPopupPayload) => {
    const response = await axiosInstance.post<ApiResponse<BannerPopup>>('/banner-popups', payload);
    return response.data;
};

export const ApiUpdateBannerPopup = async (id: string, payload: CreateBannerPopupPayload) => {
    const response = await axiosInstance.put<ApiResponse<BannerPopup>>(`/banner-popups/${id}`, payload);
    return response.data;
};

export const ApiDeleteBannerPopup = async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<BannerPopup>>(`/banner-popups/${id}`);
    return response.data;
};

export const ApiToggleBannerPopupVisibility = async (id: string, isShow: boolean) => {
    const response = await axiosInstance.patch<ApiResponse<BannerPopup>>(`/banner-popups/visibility/${id}`, {
        banner_popup_is_show: isShow,
    });
    return response.data;
};
