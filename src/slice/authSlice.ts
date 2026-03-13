import { PlayerProps } from "@/types/player";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
type Data = {
    access_token: string,
    user: PlayerProps | null,
}

const isBrowser = typeof window !== "undefined";

const tokens = isBrowser ? localStorage.getItem("token") : null;
let localStorageAccessToken = "";
let localStorageRefreshToken = "";
let localStorageUser = null;

if (tokens) {
    try {
        const parsedTokens = JSON.parse(tokens);
        localStorageAccessToken = parsedTokens.access_token || "";
        localStorageRefreshToken = parsedTokens.refreshToken || "";
        localStorageUser = parsedTokens.user || "";
    } catch (error) {
        console.error("Error parsing tokens from localStorage:", error);
    }
}

const initialState: Data = {
    // accessToken: localStorageAccessToken,
    // refreshToken: localStorageRefreshToken,
    access_token: localStorageAccessToken,
    user: localStorageUser,
};

export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setTokens: (state, action) => {
            const { access_token, refreshToken, user } = action.payload;
            state.access_token = access_token;
            // state.refreshToken = refreshToken;
            state.user = user;

            localStorage.setItem(
                "token",
                JSON.stringify({ access_token, refreshToken, user }),
            );

            if (isBrowser) {
                localStorage.setItem(
                    "token",
                    JSON.stringify({ access_token, refreshToken, user }),
                );
            }
        },
        clearTokens: (state) => {
            state.access_token = "";
            // state.refreshToken = "";
            state.user = null;
            if (isBrowser) {
                localStorage.removeItem("token");
            }
            Cookies.remove("access_token");
            Cookies.remove("user");
        },
    }
})

export const { setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;