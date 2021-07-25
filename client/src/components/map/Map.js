import React from "react";
import uuid from "react-uuid";
import StarRatings from 'react-star-ratings';
import Search from "../search/Search";

import "./Map.css";

import {
  GoogleMap,
  Circle,
  useLoadScript,
  Marker,
  InfoWindow,
  InfoBox,
} from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
}

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
}

let circleOptions = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.0,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 8046.72,  // This is in meters => 5 miles
  zIndex: 1
}

let google;

function Map() {
  // Default location is Jamaica, NY because why not
  const [currentLoc, setCurrentLoc] = React.useState({
    lat: 40.691492,
    lng: -73.8056894
  });

  // We need to wait for the window to load so that the google object becomes availalbe
  // Without this object, we will not be able to use the places api to perform searches
  // We also use this opportunity to get the user's location from the browser and
  // Update currentLoc on the map.
  const onWindowLoad = () => {
    google = window.google;

    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLoc({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    });

    window.removeEventListener('load', onWindowLoad);
  };
  window.addEventListener('load', onWindowLoad);

  const mapRef = React.useRef();
  const circleRef = React.useRef();
  const [NWCorner, setNWCorner] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);
  const [hoverBrew, setHoverBrew] = React.useState(null);
  const [selectBrew, setSelectBrew] = React.useState(null);

  // Update the map when a new location is selected from the search
  // By updating the center of the map.  This will trigger a new
  // Set of calls to the Places API to find breweries nearby.
  const panTo = React.useCallback(({ lat, lng }) => {
    setCurrentLoc({
      lat: lat,
      lng: lng
    });

  }, []);

  // Update map when a new radius for search is selected.  This will
  // Trigger a new set of calls to the Places API to find breweries
  // In the new radius.
  const radiusUpdate = React.useCallback((radiusMetric) => {
    circleOptions.radius = radiusMetric;
    circleRef.current.setRadius(radiusMetric);
  }, []);

  const onRadiusChanged = React.useCallback(() => {
    searchForBars();
  }, []);

  // 
  const searchForBars = () => {
    if (!google) return;

    setMarkers([]);

    // Reset the zoom level
    mapRef.current.setZoom(13);

    let service = new google.maps.places.PlacesService(mapRef.current);

    let request = {
      location: currentLoc,
      radius: circleOptions.radius,
      type: ["bar"]
    }

    service.nearbySearch(request, (results, status, pagination) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) return;
      for (let i = 0; i < results.length; i++) {
        let result = results[i];
        if (!result) continue;

        setMarkers((current) => [
          ...current,
          {
            business_status: result.business_status,
            position: result.geometry.location,
            name: result.name,
            opening_hours: result.opening_hours,
            rating: result.rating,
            vicinity: result.vicinity,
            photos: result.photos,
            key: uuid()
          }
        ]);
      }

      // Since results are paginated (<= 20 results per page), we call
      // Next page, which calls this same callback function with the new results.
      // Each call has a 2 second cooldown, so results show up 20 at a time.
      // We can maybe collect them all and push them to the markers collection
      // At once, but thats work I dont feel like doing
      if (pagination && pagination.hasNextPage) {
        pagination.nextPage();
      }
    });
  };

  // When currentLoc is changed (which refers to the location the map is centered on),
  // We want to perform a new search for breweries nearby.  This happens on page load,
  // And when someone searches a different location in the search bar or updates the
  // Search radius.
  React.useEffect(() => {
    searchForBars();
  }, [currentLoc]);

  // Load the google maps API via a script tag
  // And activate the places library
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_BACKUP_API_KEY,
    libraries,
  });

  // Use a memoized reference to the map
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Use a memoized reference to the circle
  const onCircleLoad = React.useCallback((circle) => {
    circleRef.current = circle;
  }, []);

  if (loadError) return "Error loading maps."
  if (!isLoaded) return "Loading Maps..."

  const onMapClick = () => {
    setHoverBrew(null);
    setSelectBrew(null);
  };

  const onMapBoundsChanged = () => {
    var bounds = mapRef.current.getBounds();
    var NECorner = bounds.getNorthEast();
    var SWCorner = bounds.getSouthWest();
    try {
      var local_NWCorner = new google.maps.LatLng(NECorner.lat(), SWCorner.lng());
    }
    catch {
      ;
    }
    finally {
      setNWCorner(local_NWCorner);
    }
  };

  return (
    <div>
      {/* Searchbox */}
      <Search panTo={panTo} radiusUpdate={radiusUpdate} />

      {/* Main map */}
      <GoogleMap
        onLoad={onMapLoad}
        on mapContainerStyle={mapContainerStyle}
        zoom={13} center={currentLoc}
        options={mapOptions}
        onClick={onMapClick}
      // onBoundsChanged={onMapBoundsChanged}>
      >
        {/* Circle that shows current radius */}
        <Circle center={currentLoc} options={circleOptions} onLoad={onCircleLoad} onRadiusChanged={onRadiusChanged} />

        {/* Marker that shows the current position at which the user is searching */}
        <Marker position={currentLoc} />

        {/* Markers for each brewery within the specified radius around the user specified position */}
        {markers.map(marker =>
          <Marker
            key={marker.key}
            position={marker.position}
            icon={{
              url: "/beer_mug.svg",
              scaledSize: new google.maps.Size(30, 30),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(15, 15)
            }}
            onMouseOver={() => {
              setHoverBrew(marker);
            }}
            onClick={() => {
              setSelectBrew(marker);
            }}
          />
        )}

        {/* Popup that shows when you hover over a brewery */}
        {hoverBrew && (
          <InfoWindow
            onCloseClick={() => {
              setHoverBrew(null);
            }}
            position={hoverBrew.position}
            className="info-window"
          >
            <div>
              <h6>{hoverBrew.name}</h6>
              <p>{hoverBrew.vicinity}</p>
              <StarRatings rating={hoverBrew.rating} starDimension="20px" starSpacing="5px" />
            </div>
          </InfoWindow>
        )}

        {/* Detailed window when you click a brewery */}
        {selectBrew && (
          <InfoBox
            position={NWCorner}
            onCloseClick={() => {
              setSelectBrew(null);
            }}
          >
            <div class="leftPanel" style={{ backgroundColor: 'white', opacity: 1 }}>
              <h3>{JSON.stringify(selectBrew.name)}</h3><br></br>
              {JSON.stringify(selectBrew.vicinity)}<br></br>
              {`Status: ${JSON.stringify(selectBrew.business_status)}`}<br></br>
              {`Currently Open: ${JSON.stringify(selectBrew.opening_hours.open_now)}`}<br></br>
              {`Rating: ${JSON.stringify(selectBrew.rating)}`}<br></br>
            </div>
          </InfoBox>
        )}

      </GoogleMap>
    </div>
  );
}

export default Map;