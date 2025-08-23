import { useState, useEffect } from 'react';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: any | null;
}

export const useAuth = () => {
    const [auth, setAuth] = useState<AuthState>({
        isAuthenticated: false,
        token: null,
        user: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setAuth({
                isAuthenticated: true,
                token,
                user: null, // You can decode token or fetch user data here
            });
        }
    }, []);

    const login = (token: string, user?: any) => {
        localStorage.setItem('authToken', token);
        setAuth({
            isAuthenticated: true,
            token,
            user,
        });
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setAuth({
            isAuthenticated: false,
            token: null,
            user: null,
        });
    };

    const getAuthHeader = () => {
        return auth.token ? { Authorization: `Bearer ${auth.token}` } : {};
    };

    return {
        ...auth,
        login,
        logout,
        getAuthHeader,
    };
};
