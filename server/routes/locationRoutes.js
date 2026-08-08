import express from 'express';
import { getNearbyLocations } from '../controllers/locationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/nearby', protect, getNearbyLocations);

export default router;
