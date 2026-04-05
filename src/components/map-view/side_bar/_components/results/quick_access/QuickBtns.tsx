'use client'
import { CarFront } from 'lucide-react'
import React, { useCallback, useEffect, useRef, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { fetchTripPoints } from '@/store/trip/api/fetchTripPoints'
import { clearTrip, setUserLocationForTrip } from '@/store/trip/tripSlice'
import { toast } from 'sonner'
import OptionsBtn from './OptionsBtn'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
    coords: { lat: number; lng: number }
}

type RefCoords = {
    lat: number; lng: number
}

const QuickBtns = memo(({ coords }: Props) => {
    const router = useRouter()
    const watchIdRef = useRef<number | null>(null)
    const coordsRef = useRef<RefCoords | null>(null)
    const currentRequestRef = useRef<any>(null)
    const dispatch = useDispatch<AppDispatch>()
    const { isTrip } = useSelector((d: RootState) => d.trip)
    const [isOnline, setIsOnline] = React.useState(true)

    const searchParams = useSearchParams()

    useEffect(() => {
        setIsOnline(window.navigator.onLine)
        const updateStatus = () => setIsOnline(window.navigator.onLine)
        window.addEventListener('online', updateStatus)
        window.addEventListener('offline', updateStatus)
        return () => {
            window.removeEventListener('online', updateStatus)
            window.removeEventListener('offline', updateStatus)
        }
    }, [])

    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current)
            }
            if (currentRequestRef.current) {
                currentRequestRef.current.abort()
            }
        }
    }, [])

    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current)
            watchIdRef.current = null
        }
        if (currentRequestRef.current) {
            currentRequestRef.current.abort()
        }
        coordsRef.current = null
        dispatch(clearTrip())
        dispatch(setUserLocationForTrip(null))
    }, [dispatch])

    const handleStartTrip = useCallback(() => {
        if (!isOnline) {
            toast.error("Connection error! Please check your internet.")
            return
        }
        if (isTrip) {
            stopTracking()
            return
        }
        if (!navigator.geolocation) {
            toast.error("Location access not supported by your browser")
            return
        }

        const toastId = toast.loading("Finding your location...")

        watchIdRef.current = navigator.geolocation.watchPosition(
            async (p) => {
                toast.dismiss(toastId)
                const currentLat = p.coords.latitude
                const currentLng = p.coords.longitude

                dispatch(setUserLocationForTrip({ lat: currentLat, lng: currentLng }))

                if (coordsRef.current) {
                    const latDiff = Math.abs(coordsRef.current.lat - currentLat)
                    const lngDiff = Math.abs(coordsRef.current.lng - currentLng)
                    if (latDiff < 0.0003 && lngDiff < 0.0003) return
                }

                try {
                    if (currentRequestRef.current) {
                        currentRequestRef.current.abort()
                    }

                    const request = dispatch(fetchTripPoints({
                        sCoords: { lat: currentLat, lng: currentLng },
                        eCoords: { lat: coords.lat, lng: coords.lng }
                    }))

                    currentRequestRef.current = request

                    await request.unwrap()

                    coordsRef.current = { lat: currentLat, lng: currentLng }

                    const params = new URLSearchParams(searchParams.toString())
                    if (params.has('active')) {
                        params.delete('active')
                        router.push(`?${params.toString()}`, { scroll: false })
                    }

                } catch (err: any) {
                    if (err !== 'cancelled' && err?.name !== 'AbortError') {
                        toast.error("Could not update route")
                    }
                }
            },
            () => {
                toast.dismiss(toastId)
                toast.error("Enable GPS to start navigation")
            },
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
        )
    }, [coords, dispatch, isTrip, isOnline, stopTracking, searchParams, router])

    return (
        <div className="flex gap-2 w-full relative">
            <button
                onClick={handleStartTrip}
                type='button'
                disabled={!isOnline}
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-md transition-all uppercase text-[11px] font-bold tracking-[2px] shadow-lg active:scale-[0.98]
                    ${isTrip
                        ? 'bg-destructive text-white shadow-red-500/20'
                        : isOnline
                            ? 'bg-[#0C79FE] text-white shadow-blue-500/20 hover:brightness-110'
                            : 'bg-muted-foreground text-white opacity-70 cursor-not-allowed'
                    }`}
            >
                <CarFront size={18} strokeWidth={2.5} />
                <span>{isTrip ? 'Stop' : 'Start'}</span>
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