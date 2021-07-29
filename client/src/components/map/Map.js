import React from "react";
import { connect } from "react-redux";
import uuid from "react-uuid";
import StarRatings from 'react-star-ratings';
import Search from "../search/Search";
import Loader from "../loader/Loader";
import MapStyles from "./MapStyles";

import "./Map.css";

import {
  GoogleMap,
  Circle,
  useLoadScript,
  Marker,
  InfoWindow,
  InfoBox,
} from "@react-google-maps/api";
import axios from "axios";

const libraries = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
}

const mapOptions = {
  styles: MapStyles,
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Map(props) {
  const mapRef = React.useRef();
  const circleRef = React.useRef();
  const serviceRef = React.useRef();
  const [NWCorner, setNWCorner] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);
  const [hoverBrew, setHoverBrew] = React.useState(null);
  const [selectBrew, setSelectBrew] = React.useState(null);
  const [beers, setBeers] = React.useState([]);
  const [beersLoading, setBeersLoading] = React.useState(true);
  const [beersRefresh, setBeersRefresh] = React.useState(true);
  const [beersRecommendations, setBeersRecommendations] = React.useState([]);
  const [beersRecommendationsByOthers, setBeersRecommendationsByOthers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentLoc, setCurrentLoc] = React.useState({
    lat: 40.691492, // Default location is Jamaica, NY because why not
    lng: -73.8056894
  });

  // We need to wait for the window to load so that the google object becomes availalbe
  // Without this object, we will not be able to use the places api to perform searches
  // We also use this opportunity to get the user's location from the browser and
  // Update currentLoc on the map.
  const onWindowLoad = () => {
    google = window.google;
    serviceRef.current = new google.maps.places.PlacesService(mapRef.current);

    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLoc({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    });

    window.removeEventListener('load', onWindowLoad);
  };
  window.addEventListener('load', onWindowLoad);

  // Update the map when a new location is selected from the search
  // By updating the center of the map.  This will trigger a new
  // Set of calls to the Places API to find breweries nearby.
  const panTo = React.useCallback(({ lat, lng }) => {
    setCurrentLoc({
      lat: lat,
      lng: lng
    });
  }, [currentLoc]);

  // Update map when a new radius for search is selected.  This will
  // Trigger a new set of calls to the Places API to find breweries
  // In the new radius.
  const radiusUpdate = React.useCallback((radiusMetric, zoomLevel) => {
    circleOptions.radius = radiusMetric;
    circleRef.current.setRadius(radiusMetric);
    mapRef.current.setZoom(zoomLevel);
  }, []);

  // When the radius is changed, force an update of the current location
  // To the same value it is so that we search for bars again (but this time
  // With the larger radius).
  const onRadiusChanged = React.useCallback(() => {
    setCurrentLoc({
      lat: currentLoc.lat,
      lng: currentLoc.lng
    });
  }, [currentLoc]);

  // When currentLoc is changed (which refers to the location the map is centered on),
  // We want to perform a new search for breweries nearby.  This happens on page load,
  // And when someone searches a different location in the search bar or updates the
  // Search radius.
  React.useEffect(() => {
    if (!google) return;

    setMarkers([]);

    setIsLoading(true);

    let service = serviceRef.current;

    let request = {
      location: currentLoc,
      radius: circleOptions.radius.toString(),
      query: 'brewery'
    }

    service.textSearch(request, async (results, status, pagination) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) return;
      for (let i = 0; i < results.length; i++) {
        let result = results[i];
        if (!result) continue;

        // Only show marker if it is within the radius, since textSearch can return
        // Results outside of this radius (even when specified - yeah its dumb)
        let currentLocLatLng = new google.maps.LatLng(currentLoc.lat, currentLoc.lng);
        let distance = google.maps.geometry.spherical.computeDistanceBetween(currentLocLatLng, result.geometry.location);
        if (distance > circleOptions.radius) {
          continue;
        }

        // Add to collection to show on map
        setMarkers((current) => [
          ...current,
          {
            data_populated: false,
            position: result.geometry.location,
            placeId: result.place_id,
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
      else {
        setIsLoading(false);
      }
    });

  }, [currentLoc]);

  React.useEffect(() => {
    if (!selectBrew) {
      setBeers([]);
    } else {
      setBeersLoading(true);
      axios.get(`http://localhost:5000/brewery?name=${selectBrew.name}&formatted_address=${selectBrew.formatted_address}`).then(response => {
        if (response.data && response.data.length > 0) {
          const brewery = response.data[0];
          axios.get(`http://localhost:5000/beer?brewery_id=${brewery.id}`).then(resp => {
            setBeers(resp.data || []);
          })
        } else {
          setBeers([]);
        }
      }).catch(() => {
        setBeers([]);
      }).finally(() => {
        setBeersLoading(false);
      });
      axios.post(`http://localhost:5000/recommendation/byPreferences`, {
        preferences: props.auth.user.preferences
      })
      .then(response => {
        console.log(response)
        setBeersRecommendations(response.data || []);
      }).catch(() => {
  
      });
      axios.post(`http://localhost:5000/recommendation/byOthers`, {
        selectBrew: selectBrew
      })
      .then(response => {
        console.log(response)
        setBeersRecommendationsByOthers(response.data || []);
      }).catch(() => {
  
      });
    }
  }, [selectBrew, beersRefresh])



  
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

  const likeBeer = (beer, isLiked, email) => {
    axios.post(`http://localhost:5000/beer/update/${beer.id}`, {
      like: !isLiked,
      email: email
    }).then(response => {
      setBeersRefresh(!beersRefresh)
    }).catch(() => {

    })
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

  // TODO: Add a call to the API to get the beers at this location, and set it on this marker
  const getDetails = (marker) => {
    return new Promise((resolve, reject) => {
      if (marker.data_populated) return resolve();

      setIsLoading(true);

      let detailsRequest = {
        placeId: marker.placeId
      };

      let service = serviceRef.current;
      service.getDetails(detailsRequest, (place, status) => {
        console.log("Details request status: ", status);
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return reject();

        marker.business_status = place.business_status;
        marker.name = place.name;
        marker.opening_hours = place.opening_hours ? place.opening_hours : {};
        marker.rating = place.rating;
        marker.user_ratings_total = place.user_ratings_total;
        marker.address = place.formatted_address;
        marker.phone_num = place.formatted_phone_number;
        marker.photos = place.photos;
        marker.reviews = place.reviews;
        marker.data_populated = true;

        setIsLoading(false);

        return resolve();
      });
    });
  };

  return (
    <div className="mapRoot">
      {/* Loader for async ops */}
      {isLoading && <Loader />}

      {/* Searchbox */}
      <Search panTo={panTo} radiusUpdate={radiusUpdate} />

      {/* Main map */}
      <GoogleMap
        onLoad={onMapLoad}
        mapContainerStyle={mapContainerStyle}
        zoom={13} center={currentLoc}
        options={mapOptions}
        onClick={onMapClick}
        onBoundsChanged={onMapBoundsChanged}>
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
            onMouseOver={async () => {
              await getDetails(marker);
              setHoverBrew(marker);
            }}
            onClick={async () => {
              await getDetails(marker);
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
          >
            <div>
              <h6>{hoverBrew.name}</h6>
              <p>{hoverBrew.address}</p>
              <p>{hoverBrew.phone_num}</p>
              <p>{hoverBrew.opening_hours.isOpen ? (hoverBrew.opening_hours.isOpen() ? "OPEN" : "CLOSED") : "UNKNOWN"}</p>
              <StarRatings className="star-rating" rating={hoverBrew.rating} starDimension="15px" starSpacing="1px" />{"(" + hoverBrew.user_ratings_total + ")"}
            </div>
          </InfoWindow>
        )}

        {/* Detailed window when you click a brewery */}
        {selectBrew && (
          <InfoBox
            options={{ closeBoxURL: '', enableEventPropagation: true }}
            position={NWCorner}
            onCloseClick={() => {
              setSelectBrew(null);
            }}
          >
            <div className="leftPanel">
              <img src={selectBrew.photos[0].getUrl()} />
              <h5>{selectBrew.name}</h5>
              <p>{selectBrew.address}</p>
              <p>Phone Number: {selectBrew.phone_num}</p>
              <h6>Hours ({selectBrew.opening_hours.isOpen ? (selectBrew.opening_hours.isOpen() ? "Open Now" : "Closed") : "Status Unknown"})</h6>
              { selectBrew.opening_hours.weekday_text ? selectBrew.opening_hours.weekday_text.map(text => <p>{text}</p>) : <p>"Hours Unavailable"</p> }
              <h6>Beer List</h6>
              {beers && beers.length ? beers.map(beer => {
                const isLiked = props.auth.user ? beer.liked_by && beer.liked_by.includes(props.auth.user.email) : false;
                return <div className="beerTag" key={beer.id}>
                  <div className="beerName">{beer.name}</div>
                  {props.auth.user.email ? <div className="likeBtn" onClick={e => (e.stopPropagation(), likeBeer(beer, isLiked, props.auth.user.email))}>
                    {
                      isLiked
                        ? <img src="images/like.png" />
                        : <img src="images/unlike.png" />
                    }
                  </div> : null}
                </div>
              }) : beersLoading ? null : 'No beer information for this brewery'}
              <h6>Your Top 10 Recommendations</h6>
              {beersRecommendations && beersRecommendations.slice(0, 10).length ? beersRecommendations.slice(0, 10).map(beersRecommendation => {
                return <div className="beerTag" key={beersRecommendation.id}>
                  <div className="beerName">{beersRecommendation.name}</div>
                </div>
              }) : beersLoading ? null : 'No beer recommendations based on preferences'}
              <h6>Local Favorites</h6>
              {beersRecommendationsByOthers && beersRecommendationsByOthers.length ? beersRecommendationsByOthers.map(beersRecommendationByOthers => {
                return <div className="beerTag" key={beersRecommendationByOthers.id}>
                  <div className="beerName">{beersRecommendationByOthers.name}</div>
                </div>
              }) : beersLoading ? null : 'No beer recommendations in the area'}
            </div>
          </InfoBox>
        )}

      </GoogleMap>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Map);
