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
            className={`w-full text-left glass-card p-5 border transition-all block ${isSelected ? 'border-primary-500/50 bg-primary-500/5' : 'border-white/8 hover:border-primary-500/30'}`}
        >
            <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSelected ? 'bg-primary-400 text-surface-900' : 'bg-primary-600/80 text-white'}`}>
                    {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm leading-tight mb-1 truncate">{facility.name}</h4>
                    <span className="inline-block text-[10px] font-bold tracking-widest text-primary-400/80 uppercase mb-2">
                        {facility.category}
                    </span>

                    <div className="flex items-start gap-1.5 text-xs text-surface-200 mb-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary-400/60" />
                        <span className="line-clamp-2">{facility.address}</span>
                    </div>

                    <span className="text-xs text-primary-400 font-medium inline-block mb-3">
                        {facility.distance}
                    </span>

                    <div className="flex flex-wrap gap-2 mt-1 border-t border-white/5 pt-3">
                        <span
                            onClick={handleDirections}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-800 hover:bg-surface-700 text-white rounded-lg text-xs font-medium transition-colors border border-white/10"
                        >
                            <Navigation className="w-3 h-3 text-primary-400" /> Directions
                        </span>

                        {facility.phone && (
                            <a
                                href={`tel:${facility.phone}`}
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-800 hover:bg-surface-700 text-white rounded-lg text-xs font-medium transition-colors border border-white/10"
                            >
                                <Phone className="w-3 h-3 text-primary-400" /> Call
                            </a>
                        )}

                        {facility.website && (
                            <a
                                href={facility.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-800 hover:bg-surface-700 text-white rounded-lg text-xs font-medium transition-colors border border-white/10"
                            >
                                <ExternalLink className="w-3 h-3 text-primary-400" /> Website
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
};

export default FacilityCard;
