import React, { useState, useRef, useEffect } from "react";
import {
    ActionSheetIOS,
    Alert,
    Animated,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    TextInput,
    ActivityIndicator
} from "react-native";
import Screen from "../../components/common/Screen";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/inputs/AppInput";
import BackButton from "../../components/common/BackButton";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import * as ImagePicker from 'expo-image-picker';
import { sendAadhaarOtp, verifyAadhaarOtp } from "../../redux/actions/kycActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";


export default function AadhaarScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const aadhaar = useSelector(state => state.kyc.aadhaar);
    // const loading = useSelector(state => state.kyc.loading);
    const otpRefs = useRef([]);
    const hiddenOtpRef = useRef(null);

    const [showOtpSheet, setShowOtpSheet] = useState(false);
    const [otp, setOtp] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const [loadingSendOtp, setLoadingSendOtp] = useState(false);

    const [aadhaarNumber, setAadhaarNumber] = useState("");
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);

    const [timer, setTimer] = useState(30);
    const timerRef = useRef(null);

    const startTimer = () => {
        setTimer(30);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        if (showOtpSheet) {
            startTimer();
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [showOtpSheet]);

    const handleResend = async () => {
        const result = await dispatch(sendAadhaarOtp({
            aadhaarNumber,
            frontImage,
            backImage,
        }));
        if (result.success) {
            startTimer();
            setOtp("");
            if (result.otp) {
                setTimeout(() => {
                    simulateOtpTyping(result.otp);
                }, 400);
            }
            Alert.alert("OTP Sent", "A new OTP has been sent successfully.");
        } else {
            Alert.alert("Error", result.message || "Failed to resend OTP.");
        }
    };

    const isButtonEnabled = aadhaarNumber.replace(/\s/g, "").length === 12 &&
        frontImage !== null &&
        backImage !== null;

    const openPicker = async (side, useCamera) => {
        const launcher = useCamera
            ? ImagePicker.launchCameraAsync
            : ImagePicker.launchImageLibraryAsync;

        const result = await launcher({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,  // ← lets user crop/preview before confirming
            aspect: [16, 10],     // ← Aadhaar card is landscape ID-card shape (85.6×54mm ≈ 16:10)
        });

        if (!result.canceled) {
            if (side === "front") {
                setFrontImage({
                    uri: result.assets[0].uri,
                    name: "front.jpg",
                    type: "image/jpeg"
                });
            } else {
                setBackImage({
                    uri: result.assets[0].uri,
                    name: "back.jpg",
                    type: "image/jpeg"
                });
            }
        }
    };

    const showImageOptions = (side) => {
        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ["Cancel", "Take Photo", "Choose from Gallery"],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) openPicker(side, true);
                    else if (buttonIndex === 2) openPicker(side, false);
                }
            );
        } else {
            // Android: use Alert as action sheet
            Alert.alert(
                "Upload Aadhaar",
                "Choose an option",
                [
                    { text: "Take Photo", onPress: () => openPicker(side, true) },
                    { text: "Choose from Gallery", onPress: () => openPicker(side, false) },
                    { text: "Cancel", style: "cancel" },
                ]
            );
        }
    };

    const buttonScale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const formatAddress = (text) => {
        const digits = text.replace(/\s/g, "");
        return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    const simulateOtpTyping = (targetOtp) => {
        if (!targetOtp) return;
        const otpStr = String(targetOtp);
        let currentOtp = "";
        let index = 0;

        const interval = setInterval(() => {
            if (index < otpStr.length) {
                currentOtp += otpStr[index];
                setOtp(currentOtp);
                index++;
            } else {
                clearInterval(interval);
                // Automatically verify after realistic SMS arrival delay
                setTimeout(() => {
                    handleOtpVerify(otpStr);
                }, 300);
            }
        }, 120); // Type a digit every 120ms
    };

    const handleOtpSend = async () => {
        if (loadingSendOtp) return;
        setLoadingSendOtp(true);

        const result = await dispatch(sendAadhaarOtp({
            aadhaarNumber,
            frontImage,
            backImage,
        }));

        setLoadingSendOtp(false);
        if (result.success) {
            setOtp(""); // reset before opening modal
            setShowOtpSheet(true);
            if (result.otp) {
                // Wait for the modal slide animation (approx 500ms) then start typing animation
                setTimeout(() => {
                    simulateOtpTyping(result.otp);
                }, 500);
            } else {
                setTimeout(() => {
                    hiddenOtpRef.current?.focus();
                }, 500);
            }
        } else {
            Alert.alert("Error", result.message || "Failed to send OTP.");
        }
    }

    const handleOtpVerify = async (otpToVerify) => {
        const verifyValue = otpToVerify || otp;
        if (!verifyValue || verifyValue.length !== 6 || verifying) return;
        setVerifying(true);

        const result = await dispatch(
            verifyAadhaarOtp(verifyValue)
        );

        setVerifying(false);

        if (result.success) {
            setShowOtpSheet(false);
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigation.navigate("Pan");
            }, 1500);
        } else {
            Alert.alert("Verification Failed", result.message || "Wrong OTP.");
        }
    };

    const handleOtpChange = (text, index) => {
        const cleanText = text.replace(/[^0-9]/g, "");

        const otpArray = otp.split("");
        if (cleanText.length === 0) {
            otpArray[index] = "";
        } else {
            otpArray[index] = cleanText[cleanText.length - 1];
        }

        const newOtpValue = otpArray.join("").slice(0, 6);
        setOtp(newOtpValue);

        if (cleanText && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }

        // Auto verify when 6 digits are typed manually
        if (newOtpValue.length === 6) {
            setTimeout(() => {
                handleOtpVerify(newOtpValue);
            }, 200);
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpAutofill = (text) => {
        const cleanOtp = text.replace(/[^0-9]/g, "").slice(0, 6);
        setOtp(cleanOtp);

        if (cleanOtp.length > 0 && cleanOtp.length < 6) {
            otpRefs.current[cleanOtp.length]?.focus();
        }

        if (cleanOtp.length === 6) {
            setTimeout(() => {
                handleOtpVerify(cleanOtp);
            }, 200);
        }
    }

    return (
        <Screen style={styles.screen} backgroundColor={Colors.background}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={styles.flex}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ── Header ── */}

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 2, marginTop: 10 }}>
                        <BackButton size={20} style={{ paddingHorizontal: 10 }} />
                        <AppText size="lg" weight="medium" color={Colors.secondary}>
                            Verify Aadhaar
                        </AppText>
                    </View>
                    <View style={styles.header}>

                        <View style={styles.headerTextBlock}>

                            <AppText size="sm" weight="regular" color={Colors.textLight} style={styles.subtitle}>
                                Identity verification helps us process your loan application faster.
                            </AppText>
                        </View>
                    </View>

                    {/* ── Hero: Aadhaar Card Illustration ── */}


                    {/* ── Input Section ── */}
                    <View style={styles.inputSection}>
                        <AppInput
                            label="Aadhaar Number"
                            value={aadhaarNumber}
                            onChangeText={(text) => setAadhaarNumber(formatAddress(text))}
                            placeholder="1234 5678 9012"
                            keyboardType="numeric"
                            maxLength={14}
                            style={styles.inputWrapper}
                            leftIcon={
                                <Ionicons
                                    name="card-outline"
                                    size={20}
                                    color="#94A3B8"
                                    style={styles.inputIcon}
                                />
                            }
                            inputContainerStyle={styles.inputContainer}
                        />
                    </View>

                    {/* ── Upload Aadhaar ── */}
                    <View style={styles.uploadSection}>
                        <AppText size="md" weight="bold" color={Colors.secondary} style={styles.uploadTitle}>
                            Upload Aadhaar
                        </AppText>

                        <View style={styles.uploadRow}>
                            {/* Front Side */}
                            <TouchableOpacity
                                style={[styles.uploadCard, frontImage && styles.uploadCardDone]}
                                activeOpacity={0.75}
                                onPress={() => showImageOptions("front")}
                            >
                                {frontImage ? (
                                    <>
                                        <Image source={{ uri: frontImage.uri }} style={styles.uploadPreview} />
                                        <View style={styles.uploadDoneBadge}>
                                            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                                            <AppText size="xs" weight="semibold" color="#22C55E"> Done</AppText>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <View style={styles.uploadIconWrap}>
                                            <Ionicons name="camera" size={28} color={Colors.primary} />
                                        </View>
                                        <AppText size="sm" weight="semibold" color={Colors.secondary} style={styles.uploadCardTitle}>
                                            Front Side
                                        </AppText>
                                        <AppText size="xs" color={Colors.textLight} style={styles.uploadCardSub}>
                                            Camera or Gallery
                                        </AppText>
                                    </>
                                )}
                            </TouchableOpacity>

                            {/* Back Side */}
                            <TouchableOpacity
                                style={[styles.uploadCard, backImage && styles.uploadCardDone]}
                                activeOpacity={0.75}
                                onPress={() => showImageOptions("back")}
                            >
                                {backImage ? (
                                    <>
                                        <Image source={{ uri: backImage.uri }} style={styles.uploadPreview} />
                                        <View style={styles.uploadDoneBadge}>
                                            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                                            <AppText size="xs" weight="semibold" color="#22C55E"> Done</AppText>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <View style={styles.uploadIconWrap}>
                                            <Ionicons name="camera" size={28} color={Colors.primary} />
                                        </View>
                                        <AppText size="sm" weight="semibold" color={Colors.secondary} style={styles.uploadCardTitle}>
                                            Back Side
                                        </AppText>
                                        <AppText size="xs" color={Colors.textLight} style={styles.uploadCardSub}>
                                            Camera or Gallery
                                        </AppText>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ── Primary Button ── */}
                    <Animated.View
                        style={[styles.buttonWrapper, { transform: [{ scale: buttonScale }] }]}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressIn={isButtonEnabled && !loadingSendOtp ? onPressIn : undefined}
                            onPressOut={isButtonEnabled && !loadingSendOtp ? onPressOut : undefined}                                // onPress={isButtonEnabled ? () => { handleVerifyAadhaar() } : undefined}
                            onPress={handleOtpSend}
                            disabled={!isButtonEnabled || loadingSendOtp}
                        >
                            <View style={[
                                styles.verifyButton,
                                (!isButtonEnabled || loadingSendOtp) && styles.verifyButtonDisabled  // ← dim when disabled
                            ]}>
                                {loadingSendOtp ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <Ionicons
                                            name="shield-checkmark-outline"
                                            size={18}
                                            color="#fff"
                                            style={styles.buttonIcon}
                                        />
                                        <AppText size="md" weight="bold" color="#fff">
                                            Verify Aadhaar
                                        </AppText>
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* ── Security Info Card ── */}
                    <View style={styles.securityCard}>
                        <View style={styles.securityIconWrap}>
                            <Ionicons name="lock-closed" size={18} color={Colors.primary} />
                        </View>
                        <View style={styles.securityText}>
                            <AppText size="md" weight="bold" color={Colors.secondary}>
                                Your information is secure
                            </AppText>
                            <AppText size="xs" color={Colors.textLight} style={styles.securityDesc}>
                                Your Aadhaar is encrypted and securely processed for identity verification.
                            </AppText>
                        </View>
                    </View>

                    {/* ── Footer ── */}
                    <View style={styles.footer}>
                        <Ionicons name="lock-closed-outline" size={12} color="#929292ff" />
                        <AppText size="xs" color="#929292ff" style={styles.footerText}>
                            Powered by Secure KYC Verification
                        </AppText>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal visible={showOtpSheet} animationType="slide" transparent>
                <View style={styles.overlay}>
                    <View style={styles.bottomSheet}>
                        <AppText size="lg" weight="medium" style={{ paddingBottom: 5 }}>
                            Verify OTP
                        </AppText>
                        <AppText size="sm" weight="regular" color={Colors.textLight} style={styles.subtitle}>
                            Enter the OTP sent to your Aadhaar linked mobile number.
                        </AppText>

                        {/* <AppInput
                            placeholder="6 Digit OTP"
                            keyboardType="numeric"
                            value={otp}
                            onChangeText={setOtp}
                            style={{ marginTop: 10, paddingHorizontal: 0 }}
                        /> */}
                        <TextInput
                            ref={hiddenOtpRef}
                            value={otp}
                            onChangeText={handleOtpAutofill}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            autoComplete="sms-otp"
                            style={styles.hiddenOtpInput}
                        />
                        <View style={styles.otpRow}>
                            {Array(6).fill(0).map((_, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => (otpRefs.current[index] = ref)}
                                    style={[
                                        styles.otpBox,
                                        otp[index] ? styles.otpBoxFilled : null
                                    ]}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    value={otp[index] || ""}
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                />
                            ))}
                        </View>

                        <View style={styles.resendContainer}>
                            <AppText size="sm" color={Colors.textLight}>
                                Didn't receive the OTP?{" "}
                            </AppText>
                            {timer > 0 ? (
                                <AppText size="sm" weight="semibold" color={Colors.primary}>
                                    Resend in {timer}s
                                </AppText>
                            ) : (
                                <TouchableOpacity onPress={handleResend}>
                                    <AppText size="sm" weight="bold" color={Colors.primary}>
                                        Resend OTP
                                    </AppText>
                                </TouchableOpacity>
                            )}
                        </View>

                        <AppButton
                            title="Verify OTP"
                            onPress={handleOtpVerify}
                            disabled={otp.length !== 6 || verifying}
                            loading={verifying}
                        />
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showSuccessModal}
                transparent
                animationType="fade"
            >
                <View style={styles.successOverlay}>
                    <View style={styles.successCard}>
                        <Ionicons
                            name="checkmark-circle"
                            size={70}
                            color="#22C55E"
                        />
                        <AppText
                            size="h4"
                            weight="bold"
                        >
                            Aadhaar Verified
                        </AppText>
                        <AppText color="#64748B">
                            Identity verified successfully
                        </AppText>
                    </View>
                </View>
            </Modal>
        </Screen>
    );

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 48,
    },

    /* ── Header ── */
    header: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    // headerTextBlock: {
    //     marginTop: 16,
    // },
    subtitle: {
        lineHeight: 20,
    },



    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)"
    },

    bottomSheet: {
        backgroundColor: "#fff",
        padding: 25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },

    successOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,.4)"
    },

    successCard: {
        backgroundColor: "#fff",
        padding: 35,
        borderRadius: 20,
        alignItems: "center",
        width: "80%"
    },


    /* ── Input ── */
    inputSection: {
        marginBottom: 4,
    },
    inputWrapper: {
        paddingHorizontal: 20,
    },
    inputContainer: {
        height: 58,
        borderRadius: 16,
        backgroundColor: "#F8FAFC",
        borderWidth: 1.5,
        borderColor: "#E2E8F0",
    },
    inputIcon: {
        marginRight: 10,
    },

    /* ── Verify Button ── */
    buttonWrapper: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    verifyButton: {
        backgroundColor: Colors.primary,
        borderRadius: 14,
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonIcon: {
        marginRight: 8,
    },

    /* ── Security Card ── */
    securityCard: {
        marginHorizontal: 20,
        marginBottom: 28,
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 14,
        borderWidth: 1,
        borderColor: "#e8e8e8ff",
    },
    securityIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
    },
    securityText: {
        flex: 1,
    },
    securityDesc: {
        lineHeight: 18,
    },

    /* ── Footer ── */
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        paddingBottom: 8,
    },
    footerText: {
        letterSpacing: 0.2,
    },

    /* ── Upload Section ── */
    uploadSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    uploadTitle: {
        marginBottom: 14,
    },
    uploadRow: {
        flexDirection: "row",
        gap: 12,
    },
    uploadCard: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: "#CBD5E1",
        borderStyle: "dashed",
        borderRadius: 16,
        paddingVertical: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FAFC",
    },
    uploadIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    uploadCardTitle: {
        marginBottom: 2,
    },
    uploadCardSub: {
        textAlign: "center",
    },
    uploadCardDone: {
        borderColor: "#22C55E",
        backgroundColor: "#F0FDF4",
    },
    uploadPreview: {
        width: "100%",
        height: 90,
        borderRadius: 10,
        resizeMode: "cover",
        marginBottom: 6,
    },
    uploadDoneBadge: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    verifyButtonDisabled: {
        backgroundColor: "#94A3B8",   // grey
        shadowOpacity: 0,
        elevation: 0,
    },

    hiddenOtpInput: {
        position: "absolute",
        width: 1,
        height: 1,
        opacity: 0,
    },
    otpRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: 20,
        marginBottom: 25,
    },
    otpBox: {
        width: 46,
        height: 52,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#E2E8F0",
        backgroundColor: "#F8FAFC",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.secondary,
    },
    otpBoxFilled: {
        borderColor: Colors.primary,
        backgroundColor: "#FFF",
    },
    resendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
});

