const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
export const BASE_URL = (rawApiUrl && rawApiUrl !== 'undefined') 
    ? rawApiUrl.replace('/api', '') 
    : 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const headers: any = { ...options.headers };
    
    // Si ce n'est pas du FormData, on met le Content-Type par défaut
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    let data: any = {};
    try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
    } catch (e) {
        // If it's not JSON, we keep data as empty object
        console.warn('API response is not valid JSON:', e);
    }

    if (!response.ok) {
        const errorMsg = data.message || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(`${errorMsg} (Endpoint: ${options.method || 'GET'} ${endpoint})`);
    }
    return data;
};

export const logActivity = async (activity: {
    subject: string;
    lesson: string;
    timeSpent?: string;
    progress?: number;
    status?: string;
}) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        await apiCall('/user/learning-activities', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                timeSpent: '5 min',
                progress: 100,
                status: 'Terminé',
                ...activity
            })
        });
    } catch (err) {
        console.error("Error logging activity:", err);
    }
};

