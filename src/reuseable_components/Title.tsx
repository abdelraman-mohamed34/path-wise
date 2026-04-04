import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

type Title = {
    text: string,
    className?: string,
    icon?: ReactNode,
}
function Title({ text, icon, className = "" }: Title) {
    const router = useRouter()
    return (
        <div className={`w-full flex justify-between items-center mb-3 ${className}`}>
            <h1 className='text-2xl font-black tracking-tighter'>{text}</h1>
            <button
                type='button'
                onClick={() => router.back()}
                className='bg-secondary p-2 rounded-full active:scale-90 transition-transform'
            >
                <ArrowRight className="size-5" />
            </button>
        </div>
    )
}

export default React.memo(Title)
