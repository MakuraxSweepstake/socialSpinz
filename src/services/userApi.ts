import { GlobalResponse } from "@/types/config";
import { CredentialsResponseProps } from "@/types/game";
import { SinlgePlayerResponseProps, WalletProps } from "@/types/player";
import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addUserWallet: builder.mutation<SinlgePlayerResponseProps, WalletProps>({
            query: (body) => ({
                url: "/api/connect-wallet",
                method: "POST",
                body,
            }),
            invalidatesTags: ["wallet"],
        }),
        updateUserProfile: builder.mutation<SinlgePlayerResponseProps, { id: string; body: FormData }>({
            query: ({ id, body }) => ({
                url: `/api/update/user-information/${id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["user", "wallet"],
        }),
        getUserGameCredentials: builder.query<CredentialsResponseProps, void>({
            query: () => ({
                url: `/api/credentials`,
                method: "GET",
            }),
            providesTags: ["user", "wallet"],
        }),
        changeUserGamePassword: builder.mutation<GlobalResponse, { password: string; confirm_password: string; name: string }>({
            query: ({ password, confirm_password, name }) => ({
                url: `/api/change-password?for=${name}`,
                method: "POST",
                body: { password, password_confirmation: confirm_password },
            }),
            invalidatesTags: ["user", "wallet"],
        }),
        updateUserGamePassword: builder.mutation<GlobalResponse, { password: string; provider: string }>({
            query: ({ password, provider }) => ({
                url: `/api/game/change-password`,
                method: "POST",
                body: { password, provider },
            }),
            invalidatesTags: ["user", "wallet"],
        }),
        getGamesPasswordStatus: builder.query<{ data: { has_changed_password: boolean } }, { provider: string }>({
            query: ({ provider }) => ({
                url: `/api/game/${provider}/has-changed-password`,
                method: "GET",
            }),
            providesTags: ["user", "wallet"],
        }),
    }),
});

export const {
    useAddUserWalletMutation,
    useUpdateUserProfileMutation,
    useGetUserGameCredentialsQuery,
    useChangeUserGamePasswordMutation,
    useUpdateUserGamePasswordMutation,
    useGetGamesPasswordStatusQuery,
} = userApi;
