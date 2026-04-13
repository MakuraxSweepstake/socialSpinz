'use client';

import PasswordField from '@/components/molecules/PasswordField';
import { US_STATES } from '@/constants/state';
import { useAppDispatch } from '@/hooks/hook';
import { PATH } from '@/routes/PATH';
import { useRegisterUserMutation } from '@/services/authApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ArrowLeft } from '@wandersonalwes/iconsax-react';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as Yup from 'yup';
import AuthMessageBlock from '../authMessageBlock';

const formFieldSx = {
    '& .MuiOutlinedInput-root, & .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root': {
        borderRadius: '27px',
        background: 'rgba(118, 107, 120, 0.55)',
        color: '#fff',
        '& .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-notchedOutline': {
            border: '0.576px solid rgba(255, 255, 255, 0.04)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline, &:hover .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.2)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: '#B801C0',
        },
    },
    '& .MuiOutlinedInput-input, & .MuiPickersInputBase-input': {
        padding: '12px 16px',
        color: '#fff',
        '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.2)',
            fontWeight: 300,
            fontSize: '12px',
            opacity: 1,
        },
    },
    '& .MuiInputAdornment-root': {
        marginRight: '8px',
    },
    '& .MuiInputAdornment-root button': {
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover': {
            color: '#fff',
            background: 'rgba(255, 255, 255, 0.08)',
        }
    },
    '& .MuiIconButton-root': {
        padding: '8px',
    }
};


