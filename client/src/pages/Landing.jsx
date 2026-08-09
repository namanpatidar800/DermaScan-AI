import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SKIN_CONDITIONS_DATA } from '../data/skinConditionsData.js';
import {
    ScanLine, ArrowRight, BookOpen, MapPin,
    Shield, Activity, Info, X, ShieldAlert, Book
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const [selectedCondition, setSelectedCondition] = useState(null);

    return (
        <div className="overflow-x-hidden bg-skinova-white selection:bg-skinova-coral/30">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 border-b border-skinova-bg">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-skinova-bg border border-skinova-olive/20 text-skinova-dark text-xs font-bold tracking-wide uppercase mb-10 shadow-sm animate-fade-in transition-all">
                        <span className="w-2 h-2 rounded-full bg-skinova-coral animate-pulse" />
                        AI-Assisted Educational Screening
                    </div>

                    <h1 className="text-6xl md:text-8xl font-light text-skinova-dark tracking-[0.1em] mb-4 animate-fade-in-up">
                        <span className="font-semibold">SKIN</span>
                        <span className="font-semibold text-skinova-coral">OVA</span>
                    </h1>

                    <div className="flex gap-2 justify-center items-center text-[10px] md:text-xs font-bold tracking-[0.2em] text-skinova-olive mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <span>DETECT</span>
                        <span className="text-skinova-coral">•</span>
                        <span>ANALYZE</span>
                        <span className="text-skinova-coral">•</span>
                        <span>CARE</span>
                    </div>

                    <p className="text-lg md:text-xl text-skinova-olive max-w-2xl mx-auto mb-12 font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        A premium platform built to help you understand visible skin conditions, track changes, and find professional care when necessary.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <Link
                            to="/analysis/new"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-skinova-dark hover:bg-skinova-olive text-skinova-white font-medium rounded-xl transition-all duration-300 shadow-xl shadow-skinova-dark/10 hover:-translate-y-0.5 text-sm uppercase tracking-wider"
                        >
                            <ScanLine className="w-5 h-5" />
                            Scan Your Skin
                        </Link>
                        <Link
                            to="/ask-skinova"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-skinova-bg hover:bg-skinova-coral/10 text-skinova-dark font-medium rounded-xl transition-all duration-300 border border-skinova-olive/20 text-sm uppercase tracking-wider"
                        >
                            Ask SKINOVA ✨
                        </Link>
                        <Link
                            to="/find-dermatologist"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-skinova-white hover:bg-skinova-bg text-skinova-coral font-medium rounded-xl transition-all duration-300 border border-skinova-coral/30 text-sm uppercase tracking-wider"
                        >
                            Find Care <MapPin className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-20 pt-10 border-t border-skinova-bg animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        {[
                            { icon: Shield, label: 'Secure' },
                            { icon: Activity, label: 'Insightful' },
                            { icon: BookOpen, label: 'Educational' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="text-center group">
                                <Icon className="w-6 h-6 text-skinova-olive mx-auto mb-2 opacity-50 group-hover:text-skinova-coral group-hover:opacity-100 transition-colors" />
                                <div className="text-skinova-dark font-medium text-xs tracking-wide uppercase">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 px-4 bg-skinova-bg">
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <span className="text-skinova-coral text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Process</span>
                    <h2 className="text-3xl font-light text-skinova-dark mb-4 tracking-tight">How SKINOVA Works</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        { num: '01', title: 'Capture Image', desc: 'Securely upload a photo directly or use your camera.' },
                        { num: '02', title: 'AI Analysis', desc: 'Our engine identifies possible visual matches and flags concerns.' },
                        { num: '03', title: 'Find Care', desc: 'Locate nearby dermatology clinics or hospitals instantly.' },
                    ].map((step) => (
                        <div key={step.num} className="bg-skinova-white p-8 rounded-2xl shadow-sm border border-skinova-olive/10 text-left hover:border-skinova-coral-dark/30 transition-colors">
                            <div className="text-3xl font-bold text-skinova-coral mb-4">{step.num}</div>
                            <h4 className="font-semibold text-skinova-dark mb-2 text-lg">{step.title}</h4>
                            <p className="text-skinova-olive text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Understand Your Skin (Disease Catalog) */}
            <section className="py-24 px-4 bg-skinova-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <span className="text-skinova-coral text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Education</span>
                        <h2 className="text-3xl font-light text-skinova-dark mb-4 tracking-tight">Understand Your Skin</h2>
                        <p className="text-skinova-olive max-w-2xl text-sm leading-relaxed">
                            Learn about common skin conditions, their typical signs, general care practices, and when professional evaluation is appropriate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {SKIN_CONDITIONS_DATA.map((condition) => (
                            <button
                                key={condition.id}
                                onClick={() => setSelectedCondition(condition)}
                                className="group text-left bg-skinova-bg rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-skinova-dark/5 transition-all duration-300 flex flex-col h-full border border-transparent hover:border-skinova-olive/20"
                            >
                                <div className="h-48 overflow-hidden bg-skinova-olive/10 relative">
                                    <img
                                        src={condition.image}
                                        alt={condition.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-skinova-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <span className="text-white text-xs font-bold tracking-wide uppercase flex items-center gap-1">
                                            Learn More <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-semibold text-skinova-dark mb-2 text-lg">{condition.name}</h3>
                                    <p className="text-skinova-olive text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
                                        {condition.shortDesc}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Disease Detail Modal */}
            {selectedCondition && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-skinova-dark/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-skinova-white rounded-3xl w-full max-w-4xl max-h-full overflow-hidden shadow-2xl flex flex-col relative border border-skinova-olive/20 animate-fade-in-up">

                        {/* Header Image & Title */}
                        <div className="relative h-48 sm:h-64 shrink-0">
                            <img src={selectedCondition.image} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-skinova-dark to-transparent"></div>
                            <button
                                onClick={() => setSelectedCondition(null)}
                                className="absolute top-4 right-4 bg-skinova-white/20 hover:bg-skinova-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-6 left-6 pr-6">
                                <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">{selectedCondition.name}</h2>
                            </div>
                        </div>

                        {/* Scrolling Content */}
                        <div className="p-6 sm:p-10 overflow-y-auto bg-skinova-white text-skinova-dark flex-1">

                            <div className="grid md:grid-cols-2 gap-10">

                                {/* Left Col */}    
                                <div className="space-y-8">
                                    <section>
                                        <h4 className="text-xs font-bold tracking-widest text-skinova-coral uppercase mb-3 flex items-center gap-2"><Info className="w-4 h-4" /> What is it?</h4>
                                        <p className="text-sm leading-relaxed text-skinova-olive">{selectedCondition.whatIsIt}</p>
                                    </section>
                                    <section>
                                        <h4 className="text-xs font-bold tracking-widest text-skinova-dark uppercase mb-3">Common Signs</h4>
                                        <ul className="space-y-2">
                                            {selectedCondition.commonSigns.map((s, i) => (
                                                <li key={i} className="flex gap-2 text-sm text-skinova-olive">
                                                    <span className="text-skinova-coral/50 font-bold">•</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                    <section>
                                        <h4 className="text-xs font-bold tracking-widest text-skinova-dark uppercase mb-3">Contributing Factors</h4>
                                        <ul className="space-y-2">
                                            {selectedCondition.contributingFactors.map((s, i) => (
                                                <li key={i} className="flex gap-2 text-sm text-skinova-olive">
                                                    <span className="text-skinova-coral/50 font-bold">•</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                </div>

                                {/* Right Col */}
                                <div className="space-y-8">
                                    <section className="bg-skinova-bg p-5 rounded-2xl border border-skinova-olive/10">
                                        <h4 className="text-xs font-bold tracking-widest text-skinova-dark uppercase mb-3">General Care</h4>
                                        <ul className="space-y-2">
                                            {selectedCondition.generalCare.map((s, i) => (
                                                <li key={i} className="flex gap-2 text-sm text-skinova-olive">
                                                    <span className="text-skinova-coral/50 font-bold">•</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <section>
                                        <h4 className="text-xs font-bold tracking-widest text-skinova-coral-dark uppercase mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Precautions</h4>
                                        <ul className="space-y-2">
                                            {selectedCondition.precautions.map((s, i) => (
                                                <li key={i} className="flex gap-2 text-sm text-skinova-olive">
                                                    <span className="text-skinova-coral-dark font-bold">•</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>

                                    <section className="bg-skinova-dark text-white p-5 rounded-2xl">
                                        <h4 className="text-xs font-bold tracking-widest text-skinova-coral uppercase mb-2">When to seek professional care</h4>
                                        <p className="text-sm font-light leading-relaxed">{selectedCondition.whenToSeekCare}</p>
                                    </section>
                                </div>
                            </div>

                            <hr className="my-8 border-skinova-bg" />

                            <p className="text-xs text-skinova-olive text-center max-w-3xl mx-auto mb-8 leading-relaxed italic">
                                {selectedCondition.disclaimer}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/ask-skinova', { state: { initialMsg: `Explain more about ${selectedCondition.name}, its signs, general care, and when to get professional help.` } })}
                                    className="bg-skinova-bg hover:bg-skinova-olive/10 border border-skinova-olive/20 text-skinova-dark px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
                                >
                                    Ask SKINOVA about {selectedCondition.name} ✨
                                </button>
                                <button
                                    onClick={() => navigate('/find-dermatologist')}
                                    className="bg-skinova-coral hover:bg-skinova-coral-dark text-white px-6 py-3 rounded-xl text-sm font-semibold tracking-wide shadow-md transition-colors flex items-center justify-center gap-2"
                                >
                                    Find a Dermatologist <MapPin className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Disclaimer Footer */}
            <section className="py-12 bg-skinova-dark text-skinova-white text-center px-4">
                <div className="max-w-2xl mx-auto">
                    <Book className="w-6 h-6 text-skinova-coral mx-auto mb-4" />
                    <p className="text-xs leading-relaxed text-skinova-olive/80">
                        ⚕️ SKINOVA provides AI-assisted educational information only, not an official medical diagnosis.
                        Do not use this tool to replace the advice of a board-certified dermatologist.
                        If you are experiencing severe symptoms, please seek emergency medical attention.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Landing;
