import { GameProps } from "@/types/game";
import { InputLabel, OutlinedInput } from "@mui/material";
import { FormikProps } from "formik";
import InputFile from "../atom/InputFile";

export default function MetaDescription({
    formik,
}: {
    formik: FormikProps<GameProps>;
}) {
    return (
        <div className="form__field__wrapper border border-gray rounded-[16px] mb-6">
            <div className="form__title py-6 px-10 border-b border-gray">
                <h2 className="text-[20px] leading-[140%] font-bold">
                    SEO Setting
                </h2>
            </div>

            <div className="form__fields p-6 lg:p-10 flex flex-col gap-4 lg:gap-6">

                {/* Meta Title */}
                <div className="input__field">
                    <InputLabel htmlFor="meta.meta_title">Meta Title</InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="meta.meta_title"
                        name="meta.meta_title"
                        placeholder="Enter the Meta Title"
                        value={formik.values.meta?.meta_title || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>

                {/* Meta Description */}
                <div className="input__field">
                    <InputLabel htmlFor="meta.meta_description">
                        Meta Description
                    </InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="meta.meta_description"
                        name="meta.meta_description"
                        placeholder="Enter the SEO Description"
                        value={formik.values.meta?.meta_description || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        multiline
                        minRows={3}
                    />
                </div>

                {/* Meta Image */}
                <div className="input__field">
                    <InputFile
                        name="meta.og_image"
                        label="Thumbnail of the Game"
                        value={formik.values.meta?.og_image || null}
                        onChange={(file: File | File[] | null) =>
                            formik.setFieldValue("meta.og_image", file)
                        }
                        onBlur={() =>
                            formik.setFieldTouched("meta.og_image", true)
                        }
                        serverFile={formik.values.meta?.og_image_url}
                        onRemoveServerFile={() =>
                            formik.setFieldValue("meta.og_image_url", undefined)
                        }
                    />
                </div>
            </div>
        </div>
    );
}
