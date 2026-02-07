import { useEffect, useRef, useState, type FC } from "react";

import {
  FormattedAmount,
  InputSearch,
  LevelBars,
  Table,
} from "../../components";
import SettingsIcon from "../../assets/SettingsIcon.svg?react";
import MessageIcon from "../../assets/MessageIcon.svg?react";
import NotificationIcon from "../../assets/NotificationIcon.svg?react";
import LanguageIcon from "../../assets/LanguageIcon.svg?react";
import {
  useLazySearchProductsUniversalQuery,
  usePostProductMutation,
  usePutProductMutation,
  type SearchProductsUniversalRequest,
} from "../../store/api/productApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { getLevel } from "../../components/LevelBars";
import toast from "react-hot-toast";

interface ProductsPageProps {
  data: unknown;
}

const ProductsPage: FC<ProductsPageProps> = (props) => {
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
  const data = useSelector((state: RootState) => state.product);

  useEffect(() => {
    trigger(filterParams);
  }, [filterParams]);

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

  return (
    <div className="mt-20 mb-20 mr-30">
      <div className="bg-[#FFFFFF] px-25 py-30 rounded-[10px]">
        <div className="flex flex-row  h-full justify-between items-center">
          <h3 className="text-[24px] text=[#202020] font-bold">Товары</h3>
          <InputSearch
            className="w-1/2"
            placeholder="Найти"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="w-1 h-56 rounded-[8px] bg-[#C2C2C2]/50"></div>
          <div className="flex flex-row gap-30 items-center">
            <LanguageIcon className="cursor-pointer w-28 h-28" />
            <div className="relative w-28 h-28">
              <NotificationIcon className="cursor-pointer" />
              <div
                className="absolute grid place-items-center bg-[#797FE9] text-[14px] text-center text-[#FFFFFF]
              font-semibold align-middle w-26 h-26 rounded-[14px] top-0 right-0 translate-x-1/2 -translate-y-1/2"
              >
                <span>12</span>
              </div>
            </div>
            <MessageIcon className="cursor-pointer w-28 h-28" />
            <SettingsIcon className="cursor-pointer w-28 h-28" />
          </div>
        </div>
      </div>
      <Table
        id="productsTable"
        className="mt-30"
        title="Все позиции"
        noDataText="Нет данных"
        data={data?.products || []}
        editableFields={["title", "brand", "sku", "price"]}
        requiredFields={["title", "brand", "sku", "price"]}
        rowsCount={filterParams?.limit ? Number(filterParams?.limit) : 5}
        totalCount={data?.total || 0}
        isLoading={isFetching}
        isUpdate={isUpdateRow}
        onSort={({ direction, key }) => {
          setFilterParams((prev) => ({
            ...prev,
            order: direction,
            sortBy: key,
          }));
        }}
        currentPage={currentPage}
        onPagination={(page) => {
          setCurrentPage(page);
          setFilterParams((prev) => ({
            ...prev,
            skip: String(page > 1 ? (page - 1) * Number(prev.limit) : 0),
          }));
        }}
        onAddRow={(row) => {
          postProduct(row).then(() => {
            toast.success("Запись успешно добавлена!");
          });
        }}
        onEditRow={(row) => {
          return putProduct(row);
        }}
        onRefresh={() => {
          trigger(filterParams);
        }}
        columns={[
          {
            minWidth: 200,
            title: "Наименование",
            key: "title",
            renderCol: (value, row) => (
              <div className="flex items-center gap-10 min-w-0">
                <div className="w-48 h-48 bg-[#C4C4C4] rounded-[8px] flex-none">
                  <img
                    src={row.thumbnail}
                    alt="Фото"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="flex flex-col gap-10 min-w-0 flex-1">
                  <div className="truncate min-w-0">{value}</div>
                  <div className="text-[#B2B3B9] truncate min-w-0">
                    {row.category}
                  </div>
                </div>
              </div>
            ),
          },
          {
            minWidth: 130,
            title: "Вендор",
            key: "brand",
            align: "center",
            renderCol: (value) => (
              <div className="truncate font-bold">{value}</div>
            ),
          },
          { minWidth: 130, title: "Артикул", key: "sku", align: "center" },
          {
            minWidth: 130,
            title: "Оценка",
            key: "rating",
            align: "center",
            renderCol: (value) => (
              <div>
                <span
                  className={value && Number(value) < 3 ? "text-[#F11010]" : ""}
                >
                  {value}
                </span>
                <span>/5</span>
              </div>
            ),
          },
          {
            minWidth: 130,
            title: "Цена, ₽",
            key: "price",
            align: "center",
            renderCol: (value) => <FormattedAmount amount={value} />,
          },
          {
            minWidth: 130,
            title: "Количество",
            key: "minimumOrderQuantity",
            align: "center",
            renderCol: (value) =>
              value ? <LevelBars level={getLevel(value)} /> : value,
          },
        ]}
      />
    </div>
  );
};

export default ProductsPage;
