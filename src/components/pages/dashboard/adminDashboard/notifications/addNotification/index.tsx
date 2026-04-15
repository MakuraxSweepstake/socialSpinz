import PageHeader from '@/components/molecules/PageHeader'
import AddNotificationForm from './AddNotificationForm'

export default function NotificationFormRoot() {
    return (
        <>
            <PageHeader
                title='Notifications'
            />
            <AddNotificationForm />
        </>
    )
}
