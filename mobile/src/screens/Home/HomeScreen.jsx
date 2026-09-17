import { View, StyleSheet, Image, ScrollView, Platform, StatusBar, Dimensions, RefreshControl } from "react-native";
import TouchableOpacity from "../../components/common/HapticTouchableOpacity";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    withTiming,
    withDelay,
    useAnimatedReaction,
    interpolate,
    interpolateColor,
    Extrapolation,
    runOnJS
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import Screen from "../../components/common/Screen";
import AppText from "../../components/common/AppText";
import { Colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import Banner from "../../../assets/banner-image.png";
import ProfileProgressCard from "../../components/cards/ProfileProgressCard";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../../assets/logo-new.png";
import LoanImage from "../../../assets/loan-image.png";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle } from "react-native-svg";
import EligibilityLoan3d from "../../../assets/eligibility-loan-3d.png";
import HomeLoan from "../../../assets/loan/home-loan.png";
import PersonalLoan from "../../../assets/loan/personal-loan.png";
import BusinessLoan from "../../../assets/loan/business-loan.png";
import EducationLoan from "../../../assets/loan/education-loan.png";
import LoanVerify from "../../../assets/loan/loan-verify.png";
import HomeSkeleton from "../../components/skeletons/HomeSkeleton";
import { setUserHydrated } from "../../redux/slices/userSlice";
import { getProfile } from "../../redux/actions/profileActions";
import { getKycState } from "../../redux/actions/kycActions";
import CollapsibleHeaderLayout from "../../components/common/CollapsibleHeaderLayout";
import { getEligibility } from "../../redux/actions/eligibilityActions";
import AppButton from "../../components/common/AppButton";



