import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/Home/HomeScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import ProfileDetailScreen from "../screens/Profile/ProfileDetailScreen";
import KycScreen from "../screens/KYC/KycScreen";
import AadhaarScreen from "../screens/KYC/AadhaarScreen";
import PanScreen from "../screens/KYC/PanScreen";
import EligibilityScreen from "../screens/Eligibilty/EligibilityScreen";
import LoanExplorerScreen from "../screens/Loan/LoanExplorerScreen";
import LoanOffersScreen from "../screens/Loan/LoanOffersScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
            <Stack.Screen name="KYC" component={KycScreen} />
            <Stack.Screen name="Aadhaar" component={AadhaarScreen} />
            <Stack.Screen name="Pan" component={PanScreen} />
            <Stack.Screen name="Eligibility" component={EligibilityScreen} />
            <Stack.Screen name="LoanExplorerScreen" component={LoanExplorerScreen} />
            <Stack.Screen name="LoanOffers" component={LoanOffersScreen} />
        </Stack.Navigator>
    )
}