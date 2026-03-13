"use client"

import WithdrawlPage from '@/components/pages/dashboard/userDashboard/withdrawl';
import { useGetAllGamesForUserQuery } from '@/services/gameApi';
import { useGetUserGameBalanceQuery } from '@/services/transaction';

export default async function Withdrawl() {
    const { data: games } = useGetAllGamesForUserQuery();
    const { data: coins } = useGetUserGameBalanceQuery();
    return (
        <WithdrawlPage games={games} coins={coins} />
    )
}
