import multer from 'multer';
import path from 'path';
import { errorResponse } from '../utils/response.js';

// Memory storage — image will be processed/uploaded to Cloudinary from buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, PNG, and WebP images are allowed'), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter,
});

// Error handler wrapper for multer
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return errorResponse(res, 400, 'Image file size must be less than 10MB');
        }
        return errorResponse(res, 400, `Upload error: ${err.message}`);
    }
    if (err) {
        return errorResponse(res, 400, err.message);
    }
    next();
};

export default upload;
