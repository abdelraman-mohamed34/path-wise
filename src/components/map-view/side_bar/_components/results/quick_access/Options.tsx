'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Share2, Bookmark, Navigation2 } from 'lucide-react'
import { useFavorites } from '@/hooks/useAddToFavors'
import { toast } from 'sonner'

type Coords = {
    lat: number;
    lng: number;
};

type OptionsProps = {
    setShowOptions: (val: boolean) => void,
    coords: Coords
}

type MenuItem = {
    icon: React.ReactNode;
    label: string;
    color: string;
    action: () => void;
    message?: string;
};

function Options({ setShowOptions, coords }: OptionsProps) {
    const { addToFavors } = useFavorites()

    const handleShare = async () => {
        try {
            const fullUrl = window.location.href;
            await navigator.clipboard.writeText(fullUrl);
            toast.success("URL copied");
        } catch (error) {
            toast.error("Failed to copy link");
        }
    };

    const menuItems: MenuItem[] = React.useMemo(() => [
        {
            icon: <Navigation2 size={16} />,
            label: 'Directions',
            color: 'text-blue-500',
            action: () => window.open(
                `https://www.google.com/maps?q=${coords.lat},${coords.lng}`,
                '_blank',
                'noopener,noreferrer'
            ),
            message: 'Opening Google Maps...'
        },
        {
            icon: <Bookmark size={16} />,
            label: 'Save Place',
            color: 'text-yellow-500',
            action: () => addToFavors(coords),
            message: 'Added to your favorites!'
        },
        {
            icon: <Share2 size={16} />,
            label: 'Share',
            color: 'text-green-500',
            action: handleShare,
        }
    ], [coords, addToFavors])

    const handleClick = (item: MenuItem) => {
        const doHandle = async () => {

            setShowOptions(false);

            await item.action();

            if (item.message) {
                toast.success(item.message);
            }
        }
        doHandle()
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-16 right-0 w-48 bg-window border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-md"
        >
            <div className="flex flex-col p-1">
                {menuItems.map((item) => (
                    <button
                        type="button"
                        key={item.label}
                        onClick={() => handleClick(item)}
                        className="flex items-center gap-2 w-full p-3 hover:bg-secondary/50 transition-colors rounded-xl group"
                    >
                        <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                            {item.icon}
                        </div>
                        <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </motion.div >
    )
}

export default Options