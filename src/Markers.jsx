import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const Markers = ({teaLocations, handleMarkerClick}) => {
  return (
    <>
      {teaLocations && (
        teaLocations.map((teaLocation) => (
        <AdvancedMarker 
          key={teaLocation.id} 
          position={{ lat: teaLocation.location.latitude, lng: teaLocation.location.longitude }}
          clickable={true}
          onClick={() => handleMarkerClick(teaLocation.id)}
        >
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      )))}
    </>
  )
}

export default Markers;
