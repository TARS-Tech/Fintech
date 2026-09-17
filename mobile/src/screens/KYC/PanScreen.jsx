import React, { useState, useRef } from "react";
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
    ActivityIndicator
} from "react-native";
import Screen from "../../components/common/Screen";
import AppText from "../../components/common/AppText";
import AppInput from "../../components/inputs/AppInput";
import BackButton from "../../components/common/BackButton";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import * as ImagePicker from 'expo-image-picker';
import { verifyPan } from "../../redux/actions/kycActions";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import PanMockup from "../../../assets/pan_mockup.png";

export default function PanScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [panNumber, setPanNumber] = useState("");
    const [panImage, setPanImage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const isButtonEnabled = panNumber.trim().length === 10 && panImage !== null;

    const openPicker = async (useCamera) => {
        const launcher = useCamera
            ? ImagePicker.launchCameraAsync
            : ImagePicker.launchImageLibraryAsync;

        const result = await launcher({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,
            aspect: [16, 10], // standard card ratio
        });

        if (!result.canceled) {
            setPanImage({
                uri: result.assets[0].uri,
                name: "pan.jpg",
                type: "image/jpeg"
            });
        }
    };

    const showImageOptions = () => {
        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ["Cancel", "Take Photo", "Choose from Gallery"],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) openPicker(true);
                    else if (buttonIndex === 2) openPicker(false);
                }
            );
        } else {
            Alert.alert(
                "Upload PAN Card",
                "Choose an option",
                [
                    { text: "Take Photo", onPress: () => openPicker(true) },
                    { text: "Choose from Gallery", onPress: () => openPicker(false) },
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

    const handleVerifyPan = async () => {
        if (loading) return;
        setLoading(true);
        const result = await dispatch(
            verifyPan({
                panNumber,
                panImage
            })
        );
        setLoading(false);

        if (result.success) {
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigation.navigate("HomeScreen");
            }, 1500);
        } else {
            Alert.alert("Verification Failed", result.message || "Failed to verify PAN");
        }
    };

    return (
        <Screen style={styles.screen} backgroundColor="#FFFFFF">
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
                    {/* ── Top Navigation / Header ── */}
                    <View style={styles.navigationHeader}>
                        <BackButton size={20} style={styles.backButton} />
                        <AppText size="lg" weight="semibold" color={Colors.secondary}>
                            Verify PAN
                        </AppText>
                    </View>
                    <View style={styles.header}>
                        <AppText size="sm" color={Colors.textLight} style={styles.subtitle}>
                            PAN verification helps us validate your identity for faster loan approval.
                        </AppText>
                    </View>

                    {/* ── Main Card: Mockup ── */}
                    <View style={styles.mockupContainer}>
                        <View style={styles.mockupCard}>
                            <Image
                                source={PanMockup}
                                style={styles.mockupImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* ── PAN Input ── */}
                    <View style={styles.inputSection}>
                        <AppInput
                            label="PAN Number"
                            value={panNumber}
                            onChangeText={(text) => setPanNumber(text.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                            placeholder="ABCDE1234F"
                            maxLength={10}
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

                    {/* ── Upload Section ── */}
                    <View style={styles.uploadSection}>
                        <AppText size="md" weight="semibold" color={Colors.secondary} style={styles.uploadTitle}>
                            Upload PAN Card
                        </AppText>

                        <TouchableOpacity
                            style={[styles.uploadCard, panImage && styles.uploadCardDone]}
                            activeOpacity={0.75}
                            onPress={showImageOptions}
                        >
                            {panImage ? (
                                <View style={styles.previewContainer}>
                                    <Image source={{ uri: panImage.uri }} style={styles.uploadPreview} />
                                    <View style={styles.uploadDoneBadge}>
                                        <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                                        <AppText size="xs" weight="semibold" color="#22C55E"> Uploaded</AppText>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.uploadIconWrap}>
                                        <Ionicons name="camera" size={28} color={Colors.primary} />
                                    </View>
                                    <AppText size="sm" weight="semibold" color={Colors.secondary} style={styles.uploadCardTitle}>
                                        Upload PAN Card
                                    </AppText>
                                    <AppText size="xs" color={Colors.textLight} style={styles.uploadCardSub}>
                                        Capture or choose from gallery
                                    </AppText>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* ── Primary CTA ── */}
                    <Animated.View
                        style={[styles.buttonWrapper, { transform: [{ scale: buttonScale }] }]}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressIn={isButtonEnabled && !loading ? onPressIn : undefined}
                            onPressOut={isButtonEnabled && !loading ? onPressOut : undefined}
                            onPress={handleVerifyPan}
                            disabled={!isButtonEnabled || loading}
                        >
                            <View style={[
                                styles.verifyButton,
                                (!isButtonEnabled || loading) && styles.verifyButtonDisabled
                            ]}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <Ionicons
                                            name="shield-checkmark"
                                            size={18}
                                            color="#fff"
                                            style={styles.buttonIcon}
                                        />
                                        <AppText size="md" weight="bold" color="#fff">
                                            Verify PAN
                                        </AppText>
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* ── Security Section ── */}
                    <View style={styles.securityCard}>
                        <View style={styles.securityIconWrap}>
                            <Ionicons name="lock-closed" size={18} color={Colors.primary} />
                        </View>
                        <View style={styles.securityText}>
                            <AppText size="sm" weight="semibold" color={Colors.secondary}>
                                Your PAN is protected
                            </AppText>
                            <AppText size="xs" color={Colors.textLight} style={styles.securityDesc}>
                                Your PAN details are securely encrypted and used only for identity verification.
                            </AppText>
                        </View>
                    </View>

                    {/* ── Footer ── */}
                    <View style={styles.footer}>
                        <Ionicons name="lock-closed-outline" size={12} color="#94A3B8" />
                        <AppText size="xs" color="#94A3B8" style={styles.footerText}>
                            Powered by Secure PAN Verification
                        </AppText>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── Success Modal ── */}
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
                            PAN Verified
                        </AppText>
                        <AppText color="#64748B" style={{ marginTop: 5 }}>
                            KYC Verification Completed!
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
    navigationHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        marginTop: 10,
        paddingHorizontal: 24,
    },
    backButton: {
        paddingHorizontal: 0,
        marginRight: 10,
    },
    header: {
        paddingHorizontal: 24,
        marginTop: 8,
        marginBottom: 20,
    },
    subtitle: {
        lineHeight: 20,
    },
    mockupContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 55,
        marginBottom: 20,
    },
    mockupCard: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#EEF2F6",
        padding: 2,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 2,
    },
    mockupImage: {
        width: "100%",
        height: 160,
    },
    inputSection: {
        marginBottom: 20,
    },
    inputWrapper: {
        paddingHorizontal: 24,
    },
    inputContainer: {
        height: 56,
        borderRadius: 16,
        backgroundColor: "#F8FAFC",
        borderWidth: 1.5,
        borderColor: "#E2E8F0",
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 10,
    },
    uploadSection: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    uploadTitle: {
        marginBottom: 12,
    },
    uploadCard: {
        width: "100%",
        borderWidth: 1.5,
        borderColor: "#CBD5E1",
        borderStyle: "dashed",
        borderRadius: 16,
        paddingVertical: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FAFC",
    },
    uploadCardDone: {
        borderColor: "#22C55E",
        backgroundColor: "#F0FDF4",
        borderStyle: "solid",
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
    previewContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    uploadPreview: {
        width: "90%",
        height: 140,
        borderRadius: 12,
        resizeMode: "cover",
        marginBottom: 10,
    },
    uploadDoneBadge: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#DCFCE7",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    buttonWrapper: {
        marginHorizontal: 24,
        marginBottom: 20,
    },
    verifyButton: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonIcon: {
        marginRight: 8,
    },
    verifyButtonDisabled: {
        backgroundColor: "#CBD5E1",
    },
    securityCard: {
        marginHorizontal: 24,
        marginBottom: 24,
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 14,
        borderWidth: 1,
        borderColor: "#EEF2F6",
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
        marginTop: 4,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        paddingBottom: 24,
    },
    footerText: {
        letterSpacing: 0.2,
    },
    successOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,.4)",
    },
    successCard: {
        backgroundColor: "#fff",
        padding: 35,
        borderRadius: 20,
        alignItems: "center",
        width: "80%",
    },
});
