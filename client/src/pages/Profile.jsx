import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { User, Camera, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ name: user?.name || '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const { data } = await api.put('/users/profile', { name: form.name });
            updateUser(data.user);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-white mb-8">My Profile</h1>

            <div className="glass-card p-8 border border-white/8">
                {/* Avatar */}
                <div className="flex items-center gap-5 mb-8 pb-8 border-b border-white/8">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-primary-500/20">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-white font-semibold text-lg">{user?.name}</h2>
                        <p className="text-surface-200 text-sm">{user?.email}</p>
                        <p className="text-xs text-surface-200 mt-1">
                            Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {success && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-sm mb-6">
                        <CheckCircle className="w-4 h-4 shrink-0" /> {success}
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-6">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-surface-200 mb-2">Full name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-white/10 text-white focus:outline-none focus:border-primary-500/60 transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-surface-200 mb-2">Email address</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 rounded-xl bg-surface-800/30 border border-white/5 text-surface-200 text-sm cursor-not-allowed"
                        />
                        <p className="text-xs text-surface-200 mt-1">Email cannot be changed.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-400 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
