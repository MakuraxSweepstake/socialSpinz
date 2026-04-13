'use client';
import { useSeon } from '@/app/SeonProvider';
import PasswordField from '@/components/molecules/PasswordField';
import { useAppDispatch } from '@/hooks/hook';
import { PATH } from '@/routes/PATH';
import { useLoginMutation } from '@/services/authApi';
import { clearTokens, setTokens } from '@/slice/authSlice';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { Box, InputLabel, OutlinedInput } from '@mui/material';
import { ArrowLeft } from '@wandersonalwes/iconsax-react';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import AuthMessageBlock from '../authMessageBlock';

const validationSchema = Yup.object().shape({
    emailAddress: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .test(
            'no-leading-trailing-whitespace',
            'Password cannot start or end with spaces',
            (value) => value === value?.trim()
        )
        .max(12, 'Password must be less than 10 characters'),

})
export default function LoginPage() {
    const initialValues = {
        emailAddress: "",
        password: "",
    }
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loginUser, { isLoading }] = useLoginMutation();
    const { deviceId, loading } = useSeon();
    const { handleSubmit, handleBlur, handleChange, errors, dirty, values, touched } = useFormik(
        {
            initialValues,
            validationSchema,
            onSubmit: async (values) => {
                try {
                    const response = await loginUser({
                        email: values.emailAddress,
                        password: values.password,
                        device_id: deviceId
                    }).unwrap();

                    dispatch(
                        showToast({
                            message: "Logged in successfully",
                            variant: ToastVariant.SUCCESS,
                            autoTime: true,
                        }),
                    );
                    dispatch(
                        clearTokens()
                    )
                    dispatch(
                        setTokens({
                            access_token: response.data.access_token,
                            // refreshToken: response.data?.refresh,
                            user: response.data?.user,
                        }),
                    );
                    Cookies.set('access_token', response?.data?.access_token, {
                        expires: 1,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'Strict',
                    });
                    router.replace(response?.data?.user?.role?.toLowerCase() === "user" ? "/credentials" : "/");
                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Something went wrong. Try again later",
                            variant: ToastVariant.ERROR,
                            autoTime: true,
                        }),
                    );
                }
            }
        }
    )
    return (
        <>
            <AuthMessageBlock
                title='Ready to get started and win BIG?'
                features={["Fun & Fair Gameplay", "Exciting Prizes", "Accessible Anytime, Anywhere", "Trusted & Secure"]}
            />
            <Box className="auth__form__wrapper lg:w-[50%] p-8">
                <div className="section__title mb-4 lg:mb-6">
                    <Link href={PATH.DASHBOARD.ROOT} className='text-[12px] leading-[120%] font-bold lg:text-[16px] hover:text-primary flex gap-2 items-center'><ArrowLeft />Back to Homepage</Link>
                    <h1 className='text-[24px] leading-[120%] font-bold lg:text-[48px]'>Setup an account</h1>
                </div>

                <form action="" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-x-3 gap-y-5">
                        <div className="col-span-2">
                            <div className="input_field">
                                <InputLabel htmlFor="emailAddress">Email Address*</InputLabel>
                                <OutlinedInput
                                    name='emailAddress'
                                    id='emailAddress'
                                    placeholder='example@example.com'
                                    value={values.emailAddress}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.emailAddress && errors.emailAddress)}
                                />
                                {
                                    touched.emailAddress && errors.emailAddress ?
                                        <span className="error ">{errors.emailAddress}</span> : null
                                }
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="input_field">
                                <PasswordField
                                    name="password"
                                    label="Password*"
                                    placeholder="XXXXXXX"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password ? errors.password : undefined}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="action__group text-center flex flex-col gap-4 mt-8">
                        <button className='ss-btn bg-primary-grad' disabled={!dirty}>{isLoading ? "Logging In" : "Login"}</button>
                        <p className='text-[12px] leading-[120%] font-bold lg:text-[16px] '>Forgot password? <Link href={PATH.AUTH.FORGOT_PASSWORD.ROOT} className="text-secondary">Reset Here</Link></p>
                        <p className='text-[12px] leading-[120%] font-bold lg:text-[16px]'>Don’t have an account yet?</p>
                        <Link href={PATH.AUTH.REGISTER.ROOT} className='ss-btn bg-secondary-grad'>Setup an account</Link>
                    </div>
                </form>

            </Box>
        </>
    )
}
