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
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 bg-skinova-bg">
            {/* Header */}
            <div className="mb-6 md:mb-8 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-light text-skinova-dark mb-3 tracking-tight">Find Care Nearby</h1>
                <p className="text-skinova-olive text-sm max-w-2xl mx-auto md:mx-0">
                    Find nearby dermatologists and healthcare facilities based on your location.
                    Search manually if location access is unavailable.
                </p>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm font-medium mb-6 shadow-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-yellow-600" />
                    <div>
                        <strong>Attention:</strong> {error}
                    </div>
                </div>
            )}

            {/* Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">

                {/* Search Bar */}
                <form onSubmit={handleManualSearch} className="md:col-span-5 relative flex items-center">
                    <Search className="w-4 h-4 text-surface-400 absolute left-4" />
                    <input
                        type="text"
                        placeholder="Search city, area or PIN code"
                        value={manualQuery}
                        onChange={e => setManualQuery(e.target.value)}
                        className="w-full pl-11 pr-24 py-3 bg-white border border-surface-300 rounded-xl text-surface-900 text-sm font-medium placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-sm"
                    />
                    <button
                        type="submit"
                        disabled={loadingLocation || !manualQuery.trim()}
                        className="absolute right-2 px-4 py-1.5 bg-skinova-dark hover:bg-skinova-olive text-white rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors shadow-sm"
                    >
                        Search
                    </button>
                </form>

                {/* My Location Btn */}
                <div className="md:col-span-3 flex items-center">
                    <button
                        onClick={handleUseMyLocation}
                        disabled={loadingLocation}
                        className="w-full h-full min-h-[48px] flex items-center justify-center gap-2 px-4 bg-skinova-white hover:bg-skinova-bg border border-skinova-olive/30 rounded-xl text-skinova-dark text-sm font-bold transition-all disabled:opacity-50 shadow-sm hover:shadow"
                    >
                        {loadingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4 text-skinova-coral" />}
                        Use My Location
                    </button>
                </div>

                {/* Radius Select */}
                <div className="md:col-span-4 flex items-center gap-3">
                    <SlidersHorizontal className="w-5 h-5 text-surface-400 hidden lg:block shrink-0" />
                    <select
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="w-full h-full min-h-[48px] px-4 bg-white border border-surface-300 rounded-xl text-surface-700 font-bold text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer shadow-sm"
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
                <div className="grid lg:grid-cols-3 gap-6 h-auto lg:h-[650px]">

                    {/* Facility List (Left col on desktop) */}
                    <div className="lg:col-span-1 flex flex-col h-full bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden order-2 lg:order-1 max-h-[500px] lg:max-h-full shadow-sm">
                        <div className="p-5 border-b border-surface-200 bg-white">
                            <h2 className="font-bold text-surface-900 text-sm uppercase tracking-wider">Nearby Providers</h2>
                            <p className="text-xs font-medium text-surface-500 mt-1">Showing {facilities.length} results</p>
                        </div>

                        <div className="flex-1 overflow-y-auto w-full p-4 space-y-4 scrollbar-thin scrollbar-thumb-skinova-olive/20 scrollbar-track-transparent">
                            {loadingFacilities ? (
                                <div className="flex flex-col items-center justify-center py-12 text-skinova-olive">
                                    <Loader2 className="w-8 h-8 animate-spin text-skinova-coral mb-4" />
                                    <span className="text-sm font-medium">Searching facilities...</span>
                                </div>
                            ) : facilities.length === 0 ? (
                                <div className="text-center py-12 px-4 bg-white rounded-xl border border-surface-200">
                                    <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-3">
                                        <Search className="w-6 h-6 text-surface-400" />
                                    </div>
                                    <h3 className="text-surface-900 font-bold mb-1">No facilities found.</h3>
                                    <p className="text-surface-500 text-xs leading-relaxed">Try expanding your search radius or modifying your location.</p>
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
                    <div className="lg:col-span-2 h-[400px] lg:h-full relative rounded-2xl overflow-hidden order-1 lg:order-2 border border-surface-200 shadow-md">
                        <MapView
                            location={baseLocation}
                            facilities={facilities}
                            selectedFacilityId={selectedFacilityId}
                            onMarkerClick={(id) => setSelectedFacilityId(id)}
                        />

                        {/* Map Overlay Loading State */}
                        {loadingLocation && (
                            <div className="absolute inset-0 bg-skinova-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                <Loader2 className="w-10 h-10 text-skinova-coral animate-spin mb-3 shadow-sm rounded-full bg-white" />
                                <span className="text-skinova-dark font-bold text-sm">Finding map location...</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Empty state when no base location exists */
                <div className="border border-skinova-olive/20 border-dashed rounded-3xl flex flex-col items-center justify-center py-24 px-4 text-center bg-skinova-white/50">
                    <div className="w-16 h-16 rounded-full bg-skinova-bg border border-skinova-olive/10 shadow-sm flex items-center justify-center mb-6">
                        <MapPin className="w-8 h-8 text-skinova-coral" />
                    </div>
                    <h2 className="text-xl font-bold text-surface-900 mb-3">Location Required</h2>
                    {hasAttemptedAutoLocation && error ? (
                        <p className="text-surface-600 text-sm max-w-md leading-relaxed">
                            We couldn't automatically detect your location. Please enter a city or postal code in the search bar above to begin.
                        </p>
                    ) : (
                        <p className="text-surface-600 text-sm max-w-md leading-relaxed">
                            Allow location access or search manually above to view healthcare providers on the interactive map.
                        </p>
                    )}
                </div>
            )}

            {/* Safety Disclaimer */}
            <div className="mt-10 text-center text-xs text-surface-500 border-t border-surface-200 pt-6">
                <strong className="text-surface-700">Medical Disclaimer:</strong> This feature uses third-party mapping to show nearby healthcare facilities and is for informational purposes only. SKINOVA does not guarantee the accuracy of listed locations, nor does it recommend any specific facility. Please verify all information directly with the medical provider.
            </div>
        </div>
    );
};

export default FindDermatologist;
