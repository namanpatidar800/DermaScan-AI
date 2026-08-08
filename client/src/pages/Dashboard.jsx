import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAnalyses } from '../services/analysisService.js';
import Loader from '../components/Loader.jsx';
import {
    ScanLine, Plus, Activity, Clock, ChevronRight, MapPin,
    TrendingUp, Calendar, AlertTriangle
} from 'lucide-react';

const severityColor = {
    low: 'text-green-400 bg-green-400/10 border-green-400/20',
    moderate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    urgent: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const StatCard = ({ icon: Icon, label, value, sub }) => (
    <div className="glass-card p-6 border border-white/8 hover:border-primary-500/30 transition-all">
        <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary-400" />
            </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-surface-200">{label}</div>
        {sub && <div className="text-xs text-surface-200 mt-1">{sub}</div>}
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getAnalyses(1, 5);
                setAnalyses(data.analyses || []);
            } catch {
                setError('Could not load your analyses. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const lastAnalysis = analyses[0];
    const lastDate = lastAnalysis
        ? new Date(lastAnalysis.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'None yet';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Welcome */}
            <div className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-surface-200 text-sm mb-1">Welcome back</p>
                        <h1 className="text-3xl font-bold text-white">{user?.name?.split(' ')[0]} 👋</h1>
                    </div>
                    <Link
                        to="/analysis/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4" /> New Skin Analysis
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                <StatCard icon={Activity} label="Total Analyses" value={analyses.length || 0} />
                <StatCard icon={Calendar} label="Last Analysis" value={lastDate} />
                <StatCard
                    icon={TrendingUp}
                    label="Top Concern"
                    value={lastAnalysis?.aiResult?.possibleConditions?.[0]?.name?.split(' ')[0] || '—'}
                    sub={lastAnalysis ? 'From last analysis' : 'No analyses yet'}
                />
            </div>

            <div className="flex gap-4 mb-10">
                <Link
                    to="/find-dermatologist"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl glass-card border border-white/8 hover:border-primary-500/30 text-surface-200 hover:text-white text-sm font-medium transition-all"
                >
                    <MapPin className="w-4 h-4 text-primary-400" /> Find a Dermatologist
                </Link>
                <Link
                    to="/history"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl glass-card border border-white/8 hover:border-primary-500/30 text-surface-200 hover:text-white text-sm font-medium transition-all"
                >
                    <Clock className="w-4 h-4 text-primary-400" /> View Full History
                </Link>
            </div>

            {/* Recent Analyses */}
            <div>
                <h2 className="text-white font-semibold text-lg mb-5">Recent Analyses</h2>
                {loading ? (
                    <div className="flex justify-center py-16"><Loader size="lg" text="Loading your analyses..." /></div>
                ) : error ? (
                    <div className="glass-card p-8 text-center text-surface-200 border border-white/8">
                        <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                        <p>{error}</p>
                    </div>
                ) : analyses.length === 0 ? (
                    <div className="glass-card p-12 text-center border border-white/8">
                        <ScanLine className="w-12 h-12 text-primary-400/50 mx-auto mb-4" />
                        <h3 className="font-semibold text-white mb-2">No analyses yet</h3>
                        <p className="text-surface-200 text-sm mb-6">Start your first AI-assisted skin assessment.</p>
                        <Link
                            to="/analysis/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20"
                        >
                            <Plus className="w-4 h-4" /> Start Analysis
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {analyses.map((analysis) => {
                            const top = analysis.aiResult?.possibleConditions?.[0];
                            const sev = analysis.aiResult?.severity || 'low';
                            return (
                                <Link
                                    key={analysis._id}
                                    to={`/history/${analysis._id}`}
                                    className="glass-card p-5 border border-white/8 hover:border-primary-500/30 flex items-center gap-5 transition-all group"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-800 shrink-0">
                                        <img
                                            src={analysis.imageUrl}
                                            alt="Analysis"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = ''; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-white font-medium text-sm truncate">
                                                {top?.name || 'Analysis complete'}
                                            </p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${severityColor[sev]}`}>
                                                {sev}
                                            </span>
                                        </div>
                                        <p className="text-surface-200 text-xs">
                                            {new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-surface-200 group-hover:text-primary-400 transition-colors shrink-0" />
                                </Link>
                            );
                        })}
                        {analyses.length >= 5 && (
                            <Link to="/history" className="flex items-center justify-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium py-3 transition-colors">
                                View all analyses <ChevronRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
