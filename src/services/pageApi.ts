import { GlobalResponse, QueryParams } from "@/types/config";
import { PageListResponse, PageResponseProps } from "@/types/page";
import { buildQueryString } from "@/utils/buildQueryParams";
import { baseApi } from "./baseApi";

const pageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createPage: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: "/api/admin/page/store",
                method: "POST",
                body,
            }),
            invalidatesTags: ["pages"],
        }),
        getAllPage: builder.query<PageListResponse, QueryParams>({
            query: ({ pageIndex, pageSize, search, start_date, end_date } = {}) => {
                const queryString = buildQueryString({ page: pageIndex, page_size: pageSize, search, start_date, end_date });
                return {
                    url: `/api/admin/page/list${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["pages"],
        }),
        getSinlgePageById: builder.query<PageResponseProps, { id: string | undefined }>({
            query: ({ id }) => ({
                url: `/api/admin/page/${id}`,
                method: "GET",
            }),
            providesTags: ["pages"],
        }),
        updatePageById: builder.mutation<GlobalResponse, { id: string; body: FormData }>({
            query: ({ id, body }) => ({
                url: `/api/admin/page/update/${id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["pages"],
        }),
        deletePageById: builder.mutation<GlobalResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/api/admin/page/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["pages"],
        }),
    }),
});

export const {
    useCreatePageMutation,
    useGetAllPageQuery,
    useUpdatePageByIdMutation,
    useDeletePageByIdMutation,
    useGetSinlgePageByIdQuery,
} = pageApi;
