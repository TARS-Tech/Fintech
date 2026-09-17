import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  hydrated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.profile = action.payload.profile;
    },

    setUserHydrated(state, action) {
      state.hydrated = action.payload;
    },


    clearUser(state) {
      state.profile = null;
      state.hydrated = false;
    },
  },
});

export const { setUser, setUserHydrated, setLoading, clearUser } = userSlice.actions;
export default userSlice.reducer;
