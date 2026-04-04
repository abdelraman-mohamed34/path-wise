// src/components/map-view/side_bar/_components/SearchInput.tsx

'use client'
import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/app/store'
import useDebounce from '@/hooks/useDebounce'
import { setSearch } from '@/store/global_data/dataSlice'
import { searchLocation } from '@/store/location/locationSlice' // ← ضيف الـ import

export default function SearchInput() {
    const dispatch = useDispatch<AppDispatch>() // ← AppDispatch مش just useDispatch
    const globalSearchTerm = useSelector((state: RootState) => state.data.inputSearch) || ""
    const [localValue, setLocalValue] = useState(globalSearchTerm)
    const debouncedValue = useDebounce(localValue, 300)

    // ✅ بيحدّث الـ Redux state (للـ UI)
    useEffect(() => {
        dispatch(setSearch(debouncedValue || ""))
    }, [debouncedValue, dispatch])

    // ✅ بيعمل الـ API call لما الـ search يتغير
    useEffect(() => {
        if (debouncedValue && debouncedValue.trim().length >= 2) {
            dispatch(searchLocation(debouncedValue))
        }
    }, [debouncedValue, dispatch])

    useEffect(() => {
        setLocalValue(globalSearchTerm)
    }, [globalSearchTerm])

    return (
        <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder="Search for places..."
                className="w-full h-11 bg-secondary/50 border-none rounded-xl pl-10 pr-10 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
            {localValue && (
                <button
                    onClick={() => {
                        setLocalValue("");
                        dispatch(setSearch(""));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                    <X className="size-3.5 text-muted-foreground" />
                </button>
            )}
        </div>
    )
}