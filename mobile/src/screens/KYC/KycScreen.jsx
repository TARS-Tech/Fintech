import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Dimensions, StyleSheet, View, ScrollView, Platform, Image } from "react-native";
import TouchableOpacity from "../../components/common/HapticTouchableOpacity";
import Screen from "../../components/common/Screen";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import BackButton from "../../components/common/BackButton";
import AppInput from "../../components/inputs/AppInput";
import { Colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateProfile } from "../../redux/actions/profileActions";
import CardCaptureGuide from "../../../assets/card_capture_guide.png";
import PanCaptureGuide from "../../../assets/pan_capture_guide.png";

const { width } = Dimensions.get("window");

export default function KycScreen() {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [stateName, setStateName] = useState("");
    const [pincode, setPincode] = useState("");
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const navigation = useNavigation();

    const onChangeData = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === "ios");

        if (selectedDate) {
            setDate(selectedDate);

            const day = String(selectedDate.getDate()).padStart(2, "0");
            const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
            const year = selectedDate.getFullYear();

            setDob(`${day} / ${month} / ${year}`);
        }
    }

    const handleSave = async () => {
        const result = await dispatch(
            updateProfile({
                name,
                dob,
                gender,
                address,
                city,
                state: stateName,
                pincode
            })
        );

        if (result.success) {
            navigation.navigate("KYC")
        }
    };

    return (
        <Screen style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <BackButton />
                    <AppText size="h3" weight="medium" style={styles.headerTitle}>
                        KYC Verification
                    </AppText>
                    {/* Empty view to balance the BackButton and center the title */}
                    <View style={styles.headerRightPlaceholder} />
                </View>

                <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                    <View style={{ width: "100%", alignItems: "center", backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E5E7EB", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignSelf: "center" }}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                            <Ionicons name="lock-closed" size={20} color="#2563EB" />
                            <AppText size="md" weight="semibold">Complete Your KYC</AppText>
                        </View>
                        <AppText size="xs" style={{ color: "#6B7280" }}>Verify your identity to apply for loans securely.</AppText>

                    </View>
                </View>

                <View style={styles.timelineCard}>
                    <AppText size="lg" weight="bold" color={Colors.secondary} style={styles.timelineTitle}>
                        Verification Steps
                    </AppText>

                    {/* Step 1: Personal Profile (Completed) */}
                    <View style={styles.stepContainer}>
                        <View style={styles.stepLeftColumn}>
                            <View style={[styles.statusIconCircle, styles.statusCompleted]}>
                                <Ionicons name="checkmark" size={16} color={Colors.white} />
                            </View>
                            <View style={[styles.connectorLine, styles.lineCompleted]} />
                        </View>
                        <View style={styles.stepRightColumn}>
                            <AppText size="md" weight="semibold" color={Colors.secondary}>
                                Personal Profile
                            </AppText>
                            <AppText size="xs" color={Colors.textLight} style={{ marginTop: 2 }}>
                                Basic details verified successfully.
                            </AppText>

                        </View>
                    </View>

                    {/* Step 2: Aadhaar Verification (Active / Next Step) */}
                    <View style={styles.stepContainer}>
                        <View style={styles.stepLeftColumn}>
                            <View style={[styles.statusIconCircle, styles.statusActive]}>
                                <View style={styles.activeDotInner} />
                            </View>
                            <View style={[styles.connectorLine, styles.linePending]} />
                        </View>
                        <View style={styles.stepRightColumn}>
                            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", gap: 10 }}>
                                <AppText size="md" weight="semibold" color={Colors.primary}>
                                    Aadhaar Verification
                                </AppText>
                                <AppText size="xs" color={Colors.textLight} style={{ marginTop: 2 }}>
                                    (Pending)
                                </AppText>
                            </View>
                            <AppText size="xs" color={Colors.textLight} style={{ marginTop: 2 }}>
                                Verify your identity via Aadhaar OTP or document upload.
                            </AppText>
                            <Image
                                source={CardCaptureGuide}
                                style={styles.guideImage}
                                resizeMode="contain"
                            />


                        </View>
                    </View>

                    {/* Step 3: PAN Verification (Locked / Pending) */}
                    <View style={styles.stepContainer}>
                        <View style={styles.stepLeftColumn}>
                            <View style={[styles.statusIconCircle, styles.statusLocked]}>
                                <Ionicons name="lock-closed" size={12} color="#94A3B8" />
                            </View>
                        </View>
                        <View style={styles.stepRightColumn}>
                            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", gap: 10 }}>
                                <AppText size="md" weight="semibold" color="#94A3B8">
                                    PAN Verification
                                </AppText>
                                <AppText size="xs" color={Colors.textLight} style={{ marginTop: 2 }}>
                                    (Pending)
                                </AppText>
                            </View>
                            <AppText size="xs" color="#94A3B8" style={{ marginTop: 2 }}>
                                Verify your PAN card to complete the process.
                            </AppText>
                            <Image
                                source={PanCaptureGuide}
                                style={[styles.guidePanImage]}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.footerContainer}>


                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Aadhaar")
                        }}
                        activeOpacity={0.9}
                        style={styles.button}
                    >
                        <AppText weight="bold" size="sm" color={Colors.white}>Complete Verification</AppText>
                        <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.supportTextContainer}
                        activeOpacity={0.8}
                        onPress={() => {
                            console.log("Contact Support Pressed");
                        }}
                    >
                        <AppText size="sm" color="#6B7280" weight="medium">
                            Need help? <AppText size="sm" color={Colors.primary} weight="bold">Contact support</AppText>
                        </AppText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    header: {
        width: "100%",
        paddingTop: 12,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: {
        flex: 1,
    },
    headerRightPlaceholder: {
        width: 40, // Match the visual width of the back button
    },
    subtitleContainer: {
        paddingHorizontal: 20,
        marginTop: -8,
        // marginBottom: 16,
    },
    subtitle: {
        fontSize: 15,
    },
    avatarContainer: {
        alignSelf: "center",
        position: "relative",
        marginTop: 10,
        marginBottom: 25,
    },
    avatarFrame: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#E2E8F0",
    },
    cameraBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 28,
        height: 28,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: Colors.white,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    form: {
        marginTop: 10,
    },
    inputIcon: {

        marginRight: 10,
    },
    buttonContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    formStyle: {
        height: 46,
        borderRadius: 8,
        marginTop: -8,
        backgroundColor: "#f8fafc"
    },
    dropdownFieldContainer: {
        position: "relative",
        width: "100%",
        zIndex: 10,
        marginBottom: 20
    },
    dropdownMenu: {
        position: "absolute",
        top: 38,
        left: 0,
        right: 0,
        marginHorizontal: 20,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 1000,
    },
    dropdownItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    dropdownItemText: {
        fontSize: 15,
        color: "#1E293B",
    },
    divider: {
        height: 1,
        backgroundColor: "#F1F5F9",
    },


    //

    timelineCard: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 20,
        // borderWidth: 1,
        // borderColor: "#E2E8F0",
        // shadowColor: Colors.black,
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.05,
        // shadowRadius: 8,
        // elevation: 2,
        marginTop: 15,
        marginHorizontal: 4,
    },
    timelineTitle: {
        marginBottom: 20,
    },
    stepContainer: {
        flexDirection: "row",
        minHeight: 70,
    },
    stepLeftColumn: {
        alignItems: "center",
        marginRight: 16,
        width: 24,
    },
    statusIconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    statusCompleted: {
        backgroundColor: Colors.success,
    },
    statusActive: {
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    activeDotInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
    },
    statusLocked: {
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "#CBD5E1",
    },
    connectorLine: {
        width: 2,
        flex: 1,
        marginVertical: 4,
    },
    lineCompleted: {
        backgroundColor: Colors.success,
    },
    linePending: {
        backgroundColor: "#E2E8F0",
    },
    stepRightColumn: {
        flex: 1,
        paddingBottom: 20,
    },
    actionButton: {
        backgroundColor: Colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 12,
        alignSelf: "flex-start",
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    guideImage: {
        width: 160,
        height: 80,
        borderRadius: 12,
        marginTop: 5,
        alignSelf: "flex-start"
    },
    guidePanImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        alignSelf: "flex-start"
    },
    footerContainer: {
        marginTop: 25,
        paddingHorizontal: 14,
        width: "100%",
    },
    supportTextContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingVertical: 10,
    },
    button: {
        backgroundColor: Colors.primary,
        height: 44,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 6,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
});