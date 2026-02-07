import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "../../lib/utils";
import Pagination from "../Pagination";
import useServerProgress from "../../hooks/useRequestProgress";
import Button from "../Button";
import PlusIcon from "../../assets/PlusIcon.svg?react";
import FiltersIcon from "../../assets/FiltersIcon.svg?react";
import ArrowsClockwiseIcon from "../../assets/ArrowsClockwiseIcon.svg?react";
import PlusSingIcon from "../../assets/PlusSingIcon.svg?react";
import DotsThreeCircleIcon from "../../assets/DotsThreeCircleIcon.svg?react";
import AddRow from "../AddRow";

export type OnSortCallback<T> = (params: SortState<T>) => void;
export type OnPaginationCallback = (page: number) => void;
export type OnAddRowCallback<T> = (row: T) => void;
export type OnEditRowCallback<T> = (row: T) => Promise<unknown>;
export type OnRefreshCallback = () => void;

interface TableProps<T> {
  id: string;
  title: string;
  noDataText?: string;
  className?: string;
  data: T[];
  editableFields: (keyof T & string)[];
  requiredFields: (keyof T & string)[];
  columns: Column<T>[];
  isLoading?: boolean;
  isUpdate?: boolean;
  rowsCount: number;
  totalCount: number;
  currentPage: number;
  onSort?: OnSortCallback<T>;
  onPagination?: OnPaginationCallback;
  onAddRow?: OnAddRowCallback<T>;
  onEditRow?: OnEditRowCallback<T>;
  onRefresh?: OnRefreshCallback;
}

interface Column<T> {
  key: keyof T & string;
  title: string;
  minWidth?: number;
  maxWidth?: number;
  renderCol?: (value: string, row: T) => ReactNode;
  align?: "center" | "start" | "end";
}

