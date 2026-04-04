import { RootState } from '@/app/store';
import { Expand } from 'lucide-react'
import React, { ReactNode, useEffect, useState } from 'react'
import { useMap } from 'react-map-gl/maplibre';
import { useSelector } from 'react-redux';

interface ExpandBtnProps {
    icon?: ReactNode;
}

function ExpandBtn({ icon }: ExpandBtnProps) {

    const [cameraMode, setCameraMode] = useState<'overview' | 'follow'>('follow');

    const { userLocation, coordinates } = useSelector((state: RootState) => state.trip);
    const { "main-map": map } = useMap();
    const isNavigating = coordinates.length > 0;
    useEffect(() => {
        if (!isNavigating) {
            return;
        }
    }, [isNavigating]);

    useEffect(() => {
        if (!map || !isNavigating) return;

        if (cameraMode === 'follow' && userLocation) {
            map.easeTo({
                center: [userLocation.lng, userLocation.lat],
                zoom: 17,
                duration: 1000,
            });
        } else if (cameraMode === 'overview' && coordinates.length >= 2) {
            const lngs = coordinates.map(c => c[0]);
            const lats = coordinates.map(c => c[1]);
            map.fitBounds(
                [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                { padding: { top: 80, bottom: 220, left: 60, right: 60 }, duration: 1500 }
            );
        }
    }, [cameraMode, userLocation, coordinates, map, isNavigating]);

    return (
        <div>
            <button
                onClick={() => setCameraMode(prev => prev === 'follow' ? 'overview' : 'follow')}
                className="flex text-xs font-bold text-foreground active:scale-95 transition-all"
            >
                {icon || <Expand size={14} />}
            </button>
        </div>
    )
}

export default ExpandBtn
