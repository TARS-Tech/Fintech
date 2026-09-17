import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import TouchableOpacity from "../common/HapticTouchableOpacity";
import { Colors } from "../../theme/colors";
import AppText from "../common/AppText";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileProgressCard({ onCompleteProfile }) {
  const navigation = useNavigation();
  const profile = useSelector((state) => state.user.profile);
  const kyc = useSelector((state) => state.kyc);

  const steps = [
    {
      id: 1,
      title: "Profile",
      icon: "person-outline",
      completed: profile?.profileCompleted,
    },
    {
      id: 2,
      title: "Aadhaar",
      icon: "card-outline",
      completed: kyc.aadhaar.verified,
    },
    {
      id: 3,
      title: "PAN",
      icon: "document-text-outline",
      completed: kyc.pan.verified,
    },
  ];

  const currentStep = steps.find(step => !step.completed);

  // If all profile & KYC steps are completed, hide this progress card
  if (!currentStep) {
    return null;
  }

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const cardTitle = `Complete Your ${currentStep.title}`;

  const buttonTitle = {
    Profile: "Complete Profile",
    Aadhaar: "Verify Aadhaar",
    PAN: "Verify PAN",
  };

  const progressText = `${Math.round(progress)}%`;

  const handleContinue = () => {

    switch (currentStep?.title) {

      case "Profile":
        navigation.navigate("ProfileScreen");
        break;

      case "Aadhaar":
        navigation.navigate("KYC");
        break;

      case "PAN":
        navigation.navigate("Pan");
        break;
    }

  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <AppText size="lg" weight="medium" color={Colors.secondary}>{cardTitle}</AppText>
            <AppText weight="bold" size="sm" color={Colors.primary}>{progressText}</AppText>
          </View>
          <AppText size="sm" color={Colors.textLight} style={{ lineHeight: 18 }}>
            Finish a few simple steps to unlock instant loan offers.
          </AppText>
        </View>

      </View>

      <View style={styles.progressContainer}>
        {/* <View style={styles.progressBarBg}> */}
        {/* <View
            style={[
              styles.progressBarActive,
              {
                width: `${progress}%`,
              },
            ]}
          /> */}
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => {

            const isCurrent =
              currentStep?.id === step.id;

            return (
              <React.Fragment key={step.id}>

                <View style={styles.stepItem}>

                  <View
                    style={[
                      styles.stepCircle,
                      step.completed
                        ? styles.completedCircle
                        : isCurrent
                          ? styles.currentCircle
                          : styles.pendingCircle,
                    ]}
                  >
                    <Ionicons
                      name={
                        step.completed
                          ? "checkmark"
                          : step.icon
                      }
                      size={16}
                      color={
                        step.completed
                          ? "#fff"
                          : isCurrent
                            ? "#fff"
                            : "#94A3B8"
                      }
                    />
                  </View>

                  <AppText
                    size="xs"
                    color={
                      step.completed || isCurrent
                        ? Colors.secondary
                        : Colors.textLight
                    }
                    style={{ marginTop: 0, flex: 1, width: 48, marginTop: 2 }}
                  >
                    {step.title}
                  </AppText>

                </View>

                {index !== steps.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      step.completed
                        ? styles.completedLine
                        : styles.pendingLine,
                    ]}
                  />
                )}

              </React.Fragment>
            );

          })}
        </View>
        {/* </View> */}
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        activeOpacity={0.9}
        style={styles.button}
      >
        <AppText weight="bold" size="sm" color={Colors.white}>{buttonTitle[currentStep?.title]}</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    width: "100%",
  },
  progressBarActive: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
    width: "30%",
  },
  button: {
    backgroundColor: Colors.primary,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  badge: {
    backgroundColor: "#EEF4FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  stepsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    // marginBottom: 20,
  },

  stepItem: {
    alignItems: "center",
    width: 28,
  },

  stepCircle: {
    width: 23,
    height: 23,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  completedCircle: {
    backgroundColor: "#22C55E",
  },

  currentCircle: {
    backgroundColor: Colors.primary,
  },

  pendingCircle: {
    backgroundColor: "#F1F5F9",
  },

  line: {
    flex: 1,
    height: 4,
    marginTop: 10,
  },

  completedLine: {
    backgroundColor: "#22C55E",
  },

  pendingLine: {
    backgroundColor: "#E2E8F0",
  },
});
