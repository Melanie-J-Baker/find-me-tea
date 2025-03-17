import React, { useState } from 'react';
import './App.css';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Markers from './Markers';
import teaImage from './assets/tea.png';

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [teaLocations, setTeaLocations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const getLocationsOfTea = () => {
    if (navigator.geolocation) {
      // what to do if supported
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // what to do once have position
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude});
          // fetch request to get locations of tea from Google Places API Nearby Search
          setLoading(true);
          fetch('https://places.googleapis.com/v1/places:searchNearby', {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': 'AIzaSyCdwRoAX7e0j7TwZx-cg8ZMHHh73bMkt-c',
              'X-Goog-FieldMask': ['places.displayName', 'places.location', 'places.formattedAddress', 'places.id']
            },
            body: JSON.stringify({
              includedTypes: ['breakfast_restaurant', 'cafe', 'cat_cafe', 'coffee_shop', 'diner', 'dog_cafe', 'tea_house'],
              maxResultCount: 10,
              locationRestriction: {
                circle: {
                  center: {
                    latitude,
                    longitude
                  },
                  radius: 1000.0
                }
              }
            })
          })
          .then((response) => response.json())
          .then((data) => setTeaLocations(data.places))
          .catch((error) => setError(error.msg))
          .finally(() => setLoading(false))
        },
        (err) => {
          // display error if can't get user's position
          setError('Error getting user location: ' + err.message);
        }
      );
    } else {
      // display an error if not supported
      setError('Geolocation is not supported by this browser');
    }
  };

  const handleMarkerClick = (id) => {
    setSelectedLocation(id);
  }

  return (
    <>
      <img src={teaImage} className='mainImage'></img>
      <h1 className='mainHeading'>Find me tea!</h1>
      <p>Find your nearest tea rooms, cafes, diners, and other places selling tea near you</p>
      <div className='findMeDiv'>
        <button className='findMeBtn' onClick={getLocationsOfTea}>
          Find me tea
        </button>
        {loading && <h2>Loading...</h2>}
        {teaLocations && (
          <div className='locationDiv'>
            <APIProvider apiKey={'AIzaSyCdwRoAX7e0j7TwZx-cg8ZMHHh73bMkt-c'} onLoad={() => console.log('Maps API has loaded.')}>
              <div className='mapContainer'>
                <Map
                  defaultZoom={13}
                  defaultCenter={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                  mapId='5a92b3e52305b0d4'
                >
                  <Markers teaLocations={teaLocations} handleMarkerClick={handleMarkerClick}/>
                </Map>
              </div>
            </APIProvider>
            {teaLocations.map((teaLocation) => (
              <div key={teaLocation.id}>
                <p className={selectedLocation == teaLocation.id ? "selected locationName" : "unselected locationName" }>{teaLocation.displayName.text}</p>
                <p className={selectedLocation == teaLocation.id ? "selected locationAddress" : "unselected locationAddress" }>{teaLocation.formattedAddress}</p>
              </div>
            ))}
          </div>
        )}
        {error && <h2>{error}</h2>}
      </div>
    </>
  );
}

export default App;

