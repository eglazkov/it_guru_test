import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../types/user";

interface AuthRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com/",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // credentials: "include",
  }),
  endpoints: (builder) => ({
    authUser: builder.mutation<User, AuthRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: unknown) => {
        if (typeof response === "string") {
          try {
            return JSON.parse(response);
          } catch (e) {
            console.error("Failed to parse response:", e);
            return;
          }
        } else {
          return response as User;
        }
      },
    }),
  }),
});

export const { useAuthUserMutation } = userApi;
