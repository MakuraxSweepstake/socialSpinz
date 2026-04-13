"use client";

import { useAppDispatch } from "@/hooks/hook";
import { useGetTransactionLimitsQuery, useUpdateTransactionLimitsMutation } from "@/services/settingApi";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { Button, InputLabel, OutlinedInput } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    min_deposit: Yup.number().nullable().min(0, "Must be 0 or greater"),
    max_deposit: Yup.number().nullable().min(0, "Must be 0 or greater")
        .test("max-gt-min", "Max deposit must be greater than min deposit", function (max) {
            const min = this.parent.min_deposit;
            if (max == null || min == null) return true;
            return max > min;
        }),
    min_withdrawal: Yup.number().nullable().min(0, "Must be 0 or greater"),
    max_withdrawal: Yup.number().nullable().min(0, "Must be 0 or greater")
        .test("max-gt-min", "Max withdrawal must be greater than min withdrawal", function (max) {
            const min = this.parent.min_withdrawal;
            if (max == null || min == null) return true;
            return max > min;
        }),
});

export default function TransactionLimits() {
    const dispatch = useAppDispatch();
    const { data } = useGetTransactionLimitsQuery();
    const [updateLimits] = useUpdateTransactionLimitsMutation();

    const formik = useFormik({
        initialValues: {
            min_deposit: data?.data?.min_deposit ?? null,
            max_deposit: data?.data?.max_deposit ?? null,
            min_withdrawal: data?.data?.min_withdrawal ?? null,
            max_withdrawal: data?.data?.max_withdrawal ?? null,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await updateLimits({
                    min_deposit: values.min_deposit?.toString() === "" ? null : values.min_deposit,
                    max_deposit: values.max_deposit?.toString() === "" ? null : values.max_deposit,
                    min_withdrawal: values.min_withdrawal?.toString() === "" ? null : values.min_withdrawal,
                    max_withdrawal: values.max_withdrawal?.toString() === "" ? null : values.max_withdrawal,
                }).unwrap();
                dispatch(showToast({ message: response.message || "Saved successfully", variant: ToastVariant.SUCCESS }));
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Something went wrong", variant: ToastVariant.ERROR }));
            }
        },
    });

    const handleNumberChange = (field: string, value: string) => {
        formik.setFieldValue(field, value === "" ? null : Number(value));
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            {/* Deposit Limits */}
            <div className="form__field__wrapper border border-gray rounded-[16px] mb-6">
                <div className="form__title py-6 px-10 border-b border-gray">
                    <h2 className="text-[20px] font-bold">Deposit Limits</h2>
                    <p className="text-[13px] mt-1 opacity-60">Leave blank to apply no limit</p>
                </div>
                <div className="form__fields p-6 lg:p-10 grid gap-4 lg:gap-6 md:grid-cols-2">
                    <div className="input__field">
                        <InputLabel>Minimum Deposit ($)</InputLabel>
                        <OutlinedInput
                            fullWidth
                            type="number"
                            name="min_deposit"
                            placeholder="No minimum"
                            value={formik.values.min_deposit ?? ""}
                            onChange={(e) => handleNumberChange("min_deposit", e.target.value)}
                            onBlur={formik.handleBlur}
                            inputProps={{ min: 0, step: 1 }}
                        />
                        <span className="error">
                            {formik.touched.min_deposit && formik.errors.min_deposit ? formik.errors.min_deposit : ""}
                        </span>
                    </div>
                    <div className="input__field">
                        <InputLabel>Maximum Deposit ($)</InputLabel>
                        <OutlinedInput
                            fullWidth
                            type="number"
                            name="max_deposit"
                            placeholder="No maximum"
                            value={formik.values.max_deposit ?? ""}
                            onChange={(e) => handleNumberChange("max_deposit", e.target.value)}
                            onBlur={formik.handleBlur}
                            inputProps={{ min: 0, step: 1 }}
                        />
                        <span className="error">
                            {formik.touched.max_deposit && formik.errors.max_deposit ? formik.errors.max_deposit : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* Withdrawal Limits */}
            <div className="form__field__wrapper border border-gray rounded-[16px] mb-6">
                <div className="form__title py-6 px-10 border-b border-gray">
                    <h2 className="text-[20px] font-bold">Withdrawal Limits</h2>
                    <p className="text-[13px] mt-1 opacity-60">Leave blank to apply no limit</p>
                </div>
                <div className="form__fields p-6 lg:p-10 grid gap-4 lg:gap-6 md:grid-cols-2">
                    <div className="input__field">
                        <InputLabel>Minimum Withdrawal ($)</InputLabel>
                        <OutlinedInput
                            fullWidth
                            type="number"
                            name="min_withdrawal"
                            placeholder="No minimum"
                            value={formik.values.min_withdrawal ?? ""}
                            onChange={(e) => handleNumberChange("min_withdrawal", e.target.value)}
                            onBlur={formik.handleBlur}
                            inputProps={{ min: 0, step: 1 }}
                        />
                        <span className="error">
                            {formik.touched.min_withdrawal && formik.errors.min_withdrawal ? formik.errors.min_withdrawal : ""}
                        </span>
                    </div>
                    <div className="input__field">
                        <InputLabel>Maximum Withdrawal ($)</InputLabel>
                        <OutlinedInput
                            fullWidth
                            type="number"
                            name="max_withdrawal"
                            placeholder="No maximum"
                            value={formik.values.max_withdrawal ?? ""}
                            onChange={(e) => handleNumberChange("max_withdrawal", e.target.value)}
                            onBlur={formik.handleBlur}
                            inputProps={{ min: 0, step: 1 }}
                        />
                        <span className="error">
                            {formik.touched.max_withdrawal && formik.errors.max_withdrawal ? formik.errors.max_withdrawal : ""}
                        </span>
                    </div>
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
