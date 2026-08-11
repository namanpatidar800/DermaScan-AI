import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/authService.js';
import { Mail, Lock, Loader2, AlertCircle, ScanLine } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const from = location.state?.from?.pathname || '/history';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            // After successful login, redirect
            navigate(from, { replace: true });
            // Refresh to update navbar state
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-skinova-bg">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-surface-200">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-skinova-coral to-skinova-coral-dark mb-4 shadow-lg shadow-skinova-coral/20">
                            <ScanLine className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-skinova-dark">Welcome Back</h1>
                        <p className="text-surface-500 text-sm mt-1">Sign in to access your SKINOVA history securely.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-surface-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-surface-300 rounded-xl text-surface-900 text-sm focus:outline-none focus:border-skinova-coral focus:ring-1 focus:ring-skinova-coral transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-surface-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-surface-300 rounded-xl text-surface-900 text-sm focus:outline-none focus:border-skinova-coral focus:ring-1 focus:ring-skinova-coral transition-colors"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-skinova-dark hover:bg-skinova-olive text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-md disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-surface-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-skinova-coral hover:text-skinova-coral-dark font-bold hover:underline transition-all">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
