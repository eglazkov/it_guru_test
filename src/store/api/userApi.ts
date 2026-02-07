import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../types/user";
import type { RootState } from "../store";

type AuthRequest = {
  credentials: {
    username: string;
    password: string;
    expiresInMins?: number;
  };
  rememberme: boolean;
};

type AuthResponse = User;

type GetUserResponse = Omit<User, "accessToken" | "refreshToken">;

type RefreshRequest = {
  refreshToken: string;
  expiresInMins?: number;
};

type RefreshResponse = {
  refreshToken: string;
  accessToken: string;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://dummyjson.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // вызывает cors ошибку с include, мб стоит вызывать через прокси
  credentials: "omit",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      const refreshToken = (api.getState() as RootState).auth.refreshToken;

      if (refreshToken) {
        const refreshResult = await api
          .dispatch(
            userApi.endpoints.refreshSession.initiate({
              refreshToken,
              expiresInMins: 30,
            }),
          )
          .unwrap();

        if (refreshResult) {
          result = await rawBaseQuery(args, api, extraOptions); // retry
        }
      }
    }

    return result;
  },
  tagTypes: ["UserData"],
  endpoints: (builder) => ({
    authUser: builder.mutation<AuthResponse, AuthRequest>({
      query: ({ credentials }) => ({
        url: "/auth/login",
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
    refreshSession: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
      transformResponse: (response: RefreshResponse) => {
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
      invalidatesTags: ["UserData"],
    }),
    getUser: builder.query<GetUserResponse, void>({
      query: () => "/auth/me",
      transformResponse: (response: GetUserResponse) => {
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
      providesTags: ["UserData"],
      extraOptions: { maxRetries: 1 },
    }),
  }),
});

export const {
  useAuthUserMutation,
  useRefreshSessionMutation,
  useLazyGetUserQuery,
} = userApi;
