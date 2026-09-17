import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { View } from "react-native";

export default function Screen({
  children,
  backgroundColor = "#fff",
  contentBackgroundColor,
  barStyle = "dark-content",
  style,
}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />

      <View
        style={[
          {
            flex: 1,
            backgroundColor: contentBackgroundColor || backgroundColor,
          },
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}