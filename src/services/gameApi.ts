import { GlobalResponse, QueryParams } from "@/types/config";
import { GameItem, GameResponseProps, SingleGameResponse } from "@/types/game";
import { buildQueryString } from "@/utils/buildQueryParams";
import { baseApi } from "./baseApi";

const gameApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addGame: builder.mutation<GlobalResponse, FormData>({
            query: (body) => ({
                url: "/api/admin/add-game",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Games", id: "LIST" }],
        }),
        getAllGames: builder.query<GameResponseProps, QueryParams | void>({
            query: (params = {}) => {
                const { pageIndex, pageSize, search, start_date, end_date } = params as QueryParams;
                const queryString = buildQueryString({ page: pageIndex, page_size: pageSize, search, start_date, end_date });
                return {
                    url: `/api/admin/games${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        { type: "Games", id: "LIST" },
                        ...result.data.data.map((game: GameItem) => ({
                            type: "Games" as const,
                            id: game.id,
                        })),
                    ]
                    : [{ type: "Games", id: "LIST" }],
        }),
        getAllGamesForUser: builder.query<GameResponseProps, void>({
            query: () => ({
                url: "/api/get-games",
                method: "GET",
            }),
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        { type: "Games", id: "LIST" },
                        ...result.data.data.map((game: GameItem) => ({
                            type: "Games" as const,
                            id: game.id,
                        })),
                    ]
                    : [{ type: "Games", id: "LIST" }],
        }),
        getSingleGameFormUser: builder.query<SingleGameResponse, { id: string | number }>({
            query: ({ id }) => ({
                url: `/api/game/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Games", id }],
        }),
        getGameById: builder.query<SingleGameResponse, { id: string | number }>({
            query: ({ id }) => ({
                url: `/api/admin/game/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, { id }) => [{ type: "Games", id }],
        }),
        updateGameById: builder.mutation<SingleGameResponse, { id: string | number; body: FormData }>({
            query: ({ id, body }) => ({
                url: `/api/admin/game/${id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Games", id },
                { type: "Games", id: "LIST" },
            ],
        }),
        deleteGameById: builder.mutation<GlobalResponse, { id: string | number }>({
            query: ({ id }) => ({
                url: `/api/admin/game/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Games", id },
                { type: "Games", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useAddGameMutation,
    useGetAllGamesQuery,
    useGetAllGamesForUserQuery,
    useGetGameByIdQuery,
    useUpdateGameByIdMutation,
    useDeleteGameByIdMutation,
    useGetSingleGameFormUserQuery,
} = gameApi;
