'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { useDepositMutation } from '@/services/transaction';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { DepositProps } from '@/types/transaction';
import { Box, Button, FormHelperText, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useRef, useState } from 'react';
import * as Yup from 'yup';
import { PaymentModeProps } from '.';

declare global {
    interface Window {
        CollectJS: {
            configure: (config: object) => void;
            startPaymentRequest: (billing?: {
                billingFirstName?: string;
                billingLastName?: string;
                billingAddress1?: string;
                billingCity?: string;
                billingState?: string;
                billingZip?: string;
                billingCountry?: string;
            }) => void;
        };
    }
}

type CardFieldValidity = {
    ccnumber: boolean;
    ccexp: boolean;
    cvv: boolean;
};

const billingSchema = Yup.object({
    first_name: Yup.string().required('First name is required').min(1, 'First name is required'),
    last_name: Yup.string().required('Last name is required').min(1, 'Last name is required'),
    address: Yup.string().required('Address is required').min(1, 'Address is required'),
    city: Yup.string().required('City is required').min(1, 'City is required'),
    state: Yup.string().required('State is required').min(1, 'State is required'),
    zip: Yup.string()
        .required('Zip code is required')
        .min(1, 'Zip code is required')
        .matches(/^\d{5}(-\d{4})?$/, 'Enter a valid zip code'),
});



export default function PaymentForm({ id, amount, type }: DepositProps & { type: PaymentModeProps }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const [payViaFortPay, { isLoading }] = useDepositMutation();

    const [cardValidity, setCardValidity] = useState<CardFieldValidity>({
        ccnumber: false,
        ccexp: false,
        cvv: false,
    });
    const [cardTouched, setCardTouched] = useState(false);
    const billingRef = useRef<{ first_name: string; last_name: string; address: string; city: string; state: string; zip: string; }>({ first_name: '', last_name: '', address: '', city: '', state: '', zip: '' });

    const formik = useFormik({
        initialValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            address: user?.address || '',
            city: user?.city || '',
            state: user?.state || '',
            zip: user?.postal_code || '',
        },
        validationSchema: billingSchema,
        onSubmit: (values) => {
            const allCardValid = cardValidity.ccnumber && cardValidity.ccexp && cardValidity.cvv;
            if (!allCardValid) return;
            billingRef.current = values;
            if (typeof window !== 'undefined' && window.CollectJS) {
                window.CollectJS.startPaymentRequest();
            }
        },
    });

    const handleCollectJSLoad = () => {
        if (typeof window === 'undefined' || !window.CollectJS) return;

        window.CollectJS.configure({
            variant: 'inline',
            paymentType: 'cc',
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
                if (response) {
                    try {
                        await payViaFortPay({
                            id,
                            amount,
                            type: type as PaymentModeProps,
                            payment_token: response.token,
                            bin: response.card?.bin,
                            exp: response.card?.exp,
                            number: response.card?.number,
                            hash: response.card?.hash || undefined,
                            first_name: billingRef.current.first_name,
                            last_name: billingRef.current.last_name,
                            address: billingRef.current.address,
                            city: billingRef.current.city,
                            state: billingRef.current.state,
                            zip: billingRef.current.zip,
                        }).unwrap();

                        router.push(`/buy-coins/${id}/success`);
                    } catch (e: any) {
                        dispatch(
                            showToast({
                                message: e?.data?.message || 'Unable to deposit',
                                variant: ToastVariant.ERROR,
                            })
                        );
                    }
                }
                else {
                    dispatch(
                        showToast({
                            message: 'Unable to connect to Fortpay',
                            variant: ToastVariant.ERROR,
                        })
                    );
                }
            },
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
                        <InputLabel htmlFor="first_name">First Name <span className="text-red-500">*</span></InputLabel>

                        <OutlinedInput
                            id="first_name"
                            name="first_name"
                            type="text"
                            placeholder="First Name"
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.first_name || formik.submitCount > 0) && Boolean(formik.errors.first_name)}
                            fullWidth
                        />
                        {(formik.touched.first_name || formik.submitCount > 0) && formik.errors.first_name && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.first_name}</FormHelperText>
                        )}
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="last_name">Last Name <span className="text-red-500">*</span></InputLabel>

                        <OutlinedInput
                            id="last_name"
                            name="last_name"
                            type="text"
                            placeholder="Last Name"
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.last_name || formik.submitCount > 0) && Boolean(formik.errors.last_name)}
                            fullWidth
                        />
                        {(formik.touched.last_name || formik.submitCount > 0) && formik.errors.last_name && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.last_name}</FormHelperText>
                        )}
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="address">Address<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            id="address"
                            name="address"
                            type="text"
                            placeholder="Street Address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.address || formik.submitCount > 0) && Boolean(formik.errors.address)}
                            fullWidth
                        />
                        {(formik.touched.address || formik.submitCount > 0) && formik.errors.address && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.address}</FormHelperText>
                        )}
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="city">City<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            id="city"
                            name="city"
                            type="text"
                            placeholder="City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.city || formik.submitCount > 0) && Boolean(formik.errors.city)}
                            fullWidth
                        />
                        {(formik.touched.city || formik.submitCount > 0) && formik.errors.city && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.city}</FormHelperText>
                        )}
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="state">State<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            id="state"
                            name="state"
                            type="text"
                            placeholder="State"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.state || formik.submitCount > 0) && Boolean(formik.errors.state)}
                            fullWidth
                        />
                        {(formik.touched.state || formik.submitCount > 0) && formik.errors.state && (
                            <FormHelperText error sx={{ ml: '14px' }}>{formik.errors.state}</FormHelperText>
                        )}
                    </div>

                    <div className="form-group">
                        <InputLabel htmlFor="zip">Zip Code<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            id="zip"
                            name="zip"
                            type="text"
                            placeholder="Zip code"
                            value={formik.values.zip}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={(formik.touched.zip || formik.submitCount > 0) && Boolean(formik.errors.zip)}
                            fullWidth
                        />
                        {(formik.touched.zip || formik.submitCount > 0) && formik.errors.zip && (
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
                    type="button"
                    variant="contained"
                    color="primary"
                    className="mt-4!"
                    disabled={isLoading}
                    onClick={() => { setCardTouched(true); formik.submitForm(); }}
                >
                    {isLoading ? 'Processing Payment…' : 'Proceed Payment'}
                </Button>
            </form>

            <div id="paymentTokenInfo" />
        </>
    );
}