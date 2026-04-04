"use client";
import MapGL, { Marker, useMap, Source, Layer } from "react-map-gl/maplibre";
import React, { memo, useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { getLocationDetails } from "@/store/details/api/fetchLocationDetails";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecentSearches } from "@/hooks/useAddToRecent";
import { clearTrip } from "@/store/trip/tripSlice";

interface MapComponentProps {
    mapStyle: string;
}

const MapComponent = memo(({ mapStyle }: MapComponentProps) => {

    const [viewState, setViewState] = useState({
        longitude: 31.2357,
        latitude: 30.0444,
        zoom: 10
    });

    // states
    const [heading, setHeading] = useState<number>(0);

    // variables
    const { coordinates, status, userLocation } = useSelector((state: RootState) => state.trip);
    const dispatch = useDispatch<AppDispatch>();

    const searchParams = useSearchParams();
    const URLLat = searchParams.get('lat');
    const URLLng = searchParams.get('lng');
    const isLocationMine = searchParams.get('m');

    const router = useRouter();
    const { "main-map": map } = useMap();
    const isNavigating = coordinates.length > 0;
    const latitude = URLLat ? parseFloat(URLLat) : null;
    const longitude = URLLng ? parseFloat(URLLng) : null;
    const { addToRecent } = useRecentSearches();

    useEffect(() => {
        if (latitude && longitude) {
            const isDifferent =
                Math.abs(viewState.latitude - latitude) > 0.0001 ||
                Math.abs(viewState.longitude - longitude) > 0.0001;

            if (isDifferent) {
                setViewState({ latitude, longitude, zoom: 16 });
                dispatch(getLocationDetails({ lat: latitude, lng: longitude }));
                if (map) {
                    map.flyTo({
                        center: [longitude, latitude],
                        zoom: 16,
                        duration: 2000,
                        essential: true,
                        padding: { bottom: 200 }
                    });
                    dispatch(clearTrip())
                    addToRecent({ lat: latitude, lng: longitude });
                }
            }
        }
    }, [latitude, longitude, dispatch]);

    useEffect(() => {
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.alpha !== null) setHeading(e.alpha);
        };

        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof (DeviceOrientationEvent as any).requestPermission === 'function'
        ) {
            (DeviceOrientationEvent as any).requestPermission()
                .then((res: string) => {
                    if (res === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                });
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);


    const handleMove = useCallback((e: any) => {
        setViewState(e.viewState);
    }, []);

    const handleMapClick = useCallback((e: any) => {
        const { lng, lat } = e.lngLat;
        router.push(`?lat=${lat}&lng=${lng}`, { scroll: false });
    }, [router]);

    const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> | null =
        coordinates.length > 0
            ? { type: 'Feature', geometry: { type: 'LineString', coordinates }, properties: {} }
            : null;

    return (
        <MapGL
            {...viewState}
            id="main-map"
            onMove={handleMove}
            onClick={handleMapClick}
            mapStyle={mapStyle}
            style={{ width: "100%", height: "100%" }}
        >
            {routeGeoJSON && (
                <Source id="route" type="geojson" data={routeGeoJSON}>
                    <Layer
                        id="route-outline"
                        type="line"
                        layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                        paint={{ 'line-color': '#ffffff', 'line-width': 8, 'line-opacity': 0.8 }}
                    />
                    <Layer
                        id="route-line"
                        type="line"
                        layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                        paint={{
                            'line-color': '#0C79FE',
                            'line-width': 5,
                            'line-opacity': status === 'loading' ? 0.5 : 1,
                        }}
                    />
                </Source>
            )}

            {isNavigating && userLocation && (
                <Marker latitude={userLocation.lat} longitude={userLocation.lng} anchor="center">
                    <div className="relative flex items-center justify-center">
                        <span className="absolute size-10 bg-blue-500/30 rounded-full animate-ping" />
                        <div style={{ transform: `rotate(${heading}deg)`, transition: 'transform 0.3s ease' }}>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="16" r="14" fill="#0C79FE" stroke="white" strokeWidth="3" />
                                <path d="M16 6 L21 22 L16 19 L11 22 Z" fill="white" />
                            </svg>
                        </div>
                        <span className="absolute size-12 bg-blue-500/20 rounded-full animate-ping" />
                    </div>
                </Marker>
            )}

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