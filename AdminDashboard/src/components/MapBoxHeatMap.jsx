import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxHeatmap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-3.7);
  const [lat, setLat] = useState(40.4);
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Sample data points across Spain (cities with activity intensity)
      const heatmapData = {
        'type': 'FeatureCollection',
        'features': [
          // Northern Spain
          createFeature(-8.4115, 43.3623, 80, 'A Coruña'),
          createFeature(-2.9253, 43.2627, 95, 'Bilbao'),
          createFeature(-5.6773, 43.5293, 65, 'Gijón'),
          createFeature(-3.8079, 43.4609, 70, 'Santander'),
          
          // Central Spain
          createFeature(-3.7038, 40.4168, 100, 'Madrid'),
          createFeature(-4.7245, 41.6523, 60, 'Valladolid'),
          createFeature(-5.6635, 40.9701, 55, 'Salamanca'),
          createFeature(-3.6969, 42.3439, 50, 'Burgos'),
          
          // Eastern Spain
          createFeature(2.1734, 41.3851, 90, 'Barcelona'),
          createFeature(-0.3763, 39.4699, 85, 'Valencia'),
          createFeature(-0.4815, 38.3452, 75, 'Alicante'),
          createFeature(1.2445, 41.1179, 65, 'Tarragona'),
          
          // Southern Spain
          createFeature(-5.9845, 37.3891, 80, 'Sevilla'),
          createFeature(-3.5986, 37.1773, 70, 'Granada'),
          createFeature(-4.4213, 36.7213, 75, 'Málaga'),
          createFeature(-6.2929, 36.5297, 60, 'Cádiz'),
          
          // Islands
          createFeature(2.6502, 39.5696, 85, 'Palma de Mallorca'),
          createFeature(-15.4366, 28.1235, 70, 'Las Palmas'),
          createFeature(-16.2546, 28.4682, 65, 'Santa Cruz de Tenerife')
        ]
      };

      // Add source for heatmap
      map.current.addSource('activity-data', {
        'type': 'geojson',
        'data': heatmapData
      });

      // Add heatmap layer
      map.current.addLayer({
        'id': 'activity-heat',
        'type': 'heatmap',
        'source': 'activity-data',
        'maxzoom': 15,
        'paint': {
          // Increase the heatmap weight based on intensity
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'intensity'],
            0, 0,
            100, 1
          ],
          // Increase the heatmap color weight by zoom level
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            9, 3
          ],
          // Color ramp for heatmap from blue to red
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)',
            0.2, 'rgba(0, 0, 255, 0.5)',
            0.4, 'rgba(0, 255, 255, 0.7)',
            0.6, 'rgba(0, 255, 0, 0.7)',
            0.8, 'rgba(255, 255, 0, 0.8)',
            1, 'rgba(255, 0, 0, 0.9)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 10,
            9, 30
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            6, 0.7,
            9, 0.5
          ]
        }
      });

      // Add circle layer for points
      map.current.addLayer({
        'id': 'activity-points',
        'type': 'circle',
        'source': 'activity-data',
        'minzoom': 7,
        'paint': {
          // Size circle radius by intensity and zoom level
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, [
              'interpolate',
              ['linear'],
              ['get', 'intensity'],
              0, 1,
              100, 4
            ],
            16, [
              'interpolate',
              ['linear'],
              ['get', 'intensity'],
              0, 5,
              100, 15
            ]
          ],
          // Color circle by intensity
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'intensity'],
            0, '#add8e6',
            50, '#ffff00',
            100, '#ff0000'
          ],
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1,
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0,
            8, 0.7
          ]
        }
      });

      // Add popup on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.current.on('mouseenter', 'activity-points', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';
        
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { name, intensity } = e.features[0].properties;
        
        const popupContent = `
          <div class="popup-content">
            <h3>${name}</h3>
            <p>Intensidad: <strong>${intensity}</strong></p>
          </div>
        `;

        popup
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(map.current);
      });

      map.current.on('mouseleave', 'activity-points', () => {
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });
    });

    // Update state on map movement
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

  // Helper function to create GeoJSON feature
  function createFeature(lng, lat, intensity, name) {
    return {
      'type': 'Feature',
      'properties': {
        'intensity': intensity,
        'name': name
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [lng, lat]
      }
    };
  }

  return (
    <div className="map-container">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map" style={{ height: '500px', width: '100%' }} />
      <div className="legend">
        <h4>Intensidad de Actividad</h4>
        <div className="legend-item">
          <span className="color-box" style={{ backgroundColor: '#add8e6' }}></span>
          <span>Baja</span>
        </div>
        <div className="legend-item">
          <span className="color-box" style={{ backgroundColor: '#ffff00' }}></span>
          <span>Media</span>
        </div>
        <div className="legend-item">
          <span className="color-box" style={{ backgroundColor: '#ff0000' }}></span>
          <span>Alta</span>
        </div>
      </div>
      <style jsx>{`
        .map-container {
          position: relative;
          font-family: Arial, sans-serif;
        }
        .sidebar {
          background-color: rgba(35, 55, 75, 0.9);
          color: #fff;
          padding: 6px 12px;
          font-family: monospace;
          z-index: 1;
          position: absolute;
          top: 0;
          left: 0;
          margin: 12px;
          border-radius: 4px;
        }
        .legend {
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          padding: 10px;
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 1;
        }
        .legend h4 {
          margin: 0 0 10px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }
        .color-box {
          width: 15px;
          height: 15px;
          margin-right: 5px;
          border: 1px solid #ccc;
        }
        .popup-content {
          padding: 5px;
        }
        .popup-content h3 {
          margin: 0 0 5px;
          font-size: 14px;
        }
        .popup-content p {
          margin: 0;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default MapboxHeatmap;
