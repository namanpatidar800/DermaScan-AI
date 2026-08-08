import { AlertTriangle } from 'lucide-react';

const MedicalDisclaimer = () => (
    <div className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 mb-6">
                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Medical Disclaimer</h1>
                <p className="text-surface-200">Please read this carefully before using DermaScan AI.</p>
            </div>

            <div className="space-y-6">
                {[
                    {
                        title: 'Not a Medical Diagnosis',
                        content: 'DermaScan AI provides AI-assisted preliminary assessments for informational purposes only. The information provided by DermaScan AI does NOT constitute medical advice, diagnosis, or treatment recommendations. Results are not a substitute for professional medical evaluation.',
                    },
                    {
                        title: 'Consult a Healthcare Professional',
                        content: 'Always seek the advice of a qualified dermatologist, physician, or other licensed healthcare provider with any questions you may have regarding a medical condition. Do not delay in seeking professional medical advice or disregard professional medical advice based on information from DermaScan AI.',
                    },
                    {
                        title: 'AI Limitations',
                        content: 'Artificial intelligence has inherent limitations and cannot replace the expertise, examination, and judgement of a trained medical professional. AI assessments may be inaccurate, incomplete, or misleading. Confidence scores are estimates only and do not represent diagnostic certainty.',
                    },
                    {
                        title: 'Emergency Situations',
                        content: 'If you are experiencing a medical emergency, rapidly worsening symptoms, severe pain, difficulty breathing, significant bleeding, or signs of serious infection — call emergency services (911 or your local emergency number) immediately. Do not use DermaScan AI instead of seeking emergency care.',
                    },
                    {
                        title: 'No Prescriptions or Treatment Plans',
                        content: 'DermaScan AI does not prescribe medications, recommend specific prescription treatments, or provide treatment plans. Never start, stop, or modify any medication or treatment based on information from this application.',
                    },
                    {
                        title: 'Image and Data Privacy',
                        content: 'Images you upload may contain visible skin conditions. Do not upload images that contain sensitive personal information beyond what is necessary for assessment. Your data is stored securely and is not shared with third parties.',
                    },
                ].map(({ title, content }) => (
                    <div key={title} className="glass-card p-6 border border-white/8">
                        <h2 className="font-semibold text-white mb-3 text-base">{title}</h2>
                        <p className="text-surface-200 text-sm leading-relaxed">{content}</p>
                    </div>
                ))}

                <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-6 text-center">
                    <p className="text-yellow-200 text-sm font-medium">
                        By using DermaScan AI, you acknowledge that you have read, understood, and agree to this disclaimer.
                        DermaScan AI and its developers are not liable for any health decisions made based on the information provided.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default MedicalDisclaimer;
