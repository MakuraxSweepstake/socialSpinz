import { GlobalResponse } from "@/types/config";
import { baseApi } from "./baseApi";

type PaymentRequestProps = {
    idem_payment_uri: string;
    idem_hashkey: string;
    idem_merchant_id: string;
};

const paymentSetupApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createPaymentSetup: builder.mutation<GlobalResponse, PaymentRequestProps>({
            query: (body) => ({
                url: "/api/admin/payment-setup",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PaymentSetup"],
        }),
        getPaymentSetup: builder.query<{ data: PaymentRequestProps; message: string }, void>({
            query: () => ({
                url: "/api/admin/payment-setup",
                method: "GET",
            }),
            providesTags: ["PaymentSetup"],
        }),
    }),
});

export const { useCreatePaymentSetupMutation, useGetPaymentSetupQuery } = paymentSetupApi;
