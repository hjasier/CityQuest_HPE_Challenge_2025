import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Alert, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapboxGL, { LocationPuck } from '@rnmapbox/maps';
import * as Location from 'expo-location';
// import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@env"; 
import MapLoadingAnimation from './MapLoadingAnimation';
import { useChallenges } from '../hooks/useChallenges';
import WKB from 'ol/format/WKB';
import { useNavigation } from '@react-navigation/native';
import { Vibration } from 'react-native';
import { Icon } from '@rneui/base';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import { useCurrentRoute, useCurrentRouteStore } from '../hooks/useCurrentRoute';
import { useCurrentGeometryRoute } from '../hooks/useCurrentGeometryRoute';
import { useCurrentChallenge } from '../hooks/useCurrentChallenge';
import ChallengeRadius from './ChallengeRadius';
import { useProximityToChallenge } from '../hooks/useProximityToChallenge';
import { useChallengeCompletion } from '../hooks/useChallengeCompletion';
import { useLocationChallenges } from '../hooks/useLocationChallenges';
import { useFilteredChallenges } from '../hooks/useFilteredChallenges';
import { useSelectedLocation } from '../hooks/useSelectedLocation';
import { useReCenterLocation } from '../hooks/useReCenterLocation';
import ChallengeRouteRenderer from './ChallengeRouteRenderer';
import useUserLocation from '../hooks/useUserLocation';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN);

