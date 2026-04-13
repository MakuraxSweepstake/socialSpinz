import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const basePublicQuery = fetchBaseQuery({
    baseUrl: (process.env.NEXT_PUBLIC_FRONTEND_URL || "") + "/api/backend",
    credentials: "include",
    prepareHeaders: (headers) => {
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

export const publicApi = createApi({
    reducerPath: "publicApi",
    baseQuery: basePublicQuery,
    endpoints: () => ({}),
});
