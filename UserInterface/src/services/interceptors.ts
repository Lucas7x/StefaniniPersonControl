/**
 * HTTP Interceptor for handling API responses
 * Provides centralized error handling and authentication management
 */

import { toast } from '@/hooks/use-toast';

export interface ApiError extends Error {
    status?: number;
    data?: any;
}

export const handleApiError = (error: ApiError, showToast: boolean = true) => {
    console.error('API Error:', error);

    // Handle authentication errors
    if (error.status === 401) {
        // Clear authentication data
        localStorage.removeItem('authToken');

        if (showToast) {
            toast({
                title: "Sessão expirada",
                description: "Faça login novamente para continuar.",
                variant: "destructive"
            });
        }

        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }

        return;
    }

    // Handle server errors
    if (error.status && error.status >= 500) {
        if (showToast) {
            toast({
                title: "Erro do servidor",
                description: "Tente novamente mais tarde ou contate o suporte.",
                variant: "destructive"
            });
        }
        return;
    }

    // Handle network errors
    if (!error.status) {
        if (showToast) {
            toast({
                title: "Erro de conexão",
                description: "Verifique sua conexão com a internet.",
                variant: "destructive"
            });
        }
        return;
    }

    // Default error handling
    if (showToast) {
        toast({
            title: "Erro",
            description: error.message || "Ocorreu um erro inesperado.",
            variant: "destructive"
        });
    }
};

export const isNetworkError = (error: any): boolean => {
    return !error.status && (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('connexão') ||
        error.message.includes('connection')
    );
};

export const createApiError = (message: string, status?: number, data?: any): ApiError => {
    const error = new Error(message) as ApiError;
    error.status = status;
    error.data = data;
    return error;
};
