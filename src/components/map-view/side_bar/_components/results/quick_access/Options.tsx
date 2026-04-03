'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Share2, Bookmark, Navigation2, Info } from 'lucide-react'
import { useFavorites } from '@/hooks/useAddToFavors'
import { toast } from 'sonner'

type OptionsProps = {
    setShowOptions: (val: boolean) => void,
    showOptions: boolean,
    coords: {
        lat: number,
        lng: number,
    }
}

function Options({ showOptions, setShowOptions, coords }: OptionsProps) {
    const { addToFavors } = useFavorites()

    const handleShare = () => {
        const fullUrl = window.location.href;
        navigator.clipboard.writeText(fullUrl);
        toast.success("Link copied to clipboard!");
    }

    const menuItems = [
        {
            icon: <Navigation2 size={16} />,
            label: 'Directions',
            color: 'text-blue-500',
            function: () => window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank'),
            message: 'Opening Google Maps...'
        },
        {
            icon: <Bookmark size={16} />,
            label: 'Save Place',
            color: 'text-yellow-500',
            function: () => addToFavors(coords),
            message: 'Added to your favorites!'
        },
        {
            icon: <Share2 size={16} />,
            label: 'Share',
            color: 'text-green-500',
            function: handleShare,
            message: ''
        }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-16 right-0 w-48 bg-window border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-md"
        >
            <div className="flex flex-col p-1">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setShowOptions(false);
                            if (item.function) {
                                item.function();
                            }
                            if (item.message) {
                                toast.success(item.message);
                            }
                        }}
                        className="flex items-center gap-3 w-full p-3 hover:bg-secondary/50 transition-colors rounded-xl group"
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
        </motion.div>
    )
}

export default Options