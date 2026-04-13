'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { useLazyGetMeQuery } from '@/services/authApi';
import { setTokens } from '@/slice/authSlice';
import { Box, CircularProgress, Dialog, DialogContent, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface PaymentModalProps {
    url: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    onError?: (error: PaymentError) => void;
    successMessage?: string;
    successRedirectPaths?: string[];
    title?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    height?: number;
    isRegistrationFlow?: boolean;
    isPurchaseFlow?: boolean;
}

export interface PaymentError {
    code: string;
    message: string;
    details?: unknown;
}

export default function PaymentModal({
    url,
    isOpen,
    onClose,
    onSuccess,
    onError,
    successMessage = 'success',
    successRedirectPaths = ['/login', '/success', '/verified'],
    title = 'Processing Payment',
    maxWidth = 'sm',
    height = 600,
    isRegistrationFlow = false,
    isPurchaseFlow = false
}: PaymentModalProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<PaymentError | null>(null);
    const [hasDetectedSuccess, setHasDetectedSuccess] = useState(false);
    const [attention, setAttention] = useState(false);
    const route = useRouter();
    const dispatch = useAppDispatch();
    const access_token = useAppSelector((state) => state.auth.access_token);
    const [fetchMe] = useLazyGetMeQuery();

    const handleDialogClose = (_: unknown, reason?: string) => {
        if (!isPurchaseFlow && reason === 'backdropClick') {
            setAttention(true);
            setTimeout(() => setAttention(false), 600);
            return;
        }

        onClose();
    };
    const syncUserFromServer = useCallback(async () => {
        try {

            const result = await fetchMe().unwrap();
            const user = result.data?.user;
            const token = result.data?.access_token || access_token;

            console.log("inside sync", {
                user, token
            })
            if (!user) return;
            dispatch(setTokens({ access_token: token, user }));
            Cookies.set('user', JSON.stringify(user), {
                expires: 1,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
        } catch (error) {
            console.error('[PaymentModal] syncUserFromServer failed', error);
        }
    }, [fetchMe, dispatch, access_token]);
    useEffect(() => {
        if (!isOpen) {
            setIsLoading(true);
            setError(null);
            setHasDetectedSuccess(false);
            return;
        }

        const checkRedirectSuccess = async (): Promise<void> => {
            if (hasDetectedSuccess || !iframeRef.current?.contentWindow) return;

            try {
                const currentUrl = iframeRef.current.contentWindow.location.href;
                if (!currentUrl) return;

                const normalized = currentUrl.toLowerCase();
                const found = successRedirectPaths.some((pattern) => {
                    const normalizedPattern = pattern.toLowerCase();
                    if (normalizedPattern.startsWith('http://') || normalizedPattern.startsWith('https://')) {
                        return normalized === normalizedPattern;
                    }
                    return normalized.includes(normalizedPattern);
                });

                if (found) {
                    console.log('[PaymentModal] Detected success redirect URL:', currentUrl);
                    setHasDetectedSuccess(true);
                    setIsLoading(false);
                    if (!isRegistrationFlow) await syncUserFromServer();
                    onSuccess?.();
                    setTimeout(() => onClose(), 300);
                }
            } catch {

            }
        };
        const handleMessage = async (event: MessageEvent): Promise<void> => {
            try {

                const paymentOrigin = new URL(url).origin;
                const trustedOrigins = new Set([paymentOrigin, window.location.origin]);
                if (!trustedOrigins.has(event.origin)) {
                    console.warn(
                        `[PaymentModal] Ignoring message from untrusted origin: ${event.origin}`
                    );
                    return;
                }

                console.log('[PaymentModal] Received message:', event.data);

                const data = event.data;
                if (!data) return;

                const isSuccess =
                    data.status === successMessage ||
                    data.status === 'success' ||
                    data.type === 'payment:success' ||
                    data.type === `payment:${successMessage}` ||
                    data.result === 'success' ||
                    data.result === successMessage ||
                    data.verification_status === 'verification.accepted' ||
                    (typeof data === 'string' && (
                        data === successMessage ||
                        data === 'success'
                    ));

                if (isSuccess) {
                    console.log('[PaymentModal] Payment successful! Closing modal...');
                    setHasDetectedSuccess(true);
                    setIsLoading(false);
                    if (isRegistrationFlow) {
                        route.push('/login');
                    } else {
                        await syncUserFromServer();
                    }
                    onSuccess?.();
                    setTimeout(() => onClose(), 500);
                    return;
                }

                const isError =
                    data.status === 'error' ||
                    data.type === 'payment:error' ||
                    data.error !== undefined;

                if (isError) {
                    const paymentError: PaymentError = {
                        code: data.error_code || 'PAYMENT_ERROR',
                        message: data.message || data.error || 'Payment failed',
                        details: data
                    };
                    console.error('[PaymentModal] Payment error:', paymentError);
                    setError(paymentError);
                    onError?.(paymentError);
                }
            } catch {
                console.error('[PaymentModal] Error handling message: unknown error');
            }
        };

        const redirectInterval = window.setInterval(checkRedirectSuccess, 450);

        window.addEventListener('message', handleMessage);

        // Notify iframe that parent is ready (for some providers)
        const readyTimeout = window.setTimeout(() => {
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    { type: 'parent:ready' },
                    new URL(url).origin
                );
            }
        }, 1000);

        return () => {
            window.clearInterval(redirectInterval);
            window.clearTimeout(readyTimeout);
            window.removeEventListener('message', handleMessage);
        };
    }, [isOpen, url, onClose, onSuccess, onError, successMessage, successRedirectPaths, hasDetectedSuccess, isRegistrationFlow, route, syncUserFromServer]);

    const handleIframeLoad = (): void => {
        console.log('[PaymentModal] iframe loaded');
        setIsLoading(false);
    };

    const handleIframeError = (): void => {
        const error: PaymentError = {
            code: 'IFRAME_LOAD_ERROR',
            message: 'Failed to load payment page'
        };
        console.error('[PaymentModal] iframe load error');
        setError(error);
        onError?.(error);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleDialogClose}
            maxWidth={maxWidth}
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(184,1,192,0.1))',
                    backdropFilter: 'blur(10px)',
                    animation: attention ? 'blink 0.3s ease-in-out 2' : 'none',
                    '@keyframes blink': {
                        '0%': { transform: 'scale(1)', boxShadow: '0 0 0px rgba(184,1,192,0.0)' },
                        '50%': { transform: 'scale(1.02)', boxShadow: '0 0 20px rgba(184,1,192,0.8)' },
                        '100%': { transform: 'scale(1)', boxShadow: '0 0 0px rgba(184,1,192,0.0)' },
                    }
                }
            }}
        >
            <DialogContent
                sx={{
                    p: 0,
                    position: 'relative',
                    background: 'rgba(20, 20, 20, 0.95)'
                }}
            >
                {error ? (
                    // Error State
                    <Box
                        sx={{
                            height: `${height}px`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 3,
                            textAlign: 'center'
                        }}
                    >
                        <Typography color="error" variant="h6" sx={{ mb: 1 }}>
                            Payment Failed
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                            {error.message}
                        </Typography>
                        <Typography
                            color="textSecondary"
                            variant="caption"
                            sx={{ mt: 1, opacity: 0.7 }}
                        >
                            Error Code: {error.code}
                        </Typography>
                    </Box>
                ) : (
                    // Loading or iframe state
                    <>
                        {isLoading && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1000,
                                    background: 'rgba(20, 20, 20, 0.95)'
                                }}
                            >
                                <CircularProgress sx={{ mb: 2, color: '#B801C0' }} />
                                <Typography sx={{ color: '#fff' }}>
                                    {title}...
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ height: `${height}px`, width: '100%' }}>
                            <iframe
                                ref={iframeRef}
                                src={url}
                                title="Payment Processing"
                                onLoad={handleIframeLoad}
                                onError={handleIframeError}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '12px'
                                }}
                                allow="camera; microphone; geolocation; payment"
                                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                            />
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
