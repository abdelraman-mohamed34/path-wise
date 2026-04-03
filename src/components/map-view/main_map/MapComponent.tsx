"use client";
import MapGL, { Marker, useMap } from "react-map-gl/maplibre";
import React, { memo, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { getLocationDetails } from "@/store/details/api/fetchLocationDetails";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecentSearches } from "@/hooks/useAddToRecent";

interface MapComponentProps {
    viewState: any;
    onMove: (e: any) => void;
    mapStyle: string;
}

const MapComponent = memo(({ viewState, onMove, mapStyle }: MapComponentProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { "main-map": map } = useMap();
    const searchParams = useSearchParams();

    const URLLat = searchParams.get('lat');
    const URLLng = searchParams.get('lng');
    const isLocationMine = searchParams.get('m');

    const lat = URLLat ? parseFloat(URLLat) : null;
    const lng = URLLng ? parseFloat(URLLng) : null;
    const { addToRecent } = useRecentSearches()

    useEffect(() => {
        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
            const coords = { lat, lng };
            dispatch(getLocationDetails(coords));

            // Fly to location
            if (map) {
                map.flyTo({
                    center: [lng, lat],
                    zoom: 16,
                    duration: 2000,
                    essential: true,
                    padding: { bottom: 200 }
                });
                addToRecent({ lat: lat, lng: lng })
            }
        }
    }, [lat, lng, dispatch]);

    const handleMapClick = useCallback((e: any) => {
        const { lng, lat } = e.lngLat;
        router.push(`?lat=${lat}&lng=${lng}`, { scroll: false });
    }, [router]);

    return (
        <MapGL
            {...viewState}
            id="main-map"
            onMove={onMove}
            onClick={handleMapClick}
            mapStyle={mapStyle}
            style={{ width: "100%", height: "100%" }}
        >
            {lat && lng && (
                <Marker latitude={lat} longitude={lng} anchor="bottom">
                    {isLocationMine === 'true' ? (
                        <div className="relative flex items-center justify-center">
                            <span className="absolute size-10 bg-blue-500/30 rounded-full animate-ping" />
                            <span className="size-5 bg-blue-600 border-[3px] border-white rounded-full shadow-lg" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center group cursor-pointer">
                            <div className="relative flex items-center justify-center size-9 bg-red-600 rounded-full shadow-xl border-2 border-white group-hover:scale-110 transition-transform duration-300">
                                <div className="size-2.5 bg-white rounded-full animate-pulse" />
                            </div>
                            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[10px] border-t-destructive -mt-[2px] shadow-sm" />
                        </div>
                    )}
                </Marker>
            )}
        </MapGL>
    );
});

MapComponent.displayName = "MapComponent";
export default MapComponent;