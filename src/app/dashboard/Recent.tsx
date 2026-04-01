import React from 'react'

function Recent() {
    return (
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Recent Routes</h2>
            <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4 border-b border-border pb-4 last:border-0">
                        <div className="size-10 bg-secondary rounded-xl flex items-center justify-center shrink-0 text-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Cairo to Alexandria</p>
                            <p className="text-xs text-muted-foreground">Optimized: -15 mins saved</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground mr-auto">2h ago</span>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-3 text-primary font-semibold text-sm hover:bg-primary/5 rounded-xl transition-colors">
                View All History
            </button>
        </div>
    )
}

export default Recent
