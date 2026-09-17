import React, { useState, useEffect, useRef } from "react";
import Screen from "../../components/common/Screen";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Dimensions, StyleSheet, View, TextInput, Alert, Animated } from "react-native";
import TouchableOpacity from "../../components/common/HapticTouchableOpacity";
import { sendOtp, verifyOtp } from "../../redux/actions/authActions";
import Logo from "../../components/common/Logo";
import { getKycState } from "../../redux/actions/kycActions";

const { width } = Dimensions.get("window");

export default function VerificationCode() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const { phone, email, autoOtp } = route.params || {};

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(30);
    const [smsDetected, setSmsDetected] = useState(false);

    const otpRefs = useRef([]);
    const timerRef = useRef(null);
    const typingIntervalRef = useRef(null);

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

    const simulateOtpTyping = (targetOtp) => {
        if (!targetOtp || targetOtp.length !== 6) return;
        setSmsDetected(true);

        let currentOtp = "";
        let index = 0;
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

        typingIntervalRef.current = setInterval(() => {
            if (index < targetOtp.length) {
                currentOtp += targetOtp[index];
                setOtp(currentOtp);
                index++;
            } else {
                clearInterval(typingIntervalRef.current);
                setTimeout(() => {
                    handleVerifyCode(targetOtp);
                }, 300);
            }
        }, 120);
    };

    useEffect(() => {
        startTimer();

        if (autoOtp) {
            const timeout = setTimeout(() => {
                simulateOtpTyping(String(autoOtp));
            }, 600);
            return () => clearTimeout(timeout);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        };
    }, [autoOtp]);

    const handleVerifyCode = async (otpToVerify) => {
        const code = String(otpToVerify || otp).trim();
        if (!code || code.length !== 6 || loading) return;

        setLoading(true);
        try {
            const res = await dispatch(verifyOtp({
                phone,
                otp: code
            }));

            if (res.success) {
                await dispatch(getKycState());
                navigation.navigate("HomeScreen");
            } else {
                Alert.alert("Verification Failed", res.message || "Invalid OTP entered.");
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Error verifying OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0 || resending) return;
        setResending(true);
        try {
            const res = await sendOtp({ email, phone });
            setResending(false);
            if (res.success) {
                startTimer();
                setOtp("");
                const newOtp = res.data?.otp || res.otp;
                if (newOtp) {
                    setTimeout(() => {
                        simulateOtpTyping(String(newOtp));
                    }, 500);
                }
            } else {
                Alert.alert("Error", res.message || "Failed to resend OTP");
            }
        } catch (err) {
            setResending(false);
            Alert.alert("Error", err.message || "Failed to resend OTP");
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
            otpRefs.current[index + 1]?.focus();
        }

        if (newOtpValue.length === 6) {
            setTimeout(() => {
                handleVerifyCode(newOtpValue);
            }, 200);
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    return (
        <Screen style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.black} />
            </TouchableOpacity>

            <View style={{ marginTop: 20 }}>
                <Logo size={28} />
            </View>

            <AppText
                size="h3"
                weight="bold"
                style={{ textAlign: "center", marginTop: 20 }}
            >
                Verification Code
            </AppText>

            <AppText color="#6B7280" style={{ textAlign: "center", marginTop: 8, paddingHorizontal: 30 }}>
                Enter the 6-digit verification code sent to {phone || "your phone"}
            </AppText>

            {smsDetected && (
                <View style={styles.smsBanner}>
                    <Ionicons name="chatbox-ellipses" size={18} color="#2563EB" />
                    <AppText size="sm" weight="semibold" color="#1E40AF" style={{ marginLeft: 8 }}>
                        SMS Auto-detected • Verifying...
                    </AppText>
                </View>
            )}

            <View style={styles.otpContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
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
                <AppText size="sm" color="#6B7280">
                    Didn't receive the OTP?{" "}
                </AppText>
                {timer > 0 ? (
                    <AppText size="sm" weight="semibold" color={Colors.primary}>
                        Resend in {timer}s
                    </AppText>
                ) : (
                    <TouchableOpacity onPress={handleResendOtp} disabled={resending}>
                        <AppText size="sm" weight="bold" color={Colors.primary}>
                            {resending ? "Sending..." : "Resend OTP"}
                        </AppText>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.buttonWrapper}>
                <AppButton
                    title="Verify & Continue"
                    onPress={() => handleVerifyCode(otp)}
                    loading={loading}
                    disabled={otp.length !== 6 || loading}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        width,
    },
    backButton: {
        width,
        marginTop: 20,
        alignSelf: "flex-start",
        paddingHorizontal: 24,
    },
    smsBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EFF6FF",
        borderColor: "#BFDBFE",
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginTop: 18,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: width - 48,
        marginTop: 35,
        marginBottom: 25,
    },
    otpBox: {
        width: (width - 48 - 50) / 6,
        height: 54,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#E2E8F0",
        backgroundColor: "#F8FAFC",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.secondary || "#0F172A",
    },
    otpBoxFilled: {
        borderColor: Colors.primary,
        backgroundColor: "#FFF",
    },
    resendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    buttonWrapper: {
        width: width - 48,
    },
});