"use client";

import { DRAWER_WIDTH } from '@/config';
import { useAppSelector } from '@/hooks/hook';
import { useGetSeoDataQuery } from '@/services/menuApi';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Add } from '@wandersonalwes/iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import AdminMenu from './AdminSidebar';
import UserMenu from './UserSidebar';
const drawerWidth = DRAWER_WIDTH;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),

    ...theme.mixins.toolbar,
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'downLG' })<{
    open?: boolean;
    downLG?: boolean;
}>(
    ({ theme, downLG }) => ({
        width: downLG ? '100%' : drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            padding: 0,
        },
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

export default function Sidebar({ open, handleDrawerOpen, handleMobileMenuToggle, mobileMenuOpen }: {
    open: boolean,
    handleDrawerOpen: () => void;
    handleMobileMenuToggle: () => void;
    mobileMenuOpen: boolean;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const user = useAppSelector((state) => state.auth.user);
    const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
    // const pathname = usePathname();

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node) && mobileMenuOpen) {
                handleMobileMenuToggle();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, mobileMenuOpen, handleMobileMenuToggle]);

    // React.useEffect(() => {
    //     // Close menu when route changes
    //     if (mobileMenuOpen) {
    //         handleMobileMenuToggle();
    //     }

    //     function handleClickOutside(event: MouseEvent) {
    //         if (ref.current && !ref.current.contains(event.target as Node) && mobileMenuOpen) {
    //             handleMobileMenuToggle();
    //         }
    //     }

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [pathname, mobileMenuOpen, handleMobileMenuToggle, ref]);
    const { data } = useGetSeoDataQuery();

    if (downLG) {
        return <div className={`mobile__menu__wrapper fixed left-0 top-0 bottom-0 max-h-screen  backdrop-blur-2xl bg-[#290139CF] w-full  z-[9999]  transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} >
            <div className={`mobile__primary__menu max-w-[600px]  w-full h-screen  transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible translate-x-0" : "opacity-0 invisible translate-x-[-100%]"} ${user?.role && user.role.toUpperCase() === 'ADMIN' ? "bg-white" : "bg-[#11011E]"}`} ref={ref}>
                <div className="flex justify-between items-center p-4 ">
                    {data?.data?.logo && <Link href="/">
                        <Image src={data?.data?.logo} alt="Logo" width={102} height={56} />
                    </Link>}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleMobileMenuToggle}
                        sx={[
                            {
                                maxWidth: "fit-content"
                            },
                        ]}
                        className='!bg-light-gray !md:hidden'
                    >
                        <Add className='!text-para-light rotate-45' />
                    </IconButton>
                </div>
                <Box className={`mt-8 menu__wrapper `} >
                    {
                        user?.role && user.role.toUpperCase() === 'USER' || !user ? (
                            <UserMenu open={open} />
                        ) : (
                            <AdminMenu open={open} />
                        )
                    }
                </Box>
            </div>
        </div>
    }
    return (
        <Drawer variant="permanent" open={open} downLG={downLG}>
            <DrawerHeader sx={{ justifyContent: "center", marginTop: 2 }}>
                {/* <HambergerMenu /> */}
                {data?.data?.logo && <Link href="/">
                    <Image src={data?.data?.logo} alt="Logo" width={102} height={56} />
                </Link>}
            </DrawerHeader>

            <Box className={`mt-8 menu__wrapper`} >
                {
                    user?.role && user.role.toUpperCase() === 'USER' || !user ? (
                        <UserMenu open={open} />
                    ) : (
                        <AdminMenu open={open} />
                    )
                }
            </Box>
        </Drawer>
    );
}
