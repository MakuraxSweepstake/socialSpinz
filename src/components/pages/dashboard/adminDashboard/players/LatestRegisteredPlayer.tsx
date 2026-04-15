import CustomTable from '@/components/organism/Table';
import { useGetAllPlayerQuery } from '@/services/playerApi';
import { PlayerItem } from '@/types/player';
import { formatDateTime } from '@/utils/formatDateTime';
import { getInitials } from '@/utils/getInitials';
import { Box } from '@mui/material';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

export default function LatestRegisteredPlayer() {
    const [qp, _setQp] = useState({
        pageIndex: 1,
        pageSize: 10,
    });
    const { data, isLoading: loadingPlayer } = useGetAllPlayerQuery({
        pageIndex: qp.pageIndex,
        pageSize: qp.pageSize,
    });

    const columns = useMemo<ColumnDef<PlayerItem>[]>(() => [
        {
            accessorKey: 'id',
            header: '#ID',
            cell: ({ row }) => row.original.id
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const { first_name, last_name, name } = row.original;
                const initials = getInitials(first_name, last_name) || getInitials(row.original.name);

                return (
                    <Box className="flex justify-start items-center gap-2">
                        <small className="text-[10px] w-[24px] h-[24px] flex items-center justify-center uppercase rounded-[4px] bg-[#1EB41B]/10 font-[500] text-[#1EB41B]">
                            {initials}
                        </small>
                        <div className="name-detail">
                            <strong className="text-primary block text-[12px] leading-[120%] font-[500] capitalize">
                                {first_name} {last_name}
                            </strong>
                            <small className="text-[10px] text-para-light font-[500]">{name}</small>
                        </div>
                    </Box>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <span className="text-[12px] font-[500]">{row.original.email}</span>
            )
        },
        {
            accessorKey: 'registeredDate',
            header: 'Registered Date',
            cell: ({ row }) => {
                const { date, time } = formatDateTime(row.original.registered_date as string);
                return (
                    <Box>
                        <span className="text-[12px] font-[500] block">{date}</span>
                        <small className="text-[10px] text-para-light font-[500]">[{time}]</small>
                    </Box>

                )
            }
        },
    ], []);

    const filteredData = useMemo(() => data?.data?.data || [], [data]);

    const table = useReactTable({
        data: filteredData || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <CustomTable
            table={table}
            loading={loadingPlayer}
        />
    )
}
