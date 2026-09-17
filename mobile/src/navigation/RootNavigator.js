import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/Splash/SplashScreen";
import OnboardingItem from "../components/onboarding/OnboardingItem";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import VerificationCode from "../screens/Auth/VerificationCode";
import HomeScreen from "../screens/Home/HomeScreen";
import AppRouter from "./AppRouter";
import StartupScreen from "../screens/Startup/StartupScreen";

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <StartupScreen />

      <AppRouter />
    </NavigationContainer>
  );
}
