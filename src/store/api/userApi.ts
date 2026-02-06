import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../types/user";

type AuthRequest = {
  credentials: {
    username: string;
    password: string;
    expiresInMins?: number;
  };
  rememberme: boolean;
};

type AuthResponse = User;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com/",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }),
  endpoints: (builder) => ({
    authUser: builder.mutation<AuthResponse, AuthRequest>({
      query: ({ credentials }) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: AuthResponse) => {
        if (typeof response === "string") {
          try {
            return JSON.parse(response);
          } catch (e) {
            throw new Error(`Failed to parse response: ${e}`);
          }
        } else {
          return response;
        }
      },
    }),
  }),
});

export const { useAuthUserMutation } = userApi;
