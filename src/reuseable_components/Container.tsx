import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
    return (
        <div className={cn(
            "w-full",
            "animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out",
            className
        )}>
            {children}
        </div>
    );
};

export default Container;