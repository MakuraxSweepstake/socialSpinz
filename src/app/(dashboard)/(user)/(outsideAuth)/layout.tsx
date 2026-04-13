import DashboardLayout from '@/components/layouts/DashboardLayout'
import ComingSoonGate from '@/components/organism/ComingSoonGate'
import AgeVerificationModal from '@/components/organism/dialog'
import React from 'react'

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ComingSoonGate>
            <DashboardLayout>
                {children}
                <AgeVerificationModal />
            </DashboardLayout>
        </ComingSoonGate>
    )
}
