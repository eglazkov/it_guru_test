import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import type { User } from "../../types/user";

interface InitialState {
  user: User | null;
  token: string | null;
}

const initialState: InitialState = {
  user: null,
  token:
    localStorage.getItem("token") || sessionStorage.getItem("token") || null,
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
        state.token = payload.accessToken;
      },
    );
  },
});

const authReducer = authSlice.reducer;

export default authReducer;
