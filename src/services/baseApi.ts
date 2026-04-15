import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: [
        "user",
        "wallet",
        "Games",
        "Players",
        "Deposit",
        "Withdrawl",
        "settings",
        "banners",
        "pages",
        "Menus",
        "Notification",
        "UserNotification",
        "Activity",
        "PaymentSetup",
        "providers",
        "Analytics",
        "Transactions",
        "Download",
        "Chatbot",
        "MissingAccounts"
    ],
    endpoints: () => ({}),
});
