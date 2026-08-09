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
            <h2 className="text-xl font-bold text-surface-900 mb-1">Review Your Assessment</h2>
            <p className="text-surface-600 text-sm">Please verify your information before submitting.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-surface-900 uppercase tracking-wider">Image</h3>
                    <button onClick={onEditImage} className="text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 text-xs font-medium bg-primary-50 px-2 py-1 rounded">
                        <Edit3 className="w-3 h-3" /> Edit
                    </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-surface-200 bg-surface-50 shadow-sm">
                    <img src={imageData?.imageUrl} alt="Uploaded Skin Condition" className="w-full aspect-square object-cover" />
                </div>
            </div>

            <div className="md:w-2/3 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-surface-900 uppercase tracking-wider">Symptoms & History</h3>
                    <button onClick={onEditSymptoms} className="text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 text-xs font-medium bg-primary-50 px-2 py-1 rounded">
                        <Edit3 className="w-3 h-3" /> Edit
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 bg-surface-50 p-5 rounded-xl border border-surface-200 text-sm shadow-sm">
                    <div>
                        <span className="block text-surface-500 font-bold text-[10px] uppercase tracking-wider mb-1">Location</span>
                        <span className="text-surface-900 font-medium">{symptoms?.location || 'Not specified'}</span>
                    </div>
                    <div>
                        <span className="block text-surface-500 font-bold text-[10px] uppercase tracking-wider mb-1">Duration</span>
                        <span className="text-surface-900 font-medium">{symptoms?.duration || 'Not specified'}</span>
                    </div>

                    <div className="col-span-2">
                        <span className="block text-surface-500 font-bold text-[10px] uppercase tracking-wider mb-1.5">Symptoms Present</span>
                        <div className="flex flex-wrap gap-1.5">
                            {['itching', 'pain', 'swelling', 'redness', 'spreading', 'scaling', 'discharge', 'recentChange']
                                .filter(s => symptoms[s])
                                .map(s => (
                                    <span key={s} className="px-2.5 py-1 bg-white rounded-md border border-surface-200 text-primary-700 font-medium text-xs capitalize shadow-sm">
                                        {s.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                ))}
                            {!Object.keys(symptoms).some(k => ['itching', 'pain', 'swelling', 'redness', 'spreading', 'scaling', 'discharge', 'recentChange'].includes(k) && symptoms[k]) && (
                                <span className="text-surface-500 text-sm italic">None selected</span>
                            )}
                        </div>
                    </div>

                    <div className="col-span-2 border-t border-surface-200 pt-4">
                        <span className="block text-surface-500 font-bold text-[10px] uppercase tracking-wider mb-1">Additional Notes</span>
                        <p className="text-surface-800 text-sm leading-relaxed bg-white p-3 rounded border border-surface-200 shadow-sm">{symptoms?.notes || 'No additional notes provided.'}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
            <p className="text-xs text-yellow-800 leading-relaxed">
                <strong className="text-yellow-900 font-bold block mb-1">Important:</strong>
                Your image and symptom information will be used for an AI-assisted preliminary assessment. This is not a medical diagnosis.
            </p>
        </div>

        <div className="flex gap-3">
            <button onClick={onEditSymptoms} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-surface-300 text-surface-700 hover:text-surface-900 hover:bg-surface-50 transition-all text-sm font-semibold">
                <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
                onClick={onSubmit}
                className="flex-1 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-secondary-500/20"
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
            <div className="w-24 h-24 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <ScanLine className="w-8 h-8 text-primary-500 animate-pulse" />
            </div>
        </div>
        <div className="text-center">
            <h2 className="text-xl font-bold text-surface-900 mb-2">Preparing your analysis...</h2>
            <p className="text-surface-600 text-sm max-w-xs">
                Our AI is processing your image and symptom data.
            </p>
        </div>
        <div className="space-y-3 p-5 bg-surface-50 border border-surface-200 rounded-xl text-sm w-full max-w-xs shadow-sm">
            {[
                { label: 'Image uploaded securely', done: true },
                { label: 'Checking image quality parameters', done: true },
                { label: 'Processing symptom information', done: true },
                { label: 'Running multimodal AI analysis...', done: false },
            ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2">
                    {done
                        ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        : <Loader2 className="w-4 h-4 text-primary-500 animate-spin shrink-0" />
                    }
                    <span className={done ? 'text-surface-900 font-medium' : 'text-primary-700 font-medium animate-pulse'}>{label}</span>
                </div>
            ))}
        </div>
        <p className="text-xs text-surface-400 font-mono text-center max-w-xs pt-2">
            Establishing secure connection to AI models...
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

            // Save analysis securely in device LocalStorage to preserve history without auth
            try {
                const stored = localStorage.getItem('skinova_history');
                const history = stored ? JSON.parse(stored) : [];
                history.push(result.analysis);
                localStorage.setItem('skinova_history', JSON.stringify(history));
            } catch (err) {
                console.warn('Could not save to local storage (privacy limits may be active)');
            }

            navigate(`/analysis/result/${result.analysis._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'We couldn\'t complete the analysis. Please try again later.');
            setStep(3);
        }
    };

    const steps = [
        { num: 1, label: 'Upload' },
        { num: 2, label: 'Symptoms' },
        { num: 3, label: 'Review' },
        { num: 4, label: 'Analyzing' },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-surface-900 mb-1">New Skin Analysis</h1>
                <p className="text-surface-600 text-sm">AI-assisted preliminary skin condition assessment.</p>
            </div>

            {/* Steps progress */}
            <div className="flex items-center justify-between gap-1 mb-8 overflow-hidden">
                {steps.map((s, i) => (
                    <div key={s.num} className="flex items-center gap-2 flex-1 relative">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-all shrink-0 z-10 bg-white ${step >= s.num
                            ? 'border-primary-500 text-primary-600 shadow-sm shadow-primary-200'
                            : 'border-surface-300 text-surface-400'
                            }`}>
                            {step > s.num ? <CheckCircle className="w-4 h-4 text-primary-500" /> : s.num}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap hidden sm:block ${step >= s.num ? 'text-surface-900' : 'text-surface-400'}`}>{s.label}</span>
                        {i < steps.length - 1 && <div className={`absolute top-4 left-4 w-[200%] h-0.5 -z-10 ${step > s.num ? 'bg-primary-300' : 'bg-surface-200'}`} />}
                    </div>
                ))}
            </div>

            {/* Card */}
            <div className="bg-white p-6 sm:p-10 border border-surface-200 rounded-2xl shadow-xl shadow-surface-200/50 min-h-[400px]">
                {error && (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium mb-6">
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-500" /> {error}
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
