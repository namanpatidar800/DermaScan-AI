import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { Shield, LogOut, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        if (confirmText !== 'DELETE') return;
        setDeleting(true);
        try {
            await api.delete('/users/account');
            await logout();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete account.');
            setDeleting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

            <div className="space-y-5">
                {/* Account info */}
                <div className="glass-card p-6 border border-white/8">
                    <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary-400" /> Account
                    </h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-surface-200">
                            <span>Email</span><span className="text-white">{user?.email}</span>
                        </div>
                        <div className="flex justify-between text-surface-200">
                            <span>Name</span><span className="text-white">{user?.name}</span>
                        </div>
                        <div className="flex justify-between text-surface-200">
                            <span>Account Created</span>
                            <span className="text-white">
                                {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* AI & Privacy info */}
                <div className="glass-card p-6 border border-white/8">
                    <h2 className="font-semibold text-white mb-4">AI & Privacy</h2>
                    <div className="space-y-3 text-sm text-surface-200">
                        <p>Your skin images and analysis data are stored securely and linked only to your account.</p>
                        <p>DermaScan AI uses a mock AI provider for demonstration purposes. Results are preliminary only.</p>
                        <p>You can delete individual analyses from Analysis History, or delete your entire account below.</p>
                    </div>
                </div>

                {/* Sign out */}
                <div className="glass-card p-6 border border-white/8">
                    <h2 className="font-semibold text-white mb-4">Session</h2>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-surface-200 hover:text-white text-sm font-medium transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                {/* Danger zone */}
                <div className="glass-card p-6 border border-red-500/20 bg-red-500/3">
                    <h2 className="font-semibold text-red-400 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Danger Zone
                    </h2>
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-4">
                            {error}
                        </div>
                    )}
                    {!showDeleteConfirm ? (
                        <div>
                            <p className="text-surface-200 text-sm mb-4">Deleting your account will permanently remove all your analyses and data. This cannot be undone.</p>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all"
                            >
                                <Trash2 className="w-4 h-4" /> Delete My Account
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-red-300 text-sm">Type <strong>DELETE</strong> to confirm account deletion:</p>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="Type DELETE to confirm"
                                className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-red-500/30 text-white focus:outline-none focus:border-red-500/60 transition-all text-sm"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowDeleteConfirm(false); setConfirmText(''); }}
                                    className="px-5 py-2.5 rounded-xl border border-white/10 text-surface-200 hover:text-white text-sm font-medium transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={confirmText !== 'DELETE' || deleting}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-40 text-white text-sm font-semibold transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {deleting ? 'Deleting...' : 'Permanently Delete Account'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
