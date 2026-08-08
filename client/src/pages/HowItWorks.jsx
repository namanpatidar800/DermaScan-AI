import { Link } from 'react-router-dom';
import { Upload, FileText, Zap, MapPin, CheckCircle, ArrowRight, ScanLine } from 'lucide-react';

const HowItWorks = () => (
    <div className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4 block">The Process</span>
                <h1 className="text-4xl font-bold text-white mb-4">How DermaScan AI Works</h1>
                <p className="text-surface-200 max-w-xl mx-auto">
                    A simple, step-by-step process from photo to preliminary assessment.
                </p>
            </div>

            <div className="space-y-6 mb-16">
                {[
                    {
                        step: '01',
                        icon: Upload,
                        title: 'Upload or Capture Your Image',
                        description: 'Take a clear, well-lit photo of the affected skin area or upload an existing image. Supported formats: JPG, PNG, WebP (max 10MB).',
                        tips: ['Use natural lighting', 'Focus closely on the affected area', 'Don\'t include sensitive personal information'],
                    },
                    {
                        step: '02',
                        icon: FileText,
                        title: 'Complete the Symptom Questionnaire',
                        description: 'Answer a brief set of structured questions about your symptoms, duration, and skin changes. This gives the AI important context.',
                        tips: ['Answer as accurately as possible', 'You can skip questions you\'re unsure about', 'More context → better preliminary assessment'],
                    },
                    {
                        step: '03',
                        icon: Zap,
                        title: 'AI Analyzes Your Submission',
                        description: 'The AI processes your image and symptom data to generate a preliminary assessment. This takes just seconds.',
                        tips: ['AI uses visual features and symptom data', 'Multiple possible conditions are ranked by estimated likelihood', 'Results are preliminary only'],
                    },
                    {
                        step: '04',
                        icon: ScanLine,
                        title: 'Review Your Assessment',
                        description: 'See possible conditions, confidence indicators, observations, and recommended next steps — all clearly labelled as preliminary.',
                        tips: ['Read all recommendations carefully', 'Note any red-flag warnings', 'Save your analysis for future reference'],
                    },
                    {
                        step: '05',
                        icon: MapPin,
                        title: 'Find Professional Care',
                        description: 'Use the built-in map to find nearby dermatologists or healthcare facilities when professional evaluation is recommended.',
                        tips: ['View facility details and specialties', 'Get directions', 'Always consult a professional for diagnosis'],
                    },
                ].map(({ step, icon: Icon, title, description, tips }) => (
                    <div key={step} className="glass-card p-8 border border-white/8 hover:border-primary-500/30 transition-all">
                        <div className="flex gap-6">
                            <div className="shrink-0">
                                <div className="w-14 h-14 rounded-2xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center">
                                    <Icon className="w-7 h-7 text-primary-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-bold text-primary-500 bg-primary-500/10 border border-primary-500/20 px-2.5 py-1 rounded-full">Step {step}</span>
                                    <h3 className="font-semibold text-white">{title}</h3>
                                </div>
                                <p className="text-surface-200 text-sm leading-relaxed mb-4">{description}</p>
                                <ul className="space-y-1.5">
                                    {tips.map((tip) => (
                                        <li key={tip} className="flex items-center gap-2 text-xs text-surface-200">
                                            <CheckCircle className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 border border-yellow-500/20 bg-yellow-500/5 text-center">
                <h3 className="font-semibold text-yellow-300 mb-2">Important Reminder</h3>
                <p className="text-yellow-200/80 text-sm leading-relaxed mb-6">
                    DermaScan AI is <strong>not a medical diagnostic tool</strong>. It provides preliminary information
                    to help you decide whether to seek professional care. Always consult a qualified dermatologist or
                    healthcare professional for proper diagnosis and treatment.
                </p>
                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/20"
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    </div>
);

export default HowItWorks;
