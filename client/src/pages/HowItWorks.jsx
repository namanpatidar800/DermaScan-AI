import { Link } from 'react-router-dom';
import { Upload, FileText, Zap, MapPin, CheckCircle, ArrowRight, ScanLine } from 'lucide-react';

const HowItWorks = () => (
    <div className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <span className="text-skinova-coral text-xs font-bold uppercase tracking-[0.2em] mb-4 block">The Process</span>
                <h1 className="text-3xl md:text-4xl font-light text-skinova-dark tracking-tight mb-4">How SKINOVA Works</h1>
                <p className="text-skinova-olive max-w-xl mx-auto text-sm leading-relaxed">
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
                    <div key={step} className="bg-skinova-white p-6 md:p-8 rounded-3xl border border-skinova-olive/10 hover:border-skinova-olive/30 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="shrink-0">
                                <div className="w-14 h-14 rounded-2xl bg-skinova-bg border border-skinova-olive/20 flex items-center justify-center shadow-sm">
                                    <Icon className="w-6 h-6 text-skinova-dark" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] font-bold text-skinova-coral bg-skinova-bg border border-skinova-olive/20 px-3 py-1 rounded-full uppercase tracking-wider">Step {step}</span>
                                    <h3 className="font-semibold text-skinova-dark text-lg">{title}</h3>
                                </div>
                                <p className="text-skinova-olive text-sm leading-relaxed mb-4">{description}</p>
                                <ul className="space-y-2">
                                    {tips.map((tip) => (
                                        <li key={tip} className="flex items-center gap-2 text-xs md:text-sm text-skinova-olive font-medium">
                                            <CheckCircle className="w-4 h-4 text-skinova-coral shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-orange-50 rounded-3xl p-8 border border-orange-200 text-center shadow-sm">
                <h3 className="font-semibold text-orange-900 mb-2">Important Reminder</h3>
                <p className="text-orange-800 text-sm leading-relaxed mb-8 max-w-2xl mx-auto">
                    SKINOVA is <strong>not a medical diagnostic tool</strong>. It provides preliminary information
                    to help you decide whether to seek professional care. Always consult a qualified dermatologist or
                    healthcare professional for proper diagnosis and treatment.
                </p>
                <Link
                    to="/analysis/new"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-skinova-dark hover:bg-skinova-olive text-white text-sm font-semibold rounded-xl transition-all shadow-md uppercase tracking-wide"
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    </div>
);

export default HowItWorks;
