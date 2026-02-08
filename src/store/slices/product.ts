import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  productApi,
  type ProductsCategoriesResponse,
  type ProductsResponse,
} from "../api/productApi";

type InitialState = ProductsResponse & {
  productCategories: ProductsCategoriesResponse;
};

const initialState: InitialState = {
  products: [],
  productCategories: [],
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
        productApi.endpoints.searchProductsUniversal.matchFulfilled,
        // productApi.endpoints.paginateProducts.matchFulfilled,
      ),
      (state, { payload }) => {
        state.products = payload.products;
        state.skip = payload.skip;
        state.limit = payload.limit;
        state.total = payload.total;
      },
    );
    builder.addMatcher(
      // подкладываем ответ от создания продукта, т.к. в базу данных API не добавляет
      productApi.endpoints.postProduct.matchFulfilled,
      (state, { payload }) => {
        state.products.pop();
        state.products.unshift(payload);
      },
    );
    builder.addMatcher(
      // модифицируем данные продукта, т.к. в базе данных API не обновляет
      productApi.endpoints.putProduct.matchFulfilled,
      (state, { payload }) => {
        state.products = state.products.map((product) => {
          return product.id === payload.id ? payload : product;
        });
      },
    );
    builder.addMatcher(
      productApi.endpoints.getProductsCategories.matchFulfilled,
      (state, { payload }) => {
        state.productCategories = payload;
      },
    );
  },
});

const productReducer = productSlice.reducer;

export default productReducer;
