'use client'
import { LocateFixed, MoonIcon, SunIcon } from 'lucide-react'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { toggleTheme } from "@/store/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/app/store';
import { useMap } from 'react-map-gl/maplibre';
import { useRouter } from 'next/navigation';
import { useRecentSearches } from '@/hooks/useAddToRecent';

const Btns = memo(function Btns() {
    const mode = useSelector((m: RootState) => m.theme.mode);
    const [mounted, setMounted] = useState(false);

    const dispatch = useDispatch();
    const { "main-map": map } = useMap();

    useEffect(() => {
        setMounted(true);
    }, []);

    const router = useRouter()
    const { addToRecent } = useRecentSearches()
    const COORDS_EXPIRY_MS = 24 * 60 * 60 * 1000

    const handleGoToUserLocation = useCallback(() => {
        if (!navigator.geolocation) return;

        const saved = localStorage.getItem('userCoords');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const isExpired = Date.now() - parsed.timestamp > COORDS_EXPIRY_MS;

                if (!isExpired) {
                    router.push(`?lat=${parsed.lat}&lng=${parsed.lng}&m=true`);
                    addToRecent({ lat: parsed.lat, lng: parsed.lng });
                    return;
                }
            } catch (e) {
                localStorage.removeItem('userCoords');
            }
        }

        navigator.geolocation.getCurrentPosition(
            (p) => {
                const coords = {
                    lat: p.coords.latitude,
                    lng: p.coords.longitude,
                    timestamp: Date.now()
                };
                localStorage.setItem('userCoords', JSON.stringify(coords));
                router.push(`?lat=${coords.lat}&lng=${coords.lng}&m=true`);
                addToRecent({ lat: coords.lat, lng: coords.lng });
            },
            (error) => {
                const msg = error.code === 1 ? 'Location access denied' : 'Could not get location';
                console.error(msg);
            }
        );
    }, [map, router, addToRecent]);

    return (
        <div className="bg-card/98 absolute right-1 top-1 md:right-8 md:top-8 z-20 flex flex-col gap-0 pointer-events-auto rounded-[8px] overflow-hidden">
            {/* theme-btn */}
            <button
                type='button'
                onClick={() => dispatch(toggleTheme())}
                className="size-12 md:size-14 border-b border-border flex items-center justify-center active:scale-90 transition-all"
            >
                {!mounted ? (
                    <div className="size-6 animate-pulse bg-muted rounded-full" />
                ) : mode === 'dark' ? (
                    <SunIcon className="size-6 text-amber-400" />
                ) : (
                    <MoonIcon className="size-6 text-primary" />
                )}
            </button>

            {/* location-btn */}
            <button
                type='button'
                onClick={handleGoToUserLocation}
                className="size-12 md:size-14 flex items-center justify-center hover:bg-secondary active:scale-90 transition-all text-foreground/90"
            >
                <LocateFixed />
            </button>
        </div>
    )
})

export default Btns;