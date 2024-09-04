import React, { useEffect, useState } from 'react'
import CustomTextField from '../CustomDrawerTextField/CustomTextField'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ReactComponent as CloseCircle } from '../../Assets/SVGs/CloseCircle.svg';
import { ErrorOutline } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { privateRequest } from '../../ApiMethods';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { employeeReloadTrue } from '../../Redux/directorySlice';

const useStyles = makeStyles(() => ({
    errorIcon: {
        marginRight: '16px',
        fontSize: '24px !important',
        color: '#CB2C17',
    },
    errorMessage: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'DM Sans', sans-serif !important",
        fontSize: '14px !important',
        color: '#CB2C17',
        marginTop: '3px'
    },
}));


function EditEmployeeDrawer(props) {

    const { employeeData } = props
    const dispatch = useDispatch()
    const classes = useStyles();

    const [companiesList, setCompaniesList] = useState([])
    const [companyNames, setCompanyNames] = useState([])

    const [resourcesList, setResourcesList] = useState([])
    const [resourcesNames, setResourcesNames] = useState([])

    const [selectedCompany, setSelectedCompany] = useState(employeeData.company.name)
    const [selectedAllocation, setSelectedAllocation] = useState(employeeData.allocation.length !== 0 ? employeeData.allocation[0].name : '')

    const [companyID, setCompanyID] = useState(employeeData.company._id)


    const [firstRender, setFirstRender] = useState(true)
    const [loader, setLoader] = useState(false)


    useEffect(() => {
        fetchCompaniesAndResources()
    }, [])

    const fetchCompaniesAndResources = () => {
        privateRequest.get('/company').then((res) => {
            setCompaniesList(res.data.docs)
            let tempArray = []
            res.data.docs.forEach((value, index) => {
                tempArray.push(value.name)
            })
            setCompanyNames(tempArray)
            setFirstRender(false)
            fetchCompanyResouces(res.data.docs)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const fetchCompanyResouces = (companyArray) => {
        let id
        companyArray.forEach((value) => {
            if (value.name === selectedCompany) {
                id = value._id
                setCompanyID(id)
            }
        })

        privateRequest.get(`/company/${id}`).then((res) => {
            setResourcesList(res.data.resources)
            let tempArray = []
            res.data.resources.forEach((value, index) => {
                tempArray.push(value.name)
            })
            setResourcesNames(tempArray)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    useEffect(() => {
        if (selectedCompany !== '' && firstRender === false) {
            fetchCompanyResouces(companiesList)
        }
    }, [selectedCompany])

    var validationSchema = yup.object({
        firstName: yup
            .string('First Name')
            .required('First Name is required'),
        lastName: yup
            .string('Last Name')
            .required('Last Name is required'),
        phoneNumber: yup
            .string('Phone Number')
            .required('Phone Number is required'),
        profession: yup
            .string('Profession (Optional)')
            .required('Phone Number is required'),
        email: yup
            .string('Email')
            .email('Enter a valid email')
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email')
            .required('Email is required'),
        allocation: yup
            .string('Allocation')
            .required('Allocation is required'),
        company: yup
            .string('Company')
            .required('Company is required'),
    });


    const formik = useFormik({
        initialValues: {
            firstName: employeeData.firstName.en,
            lastName: employeeData.lastName.en,
            phoneNumber: employeeData.phoneNumber,
            profession: employeeData.profession.en,
            email: employeeData.email,
            allocation: employeeData.allocation.length !== 0 ? employeeData.allocation[0]._id : '',
            company: employeeData.company._id
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            setLoader(true)

            let allocationID
            resourcesList.forEach((value, index) => {
                if (value.name === selectedAllocation) {
                    allocationID = value._id
                }
            })

            let companyID
            companiesList.forEach((company) => {
                if (company.name === selectedCompany) {
                    companyID = company._id
                }
            })

            let apiObject = {
                "firstName": {
                    "en": values.firstName,
                    "ar": ""
                },
                "lastName": {
                    "en": values.lastName
                },
                "email": values.email,
                "phoneNumber": values.phoneNumber,
                "company": companyID,
                "allocation": allocationID,
                "profession": {
                    "en": values.profession
                }
            }

            privateRequest.put(`/user/${employeeData._id}`, apiObject).then((res) => {
                toast.success(res.data.message)
                dispatch(employeeReloadTrue())
                props.handleCloseEditEmployee()
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            }).finally(() => {
                setLoader(false)
            })
        }
    });

    console.log('SelectedAllocation', selectedAllocation);
    return (
        <>

            <form onSubmit={formik.handleSubmit}>

                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography sx={{ marginTop: '8.87px', fontStyle: 'normal', fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                        Edit Employee
                    </Typography>

                    <CloseCircle onClick={() => props.handleCloseEditEmployee(false)} style={{ cursor: 'pointer' }} />

                </Box>

                <Box sx={{ display: 'flex', marginTop: '24px' }}>
                    <Box sx={{ marginRight: '26px' }} >
                        <CustomTextField
                            id='firstName'
                            placeholder="First name"
                            variant="outlined"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            style={{ marginRight: '26px' }}
                        />
                        <Box>
                            {typeof formik.errors.firstName !== "undefined" && formik.touched.firstName
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.firstName}</span>
                                : null
                            }
                        </Box>

                    </Box>

                    <Box>
                        <CustomTextField
                            id='lastName'
                            placeholder="Last name"
                            variant="outlined"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                        />
                        <Box>
                            {typeof formik.errors.lastName !== "undefined" && formik.touched.lastName
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.lastName}</span>
                                : null
                            }
                        </Box>

                    </Box>
                </Box>


                <Box mt='24px'>
                    <CustomTextField
                        id='email'
                        placeholder="Email"
                        variant="outlined"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    <Box>
                        {typeof formik.errors.email !== "undefined" && formik.touched.email
                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.email}</span>
                            : null
                        }
                    </Box>

                </Box>

                <Box mt='24px'>
                    <CustomTextField
                        id='profession'
                        placeholder="Profession (Optional)"
                        variant="outlined"
                        value={formik.values.profession}
                        onChange={formik.handleChange}
                    />
                    <Box>
                        {typeof formik.errors.profession !== "undefined" && formik.touched.profession
                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.profession}</span>
                            : null
                        }
                    </Box>

                </Box>

                <Box mt='24px'>
                    <CustomTextField
                        id='phone'
                        placeholder="Phone Number"
                        variant="outlined"
                        value={formik.values.phoneNumber}
                        onChange={(event) => formik.setFieldValue('phoneNumber', event.target.value)}
                    />
                    <Box>
                        {typeof formik.errors.phoneNumber !== "undefined" && formik.touched.phoneNumber
                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.phoneNumber}</span>
                            : null
                        }
                    </Box>

                </Box>

                <Box mt='24px'>
                    <CustomDropdown
                        placeholderValue='Select company'
                        menuItems={companyNames}
                        value={employeeData.company.name}
                        handleDropdownValue={(value) => {
                            formik.setFieldValue('company', value)
                            setSelectedCompany(value)
                            setSelectedAllocation('')
                        }}
                    />
                    <Box>
                        {typeof formik.errors.company !== "undefined" && formik.touched.company
                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.company}</span>
                            : null
                        }
                    </Box>

                </Box >

                <Box mt='24px'>
                    <CustomDropdown
                        placeholderValue='Assign resources'
                        menuItems={resourcesNames}
                        value={selectedAllocation}
                        handleDropdownValue={(value) => {
                            formik.setFieldValue('allocation', value)
                            setSelectedAllocation(value)
                        }}
                    />
                    <Box>
                        {typeof formik.errors.allocation !== "undefined" && formik.touched.allocation
                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.allocation}</span>
                            : null
                        }
                    </Box>
                </Box >

                <Box sx={{ marginTop: '100px', display: 'flex', justifyContent: 'flex-end' }} >
                    <Button
                        onClick={() => props.handleCloseEditEmployee(false)}
                        variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#272627', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}> Back </Button>

                    <Button
                        type="submit"
                        variant='contained'
                        sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                    >
                        {loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Save'}
                    </Button>

                </Box >
            </form>

        </>
    )
}

export default EditEmployeeDrawer