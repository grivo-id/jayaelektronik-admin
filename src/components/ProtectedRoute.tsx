import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useStore } from '../store/store';

const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const navigate = useNavigate();
    const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
    const setUser = useStore((state) => state.setUser);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            navigate('/login');
        }
    }, [navigate, setIsAuthenticated, setUser]);

    return <>{children}</>;
};

export default ProtectedRoute;
