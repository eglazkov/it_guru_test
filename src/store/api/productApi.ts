import {
  createApi,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { User } from "../../types/user";
import type { Product } from "../../types/product";
import type { RootState } from "../store";
import { cleanParams, toSearchParams } from "../../lib/utils";

type ProtuctsRequest = {};

export type ProtuctsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export interface PaginateProductsRequest {
  limit?: string;
  skip?: string;
  select?: string;
  sortBy?: string;
  order?: string;
}

export interface SearchProductsRequest {
  q?: string;
}

export type SearchProductsUniversalRequest = PaginateProductsRequest &
  SearchProductsRequest;

export const productApi = createApi({
  reducerPath: "protuctApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProtuctsResponse, void>({
      query: () => "/products",
      transformResponse: (response: ProtuctsResponse) => {
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
    paginateProducts: builder.query<ProtuctsResponse, PaginateProductsRequest>({
      query: (params) => ({
        url: "/products",
        params: cleanParams(params),
      }),
      transformResponse: (response: ProtuctsResponse) => {
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
    searchProducts: builder.query<ProtuctsResponse, SearchProductsRequest>({
      query: (params) => ({
        url: "/products/search",
        params: cleanParams(params),
      }),
      transformResponse: (response: ProtuctsResponse) => {
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
    searchProductsUniversal: builder.query<
      ProtuctsResponse,
      SearchProductsUniversalRequest
    >({
      queryFn: async (params, { signal }, _, baseQuery) => {
        let url: string;
        const searchParams = toSearchParams(params);
        if (params.q) {
          url = `/products/search?${searchParams}`;
        } else {
          url = `/products?${searchParams}`;
        }

        const response = await baseQuery({
          url,
          method: "GET",
        });
        if (response.error) {
          return { error: response.error as FetchBaseQueryError };
        }

        return {
          data: response.data as ProtuctsResponse,
        };
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  usePaginateProductsQuery,
  useLazySearchProductsQuery,
  useLazySearchProductsUniversalQuery,
} = productApi;