const validationSchema = Yup.object().shape({
    emailAddress: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
    displayName: Yup.string()
        .required("Display Name is required")
        .max(14, "Display Name must be less than 14 characters")
        .min(6, "Display Name must be at least 6 characters long")
        .matches(/^\S+$/, "Display Name cannot contain spaces"),
    phone: Yup.string()
        .required("Phone number is required"),
    password: Yup.string()
        .required('Password is required')
        .test(
            'no-leading-trailing-whitespace',
            'Password cannot start or end with spaces',
            (value) => value === value?.trim()
        )
        .max(16, 'Password must be less than 10 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
    dob: Yup.date()
        .required("Date of birth is required")
        .max(new Date(), 'Date of birth cannot be in the future')
        .test('age', 'You must be at least 21 years old', function (value) {
            if (!value) return true;
            const cutoff = dayjs().subtract(21, 'years');
            return dayjs(value).isBefore(cutoff);
        }),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    city: Yup.string().required("City is Required"),
    state: Yup.string().required("State is Required"),
    // postal_code: Yup.string().required("Zip Code is Required"),
    address: Yup.string().required("Address is Required"),
    address_line_two: Yup.string(),
    gender: Yup.string().required("Gender is Required"),
    postal_code: Yup.string().required("Postal Code is Required"),
    ssn: Yup.string()
        .matches(/^\d{4}$/, "SSN must be exactly 4 digits no characters")
        .required("SSN is Required"),
    agree: Yup.boolean().required().oneOf([true], 'You must agree to the terms and conditions')
})

export default function RegisterPage() {
    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const dispatch = useAppDispatch();
    const [isAcuityModalOpen, setIsAcuityModalOpen] = useState(false);
    // const [acuityUrl, setAcuityUrl] = useState('');
    const route = useRouter();
    const initialValues = {
        first_name: '',
        middle_name: '',
        last_name: '',
        emailAddress: "",
        displayName: "",
        password: "",
        confirmPassword: "",
        phone: "",
        photoid_number: '',
        dob: null as Dayjs | null,
        city: '',
        agree: true,
        state: "",
        postal_code: "",
        ssn: "",
        address: "",
        address_line_two: "",
        gender: ""
    }
    const { handleSubmit, handleBlur, handleChange, errors, dirty, values, touched, setFieldValue, setFieldTouched } = useFormik(
        {
            initialValues,
            validationSchema,
            onSubmit: async (values) => {
                const formattedDob = values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : '';
                try {
                    const response = await registerUser({
                        email: values.emailAddress,
                        username: values.displayName,
                        password: values.password,
                        password_confirmation: values.confirmPassword,
                        first_name: values.first_name,
                        middle_name: values.middle_name,
                        last_name: values.last_name,
                        phone: `+1 ${values.phone}`,
                        photoid_number: values.photoid_number,
                        dob: formattedDob,
                        city: values.city,
                        state: values.state,
                        postal_code: values.postal_code,
                        agree: values.agree,
                        ssn: values.ssn,
                        address: values.address,
                        address_line_two: values.address_line_two,
                        gender: values.gender
                    }).unwrap();

                    dispatch(
                        showToast({
                            message: response?.message || "User Registerd Successfully",
                            variant: ToastVariant.SUCCESS,
                            autoTime: true,
                        }),
                    );
                    if (response?.data?.redirection_url) {
                        // window.open(response?.data?.redirection_url, "_blank");
                        // setAcuityUrl(response.data.redirection_url);
                        // setIsAcuityModalOpen(true);
                        route.replace(PATH.AUTH.LOGIN.ROOT)
                    }

                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Unable to register user. Try again later",
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
                title="Welcome Back. Ready to rock today?"
                features={["Fun & Fair Gameplay", "Exciting Prizes", "Accessible Anytime, Anywhere", "Trusted & Secure"]}
            />
            <Box className="auth__form__wrapper lg:w-[50%] p-8 max-h-screen overflow-auto">
                <div className="section__title mb-4 lg:mb-6">
                    <Link href={PATH.DASHBOARD.ROOT} className='text-[12px] leading-[120%] font-bold lg:text-[16px] hover:text-primary flex gap-2 items-center'><ArrowLeft />Back to Homepage</Link>
                    <h1 className='text-[24px] leading-[120%] font-bold lg:text-[48px]'>Setup an account</h1>
                </div>

                <form action="" onSubmit={handleSubmit}>
                    <div className="flex flex-col lg:grid  lg:grid-cols-6 gap-x-3 gap-y-4">
                        {/* First Name */}
                        <div className="lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="first_name">First Name<span className="text-red-500">*</span></InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="first_name"
                                    name="first_name"
                                    placeholder="Enter first name"
                                    value={values.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={formFieldSx}
                                />
                                <span className="error">{touched.first_name && errors.first_name}</span>
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="last_name">Last Name<span className="text-red-500">*</span></InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Enter last name"
                                    value={values.last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={formFieldSx}
                                />
                                <span className="error">{touched.last_name && errors.last_name}</span>
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="lg:col-span-6">
                            <div className="input_field">
                                <InputLabel htmlFor="emailAddress">Email Address<span className="text-red-500">*</span></InputLabel>
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

                        {/* DISPLAY NAME */}
                        <div className="lg:col-span-3">
                            <div className="input_field">
                                <InputLabel htmlFor="displayName">Display Name<span className="text-red-500">*</span></InputLabel>
                                <OutlinedInput
                                    name='displayName'
                                    id='displayName'
                                    placeholder='John doe'
                                    value={values.displayName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.displayName && errors.displayName)}
                                />
                                {
                                    touched.displayName && errors.displayName ?
                                        <span className="error ">{errors.displayName}</span> : null
                                }
                            </div>
                        </div>

                        <div className="input__field lg:col-span-3">
                            <InputLabel htmlFor="address">Address Line 1<span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                fullWidth
                                id="address"
                                name="address"
                                placeholder="Enter address"
                                value={values.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <span className="error">
                                {touched.address && errors.address ? errors.address : ""}
                            </span>
                        </div>

                        <div className="input__field lg:col-span-3">
                            <InputLabel htmlFor="address_line_two">Address Line 2</InputLabel>
                            <OutlinedInput
                                fullWidth
                                id="address_line_two"
                                name="address_line_two"
                                placeholder="Enter address line 2"
                                value={values.address_line_two}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <span className="error">
                                {touched.address_line_two && errors.address_line_two ? errors.address_line_two : ""}
                            </span>
                        </div>

                        {/* City */}
                        <div className="lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="city">City <span className="text-red-500">*</span></InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="city"
                                    name="city"
                                    placeholder="Enter city"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={formFieldSx}
                                />
                                <span className="error">{touched.city && errors.city}</span>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="state">State <span className="text-red-500">*</span></InputLabel>

                                <Select
                                    fullWidth
                                    id="state"
                                    name="state"
                                    displayEmpty
                                    value={values.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={formFieldSx}
                                    renderValue={(selected) =>
                                        selected === "" ? "Select a State" : selected
                                    }
                                >
                                    <MenuItem value="">
                                        <em>Select a State</em>
                                    </MenuItem>
                                    {US_STATES.map((state) => (
                                        <MenuItem key={state.value} value={state.value}>
                                            {state.label}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <span className="error">{touched.state && errors.state}</span>
                            </div>
                        </div>

                        <div className="input__field lg:col-span-3">
                            <InputLabel htmlFor="gender">Gender <span className="text-red-500">*</span></InputLabel>
                            <Select
                                fullWidth
                                id="gender"
                                name="gender"
                                displayEmpty
                                value={values.gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                renderValue={(selected) =>
                                    selected === "" ? "Select a Gender" : selected
                                }
                            >
                                <MenuItem value="">
                                    <em>Select a Gender</em>
                                </MenuItem>
                                {[
                                    { label: "Male", value: "M" },
                                    { label: "Female", value: "F" },
                                    { label: "Other", value: "O" },
                                ].map((state) => (
                                    <MenuItem key={state.value} value={state.value}>
                                        {state.label}
                                    </MenuItem>
                                ))}
                            </Select>

                            <span className="error">{touched.gender && errors.gender}</span>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="postal_code">Postal Code <span className="text-red-500">*</span></InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="postal_code"
                                    name="postal_code"
                                    placeholder="Enter Postal code"
                                    value={values.postal_code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <span className="error">
                                    {touched.postal_code && errors.postal_code ? errors.postal_code : ""}
                                </span>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="ssn">SSN<span className="text-red-500"> (last 4 Digit) *</span></InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="ssn"
                                    name="ssn"
                                    placeholder="Enter Last 4 Digit of SSN"
                                    value={values.ssn}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <span className="error">
                                    {touched.ssn && errors.ssn ? errors.ssn : ""}
                                </span>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <InputLabel htmlFor="phone">Phone <span className="text-red-500">*</span></InputLabel>
                            <div className="grid grid-cols-12 gap-1 items-start">
                                <div className="col-span-4 lg:col-span-3">
                                    <OutlinedInput
                                        fullWidth
                                        id="country_code"
                                        name="country_code"
                                        placeholder="Enter country_code number"
                                        value={"+1"}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled
                                    />
                                </div>
                                <div className="input__field col-span-8 lg:col-span-9">
                                    <OutlinedInput
                                        fullWidth
                                        id="phone"
                                        name="phone"
                                        placeholder="Enter phone number"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <span className="error">
                                        {touched.phone && errors.phone ? errors.phone : ""}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="dob">Date of Birth <span className="text-red-500">*</span></InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={values.dob}
                                        onChange={(newValue) => {
                                            setFieldValue('dob', newValue);
                                        }}
                                        onClose={() => setFieldTouched('dob', true)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                id: 'dob',
                                                name: 'dob',
                                                placeholder: 'MM/DD/YYYY',
                                                error: Boolean(touched.dob && errors.dob),
                                                onBlur: handleBlur,
                                                helperText: touched.dob && errors.dob,
                                                sx: formFieldSx
                                            },
                                            popper: {
                                                sx: {
                                                    '& .MuiPickersCalendarHeader-label': {
                                                        color: '#fff',
                                                    },
                                                    '& .MuiDayCalendar-weekDayLabel': {
                                                        color: '#fff',
                                                    },
                                                    '& .MuiPickersDay-root': {
                                                        color: '#fff',
                                                    },
                                                    '& .MuiPickersDay-root.Mui-selected': {
                                                        backgroundColor: '#B801C0',
                                                    },
                                                    '& .MuiPickersDay-root:hover': {
                                                        backgroundColor: 'rgba(184, 1, 192, 0.3)',
                                                    },
                                                    '& .MuiPickersArrowSwitcher-button': {
                                                        color: '#fff',
                                                    },
                                                    '& .MuiPickersCalendarHeader-root': {
                                                        color: '#fff',
                                                    },
                                                    '& .MuiPickersDay-root.MuiPickersDay-today': {
                                                        backgroundColor: '#B801C0',
                                                        border: '1px solid #fff',
                                                        '&:not(.Mui-selected)': {
                                                            backgroundColor: '#B801C0',
                                                        }
                                                    },

                                                }
                                            }
                                        }}
                                        maxDate={dayjs()}
                                        format="MM/DD/YYYY"
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="input_field">
                                <PasswordField
                                    name="password"
                                    label="Password"
                                    placeholder="XXXXXXX"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password ? errors.password : undefined}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="input_field">
                                <PasswordField
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    placeholder="XXXXXXX"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.confirmPassword ? errors.confirmPassword : undefined}
                                />
                            </div>
                        </div>

                        <div className="col-span-6">
                            <FormControlLabel
                                control={<Checkbox
                                    checked={values.agree}
                                    onChange={() => setFieldValue("agree", true)}
                                />}
                                label="I agree to the terms and conditions" />
                        </div>
                    </div>
                    <div className="action__group text-center flex flex-col gap-4 mt-8">
                        <Button variant='contained' color='primary' type='submit' disabled={!dirty || isLoading} startIcon={isLoading ? <CircularProgress size={20} /> : undefined}>
                            {isLoading ? "Signing Up" : "Sign up"}
                        </Button>
                        <p className='text-[12px] leading-[120%] font-bold lg:text-[16px]'>Already Have an account?</p>
                        <Link href={PATH.AUTH.LOGIN.ROOT} className='ss-btn bg-secondary-grad'>Login</Link>
                    </div>
                </form>
            </Box>

            {/* <PaymentModal
                url={acuityUrl}
                isOpen={isAcuityModalOpen}
                onClose={() => setIsAcuityModalOpen(false)}
                onSuccess={() => {
                    setIsAcuityModalOpen(false);
                    dispatch(showToast({ message: 'Verification complete!', variant: ToastVariant.SUCCESS, autoTime: true }));
                }}
                onError={(error: { message: string }) => {
                    console.error('Acuity verification error', error);
                    dispatch(showToast({ message: error.message || 'Verification failed', variant: ToastVariant.ERROR, autoTime: true }));
                }}
                successMessage="verified"
                title="Acuity identity verification"
                maxWidth="md"
                height={700}
                isRegistrationFlow={true}
            /> */}

        </>
    )
}
