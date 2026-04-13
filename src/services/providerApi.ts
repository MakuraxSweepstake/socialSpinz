import { baseApi } from "./baseApi";

const providerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProvider: builder.query<GameProviderResponseProps, void>({
            query: () => ({
                url: "/api/admin/game/providers",
                method: "GET",
            }),
            providesTags: ["providers"],
        }),
    }),
});

export const { useGetAllProviderQuery } = providerApi;
