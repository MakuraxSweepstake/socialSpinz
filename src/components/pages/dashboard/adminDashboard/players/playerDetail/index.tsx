"use client"
import CreditCard from '@/components/organism/Charts/CreditCard'
import EditIcon from '@/icons/EditIcon'
import { useGetPlayerBalanceByIdQuery, useGetPlayerByIdQuery } from '@/services/playerApi'
import { formatDateTime } from '@/utils/formatDateTime'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import TransactionTable from '../../transaction/TransactionTable'

// const games = [
//     {
//         name: "Firekirin",
//         img: "/images/firekirin.png",
//         amount: "10K",
//         percentage: 10,
//     },
//     {
//         name: "Ultrapanda",
//         img: "/images/ultrapanda.png",
//         amount: "10K",
//         percentage: 45,
//     },
//     {
//         name: "Panda Master",
//         img: "/images/panda-master.png",
//         amount: "10K",
//         percentage: 45,
//     },
//     {
//         name: "Fish Master",
//         img: "/images/fish-master.png",
//         amount: "10K",
//         percentage: 45,
//     },
// ];

const CreditCardShimmer = () => {
    return (
        <div className="rounded-lg p-3 border border-gray animate-pulse">
            {/* Logo shimmer */}
            <div className="w-8 h-8 bg-gray-200 rounded-sm"></div>

            {/* Name shimmer */}
            <div className="h-4 bg-gray-200 rounded mt-3 mb-4 w-2/3"></div>

            {/* Chart shimmer area */}
            <div
                className="mt-2 px-2 py-3 rounded"
                style={{ background: "rgba(184, 1, 192, 0.10)" }}
            >
                <div className="h-[12px] w-4/5 bg-gray-200 rounded mb-2"></div>
                <div className="flex justify-between text-xs mt-2">
                    <div className="h-3 w-6 bg-gray-200 rounded"></div>
                    <div className="h-3 w-6 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
};
export default function PlayerDetailPage({ id }: { id: number }) {
    const [search, setSearch] = React.useState("");
    const { data } = useGetPlayerByIdQuery({ id }, {
        skip: !id
    })
    const { data: userBalance, isLoading: loadingBalance } = useGetPlayerBalanceByIdQuery(
        { id: String(id) },
        { skip: !id }
    );

    const { date } = formatDateTime(data?.data?.registered_date as string);

    const gameInfo = userBalance?.data?.game_information;
    return (
        <>
            <section className="player__detail__intro mb-12 lg:mb-16">
                <div className="grid grid-cols-12 gap-8 lg:gap-10">
                    <div className="col-span-12 md:col-span-5">
                        <div className="player__info text-center  rounded-xl lg:rounded-3xl border border-gray p-8 lg:py-10 lg:px-9">
                            <div className="player__profile bg-primary-grad p-[1px] rounded-full max-w-fit mx-auto relative">
                                <Image src={"/assets/images/auth-image.png"} alt='' width={100} height={100} className=' aspect-square rounded-full border-[5px] border-solid border-white' />
                                <div className="absolute left-[50%] translate-x-[-50%] bottom-[-10px]">
                                    <EditIcon />
                                </div>
                            </div>
                            <h1 className="text-24 lg:text-[32px] text-title my-1">{data?.data?.name}</h1>

                            <p className="text-para-light text-[11px] lg:text-[14px]">Joined: {date}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                                <div className="col-span-1 md:col-span-2 bg-light-gray rounded-[14px] p-4 lg:py-6">
                                    <div className="flex justify-center items-center gap-3">
                                        <Image src={data?.data?.profile_image_file || "/assets/images/current-balance.svg"} alt='' width={48} height={48} />
                                        <div className="content mt-3 text-start">
                                            <strong className="text-[12px] leading-[120%] font-[700] text-primary block ">${userBalance?.data?.current_balance || 0}</strong>
                                            <span className="text-para-light text-[9px]">Current Balance</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1 bg-light-gray rounded-[14px] p-4 lg:py-6">
                                    <Image src={"/assets/images/deposit.svg"} alt='' width={48} height={48} className='mx-auto' />
                                    <div className="content mt-3 ">
                                        <strong className="text-[12px] leading-[120%] font-[700] text-primary block ">${userBalance?.data?.total_deposited || 0}</strong>
                                        <span className="text-para-light text-[9px]">Total Deposited</span>
                                    </div>
                                </div>
                                <div className="col-span-1 bg-light-gray rounded-[14px] p-4 lg:py-6">
                                    <Image src={"/assets/images/withdrawn.svg"} alt='' width={48} height={48} className='mx-auto' />
                                    <div className="content mt-3">
                                        <strong className="text-[12px] leading-[120%] font-[700] text-primary block ">${userBalance?.data?.total_withdrawn || 0}</strong>
                                        <span className="text-para-light text-[9px]">Total Withdrawn</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-7">
                        <div className="bg-white rounded-3xl p-6 lg:p-10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl lg:text-2xl font-semibold">Player Details</h2>
                                <Link href={`/players/2`} className="ss-btn bg-primary-grad text-white max-w-fit">
                                    Edit Player Details
                                </Link>
                            </div>

                            <ul className="">
                                <li className="grid grid-cols-2 gap-y-4 gap-x-8 pb-4 mb-4 border-b border-b-gray">
                                    <p className="text-[16px] font-[400] text-title">First Name</p>
                                    <p className="text-para-light">{data?.data?.first_name}</p>
                                </li>

                                <li className="grid grid-cols-2 gap-y-4 gap-x-8 pb-4 mb-4 border-b border-b-gray">
                                    <p className="text-[16px] font-[400] text-title">Last Name</p>
                                    <p className="text-para-light">{data?.data?.last_name}</p>
                                </li>

                                <li className="grid grid-cols-2 gap-y-4 gap-x-8 pb-4 mb-4 border-b border-b-gray">
                                    <p className="text-[16px] font-[400] text-title">Display Name</p>
                                    <p className="text-para-light">{data?.data?.name}</p>
                                </li>

                                <li className="grid grid-cols-2 gap-y-4 gap-x-8 pb-4 mb-4 border-b border-b-gray">
                                    <p className="text-[16px] font-[400] text-title">Email Address</p>
                                    <p className="text-para-light">{data?.data?.email}</p>
                                </li>

                                <li className="grid grid-cols-2 gap-y-4 gap-x-8 pb-4 mb-4 border-b border-b-gray">
                                    <p className="text-[16px] font-[400] text-title">Phone Number</p>
                                    <p className="text-para-light">{data?.data?.phone || "N/A"}</p>
                                </li>

                                <li className="grid grid-cols-2 gap-y-4 gap-x-8 pb-4 mb-4 border-b border-b-gray">
                                    <p className="text-[16px] font-[400] text-title">Address Line</p>
                                    <p className="text-para-light">{data?.data?.address || "N/A"}</p>
                                </li>

                                {/* <li className="grid grid-cols-2 gap-y-4 gap-x-8 pb-4 mb-4 border-b border-b-gray">
                                    <p className="text-[16px] font-[400] text-title">State</p>
                                    <p className="text-para-light">{data?.data?.sta || "N/A"}</p>
                                </li> */}

                                {/* <li className="grid grid-cols-2 gap-y-4 gap-x-8 pb-4 mb-4 border-b border-b-gray">
                                    <p className="text-[16px] font-[400] text-title">City</p>
                                    <p className="text-para-light">{data?.data?.phone || "N/A"}</p>
                                </li> */}

                                <li className="grid grid-cols-2 gap-y-4 gap-x-8 pb-4 mb-4 border-b border-b-gray">
                                    <p className="text-[16px] font-[400] text-title">Wallet Address</p>
                                    <p className="text-para-light">{data?.data?.wallet_address || "N/A"}</p>
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>
            </section>

            {loadingBalance ? (
                <section className="player__current__holdings mb-8 lg:mb-16">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div className="col-span-1" key={i}>
                                <CreditCardShimmer />
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                gameInfo && (
                    <section className="player__current__holdings mb-8 lg:mb-16">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {Object.keys(gameInfo).map((key) => {
                                const info = gameInfo[key];
                                if (!info) return null;
                                const game = {
                                    name: info.game_name,
                                    amount: info.balance,
                                    percentage: info.percentage,
                                    logo: info.game_logo,
                                    type: info.type,
                                    username: info.name
                                };

                                return (
                                    <div className="col-span-1" key={key}>
                                        <CreditCard game={game} />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}


            {/* <TransactionBlock /> */}
            <div className="section-title mb-4">
                <h2 className="text-[20px] leading-[140%] font-[600]">
                    All Transactions
                </h2>
            </div>
            <div className="border-gray border-solid border-[1px] rounded-[8px] lg:rounded-[16px]">
                {/* <TableHeader search={search} setSearch={setSearch} onDownloadCSV={() => { }} /> */}
                {data?.data?.id ? <TransactionTable setSearch={setSearch} search={search} user_id={data?.data?.id} /> : ""}
                {/* <GameTransactionTable /> */}
            </div>
        </>
    )
}
