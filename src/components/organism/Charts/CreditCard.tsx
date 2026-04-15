"use client";
import { ApexOptions } from "apexcharts";
import Image from "next/image";
import React from "react";
import Chart from "react-apexcharts";

const CreditCard = ({ game }: { game: any }) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: "bar",
            sparkline: { enabled: true },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: "50%",
                borderRadius: 5,
            },
        },
        colors: ["#D026F7"],
        tooltip: { enabled: false },
        xaxis: {
            min: 0,
            max: 100,
        },
    };

    const chartSeries = [
        {
            data: [game.percentage],
        },
    ];


    return (
        <div className=" rounded-lg p-3 border border-gray">
            <Image src={game?.logo || "/assets/images/auth-image.png"} alt='' width={32} height={32} className='aspect-square rounded-sm' />
            <strong className="block text-[16px] leading-[120%] font-[600] tet-title mt-2 mb-3">{game?.name}</strong>
            {game?.username ? <span className="text-para-light text-[12px] block mb-3">{game?.username || "username"}</span> : ""}

            <div className="chart__wrapper mt-2 px-2 py-3" style={{
                background: "rgba(184, 1, 192, 0.10)",
                borderRadius: "4px"
            }}>
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                    height={12}
                    width={"80%"}
                />
                <div className="flex justify-between text-xs mt-2" >
                    <span>{game.type === "gc" ? "" : "$"}{game.amount}</span>
                    {game.type === "gc" ? "" : <span>{game.percentage}%</span>}
                </div>
            </div>
        </div>
    );
};

export default CreditCard;
