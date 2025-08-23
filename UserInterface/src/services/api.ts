/**
 * API Service
 * Centralized service for all API calls
 */

import { handleApiError, createApiError } from './interceptors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface LoginRequest {
    cpf: string;
    password: string;
}

interface RegisterRequest {
    name: string;
    cpf: string;
    password: string;
    gender?: string;
    email?: string;
    birthDate: string;
    placeOfBirth?: string;
    nationality?: string;
}

export interface Person {
    id: string;
    cpf: string;
    name: string;
    gender?: string;
    email?: string;
    birthDate: string;
    placeOfBirth?: string;
    nationality?: string;
}

interface UpdatePersonRequest {
    name: string;
    email?: string;
    birthDate: string;
    placeOfBirth?: string;
    nationality?: string;
    gender?: string;
}

export interface LoginResponse {
    accessToken: string;
    expiresAt: string;
    person: Person;
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers: defaultHeaders,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const apiError = createApiError(
                errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                response.status,
                errorData
            );
            throw apiError;
        }

        if (response) {
            try {
                const data = await response.json();
                return data;
            } catch { }
        }
    } catch (error: any) {
        console.error('API request error:', error);
        // Handle API errors with interceptor
        if (error.status) {
            handleApiError(error, false); // Don't show toast here, let components handle it                    
            throw error;
        }

        // Handle network/fetch errors
        const networkError = createApiError('Erro de conexão com o servidor');
        handleApiError(networkError, false);
        throw networkError;
    }
}

/**
 * Authentication API
 */
export const authApi = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return apiRequest('/persons/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    async register(userData: RegisterRequest): Promise<void> {
        return apiRequest('/persons', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },
};

/**
 * People API
 */
export const peopleApi = {
    async getAll(): Promise<Person[]> {
        return apiRequest('/persons');
    },

    async getById(id: string): Promise<Person> {
        return apiRequest(`/person/${id}`);
    },

    async create(personData: Omit<Person, 'id'>): Promise<Person> {
        return apiRequest('/persons', {
            method: 'POST',
            body: JSON.stringify(personData),
        });
    },

    async update(id: string, personData: UpdatePersonRequest): Promise<void> {
        return apiRequest(`/persons/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(personData),
        });
    },

    async delete(id: string): Promise<void> {
        return apiRequest(`/persons/${id}`, {
            method: 'DELETE',
        });
    },
};

export default {
    auth: authApi,
    people: peopleApi,
};
