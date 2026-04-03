'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import NearbyPlacesView from '@/components/views/NearbyPlacesView'
import SearchInput from './_components/SearchInput'
import Results from './_components/results/Results'
import Recent from './_components/results/categories/Recent'
import Favorite from './_components/results/categories/Favorite'

function Sidebar() {

    const SearchParams = useSearchParams()

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [activeSlide, setActiveSlide] = useState<boolean>(false)
    const controls = useAnimationControls()
    const sidebarRef = useRef<HTMLDivElement>(null);
    const router = useRouter()
    // Logic positions for reusability
    const positions = {
        bottom: '82vh',
        middle: '50vh',
        top: '5vh'
    }

    const long = SearchParams.get('lng')
    const lat = SearchParams.get('lat')
    const view = SearchParams.get('view')
    const selectedLocation = long && lat

    useEffect(() => {
        if (selectedLocation) {
            controls.start({ y: positions.middle })
        } else {
            controls.start({ y: positions.bottom })
        }
    }, [selectedLocation, controls])

    const handleDragEnd = (event: any, info: any) => {
        const offsetThreshold = 100
        const velocityThreshold = 500

        if (info.offset.y < -offsetThreshold || info.velocity.y < -velocityThreshold) {
            setActiveSlide(true)
            controls.start({ y: positions.top })
        }
        else if (info.offset.y > offsetThreshold || info.velocity.y > velocityThreshold) {
            setActiveSlide(false)
            controls.start(selectedLocation ? { y: positions.middle } : { y: positions.bottom })
        }
    }

    // Close when clicking outside the sidebarRef
    useOutsideClick(sidebarRef, () => {
        if (selectedLocation || activeSlide) {
            setActiveSlide(false);
            router.push('/', { scroll: false });
            controls.start({ y: positions.bottom });
        }
    });
    return (
        <>
            <aside className="absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:w-96 md:z-30 z-30 md:p-4 pointer-events-none">
                {/* white board */}
                <motion.div
                    ref={sidebarRef}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.1}
                    animate={controls}
                    initial={{ y: positions.bottom }}
                    onDragEnd={handleDragEnd}
                    className="h-[100vh] md:h-full w-full bg-card backdrop-blur-xl md:border border-border shadow-2xl rounded-t-[24px] md:rounded-3xl pointer-events-auto md:p-5 p-4 pb-10 flex flex-col md:gap-6 md:!transform-none space-y-3"
                    style={{ touchAction: 'none' }}
                >

                    {/* drop shadow */}
                    <div className='w-full flex justify-center items-center md:hidden shrink-0 cursor-grab active:cursor-grabbing'>
                        <div className='w-12 h-1.5 rounded-full bg-muted-foreground/30' />
                    </div>

                    {view ? (
                        <>
                            {view === 'favorites' && <Favorite sliceFavorsTo={8} />}
                            {view === 'nearby_places' && <NearbyPlacesView />}
                            {view === 'recent' && <Recent sliceRecentTo={8} />}
                        </>
                    ) : (
                        <div className="flex flex-col">
                            {/* 1 */}
                            {!selectedLocation && <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}

                            {/* 2 */}
                            <div className="flex-1 overflow-hidden mt-4">
                                <Results searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            </div>

                        </div>
                    )}

                </motion.div>
            </aside >
        </>
    )
}

export default React.memo(Sidebar)