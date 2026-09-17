import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RootNavigator from "./src/navigation/RootNavigator";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/redux/store";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter_24pt-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter_24pt-Medium.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter_24pt-SemiBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter_24pt-Bold.ttf"),
  });

  // console.log(fontsLoaded);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar translucent backgroundColor="transparent" style="dark" />
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}
