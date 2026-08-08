import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnalysisById } from '../services/analysisService.js';
import Loader from '../components/Loader.jsx';
import Disclaimer from '../components/Disclaimer.jsx';
import {
    AlertTriangle, CheckCircle, ArrowRight, ChevronLeft, MapPin,
    Activity, Eye, Zap, Info
} from 'lucide-react';

const severityConfig = {
    low: { label: 'Low Attention', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', dot: 'bg-green-400' },
    moderate: { label: 'Moderate Attention', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', dot: 'bg-yellow-400' },
    high: { label: 'High Attention', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20', dot: 'bg-orange-400' },
    urgent: { label: 'Seek Urgent Care', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', dot: 'bg-red-400' },
};

const ConfidenceBar = ({ value, label }) => {
    const pct = Math.round(value * 100);
    const color = pct >= 70 ? 'bg-primary-500' : pct >= 40 ? 'bg-yellow-400' : 'bg-surface-500';
    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-surface-200 font-medium">{label}</span>
                <span className="text-xs text-surface-200">{pct}%</span>
            </div>
            <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

const AnalysisResult = () => {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAnalysisById(id);
                setAnalysis(data.analysis);
            } catch {
                setError('Could not load this analysis. It may have been deleted.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <div className="flex justify-center py-24"><Loader size="xl" text="Loading your results..." /></div>;
    if (error) return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-surface-200">{error}</p>
            <Link to="/history" className="text-primary-400 hover:underline mt-4 inline-block">← Back to History</Link>
        </div>
    );

    const { aiResult, imageUrl, symptoms, createdAt } = analysis || {};
    const conditions = aiResult?.possibleConditions || [];
    const redFlags = aiResult?.redFlags || [];
    const severity = aiResult?.severity || 'low';
    const sevConfig = severityConfig[severity] || severityConfig.low;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            {/* Nav */}
            <div className="mb-6">
                <Link to="/history" className="flex items-center gap-1.5 text-surface-200 hover:text-white text-sm transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to History
                </Link>
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">Your AI-Assisted Assessment</h1>
            <p className="text-surface-200 text-sm mb-2">This result is informational and should not be treated as a medical diagnosis.</p>
            <p className="text-surface-200 text-xs mb-8">{new Date(createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <div className="space-y-5">
                {/* Red flags — shown first if present */}
                {redFlags.length > 0 && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-5">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-300 mb-2">⚠️ Red Flag Indicators Detected</h3>
                                <p className="text-red-200/80 text-sm mb-3">
                                    One or more concerning indicators were noted. Please consult a healthcare professional promptly.
                                </p>
                                <ul className="space-y-1">
                                    {redFlags.map((flag, i) => (
                                        <li key={i} className="text-xs text-red-300 flex items-start gap-1.5">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                            {flag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Medical Disclaimer (always on result) */}
                <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
                    <p className="text-xs text-yellow-200/90 leading-relaxed">
                        <strong className="text-yellow-300">Important:</strong> DermaScan AI provides an AI-assisted preliminary assessment and is{' '}
                        <strong>not a medical diagnosis</strong>. Consult a qualified healthcare professional for diagnosis and treatment.
                    </p>
                </div>

                {/* Image + Severity row */}
                <div className="grid sm:grid-cols-2 gap-5">
                    <div className="glass-card p-5 border border-white/8">
                        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-surface-200">
                            <Eye className="w-4 h-4 text-primary-400" /> Submitted Image
                        </div>
                        <div className="rounded-xl overflow-hidden bg-surface-800 aspect-square">
                            <img src={imageUrl} alt="Analyzed skin" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="glass-card p-5 border border-white/8 flex flex-col gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-surface-200">
                                <Activity className="w-4 h-4 text-primary-400" /> Severity Level
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${sevConfig.bg}`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${sevConfig.dot}`} />
                                <span className={`font-semibold text-sm ${sevConfig.color}`}>{sevConfig.label}</span>
                            </div>
                        </div>
                        {symptoms && (
                            <div>
                                <p className="text-xs text-surface-200 mb-2">Reported symptoms:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {symptoms.location && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700/60 text-surface-200">{symptoms.location}</span>}
                                    {symptoms.itching && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700/60 text-surface-200">Itching</span>}
                                    {symptoms.pain && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700/60 text-surface-200">Pain</span>}
                                    {symptoms.redness && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700/60 text-surface-200">Redness</span>}
                                    {symptoms.spreading && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700/60 text-surface-200">Spreading</span>}
                                    {symptoms.scaling && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700/60 text-surface-200">Scaling</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Observations */}
                {aiResult?.observations?.length > 0 && (
                    <div className="glass-card p-6 border border-white/8">
                        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-white">
                            <Zap className="w-4 h-4 text-primary-400" /> AI Observations
                        </div>
                        <ul className="space-y-2">
                            {aiResult.observations.map((obs, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-surface-200">
                                    <CheckCircle className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" /> {obs}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Possible Conditions */}
                <div className="glass-card p-6 border border-white/8">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-white">
                        <Info className="w-4 h-4 text-primary-400" /> Possible Conditions
                    </div>
                    <p className="text-xs text-surface-200 mb-5">
                        AI-estimated confidence levels — not diagnostic certainty. Conditions are listed in order of estimated likelihood.
                    </p>
                    <div className="space-y-5">
                        {conditions.map((cond, i) => (
                            <div key={i} className={`p-5 rounded-xl border ${i === 0 ? 'border-primary-500/30 bg-primary-500/5' : 'border-white/8 bg-surface-800/30'}`}>
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {i === 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 font-medium">Most Likely</span>}
                                            <h4 className="font-semibold text-white text-sm">{cond.name}</h4>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold text-primary-400 shrink-0">{Math.round(cond.confidence * 100)}%</span>
                                </div>
                                <ConfidenceBar value={cond.confidence} label="Estimated confidence" />
                                {cond.description && (
                                    <p className="text-xs text-surface-200 leading-relaxed mt-3">{cond.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-yellow-300/80 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            AI-estimated confidence, not diagnostic certainty. Requires professional confirmation.
                        </p>
                    </div>
                </div>

                {/* Recommendation */}
                {aiResult?.recommendation && (
                    <div className="glass-card p-6 border border-primary-500/20 bg-primary-500/5">
                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-primary-400" /> Recommended Next Steps
                        </h3>
                        <p className="text-surface-200 text-sm leading-relaxed">{aiResult.recommendation}</p>
                    </div>
                )}

                {/* Find Dermatologist */}
                <div className="glass-card p-6 border border-white/8 text-center">
                    <MapPin className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Ready for Professional Evaluation?</h3>
                    <p className="text-surface-200 text-sm mb-4">Use our map to find qualified dermatologists and healthcare facilities near you.</p>
                    <Link
                        to="/find-dermatologist"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20"
                    >
                        <MapPin className="w-4 h-4" /> Find Nearby Dermatologist
                    </Link>
                </div>

                <Disclaimer />
            </div>
        </div>
    );
};

export default AnalysisResult;
