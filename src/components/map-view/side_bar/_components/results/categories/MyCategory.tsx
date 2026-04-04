'use client'
import Favorite from './Favorite'
import Recent from './Recent'
import Suggestion from '@/reuseable_components/Suggestion'

function MyCategory() {
    return (
        <div className='w-full h-[calc(105vh-180px)] overflow-y-auto space-y-6 hide-scrollbar pb-10'>
            <Favorite sliceFavorsTo={2} />
            <Recent sliceRecentTo={2} />
            <Suggestion sliceTo={3} />
        </div>
    )
}

export default MyCategory