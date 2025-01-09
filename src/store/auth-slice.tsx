import { StateCreator } from 'zustand';

type AuthState = {
    isAuthenticated: boolean;
};

type AuthActions = {
    setIsAuthenticated: (value: boolean) => void;
};

export type AuthSlice = AuthState & AuthActions;

export const createAuthSlice: StateCreator<AuthSlice, [['zustand/immer', never]], [], AuthSlice> = (set) => ({
    isAuthenticated: false,

    setIsAuthenticated: (value) => {
        set((state) => {
            state.isAuthenticated = value;
        });
    },
});
