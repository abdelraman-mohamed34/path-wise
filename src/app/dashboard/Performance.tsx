import { ChartBarIcon } from 'lucide-react'
import React from 'react'

function Performance() {
    return (
        <div className="lg:col-span-2 bg-card border border-border rounded-[2.5rem] p-8 min-h-[400px] flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <ChartBarIcon className="size-6 text-primary" />
                    Performance Analytics
                </h2>
                <select className="bg-secondary border-none rounded-xl text-xs p-2 focus:ring-0">
                    <option>Last 7 Days</option>
                    <option>Last Month</option>
                </select>
            </div>

            {/* هنا تضع رابط Canva الخاص بك */}
            <div className="flex-1 w-full relative overflow-hidden rounded-2xl bg-muted/30 flex items-center justify-center border-2 border-dashed border-border group">
                {/* إذا كان عندك Embed Code من كانفا ضعه هنا، أو استخدم صورة حالياً */}
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Insert your Canva Chart here</p>
                    <div className="aspect-video w-full max-w-md bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl animate-pulse border border-primary/20" />
                </div>
                {/* نصيحة: استخدم <iframe /> إذا كان رسم كانفا تفاعلي */}
            </div>
        </div>
    )
}

export default Performance
