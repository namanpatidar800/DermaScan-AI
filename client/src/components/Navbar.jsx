import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Shield, Activity, MapPin, History, Info } from 'lucide-react';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-surface-800 hover:text-primary-600'
        }`;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-50/90 backdrop-blur-lg border-b border-surface-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/skinova-logo.jpeg" alt="SKINOVA" className="h-9 w-auto mix-blend-multiply transition-transform group-hover:scale-105" />
                        <span className="text-surface-900 font-bold text-xl tracking-tight hidden sm:block">
                            SKINOVA
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-7">
                        <NavLink to="/" className={navLinkClass}>Home</NavLink>
                        <NavLink to="/how-it-works" className={navLinkClass}>How It Works</NavLink>
                        <NavLink to="/skin-conditions" className={navLinkClass}>Skin Conditions</NavLink>
                        <NavLink to="/history" className={navLinkClass}>Track Progress</NavLink>
                        <NavLink to="/find-dermatologist" className={navLinkClass}>Find Care</NavLink>
                    </div>

                    {/* Right side CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/ask-skinova" className="text-sm font-bold bg-white border border-surface-200 hover:bg-surface-50 text-primary-600 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1.5">
                            Ask SKINOVA ✨
                        </Link>
                        <Link to="/analysis/new" className="text-sm font-semibold bg-secondary-500 hover:bg-secondary-600 text-white px-5 py-2 rounded-xl transition-all duration-200 shadow-md shadow-secondary-500/20">
                            Scan Skin
                        </Link>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden text-surface-800 hover:text-primary-600 p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-surface-50 border-t border-surface-200 px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
                    <NavLink to="/" onClick={() => setMobileOpen(false)} className={navLinkClass}>Home</NavLink>
                    <NavLink to="/how-it-works" onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 ${navLinkClass({ isActive: false })}`}>
                        <Info className="w-4 h-4" /> How It Works
                    </NavLink>
                    <NavLink to="/skin-conditions" onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 ${navLinkClass({ isActive: false })}`}>
                        <Shield className="w-4 h-4" /> Skin Conditions
                    </NavLink>
                    <NavLink to="/history" onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 ${navLinkClass({ isActive: false })}`}>
                        <History className="w-4 h-4" /> Track Progress
                    </NavLink>
                    <NavLink to="/find-dermatologist" onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 ${navLinkClass({ isActive: false })}`}>
                        <MapPin className="w-4 h-4" /> Find Care
                    </NavLink>
                    <div className="pt-3 pb-2 border-t border-surface-200 mt-2 text-center">
                        <Link to="/analysis/new" onClick={() => setMobileOpen(false)} className="block w-full py-2.5 rounded-xl bg-secondary-500 text-sm font-semibold text-white shadow-md">
                            Scan Skin Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
