import { useState, useEffect } from 'react'

export default function useLocation() {
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => {
        console.warn('Location error:', err.code, err.message)
        setLocationError(err.message || 'Location access denied.')
      },
      {
        enableHighAccuracy: true,  // triggers GPS popup on mobile
        timeout: 15000,            // wait up to 15 seconds
        maximumAge: 0,             // always fresh — no cached location
      }
    )
  }, [])

  return { location, locationError }
}