import React, { useEffect, useState } from 'react';
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
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/google-maps-api-key')
      .then((response) => response.json())
      .then((data) => setApiKey(data.apiKey))
      .catch((err) => setError('Failed to load API key'));
  }, [])

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
          // send request to API
          fetch('http://localhost:3000/search', {
            mode: 'cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              latitude,
              longitude
            })
          })
          .then((response) => {
            return response.json()
          })
          .then((data) => setTeaLocations(data.places || []))
          .catch((error) => setError(error.message))
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

  const handleLocationClick = (id) => {
    if (selectedLocation !== id) {
      setSelectedLocation(id);
    }
  }

  return (
    <>
      <img src={teaImage} className='mainImage' alt='A cup of tea with a saucer'></img>
      <h1 className='mainHeading'>Find me tea</h1>
      <p className='subheading'>Find your nearest tea rooms, cafes, diners, and other places selling tea within a 2km radius</p>
      <button className='findMeTeaBtn' onClick={getLocationsOfTea}>
        {loading ? "Finding..." : "Find tea near me"}
      </button>
      {loading ? <h2>Loading...</h2> : teaLocations && (
        <div className='locationsDiv'>
          {userLocation && (
            <APIProvider apiKey={apiKey}>
              <div className='mapContainer'>
                <Map
                  defaultZoom={13}
                  defaultCenter={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                  mapId='5a92b3e52305b0d4'
                >
                  <Markers teaLocations={teaLocations} handleLocationClick={handleLocationClick} selectedLocation={selectedLocation}/>
                </Map>
              </div>
            </APIProvider>
          )}
          
          {teaLocations.map((teaLocation) => (
            <div className={selectedLocation === teaLocation.id ? "selectedLocationListItem" : "locationListItem"} key={teaLocation.id} onClick={() => handleLocationClick(teaLocation.id)}>
              <p className="locationName">{teaLocation.displayName.text}</p>
              <p className="locationAddress">{teaLocation.formattedAddress}</p>
            </div>
          ))}
        </div>
      )}
      {error && <h2>{error}</h2>}
    </>
  );
}

export default App;

