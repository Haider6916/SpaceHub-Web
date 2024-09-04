import React, { useEffect, useState } from 'react'
import { Grid, Button, Typography, Box, TextField, InputAdornment, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import CustomPhoneInput from '../../../components/CustomPhoneInput/CustomPhoneInput.jsx';
import { styled } from '@mui/styles';
import { useStyles } from './Styles.jsx';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dummyPhoneData from '../../../Utils/dummyPhoneNumbers.json'
import { publicRequest } from '../../../ApiMethods.js';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { Toaster, toast } from 'react-hot-toast';

const CustomTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        height: '48px',
        fontSize: '16px',
        fontFamily: "'DM Sans', sans-serif !important",
        lineHeight: '28px',
        color: '#565556',
        borderRadius: '8px',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: '0px solid red', // set the border width when the input is focused
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: '0px solid yellow', // remove the border by default
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        border: '0px solid blue', // set the border width on hover
    },
    width: "540px  !important",
    backgroundColor: '#F6F5F5',
    borderRadius: '8px',
});

const CustomSmallTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        height: '48px',
        fontSize: '16px',
        fontFamily: "'DM Sans', sans-serif !important",
        lineHeight: '28px',
        color: '#565556',
        borderRadius: '8px',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: '0px solid red', // set the border width when the input is focused
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: '0px solid yellow', // remove the border by default
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        border: '0px solid blue', // set the border width on hover
    },
    width: "258px  !important",
    backgroundColor: '#F6F5F5',
    borderRadius: '8px',
});


