import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View, Animated } from 'react-native';
import { Icon } from '@rneui/themed';
import { useSelectedLocation } from '../hooks/useSelectedLocation';
import { useReCenterLocation } from '../hooks/useReCenterLocation';
import { useCurrentChallenge } from '../hooks/useCurrentChallenge';
import { useChallenges } from '../hooks/useChallenges';

const ChallengeFilterer = () => {
  // Get selected location from context
  const { selectedLocation, clearSelectedLocation } = useSelectedLocation();

  // Filter states
  const [activeTagFilters, setActiveTagFilters] = useState([]);
  const [activeCapabilityFilters, setActiveCapabilityFilters] = useState([]);
  const [showTags, setShowTags] = useState(true); // Toggle between tags and capabilities
  const [filtersVisible, setFiltersVisible] = useState(false); // Control filters visibility
  const {  reCenterLoc } = useReCenterLocation();
  const { currentChallenge } = useCurrentChallenge();
  const { challenges } = useChallenges();
  const [challengeTags, setChallengeTags] = useState([]);
  
  
  // Animation for tag switching
  const tagPositionAnim = useRef(new Animated.Value(0)).current;
  
  // Animation for filters visibility
  const filtersHeightAnim = useRef(new Animated.Value(0)).current;
  
  
  const getChallengeTags = () => {
    if (!challenges) {
        return [];
    }
    
    const tags = challenges.map(challenge => {
        return challenge.ChallengeTags.map(tagObj => {
            return {
                id: tagObj.ChallengeTag.id,
                name: tagObj.ChallengeTag.tag
            };
        });
    });
    return tags.flat();
  };



  useEffect(() => {
    const tags = getChallengeTags();
    if (tags) {
        setChallengeTags(tags);
    }
  }, [challenges]);


//   // Challenge tags data
//   const challengeTags = [
//     { id: '1', name: 'For Kids' },
//     { id: '2', name: 'Gastronomic' },
//     { id: '3', name: 'Sightseeing' },
//     { id: '4', name: 'Cultural' },
//     { id: '5', name: 'In Nature' },
//     { id: '6', name: 'Eco-Friendly' },
//     { id: '7', name: 'Adventure' },
//     { id: '8', name: 'Historic' },
//   ];

  // Location capabilities data
  const locationCapabilities = [
    { id: '1', name: 'Spanish Omelette' },
    { id: '2', name: 'Pintxos' },
    { id: '3', name: 'Wheelchair Accessible' },
    { id: '4', name: 'Pet Friendly' },
  ];
  
  // Toggle filter selection
  const toggleTagFilter = (tagId) => {
    setActiveTagFilters(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };
  
  const toggleCapabilityFilter = (capId) => {
    setActiveCapabilityFilters(prev => 
      prev.includes(capId) 
        ? prev.filter(id => id !== capId) 
        : [...prev, capId]
    );
  };

  // Toggle between tag types with animation
  const toggleFilterType = () => {
    Animated.timing(tagPositionAnim, {
      toValue: showTags ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowTags(!showTags);
  };

  // Toggle filters visibility
  const toggleFiltersVisibility = () => {
    const toValue = filtersVisible ? 0 : 1;
    
    Animated.timing(filtersHeightAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setFiltersVisible(!filtersVisible);
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveTagFilters([]);
    setActiveCapabilityFilters([]);
    if (selectedLocation) {
      clearSelectedLocation();
    }
  };

  // Filter display logic
  const displayedFilters = showTags ? challengeTags : locationCapabilities;
  const hasActiveFilters = activeTagFilters.length > 0 || 
    activeCapabilityFilters.length > 0 || 
    selectedLocation;
  
  return (
    <View className={`absolute top-10 z-10 w-full ${currentChallenge ? 'mt-24' : ''}`}>
      {/* Filter toggle button */}
      <View className="flex items-start pl-4 mb-1">
        <TouchableOpacity 
          onPress={toggleFiltersVisibility}
          className="bg-primary rounded-full p-2 shadow-md"
        >
          <Icon 
            name={filtersVisible ? "filter-off" : "filter"} 
            type={filtersVisible ? "material-community" : "font-awesome-5"} 
            size={16} 
            color="#FFFFFF" 
            solid 
          />
        </TouchableOpacity>
      </View>


      <View className="absolute -top-2 right-0">
        <TouchableOpacity 
          onPress={reCenterLoc}
          className=" rounded-full p-2 shadow-md"
        >
        <Icon 
            name="assistant-navigation" 
            type="material" 
            color="#2A7FFF" 
            size={30} 
            style={{ transform: [{ rotate: '45deg' }] }} 
          />
        </TouchableOpacity>
      </View>


      
      {/* Animated filters container */}
      <Animated.View 
        style={{
          maxHeight: filtersHeightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100]
          }),
          opacity: filtersHeightAnim,
          overflow: 'hidden'
        }}
      >
        {/* Top row with filter type toggle and reset button */}
        <View className="flex-row items-center px-3">
          {/* Filter Type Selector */}
          <View className="flex-row items-center bg-[#192841] rounded-lg h-8 w-44 relative">
            <Animated.View 
              className="absolute bg-primary h-7 rounded-md z-0"
              style={{
                width: '50%',
                transform: [{
                  translateX: tagPositionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, 82]
                  })
                }]
              }}
            />
            <TouchableOpacity
              onPress={() => !showTags && toggleFilterType()}
              className="flex-1 h-full justify-center items-center z-10"
            >
              <Text 
                className={`text-xs font-medium ${showTags ? 'text-white' : 'text-[#9CAFC3]'}`}
              >
                Challenge
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => showTags && toggleFilterType()}
              className="flex-1 h-full justify-center items-center z-10"
            >
              <Text 
                className={`text-xs font-medium ${!showTags ? 'text-white' : 'text-[#9CAFC3]'}`}
              >
                Features
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reset Button */}
          {hasActiveFilters && (
            <TouchableOpacity 
              onPress={resetFilters}
              className="flex-row items-center bg-slate-600 rounded-md px-3 py-1.5 ml-2"
            >
              <Icon name="refresh" type="font-awesome" size={12} color="#FFFFFF" />
              <Text className="text-xs ml-1 text-white">Reset</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Filters ScrollView */}
        <View className="px-3">
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-1"
          >
            {/* Selected Location Chip (if any) */}
            {selectedLocation && (
              <View className="flex-row items-center bg-primary rounded-md px-3 py-1.5 mr-2">
                <Icon name="map-marker-alt" type="font-awesome-5" size={12} color="#FFFFFF" />
                <Text className="text-xs text-white mx-1">{selectedLocation.name}</Text>
                <TouchableOpacity onPress={clearSelectedLocation}>
                  <Icon name="times-circle" type="font-awesome-5" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
            
            {/* Filter Chips */}
            {displayedFilters.map((item) => {
              const isActive = showTags 
                ? activeTagFilters.includes(item.id)
                : activeCapabilityFilters.includes(item.id);
                
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => showTags 
                    ? toggleTagFilter(item.id)
                    : toggleCapabilityFilter(item.id)
                  }
                  className={`rounded-md px-3 py-1.5 mr-2
                    ${isActive ? 'bg-primary' : 'bg-[#192841] '}
                  `}
                >
                  <Text 
                    className={`text-xs ${isActive ? 'text-white' : 'text-[#9CAFC3]'}`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Animated.View>
      
      {/* Active filters indicator */}
      {!filtersVisible && hasActiveFilters && (
        <View className="items-start pl-5">
          <View className="bg-primary rounded-full px-2 py-0.5">
            <Text className="text-xs text-white">{activeTagFilters.length + activeCapabilityFilters.length + (selectedLocation ? 1 : 0)}</Text>
          </View>
        </View>
      )}




    </View>
  );
};

export default ChallengeFilterer;