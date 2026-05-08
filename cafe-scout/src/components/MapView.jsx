import { useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const LIBRARIES = ["places"];
const mapContainerStyle = { width: "100%", height: "100%" };

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#f5efe6" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#6b4f3a" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#faf7f2" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e8ddd0" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f0e6d3" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e0ed" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d4e8c2" }] },
    { featureType: "poi.business", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  ],
};

function StarRating({ rating }) {
  if (!rating) return null;

  const full = Math.floor(rating);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            fontSize: "11px",
            color: i <= full ? "#D97706" : "#D4C4B0",
          }}
        >
          ★
        </span>
      ))}
      <span style={{ fontSize: "11px", color: "#8B7355", marginLeft: "3px" }}>
        {rating}
      </span>
    </div>
  );
}

export default function MapView({
  cafes,
  selectedCafe,
  onSelectCafe,
  userLocation,
}) {
  const center = userLocation || { lat: 14.2163, lng: 121.162 };

  const handleMarkerClick = useCallback(
    (cafe) => {
      onSelectCafe(cafe);
    },
    [onSelectCafe]
  );

  return (
    <LoadScript googleMapsApiKey={MAPS_API_KEY} libraries={LIBRARIES}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedCafe ? selectedCafe.location : center}
        zoom={selectedCafe ? 16 : 14}
        options={mapOptions}
        onClick={() => onSelectCafe(null)}
      >
        {/* User location */}
        {userLocation && (
          <Marker
            position={userLocation}
            zIndex={999}
            icon={{
              path: "M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0",
              fillColor: "#3B82F6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2.5,
              scale: 1.8,
            }}
          />
        )}

        {/* Café markers */}
        {cafes.map((cafe, index) => {
          const isSelected = selectedCafe?.id === cafe.id;
          const isTop = index === 0;

          return (
            <Marker
              key={cafe.id}
              position={cafe.location}
              zIndex={isSelected ? 100 : index}
              onClick={() => handleMarkerClick(cafe)}
              label={{
                text: isTop ? "★" : `${index + 1}`,
                color: "#ffffff",
                fontSize: isTop ? "12px" : "10px",
                fontWeight: "bold",
              }}
              icon={{
                path: "M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0",
                fillColor: isTop
                  ? "#2C1810"
                  : isSelected
                  ? "#8B5E3C"
                  : "#A89070",
                fillOpacity: 1,
                strokeColor: isSelected ? "#FAF7F2" : "#ffffff",
                strokeWeight: isSelected ? 3 : 2,
                scale: isSelected ? 2.2 : isTop ? 2.0 : 1.7,
              }}
            />
          );
        })}

        {/* InfoWindow */}
        {selectedCafe && (
          <InfoWindow
            position={selectedCafe.location}
            onCloseClick={() => onSelectCafe(null)}
          >
            <div
              style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                width: "240px",
                background: "#FAF7F2",
                overflow: "hidden",
              }}
            >
              {/* Photo */}
              {selectedCafe.photo ? (
                <div style={{ height: "110px", overflow: "hidden" }}>
                  <img
                    src={selectedCafe.photo}
                    alt={selectedCafe.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    height: "80px",
                    background: "linear-gradient(135deg, #F0E6D3, #E8DDD0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                  }}
                >
                  ☕
                </div>
              )}

              {/* Info */}
              <div style={{ padding: "12px" }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#2C1810",
                    marginBottom: "4px",
                  }}
                >
                  {selectedCafe.name}
                </div>

                <StarRating rating={selectedCafe.rating} />

                <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: selectedCafe.isOpen ? "#1D9E75" : "#E8554E",
                      background: selectedCafe.isOpen
                        ? "#E1F5EE"
                        : "#FEE2E2",
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {selectedCafe.isOpen ? "Open" : "Closed"}
                  </span>

                  <span style={{ fontSize: "10px", color: "#A89070" }}>
                    {selectedCafe.totalRatings} reviews
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#A89070",
                    marginTop: "6px",
                  }}
                >
                  {selectedCafe.address}
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}