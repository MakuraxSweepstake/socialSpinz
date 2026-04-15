import { GlobalResponse, QueryParams } from "@/types/config";
import { ActivityResponse, NotificationResponse } from "@/types/notification";
import { buildQueryString } from "@/utils/buildQueryParams";
import { baseApi } from "./baseApi";

const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Admin notifications
        getAllNotification: builder.query<NotificationResponse, QueryParams>({
            query: ({ search, pageIndex, pageSize }) => {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (pageIndex) params.append("page", pageIndex.toString());
                if (pageSize) params.append("page_size", pageSize.toString());
                const queryString = params.toString();
                return {
                    url: `/api/admin/notifications${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Notification"],
        }),
        readNotification: builder.mutation<GlobalResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/api/admin/notification/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["Notification"],
        }),
        readAllNotification: builder.mutation<GlobalResponse, void>({
            query: () => ({
                url: `/api/admin/notification/all`,
                method: "POST",
            }),
            invalidatesTags: ["Notification"],
        }),
        // User notifications
        getUserNotifications: builder.query<NotificationResponse, QueryParams>({
            query: ({ search, pageIndex, pageSize }) => {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (pageIndex) params.append("page", pageIndex.toString());
                if (pageSize) params.append("page_size", pageSize.toString());
                const queryString = params.toString();
                return {
                    url: `/api/notifications${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["UserNotification"],
        }),
        readUserNotification: builder.mutation<GlobalResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/api/notification/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["UserNotification"],
        }),
        readAllUserNotification: builder.mutation<GlobalResponse, void>({
            query: () => ({
                url: `/api/notification/all`,
                method: "POST",
            }),
            invalidatesTags: ["UserNotification"],
        }),
        getAllActivity: builder.query<ActivityResponse, { activity_type: string; status?: string } & QueryParams>({
            query: ({ search, pageIndex, pageSize, activity_type, status, start_date, end_date }) => {
                const queryString = buildQueryString({ search, page: pageIndex, page_size: pageSize, type: activity_type, status, start_date, end_date });
                return {
                    url: `/api/admin/activity${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Activity"],
        }),
    }),
});

export const {
    useGetAllNotificationQuery,
    useReadNotificationMutation,
    useReadAllNotificationMutation,
    useGetUserNotificationsQuery,
    useReadUserNotificationMutation,
    useReadAllUserNotificationMutation,
    useGetAllActivityQuery,
} = notificationApi;
