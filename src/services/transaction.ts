import { TransactionStatusProps } from "@/components/pages/dashboard/adminDashboard/transaction/TransactionTable";
import { setBalance, updateBalancePerProvider } from "@/slice/userBalanceSlice";
import { GlobalResponse, QueryParams } from "@/types/config";
import { SinlgePlayerResponseProps } from "@/types/player";
import { DepositListProps, DepositProps, DepositResponseProps, MasspayPaymentFields, MasspayPaymentMethods } from "@/types/transaction";
import { UserBalanceResponse } from "@/types/user";
import { baseApi } from "./baseApi";

interface SubmitMassPayRequest {
    token: string;
    body: {
        amount: number;
        game_provider: string;
        values?: { token: string; value: string }[];
    };
}

interface MassPayFieldsResponse {
    data: MasspayPaymentFields[];
    success: boolean;
    message: string;
}

interface MassPayMethodsResponse {
    data: MasspayPaymentMethods[];
    success: boolean;
    message: string;
}

const transactionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserBalance: builder.query<UserBalanceResponse, void>({
            query: () => ({
                url: "/api/get-balance",
                method: "GET",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setBalance(data?.data));
                } catch { }
            },
            providesTags: ["Deposit", "Withdrawl"],
        }),
        getUserBalanceBySlug: builder.query<{ data: { provider: string; balance: number; flag: string; has_changed_password: boolean } }, { slug: string }>({
            query: ({ slug }) => ({
                url: `/api/balance/${slug}`,
                method: "GET",
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateBalancePerProvider({ balance: data?.data.balance, provider: arg.slug }));
                } catch { }
            },
            providesTags: ["Deposit", "Withdrawl", "user", "wallet"],
        }),
        getUserGameBalance: builder.query<SinlgePlayerResponseProps, void>({
            query: () => ({
                url: "/api/detail/get-balance",
                method: "GET",
            }),
            providesTags: ["Deposit", "Withdrawl"],
        }),
        deposit: builder.mutation<DepositResponseProps, DepositProps>({
            query: ({ id, amount, type, payment_token, number, hash, exp, bin, status, first_name, last_name, address, city, state, zip }) => ({
                url: `/api/payment/${id}`,
                method: "POST",
                body: { amount, type, payment_token, number, hash, exp, bin, status, first_name, last_name, address, city, state, zip },
            }),
            invalidatesTags: ["Deposit"],
        }),
        getAllDeposit: builder.query<DepositListProps, QueryParams & { days: number | null; customRange: { startDate: string | null; endDate: string | null } }>({
            query: ({ search, pageIndex, pageSize, days, customRange }) => {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (pageIndex) params.append("page", pageIndex.toString());
                if (pageSize) params.append("page_size", pageSize.toString());
                if (days) params.append("days", days.toString());
                if (customRange.startDate) params.append("start_date", customRange.startDate.toString());
                if (customRange.endDate) params.append("end_date", customRange.endDate.toString());
                const queryString = params.toString();
                return {
                    url: `/api/deposits${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Deposit"],
        }),
        withdrawl: builder.mutation<DepositResponseProps, any>({
            query: (body) => ({
                url: `/api/user/withdrawl`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Withdrawl"],
        }),
        getAllWithdrawl: builder.query<DepositListProps, QueryParams & { days: number | null; customRange: { startDate: string | null; endDate: string | null } }>({
            query: ({ search, pageIndex, pageSize, days, customRange }) => {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (pageIndex) params.append("page", pageIndex.toString());
                if (pageSize) params.append("page_size", pageSize.toString());
                if (days) params.append("days", days.toString());
                if (customRange.startDate) params.append("start_date", customRange.startDate.toString());
                if (customRange.endDate) params.append("end_date", customRange.endDate.toString());
                const queryString = params.toString();
                return {
                    url: `/api/user/withdrawl${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Withdrawl"],
        }),
        getAllTransaction: builder.query<DepositListProps, QueryParams & { status?: TransactionStatusProps; user_id?: string | number; game_id?: string | number; selectedGame?: string; selectedTransactionType?: string; start_date?: string; end_date?: string }>({
            query: ({ search, pageIndex, pageSize, user_id, game_id, status, selectedGame, selectedTransactionType, start_date, end_date }) => {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (pageIndex) params.append("page", pageIndex.toString());
                if (pageSize) params.append("page_size", pageSize.toString());
                if (user_id) params.append("user", user_id.toString());
                if (game_id) params.append("game", game_id.toString());
                if (status) params.append("status", status.toString());
                if (selectedGame) params.append("game", selectedGame.toString());
                if (selectedTransactionType) params.append("type", selectedTransactionType.toString());
                if (start_date) params.append("start_date", start_date.toString());
                if (end_date) params.append("end_date", end_date.toString());
                const queryString = params.toString();
                return {
                    url: `/api/admin/transactions${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Withdrawl", "Deposit"],
        }),
        getMassPayPaymentMethods: builder.query<MassPayMethodsResponse, void>({
            query: () => ({
                url: `/api/payment`,
                method: "GET",
            }),
        }),
        getMassPayPaymentFields: builder.mutation<MassPayFieldsResponse, { token: string }>({
            query: ({ token }) => ({
                url: `/api/payment/fields?token=${token}`,
                method: "GET",
            }),
        }),
        submitMassPayPaymentFields: builder.mutation<GlobalResponse, SubmitMassPayRequest>({
            query: ({ token, body }) => ({
                url: `/api/payment/fields?token=${token}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Withdrawl"],
        }),
    }),
});

export const {
    useDepositMutation,
    useGetAllDepositQuery,
    useWithdrawlMutation,
    useGetAllWithdrawlQuery,
    useGetAllTransactionQuery,
    useGetMassPayPaymentFieldsMutation,
    useGetMassPayPaymentMethodsQuery,
    useSubmitMassPayPaymentFieldsMutation,
    useGetUserBalanceQuery,
    useGetUserBalanceBySlugQuery,
    useGetUserGameBalanceQuery,
} = transactionApi;
