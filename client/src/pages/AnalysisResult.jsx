import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysisById } from '../services/analysisService.js';
import Loader from '../components/Loader.jsx';
import html2pdf from 'html2pdf.js';
import {
    AlertTriangle, CheckCircle, ChevronLeft, MapPin,
    Eye, Zap, Info, Download, ShieldAlert,
    ShieldCheck, Target, Activity, Share2, CornerRightDown
} from 'lucide-react';

const attentionConfig = {
    LOW: { label: 'Low Clinical Attention', color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: 'bg-green-500' },
    MODERATE: { label: 'Moderate Attention', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: 'bg-yellow-500' },
    HIGH: { label: 'High Attention Required', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: 'bg-red-500' },
};

const confidenceConfig = {
    HIGH: { label: 'High Confidence', description: 'Strong visual match to known data', textColor: 'text-secondary-700', bg: 'bg-secondary-50' },
    MODERATE: { label: 'Moderate Confidence', description: 'Partial visual match, clinical confirmation needed', textColor: 'text-yellow-700', bg: 'bg-yellow-50' },
    LOW: { label: 'Low Confidence', description: 'Atypical presentation, highly uncertain', textColor: 'text-surface-700', bg: 'bg-surface-100' },
    UNABLE_TO_ASSESS: { label: 'Unable to Assess', description: 'Quality too poor', textColor: 'text-red-700', bg: 'bg-red-50' }
};

const ConfidenceBar = ({ value }) => {
    const pct = Math.round(value * 100);
    const color = pct >= 70 ? 'bg-secondary-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-surface-400';
    return (
        <div className="flex items-center gap-3">
            <div className="h-2 flex-grow bg-surface-200 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-bold text-surface-700 w-8">{pct}%</span>
        </div>
    );
};

