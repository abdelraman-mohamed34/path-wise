'use client'
import Window from '@/reuseable_components/Window';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { MapPin, Clock, Copy } from 'lucide-react';
import QuickBtns from './quick_access/QuickBtns';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

interface DetailCardProps {
    location: any;
    onBack: () => void;
}

export const DetailCard = ({ location, onBack }: DetailCardProps) => {


    const handleCopyAddress = () => {
        if (location?.name) {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Address copied to clipboard");
        }
    }

    console.log(location.coords)
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full bg-card py-2"
        >
            {/* Header: Name and Back Button */}
            <div className='w-full flex justify-between items-start mb-6'>
                <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-black text-foreground tracking-tighter leading-tight italic uppercase">
                        {location?.shortName || "Selected Location"}
                    </h2>
                    <div className='flex items-center gap-2 mt-1'>
                        <StarSolid className="size-4 text-amber-500" />
                        <span className="text-sm font-bold text-foreground">{location?.rating || "0.0"}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                            • {location?.reviewsCount || 0} reviews
                        </span>
                    </div>
                </div>
                <button
                    onClick={onBack}
                    className="p-2 bg-secondary/50 hover:bg-destructive hover:text-white rounded-full transition-all active:scale-90 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="space-y-4">

                {/* Quick Action Buttons */}
                <QuickBtns coords={location.coords} />

                {/* Detailed Info List */}
                <Window title='Location Details' className='p-4 space-y-5'>
                    {/* Address with Copy Option */}
                    <div className="flex items-start gap-4 group/item">
                        <div className="p-2 bg-red-500/10 rounded-full">
                            <MapPin className="size-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-1">Address</p>
                            <p className="text-sm font-semibold text-foreground/90 leading-relaxed max-w-[200px]">
                                {location?.name || "Address not available"}
                            </p>
                        </div>
                        <button
                            onClick={handleCopyAddress}
                            className="opacity-0 group-hover/item:opacity-100 p-2 hover:bg-secondary rounded-lg transition-all"
                        >
                            <Copy className="size-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Status / Hours */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-full">
                            <Clock className="size-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-1">Business Hours</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold pr-1 rounded-full ${location?.isOpen ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {location?.isOpen ? 'OPEN' : 'CLOSED'}
                                </span>
                                <span className="text-xs text-muted-foreground font-medium italic">
                                    • {location?.hours || "Check schedule"}
                                </span>
                            </div>
                        </div>
                    </div>
                </Window>
            </div>
        </motion.div>
    );
}