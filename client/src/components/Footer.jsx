import { Link } from 'react-router-dom';
import { ScanLine, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-surface-950 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2.5 mb-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
                                <ScanLine className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">SKIN<span className="text-primary-400">OVA</span></span>
                        </Link>
                        <p className="text-surface-200 text-sm leading-relaxed max-w-xs">
                            AI-assisted preliminary assessment of visible skin conditions — helping you understand possible
                            concerns and decide what to do next.
                        </p>
                        <p className="mt-4 text-xs text-primary-400 font-medium bg-primary-500/10 border border-primary-500/20 rounded-lg px-3 py-2">
                            ⚕️ AI-assisted information, not a medical diagnosis.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-3 text-sm">Product</h4>
                        <ul className="space-y-2.5">
                            {[
                                { to: '/how-it-works', label: 'How It Works' },
                                { to: '/about', label: 'About SKINOVA' },
                                { to: '/register', label: 'Get Started' },
                                { to: '/find-dermatologist', label: 'Find a Dermatologist' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-sm text-surface-200 hover:text-primary-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3 text-sm">Legal & Info</h4>
                        <ul className="space-y-2.5">
                            {[
                                { to: '/disclaimer', label: 'Medical Disclaimer' },
                                { to: '/about', label: 'Privacy & Safety' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-sm text-surface-200 hover:text-primary-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Disclaimer bar */}
                <div className="border-t border-white/5 pt-6">
                    <p className="text-xs text-surface-200 text-center mb-4 leading-relaxed max-w-3xl mx-auto">
                        <strong className="text-yellow-400">Important Disclaimer:</strong> SKINOVA provides AI-assisted
                        preliminary information only. It is NOT a substitute for professional medical advice, diagnosis, or
                        treatment. Always consult a qualified healthcare professional for proper diagnosis and treatment.
                    </p>
                    <div className="flex items-center justify-center gap-1 text-xs text-surface-200">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-red-400 fill-current" />
                        <span>for better skin health awareness · SKINOVA © {new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
