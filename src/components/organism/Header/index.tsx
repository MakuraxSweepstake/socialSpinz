"use client";
import { DRAWER_WIDTH } from '@/config';
import { useAppSelector } from '@/hooks/hook';
import { useMediaQuery } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { HambergerMenu } from '@wandersonalwes/iconsax-react';
import AdminHeader from './AdminHeader';
import UserHeader from './UserHeader';


interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
    downLG?: boolean;
}
// const AppBar = styled(MuiAppBar, {

//     shouldForwardProp: (prop) => prop !== 'open',
// })<AppBarProps>(({ theme }) => ({
//     zIndex: theme.zIndex.drawer + 1,
//     transition: theme.transitions.create(['width', 'margin'], {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//     }),
//     backgroundColor: theme.palette.background.paper,
//     boxShadow: "none",
//     variants: [
//         {
//             props: ({ open }) => open,
//             style: {
//                 marginLeft: DRAWER_WIDTH,
//                 width: `calc(100% - ${DRAWER_WIDTH}px)`,
//                 transition: theme.transitions.create(['width', 'margin'], {
//                     easing: theme.transitions.easing.sharp,
//                     duration: theme.transitions.duration.enteringScreen,
//                 }),

//             },
//         },
//     ],
// }));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'downLG',
})<AppBarProps>(({ theme, open, downLG }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    ...(open &&
        !downLG && {
        marginLeft: DRAWER_WIDTH,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    ...(downLG && {
        width: '100%',
        marginLeft: 0,
    }),
}));
export default function Header({ open, handleDrawerOpen, handleMobileMenuToggle }: {
    open: boolean,
    handleDrawerOpen: () => void;
    handleMobileMenuToggle: () => void;
}) {

    const user = useAppSelector((state) => state.auth.user);
    const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
    return (
        <AppBar position="fixed" open={open} downLG={downLG}>
            <Toolbar sx={{ gap: "16px" }}>

                {downLG ? <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleMobileMenuToggle}
                    edge="start"
                    sx={[
                        {
                            maxWidth: "fit-content"
                        },
                    ]}
                    className='!bg-light-gray'
                >
                    <HambergerMenu className='!text-para-light' />
                </IconButton> : <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={[
                        {
                            maxWidth: "fit-content"
                        },
                    ]}
                    className='!bg-light-gray'
                >
                    <HambergerMenu className='!text-para-light' />
                </IconButton>}
                {
                    user?.role && user.role.toUpperCase() === 'USER' || !user ? (
                        <UserHeader />
                    ) : (
                        <AdminHeader />
                    )
                }
            </Toolbar>
        </AppBar >
    )
}
