import React, { useState } from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";
import AppText from "../../components/common/AppText";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import TouchableOpacity from "../../components/common/HapticTouchableOpacity";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function LoanCard({
    title,
    amount,
    image,
    badge,
    variant = "small",
    onPress,
    style,
}) {
    const [cardWidth, setCardWidth] = useState(SCREEN_WIDTH - 32);

    const onLayout = (e) => {
        const w = e.nativeEvent.layout.width;
        if (w && Math.abs(w - cardWidth) > 1) {
            setCardWidth(w);
        }
    };

    if (variant === "full") {
        const W = cardWidth;
        const H = 90;
        const H_top = 58;
        const W_right = 110;
        const W_left = W - W_right;
        const r = 12;
        const r_inner = 14;

        const pathD = `
            M ${r},0
            L ${W - r},0
            A ${r},${r} 0 0 1 ${W},${r}
            L ${W},${H - r}
            A ${r},${r} 0 0 1 ${W - r},${H}
            L ${W_left + r},${H}
            A ${r},${r} 0 0 1 ${W_left},${H - r}
            L ${W_left},${H_top + r_inner}
            A ${r_inner},${r_inner} 0 0 0 ${W_left - r_inner},${H_top}
            L ${r},${H_top}
            A ${r},${r} 0 0 1 0,${H_top - r}
            L 0,${r}
            A ${r},${r} 0 0 1 ${r},0
            Z
        `;

        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={[styles.fullCardContainer, { height: H }, style]}
                onLayout={onLayout}
            >
                <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
                    <Path
                        d={pathD}
                        fill="#FFFFFF"
                        stroke="#E2E8F0"
                        strokeWidth={1}
                    />
                </Svg>

                <View style={[styles.fullTopLeftText, { width: W_left - 12 }]}>
                    <AppText weight="medium" size="sm" color="#1E293B">
                        {title}
                    </AppText>
                    <AppText weight="medium" size="xs" color="#64748B">
                        {amount}
                    </AppText>
                </View>

                <View style={[styles.fullBottomPill, { top: H_top + 3, width: W_left - 3 }]}>
                    <Ionicons name="sparkles" size={13} color="#0334a0ff" style={{ marginRight: 5 }} />
                    <AppText weight="medium" size="xxs" color="#0635a2ff" numberOfLines={1}>
                        Instant loan | cash
                    </AppText>
                </View>

                <View style={[styles.fullRightImageWrap, { left: W_left, width: W_right, height: H }]}>
                    {image && (
                        <Image
                            source={image}
                            style={styles.fullCardImageNew}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[styles.card, styles[variant], style]}
        >
            <View style={styles.textContainer}>
                <AppText
                    weight="medium"
                    size={variant === "large" ? "md" : "sm"}
                    color="#202124"
                    numberOfLines={2}
                >
                    {title}
                </AppText>

                <AppText
                    weight="regular"
                    size="xs"
                    color="#666666"
                    style={styles.amount}
                >
                    {amount}
                </AppText>
            </View>

            {image && (
                <Image
                    source={image}
                    style={[
                        styles.image,
                        variant === "large" && styles.largeImage,
                        variant === "small" && styles.smallImage,
                        variant === "wide" && styles.wideImage,
                        variant === "medium" && styles.mediumImage,
                    ]}
                    resizeMode="contain"
                />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fdfdfdff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        overflow: "hidden",
        position: "relative",
    },

    large: {
        height: 160,
        flex: 1.15,
    },

    small: {
        height: 75,
        width: "100%",
    },

    wide: {
        height: 90,
        flex: 1.4,
    },

    medium: {
        height: 90,
        flex: 0.9,
    },

    full: {
        height: 80,
        width: "100%",
    },

    fullCardContainer: {
        height: 110,
        width: "100%",
        position: "relative",
    },

    fullTopLeftText: {
        position: "absolute",
        top: 8,
        left: 12,
    },

    fullBottomPill: {
        position: "absolute",
        left: 0,
        height: 30,
        backgroundColor: "#e1eaffff",
        borderColor: "#98b7ffff",
        borderWidth: 1,
        borderRadius: 11,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },

    fullRightImageWrap: {
        position: "absolute",
        top: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    fullCardImageNew: {
        width: 170,
        height: 170,
    },

    textContainer: {
        paddingHorizontal: 12,
        paddingTop: 5,
        zIndex: 2,
    },

    amount: {
        marginTop: 0,
    },

    image: {
        position: "absolute",
        right: -4,
        bottom: -15,
        zIndex: 1,
    },

    largeImage: {
        width: 125,
        height: 125,
    },

    smallImage: {
        width: 75,
        height: 75,
        bottom: -20
    },

    fullImage: {
        width: 220,
        height: 110,
        right: -65,
        bottom: -20,
    },

    wideImage: {
        width: 110,
        height: 110,
        right: -10,
        bottom: -25,
    },

    mediumImage: {
        width: 90,
        height: 90,
        right: -5,
        bottom: -25,
    }
});