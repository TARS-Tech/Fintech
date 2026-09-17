import { useRef, useState } from "react";
import Screen from "../../components/common/Screen";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import { FlatList, View } from "react-native";
import TouchableOpacity from "../../components/common/HapticTouchableOpacity";

import onboardingData from "../../constants/onboardingData";
import OnboardingItem from "../../components/onboarding/OnboardingItem";
import PaginationDots from "../../components/onboarding/PaginationDots";

import { useNavigation } from "@react-navigation/native";

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef?.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate("RegisterScreen");
    }
  };
  return (
    <Screen>
      <TouchableOpacity
        style={{
          alignSelf: "flex-end",
          marginRight: 24,
          marginTop: 12,
        }}
      >
        <AppText color="#555">Skip</AppText>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width,
          );

          setCurrentIndex(index);
        }}
      />
      <PaginationDots
        currentIndex={currentIndex}
        total={onboardingData.length}
      />

      <View
        style={{
          paddingHorizontal: 25,
          marginTop: 35,
          marginBottom: 25,
        }}
      >
        <AppButton
          title={
            currentIndex === onboardingData.length - 1
              ? "Get Started"
              : "Continue"
          }
          onPress={handleNext}
        />
      </View>
    </Screen>
  );
}
