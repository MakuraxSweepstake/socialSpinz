"use client";
import { PlayerValidationSchema } from '@/components/pages/dashboard/adminDashboard/players/addPlayerForm';
import AddPlayerForm from '@/components/pages/dashboard/adminDashboard/players/addPlayerForm/AddPlayerForm';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { useUpdateUserProfileMutation } from '@/services/userApi';
import { setTokens } from '@/slice/authSlice';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { initialPlayerValues, PlayerItem } from '@/types/player';
import { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';

export default function EditUserProfile({ id, buttonLabel }: { id: string, buttonLabel?: string; }) {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
    const user = useAppSelector((state) => state?.auth.user);
    const access_token = useAppSelector((state) => state?.auth.access_token);



    const formik = useFormik({
        initialValues: user ? {
            name: user.name,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            wallet_address: user.wallet_address,
            address: user.address,
            city: user.city,
            phone: user.phone || "",
            password: '',
            password_confirmation: '',
            profile_image: null,
            dob: user.dob || null as Dayjs | null,
            zip_code: user.zip_code || "",
            pob: user.pob || "",
            state: user?.state,
            postal_code: user?.postal_code || "",
            ssn: user?.ssn || "",
        } : initialPlayerValues,
        validationSchema: PlayerValidationSchema(!!user?.id),
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("first_name", values.first_name);
            formData.append("last_name", values.last_name);
            formData.append("password", values.password);
            formData.append("password_confirmation", values.password_confirmation);
            if (values.wallet_address) formData.append("wallet_address", values.wallet_address);
            if (values.address) formData.append("address", values.address);
            if (values.city) formData.append("city", values.city);
            if (values.phone) formData.append("phone", values.phone);
            if (values.dob) formData.append("dob", values.dob.toString());
            if (values.state) formData.append("state", values.state);
            if (values.zip_code) formData.append("zip_code", values.zip_code);

            if (values.profile_image) {
                if (Array.isArray(values.profile_image)) {
                    values.profile_image.forEach((file) => formData.append("profile_image", file));
                } else {
                    formData.append("profile_image", values.profile_image);
                }
            }

            if (id && user) {
                formData.append("profile_image_file", user.profile_image_file || "");
            }

            try {
                const response = await updateUserProfile({ id: user?.id || "", body: formData });
                dispatch(
                    showToast({
                        message: response?.data?.message || "Profile Updated Successfully",
                        variant: ToastVariant.SUCCESS
                    })
                );
                dispatch(
                    setTokens({
                        access_token: access_token,
                        user: response?.data?.data,
                    }),
                );
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e.error || e.data.message,
                        variant: ToastVariant.ERROR
                    })
                )
            }
        }
    })

    const formattedData = user
        ? {
            data: {
                id: user.id || "",
                name: user.name,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                wallet_address: user.wallet_address,
                address: user.address,
                city: user.city,
                ssn: user.ssn,
                dob: user.dob,
                zip_code: user.zip_code,
                postal_code: user.postal_code,
                state: user.state,
                phone: user.phone || "",
                password: "",
                password_confirmation: "",
                registered_date: user.registered_date || new Date().toISOString(),
                current_credit: user.current_credit ?? undefined,
                total_withdrawl: user.total_withdrawl ?? undefined,
                total_deposited: user.total_deposited ?? undefined,
                profile_image_file: user.profile_image_file ?? undefined,
            } as PlayerItem,
        }
        : undefined;
    return (
        <AddPlayerForm
            formik={formik}
            data={formattedData}
            id={id}
            loading={isLoading}
            buttonLabel={buttonLabel}
        />
    )
}
