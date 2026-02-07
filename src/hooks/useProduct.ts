import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
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
} from "../components/Table";
import toast from "react-hot-toast";

export interface ProductData<T = Product> {
  searchValue: string;
  products: Product[];
  filterParams: SearchProductsUniversalRequest;
  total: number;
  isFetching: boolean;
  isUpdateRow: boolean;
  currentPage: number;
  onSearchValueChange: Dispatch<SetStateAction<string>>;
  onSort?: OnSortCallback<T>;
  onPagination?: OnPaginationCallback;
  onAddRow?: OnAddRowCallback<T>;
  onEditRow?: OnEditRowCallback<T>;
  onRefresh?: OnRefreshCallback;
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
  const isFirstRender = useRef(true);

  const [trigger, { isFetching }] = useLazySearchProductsUniversalQuery();
  const [postProduct] = usePostProductMutation();
  const [putProduct, { isLoading: isUpdateRow }] = usePutProductMutation();
  const { products, total } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    trigger(filterParams);
  }, [filterParams, trigger]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
    const handler = setTimeout(() => {
      if (searchValue) {
        setCurrentPage(1);
        setFilterParams(({ limit }) => ({
          q: searchValue,
          limit,
          skip: "0",
        }));
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue]);

  return {
    searchValue,
    products,
    filterParams,
    total,
    isFetching,
    isUpdateRow,
    currentPage,
    onSearchValueChange: setSearchValue,
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
  };
};
