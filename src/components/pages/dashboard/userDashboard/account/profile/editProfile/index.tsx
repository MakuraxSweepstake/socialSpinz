"use client";
import { PlayerValidationSchema } from '@/components/pages/dashboard/adminDashboard/players/addPlayerForm';
import AddPlayerForm from '@/components/pages/dashboard/adminDashboard/players/addPlayerForm/AddPlayerForm';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { useUpdateUserProfileMutation } from '@/services/userApi';
import { setTokens } from '@/slice/authSlice';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { initialPlayerValues, PlayerItem } from '@/types/player';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';

export default function EditUserProfile({ id, buttonLabel }: { id: string, buttonLabel?: string; }) {
    const dispatch = useAppDispatch();
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
            postal_code: user.postal_code || "",
            gender: user.gender || "",
            state: user.state || "",
            address_line_two: user.address_line_two || "",
            ssn: user.ssn || "",
        } : initialPlayerValues,
        validationSchema: PlayerValidationSchema(user?.id ? true : false),
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formattedDob = values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : '';
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
            if (values.ssn) formData.append("ssn", values.ssn);
            if (values.phone) formData.append("phone", values.phone);
            if (values.dob) formData.append("dob", formattedDob);
            if (values.postal_code) formData.append("postal_code", values.postal_code);
            if (values.state) formData.append("state", values.state);
            if (values.gender) formData.append("gender", values.gender);
            if (values.address_line_two) formData.append("address_line_two", values.address_line_two);


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
                const response = await updateUserProfile({ id: user?.id || "", body: formData }).unwrap();
                dispatch(
                    showToast({
                        message: response?.message || "Profile Updated Successfully",
                        variant: ToastVariant.SUCCESS
                    })
                );
                dispatch(
                    setTokens({
                        access_token: access_token,
                        user: { ...user, ...response?.data },
                    }),
                );
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to Update Profile",
                        variant: ToastVariant.ERROR
                    })
                )
            }
        }
    })

    console.log("User Data:", formik.errors);

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
                phone: user.phone || "",
                password: "",
                password_confirmation: "",
                registered_date: user.registered_date || new Date().toISOString(),
                current_credit: user.current_credit ?? undefined,
                total_withdrawl: user.total_withdrawl ?? undefined,
                total_deposited: user.total_deposited ?? undefined,
                profile_image_file: user.profile_image_file ?? undefined,
                dob: user.dob ? dayjs(user.dob).format('YYYY-MM-DD') : undefined,
                postal_code: user?.postal_code || "",
                gender: user?.gender || "",
                address_line_two: user?.address_line_two || "",
                state: user?.state || "",
                ssn: user?.ssn || "",
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