const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const CustomHomeIcon = ({ size = 24, color = "#000" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M 6,21 L 18,21 Q 21,21 21,18 L 21,11.5 Q 21,9.5 19.5,8 L 14,3 Q 12,1 10,3 L 4.5,8 Q 3,9.5 3,11.5 L 3,18 Q 3,21 6,21 Z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M 9 17 L 15 17"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
        />
    </Svg>
);

const CustomLoanIcon = ({ size = 24, color = "#000" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M 12 2 Q 8 5 4 6 L 4 12 Q 4 17 12 21 Q 20 17 20 12 L 20 6 Q 16 5 12 2 Z"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M 9 11 L 11.5 13.5 L 15.5 9"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const ShieldRupeeIcon = ({ size = 26, color = Colors.primary }) => (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ position: "absolute" }}>
            <Path
                d="M 12 2 Q 8 5 4 6 L 4 12 Q 4 17 12 21 Q 20 17 20 12 L 20 6 Q 16 5 12 2 Z"
                stroke={color}
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
        <AppText weight="medium" size="sm" color="#E57C00" style={{ marginTop: -1 }}>
            ₹
        </AppText>
    </View>
);

const PercentIcon = ({ size = 15, color = Colors.primary }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M 19 5 L 5 19"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
        />
        <Circle cx="7.5" cy="7.5" r="2.5" stroke={color} strokeWidth="2" />
        <Circle cx="16.5" cy="16.5" r="2.5" stroke={color} strokeWidth="2" />
    </Svg>
);

// const ShieldRupeeIcon = ({ width = 34, height = 38 }) => (
//     <Svg width={width} height={height} viewBox="0 0 34 38" fill="none">
//         {/* Shield Outer Path */}
//         <Path
//             d="M 17 2.5 C 10.5 4.5 4.5 5.8 4.5 15 C 4.5 24 11 31 17 35.5 C 23 31 29.5 24 29.5 15 C 29.5 5.8 23.5 4.5 17 2.5 Z"
//             stroke="#0A2540"
//             strokeWidth="2.8"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             fill="#F4F8FA"
//         />
//         {/* Rupee Symbol ₹ inside */}
//         <Path
//             d="M 11.5 12 H 22.5 M 11.5 16.5 H 21.5 M 11.5 12 C 16 12 19.5 13 19.5 16.5 C 19.5 20 16 21 11.5 21 M 15 21 L 21.5 28.5"
//             stroke="#E57C00"
//             strokeWidth="2.6"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         />
//     </Svg>
// );

const HEADER_CONTENT_HEIGHT = 50;
const STICK_THRESHOLD = 10;

// Create animated components for smooth color interpolation
const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const { width } = Dimensions.get("window");

export default function HomeScreen() {
    const navigation = useNavigation();
    const profile = useSelector((state) => state.user.profile);
    const { eligibility } = useSelector((state) => state.eligibility)
    const kyc = useSelector((state) => state.kyc);
    const hydrated = useSelector((state) => state.user.hydrated);
    const insets = useSafeAreaInsets();
    const homeReveal = useSharedValue(0);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getEligibility());
    }, [])

    // useEffect(() => {
    //     console.log("Eligibility:", eligibility)
    // }, [eligibility])
    // Mock eligibility status check
    const [eligibilityChecked, setEligibilityChecked] = useState(profile?.eligibilityChecked || false);

    const scrollY = useSharedValue(0);

    const onRefresh = async () => {
        dispatch(setUserHydrated(false));
        try {
            await dispatch(getProfile());
            await dispatch(getKycState());
        } catch (error) {
            console.error("Failed to refresh:", error);
        } finally {
            // 3. Hide the skeleton loader once data is ready
            dispatch(setUserHydrated(true));
        }
    }

    const WelcomAnimatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            scrollY.value,
            [0, STICK_THRESHOLD],
            ["hsla(0, 0%, 100%, 1.00)", "rgba(255, 255, 255, 0)"]
        );
        return { backgroundColor };
    })

    const handleCompleteProfile = () => {
        if (!profile) return;

        if (profile.profileCompleted) {
            navigation.navigate("KYC");
        } else {
            navigation.navigate("ProfileScreen");
        }
    };

    useEffect(() => {
        if (hydrated) {
            homeReveal.value = withTiming(1, {
                duration: 300,
            });
        } else {
            homeReveal.value = 0;
        }
    }, [hydrated]);

    const heroRevealStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                homeReveal.value,
                [0, 1],
                [0, 1]
            ),

            transform: [
                {
                    translateY: interpolate(
                        homeReveal.value,
                        [0, 1],
                        [-35, 0]
                    ),
                },
            ],
        };
    });

    const eligibilityRevealStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            homeReveal.value,
            [0, 0.35, 1],
            [0, 0, 1],
            Extrapolation.CLAMP
        );

        return {
            opacity: progress,

            transform: [
                {
                    translateY: interpolate(
                        progress,
                        [0, 1],
                        [-30, 0]
                    ),
                },
            ],
        };
    });

    const exploreRevealStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            homeReveal.value,
            [0.15, 0.5, 1],
            [0, 0, 1],
            Extrapolation.CLAMP
        );

        return {
            opacity: progress,

            transform: [
                {
                    translateY: interpolate(
                        progress,
                        [0, 1],
                        [-25, 0]
                    ),
                },
            ],
        };
    });

    const lowerContentRevealStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            homeReveal.value,
            [0.35, 0.65, 1],
            [0, 0, 1],
            Extrapolation.CLAMP
        );

        return {
            opacity: progress,

            transform: [
                {
                    translateY: interpolate(
                        progress,
                        [0, 1],
                        [-20, 0]
                    ),
                },
            ],
        };
    });

    // if (!hydrated) {
    //     return <HomeSkeleton />
    // }

    return (
        <View style={{ flex: 1 }}>
            <CollapsibleHeaderLayout
                isHydrated={hydrated}
                bannerBackgroundColor={Colors.primary}
                bannerPaddingBottom={40}
                externalScrollY={scrollY}
                bannerPaddingTopOffset={10}
                bannerStyle={[heroRevealStyle, { flexDirection: "row" }]}
                bannerContent={
                    hydrated ? (
                        <>
                            <View style={styles.heroTextContainer}>
                                <AppText
                                    weight="bold"
                                    size="h3"
                                    color="#eaeaeaff"
                                    style={{ textAlign: "left", lineHeight: 28 }}
                                >
                                    Compare{"\n"}Loan Offers
                                </AppText>
                                <AppText
                                    weight="medium"
                                    size="xs"
                                    color="#eaeaeaff"
                                    style={{ textAlign: "left" }}
                                >
                                    Find the right loan for{"\n"}your needs.
                                </AppText>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#eaeaea", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, alignSelf: "flex-start", borderWidth: 1, borderColor: "#759ac0ff",
                                    }}
                                    onPress={() => setEligibilityChecked(true)}
                                >
                                    <AppText size="xs" weight="medium" color="#000000ff">
                                        Explore Offers →
                                    </AppText>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.bannerBgShape} />
                            <View style={styles.bannerBgShape2} />
                            <Image source={LoanImage} style={styles.banner} resizeMode="contain" />
                        </>
                    ) : null
                }
                navbarLeft={
                    <Animated.View style={[styles.welcomeChip, WelcomAnimatedStyle]}>
                        <Image source={Logo} style={{ width: 30, height: 30 }} />
                        <AppText
                            weight="medium"
                            size="md"
                            style={{ marginRight: 8, marginLeft: -4 }}
                        >
                            {profile?.name
                                ? `Welcome, ${profile.name.split(" ")[0]}`
                                : "Welcome to FinPilot"}
                        </AppText>
                    </Animated.View>
                }
                navbarRight={
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ProfileDetail")}
                        style={[styles.profileIconBtn]}
                    >
                        <Ionicons name="person" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                }
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor="transparent" colors={["transparent"]} />
                }
                contentContainerStyle={{ paddingBottom: 110 }}
            >
                {!hydrated ? (
                    <View style={{ marginTop: 80 }}>
                        <HomeSkeleton />
                    </View>
                ) : (
                    <>
                        {/* ── Progress Card ── */}
                        <View style={styles.cardContainer}>
                            <ProfileProgressCard />
                        </View>

                        <Animated.View style={eligibilityRevealStyle}>
                            {/* ── Section 2: Eligibility Card ── */}
                            <View style={{ marginTop: 10 }}>
                                {eligibility?.status === null ? (
                                    <View style={styles.eligibilityCard}>
                                        <View style={{ flex: 1, paddingRight: 8 }}>
                                            <AppText size="md" weight="semibold" color={Colors.secondary}>
                                                Check Your Eligibility
                                            </AppText>
                                            <AppText
                                                size="xs"
                                                color={Colors.textLight}
                                                style={{ marginTop: 0, lineHeight: 18 }}
                                            >
                                                {kyc?.aadhaar?.verified && kyc?.pan?.verified
                                                    ? "Know your loan limit instantly before applying."
                                                    : "Complete your KYC (Aadhaar & PAN) to unlock eligibility check."}
                                            </AppText>
                                            <TouchableOpacity
                                                style={styles.checkNowBtn}
                                                onPress={() => navigation.navigate("Eligibility")}
                                            >
                                                <AppText size="xs" weight="bold" color="#FFFFFF">
                                                    Check Now
                                                </AppText>
                                            </TouchableOpacity>
                                        </View>
                                        {/* <Ionicons
                                name="analytics"
                                size={130}
                                color="#BFDBFE"
                                style={{ opacity: 0.8, position: "absolute", right: 20, bottom: -30 }}
                            /> */}
                                        <Image
                                            source={EligibilityLoan3d}
                                            style={{ width: 100, height: 70, opacity: 0.8, position: "absolute", right: 20, bottom: -2 }}
                                        />
                                    </View>
                                ) : (
                                    <LinearGradient
                                        colors={["#e7efffff", "#f8faffff", "#FFFFFF"]}
                                        locations={[0, 0.4, 1]}
                                        start={{ x: 0.5, y: 0 }}
                                        end={{ x: 0.5, y: 0.8 }}
                                        style={styles.loanCard}
                                    >
                                        <View style={{ flexDirection: "row", gap: 5, paddingHorizontal: 20, }}>
                                            <ShieldRupeeIcon />
                                            <View style={{ justifyContent: "center" }}>
                                                <AppText size="md" weight="medium" color={Colors.primary} style={{ letterSpacing: -0.2 }}>
                                                    Smart Funds
                                                </AppText>
                                                <Svg width={100} height={10} viewBox="0 0 110 10" fill="none" style={{ marginTop: -1 }}>
                                                    <Path
                                                        d="M 2 2.5 L 85 2 L 15 7.5 L 105 7"
                                                        stroke="#f5ca0bff"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </Svg>
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, }}>
                                            <View>
                                                <AppText size="sm" weight="regular" color={Colors.textLight}>Get Up To</AppText>
                                                <AppText size="xxl" weight="medium" color={Colors.black}>₹5,00,000</AppText>
                                            </View>

                                            <View>
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                                    <Ionicons name="calendar-clear-outline" size={15} color={Colors.primary} />
                                                    <AppText size="sm" weight="regular" color={Colors.textLight}>
                                                        Up to <AppText size="sm" weight="medium" color="#515151ff">36 months</AppText>
                                                    </AppText>
                                                </View>

                                                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 }}>
                                                    <PercentIcon size={15} color={Colors.primary} />
                                                    <AppText size="sm" weight="regular" color={Colors.textLight}>
                                                        Competitive rates
                                                    </AppText>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ marginTop: 10, backgroundColor: "#7fa8ff3f", justifyContent: "center", alignItems: "center", padding: 10 }}>
                                            <AppText size="sm" weight="regular" color={Colors.textLight}>Your loan application, made simple</AppText>
                                        </View>

                                        <View style={{ marginTop: 15, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <TouchableOpacity style={{}}>
                                                <AppText size="sm" weight="medium" color={Colors.primary} style={{ textDecorationLine: "underline" }}>Terms and Conditions</AppText>
                                            </TouchableOpacity>

                                            <AppButton
                                                title="Apply Now"
                                                onPress={() => { }}
                                                style={{ height: 35, paddingHorizontal: 10, borderRadius: 8 }}
                                                textWeight="medium"
                                                rightIcon={<Ionicons name="arrow-forward-outline" size={16} color="#FFFFFF" />}
                                            />
                                        </View>
                                    </LinearGradient>
                                )}
                            </View>
                        </Animated.View>

                        <Animated.View style={exploreRevealStyle}>
                            {/* ── Section 1: Explore Loans ── */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <AppText size="lg" weight="medium" color={Colors.secondary}>
                                        Explore Loans
                                    </AppText>
                                    <AppText size="xs" color={Colors.textLight} style={{ marginTop: 2 }}>
                                        Choose the loan that's right for you
                                    </AppText>
                                </View>

                                <View style={styles.exploreView} >
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                                        {[
                                            { title: `Personal ${"\n"}Loan`, rate: "10.5%", max: "₹15 Lakh", icon: PersonalLoan, bg: "#EFF6FF", loanId: "personal-loan", route: "EligibilityScreen" },
                                            { title: `Home ${"\n"}Loan`, rate: "8.4%", max: "₹10 Crore", icon: HomeLoan, bg: "#F0FDF4", loanId: "home-loan", route: "" },
                                            { title: `Business ${"\n"}Loan`, rate: "13.0%", max: "₹50 Lakh", icon: BusinessLoan, bg: "#FEF2F2", loanId: "business-loan", route: "" },
                                            { title: `Education ${"\n"}Loan`, rate: "9.5%", max: "₹20 Lakh", icon: EducationLoan, bg: "#FDF4FF", loanId: "education-loan", route: "" },
                                            // {title: "Vehicle Loan", rate: "10.0%", max: "₹30 Lakh", icon: "car", bg: "#FFF7ED" },
                                        ].map((item, idx) => (
                                            <TouchableOpacity
                                                key={idx}
                                                style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}
                                                onPress={() => navigation.navigate("LoanOffers", { loanId: item.loanId })}
                                            >
                                                <Image source={item.icon} style={{ width: 50, height: 50 }} />
                                                <AppText size="xs" weight="medium" color={Colors.textLight} style={{ lineHeight: 13, textAlign: "center" }}>
                                                    {item.title}
                                                </AppText>
                                            </TouchableOpacity>
                                        ))


                                        }

                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingHorizontal: 10, width: "100%" }}>
                                        <View style={{ width: "75%", paddingHorizontal: 10, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.background, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <AppText size="xs" weight="medium" color="#363636ff">Check & Compare loan offers</AppText>
                                            <Image source={LoanVerify} style={{ width: 40, height: 40 }} />
                                        </View>
                                        <TouchableOpacity style={{ padding: 9, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.background, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onPress={() => navigation.navigate("LoanExplorerScreen")}>
                                            <AppText size="sm" weight="medium" color="#363636ff" >More</AppText>
                                            <Ionicons name="chevron-forward" size={16} color="#363636ff" />

                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.exploreList}
                    >
                        {[
                            { title: "Personal Loan", rate: "10.5%", max: "₹15 Lakh", icon: "person", bg: "#EFF6FF" },
                            { title: "Home Loan", rate: "8.4%", max: "₹10 Crore", icon: "home", bg: "#F0FDF4" },
                            { title: "Business Loan", rate: "13.0%", max: "₹50 Lakh", icon: "business", bg: "#FEF2F2" },
                            { title: "Education Loan", rate: "9.5%", max: "₹20 Lakh", icon: "book", bg: "#FDF4FF" },
                            { title: "Vehicle Loan", rate: "10.0%", max: "₹30 Lakh", icon: "car", bg: "#FFF7ED" },
                        ].map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.exploreCard, { backgroundColor: item.bg }]}
                            >
                                <View style={styles.exploreIconWrap}>
                                    <Ionicons name={item.icon} size={22} color={Colors.primary} />
                                </View>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <AppText size="md" weight="semibold" color={Colors.secondary}>
                                        {item.title}
                                    </AppText>
                                    <AppText size="xs" color={Colors.textLight} style={{ marginTop: 4 }}>
                                        Starts at {item.rate}
                                    </AppText>
                                    <AppText size="xs" color={Colors.textLight}>
                                        Up to {item.max}
                                    </AppText>
                                </View>
                                <Ionicons
                                    name="arrow-forward-circle"
                                    size={24}
                                    color={Colors.primary}
                                    style={{ alignSelf: "flex-end" }}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView> */}
                            </View>
                        </Animated.View>

                        {/* ── Section 3: Recommended Loan ── */}
                        {
                            eligibilityChecked && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <AppText size="lg" weight="bold" color={Colors.secondary}>
                                            Recommended Loan
                                        </AppText>
                                        <AppText size="xs" color={Colors.textLight} style={{ marginTop: 2 }}>
                                            Best interest rate matching your profile
                                        </AppText>
                                    </View>

                                    <View style={styles.recommendedCard}>
                                        <View style={styles.recHeader}>
                                            <View style={styles.bankLogoWrap}>
                                                <AppText weight="bold" color="#FFFFFF" size="sm">
                                                    H
                                                </AppText>
                                            </View>
                                            <View>
                                                <AppText size="md" weight="bold" color={Colors.secondary}>
                                                    HDFC Bank
                                                </AppText>
                                                <AppText size="xxs" color={Colors.textLight}>
                                                    Pre-Approved Offer
                                                </AppText>
                                            </View>
                                        </View>

                                        <View style={styles.recDetails}>
                                            <View style={styles.recDetailCol}>
                                                <AppText size="xxs" color={Colors.textLight}>
                                                    Loan Amount
                                                </AppText>
                                                <AppText size="sm" weight="semibold" color={Colors.secondary}>
                                                    ₹8,50,000
                                                </AppText>
                                            </View>
                                            <View style={styles.recDetailCol}>
                                                <AppText size="xxs" color={Colors.textLight}>
                                                    Monthly EMI
                                                </AppText>
                                                <AppText size="sm" weight="semibold" color={Colors.secondary}>
                                                    ₹17,800/mo
                                                </AppText>
                                            </View>
                                        </View>

                                        <View style={styles.recDetails}>
                                            <View style={styles.recDetailCol}>
                                                <AppText size="xxs" color={Colors.textLight}>
                                                    Interest Rate
                                                </AppText>
                                                <AppText size="sm" weight="semibold" color="#16A34A">
                                                    10.5% p.a.
                                                </AppText>
                                            </View>
                                            <View style={styles.recDetailCol}>
                                                <AppText size="xxs" color={Colors.textLight}>
                                                    Processing Fee
                                                </AppText>
                                                <AppText size="sm" weight="semibold" color={Colors.secondary}>
                                                    ₹999 + GST
                                                </AppText>
                                            </View>
                                        </View>

                                        <TouchableOpacity style={styles.applyNowBtn}>
                                            <AppText size="xs" weight="bold" color="#FFFFFF">
                                                Apply Now
                                            </AppText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }

                        {/* ── Section 4: Financial Snapshot ── */}
                        {/* <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <AppText size="lg" weight="bold" color={Colors.secondary}>
                            Financial Snapshot
                        </AppText>
                    </View>

                    <View style={styles.grid}>
                        <View style={styles.gridRow}>
                            <View style={styles.gridCard}>
                                <Ionicons name="speedometer-outline" size={20} color={Colors.primary} />
                                <AppText
                                    size="lg"
                                    weight="bold"
                                    color={Colors.secondary}
                                    style={{ marginTop: 8 }}
                                >
                                    785
                                </AppText>
                                <AppText size="xxs" color={Colors.textLight}>
                                    Credit Score
                                </AppText>
                            </View>
                            <View style={styles.gridCard}>
                                <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
                                <AppText
                                    size="lg"
                                    weight="bold"
                                    color={Colors.secondary}
                                    style={{ marginTop: 8 }}
                                >
                                    ₹75,000
                                </AppText>
                                <AppText size="xxs" color={Colors.textLight}>
                                    Monthly Income
                                </AppText>
                            </View>
                        </View>

                        <View style={styles.gridRow}>
                            <View style={styles.gridCard}>
                                <Ionicons name="calculator-outline" size={20} color={Colors.primary} />
                                <AppText
                                    size="lg"
                                    weight="bold"
                                    color={Colors.secondary}
                                    style={{ marginTop: 8 }}
                                >
                                    ₹12,000
                                </AppText>
                                <AppText size="xxs" color={Colors.textLight}>
                                    Existing EMI
                                </AppText>
                            </View>
                            <View style={styles.gridCard}>
                                <Ionicons name="cash-outline" size={20} color={Colors.primary} />
                                <AppText
                                    size="lg"
                                    weight="bold"
                                    color={Colors.secondary}
                                    style={{ marginTop: 8 }}
                                >
                                    ₹8.5 L
                                </AppText>
                                <AppText size="xxs" color={Colors.textLight}>
                                    Loan Eligibility
                                </AppText>
                            </View>
                        </View>
                    </View>
                </View> */}

                        <Animated.View style={lowerContentRevealStyle}>
                            {/* ── Section 5: Quick Actions ── */}
                            <View style={styles.section}>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.exploreList}
                                >
                                    {[
                                        { label: "Apply Loan", icon: "document-text" },
                                        { label: "EMI Calculator", icon: "calculator" },
                                        { label: "Documents", icon: "folder-open" },
                                        { label: "Track App", icon: "compass" },
                                        { label: "Support", icon: "chatbubbles" },
                                    ].map((pill, idx) => (
                                        <TouchableOpacity key={idx} style={styles.pill}>
                                            <Ionicons name={pill.icon} size={16} color={Colors.primary} />
                                            <AppText size="xs" weight="semibold" color={Colors.secondary}>
                                                {pill.label}
                                            </AppText>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* ── Section 6: Benefits ── */}
                            <View style={styles.section}>
                                <View style={styles.benefitCard}>
                                    <AppText
                                        size="md"
                                        weight="bold"
                                        color={Colors.secondary}
                                        style={{ marginBottom: 12 }}
                                    >
                                        Why Choose FinPilot?
                                    </AppText>

                                    {[
                                        { text: "Instant Digital Process", desc: "No offline visits or signature issues.", icon: "flash" },
                                        { text: "No Paperwork", desc: "E-KYC and digital consent based disbursals.", icon: "document-attach" },
                                        { text: "RBI Registered Partners", desc: "100% compliant lenders and NBFCs.", icon: "shield-checkmark" },
                                        { text: "Multiple Bank Comparison", desc: "Compare interest rates from top lenders.", icon: "swap-horizontal" },
                                        { text: "Secure KYC", desc: "Encrypted verification using Aadhaar/PAN.", icon: "lock-closed" },
                                    ].map((item, idx) => (
                                        <View key={idx} style={styles.benefitRow}>
                                            <View style={styles.benefitIconWrap}>
                                                <Ionicons name={item.icon} size={18} color={Colors.primary} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <AppText size="xs" weight="semibold" color={Colors.secondary}>
                                                    {item.text}
                                                </AppText>
                                                <AppText size="xxs" color={Colors.textLight} style={{ marginTop: 2 }}>
                                                    {item.desc}
                                                </AppText>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* ── Section 7: Offers ── */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <AppText size="lg" weight="bold" color={Colors.secondary}>
                                        Special Offers
                                    </AppText>
                                </View>

                                <ScrollView
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.exploreList}
                                >
                                    {[
                                        { title: "Processing Fee Waived", desc: "0% processing fee on HDFC Personal Loans", code: "ZEROFEES", color: "#1E3A8A" },
                                        { title: "Lowest Interest Today", desc: "Axis Bank home loans starting at 8.4% p.a.", code: "AXIS84", color: "#881337" },
                                        { title: "Pre-approved Offer", desc: "Get instantly eligible up to ₹5,00,000", code: "INSTA5", color: "#065F46" },
                                        { title: "Flat ₹5,000 Cashback", desc: "On disbursals before August 15th", code: "CASHBACK5", color: "#78350F" },
                                    ].map((offer, idx) => (
                                        <View key={idx} style={[styles.offerCard, { backgroundColor: offer.color }]}>
                                            <AppText size="md" weight="bold" color="#FFFFFF">
                                                {offer.title}
                                            </AppText>
                                            <AppText size="xs" color="#E2E8F0" style={{ marginTop: 4, lineHeight: 18 }}>
                                                {offer.desc}
                                            </AppText>

                                            <View style={styles.offerFooter}>
                                                <View style={styles.promoBadge}>
                                                    <AppText size="xxs" weight="bold" color="#FFFFFF">
                                                        CODE: {offer.code}
                                                    </AppText>
                                                </View>
                                                <Ionicons name="gift-outline" size={20} color="#FFFFFF" />
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* ── Section 8: Recent Activity ── */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <AppText size="lg" weight="bold" color={Colors.secondary}>
                                        Recent Activity
                                    </AppText>
                                </View>

                                <View style={styles.timelineContainer}>
                                    {[
                                        { title: "Aadhaar Verified", status: kyc?.aadhaar?.verified ? "done" : "todo", time: "Completed" },
                                        { title: "PAN Verified", status: kyc?.pan?.verified ? "done" : "todo", time: "Completed" },
                                        { title: "Eligibility Checked", status: eligibilityChecked ? "done" : "todo", time: eligibilityChecked ? "Completed" : "Pending" },
                                        { title: "Loan Applied", status: "todo", time: "Not started" },
                                    ].map((step, idx) => (
                                        <View key={idx} style={styles.timelineItem}>
                                            <View style={styles.timelineLeft}>
                                                <View
                                                    style={[
                                                        styles.timelineCircle,
                                                        step.status === "done" ? styles.timelineDone : styles.timelineTodo,
                                                    ]}
                                                >
                                                    <Ionicons
                                                        name={step.status === "done" ? "checkmark" : "ellipse-outline"}
                                                        size={12}
                                                        color={step.status === "done" ? "#FFFFFF" : "#94A3B8"}
                                                    />
                                                </View>
                                                {idx !== 3 && <View style={styles.timelineLine} />}
                                            </View>
                                            <View style={styles.timelineRight}>
                                                <AppText size="xs" weight="semibold" color={Colors.secondary}>
                                                    {step.title}
                                                </AppText>
                                                <AppText size="xxs" color={Colors.textLight} style={{ marginTop: 2 }}>
                                                    {step.time}
                                                </AppText>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* ── Section 9: Loan Journey ── */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <AppText size="lg" weight="bold" color={Colors.secondary}>
                                        Loan Journey
                                    </AppText>
                                </View>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.journeyStepper}
                                >
                                    {[
                                        { title: "Profile", status: profile?.profileCompleted ? "done" : "current" },
                                        { title: "KYC", status: kyc?.aadhaar?.verified && kyc?.pan?.verified ? "done" : profile?.profileCompleted ? "current" : "todo" },
                                        { title: "Eligibility", status: eligibilityChecked ? "done" : kyc?.aadhaar?.verified && kyc?.pan?.verified ? "current" : "todo" },
                                        { title: "Choose Loan", status: "todo" },
                                        { title: "Bank Approval", status: "todo" },
                                        { title: "Disbursal", status: "todo" },
                                    ].map((step, idx) => (
                                        <View key={idx} style={styles.journeyItem}>
                                            <View
                                                style={[
                                                    styles.journeyCircle,
                                                    step.status === "done"
                                                        ? styles.journeyDone
                                                        : step.status === "current"
                                                            ? styles.journeyCurrent
                                                            : styles.journeyTodo,
                                                ]}
                                            >
                                                <AppText size="xxs" weight="bold" color="#FFFFFF">
                                                    {idx + 1}
                                                </AppText>
                                            </View>
                                            <AppText
                                                size="xs"
                                                weight="semibold"
                                                color={Colors.secondary}
                                                style={{ marginTop: 6 }}
                                            >
                                                {step.title}
                                            </AppText>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* ── Section 10: Partner Banks ── */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <AppText size="lg" weight="bold" color={Colors.secondary}>
                                        Partner Banks
                                    </AppText>
                                </View>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.exploreList}
                                >
                                    {["HDFC", "ICICI", "Axis", "Kotak", "IDFC", "Bajaj", "Tata"].map(
                                        (bank, idx) => (
                                            <View key={idx} style={styles.bankCard}>
                                                <AppText size="xs" weight="bold" color={Colors.primary}>
                                                    {bank}
                                                </AppText>
                                            </View>
                                        )
                                    )}
                                </ScrollView>
                            </View>

                            {/* ── Section 11: Help ── */}
                            <View style={styles.section}>
                                <View style={styles.helpCard}>
                                    <AppText size="md" weight="bold" color={Colors.secondary}>
                                        Need Help?
                                    </AppText>
                                    <AppText
                                        size="xs"
                                        color={Colors.textLight}
                                        style={{ marginTop: 2, marginBottom: 16 }}
                                    >
                                        We are available 24/7 to assist you
                                    </AppText>

                                    <View style={styles.helpRow}>
                                        <TouchableOpacity style={styles.helpItem}>
                                            <Ionicons name="chatbubbles-outline" size={20} color={Colors.primary} />
                                            <AppText
                                                size="xs"
                                                weight="semibold"
                                                color={Colors.secondary}
                                                style={{ marginTop: 6 }}
                                            >
                                                Chat Support
                                            </AppText>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.helpItem}>
                                            <Ionicons name="help-circle-outline" size={20} color={Colors.primary} />
                                            <AppText
                                                size="xs"
                                                weight="semibold"
                                                color={Colors.secondary}
                                                style={{ marginTop: 6 }}
                                            >
                                                FAQs
                                            </AppText>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.helpRow, { marginTop: 12 }]}>
                                        <TouchableOpacity style={styles.helpItem}>
                                            <Ionicons name="call-outline" size={20} color={Colors.primary} />
                                            <AppText
                                                size="xs"
                                                weight="semibold"
                                                color={Colors.secondary}
                                                style={{ marginTop: 6 }}
                                            >
                                                Call Support
                                            </AppText>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.helpItem}>
                                            <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                                            <AppText
                                                size="xs"
                                                weight="semibold"
                                                color={Colors.secondary}
                                                style={{ marginTop: 6 }}
                                            >
                                                Email
                                            </AppText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    </>
                )}
            </CollapsibleHeaderLayout>

            {/* <HomeSkeleton /> */}

            {/* Fixed Bottom Navigation */}
            < View style={styles.bottomNav} >
                <TouchableOpacity style={styles.navItem}>
                    <CustomHomeIcon size={22} color={Colors.primary} />
                    <AppText size="xs" weight="semibold" color={Colors.primary}>
                        Home
                    </AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <CustomLoanIcon size={22} color="#94A3B8" />
                    <AppText size="xs" color="#94A3B8">
                        Loans
                    </AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="time-outline" size={22} color="#94A3B8" />
                    <AppText size="xs" color="#94A3B8">
                        Activity
                    </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate("ProfileDetail")}
                >
                    <Ionicons name="person-outline" size={22} color="#94A3B8" />
                    <AppText size="xs" color="#94A3B8">
                        Profile
                    </AppText>
                </TouchableOpacity>
            </View >
        </View >
    );
}

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    /* Sticky Top Header Styling */
    stickyNavbarContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        justifyContent: "center",
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
    },
    whiteNavbarBg: {
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6",
    },
    navbarContent: {
        height: HEADER_CONTENT_HEIGHT,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    welcomeChip: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 30,
        paddingRight: 4,
        paddingVertical: 2,
        gap: 5
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 2,
        // elevation: 2,
    },
    profileIconBtn: {
        backgroundColor: "#ffffffff",
        padding: 8,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    /* Blue Hero Header Container */
    heroContainer: {
        width,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingBottom: 40,
        // borderBottomLeftRadius: 24,
        // borderBottomRightRadius: 24,
        overflow: "hidden",
    },

    heroTextContainer: {
        width: "60%",
        gap: 4,
        zIndex: 2,
    },
    banner: {
        width: 200,
        height: 160,
        position: "absolute",
        right: 0,
        bottom: 15,
        zIndex: 1,
    },
    bannerBgShape: {
        width: width * 1.5,
        height: 500,
        backgroundColor: "#eaeaea",
        position: "absolute",
        left: -70,
        bottom: -490,
        transform: [{ rotate: "-30deg" }],
        zIndex: 0,
    },
    bannerBgShape2: {
        width: 100,
        height: 200,
        backgroundColor: "#eaeaea",
        position: "absolute",
        right: -10,
        bottom: -80,
        transform: [{ rotate: "-55deg" }],
        zIndex: 0,
    },
    cardContainer: {
        // marginTop: -30,
        zIndex: 10,
    },

    /* Layout Sections */
    section: {
        marginTop: 25,
        width: "100%",
    },
    sectionHeader: {
        paddingHorizontal: 24,
        marginBottom: 12,
    },
    exploreList: {
        paddingHorizontal: 24,
        gap: 14,
    },
    exploreCard: {
        width: 150,
        height: 150,
        borderRadius: 20,
        padding: 16,
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#EEF2F6",
    },

    exploreView: {
        paddingHorizontal: 24,
    },

    exploreIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    eligibilityCard: {
        marginHorizontal: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 2,
        borderColor: "#E1F0FF",
    },
    eligibilityCheckedBg: {
        backgroundColor: "#F0FDF4",
        borderColor: "#DCFCE7",
    },
    checkNowBtn: {
        backgroundColor: Colors.primary,
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginTop: 12,
    },
    loanCard: {
        marginHorizontal: 24,
        borderRadius: 22,
        paddingTop: 20,
        paddingBottom: 20,
        borderWidth: 1.5,
        borderColor: "#CBDDFD",
        overflow: "hidden",
    },
    viewOffersBtn: {
        backgroundColor: "#16A34A",
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginTop: 12,
    },
    verifiedBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DCFCE7",
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 20,
    },
    eligibilityDetailsRow: {
        flexDirection: "row",
        gap: 24,
        marginTop: 12,
    },
    recommendedCard: {
        marginHorizontal: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#EEF2F6",
        padding: 20,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 2,
    },
    recHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    bankLogoWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    recDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    recDetailCol: {
        flex: 1,
    },
    applyNowBtn: {
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        height: 48,
        borderRadius: 12,
        marginTop: 8,
    },
    grid: {
        paddingHorizontal: 24,
        gap: 12,
    },
    gridRow: {
        flexDirection: "row",
        gap: 12,
    },
    gridCard: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: "#EEF2F6",
    },
    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#F8FAFC",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#EEF2F6",
    },
    benefitCard: {
        marginHorizontal: 24,
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 20,
        borderWidth: 1,
        borderColor: "#EEF2F6",
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 1,
    },
    benefitRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginTop: 14,
    },
    benefitIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "#EFF6FF",
        alignItems: "center",
        justifyContent: "center",
    },
    offerCard: {
        width: 280,
        height: 160,
        borderRadius: 22,
        padding: 20,
        justifyContent: "space-between",
    },
    offerFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    promoBadge: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    timelineContainer: {
        marginHorizontal: 24,
        backgroundColor: "#F8FAFC",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "#EEF2F6",
    },
    timelineItem: {
        flexDirection: "row",
        minHeight: 52,
    },
    timelineLeft: {
        alignItems: "center",
        marginRight: 14,
        width: 20,
    },
    timelineCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    },
    timelineDone: {
        backgroundColor: "#16A34A",
    },
    timelineTodo: {
        backgroundColor: "#E2E8F0",
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: "#E2E8F0",
        marginVertical: 4,
    },
    timelineRight: {
        flex: 1,
        paddingBottom: 16,
    },
    journeyStepper: {
        paddingHorizontal: 24,
        gap: 20,
        alignItems: "center",
        paddingVertical: 10,
    },
    journeyItem: {
        alignItems: "center",
        width: 80,
    },
    journeyCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    journeyDone: {
        backgroundColor: "#16A34A",
    },
    journeyCurrent: {
        backgroundColor: Colors.primary,
    },
    journeyTodo: {
        backgroundColor: "#E2E8F0",
    },
    bankCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#EEF2F6",
        paddingVertical: 10,
        paddingHorizontal: 18,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    helpCard: {
        marginHorizontal: 24,
        backgroundColor: "#F8FAFC",
        borderRadius: 22,
        padding: 20,
        borderWidth: 1,
        borderColor: "#EEF2F6",
        marginBottom: 20,
    },
    helpRow: {
        flexDirection: "row",
        gap: 12,
    },
    helpItem: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EEF2F6",
    },

    /* Fixed Bottom Nav */
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 68,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#EEF2F6",
        paddingBottom: Platform.OS === "ios" ? 14 : 0,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 10,
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
    },
});