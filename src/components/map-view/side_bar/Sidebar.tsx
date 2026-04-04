'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useAnimationControls, useDragControls } from 'framer-motion'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { useSearchParams, useRouter } from 'next/navigation'
import NearbyPlacesView from '@/components/views/NearbyPlacesView'
import SearchInput from './_components/SearchInput'
import Results from './_components/results/Results'
import Recent from './_components/results/categories/Recent'
import Favorite from './_components/results/categories/Favorite'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import ExpandBtn from '../main_map/ExpandBtn'
import { ScanEye } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'

const POSITIONS = {
    bottom: '82vh',
    middle: '50vh',
    top: '10vh',
}

function Sidebar() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const controls = useAnimationControls()
    const dragControls = useDragControls()
    const sidebarRef = useRef<HTMLDivElement>(null)
    const [activeSlide, setActiveSlide] = useState(false)

    const isMobile = useMediaQuery("(max-width: 767px)")
    const { coordinates } = useSelector((state: RootState) => state.trip);
    const isNavigating = coordinates.length > 0;

    const long = searchParams.get('lng')
    const lat = searchParams.get('lat')
    const view = searchParams.get('view')
    const selectedLocation = !!(long && lat)

    const targetPosition = useMemo(() => {
        if (!isMobile) return '0'
        if (view || activeSlide) return POSITIONS.top
        if (selectedLocation) return POSITIONS.middle
        return POSITIONS.bottom
    }, [isMobile, view, activeSlide, selectedLocation])

    useEffect(() => {
        controls.start({ y: targetPosition })
    }, [targetPosition, controls])

    const handleDragEnd = (_: any, info: any) => {
        if (!isMobile) return
        const { velocity, offset } = info

        if (velocity.y < -500 || offset.y < -150) {
            setActiveSlide(true)
        } else if (velocity.y > 500 || offset.y > 150) {
            setActiveSlide(false)
            if (view) router.push('/', { scroll: false })
        }
    }

    useOutsideClick(sidebarRef, () => {
        if (isMobile && (selectedLocation || activeSlide || view)) {
            setActiveSlide(false)
            router.push('/', { scroll: false })
        }
    })

    return (
        <aside className="absolute inset-x-0 bottom-0 md:relative md:inset-auto md:w-96 z-30 md:p-4 pointer-events-none h-full">
            <motion.div
                ref={sidebarRef}
                drag={isMobile ? 'y' : false}
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.08}
                dragMomentum={false}
                animate={controls}
                initial={{ y: isMobile ? POSITIONS.bottom : 0 }}
                onDragEnd={handleDragEnd}
                transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                style={{ willChange: 'transform' }}
                className={cn(
                    "h-[100vh] md:h-full w-full",
                    "bg-card/95 md:backdrop-blur-xl",
                    "md:border border-border shadow-2xl",
                    "rounded-t-[24px] md:rounded-3xl",
                    "pointer-events-auto",
                    "md:p-5 p-4 pb-10",
                    "flex flex-col md:gap-6 space-y-3",
                    "md:overflow-hidden",
                )}
            >

                {isNavigating && (
                    <div className='absolute md:hidden flex -translate-y-16 p-3 bg-card rounded-full'>
                        <ExpandBtn icon={<ScanEye className='size-5' />} />
                    </div>
                )}

                <div
                    onPointerDown={(e) => {
                        if (!isMobile) return
                        dragControls.start(e)
                    }}
                    className="w-full flex justify-center items-center md:hidden shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
                >
                    <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
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
                            <div className="flex-1 overflow-y-auto hide-scrollbar overscroll-contain mt-4">
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