export interface SortState<T> {
  key: keyof T;
  direction: "asc" | "desc" | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Table = <T extends Record<string, any>>({
  id,
  title,
  noDataText = "-",
  className,
  columns,
  data,
  editableFields = [],
  requiredFields = [],
  isLoading = false,
  isUpdate = false,
  rowsCount,
  currentPage,
  totalCount,
  onSort,
  onPagination,
  onAddRow,
  onEditRow,
  onRefresh,
}: TableProps<T>) => {
  type Key = Column<T>["key"];

  const [sort, setSort] = useState<SortState<T>>({
    key: "",
    direction: undefined,
  });
  const [widths, setWidths] = useState<Record<Key, number>>(() => {
    let initial = {} as Record<Key, number>;

    const persistedWidths = JSON.parse(
      localStorage.getItem(`table-${id}-widths`) || "{}",
    );
    if (Object.keys(persistedWidths).length > 0) {
      initial = persistedWidths;
    } else {
      columns.forEach((col) => {
        initial[col.key] = col.minWidth ?? 120;
      });
    }
    return initial;
  });

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);
  const [editRowId, setEditRowId] = useState<number | undefined>(undefined);
  // const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / rowsCount);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const start = useMemo(
    () => (currentPage - 1) * rowsCount + 1,
    [currentPage, rowsCount],
  );
  const end = useMemo(
    () => Math.min(currentPage * rowsCount, totalCount),
    [currentPage, rowsCount, totalCount],
  );
  const { progress, showProgress } = useServerProgress(isLoading);

  const handlePageChange = (page: number) => {
    onPagination?.(page);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(new Set(data.map((row) => row.id) as string[]));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleRowSelect = (rowId: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(rowId);
      } else {
        newSet.delete(rowId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const persistedSort = JSON.parse(
      localStorage.getItem(`table-${id}-sort`) || "{}",
    ) as SortState<T>;

    if (Object.keys(persistedSort).length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSort(persistedSort);
      onSort?.(persistedSort);
    }
  }, [id]);

  useEffect(() => {
    const allSelected = selectedRows.size === data.length;
    const someSelected =
      selectedRows.size > 0 && selectedRows.size < data.length;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectAll(allSelected);
    const checkbox = selectAllRef.current as HTMLInputElement;
    if (checkbox) {
      checkbox.indeterminate = someSelected;
    }
  }, [selectedRows, data.length]);

  const isRowSelected = (rowId: string) => selectedRows.has(rowId);

  const sortedData: T[] = useMemo(() => {
    if (onSort) {
      return [...data];
    }
    if (!sort.key) {
      const startIndex = (currentPage - 1) * rowsCount;
      return data.slice(startIndex, startIndex + rowsCount);
    }

    return [...data]
      .sort((a, b) => {
        const aValue = a[sort.key as keyof T];
        const bValue = b[sort.key as keyof T];

        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();

        if (aStr < bStr) {
          return sort.direction === "asc" ? -1 : 1;
        }
        if (aStr > bStr) {
          return sort.direction === "asc" ? 1 : -1;
        }
        return 0;
      })
      .slice((currentPage - 1) * rowsCount, currentPage * rowsCount);
  }, [data, sort, rowsCount, currentPage, showAddRow, columns]);

  const handleSort = useCallback(
    (key: keyof T) => {
      let direction: "asc" | "desc" | undefined = undefined;
      let orderBy: string = "";
      if (sort.key === key) {
        direction =
          sort.direction === "desc"
            ? undefined
            : sort.direction === "asc"
              ? "desc"
              : "asc";
        orderBy = direction ? (key as string) : "";
        setSort({
          key: orderBy,
          direction,
        });
      } else {
        direction = "asc";
        orderBy = String(key);
        setSort({ key: orderBy, direction });
      }
      if (direction) {
        localStorage.setItem(
          `table-${id}-sort`,
          JSON.stringify({
            key: orderBy,
            direction,
          }),
        );
      } else {
        localStorage.removeItem(`table-${id}-sort`);
      }
      onSort?.({
        key: orderBy,
        direction,
      });
    },
    [sort, id],
  );

  const startResize = (key: Key, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = widths[key];

    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;

      setWidths((prev) => {
        const col = columns.find((c) => c.key === key)!;
        const min = col?.minWidth ?? 60;
        const max = col?.maxWidth ?? 600;
        const next = Math.min(max, Math.max(min, startWidth + delta));
        const widths = { ...prev, [key]: next };
        localStorage.setItem(`table-${id}-widths`, JSON.stringify(widths));
        return widths;
      });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const addRow = () => {
    setShowAddRow(true);
  };
  const editRow = (id: number) => {
    setEditRowId(id);
  };

  return (
    <div
      className={cn(
        "bg-[#FFFFFF] rounded-[12px] p-30 mob:px-16 flex flex-col gap-40 mob:gap-20 relative",
        className,
      )}
    >
      <div className="flex flex-row justify-between items-center mob:flex-col mob:items-start">
        <h4 className="text-[20px] text-[#202020] font-bold">{title}</h4>
        {(onRefresh || onAddRow) && (
          <div className="flex flex-row gap-8 mob:self-end mob:mt-10">
            {onRefresh && (
              <Button
                className="w-fit py-16 px-20 mob:px-10 mob:py-8"
                kind="outlined"
                onClick={onRefresh}
              >
                <ArrowsClockwiseIcon />
              </Button>
            )}
            <Button
              className="w-fit py-16 px-20 mob:px-10 mob:py-8"
              kind="outlined"
            >
              <FiltersIcon />
            </Button>
            {onAddRow && (
              <Button
                className="w-fit py-16 px-20 mob:px-10 mob:py-8"
                onClick={addRow}
              >
                <div className="flex flex-row gap-15 items-center">
                  <PlusIcon className="fill-[#FFFFFF]" />
                  Добавить
                </div>
              </Button>
            )}
          </div>
        )}
      </div>
      {showProgress && (
        <div className="absolute top-110 mob:top-116 w-fill pr-30 mob:pr-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[18px] mob:text[16px] font-medium text-gray-700">
              Загружаем данные...
            </span>
            <span className="text-sm font-medium text-gray-900">
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-md transition-all duration-200 ease-linear"
              style={{ width: `${progress.toFixed(0)}%` }}
            />
          </div>
        </div>
      )}
      <div
        className={cn(
          "overflow-x-auto w-full",
          isLoading && "opacity-60 pointer-events-none animate-pulse",
        )}
      >
        {!sortedData?.length ? (
          <div className="grid place-items-center my-40 mx-auto text-[20px] font-bold">
            {noDataText}
          </div>
        ) : (
          <table id={id} className="table-fixed border-collapse w-fill">
            <thead>
              <tr className="group align-middle text-left">
                <th className="w-40 pl-18">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-22 h-22 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </th>
                {columns.map((column, columnIndex) => {
                  const isSorted = sort.key === column.key;
                  const isLastColumn = columnIndex === columns.length - 1;
                  return (
                    <th
                      key={column.key}
                      style={{ width: widths[column.key] }}
                      className="relative py-31 px-[18px] text-left text-[#B2B3B9] text-[16px] font-bold tracking-wider"
                    >
                      <div
                        className={cn(
                          "flex flex-row gap-4 pr-4 cursor-pointer select-none",
                          column.align === "center" && "justify-center",
                          column.align === "start" && "justify-start",
                          column.align === "end" && "justify-end",
                        )}
                        onClick={() => handleSort(column.key)}
                      >
                        <div className="text-center">{column.title}</div>
                        <span>
                          {isSorted
                            ? sort.direction === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </div>
                      {!isLastColumn && (
                        <div
                          onMouseDown={(e) => {
                            startResize(column.key, e);
                          }}
                          className="absolute top-[40%] right-0 w-4 h-1/4 cursor-col-resize
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible mob:opacity-0 transition-all duration-200 z-10"
                        >
                          <div className="w-1 mx-auto h-full bg-[#B2B3B9]"></div>
                        </div>
                      )}
                    </th>
                  );
                })}
                <th className="w-150"></th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-[#E2E2E2] [&>tr:first-child]:border-t-1 last:border-b border-[#E2E2E2]">
              {showAddRow && (
                <AddRow
                  columns={columns}
                  requiredFields={requiredFields}
                  widths={widths}
                  onCancel={() => {
                    setShowAddRow(false);
                  }}
                  onAdd={(row) => {
                    onAddRow?.(row as T);
                    setShowAddRow(false);
                  }}
                />
              )}
              {(showAddRow ? sortedData.slice(1, rowsCount) : sortedData).map(
                (row) => {
                  const isSelected = isRowSelected(row.id as string);
                  return editRowId === row.id ? (
                    <AddRow
                      key={row.id}
                      editRowData={row}
                      columns={columns}
                      editableFields={editableFields}
                      requiredFields={requiredFields}
                      isLoading={isUpdate}
                      widths={widths}
                      onCancel={() => {
                        setEditRowId(undefined);
                      }}
                      onAdd={(row) => {
                        onEditRow?.(row as T).then(() => {
                          setEditRowId(undefined);
                        });
                      }}
                    />
                  ) : (
                    <tr
                      key={row.id}
                      className="align-middle hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td
                        className={cn(
                          "relative w-40 pl-18",
                          isSelected &&
                            "before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-[6px] before:bg-[#3C538E]",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleRowSelect(row.id as string, e.target.checked)
                          }
                          className="w-22 h-22 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                      {columns.map((column) => (
                        <td
                          style={{ width: widths[column.key] }}
                          key={column.key}
                          className={cn(
                            "px-18 py-18 text-16 font-medium text-[#000000] truncate",
                            column.align === "center" && "text-center",
                            column.align === "start" && "text-start",
                            column.align === "end" && "text-end",
                          )}
                        >
                          {column.renderCol
                            ? column.renderCol(
                                String(row[column.key] || noDataText),
                                row,
                              )
                            : String(row[column.key] || noDataText)}
                        </td>
                      ))}
                      <td className="w-150">
                        <div className="flex flex-row items-center gap-32 mr-8 justify-end">
                          {onEditRow && (
                            <button
                              className={cn(
                                "inline-flex items-center justify-center cursor-pointer bg-[#242EDB] text-white text-[28px] rounded-[23px] w-52 h-28 text-center",
                                "hover:bg-[#1E26C2] active:bg-[#191FB0] focus:ring-2 focus:ring-[#242EDB]/50 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl",
                              )}
                              onClick={() => editRow(row.id as number)}
                            >
                              <PlusSingIcon />
                            </button>
                          )}
                          <button className="inline-flex items-center justify-center cursor-pointer w-52">
                            <DotsThreeCircleIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        startPage={start}
        endPage={end}
      />
    </div>
  );
};

export default Table;
