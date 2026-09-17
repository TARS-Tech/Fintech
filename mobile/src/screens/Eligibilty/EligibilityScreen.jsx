import React, { useEffect, useState } from "react";
import Screen from "../../components/common/Screen";
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, TextInput, Alert, ScrollView, Modal } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useAnimatedReaction,
    interpolate,
    interpolateColor,
    Extrapolation,
    runOnJS,
    withTiming,
    withSpring
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import AppText from "../../components/common/AppText";
import { Colors } from "../../theme/colors";
import TouchableOpacity from "../../components/common/HapticTouchableOpacity";
import BackButton from "../../components/common/BackButton";
import EligibilityScreenIcon from "../../../assets/eligibility-screen.png";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "../../components/common/AppButton";
import { calculateEligibility } from "../../redux/actions/eligibilityActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import CollapsibleHeaderLayout from "../../components/common/CollapsibleHeaderLayout";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HEADER_CONTENT_HEIGHT = 50;
const STICK_THRESHOLD = 10;


const { width } = Dimensions.get("window");

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatShortCurrency = (num) => {
    if (num >= 100000) return `₹${num / 100000}L`;
    if (num >= 1000) return `₹${num / 1000}K`;
    return `₹${num}`;
};

const FinancialSlider = ({ label, value, min, max, step, onValueChange, showQuickSelect = false, quickSelectValues = [] }) => {
    return (
        <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
                <AppText weight="medium" size="md" color={Colors.secondary}>
                    {label}
                </AppText>
                <AppText weight="bold" size="2xl" color={Colors.text}>
                    {formatCurrency(value)}
                </AppText>
            </View>

            <View style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={min}
                    maximumValue={max}
                    step={step}
                    value={value}
                    onValueChange={onValueChange}
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor="#b7b7b7ff"
                    thumbTintColor={Colors.primary}
                />
                <View style={styles.sliderLabels}>
                    <AppText size="xs" color="#94a3b8">{formatShortCurrency(min)}</AppText>
                    <AppText size="xs" color="#94a3b8">{formatShortCurrency(max)}</AppText>
                </View>
            </View>

            {showQuickSelect && (
                <View style={styles.quickSelectContainer}>
                    {quickSelectValues.map((qs) => (
                        <TouchableOpacity
                            key={qs}
                            style={[
                                styles.quickSelectChip,
                                value === qs && styles.quickSelectChipActive
                            ]}
                            onPress={() => onValueChange(qs)}
                        >
                            <AppText
                                size="sm"
                                weight="medium"
                                color={value === qs ? Colors.white : Colors.secondary}
                            >
                                {formatShortCurrency(qs)}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

export default function EligibilityScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {
        loading: eligibilityLoading,
        eligibility,
        error: eligibilityError,
    } = useSelector((state) => state.eligibility)

    const [statusBarStyle, setStatusBarStyle] = useState("light-content");
    const insets = useSafeAreaInsets();
    const scrollY = useSharedValue(0);

    const [monthlyIncome, setMonthlyIncome] = useState(50000);
    const [existingEmi, setExistingEmi] = useState(8000);
    const [cibilScore, setCibilScore] = useState("750");
    const [loanAmount, setLoanAmount] = useState(500000);

    const [employmentType, setEmploymentType] = useState("");
    const [showEmploymentDropdown, setShowEmploymentDropdown] = useState(false);

    const [company, setCompany] = useState("");
    const [existingLoans, setExistingLoans] = useState(0);

    const [showResultModal, setShowResultModal] = useState(false);
    const [resultStatus, setResultStatus] = useState(null);

    const resultScale = useSharedValue(0.88);
    const resultOpacity = useSharedValue(0);

    const resultAnimatedStyle = useAnimatedStyle(() => ({
        opacity: resultOpacity.value,
        transform: [
            {
                scale: resultScale.value,
            },
        ],
    }));

    const openResultModal = (status) => {
        setResultStatus(status);
        setShowResultModal(true);

        resultScale.value = 0.88;
        resultOpacity.value = 0;

        resultOpacity.value = withTiming(1, {
            duration: 220
        });

        resultScale.value = withSpring(1, {
            damping: 16,
            stiffness: 180,
            mass: 0.8,
        });
    }

    const employmentOptions = [
        { label: "Salaried", value: "salaried" },
        { label: "Self Employed", value: "self-employed" },
        { label: "Business", value: "business" },
        { label: "Other", value: "other" },
    ];

    // Dynamic Mock Estimate Calculation
    const disposableIncome = Math.max(0, monthlyIncome - existingEmi);
    // Rough estimate: Assuming max 50% DTI, multiplied by tenure (e.g. 5 years) and interest approx logic
    const calculatedEstimate = Math.min(disposableIncome * 12 * 5, loanAmount);
    const estimatedEligibility = calculatedEstimate > 0 ? calculatedEstimate : 0;

    const WelcomAnimatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            scrollY.value,
            [0, STICK_THRESHOLD],
            ["hsla(0, 0%, 100%, 0.00)", "rgba(255, 255, 255, 0)"]
        );
        return { backgroundColor };
    });

    const showCibilInfo = () => {
        Alert.alert("CIBIL Score", "Your CIBIL score helps us estimate your loan eligibility and terms more accurately.");
    }

    const validateForm = () => {
        const score = Number(cibilScore);

        if (!employmentType) {
            Alert.alert(
                "Employment type required",
                "Please select your employment type."
            );
            return false;
        }

        if (!company.trim()) {
            Alert.alert(
                "Company details required",
                "Please enter your company or employer name."
            );
            return false;
        }

        if (!score || score < 300 || score > 900) {
            Alert.alert(
                "Invalid CIBIL score",
                "Please enter a CIBIL score between 300 and 900."
            );
            return false;
        }

        return true;
    };

    const handleCheckEligibility = async () => {
        if (!validateForm()) return;

        const payload = {
            monthlySalary: monthlyIncome,
            existingLoans,
            cibilScore: Number(cibilScore),
            employmentType,
            company,
            existingEmi,
        };

        const result = await dispatch(calculateEligibility(payload));

        if (!result.success) {
            Alert.alert(
                "Unable to check eligibility",
                result.message || "Something went wrong. Please try again."
            );
            return;
        }

        const status = result.data?.eligibility?.status;

        openResultModal(status);
    }

    return (
        <View style={{ flex: 1 }}>
            <CollapsibleHeaderLayout
                fixedStatusBarStyle="dark-content"
                externalScrollY={scrollY}
                bannerGradientColors={["#FFFFFF", "#aac5ffff", "#78a2ffff"]}
                bannerPaddingTopOffset={-10}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 110 }}
                navbarLeft={
                    <Animated.View style={[styles.welcomeChip, WelcomAnimatedStyle]} >
                        <BackButton size={20} style={styles.backButton} />
                        <AppText
                            weight="medium"
                            size="md"
                            style={{ marginRight: 8, marginLeft: -4 }}
                        >
                            CHECK YOUR ELIGIBILITY
                        </AppText>
                    </Animated.View>
                }
                bannerContent={
                    <>
                        <Image source={EligibilityScreenIcon} style={styles.banner} resizeMode="contain" />
                        <View style={styles.highlightContainer}>
                            <View style={[StyleSheet.absoluteFill, { zIndex: 0 }]}>
                                <Svg width="100%" height="100%" viewBox="0 0 100 24" preserveAspectRatio="none">
                                    <Path
                                        d="M0,0 Q50,5 100,0 Q92,9 100,18 Q50,24 0,18 Q8,9 0,0 Z"
                                        fill="#ffd500ff"
                                    />
                                </Svg>
                            </View>
                            <AppText
                                weight="medium"
                                size="md"
                                color={Colors.white}
                                style={{ zIndex: 1 }}
                            >
                                Let's see what you may qualify for.
                            </AppText>
                        </View>
                    </>
                }
            >

                <View style={styles.formContainer}>
                    <View style={styles.sectionHeader}>
                        <AppText weight="medium" size="xl" color={Colors.text}>
                            Your financial details
                        </AppText>
                        <AppText weight="regular" size="sm" color="#64748B">
                            Help us estimate your loan eligibility
                        </AppText>
                    </View>

                    <View style={{ height: 1, backgroundColor: "#E2E8F0", width: '100%' }} />

                    {/* Section 1: Monthly Income */}
                    <FinancialSlider
                        label="Monthly Income"
                        value={monthlyIncome}
                        min={15000}
                        max={200000}
                        step={1000}
                        onValueChange={setMonthlyIncome}
                        showQuickSelect={true}
                        quickSelectValues={[30000, 50000, 75000, 100000]}
                    />

                    {/* <View style={{ height: 1, backgroundColor: "#E2E8F0", width: '100%', marginBottom: 32 }} /> */}

                    <View style={{ marginBottom: 16 }}>
                        <AppText weight="medium" size="md" color={Colors.secondary} style={{ marginBottom: 8 }}>Employment Type</AppText>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.dropdown}
                            onPress={() => setShowEmploymentDropdown(true)}
                        >
                            <Ionicons name="briefcase-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                            <AppText size="md" color={employmentType ? Colors.secondary : "#94A3B8"} style={{ flex: 1 }}>
                                {employmentOptions.find(
                                    item => item.value === employmentType
                                )?.label || "Select employment type"}
                            </AppText>
                            <Ionicons name="chevron-down" size={20} color="#94A3B8" style={styles.inputIcon} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputFieldSection}>
                        <AppText
                            weight="medium"
                            size="md"
                            color={Colors.secondary}
                            style={styles.fieldLabel}
                        >
                            Company / Employer
                        </AppText>

                        <View style={styles.textInputContainer}>
                            <Ionicons
                                name="business-outline"
                                size={20}
                                color="#94A3B8"
                                style={styles.fieldIcon}
                            />

                            <TextInput
                                style={styles.textInput}
                                value={company}
                                onChangeText={setCompany}
                                placeholder="Enter company name"
                                placeholderTextColor="#94A3B8"
                                maxLength={150}
                            />
                        </View>
                    </View>

                    <View style={styles.inputFieldSection}>
                        <View style={styles.fieldHeader}>
                            <AppText
                                weight="medium"
                                size="md"
                                color={Colors.secondary}
                            >
                                Existing Loans
                            </AppText>

                            <AppText
                                size="xs"
                                color="#94A3B8"
                            >
                                Currently active
                            </AppText>
                        </View>

                        <View style={styles.loanSelector}>
                            {[
                                { label: "None", value: 0 },
                                { label: "1 Loan", value: 1 },
                                { label: "2 Loans", value: 2 },
                                { label: "3+", value: 3 },
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.loanOption,
                                        existingLoans === option.value &&
                                        styles.loanOptionActive,
                                    ]}
                                    onPress={() => setExistingLoans(option.value)}
                                >
                                    <AppText
                                        size="sm"
                                        weight="medium"
                                        color={
                                            existingLoans === option.value
                                                ? Colors.white
                                                : Colors.secondary
                                        }
                                    >
                                        {option.label}
                                    </AppText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Section 4: Existing EMI */}
                    <FinancialSlider
                        label="Existing Monthly EMI"
                        value={existingEmi}
                        min={0}
                        max={50000}
                        step={500}
                        onValueChange={setExistingEmi}
                    />
                    {/* <View style={{ height: 1, backgroundColor: "#E2E8F0", width: '100%', marginBottom: 32 }} /> */}

                    {/* Section 3: CIBIL Score */}
                    <View style={styles.cibilSection}>
                        <View style={styles.cibilHeader}>
                            <AppText weight="medium" size="md" color={Colors.secondary}>
                                CIBIL Score
                            </AppText>
                            <TouchableOpacity onPress={showCibilInfo} style={styles.infoIcon}>
                                <Ionicons name="information-circle-outline" size={18} color={Colors.secondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.cibilInputWrapper}>
                            <TextInput
                                style={styles.cibilInput}
                                value={cibilScore}
                                onChangeText={setCibilScore}
                                keyboardType="numeric"
                                maxLength={3}
                                placeholder="e.g. 750"
                                placeholderTextColor="#94a3b8"
                            />
                        </View>
                        <AppText size="xs" color="#94a3b8" style={{ marginTop: 6, textAlign: 'center' }}>
                            Enter your latest CIBIL score
                        </AppText>
                    </View>

                    <View style={{ height: 1, backgroundColor: "#E2E8F0", width: '100%', marginBottom: 32 }} />

                    {/* Section 4: Loan Amount */}
                    {/* <FinancialSlider
                        label="Loan Amount"
                        value={loanAmount}
                        min={50000}
                        max={1500000}
                        step={10000}
                        onValueChange={setLoanAmount}
                    /> */}

                    {/* Section 5: Estimated Eligibility */}
                    {/* <View style={styles.resultCard}>
                        <AppText weight="medium" size="sm" color={Colors.primary} style={{ letterSpacing: 1 }}>
                            ESTIMATED ELIGIBILITY
                        </AppText>
                        <AppText weight="bold" size="4xl" color={Colors.text} style={{ marginVertical: 8 }}>
                            {formatCurrency(estimatedEligibility)}
                        </AppText>
                        <AppText weight="regular" size="sm" color={Colors.secondary}>
                            Based on your financial details
                        </AppText>
                    </View> */}


                    {/* Section 6: Primary CTA */}
                    <AppButton
                        title={
                            eligibilityLoading
                                ? "Checking eligibility..."
                                : "Check My Eligibility →"
                        }
                        onPress={handleCheckEligibility}
                        disabled={eligibilityLoading}
                        style={styles.primaryCta}
                    />

                    <View style={styles.securityMessage}>
                        <Ionicons name="lock-closed" size={12} color="#94a3b8" />
                        <AppText weight="regular" size="xs" color="#94a3b8" style={{ marginLeft: 4 }}>
                            Your information is protected
                        </AppText>
                    </View>
                </View>
            </CollapsibleHeaderLayout>

            <Modal
                visible={showEmploymentDropdown}
                transparent
                animationType="fade"
                onRequestClose={() => setShowEmploymentDropdown(false)}
            >
                <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setShowEmploymentDropdown(false)}>
                    <View style={styles.dropdownMenu}>
                        <AppText
                            size="md"
                            weight="bold"
                            color={Colors.secondary}
                            style={styles.dropdownTitle}
                        >
                            Employment Type
                        </AppText>

                        {employmentOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.dropdownOption}
                                onPress={() => {
                                    setEmploymentType(option.value);
                                    setShowEmploymentDropdown(false);
                                }}
                            >
                                <AppText
                                    size="md"
                                    color={Colors.secondary}
                                >
                                    {option.label}
                                </AppText>

                                {employmentType === option.value && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color={Colors.primary}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={showResultModal}
                transparent
                animationType="none"
                statusBarTranslucent
                onRequestClose={() => setShowResultModal(false)}
            >
                <View style={styles.resultOverlay}>
                    <Animated.View
                        style={[
                            styles.resultModal,
                            resultAnimatedStyle,
                        ]}
                    >
                        <View
                            style={[
                                styles.resultIcon,
                                resultStatus === "eligible"
                                    ? styles.resultIconSuccess
                                    : styles.resultIconWarning,
                            ]}
                        >
                            <Ionicons
                                name={
                                    resultStatus === "eligible"
                                        ? "checkmark"
                                        : "information"
                                }
                                size={30}
                                color={Colors.white}
                            />
                        </View>

                        <AppText
                            weight="bold"
                            size="2xl"
                            color={Colors.text}
                            style={styles.resultTitle}
                        >
                            {resultStatus === "eligible"
                                ? "You're eligible!"
                                : "Not eligible right now"}
                        </AppText>

                        <AppText
                            size="sm"
                            color={Colors.secondary}
                            style={styles.resultDescription}
                        >
                            {resultStatus === "eligible"
                                ? "Your profile meets our current eligibility criteria."
                                : "Based on the information provided, you don't currently meet our eligibility criteria."}
                        </AppText>

                        {resultStatus === "eligible" && (
                            <View style={styles.scoreContainer}>
                                <AppText
                                    size="xs"
                                    weight="medium"
                                    color="#64748B"
                                >
                                    ELIGIBILITY SCORE
                                </AppText>

                                <AppText
                                    weight="bold"
                                    size="4xl"
                                    color={Colors.primary}
                                >
                                    {eligibility?.score ?? "--"}
                                </AppText>

                                <AppText
                                    size="xs"
                                    color="#94A3B8"
                                >
                                    out of 80
                                </AppText>
                            </View>
                        )}

                        <AppButton
                            title={
                                resultStatus === "eligible"
                                    ? "View Loan Options →"
                                    : "Review My Details"
                            }
                            onPress={() => {
                                if (resultStatus === "eligible") {
                                    setShowResultModal(false);

                                    // Temporary dummy loan page.
                                    navigation.navigate("LoanDetail", {
                                        loanType: "personal",
                                    });
                                } else {
                                    setShowResultModal(false);
                                }
                            }}
                            style={styles.resultButton}
                        />

                        {resultStatus === "eligible" && (
                            <TouchableOpacity
                                onPress={() => setShowResultModal(false)}
                                style={styles.resultSecondaryButton}
                            >
                                <AppText
                                    size="sm"
                                    weight="medium"
                                    color="#64748B"
                                >
                                    Maybe later
                                </AppText>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

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
    navbarContent: {
        height: HEADER_CONTENT_HEIGHT,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    welcomeChip: {
        backgroundColor: "rgba(255, 255, 255, 0)",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 30,
        paddingRight: 4,
    },

    heroContainer: {
        width,
        alignItems: "center",
        paddingHorizontal: 24,
        paddingBottom: 10,
        overflow: "hidden",
    },

    backButton: {
        paddingHorizontal: 0,
        marginRight: 10,
        color: "white"
    },

    banner: {
        width: 200,
        height: 100,
    },
    highlightContainer: {
        position: 'relative',
        marginTop: 0,
        paddingHorizontal: 16,
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },

    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },

    sectionHeader: {
        marginBottom: 10,
        alignItems: "center",
    },

    sliderSection: {
        marginBottom: 32,
    },

    sliderHeader: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 16,
    },

    sliderContainer: {
        width: '100%',
    },

    slider: {
        width: '100%',
        height: 40,
    },

    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: -8,
    },

    dropdown: {
        height: 58,
        // marginHorizontal: 20,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        flexDirection: "row",
        alignItems: "center",
    },

    inputIcon: {
        marginRight: 10,
    },

    dropdownOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    dropdownMenu: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 8,
    },

    dropdownTitle: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },

    dropdownOption: {
        minHeight: 52,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 12,
    },

    inputFieldSection: {
        marginBottom: 28,
    },

    fieldLabel: {
        marginBottom: 8,
    },

    textInputContainer: {
        height: 58,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        flexDirection: "row",
        alignItems: "center",
    },

    fieldIcon: {
        marginRight: 10,
    },

    textInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.secondary,
        paddingVertical: 0,
    },

    fieldHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    loanSelector: {
        flexDirection: "row",
        gap: 8,
    },

    loanOption: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: "#F8FAFC",
        alignItems: "center",
        justifyContent: "center",
    },

    loanOptionActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },

    quickSelectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingHorizontal: 4,
    },

    quickSelectChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: Colors.white,
    },

    quickSelectChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },

    cibilSection: {
        alignItems: 'center',
        marginBottom: 36,
    },

    cibilHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    infoIcon: {
        marginLeft: 6,
    },

    cibilInputWrapper: {
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: "#F8FAFC",
    },

    cibilInput: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
    },

    resultCard: {
        backgroundColor: "#F0F9FF",
        borderWidth: 1,
        borderColor: "#BAE6FD",
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
    },

    securityMessage: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 24,
    },

    primaryCta: {
        marginTop: 8,
    },

    resultOverlay: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.42)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },

    resultModal: {
        width: "100%",
        maxWidth: 380,
        backgroundColor: Colors.white,
        borderRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 12,
    },

    resultIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },

    resultIconSuccess: {
        backgroundColor: Colors.primary,
    },

    resultIconWarning: {
        backgroundColor: "#F59E0B",
    },

    resultTitle: {
        textAlign: "center",
        marginBottom: 8,
    },

    resultDescription: {
        textAlign: "center",
        lineHeight: 21,
        paddingHorizontal: 10,
    },

    scoreContainer: {
        width: "100%",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderRadius: 18,
        paddingVertical: 14,
        marginTop: 20,
        marginBottom: 20,
    },

    resultButton: {
        width: "100%",
        marginTop: 20,
    },

    resultSecondaryButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },


});