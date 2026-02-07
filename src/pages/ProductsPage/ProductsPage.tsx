import { type FC } from "react";

import {
  CarouselImage,
  FormattedAmount,
  InputSearch,
  LevelBars,
  Table,
} from "../../components";
import SettingsIcon from "../../assets/SettingsIcon.svg?react";
import MessageIcon from "../../assets/MessageIcon.svg?react";
import NotificationIcon from "../../assets/NotificationIcon.svg?react";
import LanguageIcon from "../../assets/LanguageIcon.svg?react";
import type { ProductData } from "../../hooks/useProduct";
import type { Product } from "../../types/product";
import { getLevel } from "../../lib/utils";

interface ProductsPageProps {
  data: ProductData<Product>;
}

const ProductsPage: FC<ProductsPageProps> = ({ data }) => {
  return (
    <div className="mt-20 mb-20 mr-30 mob:mr-0">
      <div className="bg-[#FFFFFF] px-25 py-30 rounded-[10px]">
        <div className="flex flex-row mob:flex-col h-full justify-between items-center mob:items-start">
          <h3 className="text-[24px] text=[#202020] font-bold mob:text-start mob:relative">
            Товары
          </h3>
          <InputSearch
            className="w-1/2 mob:w-full mob:mt-20"
            placeholder="Найти"
            value={data.searchValue}
            onChange={(e) => data.onSearchValueChange(e.target.value)}
          />
          <div className="w-1 h-56 rounded-[8px] bg-[#C2C2C2]/50 mob:sr-only"></div>
          <div className="flex flex-row gap-30 items-center mob:self-end mob:absolute mob:mt-4">
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
        rowsCount={
          data.filterParams?.limit ? Number(data.filterParams?.limit) : 5
        }
        totalCount={data?.total || 0}
        isLoading={data.isFetching}
        isUpdate={data.isUpdateRow}
        onSort={data.onSort}
        currentPage={data.currentPage}
        onPagination={data.onPagination}
        onAddRow={data.onAddRow}
        onEditRow={data.onEditRow}
        onRefresh={data.onRefresh}
        columns={[
          {
            minWidth: 200,
            title: "Наименование",
            key: "title",
            renderCol: (value, row) => (
              <div className="flex items-center gap-10 min-w-0">
                <CarouselImage images={row.images} preview={row.thumbnail} />
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
