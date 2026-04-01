'use client'
import { RootState, AppDispatch } from '@/app/store'
import { setViewLocation } from '@/store/location/location'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MapPinIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useMap } from 'react-map-gl/maplibre'

function Results() {
    const { results, status } = useSelector((state: RootState) => state.location)
    const dispatch = useDispatch<AppDispatch>()

    const { "main-map": map } = useMap();

    const goTo = (coords: { lat: number; lng: number }) => {
        if (!map) {
            console.warn("Map is not ready yet!");
            return;
        }

        map.flyTo({
            center: [coords.lng, coords.lat],
            zoom: 15,
            duration: 2500,
            essential: true
        });
        dispatch(setViewLocation(coords))
    };

    const renderSkeleton = () => (
        <div className="space-y-4 px-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-secondary/20 rounded-2xl border border-border/50 animate-pulse flex gap-4">
                    <div className="size-10 bg-muted rounded-xl" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/2 bg-muted rounded" />
                        <div className="h-3 w-1/3 bg-muted rounded" />
                    </div>
                </div>
            ))}
        </div>
    )

    const renderCards = () => (
        <div className="space-y-3 px-2">
            {results.map((item: any) => (
                <button
                    key={item.id}
                    onClick={() => goTo(item.coords)}
                    className="w-full group relative flex items-center gap-4 p-4 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/40 hover:bg-secondary/40 transition-all duration-300 text-left shadow-sm overflow-hidden"
                >
                    {/* Background Glow on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Icon Container */}
                    <div className="flex-shrink-0 flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <MapPinIcon className="size-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 z-10">
                        <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {item.name}
                        </h3>
                        <p className="text-[10px] font-mono text-muted-foreground/80 mt-0.5 tracking-tight uppercase">
                            {item.coords.lat.toFixed(4)}° N, {item.coords.lng.toFixed(4)}° E
                        </p>
                    </div>

                    {/* Action Arrow */}
                    <ChevronRightIcon className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </button>
            ))}
        </div>
    )

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
            {results.length === 0 && status === 'idle' && (
                <div className="flex flex-col items-center justify-center h-40 opacity-40">
                    <MapPinIcon className="size-8 mb-2" />
                    <p className="text-sm italic">Type a location to start your journey...</p>
                </div>
            )}

            {status === 'loading' ? renderSkeleton() : renderCards()}

            {status === 'success' && results.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-destructive font-medium text-sm">No results found.</p>
                </div>
            )}
        </div>
    )
}

export default Results