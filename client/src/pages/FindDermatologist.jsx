import { useState, useEffect } from 'react';
import { Search, MapPin, AlertTriangle, Compass, SlidersHorizontal, Loader2 } from 'lucide-react';
import MapView from '../components/MapView.jsx';
import FacilityCard from '../components/FacilityCard.jsx';
import { getUserLocation, geocodeLocation, searchNearbyFacilities } from '../services/locationService.js';

const FindDermatologist = () => {
    const [baseLocation, setBaseLocation] = useState(null); // The center of search (user or manual)
    const [userLocation, setUserLocation] = useState(null); // Pure user location for directions
    const [facilities, setFacilities] = useState([]);

    // UI State
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [loadingFacilities, setLoadingFacilities] = useState(false);
    const [error, setError] = useState('');
    const [manualQuery, setManualQuery] = useState('');
    const [radius, setRadius] = useState(5); // In km
    const [selectedFacilityId, setSelectedFacilityId] = useState(null);
    const [hasAttemptedAutoLocation, setHasAttemptedAutoLocation] = useState(false);

    // Initial load: Request location
    useEffect(() => {
        handleUseMyLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // When baseLocation or radius changes, fetch facilities
    useEffect(() => {
        if (!baseLocation) return;
        const fetchFacilities = async () => {
            setLoadingFacilities(true);
            try {
                const results = await searchNearbyFacilities(baseLocation.lat, baseLocation.lng, radius);
                setFacilities(results);
                setSelectedFacilityId(null);
            } catch (err) {
                setError(err.message || 'Failed to search nearby facilities.');
            } finally {
                setLoadingFacilities(false);
            }
        };
        fetchFacilities();
    }, [baseLocation, radius]);

    const handleUseMyLocation = async () => {
        setLoadingLocation(true);
        setError('');
        setManualQuery('');
        try {
            const loc = await getUserLocation();
            setUserLocation(loc); // Save for directions calculation
            setBaseLocation(loc);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingLocation(false);
            setHasAttemptedAutoLocation(true);
        }
    };

    const handleManualSearch = async (e) => {
        e.preventDefault();
        if (!manualQuery.trim()) return;

        setLoadingLocation(true);
        setError('');
        try {
            const loc = await geocodeLocation(manualQuery);
            setBaseLocation(loc);
        } catch (err) {
            setError(err.message || 'Could not find that location.');
        } finally {
            setLoadingLocation(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Find a Dermatologist</h1>
                <p className="text-surface-200 text-sm max-w-2xl">
                    Find nearby dermatologists and healthcare facilities based on your location.
                    Search manually if location access is unavailable.
                </p>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm mb-6">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <strong>Attention:</strong> {error}
                    </div>
                </div>
            )}

            {/* Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">

                {/* Search Bar */}
                <form onSubmit={handleManualSearch} className="md:col-span-5 relative flex items-center">
                    <Search className="w-4 h-4 text-surface-200 absolute left-4" />
                    <input
                        type="text"
                        placeholder="Search city, area or PIN code"
                        value={manualQuery}
                        onChange={e => setManualQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loadingLocation || !manualQuery.trim()}
                        className="absolute right-2 px-3 py-1.5 bg-primary-500 hover:bg-primary-400 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors"
                    >
                        Search
                    </button>
                </form>

                {/* My Location Btn */}
                <div className="md:col-span-3 flex items-center">
                    <button
                        onClick={handleUseMyLocation}
                        disabled={loadingLocation}
                        className="w-full h-full min-h-[46px] flex items-center justify-center gap-2 px-4 bg-surface-800 hover:bg-surface-700 border border-white/10 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {loadingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4 text-primary-400" />}
                        Use My Location
                    </button>
                </div>

                {/* Radius Select */}
                <div className="md:col-span-4 flex items-center gap-3">
                    <SlidersHorizontal className="w-5 h-5 text-surface-200 hidden lg:block shrink-0" />
                    <select
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="w-full h-full min-h-[46px] px-4 bg-surface-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors appearance-none cursor-pointer"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
                    >
                        <option value={5}>Search within 5 km</option>
                        <option value={10}>Search within 10 km</option>
                        <option value={25}>Search within 25 km</option>
                    </select>
                </div>
            </div>

            {/* Main Content Area */}
            {baseLocation ? (
                <div className="grid lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">

                    {/* Facility List (Left col on desktop) */}
                    <div className="lg:col-span-1 flex flex-col h-full bg-surface-900 border border-white/10 rounded-2xl overflow-hidden order-2 lg:order-1 max-h-[500px] lg:max-h-full">
                        <div className="p-4 border-b border-white/5 bg-surface-800/50">
                            <h2 className="font-semibold text-white text-sm">Nearby Healthcare Facilities</h2>
                            <p className="text-xs text-surface-200 mt-0.5">Showing {facilities.length} results</p>
                        </div>

                        <div className="flex-1 overflow-y-auto w-full p-4 space-y-3 scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent">
                            {loadingFacilities ? (
                                <div className="flex flex-col items-center justify-center py-12 text-surface-200">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary-400 mb-4" />
                                    <span className="text-sm">Searching facilities...</span>
                                </div>
                            ) : facilities.length === 0 ? (
                                <div className="text-center py-12 px-4">
                                    <div className="w-12 h-12 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-3">
                                        <Search className="w-6 h-6 text-surface-200" />
                                    </div>
                                    <h3 className="text-white font-medium mb-1">No facilities found.</h3>
                                    <p className="text-surface-200 text-xs">Try expanding your search radius or searching another area.</p>
                                </div>
                            ) : (
                                facilities.map((fac, idx) => (
                                    <FacilityCard
                                        key={fac.id}
                                        facility={fac}
                                        index={idx}
                                        isSelected={selectedFacilityId === fac.id}
                                        userLocation={userLocation}
                                        onClick={() => setSelectedFacilityId(fac.id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Mapbox Map (Right col on desktop) */}
                    <div className="lg:col-span-2 h-[400px] lg:h-full relative rounded-2xl overflow-hidden order-1 lg:order-2 border border-white/10 shadow-lg">
                        <MapView
                            location={baseLocation}
                            facilities={facilities}
                            selectedFacilityId={selectedFacilityId}
                            onMarkerClick={(id) => setSelectedFacilityId(id)}
                        />

                        {/* Map Overlay Loading State */}
                        {loadingLocation && (
                            <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
                                <span className="text-white font-medium text-sm drop-shadow-md">Finding map location...</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Empty state when no base location exists */
                <div className="border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-900/30">
                    <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mb-4">
                        <MapPin className="w-8 h-8 text-primary-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Location Not Selected</h2>
                    {hasAttemptedAutoLocation && error ? (
                        <p className="text-surface-200 text-sm max-w-md">
                            We couldn't automatically detect your location. Please enter a city or postal code in the search bar above to find nearby facilities.
                        </p>
                    ) : (
                        <p className="text-surface-200 text-sm max-w-md">
                            Allow location access or search manually above to view healthcare facilities on the map.
                        </p>
                    )}
                </div>
            )}

            {/* Safety Disclaimer */}
            <div className="mt-8 text-center text-xs text-surface-200 border-t border-white/10 pt-6">
                <strong>Medical Disclaimer:</strong> This feature uses third-party mapping to show nearby healthcare facilities and is for informational purposes only. DermaScan AI does not guarantee the accuracy of listed locations, nor does it recommend any specific facility. Please verify all information directly with the medical provider.
            </div>
        </div>
    );
};

export default FindDermatologist;
