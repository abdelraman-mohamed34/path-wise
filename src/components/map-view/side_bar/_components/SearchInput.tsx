'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import useDebounce from '@/hooks/useDebounce'
import { setSearch } from '@/store/global_data/dataSlice' // تأكد من المسار
import { searchLocation } from '@/store/location/locationSlice'

function SearchInput() {
    const dispatch = useDispatch<AppDispatch>()
    const [typed, setTyped] = useState('')

    const debouncedSearch = useDebounce(typed, 300)

    useEffect(() => {

        dispatch(setSearch(debouncedSearch))
        if (debouncedSearch && debouncedSearch.length >= 2) {
            dispatch(searchLocation(debouncedSearch))
        }
    }, [debouncedSearch, dispatch])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTyped(e.target.value)
    }

    return (
        <div className="relative group mb-3">
            <MagnifyingGlassIcon className="absolute md:left-4 left-[10px] top-1/2 -translate-y-1/2 md:size-5 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
                type="text"
                placeholder="Search for a place..."
                value={typed}
                onChange={handleSearch}
                className="md:text-xd text-[13px] w-full h-[36px] md:pl-10 pl-8 pr-4 bg-secondary rounded-[8px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            />
        </div>
    )
}

export default SearchInput