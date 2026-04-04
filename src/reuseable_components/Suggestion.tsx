'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RootState } from '@/app/store'
import { useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import Window from './Window'

type Props = {
    sliceTo: number
    className?: string;
}

function Suggestion({ sliceTo, className }: Props) {
    const [mounted, setMounted] = useState(false);
    const { nearbyPlaces, nearbyLoading } = useSelector((state: RootState) => state.details)
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentLat = searchParams.get('lat');
    const currentLng = searchParams.get('lng');

    const currentView = searchParams.get('view')
    const isView = currentView === 'nearby_places'

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredPlaces = nearbyPlaces?.filter(place => {
        if (!currentLat || !currentLng) return true;

        const isSelected =
            Math.abs(place.coords.lat - parseFloat(currentLat)) < 0.0001 &&
            Math.abs(place.coords.lng - parseFloat(currentLng)) < 0.0001;

        return !isSelected;
    });

    const noPlaces = !nearbyLoading && (!filteredPlaces || filteredPlaces.length === 0)

    if (!mounted) return <div className='w-full min-h-20' />;

    return (
        <motion.section className={`w-full hide-scrollbar ${className}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
        >
            {
                noPlaces ? (
                    <Window title="Suggestions" className='flex justify-center items-center p-8 text-center text-sm text-muted-foreground'>
                        Please enable location access to see nearby suggestions.
                    </Window>
                ) : (
                    <Window title="Suggestions" dontShowTitleAt='nearby_places' className='p-2'>
                        {nearbyLoading ? (
                            [1, 2].map(i => <div key={i} className='w-full h-24 bg-muted animate-pulse mb-2 rounded-xl' />)
                        ) : (
                            filteredPlaces?.slice(0, sliceTo).map((place, index) => (
                                <div
                                    key={place.id}
                                    onClick={() => router.push(`?lat=${place.coords.lat}&lng=${place.coords.lng}`)}
                                    className={`w-full py-4 px-3 flex items-center gap-2 active:bg-secondary/50 active:scale-[0.98] hover:bg-secondary/25 transition-all cursor-pointer 
                                    ${index !== (filteredPlaces.slice(0, sliceTo).length - 1) ? 'border-b border-border/50' : ''}`}
                                >
                                    <div className='size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm'>
                                        <span className='text-primary text-xs font-black uppercase'>
                                            {place.shortName?.charAt(0) || place.name?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                    <div className='flex-1 overflow-hidden'>
                                        <h3 className='font-black text-sm tracking-tight truncate text-foreground'>{place.shortName}</h3>
                                        <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>{place.category}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </Window>
                )
            }

            {!isView && !nearbyLoading && (filteredPlaces?.length ?? 0) > sliceTo && (
                <div className='w-full justify-center flex py-3'>
                    <button type='button' className='text-primary text-xs hover:underline' onClick={() => router.push('?view=nearby_places')}>
                        See more suggestions
                    </button>
                </div>
            )}
        </motion.section>
    )
}

export default React.memo(Suggestion)