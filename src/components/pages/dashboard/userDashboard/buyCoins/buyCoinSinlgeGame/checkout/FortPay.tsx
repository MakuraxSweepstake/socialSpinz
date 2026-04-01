

'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { useDepositMutation } from '@/services/transaction';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { DepositProps, PaymentModeProps } from '@/types/transaction';
// import { backupAuthToCookies } from '@/utils/authSession';
import { Box, Button, FormHelperText, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useState } from 'react';

declare global {
    interface Window {
        CollectJS: {
            configure: (config: object) => void;
            startPaymentRequest: () => void;
        };
    }
}

type CardFieldValidity = {
    ccnumber: boolean;
    ccexp: boolean;
    cvv: boolean;
};

export default function PaymentForm({ id, amount, type }: DepositProps & { type: PaymentModeProps }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const [payViaFortPay, { isLoading }] = useDepositMutation();
    const [loadingToken, setLoadingToken] = useState(false);

    const [cardValidity, setCardValidity] = useState<CardFieldValidity>({
        ccnumber: false,
        ccexp: false,
        cvv: false,
    });
    const [cardTouched, setCardTouched] = useState(false);

    const formik = useFormik({
        initialValues: {
            fname: user?.first_name || '',
            lname: user?.last_name || '',
            address1: user?.address || '',
            city: user?.city || '',
            state: user?.state || '',
            zip: '',
        },
        // validationSchema: billingSchema,
        onSubmit: () => {
            setCardTouched(true);
            const allCardValid = cardValidity.ccnumber && cardValidity.ccexp && cardValidity.cvv;
            if (!allCardValid) return;

            if (typeof window !== 'undefined' && window.CollectJS) {
                window.CollectJS.startPaymentRequest();
            }
        },
    });

    const handleCollectJSLoad = () => {
        if (typeof window === 'undefined' || !window.CollectJS) return;
        setLoadingToken(true);
        window.CollectJS.configure({
            variant: 'inline',
            customCss: {
                'border-radius': '27px',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '12px 16px',
                'font-family': 'Inter, sans-serif',
                'font-size': '14px',
                width: '100%',
                'box-sizing': 'border-box',
                color: '#000000',
                '-webkit-text-fill-color': '#000000',
                opacity: '1',
            },
            placeholderCss: {
                color: 'rgba(0,0,0,0.4)',
            },
            callback: async (response: any) => {
                try {
                    console.log("token value is", response);
                    await payViaFortPay({
                        id,
                        amount,
                        type: type as PaymentModeProps,
                        payment_token: response.token,
                        bin: response.card.bin,
                        exp: response.card.exp,
                        number: response.card.number,
                        hash: response.card.hash,
                    }).unwrap();
                    setLoadingToken(false);

                    router.push(`/buy-coins/${id}/success`);
                } catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || 'Unable to deposit',
                            variant: ToastVariant.ERROR,
                        })
                    );
                }
            },
            // CollectJS calls this whenever a field's validity changes
            validationCallback: (field: string, status: boolean, _message: string) => {
                setCardValidity((prev) => ({ ...prev, [field]: status }));
            },

            fields: {
                ccnumber: { selector: '#ccnumber', placeholder: 'Card Number' },
                ccexp: { selector: '#ccexp', placeholder: 'MM / YY' },
                cvv: { selector: '#cvv', placeholder: 'CVV' },
            },
        });
    };


    return (
        <>
            <Script
                src="https://secure.fppgateway.com/token/Collect.js"
                data-tokenization-key="NAhDuk-7V4u2u-tUAsT5-dCqbH5"
                strategy="afterInteractive"
                onReady={handleCollectJSLoad}
            />

            <form className="theForm" onSubmit={formik.handleSubmit} noValidate>
                <div className="formInner flex flex-col gap-3 md:grid md:grid-cols-2">

                    {/* ── Billing fields ── */}
                    <div className="form-group">
                        <InputLabel htmlFor="name">First Name</InputLabel>

                        <OutlinedInput
                            id="fname"
                            name="fname"
                            type="text"
                            placeholder="First Name"
                            value={formik.values.fname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fname && Boolean(formik.errors.fname)}
                            fullWidth
                        />
                        {formik.touched.fname && formik.errors.fname && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.fname}</FormHelperText>
                        )}
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="name">Last Name</InputLabel>

                        <OutlinedInput
                            id="lname"
                            name="lname"
                            type="text"
                            placeholder="Last Name"
                            value={formik.values.lname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lname && Boolean(formik.errors.lname)}
                            fullWidth
                        />
                        {formik.touched.lname && formik.errors.lname && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.lname}</FormHelperText>
                        )}
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="address1">Address</InputLabel>
                        <OutlinedInput
                            id="address1"
                            name="address1"
                            type="text"
                            placeholder="Street Address"
                            value={formik.values.address1}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.address1 && Boolean(formik.errors.address1)}
                            fullWidth
                        />
                        {formik.touched.address1 && formik.errors.address1 && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.address1}</FormHelperText>
                        )}
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="city">City</InputLabel>
                        <OutlinedInput
                            id="city"
                            name="city"
                            type="text"
                            placeholder="City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.city && Boolean(formik.errors.city)}
                            fullWidth
                        />
                        {formik.touched.city && formik.errors.city && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.city}</FormHelperText>
                        )}
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="state">State</InputLabel>
                        <OutlinedInput
                            id="state"
                            name="state"
                            type="text"
                            placeholder="State"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.state && Boolean(formik.errors.state)}
                            fullWidth
                        />
                        {formik.touched.state && formik.errors.state && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.state}</FormHelperText>
                        )}
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="zip">Zip Code</InputLabel>
                        <OutlinedInput
                            id="zip"
                            name="zip"
                            type="text"
                            placeholder="Zip code"
                            value={formik.values.zip}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.zip && Boolean(formik.errors.zip)}
                            fullWidth
                        />
                        {formik.touched.zip && formik.errors.zip && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.zip}</FormHelperText>
                        )}
                    </div>

                    <Typography variant='h6' fontWeight={500}>FortPay Required Fields <span className="text-red-500">*</span></Typography>

                    {/* ── Inline CollectJS card fields ── */}
                    <Box className="md:col-span-2 flex flex-col gap-3 mt-1">

                        <div className="form-group">
                            <InputLabel htmlFor="ccnumber">Card Number<span className="text-red-500">*</span></InputLabel>
                            <Box id="ccnumber" />
                            {cardTouched && !cardValidity.ccnumber && (
                                <FormHelperText error sx={{ ml: '14px' }}>Card number is required</FormHelperText>
                            )}
                        </div>

                        <Box className="flex gap-3">
                            <div className="form-group flex-1">
                                <InputLabel htmlFor="ccexp">Expiration<span className="text-red-500">*</span></InputLabel>
                                <Box id="ccexp" />
                                {cardTouched && !cardValidity.ccexp && (
                                    <FormHelperText error sx={{ ml: '14px' }}>Expiration is required</FormHelperText>
                                )}
                            </div>
                            <div className="form-group flex-1">
                                <InputLabel htmlFor="cvv">CVV<span className="text-red-500">*</span></InputLabel>
                                <Box id="cvv" />
                                {cardTouched && !cardValidity.cvv && (
                                    <FormHelperText error sx={{ ml: '14px' }}>CVV is required</FormHelperText>
                                )}
                            </div>
                        </Box>

                    </Box>
                </div>

                <Button
                    type="submit"
                    id="payButton"
                    variant="contained"
                    color="primary"
                    className="mt-4!"
                    disabled={isLoading}
                >
                    {isLoading  ? 'Processing Payment…' : 'Proceed Payment'}
                </Button>
            </form>

            <div id="paymentTokenInfo" />
        </>
    );
}