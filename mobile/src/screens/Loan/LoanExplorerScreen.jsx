import React from "react";
import { Image, StyleSheet, View } from "react-native";
import CollapsibleHeaderLayout from "../../components/common/CollapsibleHeaderLayout";
import Animated, { interpolate, Extrapolation, interpolateColor, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Colors } from "../../theme/colors";
import AppText from "../../components/common/AppText";
import TouchableOpacity from "../../components/common/HapticTouchableOpacity";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import LoanExplorer from "../../../assets/loan/loan-explorer.png";
import { useNavigation } from "@react-navigation/native";
import LoanCard from "./LoanCard";
import PersonalLoan from "../../../assets/loan/personal-loan-type.png"
import HomeLoan from "../../../assets/loan/home-loan-type.png"
import BusinessLoan from "../../../assets/loan/business-loan-type.png"
import EducationLoan from "../../../assets/loan/education-loan-type2.png"
import VehicleLoan from "../../../assets/loan/vehicle-loan-type.png"
import GoldLoan from "../../../assets/loan/gold-loan-type.png"
import EligiblePerson from "../../../assets/loan/eligibility-person.png"

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);
const AnimatedAppText = Animated.createAnimatedComponent(AppText);

const BlueCheckIcon = ({ size = 20 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Defs>
            <LinearGradient id="blueCheckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#1D4ED8" />
                <Stop offset="100%" stopColor="#2563EB" />
            </LinearGradient>
        </Defs>
        <Circle cx="12" cy="12" r="12" fill="url(#blueCheckGrad)" />
        <Path
            d="M6.8 12.2L10.8 16.0C12.6 12.6 14.6 10.2 16.8 8.6"
            stroke="#FFFFFF"
            strokeWidth="2.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default function LoanExplorerScreen() {
    const navigation = useNavigation();
    const scrollY = useSharedValue(0);

    const STICK_THRESHOLD = 10;
    const SCROLL_THRESHOLD = 120;

    const WelcomAnimatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            scrollY.value,
            [0, STICK_THRESHOLD],
            ["hsla(0, 0%, 100%, 0.00)", "rgba(255, 255, 255, 0)"]
        );
        return { backgroundColor };
    });

    const backButtonIconStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            scrollY.value,
            [STICK_THRESHOLD, SCROLL_THRESHOLD],
            ["#FFFFFF", "#000000"]
        );
        return { color };
    });

    const titleAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [STICK_THRESHOLD, SCROLL_THRESHOLD],
            [0, 1],
            Extrapolation.CLAMP
        );
        const color = interpolateColor(
            scrollY.value,
            [STICK_THRESHOLD, SCROLL_THRESHOLD],
            ["#FFFFFF", "#000000"]
        );
        return { opacity, color };
    });

    const handleLoanPage = (loanId) => {
        navigation.navigate("LoanOffers", {
            loanId,
        });
    }

    return (
        <View style={{ flex: 1 }}>
            <CollapsibleHeaderLayout
                externalScrollY={scrollY}
                scrollBehavior="overlay"
                bannerGradientColors={["rgba(50, 112, 255, 1)", "#6d99ffff"]}
                // bannerBackgroundColor={"#6d99ffff"}
                bannerPaddingTopOffset={10}
                bannerPaddingBottom={45}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 110 }}
                navbarLeft={
                    <Animated.View style={[styles.welcomeChip, WelcomAnimatedStyle]}>
                        <TouchableOpacity
                            onPress={() => navigation.canGoBack() && navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <AnimatedIonicons name="arrow-back" size={20} style={backButtonIconStyle} />
                        </TouchableOpacity>
                        <AnimatedAppText
                            weight="medium"
                            size="md"
                            style={[{ marginRight: 8, marginLeft: -4 }, titleAnimatedStyle]}
                        >
                            Loan
                        </AnimatedAppText>
                    </Animated.View>
                }
                bannerStyle={{ flexDirection: "row", overflow: "hidden" }}
                bannerContent={
                    <>
                        <View style={styles.heroTextContainer}>
                            <View style={styles.badgePill}>
                                <AppText weight="medium" size="xxs" color="#ffffffff">
                                    Loan offers
                                </AppText>
                            </View>

                            <AppText
                                weight="medium"
                                size="md"
                                color="#fcfcf7ff"
                                style={{ textAlign: "left" }}
                            >
                                Guaranteed loan offers
                            </AppText>
                            <AppText
                                weight="bold"
                                size="h2"
                                color="#FFFFFF"
                                style={{ textAlign: "left", lineHeight: 34, marginVertical: 2 }}
                            >
                                Up to ₹10 lakh
                            </AppText>
                            <AppText
                                weight="regular"
                                size="xs"
                                color="#eaeaeaff"
                                style={{ textAlign: "left", marginBottom: 12 }}
                            >
                                Explore loan options matched to your needs.
                            </AppText>

                            {/* <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
                                <AppText weight="bold" size="sm" color="#FFFFFF">
                                    Apply now
                                </AppText>
                                <View style={styles.ctaArrowCircle}>
                                    <Ionicons name="arrow-forward" size={14} color="#6d99ffff" />
                                </View>
                            </TouchableOpacity> */}
                        </View>

                        <Image source={LoanExplorer} style={styles.bannerImage} resizeMode="contain" />

                        {/* Pixel-perfect layered SVG curved bottom wave design */}
                        <View style={styles.bottomWaveWrap} pointerEvents="none">
                            <Svg width="100%" height="60" viewBox="0 0 375 60" preserveAspectRatio="none">
                                <Path
                                    d="M0.0,22.1 C3.48,22.97 13.95,25.73 20.9,27.3 C27.85,28.87 34.75,30.28 41.7,31.5 C48.65,32.72 55.65,33.67 62.6,34.6 C69.55,35.53 76.45,36.52 83.4,37.1 C90.35,37.68 97.35,37.82 104.3,38.1 C111.25,38.38 118.15,38.73 125.1,38.8 C132.05,38.87 139.05,38.78 146.0,38.5 C152.95,38.22 159.85,37.68 166.8,37.1 C173.75,36.52 180.75,35.88 187.7,35.0 C194.65,34.12 201.55,33.02 208.5,31.8 C215.45,30.58 222.45,29.2 229.4,27.7 C236.35,26.2 236.77,25.92 250.2,22.8 C263.63,19.68 295.03,12.3 310.0,9.0 C324.97,5.7 329.17,4.5 340.0,3.0 C350.83,1.5 369.17,0.5 375.0,0.0 L375,60 L0,60 Z"
                                    fill="rgba(255, 255, 255, 0.12)"
                                />
                                <Path
                                    d="M0.0,43.3 C3.48,43.82 13.95,45.42 20.9,46.4 C27.85,47.38 34.75,48.5 41.7,49.2 C48.65,49.9 55.65,50.3 62.6,50.6 C69.55,50.9 76.45,51.05 83.4,51.0 C90.35,50.95 97.35,50.65 104.3,50.3 C111.25,49.95 118.15,49.55 125.1,48.9 C132.05,48.25 139.05,47.33 146.0,46.4 C152.95,45.47 159.85,44.22 166.8,43.3 C173.75,42.38 180.75,41.88 187.7,40.9 C194.65,39.92 201.55,38.73 208.5,37.4 C215.45,36.07 222.45,34.63 229.4,32.9 C236.35,31.17 236.77,30.15 250.2,27.0 C263.63,23.85 295.03,17.5 310.0,14.0 C324.97,10.5 329.17,7.92 340.0,6.0 C350.83,4.08 369.17,3.08 375.0,2.5 L375,60 L0,60 Z"
                                    fill="#80a6ffff"
                                />
                            </Svg>
                        </View>
                    </>
                }
            >
                <View style={styles.loanSection}>

                    <View style={styles.sectionHeader}>
                        <View>
                            <AppText size="lg" weight="medium">
                                Explore Loans
                            </AppText>

                            <AppText
                                size="xs"
                                color="#777"
                            >
                                Find the right loan for your needs
                            </AppText>
                        </View>
                    </View>


                    {/* First Bento row */}

                    <View style={styles.bentoRow}>

                        <LoanCard
                            variant="large"
                            title="Personal Loan"
                            amount="Up to ₹7.5 Lakh"
                            image={PersonalLoan}
                            onPress={() => handleLoanPage("personal-loan")}
                        />

                        <View style={styles.bentoRightColumn}>

                            <LoanCard
                                variant="small"
                                title="Home Loan"
                                amount="Up to ₹50 Lakh"
                                image={HomeLoan}
                                onPress={() => handleLoanPage("home-loan")}
                            />

                            <LoanCard
                                variant="small"
                                title="Business Loan"
                                amount="Up to ₹20 Lakh"
                                image={BusinessLoan}
                                onPress={() => handleLoanPage("business-loan")}
                            />

                        </View>

                    </View>


                    {/* Second Bento row */}

                    <View style={styles.bentoRow}>

                        <LoanCard
                            variant="wide"
                            title="Education Loan"
                            amount="Up to ₹15 Lakh"
                            image={EducationLoan}
                            onPress={() => handleLoanPage("education-loan")}
                        />

                        <LoanCard
                            variant="medium"
                            title="Vehicle Loan"
                            amount="Up to ₹10 Lakh"
                            image={VehicleLoan}
                            onPress={() => handleLoanPage("vehicle-loan")}
                        />

                    </View>


                    {/* Full width */}

                    <LoanCard
                        variant="full"
                        title="Gold Loan"
                        amount="Up to ₹25 Lakh"
                        image={GoldLoan}
                        badge="⚡ Instant cash • 0.89%/mo interest"
                        onPress={() => handleLoanPage("gold-loan")}
                    />

                </View>
                {/* <View style={{ height: 2000 }}></View> */}
                <View style={styles.eligibleSection}>
                    {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}> */}

                    <Image source={EligiblePerson} style={{ width: 110, height: 130 }} />
                    <View style={styles.eligibleHeader}>
                        <AppText weight="medium" size="lg" color="#1E293B">Find a loan that fits you</AppText>
                        <AppText weight="regular" size="xs" color="#64748B">Check your eligibility and discover loan options suited to your profile</AppText>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.primary, paddingVertical: 7, paddingHorizontal: 15, borderRadius: 10, alignSelf: "flex-start",
                                marginTop: 10
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <AppText size="sm" weight="medium" color="#ffffffff">
                                    Check Eligibility
                                </AppText>
                                <Ionicons name="arrow-forward" size={18} color="#ffffffff" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* </View> */}


                </View>

                <View style={styles.howItWorksSection}>
                    <AppText weight="medium" size="lg" color="#1E293B">How it works</AppText>
                    <AppText weight="regular" size="xs" color="#64748B" style={{ marginTop: 2 }}>Get from profile to suitable loan options in 3 simple steps.</AppText>

                    <View style={styles.stepsList}>
                        <View style={styles.stepRow}>
                            <BlueCheckIcon size={20} />
                            <AppText weight="regular" size="sm" color="#334155" style={{ marginLeft: 10, flex: 1 }}>
                                Share basic financial details securely.
                            </AppText>
                        </View>
                        <View style={styles.stepRow}>
                            <BlueCheckIcon size={20} />
                            <AppText weight="regular" size="sm" color="#334155" style={{ marginLeft: 10, flex: 1 }}>
                                We'll evaluate your profile and eligibility.
                            </AppText>
                        </View>
                        <View style={styles.stepRow}>
                            <BlueCheckIcon size={20} />
                            <AppText weight="regular" size="sm" color="#334155" style={{ marginLeft: 10, flex: 1 }}>
                                See loan options that match your profile.
                            </AppText>
                        </View>
                    </View>
                </View>
            </CollapsibleHeaderLayout>
        </View>
    );
}

