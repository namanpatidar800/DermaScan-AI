import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi, getMe } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('dermascan_token'));
    const [loading, setLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const init = async () => {
            const savedToken = localStorage.getItem('dermascan_token');
            if (savedToken) {
                try {
                    const data = await getMe();
                    setUser(data.user);
                } catch {
                    localStorage.removeItem('dermascan_token');
                    localStorage.removeItem('dermascan_user');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        init();
    }, []);

    const login = useCallback(async (email, password) => {
        const data = await loginApi(email, password);
        localStorage.setItem('dermascan_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    }, []);

    const register = useCallback(async (name, email, password) => {
        const data = await registerApi(name, email, password);
        localStorage.setItem('dermascan_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    }, []);

    const logout = useCallback(async () => {
        try { await logoutApi(); } catch { /* ignore */ }
        localStorage.removeItem('dermascan_token');
        localStorage.removeItem('dermascan_user');
        setToken(null);
        setUser(null);
    }, []);

    const updateUser = useCallback((updatedUser) => {
        setUser(updatedUser);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export default AuthContext;
