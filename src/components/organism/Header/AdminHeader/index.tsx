"use client";

import { Box } from '@mui/material';
import CreatNewRecord from '../CreatNewRecord';
import NotificationBell from '../Notification';
import Profile from '../Profile';

export default function AdminHeader() {
    return (
        <Box className='flex items-center gap-4 justify-end w-full'>
            <div className="right flex items-center gap-4">
                <CreatNewRecord />
                <NotificationBell type="admin" />
                <Profile />
            </div>
        </Box>
    );
}
