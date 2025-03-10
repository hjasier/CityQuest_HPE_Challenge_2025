import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Text style={isFocused ? styles.activeText : styles.inactiveText}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent', // Esto hace que el fondo sea transparente
    borderTopWidth: 0, // Elimina el borde superior
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  tabItem: {
    padding: 10,
  },
  activeText: {
    color: 'blue', // Color del texto cuando la pestaña está activa
  },
  inactiveText: {
    color: 'gray', // Color del texto cuando la pestaña no está activa
  },
});

export default CTabBar;
