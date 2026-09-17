import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useAnimatedReaction,
    interpolate,
    Extrapolation,
    runOnJS
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HEADER_CONTENT_HEIGHT = 50;
const STICK_THRESHOLD = 10;
const SCROLL_THRESHOLD = 120;

export default function CollapsibleHeaderLayout({
    isHydrated = true,
    fixedStatusBarStyle,
    navbarLeft,
    navbarRight,
    navbarGradientColors = ["#FFFFFF", "#eaeaeaff", "rgba(144, 179, 255, 1)"],
    bannerContent,
    bannerGradientColors,
    bannerBackgroundColor,
    bannerPaddingTopOffset = 0,
    bannerPaddingBottom,
    bannerStyle,
    externalScrollY,
    refreshControl,
    showsVerticalScrollIndicator = false,
    contentContainerStyle,
    keyboardShouldPersistTaps,
    scrollBehavior = "normal", // "normal" | "overlay"
    contentBackgroundColor = "#FFFFFF",
    contentSheetRadius = 0,
    children
}) {
    const insets = useSafeAreaInsets();
    const internalScrollY = useSharedValue(0);
    const scrollY = externalScrollY || internalScrollY;
    const [statusBarStyle, setStatusBarStyle] = useState(fixedStatusBarStyle || "light-content");
    const [bannerHeight, setBannerHeight] = useState(0);

    const totalHeaderHeight = HEADER_CONTENT_HEIGHT + insets.top + STICK_THRESHOLD;

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    useAnimatedReaction(
        () => scrollY.value > SCROLL_THRESHOLD - 30,
        (isPast, previous) => {
            if (!fixedStatusBarStyle && isPast !== previous) {
                runOnJS(setStatusBarStyle)(isPast ? "dark-content" : "light-content");
            }
        }
    );

    // Sticky header translateY animation
    const stickyHeaderTransformStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, STICK_THRESHOLD],
            [0, -STICK_THRESHOLD],
            Extrapolation.CLAMP
        );
        return { transform: [{ translateY }] };
    });

    // Dynamic gradient navbar opacity animation with hydration state support
    const gradientNavbarStyle = useAnimatedStyle(() => {
        if (!isHydrated) {
            return {
                opacity: 1,
            };
        }
        const opacity = interpolate(
            scrollY.value,
            [STICK_THRESHOLD, SCROLL_THRESHOLD],
            [0, 1],
            Extrapolation.CLAMP
        );
        return { opacity };
    });

    // Banner animation in overlay mode
    const overlayBannerStyle = useAnimatedStyle(() => {
        if (scrollBehavior !== "overlay" || !bannerHeight) return {};

        const scrollDistance = Math.max(bannerHeight - totalHeaderHeight, 1);

        // Soft opacity fade as content scrolls over the banner
        const opacity = interpolate(
            scrollY.value,
            [0, scrollDistance * 1, scrollDistance],
            [1, 1, 0],
            Extrapolation.CLAMP
        );

        // Subtle parallax movement
        const translateY = interpolate(
            scrollY.value,
            [0, scrollDistance],
            [0, -scrollDistance * 0.25],
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    const handleBannerLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height && Math.abs(height - bannerHeight) > 1) {
            setBannerHeight(height);
        }
    };

    const renderBannerContainer = () => {
        if (!bannerContent) return null;

        const heroPaddingTop = totalHeaderHeight + bannerPaddingTopOffset;
        const containerStyle = [
            styles.heroContainer,
            { paddingTop: heroPaddingTop },
            bannerPaddingBottom !== undefined ? { paddingBottom: bannerPaddingBottom } : null,
            bannerStyle
        ];

        if (bannerGradientColors) {
            return (
                <AnimatedLinearGradient
                    colors={bannerGradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={containerStyle}
                >
                    {bannerContent}
                </AnimatedLinearGradient>
            );
        }

        return (
            <Animated.View style={[containerStyle, bannerBackgroundColor ? { backgroundColor: bannerBackgroundColor } : null]}>
                {bannerContent}
            </Animated.View>
        );
    };

    const isOverlay = scrollBehavior === "overlay";

    return (
        <View style={styles.mainWrapper}>
            {/* Dynamic Status Bar */}
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={statusBarStyle}
                animated
            />

            {/* Sticky Top Navbar */}
            <Animated.View
                style={[
                    styles.stickyNavbarContainer,
                    { height: totalHeaderHeight, paddingTop: insets.top },
                    stickyHeaderTransformStyle,
                ]}
            >
                <AnimatedLinearGradient
                    colors={navbarGradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, gradientNavbarStyle]}
                />
                <View style={styles.navbarContent}>
                    <View style={styles.navbarLeftWrap}>{navbarLeft}</View>
                    {navbarRight && <View style={styles.navbarRightWrap}>{navbarRight}</View>}
                </View>
            </Animated.View>

            {/* In Overlay Mode: Banner rendered fixed/behind at zIndex 1 */}
            {isOverlay && bannerContent && (
                <Animated.View
                    onLayout={handleBannerLayout}
                    style={[
                        styles.overlayBannerWrapper,
                        overlayBannerStyle,
                    ]}
                    pointerEvents="box-none"
                >
                    {renderBannerContainer()}
                </Animated.View>
            )}

            {/* Main Scroll Content */}
            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                contentContainerStyle={contentContainerStyle}
                refreshControl={refreshControl}
                keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                style={isOverlay ? { flex: 1, zIndex: 2 } : null}
            >
                {!isOverlay && renderBannerContainer()}

                {isOverlay ? (
                    <>
                        <View style={{ height: bannerHeight }} pointerEvents="none" />
                        <View
                            style={[
                                styles.overlayContentSheet,
                                { backgroundColor: contentBackgroundColor },
                                contentSheetRadius > 0 && {
                                    borderTopLeftRadius: contentSheetRadius,
                                    borderTopRightRadius: contentSheetRadius,
                                    marginTop: -contentSheetRadius,
                                    paddingTop: contentSheetRadius,
                                },
                            ]}
                        >
                            {children}
                        </View>
                    </>
                ) : (
                    children
                )}
            </Animated.ScrollView>
        </View>
    );
}

const { width } = Dimensions.get("window");

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

    },
    navbarContent: {
        height: HEADER_CONTENT_HEIGHT,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    navbarLeftWrap: {
        flexDirection: "row",
        alignItems: "center",
    },
    navbarRightWrap: {
        flexDirection: "row",
        alignItems: "center",
    },
    heroContainer: {
        width,
        alignItems: "center",
        paddingHorizontal: 24,
        paddingBottom: 10,
        overflow: "hidden",
    },
    overlayBannerWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    overlayContentSheet: {
        flex: 1,
        zIndex: 2,
    },
});