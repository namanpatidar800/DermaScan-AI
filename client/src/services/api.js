import axios from 'axios';

let base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Intelligent autocorrect: If user deployed and forgot to add /api (e.g. https://render.com instead of https://render.com/api)
if (base.startsWith('http') && !base.includes('/api')) {
    base = base.replace(/\/$/, '') + '/api';
}
if (!base.endsWith('/')) {
    base += '/';
}

const api = axios.create({
    baseURL: base,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
    (config) => {
        // Prevent Axios from interpreting leading slashes as domain-root overrides (e.g. dropping the /api/ prefix)
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }

        const token = localStorage.getItem('skinova_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 globally — redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('skinova_token');
            localStorage.removeItem('skinova_user');
            // Only redirect if not already on auth pages
            if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
