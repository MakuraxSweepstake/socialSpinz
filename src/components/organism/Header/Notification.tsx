"use client";

import { useAppDispatch } from '@/hooks/hook';
import {
    useGetAllNotificationQuery,
    useGetUserNotificationsQuery,
    useReadAllNotificationMutation,
    useReadAllUserNotificationMutation,
    useReadNotificationMutation,
    useReadUserNotificationMutation,
} from '@/services/notificationApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { NotificationProps } from '@/types/notification';
import { formatDateTime } from '@/utils/formatDateTime';
import {
    Badge,
    Box,
    CircularProgress,
    ClickAwayListener,
    IconButton,
    ListItem,
    Paper,
    Popper,
    Typography,
} from '@mui/material';
import Fade from '@mui/material/Fade';
import { Notification } from '@wandersonalwes/iconsax-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

function AdminNotificationBell() {
    const dispatch = useAppDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 10;
    const [accumulated, setAccumulated] = useState<NotificationProps[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const { data, isFetching } = useGetAllNotificationQuery({ pageIndex, pageSize });

    useEffect(() => {
        if (!data?.data?.data) return;
        if (pageIndex === 1) {
            setAccumulated(data.data.data);
        } else {
            setAccumulated((prev) => [...prev, ...data.data.data]);
        }
        const { total_pages, current_page } = data.data.pagination;
        setHasMore(current_page < total_pages);
    }, [data]);

    const [readNotification] = useReadNotificationMutation();
    const [readAllNotification] = useReadAllNotificationMutation();

    const handleRead = useCallback(async (id?: string) => {
        try {
            if (id) {
                await readNotification({ id }).unwrap();
                setAccumulated((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, has_read: true } : n))
                );
            } else {
                await readAllNotification().unwrap();
                setAccumulated((prev) => prev.map((n) => ({ ...n, has_read: true })));
            }
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Unable to mark as read", variant: ToastVariant.ERROR }));
        }
    }, [readNotification, readAllNotification, dispatch]);

    return (
        <NotificationDropdown
            notifications={accumulated}
            totalCount={data?.data?.pagination?.count ?? 0}
            hasMore={hasMore}
            onLoadMore={() => setPageIndex((p) => p + 1)}
            onRead={handleRead}
            viewAllHref="/notifications"
        />
    );
}

// ─── User wrapper ─────────────────────────────────────────────────────────────
function UserNotificationBell() {
    const dispatch = useAppDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 10;
    const [accumulated, setAccumulated] = useState<NotificationProps[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const { data } = useGetUserNotificationsQuery({ pageIndex, pageSize });

    useEffect(() => {
        if (!data?.data?.data) return;
        if (pageIndex === 1) {
            setAccumulated(data.data.data);
        } else {
            setAccumulated((prev) => [...prev, ...data.data.data]);
        }
        const { total_pages, current_page } = data.data.pagination;
        setHasMore(current_page < total_pages);
    }, [data]);

    const [readNotification] = useReadUserNotificationMutation();
    const [readAllNotification] = useReadAllUserNotificationMutation();

    const handleRead = useCallback(async (id?: string) => {
        try {
            if (id) {
                await readNotification({ id }).unwrap();
                setAccumulated((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, has_read: true } : n))
                );
            } else {
                await readAllNotification().unwrap();
                setAccumulated((prev) => prev.map((n) => ({ ...n, has_read: true })));
            }
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Unable to mark as read", variant: ToastVariant.ERROR }));
        }
    }, [readNotification, readAllNotification, dispatch]);

    return (
        <NotificationDropdown
            notifications={accumulated}
            totalCount={data?.data?.pagination?.count ?? 0}
            hasMore={hasMore}
            onLoadMore={() => setPageIndex((p) => p + 1)}
            onRead={handleRead}
            viewAllHref="/user-notifications"
        />
    );
}

// ─── Shared dropdown UI ───────────────────────────────────────────────────────
const SCROLL_ID = 'notification-scroll-list';

