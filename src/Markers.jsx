import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const Markers = ({userLocation, teaLocations, handleLocationClick, selectedLocation}) => {
  return (
    <>
      {userLocation && (
        <AdvancedMarker
          key={"userLocation"}
          position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
          clickable={false}
        >
          <Pin className="userPin" background={'#000'} glyphColor={'#FFF'} borderColor={'#FFF'} />
        </AdvancedMarker>
      )}
      {teaLocations && (
        teaLocations.map((teaLocation) => (
        <AdvancedMarker 
          key={teaLocation.id} 
          position={{ lat: teaLocation.location.latitude, lng: teaLocation.location.longitude }}
          clickable={true}
          onClick={() => handleLocationClick(teaLocation.id)}
        >
          <Pin className="pin" background={selectedLocation == teaLocation.id ? '#ee9b63' : '#FA0909'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      )))}
    </>
  )
}

export default Markers;
