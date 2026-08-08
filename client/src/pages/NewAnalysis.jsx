import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyze } from '../services/analysisService.js';
import Disclaimer from '../components/Disclaimer.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import SymptomForm from '../components/SymptomForm.jsx';
import { CheckCircle, AlertCircle, ScanLine, Loader2, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';

// ── Step 3: Review Step ───────────────────────────────────────────────────────
const ReviewStep = ({ imageData, symptoms, onEditImage, onEditSymptoms, onSubmit }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-bold text-white mb-1">Review Your Assessment</h2>
            <p className="text-surface-200 text-sm">Please verify your information before submitting.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Image</h3>
                    <button onClick={onEditImage} className="text-primary-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium">
                        <Edit3 className="w-3 h-3" /> Edit
                    </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-surface-800">
                    <img src={imageData?.imageUrl} alt="Uploaded Skin Condition" className="w-full aspect-square object-cover" />
                </div>
            </div>

            <div className="md:w-2/3 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Symptoms & History</h3>
                    <button onClick={onEditSymptoms} className="text-primary-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium">
                        <Edit3 className="w-3 h-3" /> Edit
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 bg-surface-800/40 p-5 rounded-xl border border-white/5 text-sm">
                    <div>
                        <span className="block text-surface-200 text-xs mb-1">Location</span>
                        <span className="text-white font-medium">{symptoms?.location || 'Not specified'}</span>
                    </div>
                    <div>
                        <span className="block text-surface-200 text-xs mb-1">Duration</span>
                        <span className="text-white font-medium">{symptoms?.duration || 'Not specified'}</span>
                    </div>

                    <div className="col-span-2">
                        <span className="block text-surface-200 text-xs mb-1.5">Symptoms Present</span>
                        <div className="flex flex-wrap gap-1.5">
                            {['itching', 'pain', 'swelling', 'redness', 'spreading', 'scaling', 'discharge', 'recentChange']
                                .filter(s => symptoms[s])
                                .map(s => (
                                    <span key={s} className="px-2.5 py-1 bg-surface-900 rounded border border-white/10 text-primary-300 text-xs capitalize">
                                        {s.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                ))}
                            {!Object.keys(symptoms).some(k => ['itching', 'pain', 'swelling', 'redness', 'spreading', 'scaling', 'discharge', 'recentChange'].includes(k) && symptoms[k]) && (
                                <span className="text-surface-200 text-sm">None selected</span>
                            )}
                        </div>
                    </div>

                    <div className="col-span-2 border-t border-white/10 pt-4">
                        <span className="block text-surface-200 text-xs mb-1">Additional Notes</span>
                        <p className="text-white text-sm">{symptoms?.notes || 'No notes provided.'}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-primary-500/10 border border-primary-500/20 p-4 rounded-xl">
            <p className="text-xs text-primary-200 leading-relaxed">
                <strong className="text-primary-400 font-semibold block mb-1">Important:</strong>
                Your image and symptom information will be used for an AI-assisted preliminary assessment. This is not a medical diagnosis.
            </p>
        </div>

        <div className="flex gap-3">
            <button onClick={onEditSymptoms} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-surface-200 hover:text-white hover:border-white/20 transition-all text-sm font-medium">
                <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
                onClick={onSubmit}
                className="flex-1 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
            >
                Submit for Analysis <ScanLine className="w-4 h-4" />
            </button>
        </div>
    </div>
);

// ── Step 4: Processing ────────────────────────────────────────────────────────
const ProcessingStep = () => (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <ScanLine className="w-8 h-8 text-primary-400 animate-pulse" />
            </div>
        </div>
        <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Preparing your analysis...</h2>
            <p className="text-surface-200 text-sm max-w-xs">
                Our AI is processing your image and symptom data.
            </p>
        </div>
        <div className="space-y-2.5 text-sm text-surface-200 w-full max-w-xs">
            {[
                { label: 'Image received', done: true },
                { label: 'Checking image quality', done: true },
                { label: 'Preparing symptom information', done: true },
                { label: 'Starting analysis...', done: false },
            ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2">
                    {done
                        ? <CheckCircle className="w-4 h-4 text-primary-400 shrink-0" />
                        : <Loader2 className="w-4 h-4 text-primary-400 animate-spin shrink-0" />
                    }
                    <span className={done ? 'text-white' : 'text-surface-200'}>{label}</span>
                </div>
            ))}
        </div>
        <p className="text-xs text-surface-200 text-center max-w-xs pt-4">
            Analysis service is being prepared... (Connecting to AI models)
        </p>
    </div>
);

// ── Main NewAnalysis Page ─────────────────────────────────────────────────────
const NewAnalysis = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [imageData, setImageData] = useState(null);
    const [symptoms, setSymptoms] = useState(null);
    const [error, setError] = useState('');

    const handleImageReady = (data) => setImageData(data);

    const handleSymptomsNext = (collectedSymptoms) => {
        setSymptoms(collectedSymptoms);
        setStep(3); // Proceed to Review
    };

    const handleSubmit = async () => {
        setStep(4);
        setError('');
        try {
            const result = await analyze(imageData.imageUrl, imageData.imagePublicId, symptoms);
            navigate(`/analysis/result/${result.analysis._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'We couldn\'t start the analysis. Please try again.');
            setStep(3);
        }
    };

    const steps = [
        { num: 1, label: 'Upload Image' },
        { num: 2, label: 'Symptoms' },
        { num: 3, label: 'Review' },
        { num: 4, label: 'Submit' },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">New Skin Analysis</h1>
                <p className="text-surface-200 text-sm">AI-assisted preliminary skin condition assessment.</p>
            </div>

            {/* Steps progress */}
            <div className="flex items-center justify-between gap-1 mb-10 overflow-hidden">
                {steps.map((s, i) => (
                    <div key={s.num} className="flex items-center gap-2 flex-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-all shrink-0 ${step >= s.num
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'border-white/20 text-surface-200'
                            }`}>
                            {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                        </div>
                        <span className={`text-xs font-medium whitespace-nowrap hidden sm:block ${step >= s.num ? 'text-white' : 'text-surface-200'}`}>{s.label}</span>
                        {i < steps.length - 1 && <div className={`w-full h-px min-w-[20px] ${step > s.num ? 'bg-primary-500' : 'bg-white/10'}`} />}
                    </div>
                ))}
            </div>

            {/* Card */}
            <div className="glass-card p-6 sm:p-10 border border-white/8 min-h-[400px]">
                {error && (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-6">
                        <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                    </div>
                )}
                {step === 1 && <ImageUploader onImageReady={handleImageReady} onNext={() => setStep(2)} />}
                {step === 2 && <SymptomForm onBack={() => setStep(1)} onNext={handleSymptomsNext} />}
                {step === 3 && <ReviewStep imageData={imageData} symptoms={symptoms} onEditImage={() => setStep(1)} onEditSymptoms={() => setStep(2)} onSubmit={handleSubmit} />}
                {step === 4 && <ProcessingStep />}
            </div>

            <div className="mt-8">
                <Disclaimer variant="compact" />
            </div>
        </div>
    );
};

export default NewAnalysis;
