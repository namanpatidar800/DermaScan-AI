import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Calendar, ChevronRight, Users, ArrowLeft } from 'lucide-react';

const PatientDetailsForm = ({ onSubmit, onBack, initialData = {} }) => {
    const [formData, setFormData] = useState({
        fullName: initialData.fullName || '',
        contactNumber: initialData.contactNumber || '',
        address: initialData.address || '',
        gender: initialData.gender || '',
        dob: initialData.dob || '',
    });

    const [errors, setErrors] = useState({});

    // Calculate age automatically using DOB
    const calculateAge = (dobString) => {
        if (!dobString) return '';
        const today = new Date();
        const birthDate = new Date(dobString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.dob) newErrors.dob = 'Date of Birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const age = calculateAge(formData.dob);
            onSubmit({ ...formData, age });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 border border-surface-200 rounded-2xl shadow-sm text-left animate-fade-in-up">
            <div className="mb-6 border-b border-surface-100 pb-4">
                <h2 className="text-xl font-bold text-surface-900 mb-2">Patient Details</h2>
                <p className="text-surface-500 text-sm">Please provide clinical context. This information will appear securely on your final PDF report.</p>
            </div>

            <div className="space-y-5">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-1.5 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-primary-500" /> Full Name *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-surface-200'} bg-surface-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-sm font-medium`}
                        placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                    {/* DOB */}
                    <div>
                        <label className="block text-sm font-semibold text-surface-700 mb-1.5 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary-500" /> Date of Birth *
                        </label>
                        <input
                            type="date"
                            name="dob"
                            max={new Date().toISOString().split("T")[0]}
                            value={formData.dob}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.dob ? 'border-red-500 bg-red-50' : 'border-surface-200'} bg-surface-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-sm font-medium`}
                        />
                        {errors.dob && <p className="text-red-500 text-xs mt-1 font-medium">{errors.dob}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-semibold text-surface-700 mb-1.5 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-primary-500" /> Gender *
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.gender ? 'border-red-500 bg-red-50' : 'border-surface-200'} bg-surface-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-sm font-medium`}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gender}</p>}
                    </div>
                </div>

                {/* Contact Number */}
                <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-primary-500" /> Contact Number
                    </label>
                    <input
                        type="tel"
                        name="contactNumber"
                        placeholder="+1 (555) 000-0000"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-sm font-medium"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary-500" /> Address
                    </label>
                    <textarea
                        name="address"
                        rows="2"
                        placeholder="123 Main St, City, Country"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-sm font-medium resize-none"
                    ></textarea>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 flex justify-center items-center gap-2 px-6 py-3.5 border border-surface-300 text-surface-700 hover:bg-surface-50 font-bold rounded-xl transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                    type="submit"
                    className="flex-1 flex justify-center items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all"
                >
                    Continue to Review <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </form>
    );
};

export default PatientDetailsForm;
