'use client'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/app/store'
import { clearDetails } from '@/store/details/detailsSlice'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, memo } from 'react'

// components
import { DetailCard } from './DetailCard'
import { LocationCard } from './LocationCard'
import MyCategory from './categories/MyCategory'
import Suggestion from '@/reuseable_components/Suggestion'

interface ResultsProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

function Results({ searchTerm, setSearchTerm }: ResultsProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { results, status } = useSelector((state: RootState) => state.location);
    const { selectedLocation, status: detailsStatus } = useSelector((state: RootState) => state.details);

    const router = useRouter()
    const searchParams = useSearchParams()

    const lng = searchParams.get('lng')
    const lat = searchParams.get('lat')
    const hasParams = Boolean(lng && lat)

    useEffect(() => {
        if (!hasParams) {
            dispatch(clearDetails())
        }
    }, [hasParams, dispatch])

    const onBackFunction = () => {
        router.push('/', { scroll: false })
    }

    const handleGetLocationDetails = (coords: { lat: number; lng: number }) => {
        router.push(`?lat=${coords.lat}&lng=${coords.lng}`, { scroll: false });
        setSearchTerm('')
    };

    const renderSkeleton = () => (
        <div className="space-y-4 px-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-secondary/20 rounded-2xl border border-border/50 animate-pulse flex gap-4">
                    <div className="size-10 bg-muted rounded-xl" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/2 bg-muted rounded" />
                        <div className="h-3 w-1/3 bg-muted rounded" />
                    </div>
                </div>
            ))}
        </div>
    );

    if (status === 'loading' || detailsStatus === 'loading') return renderSkeleton()

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">

            {searchTerm.trim() !== "" ? (
                <>
                    {results && results.length > 0 ? (
                        <div className="space-y-3 animate-in fade-in duration-500">
                            {results.map((item: any) => (
                                <LocationCard key={item.id} item={item} onClick={handleGetLocationDetails} />
                            ))}
                        </div>
                    ) : (
                        status === 'success' && (
                            <div className="text-center py-10 text-destructive text-sm font-medium">No results found.</div>
                        )
                    )}
                </>
            ) : (
                <>
                    {selectedLocation ? (
                        <div className='space-y-3'>
                            <DetailCard location={selectedLocation} onBack={onBackFunction} />
                            <Suggestion sliceTo={3} />
                        </div>
                    ) : (
                        status === 'idle' && (
                            <MyCategory />
                        )
                    )}
                </>
            )}
        </div>
    );
}

export default memo(Results);