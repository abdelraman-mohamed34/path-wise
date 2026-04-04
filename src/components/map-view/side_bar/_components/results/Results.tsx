'use client'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/app/store'
import { clearDetails } from '@/store/details/detailsSlice'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, memo, useCallback } from 'react'
import { DetailCard } from './DetailCard'
import { LocationCard } from './LocationCard'
import MyCategory from './categories/MyCategory'
import Suggestion from '@/reuseable_components/Suggestion'
import { deleteSearch } from '@/store/global_data/dataSlice'

const renderSkeleton = () => (
    <div className="space-y-3 px-1">
        {[1, 2, 3, 4, 5].map((i) => (
            <div
                key={i}
                className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/20 animate-pulse"
            >
                <div className="size-9 shrink-0 rounded-full bg-muted/50" />
                <div className="flex flex-col flex-1 gap-2 overflow-hidden">
                    <div className="h-3.5 w-3/4 bg-muted/60 rounded-md" />
                    <div className="h-2.5 w-1/2 bg-muted/40 rounded-md" />
                </div>
            </div>
        ))}
    </div>
);

function Results() {
    const dispatch = useDispatch<AppDispatch>()

    const results = useSelector((state: RootState) => state.location.results);
    const status = useSelector((state: RootState) => state.location.status);


    const selectedLocation = useSelector((state: RootState) => state.details.selectedLocation);
    const detailsStatus = useSelector((state: RootState) => state.details.status);

    const searchTerm = useSelector((state: RootState) => state.data.inputSearch);
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

    const handleGetLocationDetails = useCallback((coords: { lat: number; lng: number }) => {
        router.push(`?lat=${coords.lat}&lng=${coords.lng}`, { scroll: false });
        dispatch(deleteSearch());
    }, [router, dispatch]);

    if (status === 'loading' || detailsStatus === 'loading') return renderSkeleton()

    return (
        <div className="flex-1 overflow-y-auto overscroll-contain hide-scrollbar px-1">
            {searchTerm && searchTerm.trim() !== "" ? (
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