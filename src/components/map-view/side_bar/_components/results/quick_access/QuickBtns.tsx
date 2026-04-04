'use client'
import { CarFront, MoreHorizontal } from 'lucide-react'
import React, { useState, useCallback, memo } from 'react'
import Options from './Options'
import { AnimatePresence } from 'framer-motion'

type Props = {
    coords: {
        lat: number;
        lng: number;
    }
}

const QuickBtns = memo(({ coords }: Props) => {
    const [showOptions, setShowOptions] = useState<boolean>(false)

    const handleShowOptions = useCallback((): void => {
        setShowOptions(prev => !prev);
    }, []);

    return (
        <div className="flex gap-2 w-full relative">

            {/* start btn */}
            <button
                type='button'
                className="flex-1 flex justify-center items-center gap-2 py-3 bg-[#0C79FE] text-white rounded-md hover:brightness-110 active:scale-[0.98] transition-all uppercase text-[11px] font-bold tracking-[2px] shadow-lg shadow-blue-500/20"
            >
                <CarFront size={18} strokeWidth={2.5} />
                <span>Start</span>
            </button>

            {/* more btn */}
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
                    <Options
                        setShowOptions={setShowOptions}
                        coords={coords}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}, (prevProps, nextProps) => {
    return (
        prevProps.coords.lat === nextProps.coords.lat &&
        prevProps.coords.lng === nextProps.coords.lng
    );
});

export default QuickBtns;