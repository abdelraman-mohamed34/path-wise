'use client'
import { useRecentSearches } from '@/hooks/useAddToRecent'
import H2 from '@/reuseable_components/H2'
import Suggestion from '@/reuseable_components/Suggestion'
import Window from '@/reuseable_components/Window'
import { useRouter, useSearchParams } from 'next/navigation'

function Recent({ sliceRecentTo }: { sliceRecentTo: number }) {
    const { recent } = useRecentSearches()
    const router = useRouter()

    const goToLocation = (lat: number, lng: number): void => {
        router.push(`?lat=${lat}&lng=${lng}`)
    }

    const showAllRecent = (): void => {
        router.push('?view=recent')
    }
    const searchParams = useSearchParams()
    const view = searchParams.get('view')

    return (
        <div className="w-full">
            <div className='w-full flex justify-between'>
                <H2>Recent</H2>
                {!(view || view === 'recent') && recent.length > 0 && (
                    <button onClick={showAllRecent} className="group flex items-center gap-1 text-[#0C79FE] hover:underline hover:underline-offset-4 transition-all md:text-[15px] text-[12px]">
                        <span>see all</span>
                    </button>
                )}
            </div>

            <Window className='p-2 mb-5 flex justify-center items-center'>
                <div className="flex flex-col gap-2 w-full">
                    {recent && recent.length > 0 ? (
                        recent.slice(0, sliceRecentTo).map((item) => (
                            <div
                                key={`${item.lat}-${item.lng}`}
                                onClick={() => goToLocation(item.lat, item.lng)}
                                className='flex items-center gap-3 p-2 hover:bg-secondary/20 active:scale-[0.98] transition-all cursor-pointer border-b border-border/40 last:border-0'
                            >
                                <div className='size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold'>
                                    {item.name?.charAt(0) || 'L'}
                                </div>

                                <div className="flex flex-col overflow-hidden">
                                    <h1 className='text-sm font-medium truncate text-foreground'>
                                        {item.name || "Unknown Location"}
                                    </h1>
                                    <span className='text-[10px] text-muted-foreground'>
                                        {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center w-full h-full">
                            <h1 className="md:text-xs text-[10px] text-muted-foreground uppercase tracking-widest">No recent searches</h1>
                        </div>
                    )}
                </div>
            </Window>

            {(view || view === 'recent') && (<Suggestion sliceTo={3} />)}
        </div >
    )
}

export default Recent