const styles = StyleSheet.create({
    welcomeChip: {
        backgroundColor: "rgba(255, 255, 255, 0)",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 30,
        paddingRight: 4,
    },
    backButton: {
        paddingHorizontal: 0,
        marginRight: 10,
        color: "white"
    },
    heroTextContainer: {
        width: "60%",
        gap: 2,
        zIndex: 2,
    },
    badgePill: {
        backgroundColor: "#9743ffff",
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 6,
    },
    ctaButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        alignSelf: "flex-start",
        marginTop: 4,
    },
    ctaArrowCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    bannerImage: {
        width: 250,
        height: 250,
        position: "absolute",
        right: -60,
        bottom: -22,
        zIndex: 1,
    },
    bottomWaveWrap: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 0,
    },

    loanSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
        gap: 12,
    },

    sectionHeader: {
        marginBottom: 4,
    },

    bentoRow: {
        flexDirection: "row",
        gap: 10,
    },

    bentoRightColumn: {
        flex: 0.85,
        gap: 10,
    },
    eligibleSection: {
        width: "100%",
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    eligibleHeader: {
        flex: 1,
        width: "60%",
        justifyContent: "center",
        marginTop: 10
    },
    howItWorksSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 24,
    },
    stepsList: {
        gap: 12,
        marginTop: 14,
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 9, borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    },
});