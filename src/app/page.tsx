'use client'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { useEffect } from "react";
import Map from "@/components/map-view/main_map/Map";
import { fetchCloser } from "@/store/details/api/fetchClosestPlacesThunk";
import { addToRecentSearched } from "@/store/details/detailsSlice";

type Coords = {
  name?: string
  lat: number,
  lng: number
}

export default function Home() {

  const dispatch = useDispatch<AppDispatch>()
  const COORDS_EXPIRY_MS = 24 * 60 * 60 * 1000

  useEffect(() => {
    const saved = localStorage.getItem('userCoords')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const isExpired = Date.now() - parsed.timestamp > COORDS_EXPIRY_MS

        if (!isExpired) {
          dispatch(fetchCloser({ lat: parsed.lat, lng: parsed.lng }))
          return
        }
      } catch (e) {
        console.error("Parse error", e)
      }
    }

    navigator.geolocation.getCurrentPosition(
      (p) => {
        const coords = {
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          timestamp: Date.now()
        }
        dispatch(fetchCloser(coords))
        localStorage.setItem('userCoords', JSON.stringify(coords))
      },
      (e) => console.log(`cant get location: ${e}`)
    )
  }, [])

  // get recent
  useEffect(() => {
    const recentFromLocalStorage: (string | null) = localStorage.getItem('recent')
    let recentSearched: (Coords | null) = null
    if (recentFromLocalStorage) { recentSearched = JSON.parse(recentFromLocalStorage) }
    if (recentSearched) { dispatch(addToRecentSearched(recentSearched)) }
  }, [])

  return (
    <>
      <Map />
    </>
  );
}
