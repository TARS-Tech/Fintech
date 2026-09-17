import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import AppText from "../../components/common/AppText";
import { loans as staticLoans } from "../../data/loans";
import BackButton from "../../components/common/BackButton";
import { Colors } from "../../theme/colors";
import LoanAmountSelector from "./LoanAmountSelector";
import LoanOfferCard from "./LoanOfferCard";
import CollapsibleHeaderLayout from "../../components/common/CollapsibleHeaderLayout";
import { getActiveOffersService, getActiveLoansService } from "../../services/loan";

export default function LoanOffersScreen({ navigation }) {
    const route = useRoute();
    const { loanId } = route.params || {};
    const scrollY = useSharedValue(0);

    const [dynamicLoan, setDynamicLoan] = useState(null);
    const [dynamicOffers, setDynamicOffers] = useState([]);
    const [loadingOffers, setLoadingOffers] = useState(true);

    const selectedLoan = useMemo(() => {
        if (dynamicLoan) return dynamicLoan;
        return staticLoans.find(loan => loan.id === loanId || loan.slug === loanId || loan._id === loanId);
    }, [loanId, dynamicLoan]);

    const [selectedAmount, setSelectedAmount] = useState(selectedLoan?.amount?.min || 50000);
    const [selectedTenure, setSelectedTenure] = useState(selectedLoan?.tenure?.min || 12);

    useEffect(() => {
        let isMounted = true;
        const fetchDynamicData = async () => {
            try {
                setLoadingOffers(true);
                const [offersRes, loansRes] = await Promise.all([
                    getActiveOffersService({ loanId }),
                    getActiveLoansService()
                ]);

                if (isMounted) {
                    if (loansRes?.data?.length > 0) {
                        const matched = loansRes.data.find(l => l._id === loanId || l.slug === loanId);
                        if (matched) setDynamicLoan(matched);
                    }
                    if (offersRes?.data?.length > 0) {
                        setDynamicOffers(offersRes.data);
                    }
                }
            } catch (err) {
                console.log("Fetch dynamic offers error (fallback to static):", err?.message);
            } finally {
                if (isMounted) setLoadingOffers(false);
            }
        };

        fetchDynamicData();
        return () => { isMounted = false; };
    }, [loanId]);

    const handleValueChange = (val) => {
        setSelectedAmount(val);
    };

    // Derived offers list
    const offersList = useMemo(() => {
        if (dynamicOffers.length > 0) {
            return dynamicOffers.map(offer => ({
                id: offer._id,
                partner: {
                    id: offer.partnerId?._id || offer.partnerId?.code,
                    name: offer.partnerId?.name,
                    type: offer.partnerId?.type,
                    logo: offer.partnerId?.logo,
                },
                amount: offer.amount,
                interestRate: offer.interestRate,
                tenure: offer.tenure,
                processingFee: offer.processingFee,
                status: offer.status,
            }));
        }
        return selectedLoan?.offers || [];
    }, [dynamicOffers, selectedLoan]);

    // Header title fades in & slides up smoothly on scroll
    const titleAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [15, 60],
            [0, 1],
            Extrapolation.CLAMP
        );
        const translateY = interpolate(
            scrollY.value,
            [15, 60],
            [6, 0],
            Extrapolation.CLAMP
        );
        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    return (
        <CollapsibleHeaderLayout
            fixedStatusBarStyle="dark-content"
            externalScrollY={scrollY}
            navbarGradientColors={["#FFFFFF", "#F8FAFF", "#FFFFFF"]}
            navbarLeft={
                <View style={styles.header}>
                    <BackButton size={20} onPress={() => navigation.goBack()} color={Colors.black} />
                    <Animated.View style={titleAnimatedStyle}>
                        <AppText size="lg" weight="medium" color={Colors.black}>
                            {selectedLoan?.name}
                        </AppText>
                    </Animated.View>
                </View>
            }
            contentContainerStyle={{ paddingTop: 70, paddingHorizontal: 16, paddingBottom: 40 }}
        >

            <View style={{ marginTop: 10 }}>
                <LoanAmountSelector
                    min={selectedLoan?.amount?.min || selectedLoan?.min}
                    max={selectedLoan?.amount?.max || selectedLoan?.max}
                    step={selectedLoan?.amount?.step || 5000}
                    onValueChange={handleValueChange}
                />
            </View>

            <View
                style={{
                    height: 1,
                    backgroundColor: "#E2E8F0",
                    marginHorizontal: -16,
                    marginTop: 30,
                    alignSelf: "stretch"
                }}
            />

            <View style={{ width: "100%", marginTop: 20, alignItems: "center" }}>
                <AppText size="md" color={Colors.text}>Available Loan Offers</AppText>
            </View>

            {loadingOffers ? (
                <View style={{ paddingVertical: 30, alignItems: "center" }}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                </View>
            ) : offersList.length > 0 ? (
                offersList.map((item) => (
                    <LoanOfferCard
                        key={item.id}
                        offer={item}
                        selectedAmount={selectedAmount}
                        selectedTenure={selectedTenure}
                    />
                ))
            ) : (
                <View style={{ paddingVertical: 30, alignItems: "center" }}>
                    <AppText size="sm" color={Colors.greyText}>No active offers available for this loan product.</AppText>
                </View>
            )}
        </CollapsibleHeaderLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
});