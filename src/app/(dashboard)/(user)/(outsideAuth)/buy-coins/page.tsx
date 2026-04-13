import BuyCoinGameListPage from '@/components/pages/dashboard/userDashboard/buyCoins';
import { getAllGames, getUserGameBalance } from '@/serverApi/game';

export default async function BuyCoins() {
    const games = await getAllGames();
    const coins = await getUserGameBalance();
    return (
        <BuyCoinGameListPage games={games} coins={coins} />
    )
}
