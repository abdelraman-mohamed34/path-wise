import React from 'react'
import H2 from './H2';

interface WindowProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    onClick?: () => void;
}

function Window({ children, onClick, title, className = "" }: WindowProps) {
    return (

        <>
            {title && <H2>{title}</H2>}
            <div
                onClick={onClick}
                className={`bg-window w-full min-h-20 rounded-md mb-2 ${className}`}
            >
                {children}
            </div>
        </>
    )
}

export default React.memo(Window)