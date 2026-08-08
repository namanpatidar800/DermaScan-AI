import express from 'express';
import {
    uploadImage,
    analyzeImage,
    getAnalyses,
    getAnalysisById,
    deleteAnalysis,
} from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';
import { analysisRateLimit } from '../middleware/rateLimitMiddleware.js';
import upload, { handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/upload', analysisRateLimit, upload.single('image'), handleUploadError, uploadImage);
router.post('/analyze', analysisRateLimit, analyzeImage);
router.get('/', getAnalyses);
router.get('/:id', getAnalysisById);
router.delete('/:id', deleteAnalysis);

export default router;
