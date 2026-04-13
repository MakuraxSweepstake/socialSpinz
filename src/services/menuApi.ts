import { GlobalResponse } from "@/types/config";
import { MenuResponse } from "@/types/menu";
import { baseApi } from "./baseApi";
import { publicApi } from "./publicApi";

const menuApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createMenu: builder.mutation<GlobalResponse, { pages: string[] }>({
            query: (body) => ({
                url: "/api/admin/menu",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Menus"],
        }),
        getAllMenu: builder.query<MenuResponse, void>({
            query: () => ({
                url: "/api/admin/menu",
                method: "GET",
            }),
            providesTags: ["Menus"],
        }),
    }),
});

const userMenuApi = publicApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUserMenu: builder.query<MenuResponse, void>({
            query: () => ({
                url: "api/general/menus",
                method: "GET",
            }),
        }),
        getSeoData: builder.query<any, void>({
            query: () => ({
                url: "/api/general/home/seo",
                method: "GET",
            }),
        }),
    }),
});

export const { useCreateMenuMutation, useGetAllMenuQuery } = menuApi;
export const { useGetAllUserMenuQuery, useGetSeoDataQuery } = userMenuApi;
