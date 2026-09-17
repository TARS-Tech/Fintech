import Screen from "../common/Screen";
import AppText from "../common/AppText";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import onboarding1 from "../../../assets/onboarding1.jpeg";
import onboarding2 from "../../../assets/onboarding2.png";
import onboarding3 from "../../../assets/onboarding3.jpeg";

const { width } = Dimensions.get("window");

export default function OnboardingItem({ item }) {
  return (
    <View style={styles.container}>
      <Image source={item.image} resizeMode="cover" style={styles.image} />
      <AppText weight="bold" style={styles.title}>
        {item.title}
      </AppText>
      <AppText color="#6B7280" style={styles.subtitle}>
        {item.subtitle}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  image: {
    width: width - 50,
    height: 300,
    borderRadius: 35,
    marginTop: 35,
  },
  title: {
    textAlign: "center",
    marginTop: 45,
    fontSize: 23,
    lineHeight: 30,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 20,
    // paddingHorizontal: 15,
  },
});
