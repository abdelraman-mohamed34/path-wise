import { MapPinIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface LocationCardProps {
    item: any;
    onClick: (coords: { lat: number; lng: number }) => void;
}

export const LocationCard = ({ item, onClick }: LocationCardProps) => (
    <button
        onClick={() => onClick(item.coords)}
        className="w-full group relative flex items-center gap-4 p-4 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/40 hover:bg-secondary/40 transition-all duration-300 text-left shadow-sm overflow-hidden"
    >
        <div className="flex-shrink-0 flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <MapPinIcon className="size-5" />
        </div>
        <div className="flex-1 min-w-0 z-10">
            <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                {item.name}
            </h3>
            <p className="text-[10px] font-mono text-muted-foreground/80 mt-0.5">
                {item.coords.lat.toFixed(4)}° N, {item.coords.lng.toFixed(4)}° E
            </p>
        </div>
        <ChevronRightIcon className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </button>
);