import { Grid, Button, Box, TextField, InputAdornment, IconButton, } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useStyles } from './Styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { publicRequest } from '../../../ApiMethods.js';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

var validationSchema = yup.object({
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    confirmPassword: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Confirm Password is required'),
});

function ResetPassword() {

    const { id } = useParams();

    const navigate = useNavigate()
    const classes = useStyles();

    //btnLoader
    const [loader, setLoader] = useState(false)
    //Show Password States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    //Error Message
    const [passwordError, setPasswordError] = useState(null);

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    };

    const formik = useFormik({
        initialValues: {
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
                    newPassword: values.password
                }

                publicRequest.post(`user/reset-password/${id}`, apiObject)
                    .then(() => {
                        toast.success('You have successfully updated your password.')
                        setLoader(false)
                        navigate('/login')
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

            <Box sx={{ maxWidth: '1440px', margin: 'auto', height: '100%' }} >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container>
                        <Grid item xs={12} className={classes.itemCenter}>
                            <Box sx={{ marginTop: '23px' }}>
                                <TextField
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
                                <TextField
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
                            <Button type="submit" variant="contained" className={classes.signInButton} > {loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Submit'} </Button>
                        </Grid>
                    </Grid >
                </form>
            </Box>
        </>
    )
}

export default ResetPassword