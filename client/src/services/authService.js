import api from './api.js';

export const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
        localStorage.setItem('skinova_token', data.token);
        localStorage.setItem('skinova_user', JSON.stringify(data.user || {}));
    }
    return data;
};

export const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    if (data.token) {
        localStorage.setItem('skinova_token', data.token);
        localStorage.setItem('skinova_user', JSON.stringify(data.user || {}));
    }
    return data;
};

export const getMe = async () => {
    const { data } = await api.get('/auth/me');
    return data;
};

export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) {
        // Ignore network errors on logout
    }
    localStorage.removeItem('skinova_token');
    localStorage.removeItem('skinova_user');
};
