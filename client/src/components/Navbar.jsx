import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
    ScanLine, Menu, X, LayoutDashboard, History, MapPin,
    User, LogOut, Activity
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setMobileOpen(false);
    };

    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary-400' : 'text-surface-200 hover:text-white'
        }`;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-950/90 backdrop-blur-lg border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                            <ScanLine className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">
                            Derma<span className="text-primary-400">Scan</span>
                            <span className="text-xs ml-1 text-primary-500 font-semibold">AI</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-7">
                        <NavLink to="/how-it-works" className={navLinkClass}>How It Works</NavLink>
                        {user && (
                            <>
                                <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                                <NavLink to="/history" className={navLinkClass}>History</NavLink>
                                <NavLink to="/find-dermatologist" className={navLinkClass}>Find Doctor</NavLink>
                            </>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-800 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm text-white font-medium">{user.name?.split(' ')[0]}</span>
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-52 glass-card border border-white/10 py-2 shadow-xl">
                                        <div className="px-4 py-2 border-b border-white/10 mb-1">
                                            <p className="text-xs text-surface-200 truncate">{user.email}</p>
                                        </div>
                                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-surface-200 hover:text-white hover:bg-surface-800 transition-colors">
                                            <User className="w-4 h-4" /> Profile
                                        </Link>
                                        <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-surface-200 hover:text-white hover:bg-surface-800 transition-colors">
                                            <Activity className="w-4 h-4" /> Settings
                                        </Link>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-surface-800 transition-colors">
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-surface-200 hover:text-white transition-colors px-4 py-2">
                                    Sign In
                                </Link>
                                <Link to="/register" className="text-sm font-semibold bg-primary-500 hover:bg-primary-400 text-white px-5 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/20 hover:shadow-primary-400/30">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden text-surface-200 hover:text-white p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-surface-900 border-t border-white/5 px-4 py-4 space-y-3 animate-fade-in">
                    <NavLink to="/how-it-works" onClick={() => setMobileOpen(false)} className={navLinkClass}>How It Works</NavLink>
                    {user ? (
                        <>
                            <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 ${navLinkClass({ isActive: false })}`}>
                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </NavLink>
                            <NavLink to="/history" onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 ${navLinkClass({ isActive: false })}`}>
                                <History className="w-4 h-4" /> History
                            </NavLink>
                            <NavLink to="/find-dermatologist" onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 ${navLinkClass({ isActive: false })}`}>
                                <MapPin className="w-4 h-4" /> Find Doctor
                            </NavLink>
                            <NavLink to="/profile" onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 ${navLinkClass({ isActive: false })}`}>
                                <User className="w-4 h-4" /> Profile
                            </NavLink>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 pt-2">
                            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center py-2.5 rounded-xl border border-white/10 text-sm font-medium text-surface-200">Sign In</Link>
                            <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center py-2.5 rounded-xl bg-primary-500 text-sm font-semibold text-white">Get Started</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
