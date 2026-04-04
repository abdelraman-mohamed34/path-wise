'use client'
import Window from '@/reuseable_components/Window';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { MapPin, Clock, Copy, X } from 'lucide-react';
import QuickBtns from './quick_access/QuickBtns';
import { toast } from 'sonner';
import Suggestion from '@/reuseable_components/Suggestion';

interface DetailCardProps {
    location: any;
    onBack: () => void;
}

export const DetailCard = ({ location, onBack }: DetailCardProps) => {

    const handleCopyAddress = () => {
        if (location?.name) {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full flex flex-col h-full bg-card"
        >
            <div className='w-full flex justify-between items-start mb-4 px-1'>
                <div className="flex-1 overflow-hidden pr-2">
                    <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tighter leading-tight italic uppercase truncate">
                        {location?.name || "Selected Location"}
                    </h2>
                    <div className='flex items-center gap-2 mt-1'>
                        <StarSolid className="size-4 text-amber-500 shrink-0" />
                        <span className="text-sm font-bold text-foreground">{location?.rating || "0.0"}</span>
                        <span className="text-[10px] text-muted-foreground font-medium truncate">
                            • {location?.reviewsCount || 0} reviews
                        </span>
                    </div>
                </div>
                <button
                    type='button'
                    onClick={onBack}
                    className="p-2 bg-secondary/50 hover:bg-destructive hover:text-white rounded-full transition-all active:scale-90 shrink-0"
                >
                    <X className="size-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-5 pb-6">

                <QuickBtns coords={location?.coords} />

                {/* Detailed Info List */}
                <Window title='Location Details' className='p-4 space-y-5'>
                    {/* Address section */}
                    <div className="flex items-start gap-4 group/item">
                        <div className="p-2.5 bg-red-600/10 rounded-xl shrink-0">
                            <MapPin className="size-5 text-red-600" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-1">Address</p>
                            <p className="text-sm font-semibold text-foreground/90 leading-snug line-clamp-2">
                                {location?.name || "Address not available"}
                            </p>
                        </div>
                        <button
                            type='button'
                            onClick={handleCopyAddress}
                            className="opacity-0 group-hover/item:opacity-100 p-2 hover:bg-secondary rounded-lg transition-all shrink-0"
                        >
                            <Copy className="size-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Status / Hours */}
                    <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-blue-600/10 rounded-xl shrink-0">
                            <Clock className="size-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-1">Business Hours</p>
                            <div className="flex items-center flex-wrap gap-x-2">
                                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${location?.isOpen ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                    {location?.isOpen ? 'OPEN' : 'CLOSED'}
                                </span>
                                <span className="text-xs text-muted-foreground font-medium italic">
                                    • {location?.hours || "Check schedule"}
                                </span>
                            </div>
                        </div>
                    </div>
                </Window>

                <div className="pt-2">
                    <Suggestion sliceTo={3} />
                </div>
            </div>
        </motion.div>
    );
}