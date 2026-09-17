import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Dimensions, StyleSheet, View, ScrollView, Platform, Image } from "react-native";
import TouchableOpacity from "../../components/common/HapticTouchableOpacity";
import Screen from "../../components/common/Screen";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import BackButton from "../../components/common/BackButton";
import AppInput from "../../components/inputs/AppInput";
import { Colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateProfile } from "../../redux/actions/profileActions";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
    const profile = useSelector((state) => state.user.profile);
    console.log("profile in profile screen:", profile);

    useEffect(() => {
        if (!profile) return;

        setName(profile.name || "");
        if (profile.dob) {
            const date = new Date(profile.dob);

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            setDob(`${day} / ${month} / ${year}`);
            setDate(date); // Optional: keeps DateTimePicker in sync
        }
        setGender(profile.gender || "");
        setAddress(profile.address || "");
        setCity(profile.city || "");
        setStateName(profile.state || "");
        setPincode(profile.pincode || "");
    }, [profile]);

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(null);
    const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [stateName, setStateName] = useState("");
    const [pincode, setPincode] = useState("");
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChangeData = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === "ios");

        if (selectedDate) {
            setDate(selectedDate);

            const day = String(selectedDate.getDate()).padStart(2, "0");
            const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
            const year = selectedDate.getFullYear();

            setDob(`${day} / ${month} / ${year}`);
        }
    }



    const pickImage = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0])
        }
    }

    const handleSave = async () => {
        console.log("profile complete click")

        const formData = new FormData();
        formData.append("name", name);
        formData.append("dob", dob);
        formData.append("gender", gender);
        formData.append("address", address);
        formData.append("city", city);
        formData.append("state", stateName);
        formData.append("pincode", pincode);

        if (profileImage) {
            formData.append("profileImage", {
                uri: profileImage.uri,
                name: "profile.jpg",
                type: "image/jpeg",
            });
        }

        const result = await dispatch(
            updateProfile(formData)
        );

        console.log(result)

        if (result.success) {
            navigation.navigate("KYC")
        }
    };

    return (
        <Screen style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <BackButton />
                    <AppText size="h3" weight="bold" style={styles.headerTitle}>
                        Create Profile
                    </AppText>
                    {/* Empty view to balance the BackButton and center the title */}
                    <View style={styles.headerRightPlaceholder} />
                </View>

                {/* Subtitle */}
                <View style={styles.subtitleContainer}>
                    <AppText color="#6B7280" style={styles.subtitle}>
                        Enter your details to get started
                    </AppText>
                </View>

                {/* Profile Avatar Selection */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarFrame}>
                        {profileImage ? (
                            <Image
                                source={{
                                    uri: profileImage.uri
                                }}
                                style={{
                                    width: 90,
                                    height: 90,
                                    borderRadius: 45,
                                }}
                            />


                        ) :

                            (<Ionicons
                                name="person-outline"
                                size={50}
                                color="#94A3B8"
                            />)
                        }

                    </View>

                    <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.8} onPress={pickImage}>
                        <Ionicons name="camera-reverse-outline" size={18} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                    <AppInput
                        // label="Full Name"
                        placeholder="Name as per Pan"
                        value={name}
                        onChangeText={setName}
                        leftIcon={<Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
                        inputContainerStyle={styles.formStyle}
                    />

                    {/* <AppInput
                        // label="Email Address"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        leftIcon={<Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
                        inputContainerStyle={styles.formStyle}
                    /> */}

                    <TouchableOpacity activeOpacity={0.8} onPress={(() => setShowDatePicker(true))}>
                        <View pointerEvents="none">
                            <AppInput
                                // label="Date of Birth"
                                placeholder="DD / MM / YYYY"
                                value={dob}
                                editable={false}
                                // onChangeText={setDob}
                                leftIcon={<Ionicons name="calendar-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
                                inputContainerStyle={styles.formStyle}
                            />
                        </View>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? "spinner" : "default"}
                            maximumDate={new Date()}
                            onChange={onChangeData}
                        />
                    )}

                    {/* Gender Dropdown Container */}
                    <View style={styles.dropdownFieldContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                        >
                            <View pointerEvents="none">
                                <AppInput
                                    placeholder="Select Gender"
                                    value={gender}
                                    editable={false}
                                    leftIcon={<Ionicons name="people-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
                                    rightIcon={
                                        <Ionicons
                                            name={showGenderDropdown ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#94A3B8"
                                            style={{ marginRight: 10 }}
                                        />
                                    }
                                    inputContainerStyle={styles.formStyle}
                                    style={{ marginBottom: 0 }}
                                />
                            </View>
                        </TouchableOpacity>

                        {showGenderDropdown && (
                            <View style={styles.dropdownMenu}>
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setGender("Male");
                                        setShowGenderDropdown(false);
                                    }}
                                >
                                    <AppText style={styles.dropdownItemText}>Male</AppText>
                                    {gender === "Male" && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
                                </TouchableOpacity>

                                <View style={styles.divider} />

                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setGender("Female");
                                        setShowGenderDropdown(false);
                                    }}
                                >
                                    <AppText style={styles.dropdownItemText}>Female</AppText>
                                    {gender === "Female" && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <AppInput
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                        leftIcon={<Ionicons name="location-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
                        inputContainerStyle={styles.formStyle}
                    />

                    <AppInput
                        placeholder="City"
                        value={city}
                        onChangeText={setCity}
                        leftIcon={<Ionicons name="business-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
                        inputContainerStyle={styles.formStyle}
                    />

                    <AppInput
                        placeholder="State"
                        value={stateName}
                        onChangeText={setStateName}
                        leftIcon={<Ionicons name="map-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
                        inputContainerStyle={styles.formStyle}
                    />

                    <AppInput
                        placeholder="Pincode"
                        value={pincode}
                        onChangeText={setPincode}
                        keyboardType="numeric"
                        leftIcon={<Ionicons name="pin-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
                        inputContainerStyle={styles.formStyle}
                    />
                </View>

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                    <AppButton title="Save & Continue" onPress={handleSave} />
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    header: {
        width: "100%",
        paddingTop: 12,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: {
        flex: 1,
    },
    headerRightPlaceholder: {
        width: 40, // Match the visual width of the back button
    },
    subtitleContainer: {
        paddingHorizontal: 20,
        marginTop: -8,
        // marginBottom: 16,
    },
    subtitle: {
        fontSize: 15,
    },
    avatarContainer: {
        alignSelf: "center",
        position: "relative",
        marginTop: 10,
        marginBottom: 25,
    },
    avatarFrame: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#E2E8F0",
    },
    cameraBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 28,
        height: 28,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: Colors.white,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    form: {
        marginTop: 10,
    },
    inputIcon: {

        marginRight: 10,
    },
    buttonContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    formStyle: {
        height: 46,
        borderRadius: 8,
        marginTop: -8,
        backgroundColor: "#f8fafc"
    },
    dropdownFieldContainer: {
        position: "relative",
        width: "100%",
        zIndex: 10,
        marginBottom: 20
    },
    dropdownMenu: {
        position: "absolute",
        top: 38,
        left: 0,
        right: 0,
        marginHorizontal: 20,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 1000,
    },
    dropdownItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    dropdownItemText: {
        fontSize: 15,
        color: "#1E293B",
    },
    divider: {
        height: 1,
        backgroundColor: "#F1F5F9",
    }
});