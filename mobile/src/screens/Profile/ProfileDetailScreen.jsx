import React from "react";
import { View, StyleSheet, Image, ScrollView, Platform, Alert } from "react-native";
import TouchableOpacity from "../../components/common/HapticTouchableOpacity";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Screen from "../../components/common/Screen";
import AppText from "../../components/common/AppText";
import BackButton from "../../components/common/BackButton";
import { Colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "../../redux/slices/authSlice";
import { removeTokens } from "../../services/auth";

export default function ProfileDetailScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const profile = useSelector((state) => state.user.profile);
    // console.log("🔥 PROFILE DETAIL:", profile);
    const kyc = useSelector((state) => state.kyc);

    const getAvatarUri = () => {
        if (!profile?.profileImage) return null;
        if (profile.profileImage.startsWith("http") || profile.profileImage.startsWith("file")) {
            return { uri: profile.profileImage };
        }
        const cleanPath = profile.profileImage.replace(/\\/g, "/");
        return { uri: `http://192.168.1.19:5000/${cleanPath}` };
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await removeTokens();
                        } catch (error) {
                            console.log("Error removing tokens:", error);
                        } finally {
                            dispatch(logout());
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'StartupScreen' }],
                            });
                        }
                    }
                }
            ]
        );
    };

    const avatarUri = getAvatarUri();

    return (
        <Screen style={styles.screen} backgroundColor="#FFFFFF">
            {/* Header */}
            <View style={styles.header}>
                <BackButton size={20} style={styles.backButton} />
                <AppText size="lg" weight="semibold" color={Colors.secondary}>
                    Profile
                </AppText>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => navigation.navigate("ProfileScreen")}
                >
                    <Ionicons name="create-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Avatar Card */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarFrame}>
                        {avatarUri ? (
                            <Image source={avatarUri} style={styles.avatarImage} />
                        ) : (
                            <Ionicons name="person" size={50} color="#94A3B8" />
                        )}
                    </View>
                    <AppText size="lg" weight="bold" color={Colors.secondary} style={{ marginTop: 12 }}>
                        {profile?.name || "Enter Your Name"}
                    </AppText>

                    {kyc.aadhaar.verified && kyc.pan.verified ? (
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
                            <AppText size="xs" weight="semibold" color="#16A34A"> KYC Verified</AppText>
                        </View>
                    ) : (
                        <View style={styles.pendingBadge}>
                            <Ionicons name="alert-circle" size={14} color="#F59E0B" />
                            <AppText size="xs" weight="semibold" color="#F59E0B"> KYC Pending</AppText>
                        </View>
                    )}
                </View>

                {/* Personal Information */}
                <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="person-circle-outline" size={20} color={Colors.primary} />
                        <AppText size="md" weight="semibold" color={Colors.secondary}>Personal Details</AppText>
                    </View>

                    <View style={styles.infoRow}>
                        <AppText size="xs" color={Colors.textLight}>Date of Birth</AppText>
                        <AppText size="xs" weight="semibold" color={Colors.secondary}>
                            {profile?.dob || "Not set"}
                        </AppText>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <AppText size="xs" color={Colors.textLight}>Gender</AppText>
                        <AppText size="xs" weight="semibold" color={Colors.secondary}>
                            {profile?.gender || "Not set"}
                        </AppText>
                    </View>
                </View>

                {/* Address Information */}
                <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="location-outline" size={20} color={Colors.primary} />
                        <AppText size="md" weight="semibold" color={Colors.secondary}>Address Details</AppText>
                    </View>

                    <View style={styles.infoRow}>
                        <AppText size="xs" color={Colors.textLight}>Address</AppText>
                        <AppText size="xs" weight="semibold" color={Colors.secondary} style={{ textAlign: "right", flex: 1, marginLeft: 16 }}>
                            {profile?.address || "Not set"}
                        </AppText>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <AppText size="xs" color={Colors.textLight}>City</AppText>
                        <AppText size="xs" weight="semibold" color={Colors.secondary}>
                            {profile?.city || "Not set"}
                        </AppText>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <AppText size="xs" color={Colors.textLight}>State</AppText>
                        <AppText size="xs" weight="semibold" color={Colors.secondary}>
                            {profile?.state || "Not set"}
                        </AppText>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <AppText size="xs" color={Colors.textLight}>Pincode</AppText>
                        <AppText size="xs" weight="semibold" color={Colors.secondary}>
                            {profile?.pincode || "Not set"}
                        </AppText>
                    </View>
                </View>

                {/* Verification Status */}
                <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
                        <AppText size="md" weight="semibold" color={Colors.secondary}>KYC Status</AppText>
                    </View>

                    <View style={styles.infoRow}>
                        <AppText size="xs" color={Colors.textLight}>Aadhaar Verification</AppText>
                        <AppText size="xs" weight="semibold" color={kyc.aadhaar.verified ? "#16A34A" : "#F59E0B"}>
                            {kyc.aadhaar.verified ? "Verified" : "Pending"}
                        </AppText>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <AppText size="xs" color={Colors.textLight}>PAN Verification</AppText>
                        <AppText size="xs" weight="semibold" color={kyc.pan.verified ? "#16A34A" : "#F59E0B"}>
                            {kyc.pan.verified ? "Verified" : "Pending"}
                        </AppText>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutCard}
                    activeOpacity={0.8}
                    onPress={handleLogout}
                >
                    <View style={styles.logoutContent}>
                        <Ionicons name="log-out-outline" size={22} color="#DC2626" />
                        <AppText size="md" weight="bold" color="#DC2626" style={{ marginLeft: 12 }}>
                            Log Out
                        </AppText>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>

                {/* Footer version */}
                <AppText size="xxs" color={Colors.textLight} style={styles.footerVersion}>
                    Version 1.0.0 (Secure Build)
                </AppText>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6",
    },
    backButton: {
        paddingHorizontal: 0,
    },
    editBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#EFF6FF",
        alignItems: "center",
        justifyContent: "center",
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 24,
    },
    avatarSection: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 24,
    },
    avatarFrame: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: "#F8FAFC",
        borderWidth: 2,
        borderColor: "#EEF2F6",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    avatarImage: {
        width: "100%",
        height: "100%",
    },
    verifiedBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DCFCE7",
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 8,
    },
    pendingBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF3C7",
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 8,
    },
    infoCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#EEF2F6",
        padding: 20,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    divider: {
        height: 1,
        backgroundColor: "#EEF2F6",
    },
    logoutCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FEF2F2",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#FEE2E2",
        padding: 20,
        marginVertical: 12,
    },
    logoutContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    footerVersion: {
        textAlign: "center",
        marginTop: 16,
        letterSpacing: 0.5,
    },
});
