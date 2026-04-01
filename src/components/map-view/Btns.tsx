'use client'
import { MapPinIcon, MoonIcon, SunIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toggleTheme } from "@/store/theme/changeTheme";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/app/store';
import { useMap } from 'react-map-gl/maplibre';

function Btns() {
    const mode = useSelector((m: RootState) => m.theme.mode);
    const dispatch = useDispatch();
    const [mounted, setMounted] = useState(false);

    const { current: map } = useMap();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLocationClick = () => {
        if (!map) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { longitude, latitude } = position.coords;

                map.flyTo({
                    center: [longitude, latitude],
                    zoom: 15,
                    duration: 2500,
                    essential: true
                });
            },
            (error) => {
                console.error("Error getting location:", error);
                map.flyTo({ center: [31.2357, 30.0444], zoom: 12 });
            }
        );
    };

    return (
        <div className="bg-card/90 absolute right-4 top-4 md:right-8 md:top-8 z-20 flex flex-col gap-0 pointer-events-auto rounded-[0.5rem] overflow-hidden">
            {/* theme-btn */}
            <button
                onClick={() => dispatch(toggleTheme())}
                className="size-12 md:size-14 border-b border-border flex items-center justify-center active:scale-90 transition-all"
            >
                {!mounted ? (
                    <div className="size-6 animate-pulse bg-muted rounded-full" />
                ) : mode === 'dark' ? (
                    <SunIcon className="size-6 text-amber-400" />
                ) : (
                    <MoonIcon className="size-6 text-blue-600" /> 
                )}
            </button>

            {/* location-btn */}
            <button
                onClick={handleLocationClick}
                className="size-12 md:size-14 flex items-center justify-center hover:bg-secondary active:scale-90 transition-all text-foreground"
            >
                <MapPinIcon className="size-6" />
            </button>
        </div>
    )
}

export default Btns;