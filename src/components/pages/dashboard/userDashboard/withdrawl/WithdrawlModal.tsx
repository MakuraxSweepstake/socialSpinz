import { Box, Button, InputLabel, Modal, OutlinedInput } from "@mui/material";
import { SecuritySafe } from "@wandersonalwes/iconsax-react";
import { FormikProps } from "formik";
import Image from "next/image";
import React from "react";
import { WithdrawlFormValues } from ".";

export default function WithdrawlModal({
    open,
    handleClose,
    formik,
    wallet
}: {
    open: boolean;
    handleClose: () => void;
    formik: FormikProps<WithdrawlFormValues>;
    wallet: string;
}) {
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            formik.setFieldValue("wallet_address", wallet);
            setIsEditing(false);
        }
    }, [open, wallet]);

    const handleChangeAddress = () => {
        setIsEditing(true);
        formik.setFieldValue("wallet_address", ""); // clear so user can enter new
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "24px",
                    maxWidth: "574px",
                    width: "100%",
                    background:
                        "linear-gradient(0deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.04) 100%), #3A013F",
                    boxShadow: 24,
                    p: { xs: 3, sm: 4 },
                    textAlign: "center",
                }}
            >
                {/* Wallet Banner */}
                <Image
                    src={"/assets/images/wallet-featured-image.png"}
                    alt=""
                    width={174}
                    height={140}
                    className="mx-auto"
                />

                <span className="py-2 px-3 rounded-3xl bg-[#DBFBF6] border border-[#426A66] text-[#426A66] flex justify-center items-center max-w-fit mx-auto my-4 lg:my-6">
                    <SecuritySafe />
                    Safe and secure
                </span>

                <h1 className="text-[24px] leading-[120%] font-[700]">
                    Confirm your Wallet Address
                </h1>

                <p className="text-[11px] leading-[150%] text-center max-w-[420px] mx-auto mt-3 mb-6">
                    Your Withdrawn amount will be sent to the following address.
                </p>

                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                    {/* <div className="relative">
                        <InputLabel htmlFor="photoid_number" className="text-start">Photo ID <span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            name="photoid_number"
                            id="photoid_number"
                            value={formik.values.photoid_number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your Photo ID"
                        />
                        {
                            formik.touched.photoid_number && formik.errors.photoid_number ?
                                <span className="error text-start">{formik.errors.photoid_number || ""}</span> : null
                        }
                    </div> */}
                    <div className="relative">
                        <InputLabel htmlFor="wallet_address" className="text-start">Wallet Address <span className="text-red-500">*</span></InputLabel>
                        <div className="relative">
                            <OutlinedInput
                                name="wallet_address"
                                id="wallet_address"
                                value={formik.values.wallet_address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your bitcoin address"
                                disabled={!isEditing} // ✅ locked until change
                            />
                            {!isEditing && (
                                <Button
                                    className="!p-0 !text-white"
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        right: 16,
                                        maxWidth: "fit-content",
                                        textDecoration: "underline",
                                    }}
                                    type="button"
                                    onClick={handleChangeAddress}
                                >
                                    | &nbsp;&nbsp;Change Address
                                </Button>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="!mt-3"
                        disabled={!formik.values.wallet_address}
                    >
                        Withdraw Now
                    </Button>
                </form>

                {/* Powered by */}
                <p className="text-[11px] leading-[120%] mt-8 mb-2">Powered By</p>
                <div className="flex justify-center items-center gap-4">
                    <Image src="/assets/images/payment-01.png" alt="" width={78} height={24} />
                    <Image src="/assets/images/payment-02.png" alt="" width={78} height={24} />
                    <Image src="/assets/images/payment-03.png" alt="" width={78} height={24} />
                </div>
            </Box>
        </Modal>
    );
}

