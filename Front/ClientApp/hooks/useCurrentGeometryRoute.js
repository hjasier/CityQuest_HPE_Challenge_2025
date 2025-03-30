import { create } from 'zustand';
import { useEffect, useState } from 'react';
import useUserLocation from './useUserLocation';
import * as turf from '@turf/turf'; // You'll need to install this package

// Create a store to manage current geometryRoute globally
export const useCurrentGeometryRouteStore = create((set) => ({
  currentGeometryRoute: null,
  setCurrentGeometryRoute: (geometryRoute) => set({ currentGeometryRoute: geometryRoute }),
  clearCurrentGeometryRoute: () => set({ currentGeometryRoute: null })
}));

// Hook to use current geometryRoute with dynamic distance calculation
export const useCurrentGeometryRoute = () => {
  const { currentGeometryRoute, setCurrentGeometryRoute, clearCurrentGeometryRoute } = useCurrentGeometryRouteStore();
  const { location } = useUserLocation();
  const [dynamicRouteInfo, setDynamicRouteInfo] = useState({
    distance: currentGeometryRoute?.distance || 0,
    remainingDistance: currentGeometryRoute?.distance || 0,
    progress: 0
  });

  // Update remaining distance whenever location or route changes
  useEffect(() => {
    if (!currentGeometryRoute || !location) return;

    try {
      // Convert user's current location to a point
      const currentPoint = turf.point(location);
      
      // Check if the route has coordinates
      if (currentGeometryRoute.geometry?.coordinates?.length) {
        // Create a line from the route coordinates
        const routeLine = turf.lineString(currentGeometryRoute.geometry.coordinates);
        
        // Calculate the nearest point on the route to the user's location
        const nearestPoint = turf.nearestPointOnLine(routeLine, currentPoint);
        
        // Calculate the remaining distance by creating a sliced line from the nearest point to the end
        const remainingLineCoords = currentGeometryRoute.geometry.coordinates.slice(
          nearestPoint.properties.index
        );
        
        // Add the current nearest point as the first point for more accuracy
        remainingLineCoords.unshift(nearestPoint.geometry.coordinates);
        
        // Create a line from these remaining coordinates
        const remainingLine = turf.lineString(remainingLineCoords);
        
        // Calculate the length of this line in meters
        const remainingDistance = turf.length(remainingLine, { units: 'meters' });
        
        // Calculate progress as a percentage
        const progress = 1 - (remainingDistance / currentGeometryRoute.distance);
        
        setDynamicRouteInfo({
          distance: currentGeometryRoute.distance,
          remainingDistance,
          progress: Math.max(0, Math.min(1, progress)) // Keep between 0-1
        });
      }
    } catch (error) {
      console.error("Error calculating route distance:", error);
    }
  }, [location, currentGeometryRoute]);

  return {
    currentGeometryRoute: currentGeometryRoute 
      ? { ...currentGeometryRoute, ...dynamicRouteInfo }
      : null,
    setCurrentGeometryRoute,
    clearCurrentGeometryRoute
  };
};