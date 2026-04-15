import { GlobalResponse } from "@/types/config";
import { BannerResponseProps, ChatbotProps, SiteAvailabilityResponse, SiteAvailabilitySettings, SiteSettingResponseProps, TransactionLimitResponse, TransactionLimitSettings } from "@/types/setting";
import { baseApi } from "./baseApi";

const settingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateSetting: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: "/api/admin/settings",
                method: "POST",
                body,
            }),
            invalidatesTags: ["settings"],
        }),
        getSettings: builder.query<SiteSettingResponseProps, void>({
            query: () => ({
                url: "/api/admin/settings",
                method: "GET",
            }),
            providesTags: ["settings"],
        }),
        updateBanner: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: "/api/admin/setting/banner",
                method: "POST",
                body,
            }),
            invalidatesTags: ["banners"],
        }),
        getAllBanner: builder.query<BannerResponseProps, void>({
            query: () => ({
                url: "/api/admin/setting/banner",
                method: "GET",
            }),
            providesTags: ["banners"],
        }),
        updateChatbot: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: "/api/admin/setting/chatbot",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ['Chatbot']
        }),
        getChatbotSetting: builder.query<{ data: ChatbotProps }, void>({
            query: () => ({
                url: "/api/setting/chatbot",
                method: "GET",
            }),
            providesTags: ['Chatbot']
        }),
        getTransactionLimits: builder.query<TransactionLimitResponse, void>({
            query: () => ({
                url: "/api/settings/transaction-limits",
                method: "GET",
            }),
            providesTags: ["settings"],
        }),
        updateTransactionLimits: builder.mutation<GlobalResponse, TransactionLimitSettings>({
            query: (body) => ({
                url: "/api/admin/settings/transaction-limits",
                method: "POST",
                body,
            }),
            invalidatesTags: ["settings"],
        }),
        getSiteAvailability: builder.query<SiteAvailabilityResponse, void>({
            query: () => ({
                url: "/api/settings/site-availability",
                method: "GET",
            }),
            providesTags: ["settings"],
        }),
        updateSiteAvailability: builder.mutation<GlobalResponse, SiteAvailabilitySettings>({
            query: (body) => ({
                url: "/api/admin/settings/site-availability",
                method: "POST",
                body,
            }),
            invalidatesTags: ["settings"],
        }),
    }),
});

export const {
    useUpdateSettingMutation,
    useGetSettingsQuery,
    useUpdateBannerMutation,
    useGetAllBannerQuery,
    useGetTransactionLimitsQuery,
    useUpdateTransactionLimitsMutation,
    useGetSiteAvailabilityQuery,
    useUpdateSiteAvailabilityMutation,
    useUpdateChatbotMutation,
    useGetChatbotSettingQuery,
} = settingApi;
