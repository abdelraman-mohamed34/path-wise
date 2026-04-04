import React, { useEffect, useState } from 'react'
import { clearTrip } from "@/store/trip/tripSlice";
import { Navigation, Clock, X, Expand } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { useMap } from 'react-map-gl/maplibre';
import ExpandBtn from './ExpandBtn';

type Props = {
    className?: string
}

function TripInfo({ className }: Props) {

    const { distance, duration, status, coordinates } = useSelector((state: RootState) => state.trip);
    const isNavigating = coordinates.length > 0;

    const dispatch = useDispatch<AppDispatch>()

    const formattedDistance = distance
        ? distance >= 1000
            ? `${(distance / 1000).toFixed(1)} km`
            : `${Math.round(distance)} m`
        : null;

    const formattedDuration = duration
        ? duration >= 3600
            ? `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`
            : `${Math.floor(duration / 60)} min`
        : null;


    if (!isNavigating) return

    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {status === 'loading' ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Finding best route...</span>
                </div>
            ) : (
                <>

                    {/* change camera */}
                    <ExpandBtn />

                    <div className="flex items-center gap-2">
                        <Navigation className="size-4 text-primary" />
                        <span className="text-sm font-bold text-foreground">{formattedDistance}</span>
                    </div>

                    <div className="w-px h-4 bg-border" />

                    <div className="flex items-center gap-2">
                        <Clock className="size-4 text-primary" />
                        <span className="text-sm font-bold text-foreground">{formattedDuration}</span>
                    </div>

                    <div className="w-px h-4 bg-border" />

                    <button
                        onClick={() => dispatch(clearTrip())}
                        className="p-1 hover:bg-destructive hover:text-white rounded-full transition-all active:scale-90"
                    >
                        <X className="size-4" />
                    </button>
                </>
            )}
        </div>
    )
}

export default TripInfo
