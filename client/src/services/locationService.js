const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Request location from browser
export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser.'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => {
                if (err.code === 1) reject(new Error('Location permission was denied. Search for your area manually.'));
                else if (err.code === 3) reject(new Error('Location request timed out. Please try again.'));
                else reject(new Error('We couldn\'t determine your location.'));
            },
            { timeout: 10000, enableHighAccuracy: false }
        );
    });
};

// Geocode manual text (e.g. "Seattle, WA" to coordinates)
export const geocodeLocation = async (query) => {
    if (!MAPBOX_TOKEN) throw new Error('Map service is not configured.');
    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=1`);
    const data = await res.json();
    if (!data.features || data.features.length === 0) throw new Error('Location not found.');
    const [lng, lat] = data.features[0].center;
    return { lat, lng, displayName: data.features[0].place_name };
};

// Find nearby locations based on coordinates
export const searchNearbyFacilities = async (lat, lng, radiusKm = 5) => {
    if (!MAPBOX_TOKEN) throw new Error('Map service is not configured.');

    // Widening the search query to capture major hospitals or direct clinics
    const query = encodeURIComponent('dermatologist, hospital, clinic, medical');

    // the Geocoding API uses proximity for POIs.
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=${lng},${lat}&types=poi&limit=25&access_token=${MAPBOX_TOKEN}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.features) return [];

    return data.features.map(f => {
        const distanceMeters = getDistance(lat, lng, f.center[1], f.center[0]);
        // Filter out things that are beyond radius (Mapbox proximity just sorts, it doesn't strictly filter radius)
        if (distanceMeters > radiusKm * 1000) return null;

        let distanceStr = '';
        if (distanceMeters < 1000) distanceStr = `${Math.round(distanceMeters)} m away`;
        else distanceStr = `${(distanceMeters / 1000).toFixed(1)} km away`;

        return {
            id: f.id,
            name: f.text,
            address: f.properties.address ? `${f.properties.address}` : f.place_name.split(',').slice(1).join(',').trim(),
            category: f.properties.category || 'Healthcare Facility',
            phone: f.properties.tel || null,
            website: null,
            lat: f.center[1],
            lng: f.center[0],
            distance: distanceStr,
            distanceMeters
        };
    }).filter(Boolean).sort((a, b) => a.distanceMeters - b.distanceMeters);
};

// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const p1 = lat1 * Math.PI / 180;
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
        Math.cos(p1) * Math.cos(p2) *
        Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
