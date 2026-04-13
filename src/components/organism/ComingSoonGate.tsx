"use client";

import { useAppSelector } from "@/hooks/hook";
import { useGetSiteAvailabilityQuery } from "@/services/settingApi";

import React from "react";
import ComingSoon from "../pages/ComingSoon";

export default function ComingSoonGate({ children }: { children: React.ReactNode }) {
    const user = useAppSelector((state) => state.auth.user);
    const { data, isLoading } = useGetSiteAvailabilityQuery();

    if (isLoading) return null;

    // const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    const isUser = !user || user?.role?.toUpperCase() === "USER";

    if (isUser && data?.data?.coming_soon === true) {
        return <ComingSoon />;
    }

    return <>{children}</>;
}
