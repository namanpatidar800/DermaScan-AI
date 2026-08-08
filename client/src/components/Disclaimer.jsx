import { AlertTriangle } from 'lucide-react';

const Disclaimer = ({ variant = 'default' }) => {
    if (variant === 'compact') {
        return (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>AI-assisted assessment only — not a medical diagnosis. Consult a healthcare professional.</span>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
            <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-yellow-300 mb-1 text-sm">Important Medical Disclaimer</h4>
                    <p className="text-xs text-yellow-200/80 leading-relaxed">
                        DermaScan AI provides an <strong>AI-assisted preliminary assessment</strong> only — it is{' '}
                        <strong>NOT a medical diagnosis</strong>. Results should not be used as a substitute for professional
                        medical advice, examination, or treatment. Always consult a qualified dermatologist or healthcare
                        provider for proper diagnosis and treatment of skin conditions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
