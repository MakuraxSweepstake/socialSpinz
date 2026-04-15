"use client";

import ActionGroup from '@/components/molecules/Action';
import TablePaginationControls from '@/components/molecules/Pagination';
import TableHeader from '@/components/molecules/TableHeader';
import { useAppDispatch } from '@/hooks/hook';
import { PATH } from '@/routes/PATH';
import { useDeleteGameByIdMutation, useGetAllGamesQuery } from '@/services/gameApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { GameItem } from '@/types/game';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

function GameSkeleton() {
    return (
        <div className="bg-[#F4F6FC] p-4 lg:p-6 rounded-[16px] animate-pulse">
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-4"></div>
            <div className="flex justify-between items-center mb-6">
                <div className="w-[40%]">
                    <div className="h-3 w-1/2 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
                </div>
                <span className='h-[24px] w-[1px] bg-gray'></span>
                <div className="w-[40%]">
                    <div className="h-3 w-1/2 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
                </div>
            </div>
            <div className="h-3 w-1/3 bg-gray-300 rounded mb-4"></div>
            <div className="relative aspect-[300/256] rounded-[12px] overflow-hidden mb-4 bg-gray-300"></div>
            <div className="h-8 w-1/3 bg-gray-300 rounded-full"></div>
        </div>
    );
}

export default function AdminGameList() {
    const dispatch = useAppDispatch();
    const [search, setSearch] = useState("");
    const [qp, setQp] = useState({ pageIndex: 1, pageSize: 12 });
    const [customRange, setCustomRange] = React.useState({ startDate: "", endDate: "" });

    const { data, isLoading } = useGetAllGamesQuery({
        pageIndex: qp.pageIndex,
        pageSize: qp.pageSize,
        search: search || "",
        start_date: customRange.startDate || undefined,
        end_date: customRange.endDate || undefined,
    });

    const [deleteGame] = useDeleteGameByIdMutation();
    const totalPages = data?.data?.pagination?.total_pages || 1;

    return (
        <div className="admin__games">
            <div className="border-gray border-solid border-[1px] rounded-[8px] lg:rounded-[16px] mb-6">
                <TableHeader
                    search={search}
                    setSearch={setSearch}
                    customRange={customRange}
                    setCustomRange={setCustomRange}
                />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {isLoading &&
                    Array.from({ length: 8 }).map((_, idx) => <GameSkeleton key={idx} />)}

                {!isLoading &&
                    data?.data?.data?.map((game: GameItem) => (
                        <div
                            key={game.id}
                            className="admin__game__card bg-[#F4F6FC] p-4 lg:p-6 rounded-[16px]"
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="text-16 leading-[120%] font-bold mb-4">
                                    {game.name}
                                </h2>
                                <ActionGroup
                                    onEdit={`${PATH.ADMIN.GAMES.EDIT_GAME.ROOT}/${game?.id}`}
                                    onDelete={async () => {
                                        try {
                                            const response = await deleteGame({ id: game.id }).unwrap();
                                            dispatch(showToast({ variant: ToastVariant.SUCCESS, message: response?.message || "Game Deleted Successfully" }));
                                        } catch (e: any) {
                                            dispatch(showToast({ variant: ToastVariant.ERROR, message: e?.data?.message || "Unable to Delete Game" }));
                                        }
                                    }}
                                />
                            </div>

                            <ul className="flex justify-between items-center mb-6">
                                <li className="w-[40%]">
                                    <p className="mb-1 text-[14px] leading-[120%] text-para-light">Type</p>
                                    <strong className="text-[14px] leading-[120%] font-[500] text-title">{game.category || "N/A"}</strong>
                                </li>
                                <span className="h-[24px] w-[1px] bg-gray"></span>
                                <li className="w-[40%]">
                                    <p className="mb-1 text-[14px] leading-[120%] text-para-light">Provider</p>
                                    <strong className="text-[14px] leading-[120%] font-[500] text-title">{game.provider}</strong>
                                </li>
                            </ul>

                            {game.active_users && (
                                <strong className="text-bold block mb-4 text-[12px]">
                                    Active Players:{" "}
                                    <span className="bg-primary-light rounded-[20px] py-1 px-2">{game.active_users}</span>
                                </strong>
                            )}

                            <div className="admin_game_image relative aspect-[300/256] rounded-[12px] overflow-hidden mb-4">
                                <Image
                                    src={typeof game.thumbnail === "string" && game.thumbnail ? game.thumbnail : "/assets/images/fallback.png"}
                                    alt={game.name || "Game Thumbnail"}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <Link
                                href={`/games/${game.id}`}
                                className="ss-btn bg-primary-grad text-white max-w-fit"
                            >
                                Game Overview
                            </Link>
                        </div>
                    ))}
            </div>

            {totalPages > 1 && (
                <div className="border-gray border-solid border-[1px] rounded-[8px] lg:rounded-[16px] mt-6">
                    <TablePaginationControls
                        qp={qp}
                        setQp={setQp}
                        totalPages={totalPages}
                    />
                </div>
            )}
        </div>
    );
}
