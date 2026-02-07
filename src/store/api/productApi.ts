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

export type ProductsResponse = {
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
      const accessToken = (getState() as RootState).auth.accessToken;

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, void>({
      query: () => "/products",
      transformResponse: (response: ProductsResponse) => {
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
    paginateProducts: builder.query<ProductsResponse, PaginateProductsRequest>({
      query: (params) => ({
        url: "/products",
        params: cleanParams(params),
      }),
      transformResponse: (response: ProductsResponse) => {
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
    searchProducts: builder.query<ProductsResponse, SearchProductsRequest>({
      query: (params) => ({
        url: "/products/search",
        params: cleanParams(params),
      }),
      transformResponse: (response: ProductsResponse) => {
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
      ProductsResponse,
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

        try {
          const response = await baseQuery({
            url,
            method: "GET",
          });
          return {
            data: response.data as ProductsResponse,
          };
        } catch (error) {
          return { error: error as FetchBaseQueryError };
        }
      },
    }),
    postProduct: builder.mutation<Product, Product>({
      query: (product) => ({
        url: "/products/add",
        method: "POST",
        body: JSON.stringify(product),
      }),
      transformResponse: (response: Product) => {
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
    putProduct: builder.mutation<Product, Product>({
      query: (product) => ({
        url: `/products/${product.id}`,
        method: "PUT",
        body: JSON.stringify({
          ...product,
          // почему то API принимает на вход id в виде строки, хотя в ответах это число
          id: String(product.id),
        }),
      }),
      transformResponse: (response: Product) => {
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

export const {
  useGetProductsQuery,
  usePaginateProductsQuery,
  useLazySearchProductsQuery,
  useLazySearchProductsUniversalQuery,
  usePostProductMutation,
  usePutProductMutation,
} = productApi;
