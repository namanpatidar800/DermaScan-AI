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
            className={`w-full text-left bg-skinova-white p-5 rounded-xl border transition-all block shadow-sm ${isSelected ? 'border-skinova-coral bg-skinova-bg ring-1 ring-skinova-olive/20' : 'border-skinova-olive/20 hover:border-skinova-olive/50 hover:shadow-md'}`}
        >
            <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors shadow-sm ${isSelected ? 'bg-skinova-coral text-white' : 'bg-skinova-bg text-skinova-dark border border-skinova-olive/20'}`}>
                    {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-skinova-dark text-sm leading-tight mb-1 truncate">{facility.name}</h4>
                    <span className="inline-block text-[10px] font-bold tracking-widest text-skinova-olive uppercase mb-2">
                        {facility.category}
                    </span>

                    <div className="flex items-start gap-1.5 text-xs text-skinova-dark mb-2 font-medium">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-skinova-coral" />
                        <span className="line-clamp-2">{facility.address}</span>
                    </div>

                    <span className="text-[10px] text-skinova-dark font-bold bg-skinova-bg px-2 py-0.5 rounded border border-skinova-olive/20 inline-block mb-3 uppercase tracking-wider">
                        {facility.distance}
                    </span>

                    <div className="flex flex-wrap gap-2 mt-1 border-t border-skinova-olive/10 pt-3">
                        <span
                            onClick={handleDirections}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-skinova-white hover:bg-skinova-bg text-skinova-dark rounded-lg text-xs font-semibold transition-colors border border-skinova-olive/20 shadow-sm"
                        >
                            <Navigation className="w-3 h-3 text-skinova-coral" /> Directions
                        </span>

                        {facility.phone && (
                            <a
                                href={`tel:${facility.phone}`}
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-skinova-white hover:bg-skinova-bg text-skinova-dark rounded-lg text-xs font-semibold transition-colors border border-skinova-olive/20 shadow-sm"
                            >
                                <Phone className="w-3 h-3 text-skinova-coral" /> Call
                            </a>
                        )}

                        <a
                            href={facility.website ? facility.website : `https://www.google.com/search?q=${encodeURIComponent(facility.name + " " + facility.address + " Official Website Book Appointment")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-skinova-coral hover:bg-skinova-coral-dark text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                        >
                            <ExternalLink className="w-3 h-3" /> Book
                        </a>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default FacilityCard;
