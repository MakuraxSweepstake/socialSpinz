"use client"

import GlassWrapper from '@/components/molecules/GlassWrapper'
import { useAppSelector } from '@/hooks/hook'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PaymentSuccess() {
    const params = useParams();
    const slug = params?.slug as string;
    const user = useAppSelector((state) => state.auth.user);
    const localUser = JSON.parse(localStorage.getItem("token") || "");

    console.log("auth data", { user, localUser: localUser, slug });

    return (
        <GlassWrapper className="max-w-[520px] mx-auto flex flex-col gap-3 items-center text-center p-6">
            <Image
                src="/assets/images/verify-email.png"
                alt="Payment Success"
                width={180}
                height={140}
            />
            <h1 className="text-[24px] lg:text-[32px] leading-[120%] font-bold mb-4 text-green-500">
                Payment Successful
            </h1>
            <p className="text-[14px] leading-[150%] font-normal lg:text-[16px] mb-4">
                Your payment was processed successfully.
            </p>
            <Link
                href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/exclusive-games/${slug}`}
                className="ss-btn bg-primary-grad"
            >
                View Game Detail
            </Link>
        </GlassWrapper>
    )
}