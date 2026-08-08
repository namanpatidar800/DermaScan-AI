import { useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, ScanLine } from 'lucide-react';

const LOCATIONS = ['Face', 'Neck', 'Scalp', 'Arms', 'Hands', 'Legs', 'Feet', 'Torso/Chest', 'Back', 'Groin', 'Other'];
const DURATIONS = ['Less than 1 day', '1–7 days', '1–4 weeks', '1–6 months', 'More than 6 months', 'Not sure'];

const SymptomForm = ({ onBack, onNext }) => {
    const [symptoms, setSymptoms] = useState({
        location: '',
        duration: '',
        itching: false,
        pain: false,
        swelling: false,
        redness: false,
        spreading: false,
        scaling: false,
        discharge: false,
        recentChange: false,
        previousTreatment: '',
        allergies: '',
        previousEpisodes: false,
        notes: '',
    });

    const toggle = (key) => setSymptoms((s) => ({ ...s, [key]: !s[key] }));
    const setField = (key, val) => setSymptoms((s) => ({ ...s, [key]: val }));

    const CheckBox = ({ label, field }) => (
        <button
            type="button"
            onClick={() => toggle(field)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${symptoms[field]
                ? 'bg-primary-500/20 border-primary-500/60 text-primary-300'
                : 'bg-surface-800/40 border-white/10 text-surface-200 hover:border-white/20'
                }`}
        >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${symptoms[field] ? 'bg-primary-500 border-primary-500' : 'border-white/30'
                }`}>
                {symptoms[field] && <CheckCircle className="w-3 h-3 text-white fill-current" />}
            </div>
            {label}
        </button>
    );

    return (
        <div className="space-y-7">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Describe Your Symptoms</h2>
                <p className="text-surface-200 text-sm">Answer as accurately as possible. All fields are optional.</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-primary-400 text-xs font-bold uppercase tracking-wider">About the Skin Change</h3>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">Where is the affected area?</label>
                    <select
                        value={symptoms.location}
                        onChange={(e) => setField('location', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-white/10 text-white focus:outline-none focus:border-primary-500/60 transition-all text-sm"
                    >
                        <option value="">Select location...</option>
                        {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">How long has it been present?</label>
                    <select
                        value={symptoms.duration}
                        onChange={(e) => setField('duration', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-white/10 text-white focus:outline-none focus:border-primary-500/60 transition-all text-sm"
                    >
                        <option value="">Select duration...</option>
                        {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-primary-400 text-xs font-bold uppercase tracking-wider">Symptoms & Changes</h3>
                <label className="block text-sm font-medium text-white mb-2">Symptoms present (select all that apply):</label>
                <div className="flex flex-wrap gap-2">
                    <CheckBox label="Itching" field="itching" />
                    <CheckBox label="Pain" field="pain" />
                    <CheckBox label="Swelling" field="swelling" />
                    <CheckBox label="Redness" field="redness" />
                    <CheckBox label="Spreading" field="spreading" />
                    <CheckBox label="Scaling / Flaking" field="scaling" />
                    <CheckBox label="Discharge" field="discharge" />
                    <CheckBox label="Recent Change" field="recentChange" />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-primary-400 text-xs font-bold uppercase tracking-wider">History</h3>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">Any medication or cream applied?</label>
                    <input
                        type="text"
                        value={symptoms.previousTreatment}
                        onChange={(e) => setField('previousTreatment', e.target.value)}
                        placeholder="e.g. hydrocortisone cream, antihistamine..."
                        className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-white/10 text-white placeholder-surface-200 focus:outline-none focus:border-primary-500/60 transition-all text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">Known allergies?</label>
                    <input
                        type="text"
                        value={symptoms.allergies}
                        onChange={(e) => setField('allergies', e.target.value)}
                        placeholder="e.g. latex, nickel, pollen..."
                        className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-white/10 text-white placeholder-surface-200 focus:outline-none focus:border-primary-500/60 transition-all text-sm"
                    />
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <CheckBox label="Similar previous episodes?" field="previousEpisodes" />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-primary-400 text-xs font-bold uppercase tracking-wider">Additional Information</h3>
                <div>
                    <label className="block text-sm font-medium text-white mb-2">Additional notes (optional)</label>
                    <textarea
                        value={symptoms.notes}
                        onChange={(e) => setField('notes', e.target.value)}
                        rows={3}
                        placeholder="Anything else you'd like to mention..."
                        className="w-full px-4 py-3 rounded-xl bg-surface-800/60 border border-white/10 text-white placeholder-surface-200 focus:outline-none focus:border-primary-500/60 transition-all text-sm resize-none"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-surface-200 hover:text-white hover:border-white/20 transition-all text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                    onClick={() => onNext(symptoms)}
                    className="flex-1 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    Review Responses <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default SymptomForm;
