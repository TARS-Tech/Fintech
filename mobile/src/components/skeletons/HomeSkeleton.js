import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from "react-native-reanimated";

const SkeletonBox = ({
    width,
    height,
    radius = 8,
    style,
}) => {
    const opacity = useSharedValue(0.45);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.8, {
                duration: 700,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius: radius,
                },
                animatedStyle,
                style,
            ]}
        />
    );
};

export default function HomeSkeleton() {
    return (
        <View style={styles.container}>

            {/* ================= HERO ================= */}
            {/* <View style={styles.heroSkeleton}>
                <View style={styles.heroLeft}>
                    <SkeletonBox
                        width={145}
                        height={28}
                        radius={8}
                    />

                    <SkeletonBox
                        width={120}
                        height={18}
                        radius={6}
                        style={{ marginTop: 12 }}
                    />

                    <SkeletonBox
                        width={120}
                        height={40}
                        radius={14}
                        style={{ marginTop: 18 }}
                    />
                </View>

                <SkeletonBox
                    width={175}
                    height={135}
                    radius={20}
                    style={styles.heroImage}
                />
            </View> */}

            {/* ================= ELIGIBILITY ================= */}
            <View style={styles.section}>
                <View style={styles.card}>
                    <SkeletonBox
                        width={190}
                        height={23}
                        radius={6}
                    />

                    <SkeletonBox
                        width={250}
                        height={17}
                        radius={6}
                        style={{ marginTop: 10 }}
                    />

                    <SkeletonBox
                        width={115}
                        height={40}
                        radius={11}
                        style={{ marginTop: 18 }}
                    />

                    <SkeletonBox
                        width={100}
                        height={75}
                        radius={15}
                        style={styles.eligibilityImage}
                    />
                </View>
            </View>

            {/* ================= EXPLORE LOANS ================= */}
            <View style={styles.section}>
                <SkeletonBox
                    width={145}
                    height={28}
                    radius={6}
                />

                <SkeletonBox
                    width={225}
                    height={17}
                    radius={6}
                    style={{ marginTop: 9 }}
                />

                <View style={styles.loanRow}>
                    {[1, 2, 3, 4].map((item) => (
                        <View
                            key={item}
                            style={styles.loanItem}
                        >
                            <SkeletonBox
                                width={52}
                                height={52}
                                radius={15}
                            />

                            <SkeletonBox
                                width={58}
                                height={13}
                                radius={5}
                                style={{ marginTop: 9 }}
                            />

                            <SkeletonBox
                                width={42}
                                height={13}
                                radius={5}
                                style={{ marginTop: 4 }}
                            />
                        </View>
                    ))}
                </View>

                <View style={styles.compareRow}>
                    <SkeletonBox
                        width="74%"
                        height={55}
                        radius={12}
                    />

                    <SkeletonBox
                        width="22%"
                        height={55}
                        radius={12}
                    />
                </View>
            </View>

            {/* ================= QUICK ACTIONS ================= */}
            <View style={styles.quickActions}>
                <SkeletonBox
                    width={145}
                    height={45}
                    radius={23}
                />

                <SkeletonBox
                    width={155}
                    height={45}
                    radius={23}
                />
            </View>

            {/* ================= BENEFITS ================= */}
            <View style={styles.section}>
                <SkeletonBox
                    width="100%"
                    height={260}
                    radius={22}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        paddingBottom: 120,
    },

    skeleton: {
        backgroundColor: "#E8EDF3",
    },

    heroSkeleton: {
        height: 280,
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },

    heroLeft: {
        width: "55%",
        marginTop: 25,
    },

    heroImage: {
        position: "absolute",
        right: 20,
        top: 75,
    },

    section: {
        marginTop: 25,
        paddingHorizontal: 24,
    },

    card: {
        height: 150,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#EDF2F7",
        padding: 20,
        position: "relative",
        overflow: "hidden",
    },

    eligibilityImage: {
        position: "absolute",
        right: 20,
        bottom: 18,
    },

    loanRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },

    loanItem: {
        alignItems: "center",
        width: "23%",
    },

    compareRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18,
    },

    quickActions: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 24,
        marginTop: 25,
    },
});