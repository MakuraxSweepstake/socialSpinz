
"use client";
import BuyCoinGameListPage from '@/components/pages/dashboard/userDashboard/buyCoins';
import { useGetAllGamesForUserQuery } from '@/services/gameApi';
import { useGetUserGameBalanceQuery } from '@/services/transaction';

export default function BuyCoins() {
    const { data: games } = useGetAllGamesForUserQuery();
    const { data: coins } = useGetUserGameBalanceQuery();

    return (
        <BuyCoinGameListPage games={games} coins={coins} />
    )
}
