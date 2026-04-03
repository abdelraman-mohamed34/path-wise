import React, { ReactNode } from 'react'

type ContainerTypes = {
    children: ReactNode,
    className?: string,
}

function Container({ children, className = "" }: ContainerTypes) {
    return (
        <div className={`w-full animate-in fade-in slide-in-from-bottom-4 duration-500 scrollbar-none ${className}`}>
            {children}
        </div>
    )
}

export default Container
