import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const showMessage = (msg = '', type = 'success') => {
    const toast: any = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        customClass: { container: 'toast' },
    });
    toast.fire({
        icon: type,
        title: msg,
        padding: '10px 20px',
    });
};

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        const method = response.config?.method?.toUpperCase() ?? '';
        const url = response.config?.url ?? '';
        if (method !== 'GET' && !(method === 'DELETE' && url.includes('/upload-image/blog')) && response.data && response.data.message) {
            showMessage(response.data.message, 'success');
        }
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                showMessage('Your session has expired. Please login again.', 'error');
                Cookies.remove('accessToken');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
                return Promise.reject(error);
            }

            if (data && data.message) {
                showMessage(data.message, 'error');
            } else if (error.message) {
                showMessage(error.message, 'error');
            } else {
                showMessage('Something went wrong, please try again', 'error');
            }
        }
        return Promise.reject(error);
    }
);
