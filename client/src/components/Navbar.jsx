import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Shield, Activity, MapPin, History, Info } from 'lucide-react';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-skinova-coral-dark' : 'text-skinova-dark hover:text-skinova-coral'
        }`;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-50/90 backdrop-blur-lg border-b border-surface-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Tagline */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src="/skinova-logo1.png" alt="SKINOVA Logo" className="h-10 w-auto mix-blend-multiply transition-transform group-hover:scale-105" />
                        <div className="flex flex-col hidden sm:flex pt-1">
                            <div className="text-2xl font-light tracking-[0.1em] leading-none">
                                <span className="text-skinova-dark font-semibold">SKIN</span>
                                <span className="text-skinova-coral font-semibold">OVA</span>
                            </div>
                            <div className="text-[9px] font-bold tracking-[0.15em] text-skinova-olive mt-1.5 flex gap-1.5 justify-center">
                                <span>DETECT</span>
                                <span className="text-skinova-coral">•</span>
                                <span>ANALYZE</span>
                                <span className="text-skinova-coral">•</span>
                                <span>CARE</span>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-7">
                        <NavLink to="/" className={navLinkClass}>Home</NavLink>
                        <NavLink to="/how-it-works" className={navLinkClass}>How It Works</NavLink>
                        <NavLink to="/skin-conditions" className={navLinkClass}>Skin Conditions</NavLink>
                        <NavLink to="/history" className={navLinkClass}>Track Progress</NavLink>
                        <NavLink to="/find-dermatologist" className={navLinkClass}>Find Care</NavLink>
                    </div>

                    {/* Right side controls */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Google Translate Injection Div */}
                        <div id="google_translate_element" className="hidden sm:block mt-1"></div>

                        <Link to="/ask-skinova" className="text-xs font-bold bg-skinova-bg border border-skinova-olive/30 hover:bg-skinova-white text-skinova-dark px-4 py-2 rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1.5">
                            Ask SKINOVA ✨
                        </Link>
                        <Link to="/analysis/new" className="text-xs font-semibold bg-skinova-coral hover:bg-skinova-coral-dark text-white px-5 py-2 rounded-xl transition-all duration-200 shadow-md shadow-skinova-coral/20">
                            Scan Skin
                        </Link>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden text-skinova-dark hover:text-skinova-coral p-2"
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
