'use client'

import { RootState } from '@/app/store'
import { useSelector } from 'react-redux'
import Container from '@/reuseable_components/Container'
import Suggestion from '@/reuseable_components/Suggestion'
import Title from '@/reuseable_components/Title'

function NearbyPlacesView() {

    const { nearbyLoading } = useSelector((state: RootState) => state.details)

    return (
        <Container>
            {/* Header */}
            <Title text='Nearby places' />

            <div className='w-full space-y-8'>
                {/* places  */}
                <section className='w-full overflow-y-auto no-scrollbar'>
                    <div className='flex flex-col rounded-md overflow-y-auto'>
                        {nearbyLoading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className='w-full h-20 bg-gray-100 animate-pulse rounded-2xl' />
                            ))
                        ) : (
                            <Suggestion sliceTo={5} />
                        )}
                    </div>
                </section>
            </div>
        </Container>
    )
}

export default NearbyPlacesView
