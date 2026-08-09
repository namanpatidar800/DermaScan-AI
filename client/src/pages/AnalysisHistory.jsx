import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteAnalysis } from '../services/analysisService.js';
import Loader from '../components/Loader.jsx';
import {
    Clock, ChevronRight, Trash2, AlertTriangle, ScanLine, Plus, Eye
} from 'lucide-react';

const severityColor = {
    low: 'text-green-700 bg-green-50 border-green-200',
    moderate: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    high: 'text-orange-700 bg-orange-50 border-orange-200',
    urgent: 'text-red-700 bg-red-50 border-red-200',
};

const AnalysisHistory = () => {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        // Load history from localStorage instead of the public backend
        try {
            const stored = localStorage.getItem('skinova_history');
            if (stored) {
                // Parse and sort by date descending
                const parsedList = JSON.parse(stored);
                parsedList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setAnalyses(parsedList);
            }
        } catch (err) {
            console.error("Local history error:", err);
            setError('Could not load your local history.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this scan from your history?')) return;
        setDeleting(id);
        try {
            // Remove from backend (optional, if we want to truly delete it)
            await deleteAnalysis(id).catch(e => console.error("Backend delete failed", e));

            // Remove from UI and LocalStorage
            const updated = analyses.filter((a) => a._id !== id);
            setAnalyses(updated);
            localStorage.setItem('skinova_history', JSON.stringify(updated));
        } catch {
            alert('Failed to delete. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-surface-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 mb-1">Your Progress Tracker</h1>
                    <p className="text-surface-600 text-sm">
                        {analyses.length} {analyses.length === 1 ? 'scan' : 'scans'} saved securely on this device
                    </p>
                </div>
                <Link
                    to="/analysis/new"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg transition-all text-sm shadow-sm"
                >
                    <Plus className="w-4 h-4" /> New Scan
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-24"><Loader size="lg" text="Loading history..." /></div>
            ) : error ? (
                <div className="bg-white p-8 text-center border border-surface-200 rounded-xl shadow-sm">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                    <p className="text-surface-700">{error}</p>
                </div>
            ) : analyses.length === 0 ? (
                <div className="bg-white p-12 sm:p-16 text-center border border-surface-200 rounded-2xl shadow-sm">
                    <div className="w-16 h-16 bg-surface-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-surface-200 shadow-sm">
                        <ScanLine className="w-8 h-8 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-surface-900 mb-2">No scans saved yet</h3>
                    <p className="text-surface-600 text-sm mb-6 max-w-sm mx-auto">
                        Your submitted scans will appear here automatically, stored privately on your device.
                    </p>
                    <Link to="/analysis/new" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all shadow-sm">
                        <Plus className="w-4 h-4" /> Start Your First Scan
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {analyses.map((analysis) => {
                        const top = analysis.aiResult?.possibleConditions?.[0];
                        const sev = analysis.aiResult?.severity || 'low';
                        return (
                            <div key={analysis._id} className="bg-white p-4 sm:p-5 border border-surface-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all flex items-center gap-4 group">
                                {/* Thumbnail */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-surface-50 shrink-0 border border-surface-200 shadow-sm">
                                    <img src={analysis.imageUrl} alt="Scan thumbnail" className="w-full h-full object-cover" crossOrigin="anonymous" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
                                        <p className="text-surface-900 font-bold text-sm sm:text-base truncate">{top?.name || 'Analysis complete'}</p>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wider self-start sm:self-center ${severityColor[sev]}`}>
                                            {sev}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-surface-500 font-medium font-mono">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                                    <Link
                                        to={`/history/${analysis._id}`}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-surface-50 border border-surface-200 hover:border-primary-300 hover:bg-primary-50 text-surface-700 hover:text-primary-700 text-xs sm:text-sm font-bold transition-all shadow-sm"
                                    >
                                        <Eye className="w-4 h-4" /> <span className="hidden sm:inline">View Report</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(analysis._id)}
                                        disabled={deleting === analysis._id}
                                        className="p-2 sm:px-3 sm:py-2 rounded-lg bg-surface-50 border border-surface-200 hover:border-red-300 hover:bg-red-50 text-surface-400 hover:text-red-600 transition-all shadow-sm disabled:opacity-50"
                                        title="Remove from history"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AnalysisHistory;
