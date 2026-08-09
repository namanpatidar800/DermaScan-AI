import { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, Info, ArrowRight } from 'lucide-react';

const conditions = [
    {
        id: 'melanoma',
        name: 'Melanoma',
        type: 'Malignant (Cancer)',
        risk: 'High',
        description: 'The most serious type of skin cancer. Develops in the cells (melanocytes) that produce melanin.',
        symptoms: ['Asymmetrical shape', 'Border irregularity', 'Color variations', 'Diameter over 6mm', 'Evolving in shape/size'],
        prevention: 'Avoid peak sun exposure, use broad-spectrum SPF 30+, avoid tanning beds.'
    },
    {
        id: 'bcc',
        name: 'Basal Cell Carcinoma',
        type: 'Malignant (Cancer)',
        risk: 'Moderate',
        description: 'A type of skin cancer that most often develops on areas of skin exposed to the sun, such as the face.',
        symptoms: ['Pearly or waxy bump', 'Flat, flesh-colored or brown scar-like lesion', 'Bleeding or scabbing sore that heals and returns'],
        prevention: 'Daily sun protection, regular full-body skin exams.'
    },
    {
        id: 'eczema',
        name: 'Eczema (Atopic Dermatitis)',
        type: 'Inflammatory',
        risk: 'Low',
        description: 'A condition that makes your skin red and itchy. It is common in children but can occur at any age.',
        symptoms: ['Dry skin', 'Itching (especially at night)', 'Red to brownish-gray patches', 'Cracked, scaly skin'],
        prevention: 'Moisturize regularly, identify and avoid triggers, take shorter warm showers.'
    },
    {
        id: 'psoriasis',
        name: 'Psoriasis',
        type: 'Autoimmune',
        risk: 'Low',
        description: 'A skin disease that causes a rash with itchy, scaly patches, most commonly on the knees, elbows, trunk and scalp.',
        symptoms: ['Red patches covered with thick, silvery scales', 'Dry, cracked skin that may bleed', 'Itching, burning, or soreness'],
        prevention: 'Manage stress, avoid smoking, limit alcohol, use moisturizers daily.'
    },
    {
        id: 'rosacea',
        name: 'Rosacea',
        type: 'Inflammatory',
        risk: 'Low',
        description: 'A common skin condition that causes blushing or flushing and visible blood vessels in your face.',
        symptoms: ['Facial flushing', 'Visible veins', 'Swollen bumps', 'Burning sensation'],
        prevention: 'Identify triggers (spicy foods, alcohol, extreme temperatures) and use gentle skincare.'
    },
    {
        id: 'acne',
        name: 'Acne Vulgaris',
        type: 'Inflammatory',
        risk: 'Low',
        description: 'A skin condition that occurs when your hair follicles become plugged with oil and dead skin cells.',
        symptoms: ['Whiteheads', 'Blackheads', 'Small red, tender bumps (papules)', 'Pimples (pustules)'],
        prevention: 'Wash twice daily with gentle cleanser, avoid heavy cosmetics, do not pick at blemishes.'
    }
];

const SkinConditions = () => {
    const [search, setSearch] = useState('');

    const filtered = conditions.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">Knowledge Hub</span>
                <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4 tracking-tight">Understanding Skin Conditions</h1>
                <p className="text-surface-600">
                    Learn about common skin ailments, from inflammatory conditions to skin cancers. Being informed is the first step toward better skin health.
                </p>

                <div className="mt-8 relative max-w-md mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search conditions (e.g. Eczema, Melanoma)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-surface-300 rounded-xl shadow-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length > 0 ? (
                    filtered.map(condition => (
                        <div key={condition.id} className="bg-white border border-surface-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary-300 transition-all flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-surface-900 mb-1">{condition.name}</h3>
                                    <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider">{condition.type}</p>
                                </div>
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${condition.risk === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                                        condition.risk === 'Moderate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            'bg-green-50 text-green-700 border-green-200'
                                    }`}>
                                    Risk: {condition.risk}
                                </span>
                            </div>

                            <p className="text-surface-600 text-sm mb-6 leading-relaxed flex-1">
                                {condition.description}
                            </p>

                            <div className="space-y-4 pt-4 border-t border-surface-100">
                                <div>
                                    <h4 className="flex items-center gap-1.5 text-xs font-bold text-surface-900 uppercase mb-2">
                                        <ShieldAlert className="w-3.5 h-3.5 text-secondary-500" /> Common Signs
                                    </h4>
                                    <ul className="space-y-1">
                                        {condition.symptoms.map(sym => (
                                            <li key={sym} className="text-sm text-surface-600 flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-surface-300 mt-1.5 shrink-0" />
                                                {sym}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="flex items-center gap-1.5 text-xs font-bold text-surface-900 uppercase mb-2">
                                        <CheckCircle className="w-3.5 h-3.5 text-primary-500" /> Prevention & Care
                                    </h4>
                                    <p className="text-sm text-surface-600 leading-relaxed">
                                        {condition.prevention}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-16 h-16 bg-surface-50 border border-surface-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info className="w-8 h-8 text-surface-400" />
                        </div>
                        <h3 className="text-lg font-bold text-surface-900 mb-1">No conditions found</h3>
                        <p className="text-surface-500">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>

            <div className="mt-16 bg-primary-900 rounded-2xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldAlert className="w-48 h-48 text-white" />
                </div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Notice Something Unusual?</h2>
                    <p className="text-primary-100 mb-8 leading-relaxed">
                        Early detection is critical for managing skin conditions and skin cancers. If you see a spot that is new, changing, or unusual, do not wait.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => window.location.href = '/analysis/new'} className="bg-white text-primary-900 hover:bg-surface-50 px-6 py-3 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                            Take a Scan Now <ArrowRight className="w-4 h-4" />
                        </button>
                        <button onClick={() => window.location.href = '/find-dermatologist'} className="bg-primary-800 border border-primary-700 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                            Find a Dermatologist
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SkinConditions;
