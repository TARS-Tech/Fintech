import { useRef, useState } from "react";
import Screen from "../../components/common/Screen";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Logo from "../../components/common/Logo";
import AppInput from "../../components/inputs/AppInput";
// import { Mail } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { sendOtp } from "../../redux/actions/authActions";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [sendUpdates, setSendUpdates] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    // console.log("button click")
    setLoading(true);
    try {
      const res = await sendOtp({
        email,
        phone
      });

      console.log("res for otp:", res)

      if (res.success) {
        navigation.navigate(
          "VerificationCode",
          {
            phone,
            email,
            autoOtp: res.data?.otp || res.otp,
          }
        );
      }
    } catch (error) {
      console.log("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Screen style={styles.container}>
      <View style={{ marginTop: 40 }}>
        <Logo size={28} />
      </View>

      <AppText
        size="h3"
        weight="bold"
        style={{ textAlign: "center", marginTop: 20 }}
      >
        Create Account
      </AppText>

      <AppText color="#6B7280" style={{}}>
        Enter your details to get started
      </AppText>

      <View style={{ width, marginTop: 50 }}>
        <AppInput
          // label="Email"
          value={email}
          leftIcon={<Ionicons name="mail-outline" size={22} color="#6B7280" />}
          placeholder="Enter email"
          keyboardType="email-address"
          inputStyle={{ marginLeft: 10 }}
          onChangeText={(text) => setEmail(text)}
        />
        <AppInput
          // label="Phone"
          value={phone}
          leftIcon={<Ionicons name="call-outline" size={22} color="#6B7280" />}
          placeholder="Enter Phone"
          keyboardType="phone-pad"
          inputStyle={{ marginLeft: 10 }}
          onChangeText={setPhone}
        />
      </View>

      <TouchableOpacity
        id="send-updates-checkbox"
        style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-start", paddingHorizontal: 24, marginTop: 20 }}
        onPress={() => setSendUpdates(!sendUpdates)}
      >
        <Ionicons
          name={sendUpdates ? "checkbox" : "square-outline"}
          color={Colors.primary}
          size={20}
        />
        <AppText size="sm" color="#64748B" style={{ marginLeft: 10 }}>
          Send me updates over Whatsapp
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        id="accept-terms-checkbox"
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          alignSelf: "flex-start",
          paddingHorizontal: 24,
          marginTop: 20,
        }}
        onPress={() => setAcceptTerms(!acceptTerms)}
      >
        <Ionicons
          name={acceptTerms ? "checkbox" : "square-outline"}
          color={Colors.primary}
          size={20}
        />
        <AppText size="sm" color="#6B7280" style={{ marginLeft: 10 }}>
          I accept the{" "}
          <AppText size="sm" color={Colors.primary} weight="medium">
            Terms of Service
          </AppText>{" "}
          &{" "}
          <AppText size="sm" color={Colors.primary} weight="medium">
            Privacy Policy
          </AppText>
          , and consent to the collection and processing of my personal
          information for account creation, identity verification, and
          compliance with applicable regulations.
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity style={{ width, marginTop: 40, alignSelf: "flex-start", paddingHorizontal: 24 }}>
        <AppButton title="Continue" onPress={handleContinue} loading={loading} />
      </TouchableOpacity>

      <AppText style={{ marginTop: 20 }}>Already have an account? <AppText color={Colors.primary} weight="medium" onPress={() => navigation.navigate("LoginScreen")}>Login</AppText></AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Allows the screen to take up the full available height
    // justifyContent: "center", // Centers items vertically (top-to-bottom)
    alignItems: "center", // Centers items horizontally (left-to-right)
    width,
  },
});
