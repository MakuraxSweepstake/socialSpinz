// src/services/baseQuery.ts
import { RootState } from "@/hooks/store";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

let globalDeviceId: string | undefined = undefined;
let globalDeviceFingerprint: string | undefined = undefined;

export const setGlobalDeviceId = (id?: string) => {
    globalDeviceId = id;
};

export const setGlobalDeviceFingerprint = (fingerprint?: string) => {
    globalDeviceFingerprint = fingerprint;
};

export const baseQuery = fetchBaseQuery({
    baseUrl:
        (process.env.NEXT_PUBLIC_FRONTEND_URL || "") + "/api/backend",


    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.access_token;

        headers.set("Accept", "application/json");

        if (globalDeviceId) {
            headers.set("X-Device-Id", globalDeviceId);
        }
        if (globalDeviceFingerprint) {
            headers.set("X-Device-Fingerprint", globalDeviceFingerprint);
        }


        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
});
