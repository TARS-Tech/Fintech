import { StyleSheet, View } from "react-native";
import AppText from "../../components/common/AppText";
import { Colors } from "../../theme/colors";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import TouchableOpacity from "../../components/common/HapticTouchableOpacity";

export default function LoanAmountSelector({ value = 50000, min = 50000, max = 500000, onValueChange, step }) {

    const [amount, setAmount] = useState(value)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    useEffect(() => {
        setAmount(value)
    }, [value]);

    const handleValueChanged = (val) => {
        setAmount(val);
        onValueChange?.(val);
    }

    const STEP = step;
    const handleDecrement = () => {
        const newAmount = Math.max(min, amount - STEP);
        setAmount(newAmount);
        onValueChange?.(newAmount);
    };
    const handleIncrement = () => {
        const newAmount = Math.min(max, amount + STEP);
        setAmount(newAmount);
        onValueChange?.(newAmount);
    };

    return (
        <View style={{ gap: 8, marginTop: 10, alignItems: "center" }}>
            <AppText size="md" color={Colors.textLight} >Select Loan Amount</AppText>
            <View style={styles.sliderHeader}>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
                    <TouchableOpacity onPress={handleDecrement} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="remove" size={26} color={amount <= min ? Colors.textLight : Colors.text} />
                    </TouchableOpacity>
                    <AppText weight="bold" size="h2" color={Colors.text}>
                        {formatCurrency(amount)}
                    </AppText>
                    <TouchableOpacity onPress={handleIncrement} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="add" size={26} color={amount >= max ? Colors.textLight : Colors.text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.sliderContainer}>
                    <Slider
                        style={styles.slider}
                        minimumValue={min}
                        maximumValue={max}
                        step={step}
                        value={amount}
                        onValueChange={handleValueChanged}
                        minimumTrackTintColor={Colors.primary}
                        maximumTrackTintColor={Colors.textLight}
                        thumbTintColor={Colors.primary}
                    />
                </View>

                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10, marginTop: 15 }}>
                    <AppText size="sm" weight="medium" color={Colors.textLight}>{formatCurrency(min)}</AppText>
                    <AppText size="sm" weight="medium" color={Colors.textLight}>{formatCurrency(max)}</AppText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sliderHeader: {
        width: '100%',
        alignItems: "center",
        justifyContent: "space-between"
    },

    sliderContainer: {
        width: '100%',
        marginTop: 20
    },

    slider: {
        flex: 1,
        height: 40,
        // transform: [{ scaleY: 1 }]
    },

})
