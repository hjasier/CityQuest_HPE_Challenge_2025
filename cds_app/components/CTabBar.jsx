import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Icon } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const animations = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;
  
  // Animation value for the moving indicator
  const indicatorTranslateX = useRef(new Animated.Value(0)).current;
  const indicatorScaleX = useRef(new Animated.Value(1)).current;
  const indicatorScaleY = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Reset all tab animations
    animations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === state.index ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
    
    // Calculate the tab width more accurately
    const containerPadding = 5; // Horizontal padding of floatingContainer
    const availableWidth = width - 45; // Subtract the container's horizontal padding (16 * 2)
    const tabWidth = availableWidth / state.routes.length;
    
    // First scale down the indicator
    Animated.sequence([
      Animated.parallel([
        Animated.timing(indicatorScaleX, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(indicatorScaleY, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        })
      ]),
      // Then move it to the correct position
      Animated.timing(indicatorTranslateX, {
        toValue: containerPadding + (state.index * tabWidth),
        duration: 200,
        useNativeDriver: true,
      }),
      // Then scale back up
      Animated.parallel([
        Animated.timing(indicatorScaleX, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(indicatorScaleY, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, [state.index]);

  // Get correct icon for each tab
  const getTabIcon = (routeName) => {
    switch (routeName) {
      case 'Explore': return 'compass';
      case 'Feed': return 'rss';
      case 'Leaderboard': return 'crown';
      case 'TEST': return 'user';
      default: return 'circle';
    }
  };

  // Icon type
  const iconType = 'font-awesome-5';

  // Calculate tab and indicator dimensions
  const containerPadding = 16; // Horizontal padding of main container
  const floatingContainerPadding = 5; // Horizontal padding of floatingContainer
  const availableWidth = width - (containerPadding * 2); // Subtract the container's horizontal padding
  const tabWidth = availableWidth / state.routes.length;
  const indicatorWidth = tabWidth - 10; // Make indicator slightly smaller than tab width

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Floating Tab Bar Container */}
      <View style={styles.floatingContainer}>
        {/* Moving Indicator */}
        <Animated.View 
          style={[
            styles.movingIndicator,
            {
              width: indicatorWidth,
              transform: [
                { translateX: indicatorTranslateX },
                { scaleX: indicatorScaleX },
                { scaleY: indicatorScaleY }
              ]
            }
          ]}
        />
        
        {/* Tab Buttons */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? route.name;
          const isFocused = state.index === index;
          
          // Animated styles for each tab
          const tabScale = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2]
          });
          
          const iconTranslateY = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, -6]
          });
          
          const labelOpacity = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1]
          });
          
          const labelScale = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1]
          });

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
            >
              <Animated.View 
                style={[
                  styles.tabContent,
                  //{ transform: [{ scale: tabScale }] }
                ]}
              >
                <Animated.View
                  style={{
                    //transform: [{ translateY: iconTranslateY }]
                  }}
                >
                  <Icon 
                    name={getTabIcon(route.name)} 
                    type={iconType} 
                    color={isFocused ? "#FFFFFF" : "#9CAFC3"}
                    size={22} 
                    style={styles.icon}
                  />
                </Animated.View>
                
                <Animated.Text 
                  style={[
                    styles.tabLabel,
                    { 
                      color: isFocused ? "#FFFFFF" : "#9CAFC3",
                      opacity: labelOpacity,
                      transform: [{ scale: labelScale }]
                    }
                  ]}
                >
                  {label}
                </Animated.Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  floatingContainer: {
    flexDirection: 'row',
    backgroundColor: '#192841',
    borderRadius: 25,
    height: 65,
    width: '100%',
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 15,
    shadowColor: '#192841',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    position: 'relative',
  },
  movingIndicator: {
    height: 50,
    backgroundColor: '#36BFF9',
    borderRadius: 20,
    position: 'absolute',
    zIndex: 0,
    top: 7.5,
    left: 5, // Adjusted left position
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    zIndex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 2,
  },
});

export default CTabBar;