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

  // get current coords
  useEffect(() => {
    const savedCoords: (string | null) = localStorage.getItem('userCoords')
    let rightType: (Coords | null) = null; // coords or null

    if (savedCoords) {
      try {
        rightType = JSON.parse(savedCoords);
      } catch (e) {
        console.error("Parse error", e);
      }
    }

    if (rightType) {
      dispatch(fetchCloser(rightType))
    } else {
      // get user coords
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const coords = { lat: p.coords.latitude, lng: p.coords.longitude }
          dispatch(fetchCloser(coords))
          localStorage.setItem('userCoords', JSON.stringify(coords))
        },
        (e) => {
          console.log(`cant get this location, ${e}`)
        }
      )
    }
  }, [])

  // get recent
  useEffect(() => {
    const recentFromLocalStorage: (string | null) = localStorage.getItem('recent')
    let recentSearched: (Coords | null) = null
    if (recentFromLocalStorage) {
      recentSearched = JSON.parse(recentFromLocalStorage)
    }
    if (recentSearched) {
      dispatch(addToRecentSearched(recentSearched))
    }
  }, [])

  return (
    <>
      <Map />
    </>
  );
}
