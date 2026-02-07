import { useMemo, type FC } from "react";
import { cn } from "../../lib/utils";
import LeftIcon from "../../assets/LeftIcon.svg?react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  totalCount: number;
  startPage: number;
  endPage: number;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  totalCount,
  startPage,
  endPage,
}) => {
  const visiblePages = useMemo(() => {
    const delta = 2;
    const range = [];
    range.push(1);
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (totalPages > 1) range.push(totalPages);

    return range.filter((page, index, array) => array.indexOf(page) === index);
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const showLeftEllipsis =
    visiblePages.length > 1 && visiblePages[1] - visiblePages[0] > 1;
  const showRightEllipsis =
    visiblePages.length > 1 &&
    visiblePages[visiblePages.length - 1] -
      visiblePages[visiblePages.length - 2] >
      1;

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-[18px] text-[#969B9F]">
        Показано{" "}
        <span className="text-[#333333]">{`${startPage}-${endPage}`}</span> из{" "}
        <span className="text-[#333333]">{totalCount}</span>
      </div>
      <div className={`flex items-center gap-1 ${className}`}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "px-3 py-2 pr-16 text-sm font-medium rounded-md transition-colors",
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <LeftIcon />
        </button>

        <div className="flex flex-row gap-8">
          <button
            onClick={() => onPageChange(visiblePages[0])}
            className={cn(
              "w-30 h-30 text-[14px] rounded-[4px] transition-colors",
              currentPage === visiblePages[0]
                ? "bg-[#797FEA] text-white shadow-sm"
                : "text-[#B2B3B9] border border-[#ECECEB] hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            {visiblePages[0]}
          </button>
          {showLeftEllipsis && (
            <span className="px-2 py-2 text-sm text-gray-500 flex items-center">
              ...
            </span>
          )}
          {visiblePages.slice(1, -1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                "w-30 h-30 text-[14px] rounded-[4px] transition-colors",
                currentPage === page
                  ? "bg-[#797FEA] text-white shadow-sm"
                  : "text-[#B2B3B9] border border-[#ECECEB] hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              {page}
            </button>
          ))}
          {showRightEllipsis && (
            <span className="px-2 py-2 text-sm text-gray-500 flex items-center">
              ...
            </span>
          )}
          {visiblePages.length > 1 && (
            <button
              onClick={() =>
                onPageChange(visiblePages[visiblePages.length - 1])
              }
              className={cn(
                "w-30 h-30 text-[14px] rounded-[4px] transition-colors",
                currentPage === visiblePages[visiblePages.length - 1]
                  ? "bg-[#797FEA] text-white shadow-sm"
                  : "text-[#B2B3B9] border border-[#ECECEB] hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              {visiblePages[visiblePages.length - 1]}
            </button>
          )}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "px-3 py-2 pl-16 text-sm font-medium rounded-md transition-colors",
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <LeftIcon className="rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
