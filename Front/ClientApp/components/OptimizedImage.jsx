import React, { useState, useCallback } from 'react'
import { View, Image, ActivityIndicator } from 'react-native'

const OptimizedImage = ({ uri, style }) => {
  const [loading, setLoading] = useState(true);
  
  const handleLoadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <View style={style}>
      {loading && (
        <ActivityIndicator 
          style={{
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0
          }} 
        />
      )}
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        onLoadEnd={handleLoadEnd}
      />
    </View>
  );
};