import { Box } from '@mui/material'
import React from 'react'
import Profile from '../Profile'
import UserCoinCard from './UserCoinCard'
import { CheckAuth } from '@/utils/checkAuth'
import Link from 'next/link'
import { PATH } from '@/routes/PATH'

export default function UserHeader() {
  const isAuth = CheckAuth();
  return (
    <Box className='flex items-center gap-2 md:gap-4 justify-end w-full'>
      {isAuth ?
        <div className="right flex items-center gap-4">
          <UserCoinCard />
          <Profile />
        </div> :
        <div className="flex gap-3 items-center">
          <Link href={PATH.AUTH.REGISTER.ROOT} className='ss-btn bg-primary-grad text-nowrap'>Setup an account</Link>
          <Link href={PATH.AUTH.LOGIN.ROOT} className='ss-btn bg-primary-grad'>Login</Link>
        </div>
      }
    </Box>
  )
}
