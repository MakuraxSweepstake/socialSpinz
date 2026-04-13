import { LoginProps, LoginResponse, RegisterProps } from "@/types/auth";
import { GlobalResponse } from "@/types/config";
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation<LoginResponse, RegisterProps>({
            query: (body) => ({
                url: `/api/auth/register`,
                method: "POST",
                body,
            }),
        }),
        login: builder.mutation<LoginResponse, LoginProps>({
            query: ({ email, password, device_id }) => ({
                url: `/api/auth/login`,
                method: "POST",
                body: { email, password, device_id },
            }),
        }),
        sendVerificationLinkAgain: builder.mutation<LoginResponse, { email: string }>({
            query: ({ email }) => ({
                url: `/api/email/resend`,
                method: "POST",
                body: { email },
            }),
        }),
        verifyEmail: builder.mutation<GlobalResponse, { id: string; hash: string; device_id: string }>({
            query: ({ id, hash, device_id }) => ({
                url: "/api/auth/verify-email",
                method: "POST",
                body: { id, hash, device_id },
            }),
        }),
        forgotPassword: builder.mutation<GlobalResponse, { email: string }>({
            query: ({ email }) => ({
                url: "/api/forgot-password/send",
                method: "POST",
                body: { email },
            }),
        }),
        verifyOTP: builder.mutation<GlobalResponse, { email: string; otp: string }>({
            query: ({ email, otp }) => ({
                url: "/api/forgot-password/send",
                method: "POST",
                body: { email, otp },
            }),
        }),
        resetPassword: builder.mutation<GlobalResponse, { email: string; password: string; password_confirmation: string }>({
            query: ({ email, password, password_confirmation }) => ({
                url: `/api/forgot-password/reset`,
                method: "POST",
                body: { email, password, password_confirmation },
            }),
        }),
        getAgeGateUuid: builder.mutation<GlobalResponse & { data: { age_verify_uuid: string; is_age_verified: boolean } }, void>({
            query: () => ({
                url: `/api/user/age-verify`,
                method: "GET",
            }),
        }),
        verifyAgeGate: builder.mutation<GlobalResponse, { age_verify_uuid: string }>({
            query: ({ age_verify_uuid }) => ({
                url: `/api/user/age-verify`,
                method: "POST",
                body: { age_verify_uuid },
            }),
        }),
        getMe: builder.query<LoginResponse, void>({
            query: () => ({
                url: `/api/auth/me`,
                method: "GET",
            }),
        }),
        verifyProfile: builder.mutation<{ data: { redirection_url: string } }, void>({
            query: () => ({
                url: `/api/acuity/verify`,
                method: "POST",
            }),
        }),
        Logout: builder.mutation<GlobalResponse, {}>({
            query: () => ({
                url: `/api/logout`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterUserMutation,
    useSendVerificationLinkAgainMutation,
    useForgotPasswordMutation,
    useVerifyOTPMutation,
    useResetPasswordMutation,
    useVerifyEmailMutation,
    useGetAgeGateUuidMutation,
    useVerifyAgeGateMutation,
    useGetMeQuery,
    useLazyGetMeQuery,
    useVerifyProfileMutation,
    useLogoutMutation,
} = authApi;
