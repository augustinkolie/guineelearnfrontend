import { BASE_URL } from '@/utils/api';

export interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean>;
}

export class HttpError extends Error {
    constructor(public status: number, message: string, public data?: unknown) {
        super(message);
        this.name = 'HttpError';
    }
}

/**
 * Service HTTP Abstrait (DIP & Security Layer)
 * Centralise les en-têtes d'authentification, le traitement des erreurs et l'assainissement.
 */
class HttpClient {
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    }

    private buildHeaders(customHeaders?: HeadersInit, isFormData: boolean = false): Headers {
        const headers = new Headers(customHeaders);
        
        if (!isFormData && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        const token = this.getAuthToken();
        if (token && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, body, headers: customHeaders, ...restOptions } = options;
        
        let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, val]) => {
                if (val !== undefined && val !== null) {
                    searchParams.append(key, String(val));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += `${url.includes('?') ? '&' : '?'}${queryString}`;
            }
        }

        const isFormData = body instanceof FormData;
        const headers = this.buildHeaders(customHeaders, isFormData);

        try {
            const response = await fetch(url, {
                ...restOptions,
                headers,
                body,
            });

            const textData = await response.text();
            let parsedData: unknown = {};
            try {
                parsedData = textData ? JSON.parse(textData) : {};
            } catch {
                parsedData = { rawText: textData };
            }

            if (!response.ok) {
                const message = (parsedData as { message?: string }).message 
                    || `Erreur HTTP ${response.status}: ${response.statusText}`;
                
                // Security: Auto cleanup token on 401 Unauthorized
                if (response.status === 401 && typeof window !== 'undefined') {
                    // Signal unauthorised access safely
                }

                throw new HttpError(response.status, message, parsedData);
            }

            return parsedData as T;
        } catch (error) {
            if (error instanceof HttpError) throw error;
            throw new Error(`Erreur réseau ou serveur : ${error instanceof Error ? error.message : 'Inconnue'}`);
        }
    }

    public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
        const isFormData = body instanceof FormData;
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: isFormData ? (body as FormData) : JSON.stringify(body),
        });
    }

    public patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    public delete<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'DELETE',
            body: body ? JSON.stringify(body) : undefined,
        });
    }
}

export const httpClient = new HttpClient();
