import { useState, useEffect } from 'react';
import { useLocationChallenges } from '../hooks/useLocationChallenges';
import { useChallenges } from '../hooks/useChallenges';
import { useSelectedLocation } from './useSelectedLocation';

export const useFilteredChallenges = () => {
  // Estados para filtros
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const { selectedLocation } = useSelectedLocation();
  

  // Obtener datos
  const { challengesByLocation } = useLocationChallenges();
  const { challenges } = useChallenges();

  // Funciones para manejar filtros
  const toggleTag = (tagName) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tagName) 
        ? prevTags.filter(tag => tag !== tagName) 
        : [...prevTags, tagName]
    );
  };



  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedLocationId(null);
  };


  useEffect(() => {

    if (!challengesByLocation || !challenges) {
      return;
    }

    if (selectedLocation !== null) {
      const location = challengesByLocation?.find(loc => loc.id === selectedLocation.id);
      if (location && location.challenges) {
        challengesToFilter = location.challenges || [];
      }
    } 
    else {
      console.log('No location selected, showing all challenges');
      challengesToFilter = challenges ;
    }

    if (selectedTags.length > 0) {
      challengesToFilter = challengesToFilter.filter(challenge => {
        const challengeTags = challenge.ChallengeTags?.map(tagObj => tagObj.ChallengeTag?.tag) || [];
        return selectedTags.some(tag => challengeTags.includes(tag));
      });
    }

    setFilteredChallenges(challengesToFilter);
    console.log('[FILTER] filteredChallenges', challengesToFilter.length);
  }, [selectedTags, selectedLocation, challengesByLocation, challenges]);

  return {
    filteredChallenges,
    selectedTags,
    toggleTag,
    clearFilters
  };
};
