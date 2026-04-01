"use client";
import { useState } from "react";
import MapGL, { MapProvider } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Sidebar from "./Sidebar";
import Btns from "./Btns";
import maplibregl from 'maplibre-gl';
import { Marker } from "react-map-gl/maplibre";

if (typeof window !== "undefined" && maplibregl.getRTLTextPluginStatus() === 'unavailable') {
    maplibregl.setRTLTextPlugin(
        'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
        true
    );
}
export default function Map() {
    const { nowViewLocation, thisLocationIsMine } = useSelector((p: RootState) => p.location)
    const mode = useSelector((state: RootState) => state.theme.mode);
    const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

    const [viewState, setViewState] = useState({
        longitude: 31.2357,
        latitude: 30.0444,
        zoom: 12
    });

    // theme of map
    const mapStyle = mode === 'dark'
        ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`
        : `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

    return (
        <main className="relative h-[100dvh] w-full overflow-hidden bg-background">

            <MapProvider>
                {/* layer-1: the map */}
                <div className="absolute inset-0 z-0">
                    <MapGL
                        {...viewState}
                        id="main-map"
                        onMove={e => setViewState(e.viewState)}
                        mapStyle={mapStyle}
                        style={{ width: "100%", height: "100%" }}
                    >
                        {/* user pin */}
                        {nowViewLocation && (
                            <Marker
                                longitude={nowViewLocation.lng}
                                latitude={nowViewLocation.lat}
                                anchor="bottom"
                            >
                                {thisLocationIsMine === true ? (
                                    <div className="relative flex items-center justify-center">
                                        <span className="absolute size-9 bg-blue-500/40 rounded-full animate-ping" />
                                        <span className="size-5 bg-blue-600 border-[3px] border-white rounded-full shadow-md shadow-black/20" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center group">
                                        <div className="relative flex items-center justify-center size-8 bg-destructive rounded-full shadow-lg border-2 border-white transform group-hover:scale-110 transition-transform duration-200">
                                            <div className="size-2 bg-white rounded-full" />
                                        </div>
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-destructive -mt-[2px]" />
                                        <div className="size-2 bg-black/20 rounded-full blur-[2px] mt-1" />
                                    </div>
                                )}
                            </Marker>
                        )}
                    </MapGL>
                </div>

                {/* layer-2: UI Elements */}
                <div className="relative z-10 pointer-events-none h-full w-full">
                    <Sidebar />
                    <Btns />
                </div>

            </MapProvider>
        </main>
    );
}