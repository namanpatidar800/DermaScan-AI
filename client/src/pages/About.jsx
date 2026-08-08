import { Link } from 'react-router-dom';
import { ScanLine, Shield, Lock, Users } from 'lucide-react';

const About = () => (
    <div className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4 block">About</span>
                <h1 className="text-4xl font-bold text-white mb-4">About DermaScan AI</h1>
                <p className="text-surface-200 max-w-xl mx-auto leading-relaxed">
                    An AI-assisted tool for preliminary awareness of dermatological conditions.
                </p>
            </div>

            <div className="space-y-8">
                <div className="glass-card p-8 border border-white/8">
                    <h2 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
                        <ScanLine className="w-5 h-5 text-primary-400" /> What Is DermaScan AI?
                    </h2>
                    <p className="text-surface-200 leading-relaxed mb-4">
                        DermaScan AI is an AI-powered web application designed to help people gain preliminary awareness
                        about visible skin conditions. Users can upload or capture images of affected skin areas, answer a
                        structured symptom questionnaire, and receive an AI-assisted preliminary assessment.
                    </p>
                    <p className="text-surface-200 leading-relaxed">
                        The goal is to bridge the gap between noticing a skin concern and deciding whether to seek professional
                        care — providing useful, responsibly-presented information at the moment it's needed.
                    </p>
                </div>

                <div className="glass-card p-8 border border-white/8">
                    <h2 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary-400" /> What DermaScan AI Is NOT
                    </h2>
                    <ul className="space-y-3 text-surface-200 text-sm leading-relaxed">
                        {[
                            'Not a licensed medical diagnostic tool',
                            'Not a replacement for dermatologist consultation',
                            'Not designed to diagnose, treat, or prescribe',
                            'Not a guarantee of any specific health outcome',
                            'Not a substitute for emergency medical care',
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">✗</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glass-card p-8 border border-white/8">
                    <h2 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary-400" /> Privacy & Safety
                    </h2>
                    <p className="text-surface-200 leading-relaxed mb-4">
                        We take privacy seriously. Your images and health data are stored securely, linked only to your
                        account, and are never shared with third parties or used to train models without explicit consent.
                    </p>
                    <p className="text-surface-200 leading-relaxed">
                        Images are stored using secure cloud storage. Passwords are hashed with bcrypt and never stored
                        in plain text. All API communications are secured with JWT authentication.
                    </p>
                </div>

                <div className="glass-card p-8 border border-white/8">
                    <h2 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary-400" /> Who Is It For?
                    </h2>
                    <p className="text-surface-200 leading-relaxed">
                        DermaScan AI is for anyone who notices a skin concern and wants a quick, preliminary,
                        AI-assisted perspective before deciding how to proceed. It is especially useful for individuals
                        who want to understand whether a condition warrants professional evaluation.
                    </p>
                </div>
            </div>

            <div className="text-center mt-12">
                <Link to="/how-it-works" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors">
                    Learn how it works →
                </Link>
            </div>
        </div>
    </div>
);

export default About;
