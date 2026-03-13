"use client";

import { BannerProps } from "@/types/setting";
import { renderHTML } from "@/utils/RenderHTML";
import { Button } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function Dashboard({ slides }: { slides: BannerProps[] }) {
    const [current, setCurrent] = useState(0);

    const handleDragEnd = (_: any, info: any) => {
        const swipeThreshold = 100;
        if (info.offset.x < -swipeThreshold && current < slides.length - 1) {
            setCurrent((prev) => prev + 1);
        } else if (info.offset.x > swipeThreshold && current > 0) {
            setCurrent((prev) => prev - 1);
        }
    };

    return (
        <div className="dashboard__root relative w-full mx-auto rounded-2xl mb-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={slides[current]?.name || current}
                    className="relative md:aspect-[1105/240] aspect-video rounded-3xl overflow-hidden flex justify-center items-center text-center cursor-grab active:cursor-grabbing"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.6 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                >
                    <Image
                        src={slides[current].image_url || ""}
                        alt={slides[current].name || ""}
                        fill
                        className="object-cover z-[-1]"
                    />

                    <div className="content relative z-0 px-6">
                        <div className="content relative z-0 px-6 text-center">
                            {slides[current]?.name && (
                                <h1 className="text-[32px] md:text-[48px] leading-[50%] text-[#3A013F] mb-8">
                                    {slides[current].name}
                                </h1>
                            )}

                            {slides[current]?.description && (
                                <p className="text-[#600167] text-[13px] leading-[120%] font-[700] mb-5 banner-desc">
                                    {renderHTML(slides[current].description)}
                                </p>
                            )}

                            {slides[current]?.cta_link && (
                                <Button
                                    variant="contained"
                                    sx={{
                                        borderRadius: 27,
                                        background:
                                            "linear-gradient(270deg, #F9B901 0.09%, #D09F12 95.19%)",
                                    }}
                                    onClick={() => window.open(slides[current].cta_link, "_blank")}
                                >
                                    Play Now
                                </Button>
                            )}
                        </div>

                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="justify-center flex gap-2 mt-4">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-[8px] p-0 cursor-pointer  ${i === current ? "bg-white w-[24px]" : "bg-gray-400 w-[8px]"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
