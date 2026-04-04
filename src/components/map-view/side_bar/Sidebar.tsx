'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { useSearchParams, useRouter } from 'next/navigation'
import NearbyPlacesView from '@/components/views/NearbyPlacesView'
import SearchInput from './_components/SearchInput'
import Results from './_components/results/Results'
import Recent from './_components/results/categories/Recent'
import Favorite from './_components/results/categories/Favorite'
import { cn } from '@/lib/utils'

function Sidebar() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const controls = useAnimationControls()
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [activeSlide, setActiveSlide] = useState<boolean>(false)

    const long = searchParams.get('lng')
    const lat = searchParams.get('lat')
    const view = searchParams.get('view')
    const selectedLocation = !!(long && lat)

    const sidebarVariants = {
        bottom: { y: '82vh' },
        middle: { y: '50vh' },
        top: { y: '10vh' }
    }

    useEffect(() => {
        if (view || activeSlide) {
            controls.start('top')
        } else if (selectedLocation) {
            controls.start('middle')
        } else {
            controls.start('bottom')
        }
    }, [selectedLocation, view, activeSlide, controls])

    const handleDragEnd = (event: any, info: any) => {
        const velocity = info.velocity.y
        const offset = info.offset.y

        if (velocity < -500 || offset < -150) {
            setActiveSlide(true)
            controls.start('top')
        }
        else if (velocity > 500 || offset > 150) {
            if (view) {
                setActiveSlide(false)
                controls.start(selectedLocation ? 'middle' : 'bottom')
            } else {
                setActiveSlide(false)
                controls.start(selectedLocation ? 'middle' : 'bottom')
            }
        } else {
            controls.start(activeSlide || view ? 'top' : (selectedLocation ? 'middle' : 'bottom'))
        }
    }

    useOutsideClick(sidebarRef, () => {
        if (selectedLocation || activeSlide || view) {
            setActiveSlide(false);
            router.push('/', { scroll: false });
            controls.start('bottom');
        }
    });

    return (
        <aside className="absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:w-96 md:z-30 z-30 md:p-4 pointer-events-none">
            <motion.div
                ref={sidebarRef}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.05}
                variants={sidebarVariants}
                animate={controls}
                initial="bottom"
                onDragEnd={handleDragEnd}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={cn(
                    "h-[100vh] md:h-full w-full bg-card/95 md:border border-border shadow-2xl rounded-t-[24px] md:rounded-3xl pointer-events-auto md:p-5 p-4 pb-10 flex flex-col md:gap-6 space-y-3 overflow-hidden touch-none",
                    "transform-gpu will-change-transform",
                    "md:backdrop-blur-xl"
                )}
            >
                <div className='w-full flex justify-center items-center md:hidden shrink-0 cursor-grab active:cursor-grabbing py-3'>
                    <div className='w-12 h-1.5 rounded-full bg-muted-foreground/30' />
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {view ? (
                        <div className="flex-1 overflow-y-auto hide-scrollbar overscroll-contain">
                            {view === 'favorites' && <Favorite sliceFavorsTo={8} />}
                            {view === 'nearby_places' && <NearbyPlacesView />}
                            {view === 'recent' && <Recent sliceRecentTo={8} />}
                        </div>
                    ) : (
                        <div className="flex flex-col h-full overflow-hidden">
                            {!selectedLocation && <SearchInput />}
                            <div className="flex-1 overflow-hidden mt-4">
                                <Results />
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </aside>
    )
}

export default Sidebar