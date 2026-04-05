'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import { motion, useAnimationControls, useDragControls, PanInfo } from 'framer-motion'
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
    bottom: 0.82,
    middle: 0.50,
    top: 0.10,
}

function Sidebar() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const controls = useAnimationControls()
    const dragControls = useDragControls()
    const sidebarRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const isMobile = useMediaQuery("(max-width: 767px)")
    const { coordinates } = useSelector((state: RootState) => state.trip)
    const isNavigating = coordinates.length > 0

    const view = searchParams.get('view')
    const isOpen = searchParams.get('active') === 'true'
    const long = searchParams.get('lng')
    const lat = searchParams.get('lat')
    const selectedLocation = !!(long && lat)

    const getPos = (pct: number) => typeof window !== 'undefined' ? window.innerHeight * pct : 0

    const targetY = useMemo(() => {
        if (!isMobile) return 0
        if (view || isOpen) return getPos(POSITIONS.top)
        if (selectedLocation) return getPos(POSITIONS.middle)
        return getPos(POSITIONS.bottom)
    }, [isMobile, view, isOpen, selectedLocation])

    useEffect(() => {
        controls.start({ y: targetY })
    }, [targetY, controls])

    const setSidebarState = (active: boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        if (active) params.set('active', 'true')
        else params.delete('active')
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (!isMobile) return
        const { velocity, offset } = info
        const currentY = targetY + offset.y
        const mid = getPos(POSITIONS.middle)
        const bot = getPos(POSITIONS.bottom)

        if (velocity.y < -500 || currentY < mid) {
            setSidebarState(true)
        } else {
            setSidebarState(false)
            if (view && currentY > (mid + bot) / 2) router.push('/', { scroll: false })
        }
    }

    const handleScrollCapture = (e: React.UIEvent<HTMLDivElement>) => {
        if (!isMobile || !scrollRef.current) return
        const { scrollTop } = scrollRef.current
        if (scrollTop <= 0 && isOpen) {
            // Logic for pulling down when scroll is at top can be added here via dragControls
        }
    }

    useOutsideClick(sidebarRef, () => {
        if (isMobile && (selectedLocation || isOpen || view)) {
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
                dragConstraints={{
                    top: getPos(POSITIONS.top),
                    bottom: getPos(POSITIONS.bottom)
                }}
                dragElastic={0.1}
                dragMomentum={false}
                animate={controls}
                initial={{ y: isMobile ? getPos(POSITIONS.bottom) : 0 }}
                onDragEnd={handleDragEnd}
                transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                className={cn(
                    "h-[100vh] pt-2 md:h-full w-full absolute top-0 left-0 md:relative",
                    "bg-card/95 md:backdrop-blur-xl md:border border-border shadow-2xl rounded-t-[24px] md:rounded-3xl pointer-events-auto",
                    "flex flex-col md:gap-6 space-y-3 md:overflow-hidden pb-10"
                )}
            >
                {isNavigating && (
                    <div className='absolute md:hidden flex -translate-y-15 p-3 bg-card rounded-full left-4'>
                        <ExpandBtn icon={<ScanEye className='size-5' />} />
                    </div>
                )}

                <div
                    onPointerDown={(e) => isMobile && dragControls.start(e)}
                    className="w-full flex justify-center items-center md:hidden shrink-0 cursor-grab active:cursor-grabbing touch-none select-none py-2"
                >
                    <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
                </div>

                <div
                    ref={scrollRef}
                    onScroll={handleScrollCapture}
                    className="flex-1 flex flex-col overflow-y-auto hide-scrollbar overscroll-contain px-4 md:px-5"
                >
                    {view ? (
                        <div className="flex-1">
                            {view === 'favorites' && <Favorite sliceFavorsTo={8} />}
                            {view === 'nearby_places' && <NearbyPlacesView />}
                            {view === 'recent' && <Recent sliceRecentTo={8} />}
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            {!selectedLocation && <SearchInput />}
                            <div className="md:mt-4">
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