"use client";

import { useGetSeoDataQuery } from "@/services/menuApi";
import Image from "next/image";

export default function ComingSoon() {
    const { data } = useGetSeoDataQuery();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
            style={{
                background: "linear-gradient(135deg, #0d1117 0%, #1a1f2e 50%, #0d1117 100%)",
            }}
        >
            <div className="max-w-lg w-full flex flex-col items-center gap-6">
                <Image
                    src={data?.data?.logo}
                    alt="Logo"
                    width={120}
                    height={120}
                    className="rounded-full mb-2"
                />

                <div>
                    <h1 className="text-[40px] lg:text-[56px] font-bold text-white leading-tight">
                        Coming Soon
                    </h1>
                    <p className="text-[14px] lg:text-[16px] text-white/60 mt-3">
                        We&apos;re working hard to bring you something amazing. Check back soon!
                    </p>
                </div>
            </div>
        </div>
    );
}
