import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ArrowRightLeft, ShieldAlert, CheckCircle, Info, Calendar } from 'lucide-react';

const Comparison = () => {
    const [history, setHistory] = useState([]);
    const [selectedA, setSelectedA] = useState(null);
    const [selectedB, setSelectedB] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('skinova_history');
            if (raw) {
                const parsed = JSON.parse(raw);
                setHistory(parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            }
        } catch (err) {
            console.error("Failed to load history for comparison", err);
        }
    }, []);

    const ScanSelector = ({ selected, onSelect, excludeId, label }) => (
        <div className="bg-surface-50 border border-surface-200 rounded-2xl p-4 md:p-6 w-full">
            <h3 className="font-bold text-surface-900 mb-4">{label}</h3>
            {history.filter(h => h.id !== excludeId).length === 0 ? (
                <p className="text-surface-500 text-sm">No other scans available.</p>
            ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-surface-300">
                    {history.filter(h => h.id !== excludeId).map(scan => (
                        <button
                            key={scan.id}
                            onClick={() => onSelect(scan)}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-4 ${selected?.id === scan.id
                                    ? 'bg-primary-50 border-primary-400 ring-1 ring-primary-400 shadow-sm'
                                    : 'bg-white border-surface-200 hover:border-primary-300'
                                }`}
                        >
                            <img src={scan.imageUrl} alt="Scan" className="w-12 h-12 rounded-lg object-cover border border-surface-200 bg-surface-100" />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-surface-900 text-sm truncate">{scan.condition}</p>
                                <div className="flex items-center gap-1.5 text-xs text-surface-500 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(scan.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            {selected?.id === scan.id && <CheckCircle className="w-5 h-5 text-primary-500" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    const DetailCard = ({ scan }) => {
        if (!scan) return <div className="h-[500px] border-2 border-dashed border-surface-200 rounded-3xl flex items-center justify-center text-surface-400 font-medium">Select a scan above</div>;
        return (
            <div className="bg-white border border-surface-200 shadow-md rounded-3xl overflow-hidden flex flex-col h-full">
                <div className="p-4 bg-surface-900 text-white flex justify-between items-center">
                    <span className="font-mono text-xs text-surface-300">{new Date(scan.createdAt).toLocaleDateString()}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${scan.severity === 'high' || scan.severity === 'urgent' ? 'bg-red-500 text-white' : scan.severity === 'moderate' ? 'bg-yellow-500 text-yellow-900' : 'bg-green-500 text-green-900'}`}>
                        {scan.severity || 'Unknown'} Attention
                    </span>
                </div>
                <div className="aspect-square bg-surface-100 border-b border-surface-200 p-4 flex items-center justify-center">
                    <img src={scan.imageUrl} alt="Analysis" className="max-w-full max-h-full object-contain rounded-xl shadow-sm" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-surface-900 text-lg mb-4 text-center">{scan.condition}</h3>
                    <div className="bg-surface-50 rounded-xl p-4 border border-surface-200 mt-auto">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">Reported Symptoms</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {Object.entries(scan.symptoms || {}).filter(([k, v]) => v === true).length > 0
                                ? Object.entries(scan.symptoms).filter(([k, v]) => v === true).map(([k]) => (
                                    <span key={k} className="px-2 py-1 bg-white border border-surface-200 rounded-md text-xs text-surface-700 shadow-sm capitalize">{k}</span>
                                ))
                                : <span className="text-xs text-surface-500">No specific symptoms recorded</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/history" className="flex items-center gap-1.5 text-surface-600 hover:text-surface-900 font-medium text-sm transition-colors mb-4 inline-flex">
                    <ChevronLeft className="w-4 h-4" /> Back to Tracker
                </Link>
                <div className="text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-4 shadow-sm border border-primary-100">
                        <ArrowRightLeft className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold text-surface-900 mb-3 tracking-tight">Same-Spot Follow-Up Mode</h1>
                    <p className="text-surface-600 text-sm leading-relaxed">
                        Compare your secure local history side-by-side to visually track changes. Select a previous scan and a recent follow-up scan.
                    </p>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3 mb-8 max-w-4xl mx-auto shadow-sm">
                <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-yellow-900 mb-1">Visual Comparison is NOT Clinical Improvement</h4>
                    <p className="text-xs text-yellow-800 leading-relaxed">
                        SKINOVA detected visual differences between the selected records. Visual changes in lighting, distance, or apparent size do not confirm medical improvement or worsening. Consult a healthcare professional if you are concerned about changes.
                    </p>
                </div>
            </div>

            {history.length < 2 ? (
                <div className="text-center py-24 bg-white border border-surface-200 rounded-3xl max-w-3xl mx-auto shadow-sm">
                    <ShieldAlert className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-surface-900 mb-2">Insufficient History</h3>
                    <p className="text-surface-600 text-sm max-w-md mx-auto mb-6">You need at least 2 saved tracking records in your device history to perform a visual comparison.</p>
                    <Link to="/analysis/new" className="inline-flex bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all">Take a Skin Scan</Link>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    <div className="space-y-6">
                        <ScanSelector label="Select Baseline Scan (Older)" selected={selectedA} onSelect={setSelectedA} excludeId={selectedB?.id} />
                        <DetailCard scan={selectedA} />
                    </div>

                    <div className="space-y-6 relative">
                        <div className="hidden lg:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border border-surface-200 shadow-md items-center justify-center z-10 text-surface-400">
                            <ArrowRightLeft className="w-5 h-5" />
                        </div>
                        <ScanSelector label="Select Follow-Up Scan (Newer)" selected={selectedB} onSelect={setSelectedB} excludeId={selectedA?.id} />
                        <DetailCard scan={selectedB} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Comparison;
