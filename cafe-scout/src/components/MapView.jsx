import { useState, useRef, useCallback, useEffect } from 'react'
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

  // Pan to selected café when it changes
  useEffect(() => {
    if (selectedCafe && mapRef.current && window.google) {
      const lat = selectedCafe.location?.lat
      const lng = selectedCafe.location?.lng
      if (typeof lat === 'number' && typeof lng === 'number') {
        mapRef.current.panTo({ lat, lng })
        mapRef.current.setZoom(17)
        setHoveredCafe(selectedCafe)
      }
    }
  }, [selectedCafe])

  const center = userLocation || { lat: 14.2163, lng: 121.1620 }

  const handleMarkerClick = useCallback((cafe) => {
    onSelectCafe(cafe)
    setHoveredCafe(cafe)
  }, [onSelectCafe])

  if (loadError) {
    return (
      <div style={S.center}>
        <p style={{ fontSize: 13, color: '#8B7355' }}>Map failed to load</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div style={S.center}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, animation: 'mapFloat 1.5s ease-in-out infinite' }}>🗺</div>
          <p style={{ fontSize: 12, color: '#A89070', marginTop: 8, fontFamily: "'DM Sans', system-ui" }}>
            Loading map...
          </p>
        </div>
        <style>{`
          @keyframes mapFloat {
            0%,100% { transform: translateY(0) rotate(-5deg); }
            50%      { transform: translateY(-8px) rotate(5deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={14}
      options={mapOptions}
      onLoad={onLoad}
      onClick={() => setHoveredCafe(null)}
    >
      {/* User location blue dot */}
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
        const isSelected = selectedCafe?.id === cafe.id || selectedCafe?.name === cafe.name
        const isHovered = hoveredCafe?.id === cafe.id || hoveredCafe?.name === cafe.name
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

      {/* ── InfoWindow popup with photo ── */}
      {hoveredCafe && (
        <InfoWindow
          position={hoveredCafe.location}
          onCloseClick={() => setHoveredCafe(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
        >
          <div style={S.infoWrap}>

            {/* Photo or emoji fallback */}
            {hoveredCafe.photo ? (
              <div style={S.photoWrap}>
                <img
                  src={hoveredCafe.photo}
                  alt={hoveredCafe.name}
                  style={S.photo}
                />
              </div>
            ) : (
              <div style={S.photoFallback}>☕</div>
            )}

            {/* Details */}
            <div style={S.infoBody}>
              <div style={S.infoName}>{hoveredCafe.name}</div>

              {/* Star rating */}
              {hoveredCafe.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, margin: '4px 0' }}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{
                      fontSize: 11,
                      color: i <= Math.round(hoveredCafe.rating) ? '#D97706' : '#D4C4B0'
                    }}>★</span>
                  ))}
                  <span style={{ fontSize: 11, color: '#A89070', marginLeft: 3 }}>
                    {hoveredCafe.rating}
                  </span>
                </div>
              )}

              {/* Open badge + review count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                {hoveredCafe.isOpen !== null && (
                  <span style={{
                    fontSize: 10, fontWeight: 500,
                    color: hoveredCafe.isOpen ? '#1D9E75' : '#E8554E',
                    background: hoveredCafe.isOpen ? '#E1F5EE' : '#FEE2E2',
                    padding: '2px 7px', borderRadius: 99,
                  }}>
                    {hoveredCafe.isOpen ? 'Open' : 'Closed'}
                  </span>
                )}
                {hoveredCafe.totalRatings > 0 && (
                  <span style={{ fontSize: 10, color: '#A89070' }}>
                    {hoveredCafe.totalRatings} reviews
                  </span>
                )}
              </div>

              {/* Address */}
              <div style={S.infoAddress}>{hoveredCafe.address}</div>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

const S = {
  center: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#F5EDE0',
  },
  infoWrap: {
  fontFamily: "'DM Sans', system-ui, sans-serif",
  width: '200px',
  background: '#ffffff',
  overflow: 'hidden',
  margin: '-11px -11px -11px -11px',
  padding: 0,
},
photoWrap: {
  width: '100%',
  height: 110,
  overflow: 'hidden',
},
photo: {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
},
photoFallback: {
  width: '100%', height: 80,
  background: 'linear-gradient(135deg, #F0E6D3, #E8DDD0)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 24,
},
infoBody: {
  padding: '8px 10px 10px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
},
infoName: {
  fontWeight: 600, fontSize: 12,
  color: '#2C1810', lineHeight: 1.3, margin: 0,
},
infoAddress: {
  fontSize: 10, color: '#A89070',
  lineHeight: 1.4, margin: 0,
},
}