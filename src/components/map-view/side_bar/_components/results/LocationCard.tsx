import Window from '@/reuseable_components/Window';
import { ChevronLeft, MapPin } from 'lucide-react';

interface LocationCardProps {
    item: any;
    onClick: (coords: { lat: number; lng: number }) => void;
}

export default function LocationCard({ item, onClick }: LocationCardProps) {

    return (
        <Window
            onClick={() => onClick(item.coords)}
            className="cursor-pointer w-full group relative flex items-center gap-4 p-4 bg-card/40 hover:border border border-transparent backdrop-blur-sm rounded-md hover:border-primary/40 hover:bg-secondary/40 transition-all duration-300 text-left shadow-sm overflow-hidden"
        >
            <div className="flex-shrink-0 flex items-center justify-center size-10 rounded-full bg-red-500 text-white transition-all duration-300">
                <MapPin className="size-5" />
            </div>
            <div className="flex-1 min-w-0 z-10">
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {item.name}
                </h3>
                <p className="text-[10px] font-mono text-muted-foreground/80 mt-0.5">
                    {item.coords.lat.toFixed(4)}° N, {item.coords.lng.toFixed(4)}° E
                </p>
            </div>
            <ChevronLeft className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Window>
    )
}