"use client";
import ActionGroup from '@/components/molecules/Action';
import TablePaginationControls from '@/components/molecules/Pagination';
import TableHeader from '@/components/molecules/TableHeader';
import CustomTable from '@/components/organism/Table';
import { useAppDispatch } from '@/hooks/hook';
import { PATH } from '@/routes/PATH';
import { useDeletePageByIdMutation, useGetAllPageQuery } from '@/services/pageApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { PageRequestProps } from '@/types/page';
import { formatDateTime } from '@/utils/formatDateTime';
import { Checkbox } from '@mui/material';
import { ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import React from 'react';

export default function GeneralPageLiting() {
    const dispatch = useAppDispatch();
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 10,
    });
    const [customRange, setCustomRange] = React.useState({ startDate: "", endDate: "" });

    const { data, isLoading: loadingPages } = useGetAllPageQuery({
        pageIndex: qp.pageIndex,
        pageSize: qp.pageSize,
        search: search || "",
        start_date: customRange.startDate || undefined,
        end_date: customRange.endDate || undefined,
    });
    const [deletePage] = useDeletePageByIdMutation();

    const filteredData = useMemo(() => data?.data?.data || [], [data]);

    const columns = useMemo<ColumnDef<PageRequestProps>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    indeterminate={
                        table.getIsSomePageRowsSelected() &&
                        !table.getIsAllPageRowsSelected()
                    }
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            size: 50
        },
        {
            accessorKey: 'id',
            header: '#ID',
            cell: ({ row }) => row.original.id
        },
        {
            accessorKey: "name",
            header: "Title",
            cell: ({ row }) => (
                <strong className="text-primary block text-[12px] leading-[120%] font-[500] capitalize">
                    {row.original.name}
                </strong>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <span className="text-[12px] font-[500] max-w-[380px]">{row.original.description}</span>
            )
        },
        {
            accessorKey: 'registeredDate',
            header: 'Registered Date',
            cell: ({ row }) => {
                const { date } = formatDateTime(row.original.date)
                return (
                    <span className="text-[12px] font-[500] max-w-[380px]">{date}</span>
                )
            }
        },
        {
            id: 'action',
            header: 'Action',
            cell: ({ row }) => (
                <ActionGroup
                    // onView={`${PATH.ADMIN.PAGES.ROOT}/${row.original.id}`}
                    onEdit={`${PATH.ADMIN.PAGES.EDIT_PAGE.ROOT}/${row.original.id}`}
                    onDelete={async () => {
                        const response = await deletePage({ id: row.original.id || "" }).unwrap();
                        dispatch(
                            showToast({
                                message: response.message,
                                variant: ToastVariant.SUCCESS
                            })
                        )
                    }}
                />
            ),
        },
    ], []);

    const table = useReactTable({
        data: filteredData || [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
    })

    return (
        <section className="genral__page__lisiting">
            <div className="border-gray border-solid border-[1px] rounded-[8px] lg:rounded-[16px]">
                <TableHeader
                    search={search}
                    setSearch={setSearch}
                    customRange={customRange}
                    setCustomRange={setCustomRange}
                />
                <CustomTable
                    table={table}
                    loading={loadingPages}
                />
                {(data?.data?.pagination?.total_pages ?? 1) > 1 && (
                    <TablePaginationControls
                        qp={qp}
                        setQp={setQp}
                        totalPages={data?.data?.pagination?.total_pages || 1}
                    />
                )}
            </div>
        </section>
    )
}
