import React, { useEffect, useState } from 'react';
import './App.css';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Markers from './Markers';
import teaImage from './tea.png';

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [teaLocations, setTeaLocations] = useState(null);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [apiKeyLoading, setApiKeyLoading] = useState(true);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    fetch('https://api.mel-baker.co.uk/google-maps-api-key/')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch API key');
      }
      return response.json();
    })
      .then((data) => {
         if (data && data.body.googleApiKey) {
           setApiKey(data.body.googleApiKey);
           setApiKeyLoading(false);
         } else {
           throw new Error('API key not found in the response');
         }
      })
      .catch((err) => {
        setError('Failed to load API key. ' + err)
        setApiKeyLoading(false);
      });
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
          setLocationsLoading(true);
          // send request to API
          fetch('https://api.mel-baker.co.uk/search/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude,
              longitude
            })
          })
          .then((response) => {
            return response.json()
          })
          .then((data) => setTeaLocations(data.body.places || []))
          .catch((error) => setError(error.message))
          .finally(() => setLocationsLoading(false))
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
        {locationsLoading ? "Finding..." : "Find tea near me"}
      </button>
      {apiKeyLoading && <h2>Loading API Key...</h2>}
      {locationsLoading && !apiKeyLoading ? (
        <h2>Loading tea locations...</h2>
      ) : (
        apiKey && (
          <div className='locationsDiv'>
            {userLocation && (
              <APIProvider apiKey={apiKey}>
                <div className='mapContainer'>
                  <Map
                    defaultZoom={13}
                    defaultCenter={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                    mapId='5a92b3e52305b0d4'
                  >
                    <Markers userLocation={userLocation} teaLocations={teaLocations} handleLocationClick={handleLocationClick} selectedLocation={selectedLocation} />
                  </Map>
                </div>
              </APIProvider>
            )}
            
            {teaLocations && teaLocations.map((teaLocation) => (
              <div className={selectedLocation === teaLocation.id ? "selectedLocationListItem" : "locationListItem"} key={teaLocation.id} onClick={() => handleLocationClick(teaLocation.id)}>
                <p className="locationName">{teaLocation.displayName.text}</p>
                <p className="locationAddress">{teaLocation.formattedAddress}</p>
              </div>
            ))}
          </div>
        )
      )}
      {error && <h2>{error}</h2>}
    </>
  );
}

export default App;

