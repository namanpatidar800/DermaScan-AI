import mongoose from 'mongoose';

const conditionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    confidence: { type: Number, min: 0, max: 1 },
    description: { type: String },
});

const analysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        imagePublicId: {
            type: String,
            default: null,
        },
        symptoms: {
            location: { type: String, default: '' },
            duration: { type: String, default: '' },
            itching: { type: Boolean, default: false },
            pain: { type: Boolean, default: false },
            swelling: { type: Boolean, default: false },
            redness: { type: Boolean, default: false },
            spreading: { type: Boolean, default: false },
            scaling: { type: Boolean, default: false },
            discharge: { type: Boolean, default: false },
            recentChange: { type: Boolean, default: false },
            previousTreatment: { type: String, default: '' },
            allergies: { type: String, default: '' },
            previousEpisodes: { type: Boolean, default: false },
            notes: { type: String, default: '' },
        },
        patientDetails: {
            fullName: { type: String, default: '' },
            email: { type: String, default: '' },
            contactNumber: { type: String, default: '' },
            address: { type: String, default: '' },
            gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
            dob: { type: String, default: '' },
            age: { type: Number },
        },
        aiResult: {
            possibleConditions: [conditionSchema],
            observations: [String],
            severity: {
                type: String,
                enum: ['low', 'moderate', 'high', 'urgent'],
                default: 'low',
            },
            recommendation: { type: String, default: '' },
            redFlags: [String],
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'complete', 'failed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for user queries ordered by date
analysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
