import { baseApi } from "./baseApi";

const downloadApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        downloadTransaction: builder.mutation<Blob, { user?: string; game?: string; search?: string; status?: string }>({
            async queryFn(args, _queryApi, _extraOptions, fetchWithBQ) {
                const params = new URLSearchParams();
                if (args.user) params.append("user", args.user.toString());
                if (args.game) params.append("game", args.game.toString());
                if (args.search) params.append("search", args.search.toString());
                if (args.status) params.append("status", args.status.toString());
                const queryString = params.toString();

                const response = await fetchWithBQ({
                    url: `/api/admin/download/transactions${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                    responseHandler: async (response) => response.blob(),
                });

                if (response.error) return { error: response.error };
                return { data: response.data as Blob };
            },
        }),
        downloadUser: builder.mutation<Blob, { search?: string; status?: string }>({
            async queryFn(args, _queryApi, _extraOptions, fetchWithBQ) {
                const params = new URLSearchParams();
                if (args.search) params.append("search", args.search.toString());
                if (args.status) params.append("status", args.status.toString());
                const queryString = params.toString();

                const response = await fetchWithBQ({
                    url: `/api/admin/download/users${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                    responseHandler: async (response) => response.blob(),
                });

                if (response.error) return { error: response.error };
                return { data: response.data as Blob };
            },
        }),
    }),
});

export const { useDownloadTransactionMutation, useDownloadUserMutation } = downloadApi;
