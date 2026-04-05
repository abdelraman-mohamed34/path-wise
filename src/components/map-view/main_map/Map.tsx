// src/components/map-view/main_map/Map.tsx
"use client";
import { useMemo, Suspense } from "react";
import { MapProvider } from "react-map-gl/maplibre";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import maplibregl from 'maplibre-gl';

import Sidebar from "../side_bar/Sidebar";
import Btns from "../Btns";
import dynamic from "next/dynamic";

const TripInfo = dynamic(() => import("./TripInfo"), { ssr: false })
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false })


if (typeof window !== "undefined" && maplibregl.getRTLTextPluginStatus() === 'unavailable') {
    maplibregl.setRTLTextPlugin('https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js', true);
}

export default function Map() {

    const mode = useSelector((state: RootState) => state.theme.mode);
    const { coordinates, status } = useSelector((state: RootState) => state.trip);
    const map_key = process.env.NEXT_PUBLIC_MAP_KEY;

    const mapStyle = useMemo(() => (
        mode === 'dark'
            ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${map_key}`
            : `https://api.maptiler.com/maps/streets-v2/style.json?key=${map_key}`
    ), [mode, map_key]);

    const showBar = status === 'loading' || coordinates.length > 0; // true || false

    return (
        <main className="relative h-[100dvh] w-full overflow-hidden bg-background">
            <MapProvider>
                <div className="absolute inset-0 z-0">
                    <Suspense fallback={<div className="h-full w-full bg-muted animate-pulse" />}>
                        <MapComponent mapStyle={mapStyle} />
                    </Suspense>
                </div>
                <div className="relative z-10 pointer-events-none h-full w-full">
                    <Suspense>
                        <Sidebar />
                    </Suspense>
                    <Btns />
                    {showBar && (
                        <div className="md:flex hidden absolute bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
                            <TripInfo className="bg-card border border-border rounded-md text-xs font-bold text-foreground transition-all shadow-md px-5 py-3" />
                        </div>
                    )}
                </div>
            </MapProvider>
        </main>
    );
}