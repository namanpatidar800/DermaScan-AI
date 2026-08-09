import { useEffect, useRef, useState } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = ({ location, facilities, selectedFacilityId, onMarkerClick }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef({}); // Store marker instances by facility ID
    const [mapLoaded, setMapLoaded] = useState(false);

    // Initialize Map
    useEffect(() => {
        if (!location || !MAPBOX_TOKEN) return;

        const initMap = async () => {
            if (mapRef.current) return; // Prevent double init

            try {
                const mapboxgl = (await import('mapbox-gl')).default;
                mapboxgl.accessToken = MAPBOX_TOKEN;

                const map = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/satellite-streets-v12',
                    center: [location.lng, location.lat],
                    zoom: 13,
                });

                map.addControl(new mapboxgl.NavigationControl(), 'top-right');

                // User marker (blue dot)
                new mapboxgl.Marker({ color: '#3b82f6' })
                    .setLngLat([location.lng, location.lat])
                    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<div style="color:#111;padding:4px;font-weight:600;">Your Location</div>'))
                    .addTo(map);

                mapRef.current = map;

                map.on('load', () => setMapLoaded(true));
            } catch (err) {
                console.error("Map initialization failed", err);
            }
        };

        initMap();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markersRef.current = {};
            }
        };
    }, [location]); // Only re-init if completely new base location is passed and map was destroyed

    // Handle Facilities & Markers updates
    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return;

        const mapboxgl = window.mapboxgl; // Should be loaded by now via dynamic import
        if (!mapboxgl) return;

        const map = mapRef.current;

        // Clear old facility markers
        Object.values(markersRef.current).forEach(marker => marker.remove());
        markersRef.current = {};

        // Add new facility markers
        facilities.forEach((fac, i) => {
            const el = document.createElement('div');
            // Selected ones glow/stand out more
            const isSelected = selectedFacilityId === fac.id;
            el.className = `w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-lg transition-transform ${isSelected ? 'bg-primary-400 scale-110 z-10' : 'bg-primary-600 hover:scale-105'}`;
            el.textContent = i + 1;

            el.addEventListener('click', () => {
                onMarkerClick(fac.id);
            });

            const popupHtml = `
                <div style="color:#fff;background:#1e2535;padding:12px;border-radius:8px;font-size:13px;min-width:150px;border:1px solid rgba(255,255,255,0.1)">
                  <strong style="display:block;margin-bottom:4px">${fac.name}</strong>
                  <span style="color:#6dd1c3;font-size:11px;font-weight:600">${fac.distance}</span><br/>
                  <span style="color:#a1a1aa;font-size:11px">${fac.category}</span>
                </div>
            `;

            const marker = new mapboxgl.Marker(el)
                .setLngLat([fac.lng, fac.lat])
                .setPopup(new mapboxgl.Popup({ offset: 20, closeButton: false }).setHTML(popupHtml))
                .addTo(map);

            markersRef.current[fac.id] = marker;

            if (isSelected) {
                marker.togglePopup();
            }
        });

    }, [facilities, selectedFacilityId, mapLoaded, onMarkerClick]);

    // Handle selected facility flyTo
    useEffect(() => {
        if (!mapLoaded || !mapRef.current || !selectedFacilityId || !markersRef.current[selectedFacilityId]) return;

        const fac = facilities.find(f => f.id === selectedFacilityId);
        if (fac) {
            mapRef.current.flyTo({
                center: [fac.lng, fac.lat],
                zoom: 15,
                duration: 1200
            });

            // Re-render markers to update the CSS classes (in previous effect) usually handles the popups,
            // but just in case, ensure popup opens:
            const marker = markersRef.current[selectedFacilityId];
            if (marker && !marker.getPopup().isOpen()) {
                marker.togglePopup();
            }
        }
    }, [selectedFacilityId, mapLoaded, facilities]);

    if (!MAPBOX_TOKEN) {
        return (
            <div className="flex items-center justify-center h-full bg-surface-900 border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-surface-200">Map service is not configured (VITE_MAPBOX_TOKEN is missing).</p>
            </div>
        );
    }

    return (
        <div ref={mapContainer} className="w-full h-full rounded-2xl overflow-hidden" />
    );
};

export default MapView;
