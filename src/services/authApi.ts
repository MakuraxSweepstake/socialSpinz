import { LoginProps, LoginResponse, RegisterProps } from "@/types/auth";
import { GlobalResponse } from "@/types/config";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        registerUser: builder.mutation<{ success: boolean, data: LoginResponse | null, message: string }, RegisterProps>({
            query: ({ email,
                username,
                password,
                password_confirmation, first_name, middle_name, last_name, phone, photoid_number, dob, city, pob, agree, device_id }) => ({
                    url: `/api/auth/register`,
                    method: "POST",
                    body: {
                        email,
                        username,
                        password,
                        password_confirmation, first_name, middle_name, last_name, phone, photoid_number, dob, city, pob, agree, device_id
                    },
                }),

        }),
        login: builder.mutation<LoginResponse, LoginProps>({
            query: ({ email, password, device_id }) => ({
                url: `/api/auth/login`,
                method: "POST",
                body: { email, password, device_id },
            })
        }),
        sendVerificationLinkAgain: builder.mutation<LoginResponse, { email: string }>({
            query: ({ email }) => ({
                url: `/api/email/resend`,
                method: "POST",
                body: { email },
            })
        }),
        verifyEmail: builder.mutation<GlobalResponse, { id: string; hash: string, device_id: string }>({
            query: ({ id, hash, device_id }) => ({
                url: "/api/auth/verify-email",
                method: "POST",
                body: { id, hash, device_id },
            })
        }),
        forgotPassword: builder.mutation<GlobalResponse, { email: string }>({
            query: ({ email }) => ({
                url: "/api/forgot-password/send",
                method: "POST",
                body: { email },
            })
        }),
        verifyOTP: builder.mutation<GlobalResponse, { email: string; otp: string }>({
            query: ({ email, otp }) => ({
                url: "/api/forgot-password/send",
                method: "POST",
                body: { email, otp },
            })
        }),
        resetPassword: builder.mutation<GlobalResponse, { email: string, password: string, password_confirmation: string }>({
            query: ({ email,
                password,
                password_confirmation }) => ({
                    url: `/api/forgot-password/reset`,
                    method: "POST",
                    body: {
                        email,
                        password,
                        password_confirmation
                    },
                })
        }),
        Logout: builder.mutation<GlobalResponse, {}>({
            query: () => ({
                url: `/api/logout`,
                method: "POST",
            })
        }),
    })
})

export const { useLoginMutation, useRegisterUserMutation, useSendVerificationLinkAgainMutation, useForgotPasswordMutation, useVerifyOTPMutation, useResetPasswordMutation, useVerifyEmailMutation ,useLogoutMutation} = authApi;