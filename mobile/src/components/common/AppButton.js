import { ActivityIndicator } from "react-native";
import TouchableOpacity from "./HapticTouchableOpacity";
import { Colors } from "../../theme/colors";
import AppText from "./AppText";

export default function AppButton({ title, textWeight = "bold", textSize = "sm", onPress, disabled, loading, style, textStyle, leftIcon, rightIcon, children }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{
        backgroundColor: disabled || loading ? "#CBD5E1" : Colors.primary,
        paddingHorizontal: 16,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height: 56,
      }, style]}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          {leftIcon}
          {title ? (
            <AppText weight={textWeight} size={textSize} color="#fff" style={textStyle}>
              {title}
            </AppText>
          ) : null}
          {children}
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}
