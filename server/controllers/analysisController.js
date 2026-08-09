import Analysis from '../models/Analysis.js';
import { analyzeSkinImage } from '../services/aiService.js';
import { uploadImageToCloud, deleteImageFromCloud } from '../services/imageService.js';
import { successResponse, errorResponse } from '../utils/response.js';

// POST /api/analysis/upload — Upload image to cloud, return imageUrl
export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return errorResponse(res, 400, 'Please upload an image file');
        }

        const { url, publicId } = await uploadImageToCloud(req.file.buffer, req.file.originalname);

        return successResponse(res, 200, 'Image uploaded successfully', {
            imageUrl: url,
            imagePublicId: publicId,
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/analysis/analyze — Run AI analysis and save result
export const analyzeImage = async (req, res, next) => {
    try {
        const { imageUrl, imagePublicId, symptoms, patientDetails } = req.body;

        if (!imageUrl) {
            return errorResponse(res, 400, 'Image URL is required');
        }

        // Create analysis record with pending status
        const analysis = new Analysis({
            imageUrl,
            imagePublicId: imagePublicId || null,
            symptoms: symptoms || {},
            patientDetails: patientDetails || {},
            status: 'processing',
        });
        await analysis.save();

        // Run AI analysis
        let aiResult;
        try {
            aiResult = await analyzeSkinImage(imageUrl, symptoms);
        } catch (aiError) {
            analysis.status = 'failed';
            await analysis.save();
            return errorResponse(res, 503, 'AI analysis service is temporarily unavailable. Please try again later.');
        }

        // Save result
        analysis.aiResult = {
            possibleConditions: aiResult.possibleConditions || [],
            observations: aiResult.observations || [],
            severity: aiResult.severity || 'low',
            recommendation: aiResult.recommendation || '',
            redFlags: aiResult.redFlags || [],
        };
        analysis.status = 'complete';
        await analysis.save();

        return successResponse(res, 200, 'Analysis complete', { analysis });
    } catch (err) {
        next(err);
    }
};

// GET /api/analysis — Get all analyses for authenticated user
export const getAnalyses = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [analyses, total] = await Promise.all([
            Analysis.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-__v'),
            Analysis.countDocuments(),
        ]);

        return successResponse(res, 200, 'Analyses fetched', {
            analyses,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/analysis/:id — Get single analysis
export const getAnalysisById = async (req, res, next) => {
    try {
        // Find strictly by ID. (For anonymous Zero-PII scans, userId is null)
        const analysis = await Analysis.findById(req.params.id);

        if (!analysis) {
            return errorResponse(res, 404, 'Analysis not found');
        }

        return successResponse(res, 200, 'Analysis fetched', { analysis });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/analysis/:id — Delete analysis (owner only)
export const deleteAnalysis = async (req, res, next) => {
    try {
        const analysis = await Analysis.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!analysis) {
            return errorResponse(res, 404, 'Analysis not found');
        }

        // Delete image from cloud if exists
        if (analysis.imagePublicId) {
            await deleteImageFromCloud(analysis.imagePublicId);
        }

        await analysis.deleteOne();

        return successResponse(res, 200, 'Analysis deleted successfully');
    } catch (err) {
        next(err);
    }
};
