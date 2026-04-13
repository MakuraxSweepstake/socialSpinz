"use client";

import GlassWrapper from '@/components/molecules/GlassWrapper';
import { useAppDispatch } from '@/hooks/hook';
import GoldCoinIcon from '@/icons/GoldCoinIcon';
import { useGetTransactionLimitsQuery } from '@/services/settingApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { Box, Button, OutlinedInput } from '@mui/material';
import { Coin } from '@wandersonalwes/iconsax-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CoinCalculator({ slug }: { slug: string }) {
    const [amount, setAmount] = useState<number | "">("");
    const [baseCoins, setBaseCoins] = useState<number | null>(null);
    const [_bonusCoins, setBonusCoins] = useState<number | null>(null);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data: limitsData } = useGetTransactionLimitsQuery();
    const minDeposit = limitsData?.data?.min_deposit ?? 20;
    const maxDeposit = limitsData?.data?.max_deposit ?? null;

    // const calculateBonus = (amount: number) => {
    //     return Math.max(Math.round(25.56 * amount - 27.78), 0);
    // };

    const handleCalculate = () => {
        if (amount && amount > 0) {
            const base = amount * 100;
            // const bonus = calculateBonus(amount);
            setBaseCoins(base);
            // setBonusCoins(bonus);
        } else {
            setBaseCoins(null);
            setBonusCoins(null);
        }
    };

    const handleEdit = () => {
        setAmount("");
        setBaseCoins(null);
        setBonusCoins(null);
    };

    const handleBuy = () => {
        if (Number(amount) < minDeposit) {
            return dispatch(showToast({ message: `Minimum deposit is $${minDeposit}`, variant: ToastVariant.ERROR }));
        }
        if (maxDeposit !== null && Number(amount) > maxDeposit) {
            return dispatch(showToast({ message: `Maximum deposit is $${maxDeposit}`, variant: ToastVariant.ERROR }));
        }
        router.push(`/buy-coins/${slug}/checkout?amount=${amount}&bonus=${amount}`);
    };

    return (
        <GlassWrapper className='h-full'>
            <Box className="coin__card" sx={{
                padding: "16px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
                <div className="title">
                    <h2 className='text-[28px]'>Custom</h2>
                    <span className='text-[12px]'>$1 = 100 Gold Coins &nbsp;·&nbsp; Min ${minDeposit}{maxDeposit !== null ? ` / Max $${maxDeposit}` : ""}</span>
                </div>

                <div className="footer">
                    {baseCoins && baseCoins > 0 ? (
                        <>
                            <div className="coin-info mt-10 flex justify-between items-center py-3 px-4 mb-4"
                                style={{
                                    borderRadius: "16px",
                                    background: "linear-gradient(0deg, rgba(234, 47, 231, 0.10) 0%, rgba(234, 47, 231, 0.10) 100%), rgba(255, 255, 255, 0.10)"
                                }}
                            >
                                <div className="coin flex gap-1">
                                    <GoldCoinIcon />
                                    <p>
                                        <strong className='text-[16px] block'>{baseCoins}</strong>
                                        <span className='text-[12px]'>Gold Coins</span>
                                    </p>
                                </div>
                                <div className="bonus">
                                    <strong className='text-[16px] block'>+ {amount} Bonus</strong>
                                    {/* <span className='text-[12px]'>bonus</span> */}
                                </div>
                            </div>

                            {/* Navigate dynamically using router.push */}
                            <Button
                                variant="contained"
                                color="primary"
                                className='ss-btn bg-primary-grad !text-white flex justify-center items-center'
                                onClick={handleBuy}
                            >
                                <Coin /> Buy Coins
                            </Button>

                            <Button variant="contained" color="secondary" className='!mt-4' onClick={handleEdit}>
                                Edit Amount
                            </Button>
                        </>
                    ) : (
                        <>
                            <OutlinedInput
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                                placeholder="Enter amount"
                                inputProps={{ min: 1 }}
                            />
                            <Button variant="contained" color="primary" className='!mt-4' onClick={handleCalculate}>
                                Calculate
                            </Button>
                        </>
                    )}
                </div>
            </Box>
        </GlassWrapper>
    );
}
