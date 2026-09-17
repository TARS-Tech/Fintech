import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colors } from "../../theme/colors";
import AppText from "../../components/common/AppText";
import {
    useState, useEffect
} from "react";
import AppButton from "../../components/common/AppButton";
import { Ionicons } from "@expo/vector-icons";


const ShieldRupeeIcon = ({ size = 20, color = Colors.primary }) => (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ position: "absolute" }}>
            <Path
                d="M 12 2 Q 8 5 4 6 L 4 12 Q 4 17 12 21 Q 20 17 20 12 L 20 6 Q 16 5 12 2 Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
        <AppText weight="medium" size="xs" color="#E57C00" style={{ marginTop: -1 }}>
            ₹
        </AppText>
    </View>
);

export default function LoanOfferCard({ offer, selectedAmount, selectedTenure, onApply }) {

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };


    // console.log("selectTenure:", selectedTenure)
    return (
        <View style={{ width: "100%", marginTop: 20 }}>
            <LinearGradient
                colors={["#e7efffff", "#f8faffff", "#FFFFFF"]}
                locations={[0, 0.4, 1]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.8 }}
                style={styles.loanCard}
            >
                <View style={{ flexDirection: "row", gap: 5, paddingHorizontal: 20, }}>
                    <ShieldRupeeIcon />
                    <View style={{ justifyContent: "center" }}>
                        <AppText size="sm" weight="medium" color={Colors.primary} style={{ letterSpacing: -0.2 }}>
                            {offer?.partner?.name}
                        </AppText>
                        <Svg width={100} height={10} viewBox="0 0 110 10" fill="none" style={{ marginTop: -1 }}>
                            <Path
                                d="M 2 2.5 L 85 2 L 15 7.5 L 105 7"
                                stroke="#f5ca0bff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10 }}>
                    <AppText size="md" weight="medium" color={Colors.black} style={{ letterSpacing: -0.2 }}>
                        {formatCurrency(selectedAmount)}
                    </AppText>

                    <AppButton
                        title="Apply Now"
                        onPress={() => { }}
                        style={{ height: 32, paddingHorizontal: 10, borderRadius: 8 }}
                        textWeight="medium"
                        rightIcon={<Ionicons name="arrow-forward-outline" size={14} color="#FFFFFF" style={{ transform: [{ rotate: "-45deg" }] }} />}
                        textStyle={{ color: "#ffffff" }}
                        textSize="xs"
                    />

                </View>

                <View style={{ marginTop: 10, backgroundColor: "#7fa8ff3f", justifyContent: "center", alignItems: "center", padding: 10 }}>
                    <AppText size="sm" weight="regular" color={Colors.textLight}>Processing fee up to {offer?.processingFee}</AppText>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 15 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
                        <AppText size="sm" weight="regular" color={Colors.black} style={{ letterSpacing: -0.2 }}>
                            {offer?.interestRate}% p.a.
                        </AppText>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Ionicons name="calendar-clear-outline" size={15} color={Colors.primary} />
                        <AppText size="sm" weight="regular" color={Colors.textLight}>
                            Up to <AppText size="sm" weight="medium" color="#515151ff">36 months</AppText>
                        </AppText>
                    </View>
                </View>

            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    loanCard: {
        borderRadius: 22,
        paddingTop: 20,
        paddingBottom: 20,
        borderWidth: 1.5,
        borderColor: "#CBDDFD",
        overflow: "hidden",
    },
});

// Partner Bank A              │ │
// │ │                             │ │
// │ │ ₹2,00,000                   │ │
// │ │                             │ │
// │ │ 12.99% p.a.   Up to 36 mo. │ │
// │ │                             │ │
// │ │ Processing fee up to 2%     │ │
// │ │                             │ │
// │ │              Apply Now →    │ │