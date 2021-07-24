import React from "react";
import uuid from "react-uuid";
import Search from "./Search";

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
  radius: 8046.72,  // This is in meters
  zIndex: 1
}

let google;

function Map() {
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

  // Default location is Jamaica, NY because why not
  const [currentLoc, setCurrentLoc] = React.useState({
    lat: 40.691492,
    lng: -73.8056894
  });

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLoc({
        lat: lat,
        lng: lng
      })
    });
    console.log(lat, lng)

  }, []);

  const mapRef = React.useRef();
  
  const [NWCorner, setNWCorner] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);
  const [hoverBrew, setHoverBrew] = React.useState(null);
  const [selectBrew, setSelectBrew] = React.useState(null);

  // When currentLoc is changed (which refers to the location the map is centered on),
  // We want to perform a new search for breweries nearby.  This happens on page load,
  // And when someone searches a different location in the search bar or updates the
  // Search radius.
  React.useEffect(() => {
    if (!google) return;
    
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
      // console.log(breweries);
    });
  }, [currentLoc]);

  // Load the google maps API via a script tag
  // And activate the places library
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_BACKUP_API_KEY,
    libraries,
  });




  // Use a memoized reference to the map for 
  const onLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "Error loading maps."
  if (!isLoaded) return "Loading Maps..."

  return (
    <div>      <Search panTo={panTo} />
    <div>
      <GoogleMap 
      onLoad={onLoad} 
      on mapContainerStyle={mapContainerStyle} 
      zoom={13} center={currentLoc} 
      options={mapOptions}
      onClick={() => {
        setHoverBrew(null);
        setSelectBrew(null);
      }}
      onBoundsChanged={() => {
        var bounds = mapRef.current.getBounds();
        var NECorner = bounds.getNorthEast();
        var SWCorner = bounds.getSouthWest();
        try{
          var local_NWCorner = new google.maps.LatLng(NECorner.lat(), SWCorner.lng());
        }
        catch{
          ;
        }
        finally{
          setNWCorner(local_NWCorner);
        }
      }}
      >

        <Circle center={currentLoc} options={circleOptions} />
        <Marker position={currentLoc} />
        {markers.map(marker => <Marker 
        key={marker.key} 
        position={marker.position}
        icon={{ url: "/beer_mug.svg", scaledSize: new google.maps.Size(30, 30) }}
        onMouseOver={() => {
          setHoverBrew(marker);
        }}
        onClick={() => {
          setSelectBrew(marker);
        }}
        />)}
        {hoverBrew && (
          <InfoWindow
            onCloseClick={() => {
              setHoverBrew(null);
            }}
            position={hoverBrew.position}
            >
              <div style={{backgroundColor: 'white', opacity: 1}}>
                <p>
                  <b>{JSON.stringify(hoverBrew.name)}</b><br></br>
                  {JSON.stringify(hoverBrew.vicinity)}<br></br>
                  {`Rating: ${JSON.stringify(hoverBrew.rating)}`}
                </p>
              </div>
            </InfoWindow>
        )}
        {selectBrew && (
          <InfoBox
            position={NWCorner}
            onCloseClick={() => {
              setSelectBrew(null);
            }}
          >
            <div class="leftPanel" style={{backgroundColor: 'white', opacity: 1}}>
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
    </div>
  );
}

export default Map;