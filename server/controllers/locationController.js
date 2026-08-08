import { successResponse } from '../utils/response.js';

// GET /api/locations/nearby — Return nearby healthcare facilities
// In production, integrate with a healthcare DB or external API
export const getNearbyLocations = async (req, res, next) => {
    try {
        const { lat, lng, radius = 10 } = req.query;

        // Sample healthcare facility data for demo
        // Replace with real DB query or external API (e.g., healthcare.gov, Google Places)
        const sampleFacilities = [
            {
                id: '1',
                name: 'City Dermatology Clinic',
                address: '123 Medical Center Dr',
                latitude: parseFloat(lat) + 0.01,
                longitude: parseFloat(lng) + 0.01,
                phone: '+1-555-0100',
                specialties: ['Dermatology', 'Skin Cancer Screening'],
                distance: '1.2 km',
                rating: 4.7,
            },
            {
                id: '2',
                name: 'Metro Skin Care Institute',
                address: '456 Health Boulevard',
                latitude: parseFloat(lat) - 0.015,
                longitude: parseFloat(lng) + 0.02,
                phone: '+1-555-0200',
                specialties: ['Dermatology', 'Cosmetic Dermatology', 'Pediatric Dermatology'],
                distance: '2.1 km',
                rating: 4.5,
            },
            {
                id: '3',
                name: 'Regional Medical Center — Dermatology',
                address: '789 Hospital Road',
                latitude: parseFloat(lat) + 0.025,
                longitude: parseFloat(lng) - 0.01,
                phone: '+1-555-0300',
                specialties: ['dermatology', 'general medicine', 'allergy'],
                distance: '3.4 km',
                rating: 4.3,
            },
            {
                id: '4',
                name: 'Advanced Skin Health Center',
                address: '321 Wellness Lane',
                latitude: parseFloat(lat) - 0.005,
                longitude: parseFloat(lng) - 0.018,
                phone: '+1-555-0400',
                specialties: ['Dermatology', 'Phototherapy', 'Eczema Treatment'],
                distance: '1.8 km',
                rating: 4.8,
            },
        ];

        return successResponse(res, 200, 'Nearby facilities fetched', {
            facilities: sampleFacilities,
            center: { lat: parseFloat(lat), lng: parseFloat(lng) },
            radiusKm: parseFloat(radius),
        });
    } catch (err) {
        next(err);
    }
};
