import { useCurrentChallenge } from "./useCurrentChallenge";
import { useEffect, useState, useCallback } from 'react';
import * as turf from '@turf/helpers';
import distance from '@turf/distance';
import { DETECTION_RADIUS } from './constants';
import { useWKBCoordinates } from './useWKBCoordinates';
import useUserLocation from "./useUserLocation";
import useChallengeCompletion from "./useChallengeCompletion";
import { useNavigation } from "@react-navigation/native";


export function useChallengeRouteStatus() {

    const { currentChallenge } = useCurrentChallenge();
    const { location } = useUserLocation();
    const navigation = useNavigation();
    const { handleChallengeCompleted } = useChallengeCompletion(navigation);

  // Extract route coordinates from challenge
  const routeCoordinates = useWKBCoordinates(
    currentChallenge?.Location?.Route?.[0]?.linestring
  );


  // State for tracking completed and remaining route points
  const [completedPoints, setCompletedPoints] = useState([]);
  const [remainingPoints, setRemainingPoints] = useState([]);
  const [routeStatus, setRouteStatus] = useState({
    totalPoints: 0,
    completedPoints: 0,
    isCompleted: false,
    progress: 0, // 0 to 1
    nextPointIndex: 0,
    nextPoint: null,
  });
  
  // Initialize route points from coordinates
  useEffect(() => {
    if (routeCoordinates && Array.isArray(routeCoordinates) && routeCoordinates.length > 0) {
      setRemainingPoints([...routeCoordinates]);
      setCompletedPoints([]);
      setRouteStatus(prev => ({
        ...prev,
        totalPoints: routeCoordinates.length,
        completedPoints: 0,
        progress: 0,
        nextPointIndex: 0,
        nextPoint: routeCoordinates[0],
        isCompleted: false,
      }));
    }
  }, [routeCoordinates]);
  
  // Check proximity to next point in route
  // Check proximity to next point in route
    useEffect(() => {
    if (!location || currentChallenge.CompletionType.type !== 'GPS-ROUTE') return;

    if (remainingPoints.length === 0) {
      handleChallengeCompleted(currentChallenge);
      return;
    }
    
    // Get the next point in the route
    const nextPoint = remainingPoints[0];
    
    // Check if user is within detection radius of the next point
    const isNearNextPoint = checkProximityToPoint(location, nextPoint);
    
    if (isNearNextPoint) {


      // User has reached the next point
      const updatedCompleted = [...completedPoints, nextPoint];
      setCompletedPoints(updatedCompleted);
      console.log('Completed points:', updatedCompleted.length);
      
      // Remove the completed point from remaining points
      let newRemaining = [...remainingPoints.slice(1)];
      console.log('Remaining points:', newRemaining.length);
      
      // Update remaining points
      setRemainingPoints(newRemaining);
    }
    
    // Update overall route status - do this on every location change, not just when near a point
    const totalPoints = completedPoints.length + remainingPoints.length;
    const totalCompleted = completedPoints.length;
    const isRouteCompleted = remainingPoints.length === 0;

    
    setRouteStatus({
      totalPoints: totalPoints,
      completedPoints: totalCompleted,
      isCompleted: isRouteCompleted,
      progress: totalPoints > 0 ? totalCompleted / totalPoints : 0,
      nextPointIndex: totalCompleted,
      nextPoint: remainingPoints.length > 0 ? remainingPoints[0] : null,
    });

  }, [location, remainingPoints, completedPoints]);
  
  /**
   * Helper function to check if user is within detection radius of a point
   */
  const checkProximityToPoint = useCallback((userLoc, point, radiusInMeters = DETECTION_RADIUS) => {
    if (!userLoc || !point || point.latitude === undefined || point.longitude === undefined) {
      return false;
    }
    
    // Create point features for user and challenge point
    const userPoint = turf.point([userLoc[0], userLoc[1]]);
    const routePoint = turf.point([point.longitude, point.latitude]);
    
    // Calculate distance between points
    const distanceToPoint = distance(userPoint, routePoint, {
      units: 'meters'
    });
    
    // Return whether user is within the detection radius
    return distanceToPoint <= radiusInMeters;
  }, []);
  
  return {
    routeStatus,
    completedPointsList: completedPoints,
    remainingPointsList: remainingPoints,
    isStarted: completedPoints.length > 0,
  };
}