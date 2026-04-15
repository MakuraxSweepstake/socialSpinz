"use client"

import InputFile from '@/components/atom/InputFile';
import { useAppDispatch } from '@/hooks/hook';
import { useGetChatbotSettingQuery, useUpdateChatbotMutation } from '@/services/settingApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { Button, InputLabel, OutlinedInput } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";

const validationSchema = Yup.object({
    chatbot_label: Yup.string().required("Label is required"),
    chatbot_link: Yup.string().required("Link is required"),
});

export default function Chatbot() {
    const dispatch = useAppDispatch();
    const { data } = useGetChatbotSettingQuery();
    const [updateChatbotSetting, { isLoading }] = useUpdateChatbotMutation();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            chatbot_label: data?.data?.chatbot_label || "",
            chatbot_link: data?.data?.chatbot_link || "",
            chatbot_image: null as File | null,
            chatbot_image_url: data?.data?.chatbot_image_url || "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append("chatbot_label", values.chatbot_label);
                formData.append("chatbot_link", values.chatbot_link);

                if (values.chatbot_image) {
                    formData.append("chatbot_image", values.chatbot_image);
                }

                const response = await updateChatbotSetting(formData).unwrap();

                dispatch(
                    showToast({
                        variant: ToastVariant.SUCCESS,
                        message: response?.message || "Chatbot settings updated successfully",
                    })
                );
            } catch (e: any) {
                dispatch(
                    showToast({
                        variant: ToastVariant.ERROR,
                        message: e?.data?.message || "Something went wrong",
                    })
                );
            }
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="border border-gray rounded-[16px] mb-6"
        >
            <div className="py-6 px-10 border-b border-gray">
                <h2 className="text-[20px] font-bold">Chatbot Settings</h2>
            </div>

            <div className="p-6 lg:p-10 space-y-6">

                {/* Label */}
                <div>
                    <InputLabel>
                        Label<span className="text-red-500">*</span>
                    </InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="chatbot_label"
                        placeholder="Enter Label"
                        value={formik.values.chatbot_label}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="text-red-500 text-sm">
                        {formik.touched.chatbot_label && formik.errors.chatbot_label}
                    </span>
                </div>

                {/* Link */}
                <div>
                    <InputLabel>
                        Link<span className="text-red-500">*</span>
                    </InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="chatbot_link"
                        placeholder="Enter Link"
                        value={formik.values.chatbot_link}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="text-red-500 text-sm">
                        {formik.touched.chatbot_link && formik.errors.chatbot_link}
                    </span>
                </div>

                {/* Single Image Upload */}
                <div>
                    <InputFile
                        name="chatbot_image"
                        label="Chatbot Icon"
                        value={formik.values.chatbot_image}
                        onChange={(file: File | File[] | null) =>
                            formik.setFieldValue("chatbot_image", file)
                        }
                        serverFile={formik.values.chatbot_image_url}
                        onRemoveServerFile={() =>
                            formik.setFieldValue("chatbot_image_url", "")
                        }
                    />
                </div>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                >
                    {isLoading ? "Updating..." : "Update"}
                </Button>
            </div>
        </form>
    );
}
