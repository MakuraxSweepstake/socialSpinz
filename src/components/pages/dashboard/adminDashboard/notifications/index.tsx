"use client";

import PageHeader from '@/components/molecules/PageHeader';
import TablePaginationControls from '@/components/molecules/Pagination';
import { useAppDispatch } from '@/hooks/hook';
import { PATH } from '@/routes/PATH';
import {
    useGetAllNotificationQuery,
    useReadAllNotificationMutation,
    useReadNotificationMutation,
} from '@/services/notificationApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { NotificationProps } from '@/types/notification';
import { formatDateTime } from '@/utils/formatDateTime';
import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import React, { useState } from 'react';

export default function NotificationPageRoot() {
    const dispatch = useAppDispatch();
    const [qp, setQp] = useState({ pageIndex: 1, pageSize: 15 });

    const { data, isLoading } = useGetAllNotificationQuery({
        pageIndex: qp.pageIndex,
        pageSize: qp.pageSize,
    });

    const [readNotification] = useReadNotificationMutation();
    const [readAllNotification, { isLoading: readingAll }] = useReadAllNotificationMutation();

    const notifications: NotificationProps[] = data?.data?.data || [];
    const pagination = data?.data?.pagination;

    const handleRead = async (id: string) => {
        try {
            await readNotification({ id }).unwrap();
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Unable to mark as read", variant: ToastVariant.ERROR }));
        }
    };

    const handleReadAll = async () => {
        try {
            await readAllNotification().unwrap();
            dispatch(showToast({ message: "All notifications marked as read", variant: ToastVariant.SUCCESS }));
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Unable to mark all as read", variant: ToastVariant.ERROR }));
        }
    };

    const unreadCount = notifications.filter((n) => !n.has_read).length;

    return (
        <section>
            <PageHeader
                title="Notifications"
                cta={{
                    label: "Add New Notification",
                    url: PATH.ADMIN.NOTIFICATIONS.ADD_NOTIFICATIONS.ROOT,
                }}
            />

            <div className="border border-gray rounded-[16px]">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray">
                    <div className="flex items-center gap-3">
                        <Typography variant="h3" className="text-[16px] font-semibold">
                            All Notifications
                        </Typography>
                        {unreadCount > 0 && (
                            <Chip
                                label={`${unreadCount} unread`}
                                size="small"
                                color="success"
                                sx={{ fontSize: 11 }}
                            />
                        )}
                    </div>
                    <button
                        onClick={handleReadAll}
                        disabled={readingAll || unreadCount === 0}
                        className="text-[12px] text-primary hover:text-primary-dark font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {readingAll ? "Marking..." : "Mark All Read"}
                    </button>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <CircularProgress size={32} />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex justify-center items-center py-16">
                        <Typography variant="body2" color="text.secondary">
                            No notifications yet.
                        </Typography>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray">
                        {notifications.map((notification) => {
                            const { date, time } = formatDateTime(notification.created_at);
                            return (
                                <li
                                    key={notification.id}
                                    onClick={() => !notification.has_read && handleRead(notification.id)}
                                    className={`flex items-start justify-between gap-4 px-4 lg:px-6 py-4 transition-colors
                                        ${notification.has_read
                                            ? "cursor-default"
                                            : "cursor-pointer hover:bg-light-gray"
                                        }`}
                                >
                                    <div className="flex items-start gap-3 min-w-0">
                                        {/* Unread dot */}
                                        <span
                                            className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${notification.has_read ? "bg-transparent" : "bg-primary"}`}
                                        />
                                        <p className="text-[13px] leading-[150%] text-title">
                                            {notification.message}
                                        </p>
                                    </div>
                                    <Box className="shrink-0 text-right">
                                        <span className="text-[11px] font-[500] text-para-light block">{date}</span>
                                        <span className="text-[10px] text-para-light">{time}</span>
                                    </Box>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <TablePaginationControls
                    qp={qp}
                    setQp={setQp}
                    totalPages={pagination?.total_pages || 1}
                />
            </div>
        </section>
    );
}
