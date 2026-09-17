import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../theme/colors";
import AppText from "../common/AppText";

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize = "none",
  autoCorrect = false,
  editable = true,
  error,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  inputContainerStyle,
  ...props
}) {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <AppText weight="medium" style={styles.label}>
          {label}
        </AppText>
      )}

      <View style={[styles.inputContainer, inputContainerStyle]}>
        {leftIcon}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray400}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          style={[styles.input, inputStyle]}
          {...props}
        />

        {rightIcon}
      </View>

      {!!error && (
        <AppText color={Colors.error} size="sm" style={styles.error}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  label: {
    marginBottom: 8,
    color: Colors.black,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",

    height: 58,
    borderRadius: 18,
    paddingHorizontal: 18,

    backgroundColor: "#FCFCFD",

    borderWidth: 1,
    borderColor: "#EEF2F6",

    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    // elevation: 2,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    fontFamily: "Inter-Regular",
  },

  error: {
    marginTop: 6,
  },
});
