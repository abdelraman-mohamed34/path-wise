'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
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

const SNAP = {
    peek: 0.78,
    mid: 0.45,
    full: 0.08,
    hidden: 0.92,
}

const SPRING_CONFIG = 'cubic-bezier(0.32, 0.72, 0, 1)' // Apple-style spring feel
const ANIM_MS = 380

function snapY(pct: number) {
    return typeof window !== 'undefined' ? window.innerHeight * pct : 0
}

function nearestSnap(y: number, snaps: number[]): number {
    return snaps.reduce((prev, cur) =>
        Math.abs(cur - y) < Math.abs(prev - y) ? cur : prev
    )
}

function Sidebar() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const sheetRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const dragState = useRef({ active: false, startY: 0, startTranslate: 0, lastY: 0, lastT: 0, vel: 0 })
    const currentY = useRef(0)

    const isMobile = useMediaQuery('(max-width: 767px)')
    const { coordinates } = useSelector((state: RootState) => state.trip)
    const isNavigating = coordinates.length > 0

    const view = searchParams.get('view')
    const isOpen = searchParams.get('active') === 'true'
    const long = searchParams.get('lng')
    const lat = searchParams.get('lat')
    const selectedLocation = !!(long && lat)

    const getTargetY = useCallback((): number => {
        if (!isMobile) return 0
        if (isNavigating) return snapY(SNAP.hidden)
        if (view || isOpen) return snapY(SNAP.full)
        if (selectedLocation) return snapY(SNAP.mid)
        return snapY(SNAP.peek)     // default: peek
    }, [isMobile, isNavigating, view, isOpen, selectedLocation])

    const animateTo = useCallback((y: number, immediate = false) => {
        const el = sheetRef.current
        if (!el) return
        currentY.current = y
        el.style.transition = immediate
            ? 'none'
            : `transform ${ANIM_MS}ms ${SPRING_CONFIG}`
        el.style.transform = `translateY(${y}px)`
    }, [])

    useEffect(() => {
        if (!isMobile) return
        animateTo(getTargetY())
    }, [isMobile, isNavigating, view, isOpen, selectedLocation, getTargetY, animateTo])

    useEffect(() => {
        if (!isMobile) return
        animateTo(getTargetY(), true)
    }, [isMobile]) // eslint-disable-line react-hooks/exhaustive-deps

    const getAvailableSnaps = useCallback((): number[] => {
        if (isNavigating) return [snapY(SNAP.full), snapY(SNAP.mid), snapY(SNAP.hidden)]
        return [snapY(SNAP.full), snapY(SNAP.mid), snapY(SNAP.peek)]
    }, [isNavigating])

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        if (!isMobile) return
        if (scrollRef.current && scrollRef.current.scrollTop > 0) return

        const el = sheetRef.current
        if (!el) return

        const matrix = new DOMMatrix(getComputedStyle(el).transform)
        const translateY = matrix.m42

        dragState.current = {
            active: true,
            startY: e.clientY,
            startTranslate: translateY,
            lastY: e.clientY,
            lastT: Date.now(),
            vel: 0,
        }
        currentY.current = translateY

        el.style.transition = 'none'
        el.setPointerCapture(e.pointerId)
    }, [isMobile])

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragState.current.active) return

        const el = sheetRef.current
        if (!el) return

        const now = Date.now()
        const dt = now - dragState.current.lastT || 1
        const dy = e.clientY - dragState.current.lastY
        dragState.current.vel = dy / dt
        dragState.current.lastY = e.clientY
        dragState.current.lastT = now

        const raw = dragState.current.startTranslate + (e.clientY - dragState.current.startY)

        const minY = snapY(SNAP.full)
        const maxY = snapY(SNAP.peek)

        let y = raw
        if (raw < minY) y = minY - (minY - raw) * 0.3
        if (raw > maxY) y = maxY + (raw - maxY) * 0.3

        currentY.current = y
        el.style.transform = `translateY(${y}px)`
    }, [isNavigating])

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        if (!dragState.current.active) return
        dragState.current.active = false

        const vel = dragState.current.vel  // px/ms
        const snaps = getAvailableSnaps()
        const projected = currentY.current + vel * 80   // momentum projection

        let target = nearestSnap(projected, snaps)

        if (vel > 0.8) target = snaps[snaps.length - 1]
        if (vel < -0.8) target = snaps[0]

        animateTo(target)

        // sync URL state
        const params = new URLSearchParams(searchParams.toString())
        if (target === snapY(SNAP.full)) {
            params.set('active', 'true')
        } else if (target === snapY(SNAP.peek)) {
            params.delete('active')
            params.delete('view')
        } else if (target === snapY(SNAP.mid)) {
            params.delete('active')
        }
        router.replace(`?${params.toString()}`, { scroll: false })
    }, [getAvailableSnaps, animateTo, searchParams, router])

    if (!isMobile) {
        return (
            <aside className="relative w-96 z-30 p-4 pointer-events-none h-full">

                <div className={cn(
                    "h-full w-full relative",
                    "bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-3xl pointer-events-auto",
                    "flex flex-col gap-6 overflow-hidden pb-10 pt-5 px-5"
                )}>
                    <SearchInput />
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                        {view ? (
                            <>
                                {view === 'favorites' && <Favorite sliceFavorsTo={8} />}
                                {view === 'nearby_places' && <NearbyPlacesView />}
                                {view === 'recent' && <Recent sliceRecentTo={8} />}
                            </>
                        ) : (
                            <Results />
                        )}
                    </div>
                </div>
            </aside >
        )
    }

    // mobile
    return (
        <aside className="absolute inset-x-0 bottom-0 z-30 pointer-events-none h-full">
            <div
                ref={sheetRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                style={{ touchAction: 'none' }}
                className={cn(
                    "absolute top-0 left-0 w-full h-[100dvh] pointer-events-auto",
                    "bg-card/97 backdrop-blur-xl shadow-2xl rounded-t-[24px]",
                    "flex flex-col will-change-transform"
                )}
            >

                {isNavigating && (
                    <div className="-translate-y-12 translate-x-2 absolute pointer-events-auto z-40">
                        <div className="p-3 bg-card rounded-full shadow-lg border border-border">
                            <ExpandBtn icon={<ScanEye className="size-5" />} />
                        </div>
                    </div>
                )}

                {/* ── Handle ── */}
                <div className="w-full flex justify-center items-center shrink-0 pt-3 pb-1 cursor-grab active:cursor-grabbing select-none mb-3">
                    <div className="w-10 h-1 rounded-full bg-muted-foreground/25 transition-all duration-200" />
                </div>

                {/* ── Scrollable content ── */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto hide-scrollbar overscroll-contain px-4 pb-10"
                    style={{ touchAction: 'pan-y' }}
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
                            <div className="mt-3">
                                <Results />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}

export default Sidebar