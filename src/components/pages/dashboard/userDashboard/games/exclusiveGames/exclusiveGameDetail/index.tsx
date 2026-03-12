
"use client"
import ScreenShotSlider from "@/components/molecules/Sliders/ScreenShotSlider";
import CustomLightGallery from "@/components/organism/LightGallery";
import ProtectedLink from "@/routes/ProtectedLink";
import { useGetSingleGameFormUserQuery } from "@/services/gameApi";
import { renderHTML } from "@/utils/RenderHTML";
import { Box } from "@mui/material";
import Image from "next/image";
import { useParams } from "next/navigation";
import GameCredentialsBlock from "./GameCredentialsBlock";
import GameIframeDialog from "./GameIframeDialog";
import UserCoin from "./UserCoin";

export default function ExclusiveGameDetail() {

    const { id } = useParams();
    const { data: game } = useGetSingleGameFormUserQuery({ id: Number(id) }, { skip: !id });

    if (!game) {
        return;
    }
    return (
        <>
            <section className="detail__banner mb-8">
                <div className="md:grid md:grid-cols-12  flex flex-col gap-8 lg:gap-20">

                    <div className="col-span-12 md:col-span-4">
                        <div className="aspect-[420/433]  relative rounded-xl overflow-hidden mb-4">
                            <Image src={game?.data?.thumbnail || "/assets/images/fallback.png"} fill className="object-cover " alt={game?.data?.name} />
                        </div>
                        <GameCredentialsBlock game={game} />
                    </div>
                    <div className="col-span-12 md:col-span-8">
                        <div className="content__wrapper flex flex-col gap-4">
                            <ul className="flex gap-4">
                                {game?.data?.provider ? <li className="text-[9px] lg:text-[12px] leading-[188%] font-[400] rounded-[8px] px-2 py-[2px] bg-yellow-300 text-title">Game Type : {game?.data?.provider}</li> : ""}
                                {game?.data?.subgames?.length ? <li className="text-[9px] lg:text-[12px] leading-[188%] font-[400] rounded-[8px] px-2 py-[2px] bg-yellow-300 text-title">{game?.data?.subgames.length} Games</li> : ""}
                            </ul>
                            <div className="general-content-box styled-list !text-white">
                                <h1 className="text-[2rem]">{game?.data?.name}</h1>
                                {renderHTML(game?.data?.description)}
                            </div>
                            <div className="action__group flex  flex-col lg:grid lg:grid-cols-3 gap-2">

                                <UserCoin slug={game?.data?.provider} />

                                {game?.data?.provider == "goldcoincity" ? "" :
                                    <Box sx={{
                                        borderRadius: "16px"
                                    }} className="flex justify-center items-center gap-2 py-4 px-6 bg-secondary-grad text-title ss-btn">
                                        <div className="coins ">
                                            <ProtectedLink href={`/buy-coins/${game?.data?.id}`} provider={game?.data?.provider}>
                                                <strong className="text-[16px] leading-4 font-[600] block mb-1">+ Deposit Coins</strong>
                                            </ProtectedLink>
                                        </div>
                                    </Box>}
                                {game?.data?.provider == "goldcoincity" ? "" : <Box sx={{
                                    borderRadius: "16px"
                                }} className="flex justify-center items-center gap-2 py-4 px-6 border border-secondary ss-btn">
                                    <div className="coins">
                                        <ProtectedLink href={`/withdrawl`}>
                                            <strong className="text-[16px] leading-4 font-[600] block mb-1 text-secondary">Withdraw Coins</strong>
                                        </ProtectedLink>
                                    </div>
                                </Box>}

                            </div>



                            {
                                game?.data?.is_iframe
                                    ? (
                                        // <Link className="ss-btn bg-primary-grad" href={"#"} data-iframe-url={game?.data?.game_url}>
                                        //     Play Now
                                        // </Link>
                                        <GameIframeDialog
                                            gameName={game?.data?.name}
                                            gameUrl={game?.data?.game_url || ""}
                                        />
                                    )
                                    : game?.data?.game_url
                                        ? (
                                            <ProtectedLink className="ss-btn bg-primary-grad" href={game.data.game_url} target={game?.data?.has_redirection ? true : false} rel={game?.data?.has_redirection ? "noopener noreferrer" : ""}>
                                                Play Now
                                            </ProtectedLink>
                                        )
                                        : null
                            }



                            {game?.data?.screenshots ? <ScreenShotSlider screenshots={game.data.screenshots} /> : ""}
                        </div>
                    </div>
                </div>
            </section >

            {game?.data?.subgames ? <section className="exclusive__game__gallery">
                <div className="section__title">
                    <h2 className="text-[14px] lg:text-[16px] mb-4">{game?.data?.name}</h2>
                </div>
                <CustomLightGallery images={game?.data?.subgames} column={7} aspectRatio="aspect-[242/242]" />
            </section> : ""}
        </>
    );
}
