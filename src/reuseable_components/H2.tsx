import React, { ReactNode } from 'react'

type H2Types = {
    children: ReactNode,
    className?: string
    classNameChild?: string
}

function H2({ children, className = "", classNameChild = "" }: H2Types) {
    return (
        <div className={`flex items-center mb-1 text-muted-foreground ${className}`}>
            <h2 className={`text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] ${classNameChild}`}>
                {children}
            </h2>
        </div>
    )
}

export default H2
