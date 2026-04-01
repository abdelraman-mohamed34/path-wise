'use client'

import Results from './Results'
import SearchInput from './SearchInput'

function Sidebar() {

    return (
        <aside className="absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:w-96 z-10 md:p-4 pointer-events-none">
            <div className="h-[40vh] md:h-full w-full bg-card/80 backdrop-blur-xl md:border border-border shadow-2xl rounded-t-[2.5rem] md:rounded-3xl pointer-events-auto p-7 md:pb-7 pb-10 flex flex-col gap-6 transition-all duration-500 ease-in-out">

                {/* search-box */}
                <SearchInput />

                {/* Scrollable // skeleton*/}
                <Results />

                {/* action */}
                <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all">
                    Optimize My Route
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
