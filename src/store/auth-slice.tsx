import { StateCreator } from 'zustand';
import { LoginRequest } from '../types/auth';

type AuthState = {
    isLoggedIn: boolean;
};

type AuthActions = {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
};

export type AuthSlice = AuthState & AuthActions;

export const createAuthSlice: StateCreator<AuthSlice, [['zustand/immer', never]], [], AuthSlice> = (set) => ({
    isLoggedIn: false,
    login: async (credentials: LoginRequest) => {
        console.log(credentials);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        set({ isLoggedIn: true });
    },
    logout: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set({ isLoggedIn: false });
    },
});
