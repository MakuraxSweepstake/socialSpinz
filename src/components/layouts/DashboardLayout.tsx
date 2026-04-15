// "use client";

// import { Box } from '@mui/material'
// import React from 'react'
// import Sidebar from '../organism/Sidebar'
// import Header from '../organism/Header'
// import { styled } from '@mui/material/styles';
// import { usePathname } from 'next/navigation';
// import Breadcrumb from '../molecules/Breadcrumb';

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//     const [open, setOpen] = React.useState(true);
//     const [openMobile, setOpenMobile] = React.useState(false);
//     const pathname = usePathname();
//     const handleDrawerOpen = () => {
//         setOpen((prev) => !prev);
//     };

//     React.useEffect(() => {
//         // Close menu when route changes
//         if (openMobile) {
//             setOpenMobile(false);
//         }
//     }, [pathname]);

//     const handleMobileMenuToggle = () => {
//         setOpenMobile((prev) => !prev);
//     }
//     const handleDrawerClose = () => {
//         setOpen(false);
//     };
//     const DrawerHeader = styled('div')(({ theme }) => ({
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         padding: theme.spacing(0, 1),

//         ...theme.mixins.toolbar,
//     }));


//     return (
//         <Box sx={{ display: 'flex' }}>
//             <Header open={open} handleDrawerOpen={handleDrawerOpen} handleMobileMenuToggle={handleMobileMenuToggle} />
//             <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleMobileMenuToggle={handleMobileMenuToggle} mobileMenuOpen={openMobile

//             } />
//             <div className="root_container w-full overflow-hidden">
//                 <DrawerHeader sx={{
//                     mb: { xs: '16px', lg: 0 }
//                 }} />
//                 <div className="content_box p-4 lg:pl-11 lg:pr-12 lg:py-8">
//                     {/* {pathname !== '/' && <Breadcrumb />} */}
//                     {children}</div>
//             </div>
//         </Box>
//     )
// }


"use client";

import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { useVerifyProfileMutation } from '@/services/authApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import PaymentModal from '../molecules/PaymentModal';
import ChatbotWidget from '../organism/ChatbotWidget';
import Header from '../organism/Header';
import Sidebar from '../organism/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    const [openMobile, setOpenMobile] = useState(false);
    const pathname = usePathname();
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const [verifyAcuity, { isLoading }] = useVerifyProfileMutation();
    const [isAcuityModalOpen, setIsAcuityModalOpen] = useState(false);
    const [acuityUrl, setAcuityUrl] = useState('');
    const handleDrawerOpen = () => {
        setOpen((prev) => !prev);
    };

    React.useEffect(() => {
        // Close menu when route changes
        if (openMobile) {
            setOpenMobile(false);
        }
    }, [pathname]);

    const handleMobileMenuToggle = () => {
        setOpenMobile((prev) => !prev);
    }

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),

        ...theme.mixins.toolbar,
    }));


    return (
        <Box sx={{ display: 'flex' }}>
            <Header
                open={open}
                handleDrawerOpen={handleDrawerOpen}
                handleMobileMenuToggle={handleMobileMenuToggle} />

            <Sidebar open={open}
                handleDrawerOpen={handleDrawerOpen}
                handleMobileMenuToggle={handleMobileMenuToggle}
                mobileMenuOpen={openMobile
                } />
            <div className="root_container w-full overflow-hidden">
                <DrawerHeader sx={{
                    mb: { xs: '16px', lg: 0 }
                }} />
                <div className="content_box px-4 pt-4 pb-12 lg:pl-11 lg:pr-12 lg:pt-8 lg:pb-16">
                    {/* {user && user?.role && user?.role?.toLowerCase() === "user" && !user?.is_acuity_verified ? <ImportantBlock title='Profile Unverified' message='Your profile is not yet verified. Please complete the verification process.' onAction={async () => {
                        try {
                            const response = await verifyAcuity().unwrap();
                            dispatch(showToast({ message: 'Verification successful.', variant: ToastVariant.SUCCESS }));
                            if (response?.data?.redirection_url) {
                                setAcuityUrl(response.data.redirection_url);
                                setIsAcuityModalOpen(true);
                            }
                        }
                        catch (err: any) {
                            dispatch(showToast({ message: err?.data?.message || 'Verification failed. Please try again.', variant: ToastVariant.ERROR }))
                        }
                    }} actionText={isLoading ? 'Verifying...' : 'Verify Now'} /> : ""} */}
                    {children}

                    <ChatbotWidget />

                    <PaymentModal
                        url={acuityUrl}
                        isOpen={isAcuityModalOpen}
                        onClose={() => setIsAcuityModalOpen(false)}
                        onSuccess={() => {
                            setIsAcuityModalOpen(false);
                            dispatch(showToast({ message: 'Verification complete!', variant: ToastVariant.SUCCESS, autoTime: true }));
                        }}
                        onError={(error: { message: string }) => {
                            console.error('Acuity verification error', error);
                            dispatch(showToast({ message: error.message || 'Verification failed', variant: ToastVariant.ERROR, autoTime: true }));
                        }}
                        successMessage="verified"
                        title="Acuity identity verification"
                        maxWidth="md"
                        height={700}
                    />
                </div>
            </div>
        </Box>
    )
}
