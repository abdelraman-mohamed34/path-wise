'use client'
import { AppDispatch } from '@/app/store';
import useDebounce from '@/hooks/useDebounce';
import { searchLocation } from '@/store/location/locationSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

interface ResultsProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

function SearchInput({ searchTerm, setSearchTerm }: ResultsProps) {

    const dispatch = useDispatch<AppDispatch>()

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const debouncedSearch = useDebounce(searchTerm, 300);
    useEffect(() => {
        if (!debouncedSearch || !searchTerm || debouncedSearch.length < 2) return
        dispatch(searchLocation(debouncedSearch))
    }, [debouncedSearch, dispatch])

    console.log('SearchInput.tsx rendered')

    return (
        <div className="relative group mb-3">
            <MagnifyingGlassIcon className="absolute md:left-4 left-[10px] top-1/2 -translate-y-1/2 md:size-5 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
                type="text"
                placeholder="Search for a place..."
                value={searchTerm}
                onChange={handleSearch}
                className="md:text-xd text-[13px] w-full h-[36px] md:pl-10 pl-8 pr-4 bg-secondary rounded-[8px] focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            />
        </div>
    )
}

export default SearchInput
