import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ScanLine, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const passwordStrength = (pwd) => {
        if (!pwd) return 0;
        let score = 0;
        if (pwd.length >= 6) score++;
        if (pwd.length >= 10) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };
    const strength = passwordStrength(form.password);
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
    const strengthColor = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-primary-400', 'bg-green-400'][strength];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
            return setError('Passwords do not match');
        }
        if (form.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <ScanLine className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl">Derma<span className="text-primary-400">Scan</span> AI</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
                    <p className="text-surface-200 text-sm">Start your AI-assisted skin health journey</p>
                </div>

                <div className="glass-card p-8 border border-white/8">
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-6">
                            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-surface-200 mb-2">Full name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-white/10 text-white placeholder-surface-200 focus:outline-none focus:border-primary-500/60 transition-all text-sm"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-200 mb-2">Email address</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-white/10 text-white placeholder-surface-200 focus:outline-none focus:border-primary-500/60 transition-all text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-200 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-white/10 text-white placeholder-surface-200 focus:outline-none focus:border-primary-500/60 transition-all text-sm pr-12"
                                    placeholder="Min. 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-200 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {form.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-surface-700'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-surface-200">{strengthLabel}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-200 mb-2">Confirm password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={form.confirm}
                                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-white/10 text-white placeholder-surface-200 focus:outline-none focus:border-primary-500/60 transition-all text-sm pr-10"
                                    placeholder="Confirm your password"
                                />
                                {form.confirm && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {form.password === form.confirm
                                            ? <CheckCircle className="w-4 h-4 text-primary-400" />
                                            : <AlertCircle className="w-4 h-4 text-red-400" />
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl bg-primary-500/10 border border-primary-500/20 p-3 text-xs text-primary-300">
                            ⚕️ By creating an account you acknowledge that DermaScan AI provides preliminary information only, not medical diagnosis.
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                        >
                            {loading
                                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <><ArrowRight className="w-4 h-4" /> Create Account</>
                            }
                        </button>
                    </form>

                    <p className="text-center text-sm text-surface-200 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