const AnalysisResult = () => {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const reportRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAnalysisById(id);
                setAnalysis(data.analysis);
            } catch {
                setError('Could not load this analysis. It may have been deleted or the link is invalid.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;
        setGeneratingPdf(true);
        try {
            const opt = {
                margin: 0.2,
                filename: `SKINOVA-Report-${id.slice(-6).toUpperCase()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            await html2pdf().set(opt).from(reportRef.current).save();
        } catch (err) {
            console.error("PDF Gen error:", err);
        } finally {
            setGeneratingPdf(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'SKINOVA Anonymous Report',
                    text: `View my SKINOVA Skin Health Report. Case ID: SK-${id.slice(-6).toUpperCase()}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share canceled.');
            }
        } else {
            alert('Sharing is not supported on this browser.');
        }
    };

    if (loading) return <div className="flex justify-center py-24"><Loader size="xl" text="Analyzing context..." /></div>;
    if (error) return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
            <ShieldAlert className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <p className="text-surface-700 font-medium">{error}</p>
            <Link to="/history" className="text-secondary-600 hover:underline mt-4 inline-block font-medium">← Back to Tracker</Link>
        </div>
    );

    const { aiResult, imageUrl, symptoms, createdAt } = analysis || {};
    const conditions = aiResult?.multiplePossibilities || [];
    const redFlags = aiResult?.redFlags || [];
    const confTier = aiResult?.confidenceTier || 'LOW';
    const attention = aiResult?.attentionLevel || 'MODERATE';

    // Configs
    const attConfig = attentionConfig[attention] || attentionConfig.MODERATE;
    const confObj = confidenceConfig[confTier] || confidenceConfig.LOW;

    // States
    const isUnableToAssess = confTier === 'UNABLE_TO_ASSESS' || (conditions.length > 0 && conditions[0].name.toLowerCase().includes('unable to assess'));
    const caseId = `SK-${id.slice(-6).toUpperCase()}`;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Nav Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Link to="/history" className="flex items-center gap-1.5 text-surface-600 hover:text-surface-900 font-medium text-sm transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to Tracker
                </Link>
                <div className="flex items-center gap-2">
                    <button onClick={handleShare} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white hover:bg-surface-50 border border-surface-200 text-surface-700 text-sm font-semibold rounded-lg transition-colors shadow-sm">
                        <Share2 className="w-4 h-4" /> Doctor Handoff
                    </button>
                    <button onClick={handleDownloadPDF} disabled={generatingPdf} className="flex items-center gap-2 px-4 py-2 bg-surface-100 hover:bg-surface-200 border border-surface-300 text-surface-800 text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50">
                        {generatingPdf ? <Loader size="sm" /> : <Download className="w-4 h-4" />} Download PDF
                    </button>
                </div>
            </div>

            {/* Core PDF Area */}
            <div ref={reportRef} className="bg-white rounded-2xl shadow-xl border border-surface-200 overflow-hidden font-sans">

                {/* Header */}
                <div className="bg-skinova-dark p-6 md:p-8 flex justify-between items-center text-white border-b-4 border-skinova-coral">
                    <div className="flex gap-4 items-center">
                        <img src="/skinova-logo1.png" crossOrigin="anonymous" alt="SKINOVA Logo" className="h-14 w-auto rounded-xl object-contain mix-blend-screen bg-skinova-white p-1" />
                        <div>
                            <div className="text-2xl font-light tracking-[0.1em] leading-none mb-1">
                                <span className="text-white font-semibold">SKIN</span>
                                <span className="text-skinova-coral font-semibold">OVA</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight">Skin Health Assessment</h1>
                            <p className="text-skinova-olive text-xs mt-0.5 max-w-sm">AI-assisted screening based on visual mapping and patient context.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold font-mono tracking-wider text-white">{caseId}</div>
                        <p className="text-skinova-olive text-xs font-mono uppercase mt-1">{new Date(createdAt).toLocaleDateString()} • Anonymous</p>
                    </div>
                </div>

                {/* Visible Safety Layer */}
                <div className="border-b border-skinova-olive/20 bg-skinova-bg p-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center max-w-3xl mx-auto text-xs font-medium text-surface-600 uppercase tracking-wide">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary-500" /> Image Quality Evaluated</span>
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary-500" /> Uncertainty Bounds Applied</span>
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary-500" /> Multimodal Context Validated</span>
                    </div>
                </div>

                <div className="p-6 md:p-8">

                    {/* Error State */}
                    {isUnableToAssess ? (
                        <div className="mb-8 rounded-xl bg-red-50 border border-red-200 p-6 text-center">
                            <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
                            <h3 className="font-bold text-red-900 text-lg mb-2">Insufficient Information (Unable to Assess)</h3>
                            <p className="text-red-700 text-sm max-w-lg mx-auto">
                                SKINOVA's safety layer has blocked this analysis due to severe uncertainty. The image might be blurry, too dark, or out of frame. Please submit a clearer image.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Confidence != Risk Separation */}
                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                <div className={`p-4 rounded-xl border ${confObj.bg} border-surface-200 flex items-start gap-3`}>
                                    <Target className={`w-6 h-6 ${confObj.textColor} mt-0.5`} />
                                    <div>
                                        <h4 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">AI Statistical Confidence</h4>
                                        <p className={`font-bold ${confObj.textColor} mb-0.5`}>{confObj.label}</p>
                                        <p className="text-xs text-surface-600 leading-relaxed">{confObj.description}</p>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-xl border ${attConfig.bg} flex items-start gap-3`}>
                                    <Activity className={`w-6 h-6 ${attConfig.color} mt-0.5`} />
                                    <div>
                                        <h4 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">Attention Level</h4>
                                        <p className={`font-bold ${attConfig.color} mb-0.5`}>{attConfig.label}</p>
                                        <p className="text-xs text-surface-600 leading-relaxed">
                                            {attention === 'HIGH' ? 'Markers suggest urgent clinical review is needed.' : attention === 'MODERATE' ? 'Symptoms may require evaluation if they persist.' : 'Risk indicators appear low, but monitor routinely.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Red Flag Radar */}
                            {redFlags.length > 0 && (
                                <div className="mb-8 rounded-xl bg-orange-50 border border-orange-200 overflow-hidden">
                                    <div className="bg-orange-100 px-5 py-3 border-b border-orange-200 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                                        <h3 className="font-bold text-orange-900 text-sm uppercase tracking-widest">Red Flag Radar</h3>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-orange-800 text-sm mb-3 font-medium">The following concerning markers were detected and strongly warrant professional evaluation:</p>
                                        <ul className="grid sm:grid-cols-2 gap-2">
                                            {redFlags.map((flag, i) => (
                                                <li key={i} className="text-sm font-medium text-orange-900 flex items-start gap-2 bg-white/50 px-3 py-2 rounded-lg border border-orange-100">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" /> {flag}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Two-Column Context & Explanations */}
                            <div className="grid lg:grid-cols-2 gap-8 mb-8">

                                {/* Left: Source & Symptoms */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-surface-900 border-b border-surface-200 pb-2">Analysis Context</h3>
                                    <div className="flex gap-4">
                                        <div className="w-32 h-32 rounded-xl bg-surface-100 border border-surface-200 overflow-hidden flex-shrink-0 relative">
                                            <img src={imageUrl} crossOrigin="anonymous" alt="Skin target" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 border border-white/20 rounded-xl" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {symptoms?.location && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-surface-100 text-surface-700">Loc: {symptoms.location}</span>}
                                                {symptoms?.duration && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-surface-100 text-surface-700">Time: {symptoms.duration}</span>}
                                                {symptoms?.itching && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700">Itchy</span>}
                                                {symptoms?.pain && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700">Painful</span>}
                                            </div>
                                            {aiResult?.observations?.length > 0 && (
                                                <div className="text-xs text-surface-600 bg-surface-50 p-2.5 rounded-lg border border-surface-200">
                                                    <strong className="block text-surface-800 mb-1">Visual Map:</strong>
                                                    <ul className="space-y-1">
                                                        {aiResult.observations.slice(0, 3).map((o, i) => <li key={i}>• {o}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Why This & Why Uncertain */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-surface-900 border-b border-surface-200 pb-2">Explainability Engine</h3>
                                    <div className="bg-surface-50 p-4 rounded-xl border border-surface-200">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-1">Why This Possibility?</h4>
                                        <p className="text-sm text-surface-800 leading-relaxed">{aiResult?.whyThis || 'Visual and symptomatic indicators generated neural matches for the below possibilities.'}</p>
                                    </div>
                                    <div className="bg-surface-50 p-4 rounded-xl border border-surface-200">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-1">Why Not Certain?</h4>
                                        <p className="text-sm text-surface-700 leading-relaxed">{aiResult?.whyUncertain || 'AI cannot replace clinical diagnosis or account for unseen variables.'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Multiple Possibilities Frame */}
                            <div className="mb-0">
                                <h3 className="text-sm font-bold text-surface-900 border-b border-surface-200 pb-2 mb-4">Possible Conditions</h3>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {conditions.slice(0, 3).map((cond, i) => (
                                        <div key={i} className={`p-4 rounded-xl border bg-white flex flex-col ${i === 0 ? 'border-primary-300 ring-4 ring-primary-50' : 'border-surface-200'}`}>
                                            {i === 0 && <span className="self-start text-[10px] font-bold uppercase bg-primary-100 text-primary-800 px-2 rounded mb-2 w-auto inline-block">Primary Match</span>}
                                            <h4 className="font-bold text-surface-900 text-sm mb-2">{cond.name}</h4>
                                            <ConfidenceBar value={cond.confidence} />
                                            <p className="text-xs text-surface-500 mt-3 pt-3 border-t border-surface-100 flex-1">{cond.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step-by-Step Care Pathway Footer */}
                    <div className="mt-8 bg-surface-900 text-white p-6 rounded-xl border border-surface-800">
                        <h3 className="flex items-center gap-2 font-bold mb-4"><CornerRightDown className="w-5 h-5 text-primary-400" /> Your Recommended Care Pathway</h3>
                        <div className="grid sm:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="block text-primary-400 font-bold mb-1">Step 1</span>
                                <p className="text-surface-300 text-xs">Review this preliminary assessment.</p>
                            </div>
                            <div>
                                <span className="block text-primary-400 font-bold mb-1">Step 2</span>
                                <p className="text-surface-300 text-xs">Monitor symptoms closely for rapid changes.</p>
                            </div>
                            <div>
                                <span className="block text-primary-400 font-bold mb-1">Step 3</span>
                                <p className="text-surface-300 text-xs">{aiResult?.recommendation || 'Seek professional consultation if concerned.'}</p>
                            </div>
                            <div>
                                <span className="block text-primary-400 font-bold mb-1">Step 4</span>
                                <p className="text-surface-300 text-xs">Use Doctor Handoff mode to share this Case ID with your physician.</p>
                            </div>
                        </div>
                    </div>

                    {/* Medical Disclaimer inside PDF */}
                    <div className="mt-6 border-t border-surface-200 pt-6">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-surface-400 shrink-0" />
                            <div>
                                <h4 className="text-xs font-bold text-surface-800 mb-1">Crucial Medical Notice</h4>
                                <p className="text-[10px] text-surface-500 leading-relaxed">
                                    SKINOVA is an educational AI tool. This report is <strong>NOT a medical diagnosis</strong>. AI output can be incorrect. By using this service, you acknowledge that you must seek a board-certified dermatologist for definitive diagnosis and treatment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* External Links */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/find-dermatologist" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-colors">
                    Find Nearby Care
                </Link>
                <Link to="/skin-conditions" className="bg-white hover:bg-surface-50 text-surface-800 border border-surface-200 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors">
                    Learn about Conditions
                </Link>
            </div>
        </div>
    );
};

export default AnalysisResult;
