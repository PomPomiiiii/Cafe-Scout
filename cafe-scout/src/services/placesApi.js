// placesApi.js — uses the Places JavaScript API

export function fetchNearbyCafes(lat, lng, radius = 1500) {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error("Google Maps not loaded yet"));
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div"),
    );

    let allCafes = [];

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius,
      type: "cafe",
    };

    function callback(results, status, pagination) {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK ||
        status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
      ) {
        if (results) {
          const batch = results.map((place) => ({
            id: place.place_id,
            name: place.name,
            rating: place.rating || null,
            totalRatings: place.user_ratings_total || 0,
            address: place.vicinity,

            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },

            photo: place.photos?.[0]?.getUrl({ maxWidth: 400 }) ?? null,

            priceLevel: place.price_level ?? null,

            isOpen:
              place.opening_hours?.open_now ?? null,
          }));

          allCafes = [...allCafes, ...batch];
        }

        // Pagination
        if (pagination && pagination.hasNextPage) {
          setTimeout(() => {
            pagination.nextPage();
          }, 2000);
        } else {
          resolve(allCafes);
        }
      } else {
        allCafes.length > 0
          ? resolve(allCafes)
          : reject(new Error(`Places API error: ${status}`));
      }
    }

    service.nearbySearch(request, callback);
  });
}
