"use client";
import MapGL, { Marker, useMap } from "react-map-gl/maplibre";
import React, { memo, useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { getLocationDetails } from "@/store/details/api/fetchLocationDetails";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecentSearches } from "@/hooks/useAddToRecent";

interface MapComponentProps {
    mapStyle: string;
}

const MapComponent = memo(({ mapStyle }: MapComponentProps) => {

    const [viewState, setViewState] = useState({
        longitude: 31.2357,
        latitude: 30.0444,
        zoom: 10
    });

    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();

    const router = useRouter();
    const { "main-map": map } = useMap();

    const URLLat = searchParams.get('lat');
    const URLLng = searchParams.get('lng');
    const isLocationMine = searchParams.get('m');

    const latitude = URLLat ? parseFloat(URLLat) : null;
    const longitude = URLLng ? parseFloat(URLLng) : null;
    const { addToRecent } = useRecentSearches()

    // if has URL
    useEffect(() => {
        if (latitude && longitude) {
            const coords = { latitude, longitude };

            const isDifferent =
                Math.abs(viewState.latitude - latitude) > 0.0001 ||
                Math.abs(viewState.longitude - longitude) > 0.0001;

            if (isDifferent) {
                setViewState({ ...coords, zoom: 16 })
                dispatch(getLocationDetails({ lat: latitude, lng: longitude }));
                // Fly to location
                if (map) {
                    map.flyTo({
                        center: [longitude, latitude],
                        zoom: 16,
                        duration: 2000,
                        essential: true,
                        padding: { bottom: 200 }
                    });
                    addToRecent({ lat: latitude, lng: longitude })
                }
            }
        }
    }, [latitude, longitude, dispatch]);


    const handleMove = useCallback((e: any) => {
        setViewState(e.viewState);
    }, []);

    const handleMapClick = useCallback((e: any) => {
        const { lng, lat } = e.lngLat;
        router.push(`?lat=${lat}&lng=${lng}`, { scroll: false });
    }, [router]);

    return (
        <MapGL
            {...viewState}
            id="main-map"
            onMove={handleMove}
            onClick={handleMapClick}
            mapStyle={mapStyle}
            style={{ width: "100%", height: "100%" }}
        >
            {latitude && longitude && (
                <Marker latitude={latitude} longitude={longitude} anchor="bottom">
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