const Map = () => {
  const bearing = require('../assets/HeadingPuck.png');
  const mapRef = useRef(null);
  const cameraRef = useRef(null);
  const { width, height } = Dimensions.get('window');
  const [puckBearingEnabled, setPuckBearingEnabled] = useState(true);
  const { challenges, loading, error, refetch } = useChallenges();
  const { challengesByLocation } = useLocationChallenges();
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigation = useNavigation();
  const { currentChallenge } = useCurrentChallenge();
  const { handleChallengeCompleted } = useChallengeCompletion(navigation);
  const { setSelectedLocation } = useSelectedLocation();
  const { ReCenterLocation } = useReCenterLocation();
  const { location } = useUserLocation();

  const { currentRoute } = useCurrentRoute();
  const { setCurrentGeometryRoute } = useCurrentGeometryRoute();
  

  
  
  // State for storing route information
  const [routeGeometry, setRouteGeometry] = useState(null);



  // Fetch route if routeNavigation is provided
  useEffect(() => {
    const fetchRoute = async () => {
      if (currentRoute) {
        try {
          // Initialize the Directions service
          const directionsClient = MapboxDirections({
            accessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN
          });

          // Fetch route between start and end coordinates
          const response = await directionsClient.getDirections({
            waypoints: [
              { coordinates: currentRoute.startCoordinates }, 
              { coordinates: currentRoute.endCoordinates }
            ],
            profile: currentRoute.profile || 'walking',
            geometries: 'geojson'
          }).send();

          // Extract the route from the response
          const newRoute = response.body.routes[0];
          setRouteGeometry(newRoute);
          setCurrentGeometryRoute(newRoute);

          // Adjust camera to fit the route
          centerOnUserLocation();
        } catch (error) {
          console.error('Error fetching route:', error);
          Alert.alert('Error', 'No se pudo cargar la ruta');
        }
      }
    };

    fetchRoute();
  }, [currentRoute]);

  useEffect(() => {
    if (routeGeometry) {
      console.log('Route geometry:', routeGeometry ? 'Available' : 'Not available');
    }
  }, [routeGeometry]);

  // Center map on user location
  const centerOnUserLocation = async () => {
    if (location) {
      // Vibrate for feedback
      Vibration.vibrate(100);
      
      // Center map on user's location with animation
      if (cameraRef.current) {
        console.log('Location available:', location);
        cameraRef.current.flyTo(location, 300);
        //espearar 300ms
        setTimeout(() => {
          cameraRef.current.zoomTo(15, 300);
        }, 300);
      }
    } else {
      console.log('Location not available');
      // Try to get location again if it's not available
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        const newLocation = [currentLocation.coords.longitude, currentLocation.coords.latitude];
        // setLocation(newLocation);
        
        if (cameraRef.current) {
          cameraRef.current.flyTo(newLocation, 300);
          cameraRef.current.zoomTo(15, 300);
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener tu ubicación actual.');
      }
    }
  };

  // Convertir HEX a Uint8Array
  const hexToUint8Array = (hex) => {
    return new Uint8Array(
      hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
  };

  // Parsear WKB
  const parseWKB = (hex) => {
    const wkb = new WKB();
    if (hex){
      const feature = wkb.readFeature(hexToUint8Array(hex));
      if (feature) {
        const [longitude, latitude] = feature.getGeometry().getCoordinates();
        return { latitude, longitude };
      }
      return null;
    }
    return null;

  };

  const handleFilterLocation = (cLocation) => {
    setSelectedLocation(cLocation);
    Vibration.vibrate();
  };

  const getChallengeType = (challenges) => {

    const maxType = Math.max(...challenges.map(challenge => challenge.type));


    switch (maxType) {
      case 1:
        // Comida - Bright orange for food
        return {'icon':'food-bank','iconType':'material', 'text': 'Comida','color':'#FF6B35'};
      case 2:
        // Visita - Vibrant purple
        return {'icon':'monument','iconType':'font-awesome-5', 'text': 'Visita','color':'#9C27B0'};
      case 3:
        // Ruta - Bright green
        return {'icon':'route','iconType':'font-awesome-5', 'text': 'Ruta','color':'#4CAF50'};
    }
  }



  // Call the hook at the component level
  const isNearChallenge = useProximityToChallenge(
    parseWKB(currentChallenge?.Location?.point)
  );

  // Use the result in an effect
  useEffect(() => {
    if (location && isNearChallenge) {
      Vibration.vibrate(1000);
      handleChallengeCompleted(currentChallenge);
    }
  }, [location, isNearChallenge, currentChallenge]); 
      


  useEffect(() => {
    centerOnUserLocation();
  }
  , [ReCenterLocation]);



  return (
    <View style={styles.container}>
      {!(!mapLoaded && !location) ? (
        <View style={styles.mapContainer}>
          <MapboxGL.MapView
            ref={mapRef}
            style={styles.map}
            zoomEnabled
            scaleBarEnabled={false}
            styleURL='mapbox://styles/asiier/cm86e6z8s007t01safl5m10hl/draft'
          >
            {location && (
              <MapboxGL.Camera
                ref={cameraRef}
                animationDuration={0}
                centerCoordinate={location}
                zoomLevel={15}
                onRender={() => setMapLoaded(true)}
              />
            )}
         
            <MapboxGL.Images images={{ 
            "headingArrow": bearing,
            "headingArrowXS": bearing
            }} />
  
            {/*  PUNTO DE LOC DEL USUARIO */}
            <LocationPuck 
              puckBearingEnabled={puckBearingEnabled}
              puckBearing="heading"
              pulsing={true} 
              bearingImage={puckBearingEnabled ? "headingArrow" : null}
            />

            {/*  RADIO DEL RETO ACTUAL */}
            {currentChallenge && (
              <ChallengeRadius currentChallenge={currentChallenge} />
            )}



            {/*  PUNTOS DE RETOS */}
            {challengesByLocation?.map(location => {
              const coordinates = parseWKB(location?.point);
              const challengeType = getChallengeType(location?.challenges);

              return (
                <MapboxGL.PointAnnotation
                  key={`challenge-${location.id}`}
                  id={`challenge-${location.id}`}
                  coordinate={[coordinates.longitude, coordinates.latitude]}
                  onSelected={() => handleFilterLocation(location)}
                > 
                <View className="flex flex-row items-center">
                  <Icon name={challengeType.icon} type={challengeType.iconType} color={challengeType.color} size={24} />
                </View>
                </MapboxGL.PointAnnotation>
              );
            })}



            
  
            {/* RENDERIZAR LA RUTA HACIA UN RETO SI EXISTE ROUTE EN HOOK */}
            {(currentRoute && routeGeometry) && (
              <MapboxGL.ShapeSource
                id="routeSource"
                shape={{
                  type: 'Feature',
                  geometry: routeGeometry.geometry
                }}
              >
                {/* Gradient Effect with Multiple Line Layers */}
                <MapboxGL.LineLayer
                  id="routeLineBackground"
                  style={{
                    lineColor: 'rgba(41, 128, 255, 0.2)', // Soft blue background
                    lineWidth: 8,
                    lineOpacity: 0.5,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                />
                <MapboxGL.LineLayer
                  id="routeLineForeground"
                  style={{
                    lineColor: 'rgba(41, 128, 255, 0.8)', // Brighter blue foreground
                    lineWidth: 4,
                    lineOpacity: 0.8,
                    lineCap: 'round',
                    lineJoin: 'round',
                    // Add a dash pattern for a more organic feel
                    lineDasharray: [2, 2]
                  }}
                />
              </MapboxGL.ShapeSource>
            )}
  
          

          {/* RENDERIZAR LA RUTA DE UN RETO SI LA HAY */}

          {currentChallenge && currentChallenge?.CompletionType.type === 'GPS-ROUTE' && (
            <ChallengeRouteRenderer
              challenge={currentChallenge}
              userLocation={location}
            />
          )}

          </MapboxGL.MapView>

          
          {/* Center on user location button */}
          {/* <TouchableOpacity 
            style={styles.centerButton}
            onPress={centerOnUserLocation}
          >
            <View style={styles.buttonContent}>
              <Icon name="assistant-navigation" type="material" color="#2A7FFF" size={24} />
            </View>
          </TouchableOpacity> */}
  
        </View>
      ) : (
        <View style={styles.loading} >
          <MapLoadingAnimation />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  mapContainer: {
    flex: 1,
    position: 'relative', // This is important for properly positioning the button
  },
  map: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    position: 'absolute',
    top: 40,
    right: 10,
    width: 50,
    height: 50,
    transform: [{ rotate: '45deg' }],
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Map;