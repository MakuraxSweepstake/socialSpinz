import GlassWrapper from '@/components/molecules/GlassWrapper';
import TabController from '@/components/molecules/TabController';

import UserProfileCard from "@/components/organism/Cards/UserProfileCard";
import ResetPasswordForm from '@/components/pages/auth/resetPassword/ResetPasswordForm';
import EditUserProfile from '@/components/pages/dashboard/userDashboard/account/profile/editProfile';
import EditUserWallet from '@/components/pages/dashboard/userDashboard/account/profile/editUserWallet';
import { useAppSelector } from '@/hooks/hook';
import { useGetUserGameBalanceQuery } from '@/services/transaction';
import React from 'react';

type profileTabProps = "account_detail" | "wallet_information" | "change_password"

export default function AccountTab() {
    const { data, isLoading } = useGetUserGameBalanceQuery();
    const [currentActiveTab, setCurrentActiveTab] = React.useState<profileTabProps>("account_detail");


    const handleTabChange = (tab: string) => {
        setCurrentActiveTab(tab as profileTabProps);
    };

    const user = useAppSelector((state) => state.auth.user);

    const renderTabContent = () => {
        switch (currentActiveTab) {
            case "account_detail":
                return <EditUserProfile id={user?.id as string | ""} buttonLabel="Update" />;
            case "wallet_information":
                return <EditUserWallet />;
            case "change_password":
                return (<div className="px-8 lg:pt-8 pb-8">
                    <ResetPasswordForm email={user?.email} />
                </div>);
            default:
                return null;
        }
    };
    return (
        <div className='profile__root'>
            <div className="grid lg:grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-5 ">
                    <UserProfileCard balance={data} loading={isLoading} />
                </div>
                <GlassWrapper className="col-span-12 lg:col-span-7" >
                    <div className="p-6 lg:p-0">
                        <TabController links={[
                            { value: "account_detail", label: "Account Details" },
                            { value: "wallet_information", label: "Wallet Information" },
                            { value: "change_password", label: "Change Password" },
                        ]} currentTab={currentActiveTab} onTabChange={handleTabChange}
                            controllerClassName=' px-4 lg:px-8 lg:pt-8 !mb-0'
                        />
                    </div>
                    {renderTabContent()}
                </GlassWrapper>
            </div>
        </div>
    )
}
