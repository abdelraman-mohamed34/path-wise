"use client";
import { useCallback, useState, useMemo, Suspense } from "react";
import { MapProvider } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import maplibregl from 'maplibre-gl';
import MapComponent from "./MapComponent";
import Sidebar from "../side_bar/Sidebar";
import Btns from "../Btns";

if (typeof window !== "undefined" && maplibregl.getRTLTextPluginStatus() === 'unavailable') {
    maplibregl.setRTLTextPlugin('https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js', true);
}

export default function Map() {
    const mode = useSelector((state: RootState) => state.theme.mode);
    const map_key = process.env.NEXT_PUBLIC_MAP_KEY;

    const [viewState, setViewState] = useState({
        lng: 31.2357,
        lat: 30.0444,
        zoom: 10
    });

    const handleMove = useCallback((e: any) => {
        setViewState(e.viewState);
    }, []);

    const mapStyle = useMemo(() => (
        mode === 'dark'
            ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${map_key}`
            : `https://api.maptiler.com/maps/streets-v2/style.json?key=${map_key}`
    ), [mode, map_key]);



    return (
        <main className="relative h-[100dvh] w-full overflow-hidden bg-background">
            <MapProvider>
                <div className="absolute inset-0 z-0">
                    <Suspense>
                        <MapComponent
                            viewState={viewState}
                            onMove={handleMove}
                            mapStyle={mapStyle}
                        />
                    </Suspense>
                </div>

                <div className="relative z-10 pointer-events-none h-full w-full">
                    <Suspense>
                        <Sidebar />
                    </Suspense>
                    <Btns />
                </div>
            </MapProvider>
        </main>
    );
}