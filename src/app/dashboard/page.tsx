"use client";
import {
    MapIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
import Performance from "./Performance";

export default function page() {

    const stats = [
        { name: "Total Routes", value: "128", icon: MapIcon, color: "text-blue-500" },
        { name: "Time Saved", value: "24h 15m", icon: ClockIcon, color: "text-green-500" },
        { name: "Distance Optimized", value: "1,420 km", icon: ArrowTrendingUpIcon, color: "text-purple-500" },
    ];

    return (
        <div className="min-h-screen bg-background p-6 md:p-10 transition-colors duration-300">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, Guest!</h1>
                    <p className="text-muted-foreground mt-1">Here's what's happening with your routes today.</p>
                </div>
                <div className="flex items-center gap-3 bg-card p-2 rounded-2xl border border-border shadow-sm">
                    <UserCircleIcon className="size-10 text-muted-foreground" />
                    <div className="pr-4">
                        <p className="text-sm font-semibold">Premium Plan</p>
                        <p className="text-xs text-muted-foreground">Cairo, Egypt</p>
                    </div>
                </div>
            </header>

            {/* Stats Grid*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-card/50 backdrop-blur-md border border-border p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`size-8 ${stat.color}`} />
                            <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-full">+12%</span>
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">{stat.name}</p>
                        <h3 className="text-2xl font-bold mt-1 text-card-foreground">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Content (Canva + Recent Activity) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Analytics Chart */}
                <Performance />

            </div>
        </div>
    );
}