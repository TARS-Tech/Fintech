import { configureStore, combineReducers, isPlainObject } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import kycReducer from "./slices/kycSlice";
import eligibilityReducer from "./slices/eligibilitySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  kyc: kycReducer,
  eligibility: eligibilityReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["kyc", "auth"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
