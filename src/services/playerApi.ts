import { GlobalResponse, QueryParams } from "@/types/config";
import { PlayerListResponse, PlayerProps, SinlgePlayerResponseProps } from "@/types/player";
import { buildQueryString } from "@/utils/buildQueryParams";
import { baseApi } from "./baseApi";

const playerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createPlayer: builder.mutation<PlayerListResponse, FormData>({
            query: (body) => ({
                url: "/api/admin/add-user",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Players", id: "LIST" }],
        }),
        getAllPlayer: builder.query<PlayerListResponse, QueryParams>({
            query: ({ search, pageIndex, pageSize, status, start_date, end_date }) => {
                const queryString = buildQueryString({ search, page: pageIndex, page_size: pageSize, status, start_date, end_date });
                return {
                    url: `/api/admin/get-users${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.data.map((player) => ({
                            type: "Players" as const,
                            id: player.id,
                        })),
                        { type: "Players", id: "LIST" },
                    ]
                    : [{ type: "Players", id: "LIST" }],
        }),
        getPlayerById: builder.query<SinlgePlayerResponseProps, { id: number }>({
            query: ({ id }) => ({
                url: `/api/admin/get-user/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Players", id }],
        }),
        getPlayerBalanceById: builder.query<SinlgePlayerResponseProps, { id: string }>({
            query: ({ id }) => ({
                url: `/api/admin/get-balance/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Players", id }],
        }),
        updatePlayerById: builder.mutation<SinlgePlayerResponseProps, { id: string; body: FormData }>({
            query: ({ id, body }) => ({
                url: `/api/admin/update-user/${id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Players", id }],
        }),
        deletePlayerById: builder.mutation<GlobalResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/api/admin/user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Players", id },
                { type: "Players", id: "LIST" },
            ],
        }),
        suspendPlayerById: builder.mutation<GlobalResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/api/admin/user/suspend/${id}`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Players", id }],
        }),
    }),
});

export const {
    useCreatePlayerMutation,
    useGetAllPlayerQuery,
    useGetPlayerByIdQuery,
    useGetPlayerBalanceByIdQuery,
    useUpdatePlayerByIdMutation,
    useDeletePlayerByIdMutation,
    useSuspendPlayerByIdMutation,
} = playerApi;
