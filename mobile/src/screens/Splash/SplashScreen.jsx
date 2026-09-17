import { View } from "react-native";
import AppText from "../../components/common/AppText";
import { Colors } from "../../theme/colors";
import Screen from "../../components/common/Screen";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {
  // console.log("Splash Screen Loaded");
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("OnboardingScreen");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Screen
      backgroundColor={Colors.primary}
      barStyle="light-content"
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppText weight="bold" size="h1" color={Colors.white}>
        Finpilot
      </AppText>
    </Screen>
  );
}
