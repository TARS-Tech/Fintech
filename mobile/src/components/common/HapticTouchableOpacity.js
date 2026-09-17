import React from "react";
import { TouchableOpacity as RNTouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

export default function TouchableOpacity({ onPress, children, activeOpacity = 0.7, ...props }) {
  const handlePress = (event) => {
    // Subtle, light, tactile vibration that feels premium
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    
    if (onPress) {
      onPress(event);
    }
  };

  return (
    <RNTouchableOpacity {...props} activeOpacity={activeOpacity} onPress={handlePress}>
      {children}
    </RNTouchableOpacity>
  );
}
