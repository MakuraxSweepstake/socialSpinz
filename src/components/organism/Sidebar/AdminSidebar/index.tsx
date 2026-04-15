"use client";

import { PATH } from "@/routes/PATH";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import {
    Activity,
    ArrangeHorizontalCircle,
    DollarSquare,
    Game,
    HambergerMenu,
    Notification,
    Paperclip2,
    Setting2,
    StatusUp,
    UserSearch,
} from "@wandersonalwes/iconsax-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminMenu({ open }: { open: boolean }) {
    const pathname = usePathname();

    const menuItems = [
        {
            label: "Dashboard",
            icon: <StatusUp size={18} />,
            href: PATH.DASHBOARD.ROOT,
            active: pathname === PATH.DASHBOARD.ROOT,
        },
        {
            label: "Transactions",
            icon: <ArrangeHorizontalCircle size={18} />,
            href: PATH.ADMIN.TRANSACTIONS.ROOT,
            active: pathname.startsWith(PATH.ADMIN.TRANSACTIONS.ROOT),
        },
        {
            label: "Games",
            icon: <Game size={18} />,
            href: PATH.ADMIN.GAMES.ROOT,
            active: [
                PATH.ADMIN.GAMES.ROOT,
                PATH.ADMIN.GAMES.ADD_GAME.ROOT,
                "/edit-game",
            ].some((p) => pathname.startsWith(p)),
        },
        {
            label: "Players",
            icon: <UserSearch size={18} />,
            href: PATH.ADMIN.PLAYERS.ROOT,
            active: [
                PATH.ADMIN.PLAYERS.ROOT,
                PATH.ADMIN.PLAYERS.ADD_PLAYER.ROOT,
                "/edit-player",
            ].some((p) => pathname.startsWith(p)),
        },
        {
            label: "Menus",
            icon: <HambergerMenu size={18} />,
            href: PATH.ADMIN.MENUS.ROOT,
            active: pathname.startsWith(PATH.ADMIN.MENUS.ROOT),
        },
        {
            label: "Pages",
            icon: <Paperclip2 size={18} />,
            href: PATH.ADMIN.PAGES.ROOT,
            active: pathname.startsWith(PATH.ADMIN.PAGES.ROOT),
        },
        {
            label: "Notifications",
            icon: <Notification size={18} />,
            href: PATH.ADMIN.NOTIFICATIONS.ROOT,
            active: pathname.startsWith(PATH.ADMIN.NOTIFICATIONS.ROOT),
        },
        {
            label: "Settings",
            icon: <Setting2 size={18} />,
            href: PATH.ADMIN.SETTINGS.ROOT,
            active: pathname.startsWith(PATH.ADMIN.SETTINGS.ROOT),
        },
        {
            label: "Payment Setup",
            icon: <DollarSquare size={18} />,
            href: PATH.ADMIN.PAYMENT_SETUP.ROOT,
            active: pathname.startsWith(PATH.ADMIN.PAYMENT_SETUP.ROOT),
        },
        {
            label: "Activity",
            icon: <Activity size={18} />,
            href: PATH.ADMIN.ACTIVITY.ROOT,
            active: pathname.startsWith(PATH.ADMIN.ACTIVITY.ROOT),
        },
    ];

    const [glassStyle, setGlassStyle] = React.useState({ top: 0, height: 0, opacity: 0 });
    const menuListRef = React.useRef<HTMLUListElement>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
        const item = e.currentTarget;
        const list = menuListRef.current;

        if (item && list) {
            const itemRect = item.getBoundingClientRect();
            const listRect = list.getBoundingClientRect();
            const topPosition = itemRect.top - listRect.top;

            setGlassStyle({
                top: topPosition,
                height: itemRect.height,
                opacity: 1,
            });
        }
    };

    const handleMouseLeave = () => {
        setGlassStyle((prev) => ({ ...prev, opacity: 0 }));
    };
    return (
        <List ref={menuListRef}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }} className={` ${open ? "px-3" : ""}`} >
            <div
                style={{
                    position: "absolute",
                    left: "0",
                    right: "0",
                    top: `${glassStyle.top}px`,
                    height: `${glassStyle.height}px`,
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    borderRadius: "8px",
                    boxShadow: `
                                0 8px 32px 0 #ddd,
                                inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
                                0 0 20px rgba(255, 255, 255, 0.1)
                            `,
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    pointerEvents: "none",
                    zIndex: 1,
                    opacity: glassStyle.opacity,
                    transform:
                        glassStyle.opacity === 1
                            ? "translateY(0) scale(1)"
                            : "translateY(0) scale(0.95)",
                }}
            />
            {
                menuItems.map(({ label, icon, href, active }, idx) => (
                    <ListItem
                        key={idx}
                        onMouseEnter={handleMouseEnter}
                        style={{ position: "relative", zIndex: 2, padding: 0 }}
                    >
                        <Link
                            href={href}
                            className={`flex gap-2 items-center px-4 py-2 ${open ? "expanded" : "collapsed"
                                } ${active ? "active__menu" : ""}`}
                        >
                            <ListItemIcon className={open ? "expanded" : "collapsed"}>
                                {icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={label}
                                className={open ? "expanded" : "collapsed"}
                            />
                        </Link>
                    </ListItem>
                ))
            }
        </ List>
    );
}
