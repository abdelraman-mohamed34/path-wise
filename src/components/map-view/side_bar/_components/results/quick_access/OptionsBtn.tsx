import { AnimatePresence } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import Options from './Options'

type Props = {
    coords: { lat: number; lng: number }
}

function OptionsBtn({ coords }: Props) {

    const [showOptions, setShowOptions] = useState<boolean>(false)

    const handleShowOptions = useCallback(() => {
        setShowOptions(prev => !prev)
    }, [])

    return (
        <div>
            <button
                type='button'
                onClick={handleShowOptions}
                aria-label="More options"
                className={`p-3 rounded-md transition-all flex items-center justify-center active:scale-[0.95] bg-secondary/80 hover:bg-secondary/40 ${showOptions ? 'bg-secondary/100' : ''}`}
            >
                <MoreHorizontal size={24} />
            </button>

            <AnimatePresence>
                {showOptions && (
                    <Options setShowOptions={setShowOptions} coords={coords} />
                )}
            </AnimatePresence>
        </div>
    )
}

export default OptionsBtn
