import { useState } from 'react';
import { Mic, MicOff, CheckCircle, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';

const LOCATIONS = ['Face', 'Scalp', 'Neck', 'Chest', 'Shoulder', 'Back', 'Arms', 'Hands', 'Finger', 'Legs', 'Knee', 'Feet', 'Other', 'Prefer not to say'];
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
    const [isListening, setIsListening] = useState(false);

    const toggle = (key) => setSymptoms((s) => ({ ...s, [key]: !s[key] }));
    const setField = (key, val) => setSymptoms((s) => ({ ...s, [key]: val }));

    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice input is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        if (isListening) {
            recognition.stop();
            setIsListening(false);
            return;
        }

        setIsListening(true);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setField('notes', symptoms.notes ? symptoms.notes + ' ' + transcript : transcript);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    const CheckBox = ({ label, field }) => (
        <button
            type="button"
            onClick={() => toggle(field)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${symptoms[field]
                ? 'bg-primary-100 border-primary-400 text-primary-800'
                : 'bg-surface-50 border-surface-300 text-surface-800 hover:border-primary-300'
                }`}
        >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${symptoms[field] ? 'bg-primary-500 border-primary-500' : 'border-surface-300'
                }`}>
                {symptoms[field] && <CheckCircle className="w-3 h-3 text-white fill-current" />}
            </div>
            {label}
        </button>
    );

    return (
        <div className="space-y-7">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-surface-900 mb-1">Describe Your Symptoms</h2>
                    <p className="text-surface-800 text-sm">Answer as accurately as possible. All fields are optional.</p>
                </div>
                <button
                    onClick={handleVoiceInput}
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border ${isListening ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 'bg-surface-100 text-surface-700 hover:bg-surface-200 border-surface-300'}`}
                >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-primary-500" />}
                    {isListening ? 'Listening...' : 'Speak'}
                </button>
            </div>

            <div className="space-y-4">
                <h3 className="text-primary-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2"><PenTool className="w-3 h-3 text-primary-500" /> About the Skin Change</h3>

                <div>
                    <label className="block text-sm font-medium text-surface-900 mb-2">Where is the affected area?</label>
                    <select
                        value={symptoms.location}
                        onChange={(e) => setField('location', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all text-sm"
                    >
                        <option value="">Select location or 'Prefer not to say'...</option>
                        {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-surface-900 mb-2">How long has it been present?</label>
                    <select
                        value={symptoms.duration}
                        onChange={(e) => setField('duration', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all text-sm"
                    >
                        <option value="">Select duration...</option>
                        {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-surface-200">
                <h3 className="text-primary-700 text-xs font-bold uppercase tracking-wider">Symptoms & Changes</h3>
                <label className="block text-sm font-medium text-surface-900 mb-2">Symptoms present (select all that apply):</label>
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

            <div className="space-y-4 pt-4 border-t border-surface-200">
                <h3 className="text-primary-700 text-xs font-bold uppercase tracking-wider">History</h3>

                <div>
                    <label className="block text-sm font-medium text-surface-900 mb-2">Any medication or cream applied?</label>
                    <input
                        type="text"
                        value={symptoms.previousTreatment}
                        onChange={(e) => setField('previousTreatment', e.target.value)}
                        placeholder="e.g. hydrocortisone cream, antihistamine..."
                        className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-800 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-surface-900 mb-2">Known allergies?</label>
                    <input
                        type="text"
                        value={symptoms.allergies}
                        onChange={(e) => setField('allergies', e.target.value)}
                        placeholder="e.g. latex, nickel, pollen..."
                        className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-800 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all text-sm"
                    />
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <CheckBox label="Similar previous episodes?" field="previousEpisodes" />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-surface-200">
                <h3 className="text-primary-700 text-xs font-bold uppercase tracking-wider">Additional Information</h3>
                <div>
                    <label className="block text-sm font-medium text-surface-900 mb-2">Additional notes (optional)</label>
                    <textarea
                        value={symptoms.notes}
                        onChange={(e) => setField('notes', e.target.value)}
                        rows={3}
                        placeholder="Anything else you'd like to mention..."
                        className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-800 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all text-sm resize-none"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-surface-300 text-surface-800 hover:text-surface-900 hover:bg-surface-100 transition-all text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                    onClick={() => onNext(symptoms)}
                    className="flex-1 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                    Review Responses <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default SymptomForm;
