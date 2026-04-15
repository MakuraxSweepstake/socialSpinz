import AddNotificationForm from '@/components/pages/dashboard/adminDashboard/notifications/addNotification';

export default async function EditNotification(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    console.log("id", id)
    return (
        <AddNotificationForm />
    )
}
