"use client";

import GlassWrapper from '@/components/molecules/GlassWrapper';
import PaymentModal from '@/components/molecules/PaymentModal';
import { useAppDispatch } from '@/hooks/hook';
import BitCoinIcon from '@/icons/BitCoinIcon';
import GoldCoinIcon from '@/icons/GoldCoinIcon';
import { useDepositMutation } from '@/services/transaction';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { Box, Button } from '@mui/material';
import { Card, TickCircle } from '@wandersonalwes/iconsax-react';
import Image from 'next/image';
import { useState } from 'react';
import PaymentForm from './FortPay';

export type PaymentModeProps = "crypto" | "fortpay"

export default function CheckoutPage({ amount, slug, bonus }: {
    amount: number;
    slug: string;
    bonus: number
}) {
    const dispatch = useAppDispatch();
    const [getPaymentLink, { isLoading: gettingLink }] = useDepositMutation();
    const [currentPaymentMode, setCurrentPaymentMode] = useState<PaymentModeProps>("crypto");
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    return (
        <section className="checkout__root">
            <div className="grid grid-cols-12 gap-4 lg:gap-10 xl:gap-12">
                <div className="col-span-12 lg:col-span-4 ">
                    <Box className="coin__card" sx={{
                        borderRadius: "16px",
                        padding: "16px",
                        border: '1px solid  #B801C0',
                        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), rgba(255, 255, 255, 0.10)',
                        boxShadow: '0 0 24px 0 rgba(234, 3, 91, 0.20)'
                    }}>
                        <div className="title">
                            <h2 className='text-[28px]'>${amount}</h2>
                        </div>

                        <div className="footer mt-10">
                            <div className="coin-info flex justify-between items-center py-3 px-4"
                                style={{
                                    borderRadius: "16px",
                                    background: "linear-gradient(0deg, rgba(234, 47, 231, 0.10) 0%, rgba(234, 47, 231, 0.10) 100%), rgba(255, 255, 255, 0.10)"
                                }}
                            >
                                <div className="coin flex items-center gap-1">
                                    <GoldCoinIcon />
                                    <span className='text-[12px]'>Gold Coins</span>
                                </div>
                                <p>
                                    <strong className='text-[16px] block'>{amount ? amount * 100 : ""}</strong>
                                </p>
                            </div>
                            <div className="coin-info flex justify-between items-center py-3 px-4 mt-1"
                                style={{
                                    borderRadius: "16px",
                                    background: "linear-gradient(0deg, rgba(234, 47, 231, 0.10) 0%, rgba(234, 47, 231, 0.10) 100%), rgba(255, 255, 255, 0.10)"
                                }}
                            >
                                <div className="coin flex items-center gap-1">
                                    <GoldCoinIcon />
                                    <span className='text-[12px]'>Free Sweeps Coins</span>
                                </div>
                                <p>
                                    <strong className='text-[16px] block'>{bonus}</strong>
                                </p>
                            </div>
                        </div>
                    </Box>
                </div>

                <div className="col-span-12 lg:col-span-8">
                    <Box>
                        <h1 className='mb-2 text-[24px] lg:text-[32px]'>Payment Method</h1>
                        <p className='text-[11px] lg:text-[13px]'>To start playing and cashing out your winnings, you'll need a crypto wallet to purchase E-Credits and receive payouts. Don't worry—it's quick and easy!</p>

                        <h2 className='text-[20px] lg:text-[24px] mt-8 mb-4'>Select payment method</h2>

                        <div className="grid sm:grid-cols-2 mb-8 gap-6">
                            <div className="col-span-1">
                                <GlassWrapper>
                                    <div
                                        className="py-5 px-4 flex justify-between items-center cursor-pointer"
                                        onClick={() => setCurrentPaymentMode("crypto")}
                                    >
                                        <span className="text-[14px] flex items-center justify-start gap-2">
                                            <BitCoinIcon />Crypto Currency
                                        </span>
                                        {currentPaymentMode === "crypto" ? <TickCircle /> : ""}
                                    </div>
                                </GlassWrapper>
                            </div>
                            <div className="col-span-1">
                                <GlassWrapper>
                                    <div
                                        className="py-5 px-4 flex justify-between items-center cursor-pointer"
                                        onClick={() => setCurrentPaymentMode("fortpay")}
                                    >
                                        <span className="text-[14px] flex items-center justify-start gap-2">
                                            <Card />Card Payments
                                        </span>
                                        {currentPaymentMode === "fortpay" ? <TickCircle /> : ""}
                                    </div>
                                </GlassWrapper>
                            </div>
                        </div>

                        {currentPaymentMode === "fortpay" && (
                            <PaymentForm id={slug} amount={amount} type={currentPaymentMode as PaymentModeProps} />
                        )}

                        {currentPaymentMode === "crypto" && (
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                className='!mt-3'
                                onClick={async () => {
                                    try {
                                        const response = await getPaymentLink({
                                            id: slug,
                                            amount,
                                            type: currentPaymentMode as PaymentModeProps
                                        }).unwrap();
                                        setPaymentUrl(response?.data?.payment_url);
                                        setShowPaymentModal(true);

                                    } catch (e: any) {
                                        dispatch(
                                            showToast({
                                                message: e?.data?.message || "Something went wrong",
                                                variant: ToastVariant.ERROR
                                            })
                                        );
                                    }
                                }}
                            >
                                {gettingLink ? "Proceeding to Payment..." : "Proceed to Payment"}
                            </Button>
                        )}

                        <p className="text-[11px] leading-[120%] mt-8 mb-2 text-center">Powered By</p>
                        <div className="flex justify-center items-center gap-4">
                            <Image src="/assets/images/payment-01.png" alt='' width={78} height={24} />
                            <Image src="/assets/images/payment-02.png" alt='' width={78} height={24} />
                            <Image src="/assets/images/payment-03.png" alt='' width={78} height={24} />
                        </div>
                    </Box>
                </div>
            </div>

            {/* Payment Modal for Crypto Payments */}
            {paymentUrl && (
                <PaymentModal
                    url={paymentUrl}
                    isOpen={showPaymentModal}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setPaymentUrl(null);
                    }}
                    onSuccess={() => {
                        dispatch(
                            showToast({
                                message: "Payment processing initiated. Please wait...",
                                variant: ToastVariant.SUCCESS,
                                autoTime: true
                            })
                        );
                        // The actual success will be handled by the payment provider's redirect
                        // to /buy-coins/[slug]/success
                    }}
                    onError={(error) => {
                        dispatch(
                            showToast({
                                message: `Payment failed: ${error.message}`,
                                variant: ToastVariant.ERROR,
                                autoTime: true
                            })
                        );
                    }}
                    title="Processing Payment"
                    successMessage="success"
                    isPurchaseFlow={true}
                />
            )}
        </section>
    );
}