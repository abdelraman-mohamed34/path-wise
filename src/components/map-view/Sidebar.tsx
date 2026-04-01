'use client'

import { Bars3BottomLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

function Sidebar() {
    return (
        <aside className="absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:w-96 z-10 md:p-4 pointer-events-none">
            <div className="h-[40vh] md:h-full w-full bg-card/80 backdrop-blur-xl md:border border-border shadow-2xl rounded-t-[2.5rem] md:rounded-3xl pointer-events-auto p-7 md:pb-7 pb-10 flex flex-col gap-6 transition-all duration-500 ease-in-out">

                {/* search-box */}
                <div className="relative group">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for a place..."
                        className="w-full h-12 pl-12 pr-4 bg-secondary/50 rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* Scrollable // skeleton*/}
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                    <div className="p-4 bg-muted/40 rounded-2xl border border-border/50">
                        <div className="h-4 w-1/2 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="p-4 bg-muted/40 rounded-2xl border border-border/50">
                        <div className="h-4 w-1/2 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* action */}
                <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all">
                    Optimize My Route
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
