import AsyncStorage from "@react-native-async-storage/async-storage";
// console.log("AsyncStorage =", AsyncStorage);
// export const saveTokens = async (access, refresh) => {
//   await AsyncStorage.multiSet(
//     [
//       ["accessToken", access],
//       ["refreshToken", refresh],
//     ]
//   );
// };

export const saveTokens = async (access, refresh) => {
  try {
    console.log("Saving Access Token...");

    await AsyncStorage.setItem("accessToken", access);

    console.log("Access Token Saved");

    await AsyncStorage.setItem("refreshToken", refresh);

    console.log("Refresh Token Saved");
  } catch (err) {
    console.log("SAVE TOKEN ERROR");
    console.log(err);
    console.log(err.message);
    throw err;
  }
};

export const getAccessToken = async () => {
  return await AsyncStorage.getItem("accessToken");
};

export const getRefreshToken = async () => {
  return await AsyncStorage.getItem("refreshToken");
};

export const removeTokens = async () => {
  AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
};
