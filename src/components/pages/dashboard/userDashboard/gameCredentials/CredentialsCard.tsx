"use client";

import GlassWrapper from "@/components/molecules/GlassWrapper";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import TapIcon from "@/icons/Tap";
import { useChangeUserGamePasswordMutation } from "@/services/userApi";
import { openPasswordDialog } from "@/slice/updatePasswordSlice";
import { CredentialsProps } from "@/types/game";
import { CircularProgress } from "@mui/material";
import { Coin } from "@wandersonalwes/iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import GameIframeDialog from "../games/exclusiveGames/exclusiveGameDetail/GameIframeDialog";
import BalanceRefresh from "./BalanceRefresh";
import { CardPasswordField } from "./CardPasswordHandler";
import CopyToClipboard from "./CopyToClipboard";
import ResetPasswordDialog from "./ResetPasswordDialog";
import { useGetUserBalanceBySlugQuery } from "../../../../../services/transaction";

export default function CredentialsCard({ cred }: { cred: CredentialsProps }) {
    const {
        data: balanceData,
        isLoading: balanceLoading,
        isFetching,
        refetch,
    } = useGetUserBalanceBySlugQuery(
        { slug: cred?.name },
        { skip: !cred?.name }
    ) as any;
    const [openDialog, setOpenDialog] = useState(false);
    const handleDialogOpen = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpenDialog(true);
    };

    const handleDialogClose = () => setOpenDialog(false);
    const balance = balanceData?.data || null;



    const [resetGamePassord, { isLoading }] = useChangeUserGamePasswordMutation();
    const dispatch = useAppDispatch();

    const newBalance = useAppSelector((state) => state.userBalanceSlice);
    console.log("newBalance in cred card:", newBalance);
    const providerBalance: any = newBalance.providerAndBalance
        ?.find((item: any) => item?.provider === cred.name);
    return (
        <GlassWrapper className="p-4 lg:p-6">
            {/* Header Section */}
            <div className="credentials__header flex gap-2">
                <Image
                    src={cred?.logo || "/assets/images/fallback.png"}
                    alt={cred?.full_name}
                    width={74}
                    height={74}
                    className="rounded-full aspect-square w-[74px] h-[74px]"
                    // ✅ Next.js LCP warning fix
                    priority={true}
                />
                <div className="game__detail flex flex-col">
                    <strong className="block text-[16px] text-white">
                        {cred.full_name}
                    </strong>

                    {balanceLoading ? (
                        <div className="flex items-center gap-2 mb-2">
                            <CircularProgress size={10} thickness={5} color="inherit" />
                            <span className="text-gray-400 text-[10px]">
                                Updating balance...
                            </span>
                        </div>
                    ) : (
                        <p className="text-[14px] my-[6px] uppercase">
                            <p className="text-[14px] my-[6px] uppercase">
                                {providerBalance
                                    ? `${providerBalance.flag.toUpperCase()}: ${providerBalance?.balance}`
                                    : "Balance: 0"}
                            </p>

                        </p>
                    )}

                    {/* Refresh Button */}
                    <BalanceRefresh
                        label="Refresh Balance"
                        icon={true}
                        onClick={() => {
                            if (balance?.has_changed_password) {
                                console.log("password changes");
                                dispatch(openPasswordDialog({
                                    provider: cred?.name,
                                }));
                            }
                            else {
                                console.log("password not changes");
                                refetch();
                            }
                        }}
                        loading={isFetching}
                    />
                </div>
            </div>



            <ResetPasswordDialog
                open={openDialog}
                onClose={handleDialogClose}
                name={cred?.name || ""}
            />

            {/* Credentials Info */}
            <ul className="mt-4">
                <li className="py-2 border-t border-b border-[rgba(255,255,255,0.2)] grid grid-cols-2">
                    <span className="text-[12px] leading-[120%] font-[600]">Entries :</span>
                    <span className="text-[11px]">{cred.entries || "N/A"}</span>
                </li>
                <li className="py-2 border-b border-[rgba(255,255,255,0.2)] grid grid-cols-2">
                    <span className="text-[12px] leading-[120%] font-[600]">Username :</span>
                    <div className="flex justify-between items-center">
                        <span className="text-[11px]">
                            {cred?.credentials.username || "N/A"}
                        </span>
                        {cred.credentials.username && (
                            <CopyToClipboard text={cred.credentials.username} />
                        )}
                    </div>
                </li>
                <li className="py-2 border-b border-[rgba(255,255,255,0.2)] grid grid-cols-2">
                    <span className="text-[12px] leading-[120%] font-[600]">Password :</span>
                    <CardPasswordField password={cred?.credentials.password} />
                </li>
            </ul>

            {/* Action Buttons */}
            <div className="action__group mt-4 flex flex-col md:flex-row justify-between gap-2 md:gap-4 flex-wrap">
                <Link
                    href={cred?.name === "goldcoincity" ? "/buy-coins" : `/buy-coins/${cred?.id}`}
                    className="ss-btn bg-primary-grad flex justify-center items-center gap-1"
                    onClick={(e) => {
                        if (balance?.has_changed_password) {
                            e.preventDefault();
                            console.log("password changes");
                            dispatch(openPasswordDialog({
                                provider: cred?.name,
                            }));
                        }
                    }}
                >
                    <Coin /> Buy Coins
                </Link>

                {!cred.is_iframe ? (
                    <Link
                        href={cred?.game_url}
                        className="ss-btn bg-secondary-grad flex justify-center items-center text-[#426A66] gap-2"
                        target="_blank"
                    >
                        <TapIcon />
                        Play Game
                    </Link>
                ) : (
                    <GameIframeDialog
                        gameName={cred?.full_name}
                        gameUrl={cred?.game_url || ""}
                        isCredCard={true}
                    />
                )}

            </div>
            {cred?.can_change_password ? < p className="text-[14px] mt-2">
                Forgot your password? <a href="" className="text-secondary" onClick={!cred?.custom_password ? (e) => {
                    e.preventDefault();
                    resetGamePassord({ password: "", confirm_password: "", name: cred?.name });
                } : handleDialogOpen}>{isLoading ? "Changing Password" : "Click here to reset it."}</a>
            </p> : ""}
        </GlassWrapper >
    );
}
