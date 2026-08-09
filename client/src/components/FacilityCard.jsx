import { MapPin, Phone, ExternalLink, Navigation } from 'lucide-react';

const FacilityCard = ({ facility, index, isSelected, onClick, userLocation }) => {

    // Construct directions URL using Google Maps as universal fallback or Mapbox directions (but generic is safer)
    const handleDirections = (e) => {
        e.stopPropagation();
        // If we have user location, do route. Else just point safely to destination.
        let url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
        if (userLocation) {
            url += `&origin=${userLocation.lat},${userLocation.lng}`;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <button
            onClick={onClick}
            className={`w-full text-left bg-white p-5 rounded-xl border transition-all block shadow-sm ${isSelected ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-100' : 'border-surface-200 hover:border-primary-300 hover:shadow-md'}`}
        >
            <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors shadow-sm ${isSelected ? 'bg-primary-500 text-white' : 'bg-surface-100 text-surface-700 border border-surface-200'}`}>
                    {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-surface-900 text-sm leading-tight mb-1 truncate">{facility.name}</h4>
                    <span className="inline-block text-[10px] font-bold tracking-widest text-primary-600 uppercase mb-2">
                        {facility.category}
                    </span>

                    <div className="flex items-start gap-1.5 text-xs text-surface-600 mb-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary-500" />
                        <span className="line-clamp-2">{facility.address}</span>
                    </div>

                    <span className="text-xs text-secondary-600 font-bold bg-secondary-50 px-2 py-0.5 rounded border border-secondary-200 inline-block mb-3">
                        {facility.distance}
                    </span>

                    <div className="flex flex-wrap gap-2 mt-1 border-t border-surface-200 pt-3">
                        <span
                            onClick={handleDirections}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-surface-50 text-surface-800 rounded-lg text-xs font-semibold transition-colors border border-surface-200 shadow-sm"
                        >
                            <Navigation className="w-3 h-3 text-primary-500" /> Directions
                        </span>

                        {facility.phone && (
                            <a
                                href={`tel:${facility.phone}`}
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-surface-50 text-surface-800 rounded-lg text-xs font-semibold transition-colors border border-surface-200 shadow-sm"
                            >
                                <Phone className="w-3 h-3 text-primary-500" /> Call
                            </a>
                        )}

                        {facility.website && (
                            <a
                                href={facility.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-surface-50 text-surface-800 rounded-lg text-xs font-semibold transition-colors border border-surface-200 shadow-sm"
                            >
                                <ExternalLink className="w-3 h-3 text-primary-500" /> Book
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
};

export default FacilityCard;
