import { SearchParams } from "@/types/searchParams";
import React from "react";

interface PaginationProps {
  data: SearchParams;
  setData: React.Dispatch<React.SetStateAction<SearchParams>>;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ data, setData, totalPages }) => {
  return (
    <div className="flex justify-center mt-18 gap-3 items-center">
      <button
        disabled={data.page === 1}
        onClick={() => setData((prev) => ({ ...prev, page: prev.page - 1 }))}
        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50 cursor-pointer"
      >
        Prev
      </button>

      <span className="text-sm px-3 py-2">
        Page {data.page} of {totalPages}
      </span>

      <button
        disabled={data.page === totalPages}
        onClick={() => setData((prev) => ({ ...prev, page: prev.page + 1 }))}
        className="px-4 py-2 rounded-md bg-[#250040] text-white disabled:opacity-50 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
