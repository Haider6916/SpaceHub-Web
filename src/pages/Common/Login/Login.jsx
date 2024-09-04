import React, { useEffect, useState } from 'react'
import { Grid, Button, Typography, Box, TextField, InputAdornment, IconButton } from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { useStyles } from './Styles.jsx';
import styled from '@emotion/styled';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { publicRequest } from '../../../ApiMethods.js';
import { useDispatch, useSelector, } from 'react-redux'
import { loginSuccess } from "../../../Redux/authSlice.js";
import { Toaster, toast } from 'react-hot-toast';


const CustomTextField = styled(TextField)({
    '& .MuiInputBase-root': {
        height: '48px',
        fontSize: '16px',
        fontFamily: "'DM Sans', sans-serif",
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


const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});

function Login() {

    const { userRole, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    console.log('is Authenticated in login', isAuthenticated);

    useEffect(() => {
        if (isAuthenticated === true && userRole === 'space_owner') {
            navigate('/dashboard')
        }
        // eslint-disable-next-line 
    }, [userRole, isAuthenticated])



    const classes = useStyles();

    //Show Password State
    const [showPassword, setShowPassword] = useState(false);

    //btnLoader
    const [loader, setLoader] = useState(false)


    const handleClickShowPassword = () => {
        setShowPassword((show) => !show)
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setLoader(true)
            const apiObject = {
                "password": values.password,
                "email": values.email
            }
            sessionStorage.setItem("userEmail", values.email);
            publicRequest.post('user/login', apiObject)
                .then((response) => {
                    dispatch(loginSuccess(response))
                    navigate('/dashboard')
                })
                .catch((error) => {
                    if (error.response.data.error.status === 403) {
                        navigate('/not-verified')
                    }
                    else {
                        toast.error(error.response.data.error.message)
                    }

                }).finally(() => {
                    setLoader(false)
                });

        },
    });

    return (
        <>
            <Box>
                <Toaster />
            </Box>
            <Box sx={{ maxWidth: '1440px', margin: 'auto' }} >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container >
                        <Grid item xs={12} className={classes.itemEnd}>
                            <Box className={classes.verticallyCenter} sx={{ marginTop: '72px', marginRight: '165px', }}>
                                <Typography sx={{ marginRight: '29px', fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "19px", lineHeight: '32px', color: "#565556" }} >
                                    Don't have an account?
                                </Typography>
                                <Button variant="contained" className={classes.signUpButton} onClick={() => { navigate('/signup') }}>Sign up</Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} className={classes.itemCenter}>
                            <Typography className={classes.mainHeading}> Sign in your account</Typography>
                        </Grid>

                        <Grid item xs={12} className={classes.itemCenter}>
                            <Typography className={classes.subHeading} > sign in with your email</Typography>
                        </Grid>

                        <Grid item xs={12} className={classes.itemCenter} sx={{ marginTop: '25px', }}>
                            <Box>
                                <CustomTextField
                                    id="email"
                                    placeholder="Email Address"
                                    variant="outlined"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                />
                                <Box>
                                    {typeof formik.errors.email !== "undefined" && formik.touched.email
                                        ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.email}</span>
                                        : null
                                    }
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} className={classes.itemCenter}>
                            <Box sx={{ marginTop: "23px" }}>
                                <CustomTextField
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    variant="outlined"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}

                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowPassword}>
                                                    {showPassword ? < VisibilityOffOutlinedIcon sx={{ height: '18.5px', width: '21px' }} /> : <VisibilityOutlinedIcon sx={{ height: '18.5px !important', width: '21px !important', padding: '0px', fontSize: '16px' }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Box>
                                    {typeof formik.errors.password !== "undefined" && formik.touched.password
                                        ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.password}</span>
                                        : null
                                    }
                                </Box>
                                <Box onClick={() => { navigate('/forget-password') }} className={classes.itemEnd}>
                                    <Typography className={classes.forgetName}> Forgot password?</Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} >
                            <Button variant="contained" className={classes.signInButton} type="submit">{loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Sign in'} </Button>
                        </Grid>
                    </Grid >
                </form>
            </Box >
        </>
    )
}

export default Login