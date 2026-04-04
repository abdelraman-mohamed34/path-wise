'use client'
import { CarFront, MoreHorizontal } from 'lucide-react'
import React, { useState, useCallback, useEffect, useRef, memo } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/app/store'
import { fetchTripPoints } from '@/store/trip/api/fetchTripPoints'
import { clearTrip, setUserLocation } from '@/store/trip/tripSlice'
import { toast } from 'sonner'
import OptionsBtn from './OptionsBtn'

type Props = {
    coords: { lat: number; lng: number }
}

const QuickBtns = memo(({ coords }: Props) => {

    const [isTracking, setIsTracking] = useState(false) // start btn state handler

    const watchIdRef = useRef<number | null>(null)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        return () => { if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current) } }
    }, [])

    // functions
    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current)
            watchIdRef.current = null
        }
        setIsTracking(false)
        dispatch(clearTrip())
        dispatch(setUserLocation(null))
    }, [dispatch])

    const handleStartTrip = useCallback(() => {
        if (isTracking) {
            stopTracking()
            return
        }

        if (!navigator.geolocation) {
            toast.error("GPS not supported")
            return
        }

        const toastId = toast.loading("Finding your location...")

        watchIdRef.current = navigator.geolocation.watchPosition(
            async (p) => {
                toast.dismiss(toastId)
                setIsTracking(true)
                dispatch(setUserLocation({
                    lat: p.coords.latitude,
                    lng: p.coords.longitude
                }))
                try {
                    await dispatch(fetchTripPoints({
                        sCoords: { lat: p.coords.latitude, lng: p.coords.longitude },
                        eCoords: { lat: coords.lat, lng: coords.lng }
                    })).unwrap()
                } catch {
                    toast.error("Could not update route")
                }
            },
            () => {
                toast.dismiss(toastId)
                toast.error("Enable GPS to start navigation")
            },
            { enableHighAccuracy: true, maximumAge: 3000 }
        )
    }, [isTracking, coords, dispatch, stopTracking])

    return (
        <div className="flex gap-2 w-full relative">
            <button
                onClick={handleStartTrip}
                type='button'
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-md transition-all uppercase text-[11px] font-bold tracking-[2px] shadow-lg active:scale-[0.98]
                    ${isTracking
                        ? 'bg-destructive text-white shadow-red-500/20'
                        : 'bg-[#0C79FE] text-white shadow-blue-500/20 hover:brightness-110'
                    }`}
            >
                <CarFront size={18} strokeWidth={2.5} />
                <span>{isTracking ? 'Stop' : 'Start'}</span>
            </button>
            <OptionsBtn coords={coords} />
        </div>
    )
}, (prevProps, nextProps) => {
    return (
        prevProps.coords.lat === nextProps.coords.lat &&
        prevProps.coords.lng === nextProps.coords.lng
    )
})

export default QuickBtns