import api from './api.js';

export const getNearbyFacilities = async (lat, lng, radius = 10) => {
    const { data } = await api.get(`/locations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    return data;
};

export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => reject(new Error('Unable to retrieve location: ' + err.message)),
            { timeout: 10000, enableHighAccuracy: false }
        );
    });
};
