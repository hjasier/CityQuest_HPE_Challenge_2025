import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import MapGoogle from "../components/MapGoogle";
import MapMapBox from "../components/MapMapBox";
import BottomSheetComponent from "../components/BottomSheet";
import { useCurrentChallenge } from "../hooks/useCurrentChallenge";
import CurrentChallengeNav from "../components/CurrentChallengeNav";

const MapScreen = () => {

  const {currentChallenge } = useCurrentChallenge();

  return (
    <View className="flex-1 relative">
      {/* Mapa en el fondo */}
      {currentChallenge && (
        <CurrentChallengeNav />
      )}
      <MapMapBox />
      <BottomSheetComponent />
    </View>
  );
};

export default MapScreen;