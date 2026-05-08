import { useState, useEffect } from 'react'
import { fetchNearbyCafes } from '../services/placesApi'

export default function useCafes(location, filters) {
  const [cafes, setCafes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!location) return

    // Wait for Google Maps SDK to be ready
    const interval = setInterval(async () => {
      if (!window.google) return
      clearInterval(interval)

      setLoading(true)
      setError(null)

      try {
        let results = await fetchNearbyCafes(location.lat, location.lng, filters.radius)

        if (filters.openNow) {
          results = results.filter((c) => c.isOpen === true)
        }
        if (filters.minRating > 0) {
          results = results.filter((c) => c.rating >= filters.minRating)
        }

        results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        setCafes(results)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 300) // check every 300ms until Google Maps is ready

    return () => clearInterval(interval)
  }, [location, filters.radius, filters.openNow, filters.minRating])

  return { cafes, loading, error }
}