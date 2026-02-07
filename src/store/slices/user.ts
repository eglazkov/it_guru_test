import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import type { User } from "../../types/user";

interface InitialState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: InitialState = {
  user: null,
  accessToken: null,
  refreshToken:
    localStorage.getItem("refreshToken") ||
    sessionStorage.getItem("refreshToken") ||
    null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.authUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
      },
    );
    builder.addMatcher(
      userApi.endpoints.refreshSession.matchFulfilled,
      (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
      },
    );
    builder.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.user = {
          ...payload,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        };
      },
    );
  },
});

const authReducer = authSlice.reducer;

export default authReducer;
