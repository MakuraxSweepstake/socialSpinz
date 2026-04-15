"use client"

import CustomLightGallery from '@/components/organism/LightGallery';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useParams } from 'next/navigation';
import { useGetGameByIdQuery } from '@/services/gameApi';
import { PATH } from '@/routes/PATH';
import { renderHTML } from '@/utils/RenderHTML';
import TransactionTable from '../../transaction/TransactionTable';

export default function GameDetailPage() {
    const params = useParams();
    const id = params.slug;
    const [search, setSearch] = React.useState("");
    const { data } = useGetGameByIdQuery({ id: Number(id) })

    const screenshots = data?.data?.screenshots || [];

    const relatedGames = data?.data?.subgames || [];

    return (
        <>
            <section className="game__detail__intro mb-14">
                <div className="lg:grid grid-cols-12 gap-8 xl:gap-10">
                    {data?.data?.thumbnail ? <div className="lg:col-span-5 xl:col-span-4 game__featured__image relative aspect-[338/338] rounded-[10px] overflow-hidden">
                        <Image src={data?.data?.thumbnail || ""} alt="Game Name" fill className="object-cover" />
                    </div> : null}
                    <div className="game__content lg:col-span-7 xl:col-span-8 mt-6 lg:mt-0">
                        <div className="flex items-start justify-between pb-6 mb-6 border-b-[1px] border-solid border-[rgba(0,0,0,0.1)]">
                            <div className="section__title">
                                {
                                    data?.data?.active_users ?
                                        <strong className="text-bold block mb-6 text-[12px]">
                                            Active Players:{" "}
                                            <span className="bg-primary-light rounded-[20px] py-1 px-2">
                                                {data.data.active_users}
                                            </span>
                                        </strong> : ""
                                }

                                {data?.data?.name ? <h1 className='text-[24px] leading-[133%] mb-4'>{data?.data?.name}</h1> : ""}
                                <ul className="flex justify-start items-center gap-12">
                                    {data?.data?.category ? <li className='flex gap-2' >
                                        <p className="mb-1 text-[14px] leading-[120%] text-para-light">
                                            Type:
                                        </p>
                                        <strong className="text-[14px] leading-[120%] font-[500] text-title">
                                            {data?.data?.category}
                                        </strong>
                                    </li> : ""}
                                    {data?.data?.category ?
                                        <li className='flex gap-2' >
                                            <p className="mb-1 text-[14px] leading-[120%] text-para-light">
                                                Provider:
                                            </p>
                                            <strong className="text-[14px] leading-[120%] font-[500] text-title">
                                                {data?.data?.provider}
                                            </strong>
                                        </li> : ""}
                                </ul>
                            </div>
                            <Link
                                href={`${PATH.ADMIN.GAMES.EDIT_GAME.ROOT}/${data?.data?.id}`}
                                className='ss-btn bg-primary-grad max-w-fit text-white'
                            >
                                Edit Game Details
                            </Link>

                        </div>

                        {data?.data?.description ? <div className="general-content-box content mb-6">
                            {renderHTML(data.data.description)}
                        </div> : ""}

                        <div className="game__key__highlight flex justify-between lg:flex-row flex-col gap-4 py-5 px-6 bg-[rgba(143,167,226,0.10)] rounded-[8px]">
                            <div className="highlight">
                                <p className='text-[12px] leading-[120%] font-[500] text-para-light'>This week total Screentime</p>
                                <strong className='text-[16px] leading-[120%] font-[600]'>689hr</strong>
                            </div>
                            <div className="highlight">
                                <p className='text-[12px] leading-[120%] font-[500] text-para-light'>Available Credit</p>
                                <strong className='text-[16px] leading-[120%] font-[600]'>$326,126.05 <span className='text-[12px] leading-[120%] font-[500] text-para-light'>/100,000</span></strong>
                            </div>
                            <div className="highlight">
                                <p className='text-[12px] leading-[120%] font-[500] text-para-light'>Unsettled Credit</p>
                                <strong className='text-[16px] leading-[120%] font-[600]'>$326,126.05 <span className='text-[12px] leading-[120%] font-[500] text-para-light'>/100,000</span></strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {screenshots.length ? <section className="game__screenshots mb-14">
                <div className="section-title mb-4">
                    <h2 className="text-[20px] leading-[140%] font-[600]">
                        Uploaded Game-Screenshots
                    </h2>
                </div>
                <CustomLightGallery images={screenshots} />
            </section> : null}


            {relatedGames.length ? <section className="game__screenshots mb-14">
                <div className="section-title mb-4">
                    <h2 className="text-[20px] leading-[140%] font-[600]">
                        Games Under {data?.data?.name}
                    </h2>
                </div>
                <CustomLightGallery images={relatedGames} aspectRatio='aspect-[148/164]' column="7" />
            </section> : null}

            {/* <TransactionBlock /> */}
            <div className="section-title mb-4">
                <h2 className="text-[20px] leading-[140%] font-[600]">
                    All Transactions
                </h2>
            </div>
            <div className="border-gray border-solid border-[1px] rounded-[8px] lg:rounded-[16px]">
                {/* <TableHeader search={search} setSearch={setSearch} onDownloadCSV={() => { }} /> */}
                {data?.data?.id ? <TransactionTable game_id={data?.data?.id} search={search} setSearch={setSearch} /> : ""}
            </div>

        </>
    )
}
