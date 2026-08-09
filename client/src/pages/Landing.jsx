import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
    ScanLine, ArrowRight, Upload, FileText, Zap, MapPin,
    Shield, Lock, Activity, ChevronRight, Star, Users, TrendingUp
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="glass-card p-6 hover:border-primary-500/40 transition-all duration-300 group">
        <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center mb-4 group-hover:bg-primary-500/25 transition-colors">
            <Icon className="w-6 h-6 text-primary-400" />
        </div>
        <h3 className="font-semibold text-white mb-2">{title}</h3>
        <p className="text-surface-200 text-sm leading-relaxed">{description}</p>
    </div>
);

const StepCard = ({ number, title, description }) => (
    <div className="flex gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-400 font-bold text-sm">
            {number}
        </div>
        <div>
            <h4 className="font-semibold text-white mb-1">{title}</h4>
            <p className="text-surface-200 text-sm leading-relaxed">{description}</p>
        </div>
    </div>
);

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="overflow-hidden">
            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center px-4 py-24">
                {/* Background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-700/8 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-sm font-medium mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                        AI-Assisted Skin Analysis · Demo Mode
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
                        Understand Your{' '}
                        <span className="gradient-text">Skin.</span>
                        <br />Earlier.
                    </h1>

                    <p className="text-xl text-surface-200 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        AI-assisted preliminary assessment of visible skin conditions — helping you understand possible concerns
                        and decide what to do next.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <Link
                            to={user ? '/analysis/new' : '/register'}
                            className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-primary-500/25 hover:shadow-primary-400/35 hover:-translate-y-0.5 text-base"
                        >
                            <ScanLine className="w-5 h-5" />
                            Analyze Your Skin
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/how-it-works"
                            className="flex items-center gap-2 px-8 py-4 bg-surface-800/60 hover:bg-surface-800 text-white font-semibold rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/20 text-base"
                        >
                            How It Works
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-surface-200 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        ⚕️ AI-assisted information, not a medical diagnosis.{' '}
                        <Link to="/disclaimer" className="text-primary-400 hover:underline">Learn more</Link>
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        {[
                            { icon: Users, value: 'Preliminary', label: 'Assessment Only' },
                            { icon: Shield, value: 'Privacy', label: 'Focused Design' },
                            { icon: Activity, value: 'AI-Powered', label: 'Analysis' },
                        ].map(({ icon: Icon, value, label }) => (
                            <div key={label} className="text-center">
                                <Icon className="w-5 h-5 text-primary-400 mx-auto mb-1" />
                                <div className="text-white font-bold text-sm">{value}</div>
                                <div className="text-surface-200 text-xs">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why early awareness */}
            <section className="py-24 px-4 bg-surface-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4 block">Early Awareness</span>
                            <h2 className="text-4xl font-bold text-white mb-6">Why Early Awareness Matters</h2>
                            <p className="text-surface-200 leading-relaxed mb-6">
                                Skin conditions are among the most common health concerns globally. Many conditions — if identified
                                early — can be managed more effectively with appropriate professional care.
                            </p>
                            <p className="text-surface-200 leading-relaxed mb-6">
                                SKINOVA helps you take the first step: understanding what you might be looking at, so you can
                                make informed decisions about seeking professional evaluation.
                            </p>
                            <Link to={user ? '/analysis/new' : '/register'} className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors">
                                Start your assessment <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Upload, title: 'Upload Photo', desc: 'Clear, well-lit image of the affected area' },
                                { icon: FileText, title: 'Describe Symptoms', desc: 'Quick symptom questionnaire for context' },
                                { icon: Zap, title: 'AI Analysis', desc: 'Preliminary assessment in seconds' },
                                { icon: MapPin, title: 'Find Care', desc: 'Locate nearby dermatologists' },
                            ].map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="glass-card p-5 hover:border-primary-500/30 transition-all duration-300">
                                    <Icon className="w-6 h-6 text-primary-400 mb-3" />
                                    <h4 className="font-semibold text-white mb-1 text-sm">{title}</h4>
                                    <p className="text-surface-200 text-xs leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4 block">Process</span>
                    <h2 className="text-4xl font-bold text-white mb-4">How SKINOVA Works</h2>
                    <p className="text-surface-200">Simple, fast, and straightforward — three steps to awareness.</p>
                </div>
                <div className="max-w-2xl mx-auto space-y-8">
                    {[
                        {
                            number: '01',
                            title: 'Upload or Capture Image',
                            description: 'Take a clear photo of the affected skin area or upload an existing image from your device.',
                        },
                        {
                            number: '02',
                            title: 'Answer Symptom Questions',
                            description: 'Complete a brief, structured questionnaire about duration, symptoms, and skin changes.',
                        },
                        {
                            number: '03',
                            title: 'Review AI Assessment',
                            description: 'Receive a preliminary analysis with possible conditions, observations, and recommended next steps.',
                        },
                    ].map((step) => (
                        <StepCard key={step.number} {...step} />
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-4 bg-surface-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4 block">Features</span>
                        <h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
                        <p className="text-surface-200 max-w-xl mx-auto">Built for clarity, privacy, and responsible AI-assisted health awareness.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={ScanLine}
                            title="AI-Assisted Analysis"
                            description="Preliminary skin condition assessment using AI image analysis and symptom data."
                        />
                        <FeatureCard
                            icon={FileText}
                            title="Symptom Questionnaire"
                            description="Structured symptom collection to provide better context for the AI assessment."
                        />
                        <FeatureCard
                            icon={MapPin}
                            title="Find Nearby Dermatologists"
                            description="Locate qualified dermatologists and healthcare facilities using your location."
                        />
                        <FeatureCard
                            icon={Activity}
                            title="Analysis History"
                            description="Review and track your previous skin analyses over time in one secure place."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Privacy-Focused"
                            description="Your health data is private. Images and analyses are linked only to your account."
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Responsible AI"
                            description="Clear disclaimers, confidence indicators, and responsible language throughout."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="glass-card p-12 border border-primary-500/20 shadow-2xl shadow-primary-500/5">
                        <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
                        <p className="text-surface-200 mb-8 leading-relaxed">
                            Create a free account and start your first AI-assisted skin assessment in under 3 minutes.
                        </p>
                        <Link
                            to={user ? '/analysis/new' : '/register'}
                            className="inline-flex items-center gap-2 px-10 py-4 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-primary-500/20 hover:-translate-y-0.5 text-base"
                        >
                            <ScanLine className="w-5 h-5" />
                            {user ? 'Start New Analysis' : 'Create Free Account'}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <p className="text-xs text-surface-200 mt-6">
                            ⚕️ For informational purposes only — not a substitute for professional medical advice.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
