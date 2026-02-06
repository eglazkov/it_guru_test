import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { productApi, type ProtuctsResponse } from "../api/productApi";
import type { User } from "../../types/user";

type InitialState = ProtuctsResponse;

const initialState: InitialState = {
  products: [],
  limit: 0,
  skip: 0,
  total: 0,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        productApi.endpoints.getProducts.matchFulfilled,
        // productApi.endpoints.paginateProducts.matchFulfilled,
      ),
      (state, { payload }) => {
        state.products = payload.products;
        state.skip = payload.skip;
        state.limit = payload.limit;
        state.total = payload.total;
      },
    );
  },
});

const productReducer = productSlice.reducer;

export default productReducer;
