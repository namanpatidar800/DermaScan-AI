import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalyses, deleteAnalysis } from '../services/analysisService.js';
import Loader from '../components/Loader.jsx';
import {
    Clock, ChevronRight, Trash2, AlertTriangle, ScanLine, Plus, Eye
} from 'lucide-react';

const severityColor = {
    low: 'text-green-400 bg-green-400/10 border-green-400/20',
    moderate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    urgent: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const AnalysisHistory = () => {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 10;

    const load = async (p = 1) => {
        setLoading(true);
        try {
            const data = await getAnalyses(p, LIMIT);
            setAnalyses(data.analyses || []);
            setTotal(data.pagination?.total || 0);
        } catch {
            setError('Could not load analyses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(page); }, [page]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this analysis? This action cannot be undone.')) return;
        setDeleting(id);
        try {
            await deleteAnalysis(id);
            setAnalyses((prev) => prev.filter((a) => a._id !== id));
            setTotal((t) => t - 1);
        } catch {
            alert('Failed to delete. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Analysis History</h1>
                    <p className="text-surface-200 text-sm">{total} total {total === 1 ? 'analysis' : 'analyses'}</p>
                </div>
                <Link
                    to="/analysis/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-primary-500/20"
                >
                    <Plus className="w-4 h-4" /> New Analysis
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-24"><Loader size="lg" text="Loading history..." /></div>
            ) : error ? (
                <div className="glass-card p-8 text-center border border-white/8">
                    <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <p className="text-surface-200">{error}</p>
                </div>
            ) : analyses.length === 0 ? (
                <div className="glass-card p-16 text-center border border-white/8">
                    <ScanLine className="w-12 h-12 text-primary-400/50 mx-auto mb-4" />
                    <h3 className="font-semibold text-white mb-2">No analyses yet</h3>
                    <p className="text-surface-200 text-sm mb-6">Start your first AI-assisted skin assessment.</p>
                    <Link to="/analysis/new" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20">
                        <Plus className="w-4 h-4" /> Start Analysis
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {analyses.map((analysis) => {
                            const top = analysis.aiResult?.possibleConditions?.[0];
                            const sev = analysis.aiResult?.severity || 'low';
                            return (
                                <div key={analysis._id} className="glass-card p-5 border border-white/8 hover:border-primary-500/30 transition-all flex items-center gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-800 shrink-0">
                                        <img src={analysis.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-white font-medium text-sm truncate">{top?.name || 'Analysis complete'}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${severityColor[sev]}`}>{sev}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-surface-200">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link
                                            to={`/history/${analysis._id}`}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 hover:border-primary-500/40 text-surface-200 hover:text-white text-xs font-medium transition-all"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(analysis._id)}
                                            disabled={deleting === analysis._id}
                                            className="p-2 rounded-xl border border-white/10 hover:border-red-500/40 text-surface-200 hover:text-red-400 transition-all disabled:opacity-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-8">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-white/10 text-surface-200 hover:text-white text-sm disabled:opacity-40">← Prev</button>
                            <span className="text-surface-200 text-sm">{page} / {totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl border border-white/10 text-surface-200 hover:text-white text-sm disabled:opacity-40">Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AnalysisHistory;