function NotificationDropdown({
    notifications,
    totalCount,
    hasMore,
    onLoadMore,
    onRead,
    viewAllHref,
}: {
    notifications: NotificationProps[];
    totalCount: number;
    hasMore: boolean;
    onLoadMore: () => void;
    onRead: (id?: string) => void;
    viewAllHref: string;
}) {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleToggle = () => setOpen((prev) => !prev);
    const handleClose = (event: MouseEvent | TouchEvent) => {
        if (anchorRef.current?.contains(event.target as Node)) return;
        setOpen(false);
    };

    const unreadCount = notifications.filter((n) => !n.has_read).length;
    const id = open ? 'notification-popper' : undefined;

    return (
        <Box>
            <IconButton
                aria-describedby={id}
                ref={anchorRef}
                onClick={handleToggle}
                className="!bg-light-gray"
            >
                <Badge
                    badgeContent={unreadCount}
                    color="success"
                    sx={{ '& .MuiBadge-badge': { top: 2, right: 4 } }}
                >
                    <Notification variant="Bold" className="!text-para-light" />
                </Badge>
            </IconButton>

            <Popper
                id={id}
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-end"
                transition
                style={{ zIndex: 1300 }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={300}>
                        <Paper elevation={3} sx={{ width: 300, borderRadius: 2, mt: 1 }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box>
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-3 pt-3 pb-2">
                                        <Typography variant="h3">Notifications</Typography>
                                        <div className="flex items-center gap-3">
                                            {totalCount > 10 && (
                                                <Link
                                                    href={viewAllHref}
                                                    onClick={() => setOpen(false)}
                                                    className="text-[12px] leading-[120%] hover:text-primary-dark font-medium"
                                                >
                                                    View All
                                                </Link>
                                            )}
                                            <p
                                                onClick={() => onRead()}
                                                className="text-[12px] leading-[120%] text-primary hover:text-primary-dark font-medium cursor-pointer"
                                            >
                                                Mark All Read
                                            </p>
                                        </div>
                                    </div>

                                    {/* Scrollable list */}
                                    {notifications.length ? (
                                        <div
                                            id={SCROLL_ID}
                                            className="max-h-[320px] overflow-auto px-1"
                                        >
                                            <InfiniteScroll
                                                dataLength={notifications.length}
                                                next={onLoadMore}
                                                hasMore={hasMore}
                                                loader={
                                                    <div className="flex justify-center py-2">
                                                        <CircularProgress size={16} />
                                                    </div>
                                                }
                                                endMessage={
                                                    <p className="text-center text-[10px] text-para-light py-2">
                                                        No more notifications
                                                    </p>
                                                }
                                                scrollableTarget={SCROLL_ID}
                                            >
                                                {notifications.map((notification) => {
                                                    const { date } = formatDateTime(notification.created_at);
                                                    return (
                                                        <ListItem
                                                            key={notification.id}
                                                            className={`border-b border-gray-100 rounded-sm !p-2 cursor-pointer mb-2 ${notification.has_read ? "" : "bg-gray-100"}`}
                                                            onClick={() => onRead(notification.id)}
                                                        >
                                                            <div>
                                                                <p className="text-[12px] leading-[120%] text-title line-clamp-2">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-[10px] mt-1 font-[500] text-para-light">
                                                                    {date}
                                                                </p>
                                                            </div>
                                                        </ListItem>
                                                    );
                                                })}
                                            </InfiniteScroll>
                                        </div>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ pt: 1, px: 2, pb: 2 }}>
                                            No new notifications
                                        </Typography>
                                    )}
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </Box>
    );
}

// ─── Public export ────────────────────────────────────────────────────────────
export default function NotificationBell({ type = 'admin' }: { type?: 'admin' | 'user' }) {
    if (type === 'user') return <UserNotificationBell />;
    return <AdminNotificationBell />;
}
