"use client";
import React from 'react'
import CopyToClipboard from './CopyToClipboard';
import { CardPasswordField } from './CardPasswordHandler';

export default function SingleGameCred({ username, password }: { username: string; password: string }) {

    return (
        <ul className="mt-4">

            <li className="py-2 border-b border-[rgba(255,255,255,0.2)] grid grid-cols-2">
                <span className="text-[12px] leading-[120%] font-[600]">Username :</span>
                <div className="flex justify-between items-center">
                    <span className="text-[11px]">
                        {username}
                    </span>
                    {username && (
                        <CopyToClipboard text={username} />
                    )}
                </div>
            </li>
            <li className="py-2 border-b border-[rgba(255,255,255,0.2)] grid grid-cols-2">
                <span className="text-[12px] leading-[120%] font-[600]">Password :</span>
                <CardPasswordField password={password} />
            </li>
        </ul>
    )
}
