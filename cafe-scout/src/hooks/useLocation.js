import { useState, useEffect } from 'react'

// useLocation asks the browser for the user's GPS coordinates.
// Returns: { location: {lat, lng}, locationError }
export default function useLocation() {
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    // Check if the browser supports geolocation at all
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }

    // Ask the browser for the user's position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success — store lat and lng in state
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => {
        // User denied or something went wrong
        setLocationError(err.message)
      }
    )
  }, []) // Empty array = runs once when the component first mounts

  return { location, locationError }
}