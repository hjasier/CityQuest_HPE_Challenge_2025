import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, Dimensions } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { SERVER_API_URL } from "@env";
import useApiUrl from '../hooks/useApiUrl';

// Configurar el token de Mapbox
MapboxGL.setAccessToken("pk.eyJ1IjoiYXNpaWVyIiwiYSI6ImNrenU0aW9zMjE4ZnEyb285eW1yY3p2N3oifQ.T2QoudfHezOdNRnRx2wIcA");

const Route = () => {
  const [route, setRoute] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const mapRef = useRef(null);
  const cameraRef = useRef(null);
  const { apiUrl } = useApiUrl();
  

  useEffect(() => {
    (async () => {
      if (!apiUrl) {
        return;
      }
      try {
        // Obtener la ruta y puntos de interés desde la API Flask
        const response = await fetch(`${apiUrl}/generate_route`);
        const data = await response.json();
        
        // Asegurarse de que hay datos de ruta antes de proceder
        if (data.route && data.route.features && data.route.features.length > 0) {
          setRoute(data.route); // Ruta GeoJSON
          
          // Establecer la región inicial basada en las coordenadas de la ruta
          const routeCoords = data.route.features[0].geometry.coordinates;
          setInitialRegion(routeCoords[0]);
        }
        
        // Crear un objeto FeatureCollection correcto para los puntos de interés
        if (data.points_of_interest && data.points_of_interest.features) {
          setPointsOfInterest({
            type: "FeatureCollection",
            features: data.points_of_interest.features
          });
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        // Manejo de errores más apropiado
        Alert.alert(
          "Error",
          "No se pudieron cargar los datos de la ruta. Por favor, inténtelo de nuevo."
        );
      }
    })();
  }, [apiUrl]);

  // Renderizar el mapa solo cuando tengamos los datos de la región inicial
  if (!initialRegion) {
    return (
      <View style={styles.loading}>
        {/* Aquí podrías añadir un componente de carga */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          ref={mapRef}
          style={styles.map}
          zoomEnabled
          scaleBarEnabled={false}
          styleURL='mapbox://styles/asiier/cm86e6z8s007t01safl5m10hl/draft'
          // Establecer la ubicación inicial del mapa directamente
          initialViewState={{
            bounds: {
              ne: initialRegion,
              sw: initialRegion,
              padding: { top: 50, bottom: 50, left: 50, right: 50 }
            }
          }}
        >
          {/* Cámara con referencia para poder controlarla programáticamente */}
          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={15}
            centerCoordinate={initialRegion}
            animationDuration={0.1}  // Eliminar la animación inicial
          />

          {/* Mostrar la ruta */}
          {route && (
            <MapboxGL.ShapeSource id="routeSource" shape={route}>
              <MapboxGL.LineLayer
                id="routeLayer"
                style={{
                  lineColor: '#0000FF',
                  lineWidth: 5
                }}
              />
            </MapboxGL.ShapeSource>
          )}

          {/* Mostrar los puntos de interés */}
          {pointsOfInterest && (
            <MapboxGL.ShapeSource
              id="poiSource"
              shape={pointsOfInterest}
            >
              <MapboxGL.CircleLayer
                id="poiCircleLayer"
                style={{
                  circleRadius: 8,
                  circleColor: '#FF0000',
                  circleStrokeWidth: 2,
                  circleStrokeColor: '#FFFFFF'
                }}
              />
              <MapboxGL.SymbolLayer
                id="poiSymbolLayer"
                style={{
                  textField: ['get', 'name'],
                  textSize: 12,
                  textColor: '#000000',
                  textOffset: [0, 1.5],
                  textAnchor: 'top',
                  textHaloColor: '#FFFFFF',
                  textHaloWidth: 1
                }}
              />
            </MapboxGL.ShapeSource>
          )}
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Route;