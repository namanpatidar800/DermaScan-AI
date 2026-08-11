import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService.js';
import { User, Mail, Lock, Loader2, AlertCircle, ScanLine } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/history');
            window.location.reload();
        } catch (err) {
            let errorMsg = 'Registration failed. Please try again.';
            if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            } else if (typeof err.response?.data === 'string' && err.response.data.includes('<html')) {
                errorMsg = 'Backend server is unreachable (502/504 Proxy Error).';
            } else if (err.message) {
                errorMsg = err.message;
            }
            setError(errorMsg);
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
                        <h1 className="text-2xl font-bold text-skinova-dark">Create Account</h1>
                        <p className="text-surface-500 text-sm mt-1">Join SKINOVA to securely sync your analysis history.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-surface-400" />
                                </div>
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-surface-300 rounded-xl text-sm focus:outline-none focus:border-skinova-coral focus:ring-1 focus:ring-skinova-coral" placeholder="John Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-surface-400" />
                                </div>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-surface-300 rounded-xl text-sm focus:outline-none focus:border-skinova-coral focus:ring-1 focus:ring-skinova-coral" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-surface-400" />
                                </div>
                                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-surface-300 rounded-xl text-sm focus:outline-none focus:border-skinova-coral focus:ring-1 focus:ring-skinova-coral" placeholder="Minimum 6 characters" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-surface-900 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-surface-400" />
                                </div>
                                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-surface-300 rounded-xl text-sm focus:outline-none focus:border-skinova-coral focus:ring-1 focus:ring-skinova-coral" placeholder="Confirm your password" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-skinova-dark hover:bg-skinova-olive text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-md disabled:opacity-70">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm font-medium text-surface-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-skinova-coral hover:text-skinova-coral-dark font-bold hover:underline transition-all">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
