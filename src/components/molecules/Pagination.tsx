"use client";

import { Pagination as MuiPagination } from "@mui/material";
export type QueryParams = {
    pageIndex: number;
    pageSize: number;
}
type Props = {
    qp: QueryParams;
    setQp: (qp: QueryParams) => void;
    totalPages: number;
};

export default function TablePaginationControls({
    qp,
    setQp,
    totalPages,
}: Props) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 px-8 py-6 gap-4">
            <div>
                <span>Row per page:</span>
                <select
                    value={qp.pageSize}
                    onChange={(e) => setQp({ ...qp, pageSize: Number(e.target.value) })}
                    className="ml-2 border border-gray-300 rounded p-1"
                >
                    {[10, 15, 20, 50, 100].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <MuiPagination
                count={totalPages || 1}
                page={qp.pageIndex}
                onChange={(_, value) => setQp({ ...qp, pageIndex: value })}
                variant="outlined"
                shape="rounded"
                sx={{ gap: "8px" }}
            />
        </div>
    );
}