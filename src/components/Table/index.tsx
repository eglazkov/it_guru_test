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
interface TableProps<T extends Record<string, any>> {
  id: string;
  title: string;
  className?: string;
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  rowsCount: number;
  totalCount: number;
  currentPage: number;
  onSort?: (params: { sortBy: string; order: string }) => void;
  onPagination?: (page: number) => void;
}

interface Column<T extends Record<string, any>> {
  key: keyof T & string;
  title: string;
  minWidth?: number;
  maxWidth?: number;
  renderCol?: (value: string, row: T) => ReactNode;
}

interface SortState<T> {
  key: keyof T;
  direction: "asc" | "desc" | undefined;
}

const Table = <T extends Record<string, any>>({
  id,
  title,
  className,
  columns,
  data,
  isLoading = false,
  rowsCount,
  currentPage,
  totalCount,
  onSort,
  onPagination,
}: TableProps<T>) => {
  type Key = Column<T>["key"];

  const [sort, setSort] = useState<SortState<T>>({
    key: "",
    direction: undefined,
  });
  const [widths, setWidths] = useState<Record<Key, number>>(() => {
    let initial = {} as Record<Key, number>;
    const persistedWidths = JSON.parse(
      localStorage.getItem(`table-${id}`) || "{}",
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
      setSelectedRows(new Set(data.map((row) => row.id)));
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
    const allSelected = selectedRows.size === data.length;
    const someSelected =
      selectedRows.size > 0 && selectedRows.size < data.length;

    setSelectAll(allSelected);
    const checkbox = selectAllRef.current as HTMLInputElement;
    if (checkbox) {
      checkbox.indeterminate = someSelected;
    }
  }, [selectedRows, data.length]);

  const isRowSelected = (rowId: string) => selectedRows.has(rowId);

  const sortedData = useMemo(() => {
    if (onSort) {
      return data;
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
  }, [data, sort, rowsCount, currentPage]);

  const handleSort = useCallback(
    (key: keyof T) => {
      let direction = "asc";
      if (sort.key === key) {
        direction = sort.direction === "asc" ? "desc" : "asc";
        setSort({
          key: key as string,
          direction: sort.direction === "asc" ? "desc" : "asc",
        });
      } else {
        setSort({ key: key as string, direction: "asc" });
      }
      onSort?.({
        sortBy: String(key),
        order: direction,
      });
    },
    [currentPage, sort],
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
        localStorage.setItem(`table-${id}`, JSON.stringify(widths));
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

  return (
    <div
      className={cn(
        "bg-[#FFFFFF] rounded-[12px] p-30 flex flex-col gap-40 relative",
        className,
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <h4 className="text-[20px] text-[#202020] font-bold">{title}</h4>
      </div>
      {showProgress && (
        <div className="absolute top-80 w-fill pr-30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
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
      <div className="overflow-x-auto w-full">
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
                      className="flex flex-row pr-4 cursor-pointer select-none"
                      onClick={() => handleSort(column.key)}
                    >
                      <div>{column.title}</div>
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
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"
                      >
                        <div className="w-1 mx-auto h-full bg-[#B2B3B9]"></div>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-[#E2E2E2] [&>tr:first-child]:border-t-1 last:border-b border-[#E2E2E2]">
            {sortedData.map((row, rowIndex) => {
              const isSelected = isRowSelected(row.id);
              return (
                <tr
                  key={rowIndex}
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
                        handleRowSelect(row.id, e.target.checked)
                      }
                      className="w-22 h-22 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                  {columns.map((column) => (
                    <td
                      style={{ width: widths[column.key] }}
                      key={column.key}
                      className="px-18 py-18 text-16 font-medium text-[#000000] truncate"
                    >
                      {column.renderCol
                        ? column.renderCol(String(row[column.key]), row)
                        : String(row[column.key])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
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
