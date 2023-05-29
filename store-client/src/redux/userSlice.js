import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    info: null,
    isFetching: false,
    error: false,
    errorCode: 0,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorCode = 0;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.errorCode = 0;
      state.info = action.payload;
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorCode = action.payload;
    },
    update: (state, action) => {
      state.info = action.payload.user;
    },
    clearUser: (state) => {
      state.info = null;
      state.isFetching = false;
      state.error = false;
      state.errorCode = 0;
    },
    setFavorites: (state, action) => {
      state.info.favorites = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  update,
  clearUser,
  setFavorites,
} = userSlice.actions;
export default userSlice.reducer;
