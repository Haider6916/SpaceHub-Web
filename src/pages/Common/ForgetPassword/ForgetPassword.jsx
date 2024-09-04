import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useStyles } from './Styles.jsx';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { publicRequest } from '../../../ApiMethods.js';
import { Toaster, toast } from 'react-hot-toast';

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email').matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email')
        .required('Email is required'),
});

function ForgetPassword() {

    const classes = useStyles();
    //btnLoader
    const [loader, setLoader] = useState(false)


    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log('data submitted');
            setLoader(true)
            const apiObject = {
                "email": values.email
            }
            publicRequest.post('user/forgot-password', apiObject)
                .then(() => {
                    setLoader(false)
                    toast.success('We have e-mailed your password reset link!')
                })
                .catch((error) => {
                    setLoader(false)
                    toast.error(error.response.data.error.message)
                });

        },
    });

    return (
        <>
            <Box>
                <Toaster />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>No design for the client yet</Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}> This is a Dummy Page</Box>
            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid container>
                        <Grid item xs={12} className={classes.itemCenter} sx={{ marginTop: '25px', }}>
                            <Box>
                                <TextField
                                    id="email"
                                    placeholder="Email"
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
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: "50px" }} >
                            <Button variant="contained" className={classes.submitButton} type="submit">{loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Submit'} </Button>
                        </Grid>
                    </Grid>
                </Box >
            </form>
        </>

    )
}

export default ForgetPassword