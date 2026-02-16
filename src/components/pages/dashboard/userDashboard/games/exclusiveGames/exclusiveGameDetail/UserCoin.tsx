"use client"

import { useAppSelector } from '@/hooks/hook'
import GoldCoinIcon from '@/icons/GoldCoinIcon'
import SilverCoinIcon from '@/icons/SilverCoinIcon'
import { Box } from '@mui/material'
import { useGetUserBalanceBySlugQuery } from '../../../../../../../services/transaction'

export default function UserCoin({ slug }: { slug: string }) {
    const { data } = useGetUserBalanceBySlugQuery({ slug });
    const user = useAppSelector((s) => s ? s.auth.user : "");
    if (!user) {
        return "";
    }

    const newBalance = useAppSelector((state) => state.userBalanceSlice);
    const providerBalance = newBalance.providerAndBalance.find(
        (item: any) => item.provider === slug
    );

    return (
        <Box sx={{
            background: "linear-gradient(0deg, rgba(234, 47, 231, 0.10) 0%, rgba(234, 47, 231, 0.10) 100%)",
            borderRadius: "16px"
        }} className="flex justify-center items-center gap-2 py-4 px-6 glass ">
            {slug === "goldcoincity" ? <GoldCoinIcon /> : <SilverCoinIcon />}
            <div className="coins">
                <strong className="text-[16px] leading-4 font-[600] block mb-1">{providerBalance?.balance ?? 0}</strong>
                <span className="text-[12px]  block">{slug === "goldcoincity" ? "Gold Coins" : "Current Sweep Coins"}</span>
            </div>
        </Box>
    )
}
