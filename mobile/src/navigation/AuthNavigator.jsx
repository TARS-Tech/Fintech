import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import VerificationCode from "../screens/Auth/VerificationCode";
import SplashScreen from "../screens/Splash/SplashScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        // <Stack.Navigator screenOptions={{ headerShown: false }}>

        // </Stack.Navigator>

        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="VerificationCode" component={VerificationCode} />
        </Stack.Navigator>
    )
}