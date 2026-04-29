import DashboardLayout from '@/components/layouts/DashboardLayout'
import ComingSoonGate from '@/components/organism/ComingSoonGate'
import Private from '@/routes/Private'
import React from 'react'

export default function PrivateUserLayout({ children }: { children: React.ReactNode }) {
    return (
        <ComingSoonGate>
            <Private>
                <DashboardLayout>
                    {children}
                </DashboardLayout>
            </Private>
        </ComingSoonGate>
    )
}
