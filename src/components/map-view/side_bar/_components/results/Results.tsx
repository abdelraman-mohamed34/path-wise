'use client'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { RootState, AppDispatch } from '@/app/store'
import { clearDetails } from '@/store/details/detailsSlice'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, memo, useCallback } from 'react'
import { DetailCard } from './DetailCard'
import { LocationCard } from './LocationCard'
import MyCategory from './categories/MyCategory'
import { deleteSearch } from '@/store/global_data/dataSlice'
import { SearchX, WifiOff } from 'lucide-react'
import { clearTrip } from '@/store/trip/tripSlice'

const renderSkeleton = () => (
    <div className="space-y-3 px-1">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/20 animate-pulse">
                <div className="size-9 shrink-0 rounded-full bg-muted/50" />
                <div className="flex flex-col flex-1 gap-2 overflow-hidden">
                    <div className="h-3.5 w-3/4 bg-muted/60 rounded-md" />
                    <div className="h-2.5 w-1/2 bg-muted/40 rounded-md" />
                </div>
            </div>
        ))}
    </div>
);

const renderError = (message: string) => (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
        <div className="p-3 bg-destructive/10 rounded-full">
            <WifiOff className="size-6 text-destructive" />
        </div>
        <p className="text-sm font-medium text-destructive">{message}</p>
    </div>
);

function Results() {
    const dispatch = useDispatch<AppDispatch>()
    const { results, status, selectedLocation, detailsStatus, searchTerm } =
        useSelector((state: RootState) => ({
            results: state.location.results,
            status: state.location.status,
            selectedLocation: state.details.selectedLocation,
            detailsStatus: state.details.status,
            searchTerm: state.data.inputSearch,
        }), shallowEqual);

    const router = useRouter()
    const searchParams = useSearchParams()
    const lng = searchParams.get('lng')
    const lat = searchParams.get('lat')
    const hasParams = Boolean(lng && lat)

    useEffect(() => {
        if (!hasParams) dispatch(clearDetails())
    }, [hasParams, dispatch])

    const onBackFunction = useCallback(() => {
        router.push('/', { scroll: false })
        dispatch(clearTrip())
    }, [router])

    const handleGetLocationDetails = useCallback((coords: { lat: number; lng: number }) => {
        router.push(`?lat=${coords.lat}&lng=${coords.lng}`, { scroll: false });
        dispatch(deleteSearch());
    }, [router, dispatch]);

    if (status === 'loading' || detailsStatus === 'loading') return renderSkeleton()

    if (detailsStatus === 'error') return renderError("Couldn't load location details. Check your connection.")

    return (
        <div className="flex-1 overflow-y-auto overscroll-contain hide-scrollbar">
            {searchTerm && searchTerm.trim() !== "" ? (
                <>
                    {status === 'error' ? (
                        renderError("Search failed. Check your connection.")
                    ) : results && results.length > 0 ? (
                        <div className="space-y-3 animate-in fade-in duration-500">
                            {results.map((item: any) => (
                                <LocationCard key={item.id} item={item} onClick={handleGetLocationDetails} />
                            ))}
                        </div>
                    ) : (
                        status === 'success' && (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="p-3 bg-muted rounded-full">
                                    <SearchX className="size-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">No results found</p>
                            </div>
                        )
                    )}
                </>
            ) : (
                <>
                    {selectedLocation ? (
                        <div className='space-y-3'>
                            <DetailCard location={selectedLocation} onBack={onBackFunction} />
                        </div>
                    ) : (
                        status === 'idle' && <MyCategory />
                    )}
                </>
            )}
        </div>
    );
}

export default memo(Results);