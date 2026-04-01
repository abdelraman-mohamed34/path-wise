import { AppDispatch } from '@/app/store';
import useDebounce from '@/hooks/useDebounce';
import { searchLocation } from '@/store/location/location';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

function SearchInput() {

    const [searchTerm, setSearchTerm] = useState<string>("")
    const dispatch = useDispatch<AppDispatch>()

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const debouncedSearch = useDebounce(searchTerm, 300);
    useEffect(() => {
        if (!debouncedSearch || !searchTerm || debouncedSearch.length < 2) return
        dispatch(searchLocation(debouncedSearch))
    }, [debouncedSearch, dispatch])

    return (
        <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
                type="text"
                placeholder="Search for a place..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full h-12 pl-12 pr-4 bg-secondary/50 rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
        </div>
    )
}

export default SearchInput
