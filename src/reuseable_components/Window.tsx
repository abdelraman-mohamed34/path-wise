import React, { memo } from 'react'
import H2 from './H2';
import { useSearchParams } from 'next/navigation';

interface WindowProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    dontShowTitleAt?: string;
    onClick?: () => void;
}

function Window({ children, onClick, title, dontShowTitleAt, className = "" }: WindowProps) {
    const searchParams = useSearchParams();
    const view = searchParams.get('view');

    const shouldShowTitle = title && (!view || view !== dontShowTitleAt);

    return (
        <>
            {shouldShowTitle && <H2>{title}</H2>}

            <div
                onClick={onClick}
                className={`bg-window w-full min-h-20 rounded-md mb-2 p-2 ${className}`}
            >
                {children}
            </div>
        </>
    )
}

export default memo(Window)