import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAnalysisById, deleteAnalysis } from '../services/analysisService.js';
import Loader from '../components/Loader.jsx';
import Disclaimer from '../components/Disclaimer.jsx';
import { AlertTriangle, ChevronLeft, Trash2, MapPin, Activity, Info, Zap } from 'lucide-react';

const severityConfig = {
    low: { label: 'Low Attention', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
    moderate: { label: 'Moderate Attention', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
    high: { label: 'High Attention', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
    urgent: { label: 'Seek Urgent Care', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
};

const AnalysisDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAnalysisById(id);
                setAnalysis(data.analysis);
            } catch {
                setError('Analysis not found or you do not have access.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Delete this analysis? This cannot be undone.')) return;
        try {
            await deleteAnalysis(id);
            navigate('/history');
        } catch {
            alert('Failed to delete.');
        }
    };

    if (loading) return <div className="flex justify-center py-24"><Loader size="xl" text="Loading analysis..." /></div>;
    if (error) return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-surface-200">{error}</p>
            <Link to="/history" className="text-primary-400 hover:underline mt-4 inline-block">← Back to History</Link>
        </div>
    );

    const { aiResult, imageUrl, symptoms, createdAt } = analysis;
    const sev = aiResult?.severity || 'low';
    const sevConfig = severityConfig[sev];

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-6">
                <Link to="/history" className="flex items-center gap-1.5 text-surface-200 hover:text-white text-sm transition-colors">
                    <ChevronLeft className="w-4 h-4" /> History
                </Link>
                <div className="flex items-center gap-2">
                    <Link to={`/analysis/result/${id}`} className="text-xs px-3 py-1.5 rounded-xl border border-primary-500/40 text-primary-400 hover:bg-primary-500/10 transition-all">
                        Full Result View
                    </Link>
                    <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">Analysis Detail</h1>
            <p className="text-surface-200 text-sm mb-8">{new Date(createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <div className="space-y-5">
                {aiResult?.redFlags?.length > 0 && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-5">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                            <div>
                                <p className="font-semibold text-red-300 mb-2">Red Flags Detected — Seek Professional Evaluation</p>
                                <ul className="space-y-1">
                                    {aiResult.redFlags.map((flag, i) => (
                                        <li key={i} className="text-xs text-red-300">{flag}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                    <div className="glass-card p-5 border border-white/8">
                        <p className="text-xs text-surface-200 mb-3">Analyzed Image</p>
                        <div className="rounded-xl overflow-hidden bg-surface-800 aspect-square">
                            <img src={imageUrl} alt="Analyzed skin" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div className="glass-card p-5 border border-white/8 space-y-3">
                        <div>
                            <p className="text-xs text-surface-200 mb-2">Severity</p>
                            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl border ${sevConfig.bg} ${sevConfig.color}`}>
                                {sevConfig.label}
                            </span>
                        </div>
                        {symptoms && (
                            <div>
                                <p className="text-xs text-surface-200 mb-2">Reported Symptoms</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {symptoms.location && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-surface-200">{symptoms.location}</span>}
                                    {symptoms.duration && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-surface-200">{symptoms.duration}</span>}
                                    {symptoms.itching && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-surface-200">Itching</span>}
                                    {symptoms.pain && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-surface-200">Pain</span>}
                                    {symptoms.redness && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-surface-200">Redness</span>}
                                    {symptoms.spreading && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-surface-200">Spreading</span>}
                                    {symptoms.scaling && <span className="text-xs px-2 py-0.5 rounded-full bg-surface-700 text-surface-200">Scaling</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {aiResult?.possibleConditions?.length > 0 && (
                    <div className="glass-card p-6 border border-white/8">
                        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-white">
                            <Info className="w-4 h-4 text-primary-400" /> Possible Conditions
                        </div>
                        <div className="space-y-4">
                            {aiResult.possibleConditions.map((cond, i) => (
                                <div key={i} className={`p-4 rounded-xl border ${i === 0 ? 'border-primary-500/30 bg-primary-500/5' : 'border-white/5 bg-surface-800/30'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-white text-sm">{cond.name}</h4>
                                        <span className="text-lg font-bold text-primary-400">{Math.round(cond.confidence * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-surface-700 rounded-full mb-2">
                                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.round(cond.confidence * 100)}%` }} />
                                    </div>
                                    {cond.description && <p className="text-xs text-surface-200 leading-relaxed">{cond.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {aiResult?.recommendation && (
                    <div className="glass-card p-5 border border-primary-500/20">
                        <h3 className="font-semibold text-white mb-2 text-sm">Recommended Next Steps</h3>
                        <p className="text-surface-200 text-sm leading-relaxed">{aiResult.recommendation}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <Link to="/find-dermatologist" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary-500/40 text-primary-400 hover:bg-primary-500/10 text-sm font-medium transition-all">
                        <MapPin className="w-4 h-4" /> Find Dermatologist
                    </Link>
                    <Link to="/analysis/new" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold transition-all shadow-lg shadow-primary-500/20">
                        New Analysis
                    </Link>
                </div>

                <Disclaimer variant="compact" />
            </div>
        </div>
    );
};

export default AnalysisDetails;
