import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { Icon } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.View);
const StyledAnimatedText = styled(Animated.Text);

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
      case 'Profile': return 'user';
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
    <StyledView className={`absolute bottom-0 left-0 right-0 bg-transparent px-4 pb-5 items-center`} style={{ paddingBottom: insets.bottom }}>
      {/* Floating Tab Bar Container */}
      <StyledView className={`flex-row bg-[#192841] rounded-[25px] h-[65px] w-full px-[5px] items-center justify-between shadow-lg relative`}
        style={{
          shadowColor: '#192841',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 15,
          elevation: 15,
        }}
      >
        {/* Moving Indicator */}
        <StyledAnimatedView 
          className={`h-[50px] bg-primary rounded-[20px] absolute z-0 top-[7.5px] left-[5px]`}
          style={{
            width: indicatorWidth,
            transform: [
              { translateX: indicatorTranslateX },
              { scaleX: indicatorScaleX },
              { scaleY: indicatorScaleY }
            ]
          }}
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
            <StyledTouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              className="flex-1 justify-center items-center h-[60px] z-[1]"
            >
              <StyledAnimatedView className="items-center justify-center">
                <StyledAnimatedView>
                  <Icon 
                    name={getTabIcon(route.name)} 
                    type={iconType} 
                    color={isFocused ? "#FFFFFF" : "#9CAFC3"}
                    size={22} 
                    className="mb-1"
                  />
                </StyledAnimatedView>
                
                <StyledAnimatedText 
                  className="text-[11px] font-semibold tracking-[0.3px] mt-0.5"
                  style={{ 
                    color: isFocused ? "#FFFFFF" : "#9CAFC3",
                    opacity: labelOpacity,
                    transform: [{ scale: labelScale }]
                  }}
                >
                  {label}
                </StyledAnimatedText>
              </StyledAnimatedView>
            </StyledTouchableOpacity>
          );
        })}
      </StyledView>
    </StyledView>
  );
};

export default CTabBar;