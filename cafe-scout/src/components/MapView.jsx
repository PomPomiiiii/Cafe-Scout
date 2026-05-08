import { useState, useRef, useEffect, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY
const LIBRARIES = ['places']
const mapContainerStyle = { width: '100%', height: '100%' }

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#f5efe6' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#6b4f3a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#faf7f2' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e8ddd0' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f0e6d3' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e0ed' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4e8c2' }] },
    { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  ],
}

export default function MapView({ cafes, selectedCafe, onSelectCafe, userLocation }) {
  const [hoveredCafe, setHoveredCafe] = useState(null)
  const mapRef = useRef(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY,
    libraries: LIBRARIES,
  })

  const onLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  // ── THE REDIRECT LOGIC ──
  useEffect(() => {
    // 1. Ensure map is loaded and a cafe is actually selected
    if (selectedCafe && mapRef.current && window.google) {
      
      // 2. Extract coordinates safely (Gemini might return them slightly differently)
      const lat = selectedCafe.location?.lat || selectedCafe.geometry?.location?.lat;
      const lng = selectedCafe.location?.lng || selectedCafe.geometry?.location?.lng;

      if (typeof lat === 'number' && typeof lng === 'number') {
        const target = { lat, lng };
        
        // 3. Perform the glide
        mapRef.current.panTo(target);
        mapRef.current.setZoom(17);
        
        // 4. Highlight it immediately
        setHoveredCafe(selectedCafe);
      }
    }
  }, [selectedCafe]);

  const center = userLocation || { lat: 14.2163, lng: 121.1620 }

  const handleMarkerClick = useCallback((cafe) => {
    onSelectCafe(cafe)
    setHoveredCafe(cafe)
  }, [onSelectCafe])

  if (loadError) return <div style={S.center}>Map failed to load</div>
  if (!isLoaded) return <div style={S.center}>Loading map...</div>

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center} 
      zoom={14}
      options={mapOptions}
      onLoad={onLoad}
      onClick={() => setHoveredCafe(null)}
    >
      {/* User location dot */}
      {userLocation && (
        <Marker
          position={userLocation}
          zIndex={999}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2.5,
            scale: 7,
          }}
        />
      )}

      {/* Café markers */}
      {cafes.map((cafe, index) => {
        // Use name matching as a fallback if IDs are inconsistent between API and AI
        const isSelected = selectedCafe?.id === cafe.id || selectedCafe?.name === cafe.name;
        const isHovered = hoveredCafe?.id === cafe.id || hoveredCafe?.name === cafe.name;
        const isTop = index === 0

        return (
          <Marker
            key={cafe.id || index}
            position={cafe.location}
            zIndex={isSelected || isHovered ? 100 : index}
            onClick={() => handleMarkerClick(cafe)}
            onMouseOver={() => setHoveredCafe(cafe)}
            label={{
              text: isTop ? '★' : `${index + 1}`,
              color: '#fff',
              fontSize: isTop ? '12px' : '10px',
              fontWeight: 'bold',
            }}
            icon={{
              path: 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
              fillColor: isTop ? '#2C1810' : isSelected ? '#8B5E3C' : '#A89070',
              fillOpacity: 1,
              strokeColor: isSelected || isHovered ? '#FAF7F2' : '#ffffff',
              strokeWeight: isSelected || isHovered ? 3 : 2,
              scale: isSelected || isHovered ? 2.2 : isTop ? 2.0 : 1.7,
            }}
          />
        )
      })}

      {/* InfoWindow popup */}
      {hoveredCafe && (
        <InfoWindow
          position={hoveredCafe.location}
          onCloseClick={() => setHoveredCafe(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
        >
          <div style={S.infoContainer}>
             <div style={S.infoTitle}>{hoveredCafe.name}</div>
             <div style={S.infoAddress}>{hoveredCafe.address}</div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

const S = {
  center: { 
    width: '100%', height: '100%', display: 'flex', 
    alignItems: 'center', justifyContent: 'center', background: '#F5EDE0' 
  },
  infoContainer: {
    fontFamily: "'DM Sans', sans-serif", width: 180, padding: '4px'
  },
  infoTitle: { fontWeight: 600, fontSize: 13, color: '#2C1810', marginBottom: 2 },
  infoAddress: { fontSize: 11, color: '#A89070', lineHeight: 1.3 }
}