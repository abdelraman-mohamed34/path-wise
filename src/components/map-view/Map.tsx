"use client";
import { useState } from "react";
import MapGL, { MapProvider } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Sidebar from "./Sidebar";
import Btns from "./Btns";
import maplibregl from 'maplibre-gl';

if (typeof window !== "undefined" && maplibregl.getRTLTextPluginStatus() === 'unavailable') {
    maplibregl.setRTLTextPlugin(
        'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
        true
    );
}

export default function Map() {
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
                        onMove={e => setViewState(e.viewState)}
                        mapStyle={mapStyle}
                        style={{ width: "100%", height: "100%" }}
                    >
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