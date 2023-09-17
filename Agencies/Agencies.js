document.addEventListener("DOMContentLoaded", function () {
    const searchPlacesBtn = document.getElementById("searchPlacesBtn");
    const placeNameInput = document.getElementById("placeName");

    const map = L.map("map").setView([20.5937, 78.9629], 5); // Set the initial view to India

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    let markers = {};

    searchPlacesBtn.addEventListener("click", function () {
      const placeQuery = placeNameInput.value;

      if (!placeQuery) {
        alert("Please enter a place to search.");
        return;
      }

      searchPlaces(placeQuery);
    });

    function searchPlaces(query) {
      clearMarkers();

      // Use the OpenCage Geocoding API to search for places
      const opencageApiKey = "9e3124ee85554f2c988e686cdc55da9d";
      const opencageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        query
      )}&key=${opencageApiKey}`;

      fetch(opencageUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            data.results.forEach((result) => {
              const displayName = result.formatted;
              const latitude = result.geometry.lat;
              const longitude = result.geometry.lng;

              const marker = L.marker([latitude, longitude]).addTo(map);
              marker.bindPopup(displayName).openPopup();

              markers[displayName] = marker;

              updateLocationDetails(displayName, latitude, longitude);

              // Search for nearby places (e.g., hospitals, colleges, fire brigades)
              searchNearbyPlaces(latitude, longitude);
            });

            map.fitBounds(
              Object.values(markers).map((marker) => marker.getLatLng())
            );
          } else {
            alert("No places found matching the query.");
          }
        })
        .catch((error) => {
          alert("An error occurred while searching for places.");
        });
    }

    function clearMarkers() {
      Object.values(markers).forEach((marker) => map.removeLayer(marker));
      markers = {};
    }

    function updateLocationDetails(placeName, latitude, longitude) {
      const placeNameDetails = document.getElementById("placeNameDetails");
      const cityDetails = document.getElementById("cityDetails");
      const distanceDetails = document.getElementById("distanceDetails");
      const otherDetails = document.getElementById("otherDetails");

      placeNameDetails.textContent = `Place Name: ${placeName}`;
      cityDetails.textContent = `City: N/A`;
      distanceDetails.textContent = `Distance: N/A meters`;
      otherDetails.textContent = `Other Details: Latitude ${latitude}, Longitude ${longitude}`;
    }

    function searchNearbyPlaces(latitude, longitude) {
      // Use OpenStreetMap's Overpass API to search for nearby places based on amenity types
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3B(%0A%20%20node%5B%22amenity%22%3D%22hospital%22%5D(around%3A5000%2C${latitude}%2C${longitude})%3B%0A%20%20node%5B%22amenity%22%3D%22college%22%5D(around%3A5000%2C${latitude}%2C${longitude})%3B%0A%20%20node%5B%22amenity%22%3D%22fire_station%22%5D(around%3A5000%2C${latitude}%2C${longitude})%3B%0A)%3B%0Aout%3B`;

      fetch(overpassUrl)
        .then((response) => response.json())
        .then((data) => {
          const placesUL = document.getElementById("placesUL");
          placesUL.innerHTML = "";

          if (data.elements.length > 0) {
            data.elements.forEach((element) => {
              const placeName = element.tags.name || "Unnamed Place";
              const placeType = element.tags.amenity || "Place";

              const listItem = document.createElement("li");
              listItem.textContent = `${placeName} (${placeType})`;

              placesUL.appendChild(listItem);
            });
          } else {
            const noResultsItem = document.createElement("li");
            noResultsItem.textContent = "No nearby places found.";
            placesUL.appendChild(noResultsItem);
          }
        })
        .catch((error) => {
          alert("An error occurred while searching for nearby places.");
        });
    }

    // Search places inside a location
    const searchInsideBtn = document.getElementById("searchInsideBtn");
    const placeTypeInput = document.getElementById("placeType");
    const insidePlacesUL = document.getElementById("insidePlacesUL");

    searchInsideBtn.addEventListener("click", function () {
      const placeType = placeTypeInput.value.trim();

      if (!placeType) {
        alert("Please enter a place type (e.g., hospital, restaurant, school).");
        return;
      }

      const placeQuery = placeNameInput.value;

      if (!placeQuery) {
        alert("Please enter a city or location to search inside.");
        return;
      }

      // Use the OpenCage Geocoding API to search for places of the specified type within the specified city.
      const opencageApiKey = "YOUR_OPENCAGE_API_KEY";
      const opencageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        placeType
      )}+in+${encodeURIComponent(placeQuery)}&key=${opencageApiKey}`;

      fetch(opencageUrl)
        .then((response) => response.json())
        .then((data) => {
          insidePlacesUL.innerHTML = "";

          if (data.results.length > 0) {
            data.results.forEach((result) => {
              const placeName = result.formatted;
              const placeDetails = result.components;

              const listItem = document.createElement("li");
              listItem.innerHTML = `<strong>${placeName}</strong><br>${JSON.stringify(
                placeDetails,
                null,
                2
              )}`;

              insidePlacesUL.appendChild(listItem);
            });
          } else {
            const noResultsItem = document.createElement("li");
            noResultsItem.textContent = "No places found matching the query.";
            insidePlacesUL.appendChild(noResultsItem);
          }
        })
        .catch((error) => {
          alert("An error occurred while searching for places inside.");
        });
    });
  });
