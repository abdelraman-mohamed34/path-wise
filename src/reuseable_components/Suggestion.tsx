'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RootState } from '@/app/store'
import { useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import Window from './Window'

type Props = {
    sliceTo: number
}

function Suggestion({ sliceTo }: Props) {

    const [mounted, setMounted] = useState(false);

    const { nearbyPlaces, nearbyLoading } = useSelector((state: RootState) => state.details)
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentView = searchParams.get('view')
    const isView = currentView === 'nearby_places'

    useEffect(() => {
        setMounted(true);
    }, []);

    const noPlaces = !nearbyLoading && (!nearbyPlaces || nearbyPlaces.length === 0)

    if (!mounted) {
        return <div className='w-full min-h-20' />;
    }

    return (
        <motion.section className='w-full hide-scrollbar'
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
                    <Window title="Suggestions" className='p-2'>
                        {nearbyLoading ? (
                            [1, 2].map(i => (
                                <div key={i} className='w-full h-24 bg-muted animate-pulse mb-2 rounded-xl' />
                            ))
                        ) : (
                            nearbyPlaces?.slice(0, sliceTo).map((place, index) => (
                                <div
                                    key={place.id}
                                    onClick={() => router.push(`?lat=${place.coords.lat}&lng=${place.coords.lng}`)}
                                    className={`w-full py-4 px-3 flex items-center gap-2 active:bg-secondary/50 active:scale-[0.98] hover:bg-secondary/25 transition-all cursor-pointer 
                                    ${index !== (nearbyPlaces.slice(0, sliceTo).length - 1) ? 'border-b border-border/50' : ''}`}
                                >
                                    <div className='size-8 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/10'>
                                        <img
                                            src={place.image}
                                            alt={place.name}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>

                                    <div className='flex-1 overflow-hidden'>
                                        <h3 className='font-black text-sm tracking-tight truncate text-foreground'>
                                            {place.shortName}
                                        </h3>
                                        <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>
                                            {place.category}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </Window>
                )
            }

            {
                !isView && !nearbyLoading && (nearbyPlaces?.length ?? 0) > sliceTo && (
                    <div className='w-full justify-center flex py-3'>
                        <button
                            className='text-primary text-xs hover:underline'
                            onClick={() => router.push('?view=nearby_places')}
                        >
                            See more suggestions
                        </button>
                    </div>
                )
            }
        </motion.section>
    )
}

export default React.memo(Suggestion)