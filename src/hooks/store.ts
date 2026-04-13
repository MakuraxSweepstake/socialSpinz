import { baseApi } from "@/services/baseApi";
import { publicApi } from "@/services/publicApi";
import authModalSlice from "@/slice/authModalSlice";
import auth from "@/slice/authSlice";
import toastSlice from "@/slice/toastSlice";
import updatePasswordSlice from "@/slice/updatePasswordSlice";
import userBalanceSlice from "@/slice/userBalanceSlice";
import { configureStore } from "@reduxjs/toolkit";

// Import all injected endpoint files so their endpoints are registered
import "@/services/authApi";
import "@/services/userApi";
import "@/services/gameApi";
import "@/services/playerApi";
import "@/services/transaction";
import "@/services/settingApi";
import "@/services/pageApi";
import "@/services/notificationApi";
import "@/services/menuApi";
import "@/services/dashboardApi";
import "@/services/downloadApi";
import "@/services/paymentSetupApi";
import "@/services/providerApi";

export const store = configureStore({
    reducer: {
        auth,
        toastSlice,
        authModalSlice,
        updatePasswordSlice,
        userBalanceSlice,
        [baseApi.reducerPath]: baseApi.reducer,
        [publicApi.reducerPath]: publicApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(baseApi.middleware)
            .concat(publicApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
