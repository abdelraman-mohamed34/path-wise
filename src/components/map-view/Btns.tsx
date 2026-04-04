'use client'
import { MapPinIcon, MoonIcon, Router, SunIcon } from 'lucide-react'
import React, { memo, useEffect, useState } from 'react'
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

    const handleGoToUserLocation = () => {
        if (!map || !navigator.geolocation) return;
        const savedUserCoords = localStorage.getItem('userCoords');
        if (savedUserCoords) {
            try {
                const { lat, lng }: { lat: number, lng: number } = JSON.parse(savedUserCoords);
                router.push(`?lat=${lat}&lng=${lng}&m=true`);
                addToRecent({ lat: lat, lng: lng })
                return;
            } catch (e) {
                localStorage.removeItem('userCoords');
                console.log(e)
            }
        }

        navigator.geolocation.getCurrentPosition(
            (p) => {
                const lat = p.coords.latitude;
                const lng = p.coords.longitude;
                localStorage.setItem('userCoords', JSON.stringify({ lat, lng }));
                router.push(`?lat=${lat}&lng=${lng}&m=true`);
            },
            (error) => {
                const msg = error.code === 1 ? 'Location access denied' : 'Could not find location';
            }
        );
    };

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
                className="size-12 md:size-14 flex items-center justify-center hover:bg-secondary active:scale-90 transition-all text-foreground"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-icon lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
            </button>
        </div>
    )
})

export default Btns;