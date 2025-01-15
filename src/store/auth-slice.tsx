import { StateCreator } from 'zustand';
import { User } from '../types/auth';

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
};

type AuthActions = {
    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
};

export type AuthSlice = AuthState & AuthActions;

export const createAuthSlice: StateCreator<AuthSlice, [['zustand/immer', never]], [], AuthSlice> = (set) => ({
    isAuthenticated: false,
    user: null,

    setIsAuthenticated: (value) => {
        set((state) => {
            state.isAuthenticated = value;
        });
    },
    setUser: (user) => {
        set((state) => {
            state.user = user;
        });
    },
});
