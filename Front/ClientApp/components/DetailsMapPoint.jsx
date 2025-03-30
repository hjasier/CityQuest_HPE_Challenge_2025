import { View, Text } from 'react-native'
import React from 'react'
import MapboxGL from '@rnmapbox/maps';
import { useWKBCoordinates } from '../hooks/useWKBCoordinates';
import { MapPin } from 'react-native-feather';

const DetailsMapPoint = ({challenge}) => {

  const coordinates = useWKBCoordinates(challenge.Location?.point);
  
  return (
    <MapboxGL.MapView
          style={{flex:1}}
          zoomEnabled
          scaleBarEnabled={false}
          styleURL='mapbox://styles/asiier/cm86e6z8s007t01safl5m10hl/draft'
        >
        <MapboxGL.Camera animationDuration={0} 
        centerCoordinate={[coordinates.longitude, coordinates.latitude]} 
        zoomLevel={14} />
        <MapboxGL.PointAnnotation
          id="pointAnnotation"
          coordinate={[coordinates.longitude, coordinates.latitude]}
        >
          <MapPin stroke="#b00202" fill="#FF3B30" />

        </MapboxGL.PointAnnotation>
    </MapboxGL.MapView>
  )
}

export default DetailsMapPoint