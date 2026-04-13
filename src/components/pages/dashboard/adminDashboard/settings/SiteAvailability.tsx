"use client";

import { useAppDispatch } from "@/hooks/hook";
import { useGetSiteAvailabilityQuery, useUpdateSiteAvailabilityMutation } from "@/services/settingApi";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { Button, FormControlLabel, Switch, Typography } from "@mui/material";
import { useFormik } from "formik";

export default function SiteAvailability() {
    const dispatch = useAppDispatch();
    const { data } = useGetSiteAvailabilityQuery();
    const [updateAvailability] = useUpdateSiteAvailabilityMutation();

    const formik = useFormik({
        initialValues: {
            coming_soon: data?.data?.coming_soon ?? false,
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const response = await updateAvailability({ coming_soon: values.coming_soon }).unwrap();
                dispatch(showToast({ message: response.message || "Saved successfully", variant: ToastVariant.SUCCESS }));
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Something went wrong", variant: ToastVariant.ERROR }));
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="form__field__wrapper border border-gray rounded-[16px] mb-6">
                <div className="form__title py-6 px-10 border-b border-gray">
                    <h2 className="text-[20px] font-bold">Site Availability</h2>
                    <p className="text-[13px] mt-1 opacity-60">Enable to show a "Coming Soon" page to all users</p>
                </div>
                <div className="form__fields p-6 lg:p-10">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formik.values.coming_soon}
                                onChange={(e) => formik.setFieldValue("coming_soon", e.target.checked)}
                                color="primary"
                            />
                        }
                        label={<Typography className="text-primary-dark">Comming Soon</Typography>}
                    />
                </div>
            </div>

            <div className="text-right">
                <Button type="submit" variant="contained" color="primary">
                    Save Settings
                </Button>
            </div>
        </form>
    );
}