function SignUp() {

    const navigate = useNavigate()
    const classes = useStyles();

    const [verification, setVerification] = useState(false);
    //Show Password States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    //Error Message
    const [passwordError, setPasswordError] = useState(null);

    //btnLoader
    const [loader, setLoader] = useState(false)

    //useStates for phoneNumber
    const [selectedCountry, setSelectedCountry] = useState({ "name": "Pakistan", "dial_code": "+92", "code": "PK" });
    const [phoneLength, setPhoneLength] = useState(10)

    var validationSchema = yup.object({
        firstName: yup
            .string('Enter your First Name')
            .required('First Name is required'),
        lastName: yup
            .string('Enter your last Name')
            .required('Last Name is required'),
        email: yup
            .string('Enter your email')
            .email('Enter a valid email')
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email')
            .required('Email is required'),
        phoneNumber: yup
            .string('Enter your Phone Number')
            .required('Phone Number is required')
            .min(phoneLength, `Phone Number should be at least ${phoneLength} digits`),
        password: yup
            .string('Enter your password')
            .min(8, 'Password should be of minimum 8 characters length')
            .required('Password is required'),
        confirmPassword: yup
            .string('Enter your password')
            .min(8, 'Password should be of minimum 8 characters length')
            .required('Confirm Password is required'),
    });



    useEffect(() => {
        setPhoneLength(dummyPhoneData[selectedCountry.code].length)
        formik.setFieldValue('phoneNumber', '')
        // eslint-disable-next-line
    }, [selectedCountry])

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    };

    const handleResendVerification = () => {
        let apiObj = {
            'email': formik.values.email
        }
        publicRequest.post('/user/verification/resend', apiObj)
            .then((res) => {
                toast.success(res.message)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message)
            });
    }

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            if (values.password !== values.confirmPassword) {
                setPasswordError('Passwords do not match')
            }
            else {
                setLoader(true)
                setPasswordError(null)
                const apiObject = {
                    "firstName": {
                        "en": values.firstName,
                        "ar": ""
                    },
                    "lastName": {
                        "en": values.lastName,
                        "ar": ""
                    },
                    "email": values.email,
                    "password": values.password,
                    "phoneNumber": selectedCountry.dial_code + values.phoneNumber,
                    "role": "space_owner"
                }
                publicRequest.post('user/register', apiObject)
                    .then(() => {
                        setLoader(false)
                        sessionStorage.setItem("userEmail", values.email);
                        setVerification(true)
                    })
                    .catch((error) => {
                        setLoader(false)
                        toast.error(error.response.data.error.message)
                    });
            }
        }
    });


    useEffect(() => {
        if (passwordError !== null) {
            if (formik.values.confirmPassword === formik.values.password) {
                setPasswordError(null)
            }
        }
        // eslint-disable-next-line
    }, [formik.values]);



    return (
        <>

            <Box>
                <Toaster />
            </Box>

            {verification === false && (

                <Box sx={{ maxWidth: '1440px', margin: 'auto', height: '100%' }} >
                    <form autocomplete="off" onSubmit={formik.handleSubmit}>
                        <Grid container >
                            <Grid item xs={12} className={classes.itemEnd}>
                                <Box className={classes.verticallyCenter} sx={{ marginTop: '76px', marginRight: '165px' }}>
                                    <Typography sx={{ marginRight: '15px', fontSize: '19px', lineHeight: '32px', color: "#565556" }}>
                                        Already have an account?
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        className={classes.signUpButton}
                                        onClick={() => { navigate('/login') }}
                                    >
                                        Sign in
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} className={classes.itemCenter}>
                                <Typography className={classes.mainHeading}> Sign up your account</Typography>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} className={classes.itemCenter}>
                                <Typography className={classes.subHeading} > sign up with your email</Typography>
                            </Grid>
                        </Grid>

                        <Grid container >
                            <Grid item xs={12} className={classes.itemCenter} sx={{ marginTop: '25px' }}>
                                <Box sx={{ display: 'flex' }} >
                                    <CustomSmallTextField
                                        size="small"
                                        id="firstName"
                                        placeholder="First Name"
                                        variant="outlined"
                                        sx={{ marginRight: '23px' }}
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                    />

                                    <CustomSmallTextField
                                        size="small"
                                        id="lastName"
                                        placeholder="Last Name"
                                        variant="outlined"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container >
                            <Grid item xs={12} className={classes.itemCenter} >
                                <Box sx={{ display: 'flex' }} >
                                    <Box sx={{ width: '258px', marginRight: '23px' }}>
                                        {typeof formik.errors.firstName !== "undefined" && formik.touched.firstName
                                            ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.firstName}</span>
                                            : null
                                        }

                                    </Box>
                                    <Box sx={{ width: '258px' }}>
                                        {typeof formik.errors.lastName !== "undefined" && formik.touched.lastName
                                            ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.lastName}</span>
                                            : null
                                        }
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} className={classes.itemCenter}>
                                <Box sx={{ marginTop: '23px' }}>
                                    <CustomTextField
                                        size="small"
                                        id="email"
                                        placeholder='Email Address'
                                        type="email"
                                        variant="outlined"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                    />
                                    <Box>
                                        {typeof formik.errors.email !== "undefined" && formik.touched.email
                                            ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.email}</span>
                                            : null
                                        }
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} className={classes.itemCenter}>
                                <Box sx={{ marginTop: '23px' }}>
                                    <CustomPhoneInput
                                        handlePhone={(value) => { formik.setFieldValue('phoneNumber', value) }}
                                        value={formik.values.phoneNumber}
                                        selectedCountry={(value) => setSelectedCountry(value)}
                                    />
                                    <Box>
                                        {typeof formik.errors.phoneNumber !== "undefined" && formik.touched.phoneNumber
                                            ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.phoneNumber}</span>
                                            : null
                                        }
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} className={classes.itemCenter}>
                                <Box sx={{ marginTop: '23px' }}>
                                    <CustomTextField
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        variant="outlined"
                                        placeholder='Password'
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleShowPassword}>
                                                        {showPassword ? <VisibilityOffOutlinedIcon sx={{ height: '18.5px', width: '21px' }} /> : <VisibilityOutlinedIcon sx={{ height: '18.5px !important', width: '21px !important', padding: '0px', fontSize: '16px' }} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                    />
                                    <Box>
                                        {typeof formik.errors.password !== "undefined" && formik.touched.password
                                            ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.password}</span>
                                            : null
                                        }
                                        {passwordError && <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{passwordError}</span>}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} className={classes.itemCenter}>
                                <Box sx={{ marginTop: '23px' }}>
                                    <CustomTextField
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        variant="outlined"
                                        placeholder='Confirm Password'
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleShowConfirmPassword}>
                                                        {showConfirmPassword ? <VisibilityOffOutlinedIcon sx={{ height: '18.5px', width: '21px' }} /> : <VisibilityOutlinedIcon sx={{ height: '18.5px !important', width: '21px !important', padding: '0px', fontSize: '16px' }} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                    />
                                    <Box>
                                        {typeof formik.errors.confirmPassword !== "undefined" && formik.touched.confirmPassword
                                            ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.confirmPassword}</span>
                                            : null
                                        }
                                        {passwordError && <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{passwordError}</span>}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} >
                                <Button type="submit" variant="contained" className={classes.signInButton} > {loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Sign up'} </Button>
                            </Grid>
                        </Grid >

                    </form>
                </Box >


            )}


            {verification === true && (
                <Box
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <Box >
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <MarkEmailUnreadIcon style={{
                                fontSize: 150,
                                color: '#5A5A5A'
                            }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: 40, color: '#5A5A5A' }}>Verify your email</Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 500, fontSize: 25, marginTop: 3, color: '#5A5A5A' }}>
                            We've sent an email to {formik.values.email} to verify your email address and activate your account. </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, color: '#5A5A5A' }}>
                            <Typography onClick={handleResendVerification} sx={{
                                fontWeight: 'bold', fontSize: 25, color: '#8D55A2', cursor: 'pointer', '&:hover': { color: '#6C3D8B', textDecoration: 'underline' },
                            }}>Click here </Typography>
                            <Typography sx={{ fontSize: 25, marginLeft: '5px' }}>if you did not receive an email or would like to change the email address you signed up with.</Typography>

                        </Box>
                    </Box>
                </Box >
            )}
        </>
    )
}

export default SignUp