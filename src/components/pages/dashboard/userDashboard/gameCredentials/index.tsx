"use client";

import GlassWrapper from '@/components/molecules/GlassWrapper';
import { useGetUserGameCredentialsQuery } from '@/services/userApi';
import CredentialsCard from './CredentialsCard';

function CredentialsCardShimmer() {
    return (
        <GlassWrapper className="p-4 lg:p-6 animate-pulse">
            <>
                {/* Header */}
                <div className="credentials__header flex gap-2 items-center">
                    <div className="w-[74px] h-[74px] rounded-full bg-gray-700/50"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700/50 w-3/4 rounded"></div>
                        <div className="h-3 bg-gray-700/40 w-1/2 rounded"></div>
                        <div className="h-3 bg-gray-700/30 w-1/3 rounded"></div>
                    </div>
                </div>

                {/* List */}
                <ul className="mt-4 space-y-2">
                    {[1, 2, 3].map((i) => (
                        <li
                            key={i}
                            className="py-2 border-t border-b border-[rgba(255,255,255,0.2)] grid grid-cols-2 items-center"
                        >
                            <div className="h-3 bg-gray-700/50 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-700/30 rounded w-2/4 justify-self-end"></div>
                        </li>
                    ))}
                </ul>

                {/* Buttons */}
                <div className="action__group mt-4 flex flex-col md:flex-row justify-between gap-2 md:gap-4">
                    <div className="h-10 bg-gray-700/40 rounded w-full md:w-1/2"></div>
                    <div className="h-10 bg-gray-700/30 rounded w-full md:w-1/2"></div>
                </div>
            </>
        </GlassWrapper>
    );
}
export default function GameCredentialsPage() {
    const { data: creds, isLoading: loadingCreds } = useGetUserGameCredentialsQuery();


    return (
        <section className="credentials__listing ">
            <div className="section__title mb-8 lg:max-w-[521px]">
                <h1 className='mb-2 text-[24px] lg:text-[32px]'>Game Credentials</h1>
                <p className='text-[11px] lg:text-[14px]'>To start playing and cashing out your winnings, you’ll need a crypto wallet to purchase E-Credits and receive payouts. Don't worry—it’s quick and easy!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-2 lg:gap-4">
                {loadingCreds
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <CredentialsCardShimmer key={i} />
                    ))
                    : creds?.data?.length
                        ? creds.data.map((cred) => (
                            <div className="col-span-1" key={cred.full_name}>
                                <CredentialsCard
                                    cred={cred}
                                />
                            </div>
                        ))
                        : ""}
            </div>
        </section>
    )
}
