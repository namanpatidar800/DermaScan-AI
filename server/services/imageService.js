/**
 * Image Service — Modular image upload handler.
 * Currently uses Cloudinary. Replace with another provider by
 * implementing the same interface.
 */

import { v2 as cloudinary } from 'cloudinary';
import '../config/cloudinary.js';

export const uploadImageToCloud = async (fileBuffer, originalName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'skinova',
                resource_type: 'image',
                transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            },
            (error, result) => {
                if (error) {
                    reject(new Error(`Image upload failed: ${error.message}`));
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
};

export const deleteImageFromCloud = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err.message);
    }
};
