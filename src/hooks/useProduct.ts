import { useCallback, useEffect, useState } from "react";
import {
  useLazyGetProductsCategoriesQuery,
  useLazySearchProductsUniversalQuery,
  usePostProductMutation,
  usePutProductMutation,
  type SearchProductsUniversalRequest,
} from "../store/api/productApi";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { Product } from "../types/product";
import type {
  OnAddRowCallback,
  OnEditRowCallback,
  OnPaginationCallback,
  OnRefreshCallback,
  OnSortCallback,
  OnFilterCallback,
  OnClearCallback,
  FilterFieldItem,
  FilterItems,
} from "../components/Table";
import toast from "react-hot-toast";
import { debounceFn } from "../lib/utils";
import { nanoid } from "@reduxjs/toolkit";

export interface ProductData<T = Product> {
  searchValue?: string;
  products: Product[];
  filterParams: SearchProductsUniversalRequest;
  total: number;
  isFetching: boolean;
  isUpdateRow: boolean;
  currentPage: number;
  filterFields: FilterFieldItem<T>[];
  filterItems: FilterItems<T>;
  onSearchValueChange: (value: string) => void;
  onSort?: OnSortCallback<T>;
  onPagination?: OnPaginationCallback;
  onAddRow?: OnAddRowCallback<T>;
  onEditRow?: OnEditRowCallback<T>;
  onRefresh?: OnRefreshCallback;
  onFilter?: OnFilterCallback;
  onClear?: OnClearCallback;
}

export const useProduct = (): ProductData<Product> => {
  const [searchValue, setSearchValue] = useState<string>("");
  // TODO: держадть параметры в слайсе + persisted/ setings table (width)
  const [filterParams, setFilterParams] =
    useState<SearchProductsUniversalRequest>({
      q: "",
      limit: "5",
      skip: "0",
    });
  const [currentPage, setCurrentPage] = useState(1);

  const [trigger, { isFetching }] = useLazySearchProductsUniversalQuery();
  const [getProductCategories] = useLazyGetProductsCategoriesQuery();

  const [postProduct] = usePostProductMutation();
  const [putProduct, { isLoading: isUpdateRow }] = usePutProductMutation();
  const { products, total, productCategories } = useSelector(
    (state: RootState) => state.product,
  );

  useEffect(() => {
    trigger(filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams]);

  useEffect(() => {
    getProductCategories();
  }, []);

  const debouncedSearch = useCallback(
    debounceFn((value) => {
      if (value) {
        setCurrentPage(1);
        setFilterParams(({ limit }) => ({
          q: value as string,
          limit,
          skip: "0",
        }));
      }
    }, 400),
    [setCurrentPage, setFilterParams],
  );

  const onSearchValueChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      debouncedSearch(value);
    },
    [setSearchValue, debouncedSearch],
  );

  return {
    searchValue,
    products,
    filterParams,
    total,
    isFetching,
    isUpdateRow,
    currentPage,
    filterFields: [{ id: nanoid(), value: "category", title: "Категория" }],
    filterItems: {
      category: productCategories?.map((category) => ({
        id: category.slug,
        value: category.slug,
        title: category.name,
      })),
    },
    onSearchValueChange,
    onSort: ({ direction, key }) => {
      setFilterParams((prev) => ({
        ...prev,
        order: direction,
        sortBy: key as string,
      }));
    },
    onPagination: (page) => {
      setCurrentPage(page);
      setFilterParams((prev) => ({
        ...prev,
        skip: String(page > 1 ? (page - 1) * Number(prev.limit) : 0),
      }));
    },
    onAddRow: (row) => {
      postProduct(row).then(() => {
        toast.success("Запись успешно добавлена!");
      });
    },
    onEditRow: (row) => {
      return putProduct(row).then(() => {
        toast.success("Запись успешно изменена!");
      });
    },
    onRefresh: () => {
      trigger(filterParams);
    },
    onFilter: ({ value, filterField }) => {
      if (searchValue) {
        setSearchValue("");
      }
      if (!value) {
        setFilterParams({ q: "", limit: "5", skip: "0" });
        return;
      }
      setFilterParams((prev) => ({
        ...prev,
        q: "",
        skip: "0",
        [filterField]: value,
      }));
    },
    onClear: () => {
      setFilterParams({ q: "", limit: "5", skip: "0" });
    },
  };
};
