import { useMutation } from '@tanstack/react-query';
import { ApiLogin } from '../api/authApi';
import { useStore } from '../store/store';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const useAuthMutation = () => {
    const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
    const setUser = useStore((state) => state.setUser);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ApiLogin,
        onSuccess: async (data) => {
            setIsAuthenticated(true);
            setUser(data.data.user);
            Cookies.set('accessToken', data.data.token, { expires: 7, path: '/' });
            navigate('/');
        },
    });
};

export const useLogout = () => {
    const navigate = useNavigate();
    const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
    const setUser = useStore((state) => state.setUser);

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        Cookies.remove('accessToken');
        navigate('/login');
    };

    return logout;
};
