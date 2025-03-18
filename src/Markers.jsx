import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const Markers = ({teaLocations, handleLocationClick, selectedLocation}) => {
  return (
    <>
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
