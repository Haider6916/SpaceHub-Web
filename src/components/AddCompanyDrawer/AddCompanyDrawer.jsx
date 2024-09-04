import React, { useEffect, useState } from 'react'
import CustomTextField from '../CustomDrawerTextField/CustomTextField'
import { Box, Button, Checkbox, CircularProgress, Grid, IconButton, Modal, Radio, Step, StepConnector, StepLabel, Stepper, Typography } from '@mui/material'
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ReactComponent as CloseCircle } from '../../Assets/SVGs/CloseCircle.svg';
import { ReactComponent as Check } from '../../Assets/SVGs/Check.svg';
import { ReactComponent as DocumentUpload } from '../../Assets/SVGs/DocumentUpload.svg';
import { ReactComponent as Cross } from '../../Assets/SVGs/Cross.svg';
import { ReactComponent as Empty } from '../../Assets/SVGs/Empty.svg';
import { ReactComponent as FileCross } from '../../Assets/SVGs/FileCross.svg';
import DeskCard from './DeskCard';
import EmployeeCard from '../EmployeeDirectory/EmployeeCard';
import { Delete, ErrorOutline } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../ApiMethods';
import { comapanyReloadTrue } from '../../Redux/directorySlice';
import { useDispatch } from 'react-redux';

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

const steps = ['General Details', 'Contract Plan', 'Allocation', 'Create Company', 'Invite employee'];


//Style for Modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '920px',
    height: "535px",
    background: '#FFFFFF',
    border: '1px solid #BECED6',
    borderRadius: '4px'
};


var apiObject = {
    name: "",
    bio: "",
    email: "",
    phone: "",
    category: "",
    website: "",
    instagram: "",
    linkedin: "",
    facebook: "",
    logo: "Test",
    plan: "",
    allocation: [],
    files: "",
    companyOwner: {
        firstName: {
            en: ""
        },
        lastName: {
            en: ""
        },
        email: "",
        phoneNumber: "",
        profession: {
            en: "",
            ar: ""
        }
    }
};


function AddCompanyDrawer(props) {
    const classes = useStyles();

    const formData = new FormData();

    const dispatch = useDispatch()

    const [activeStep, setActiveStep] = useState(0);
    const [plans, setPlans] = useState([])
    const [selectedPlan, setSelectedPlan] = useState('');
    const [employeesData, setEmployeesData] = useState([])
    const [bulkAddFile, setBulkAddFile] = useState(null)
    const [companyLogo, setCompanyLogo] = useState(null)
    const [imageURL, setImageURL] = useState(null)
    const [companyID, setCompanyID] = useState(null)
    const [companyCategories, setCompanyCategories] = useState([])
    const [resources, setResources] = useState([])
    const [selectedResourcesIDs, setSelectedResourcesIDs] = useState([])
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);


    const handleChangePlan = (value) => {
        setSelectedPlan(value);
        apiObject.plan = value
    };


    const fetchCompanyCategories = () => {
        privateRequest.get('/company/categories').then((res) => {
            setCompanyCategories(res.data.categories)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })

    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const handleFetchPlans = () => {
        privateRequest.get('/plan').then((res) => {
            setPlans(res.data.plans)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const handleFetchResources = () => {
        privateRequest.get('/resource?resourceType=all').then((res) => {
            setResources(res.data.docs)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }


    const handleBulkAddEmployees = () => {
        const formData = new FormData();
        formData.append('csvFile', bulkAddFile);

        privateRequest
            .post(`/company/${companyID}/bulk`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                toast.success('File added successfully');
                let tempArray = [...employeesData]
                res.data.forEach((value) => {
                    tempArray.push(value)
                })
                setEmployeesData(tempArray)
                toast.success(res.data.message)
                setOpen(false)
                setBulkAddFile(null)
                dispatch(comapanyReloadTrue())
            })
            .catch((error) => {
                toast.error(error.response.data.error.message);
            })
            .finally(() => {
                setBulkAddLoader(false);
            });

    }

    useEffect(() => {
        handleFetchPlans()
        handleFetchResources()
        fetchCompanyCategories()
    }, [])

    //   -----------------------------------------




    const [loader, setLoader] = useState(false)
    const [bulkAddLoader, setBulkAddLoader] = useState(false)

    const validationSchemaStep1 = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email address').required('Email is required').matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email'),
        phoneNumber: yup.string('Phone Number').required('Phone Number is required'),
        // profession: yup.string('Profession').required('Phone Profession is required'),
        bio: yup.string('Invalid email address'),
        category: yup.string('Category'),
        website: yup.string('Website'),
        facebook: yup.string('Facebook'),
        linkedin: yup.string('Linkedin'),
        instagram: yup.string('Instagram'),
        file: yup.string('CompanyLogo').required('Company logo is required'),
    });

    const validationSchemaStep4 = yup.object({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        email: yup.string().required('Email is required').matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email'),
        phoneNumber: yup.string('Phone Number').required('Phone Number is required'),
        profession: yup.string('Profession'),

    });

    const validationSchemaStep5 = yup.object({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        email: yup.string().required('Email is required').matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email'),
        phoneNumber: yup.string('Phone Number').required('Phone Number is required'),
        profession: yup.string('Profession'),
    });

    const formik1 = useFormik({
        initialValues: {
            name: apiObject.name,
            bio: apiObject.bio,
            email: apiObject.email,
            phoneNumber: apiObject.phone,
            category: apiObject.category,
            website: apiObject.website,
            facebook: apiObject.facebook,
            linkedin: apiObject.linkedin,
            instagram: apiObject.instagram,
            file: null
        },
        validationSchema: validationSchemaStep1,
        onSubmit: (values) => {
            apiObject.name = values.name
            apiObject.bio = values.bio
            apiObject.email = values.email
            apiObject.phone = values.phoneNumber
            apiObject.category = values.category
            apiObject.website = values.website
            apiObject.facebook = values.facebook
            apiObject.linkedin = values.linkedin
            apiObject.instagram = values.instagram

            handleNext()
        }
    });

    const formik4 = useFormik({
        initialValues: {
            firstName: apiObject.companyOwner.firstName.en,
            lastName: apiObject.companyOwner.lastName.en,
            email: apiObject.companyOwner.email,
            phoneNumber: apiObject.companyOwner.phoneNumber,
            profession: apiObject.companyOwner.profession.en,
        },
        validationSchema: validationSchemaStep4,
        onSubmit: (values) => {
            setLoader(true)
            apiObject.companyOwner.firstName.en = values.firstName
            apiObject.companyOwner.lastName.en = values.lastName
            apiObject.companyOwner.email = values.email
            apiObject.companyOwner.phoneNumber = values.phoneNumber
            apiObject.companyOwner.profession.en = values.profession

            selectedResourcesIDs.forEach((value) => {
                formData.append('resources', value);
            });

            formData.append('name', apiObject.name);
            formData.append('bio', apiObject.bio);
            formData.append('email', apiObject.email);
            formData.append('phone', apiObject.phone);
            formData.append('category', apiObject.category);
            formData.append('website', apiObject.website);
            formData.append('facebook', apiObject.facebook);
            formData.append('linkedin', apiObject.linkedin);
            formData.append('instagram', apiObject.instagram);
            formData.append('companyOwner', JSON.stringify(apiObject.companyOwner));
            formData.append('plan', selectedPlan);
            formData.append('logo', companyLogo);

            privateRequest.post('/company', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                toast.success(res.data.message)
                dispatch(comapanyReloadTrue())
                setCompanyID(res.data._id)
                handleNext()
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            }).finally(() => {
                setLoader(false)
            })

        }
    });


    const formik5 = useFormik({
        initialValues: {
            firstName: apiObject.companyOwner.firstName.en,
            lastName: apiObject.companyOwner.lastName.en,
            email: apiObject.companyOwner.email,
            phoneNumber: apiObject.companyOwner.phoneNumber,
            profession: apiObject.companyOwner.profession.en,
        },
        validationSchema: validationSchemaStep5,
        onSubmit: (values, { resetForm }) => {
            setLoader(true)

            let inviteEmployeeObj = {
                "firstName": {
                    "en": "",
                    "ar": ""
                },
                "lastName": {
                    "en": ""
                },
                "email": "",
                "phoneNumber": "",
                "company": companyID,
                "resources": [""],
                "profession": {
                    "en": ""
                }
            }
            inviteEmployeeObj.firstName.en = values.firstName
            inviteEmployeeObj.lastName.en = values.lastName
            inviteEmployeeObj.email = values.email
            inviteEmployeeObj.phoneNumber = values.phoneNumber
            inviteEmployeeObj.profession.en = values.profession
            // inviteEmployeeObj.company = values.companyID

            privateRequest.post('/user/employee', inviteEmployeeObj).then((res) => {
                let tempArray = [...employeesData]
                tempArray.push(res.data)
                setEmployeesData(tempArray)
                toast.success(res.data.message)
                resetForm();
                dispatch(comapanyReloadTrue())
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            }).finally(() => {
                setLoader(false)
            })
        }
    });

    function CustomStepIcon(props) {
        const { active, completed } = props;
        if (completed) {
            return (
                <Box sx={{
                    height: "64px",
                    width: '64px',
                    borderRadius: '100%',
                    border: '4px solid #8D55A2',
                    backgroundColor: '#8D55A2',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '24px',
                    lineHeight: '28px',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'center'
                }}>
                    <Check style={{ width: '30px', height: '50px' }} />
                </Box>
            );
        }

        if (active === false && completed === false) {
            return (
                <Box sx={{
                    height: "64px",
                    width: '64px',
                    borderRadius: '100%',
                    border: '2px solid #C6C7C5',
                    color: '#9F9D9E',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '24px',
                    lineHeight: '28px',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'center'
                }}>
                    {props.icon}
                </Box>
            );
        }
        else {
            return (
                <Box sx={{
                    height: "64px",
                    width: '64px',
                    borderRadius: '100%',
                    border: '4px solid #8D55A2',
                    color: '#8D55A2',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '24px',
                    lineHeight: '28px',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'center'
                }}>
                    {props.icon}
                </Box>
            );
        }
    }


    const CustomStepConnector = (props) => {
        const { active } = props;

        return (
            <StepConnector
                {...props}
                sx={{
                    '& .MuiStepConnector-line': {
                        borderColor: active ? '#8D55A2' : '#9F9D9E', // active and disabled line color
                        borderWidth: 3,
                        marginTop: '20px',
                        width: '140px',
                        marginLeft: '-70px'
                    },
                }}
            />
        );
    };

    return (
        <>

            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography sx={{ marginTop: '8.87px', fontStyle: 'normal', fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                    Add Company
                </Typography>

                <CloseCircle onClick={() => {
                    props.handleCloseAddCompany(false);
                    apiObject = {
                        name: "",
                        bio: "",
                        email: "",
                        phone: "",
                        category: "",
                        website: "",
                        instagram: "",
                        linkedin: "",
                        facebook: "",
                        logo: "Test",
                        plan: "",
                        allocation: [],
                        files: "",
                        companyOwner: {
                            firstName: {
                                en: ""
                            },
                            lastName: {
                                en: ""
                            },
                            email: "",
                            phoneNumber: "",
                            profession: {
                                en: "",
                                ar: ""
                            }
                        }
                    };
                }} style={{ cursor: 'pointer' }} />
            </Box>


            <Box sx={{ width: '100%', marginTop: '36.69px' }}>
                <Stepper
                    sx={{
                        height: 100,
                        gap: '100px',
                        '& .MuiStepLabel-labelContainer.MuiStepLabel-alternativeLabel': {
                            display: 'flex',
                            justifyContent: 'center'
                        }
                    }}
                    alternativeLabel
                    activeStep={activeStep}
                    connector={
                        <StepConnector
                            sx={{
                                '& .MuiStepConnector-line': {
                                    // borderColor: '#8D55A2',
                                    borderWidth: 0,
                                    marginTop: '20px',
                                    width: '200px',
                                    marginLeft: '-155px'
                                },
                                '& .Mui-active .MuiStepConnector-line': {
                                    borderColor: '#8D55A2', // active line color
                                },
                                '& .Mui-disabled .MuiStepConnector-line ': {
                                    borderColor: '#9F9D9E', // disabled line color
                                },
                            }}
                        />
                        // <CustomStepConnector index={activeStep} />
                    }
                >
                    {steps.map((label, index) => (
                        <Step key={label}
                            sx={{
                                '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                {
                                    color: '#8D55A2',
                                    width: 'max-content'
                                },
                                '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                {
                                    color: '#8D55A2',
                                    width: 'max-content'
                                },
                                '& .MuiStepLabel-label.Mui-disabled.MuiStepLabel-alternativeLabel':
                                {
                                    color: '#9F9D9E',
                                    width: 'max-content'
                                },

                            }}
                        >
                            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                            {
                                index !== 0 && (
                                    <CustomStepConnector active={activeStep >= index ? true : false} />
                                )
                            }
                        </Step>
                    ))}
                </Stepper>
            </Box>

            {activeStep === 0 && (

                <form onSubmit={formik1.handleSubmit}>

                    <Box sx={{ marginTop: '60px', width: '100%' }}>

                        <Box display='flex' >
                            <Box marginRight='24px'>
                                <CustomTextField
                                    id='Name'
                                    placeholder="Name"
                                    variant="outlined"
                                    value={formik1.values.name}
                                    onChange={(event) => formik1.setFieldValue('name', event.target.value)}
                                />
                                <Box>
                                    {typeof formik1.errors.name !== "undefined" && formik1.touched.name
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.name}</span>
                                        : null
                                    }
                                </Box>
                            </Box>

                            <Box>
                                <CustomTextField
                                    id='Bio'
                                    placeholder="Bio (optional)"
                                    variant="outlined"
                                    value={formik1.values.bio}
                                    onChange={(event) => formik1.setFieldValue('bio', event.target.value)}
                                />
                                <Box>
                                    {typeof formik1.errors.bio !== "undefined" && formik1.touched.bio
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.bio}</span>
                                        : null
                                    }
                                </Box>
                            </Box>
                        </Box>

                        <Box display='flex' mt='16px' >
                            <Box marginRight='24px'>
                                <CustomTextField
                                    id='email'
                                    placeholder="Email"
                                    variant="outlined"
                                    value={formik1.values.email}
                                    onChange={(event) => formik1.setFieldValue('email', event.target.value)}
                                    style={{ marginRight: '24px' }}
                                />
                                <Box>
                                    {typeof formik1.errors.email !== "undefined" && formik1.touched.email
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.email}</span>
                                        : null
                                    }
                                </Box>
                            </Box>
                            <Box>

                                <CustomTextField
                                    id='phone'
                                    placeholder="Phone number"
                                    variant="outlined"
                                    value={formik1.values.phoneNumber}
                                    onChange={(event) => formik1.setFieldValue('phoneNumber', event.target.value)}
                                />
                                <Box>
                                    {typeof formik1.errors.phoneNumber !== "undefined" && formik1.touched.phoneNumber
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.phoneNumber}</span>
                                        : null
                                    }
                                </Box>
                            </Box>
                        </Box>

                        <Box mt='16px' >
                            <CustomDropdown
                                placeholderValue='Select company category (optional)'
                                menuItems={companyCategories}
                                value={formik1.values.category}
                                handleDropdownValue={(value) => {
                                    formik1.setFieldValue('category', value)
                                    apiObject.category = value
                                }}
                            />
                            <Box>
                                {typeof formik1.errors.category !== "undefined" && formik1.touched.category
                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.category}</span>
                                    : null
                                }
                            </Box>
                        </Box>

                        <Box display='flex' mt='16px' >
                            <Box marginRight='24px'>
                                <CustomTextField
                                    id='website'
                                    placeholder="Website link (optional)"
                                    variant="outlined"
                                    value={formik1.values.website}
                                    onChange={(event) => formik1.setFieldValue('website', event.target.value)}
                                    style={{ marginRight: '24px' }}
                                />
                                <Box>
                                    {typeof formik1.errors.website !== "undefined" && formik1.touched.website
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.website}</span>
                                        : null
                                    }
                                </Box>
                            </Box>
                            <Box>

                                <CustomTextField
                                    id='instagram'
                                    placeholder="Instagram (optional)"
                                    variant="outlined"
                                    value={formik1.values.instagram}
                                    onChange={(event) => formik1.setFieldValue('instagram', event.target.value)}
                                />
                                <Box>
                                    {typeof formik1.errors.instagram !== "undefined" && formik1.touched.instagram
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.instagram}</span>
                                        : null
                                    }
                                </Box>
                            </Box>

                        </Box>

                        <Box display='flex' mt='16px' >
                            <Box marginRight='24px'>
                                <CustomTextField
                                    id='linkedin'
                                    placeholder="LinkedIn (optional)"
                                    variant="outlined"
                                    value={formik1.values.linkedin}
                                    onChange={(event) => formik1.setFieldValue('linkedin', event.target.value)}
                                    style={{ marginRight: '24px' }}
                                />
                                <Box>
                                    {typeof formik1.errors.linkedin !== "undefined" && formik1.touched.linkedin
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.linkedin}</span>
                                        : null
                                    }
                                </Box>
                            </Box>
                            <Box>

                                <CustomTextField
                                    id='facebook'
                                    placeholder="Facebook (optional)"
                                    variant="outlined"
                                    value={formik1.values.facebook}
                                    onChange={(event) => formik1.setFieldValue('facebook', event.target.value)}
                                />
                                <Box>
                                    {typeof formik1.errors.facebook !== "undefined" && formik1.touched.facebook
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.facebook}</span>
                                        : null
                                    }
                                </Box>
                            </Box>
                        </Box>


                    </Box>


                    {companyLogo
                        ? (
                            <Box display='flex' alignItems='center'>
                                <img src={imageURL} alt="Company Logo" style={{ borderRadius: '8px', width: '342px', height: '140px', marginTop: '24.17px' }} />

                                <Box onClick={() => { setCompanyLogo(null) }} sx={{ marginTop: "10px", marginLeft: '20px', border: '1px solid #8D55A2', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: "center", justifyContent: "center", cursor: 'pointer' }}>
                                    <Delete style={{ color: "#8D55A2", }} />
                                </Box>
                            </Box>
                        ) : (
                            <>
                                <input accept="image/*" id="icon-button-file"
                                    onDrop={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    type="file" style={{ display: 'none' }} onChange={(e) => {
                                        setCompanyLogo(e.target.files[0]);
                                        formik1.setFieldValue('file', 'test')
                                        setImageURL(URL.createObjectURL(e.target.files[0]))
                                    }} />
                                <label htmlFor="icon-button-file">
                                    <Box sx={{ cursor: 'pointer', mt: '24.17px' }}  >
                                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#444344', marginBottom: '8px' }}>
                                            Upload company Logo
                                        </Typography>

                                        <Box sx={{
                                            backgroundColor: '#EEE5F1',
                                            border: '1px dashed #BB96C9',
                                            borderRadius: '8px',
                                            width: '342px',
                                            height: '140px',
                                            alignItems: 'center',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>

                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <DocumentUpload />
                                                </Box>

                                                <Typography sx={{ marginTop: '10.25px', fontWeight: "400", fontSize: '14px', lineHeight: '28px', color: '#8D55A2' }}>
                                                    Add room image
                                                </Typography>

                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box>
                                        {typeof formik1.errors.file !== "undefined" && formik1.touched.file
                                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.file}</span>
                                            : null
                                        }
                                    </Box>
                                </label>
                            </>
                        )
                    }



                    <Box sx={{ marginTop: '100px', display: 'flex', justifyContent: 'flex-end' }} >
                        <Button
                            onClick={() => props.handleCloseAddCompany(false)}
                            variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}> Back </Button>
                        <Button
                            type='submit'
                            // onClick={handleNext}
                            variant='contained'
                            sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                        >
                            Next
                        </Button>
                    </Box >
                </form >

            )}


            {activeStep === 1 && (
                <>
                    <Box sx={{ marginTop: '42.6px', width: '100%' }}>

                        <Typography sx={{ marginTop: '10.25px', fontWeight: "400", fontSize: '24px', lineHeight: '31px', color: '#000000' }}>
                            Select contract plan
                        </Typography>

                        <Box sx={{ display: 'flex', width: '100%', height: '185px', mt: '33.25px' }} >
                            <Grid container>
                                {plans.map(((value, index) => (
                                    <Grid key={index} item xs={4}>
                                        <Box sx={{ display: 'flex', cursor: 'pointer' }} onClick={() => handleChangePlan(value._id)}>
                                            <Radio
                                                checked={selectedPlan.toString() === value._id.toString()}
                                                value={value._id}
                                                name="radio-buttons"
                                                inputProps={{ 'aria-label': 'A' }}
                                                sx={{ height: '19.5px', width: '19.5px' }}
                                            />
                                            <Box sx={{ marginLeft: '26.25px', width: '220px', height: '21px' }}>
                                                <Typography sx={{ fontWeight: "500", fontSize: '24px', lineHeight: '31px', color: '#444344' }}>
                                                    {value.title}
                                                </Typography>
                                                <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '21px', color: '#7D7B7C' }}>
                                                    meeting room hours: {value.meetingRoomHours} hours
                                                </Typography>
                                                <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '21px', color: '#7D7B7C' }}>
                                                    duration: {value.duration} months
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                )))}
                            </Grid>
                        </Box>

                        <Box sx={{ marginTop: '100px', display: 'flex', justifyContent: 'flex-end' }} >
                            <Button
                                onClick={handleBack}
                                variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}> Back </Button>
                            <Button
                                onClick={() => {
                                    if (selectedPlan !== '') {
                                        handleNext()
                                    }
                                    else {
                                        toast.error("Please Choose A Plan");
                                    }
                                }}
                                variant='contained'
                                sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                            >
                                Next
                            </Button>
                        </Box >
                    </Box >

                </>
            )}

            {activeStep === 2 && (
                <>
                    <Box sx={{ marginTop: '53px', width: '100%' }}>

                        <Grid container>
                            {resources.map(((value, index) => (
                                <Grid item xs={2} sx={{ marginBottom: '16px' }}>
                                    <DeskCard key={index}
                                        id={value._id}
                                        name={value.name}
                                        capacity={value.capacity}
                                        floorNumber={value.floorNumber}
                                        isChecked={selectedResourcesIDs.includes(value._id.toString())}
                                        handleSetID={() => {
                                            setSelectedResourcesIDs([...selectedResourcesIDs, value._id.toString()]);
                                        }}
                                        handleRemoveID={(idToBeRemoved) => {
                                            setSelectedResourcesIDs(selectedResourcesIDs.filter((allocationID) => allocationID !== idToBeRemoved))
                                        }}
                                    />
                                </Grid>
                            )))}
                        </Grid>

                        <Box sx={{ marginTop: '56.95px', display: 'flex', justifyContent: 'flex-end' }} >
                            <Button
                                onClick={handleBack}
                                variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}>
                                Back
                            </Button>
                            <Button
                                onClick={() => {
                                    if (selectedResourcesIDs.length !== 0) {
                                        handleNext()
                                    }
                                    else {
                                        toast.error('Please Allocation Resources.');
                                    }
                                }}
                                variant='contained'
                                sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                            >
                                Next
                            </Button>
                        </Box >
                    </Box >
                </>
            )}

            {
                activeStep === 3 && (
                    <form onSubmit={formik4.handleSubmit}>

                        <Box display='flex' justifyContent='space-between' alignItems='center' mt={10}>
                            <Typography sx={{ marginTop: '8.87px', fontStyle: 'normal', fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                                Add Company Owner
                            </Typography>

                        </Box>

                        <Box sx={{ display: 'flex', marginTop: '24px' }}>
                            <Box sx={{ marginRight: '26px' }} >
                                <CustomTextField
                                    id='firstName'
                                    placeholder="First name"
                                    variant="outlined"
                                    value={formik4.values.firstName}
                                    onChange={formik4.handleChange}
                                    style={{ marginRight: '26px' }}
                                />
                                <Box>
                                    {typeof formik4.errors.firstName !== "undefined" && formik4.touched.firstName
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik4.errors.firstName}</span>
                                        : null
                                    }
                                </Box>
                            </Box>

                            <Box>
                                <CustomTextField
                                    id='lastName'
                                    placeholder="Last name"
                                    variant="outlined"
                                    value={formik4.values.lastName}
                                    onChange={formik4.handleChange}
                                />
                                <Box>
                                    {typeof formik4.errors.lastName !== "undefined" && formik4.touched.lastName
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik4.errors.lastName}</span>
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
                                value={formik4.values.email}
                                onChange={formik4.handleChange}
                            />
                            <Box>
                                {typeof formik4.errors.email !== "undefined" && formik4.touched.email
                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik4.errors.email}</span>
                                    : null
                                }
                            </Box>
                        </Box>

                        <Box mt='24px'>
                            <CustomTextField
                                id='profession'
                                placeholder="Profession (Optional)"
                                variant="outlined"
                                value={formik4.values.profession}
                                onChange={formik4.handleChange}
                            />
                            <Box>
                                {typeof formik4.errors.profession !== "undefined" && formik4.touched.profession
                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik4.errors.profession}</span>
                                    : null
                                }
                            </Box>
                        </Box>

                        <Box mt='24px'>
                            <CustomTextField
                                id='phone'
                                placeholder="Phone Number"
                                variant="outlined"
                                value={formik4.values.phoneNumber}
                                onChange={(event) => formik4.setFieldValue('phoneNumber', event.target.value)}
                            />
                            <Box>
                                {typeof formik4.errors.phoneNumber !== "undefined" && formik4.touched.phoneNumber
                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik4.errors.phoneNumber}</span>
                                    : null
                                }
                            </Box>
                        </Box>



                        <Box sx={{ marginTop: '100px', display: 'flex', justifyContent: 'flex-end' }} >
                            <Button
                                onClick={() => handleBack()}
                                variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#272627', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}> Back </Button>
                            <Button
                                // onClick={handleNext}
                                type='submit'
                                variant='contained'
                                sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                            >
                                {loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Next'}
                            </Button>

                        </Box >
                    </form>

                )
            }

            {
                activeStep === 4 && (
                    <>

                        <Box sx={{ marginTop: '53px', width: '100%' }}>
                            <form onSubmit={formik5.handleSubmit}>
                                <Box display='flex' >
                                    <Box sx={{ display: 'flex', marginRight: '24px' }}>
                                        <Box sx={{ marginRight: '26px' }} >
                                            <CustomTextField
                                                id='firstName'
                                                placeholder="First name"
                                                variant="outlined"
                                                value={formik5.values.firstName}
                                                onChange={formik5.handleChange}
                                                style={{ marginRight: '26px' }}
                                            />
                                            <Box>
                                                {typeof formik5.errors.firstName !== "undefined" && formik5.touched.firstName
                                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik5.errors.firstName}</span>
                                                    : null
                                                }
                                            </Box>
                                        </Box>

                                        <Box>
                                            <CustomTextField
                                                id='lastName'
                                                placeholder="Last name"
                                                variant="outlined"
                                                value={formik5.values.lastName}
                                                onChange={formik5.handleChange}
                                            />
                                            <Box>
                                                {typeof formik5.errors.lastName !== "undefined" && formik5.touched.lastName
                                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik5.errors.lastName}</span>
                                                    : null
                                                }
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <CustomTextField
                                            id='email'
                                            placeholder="Email"
                                            variant="outlined"
                                            value={formik5.values.email}
                                            onChange={formik5.handleChange}
                                            style={{ marginRight: '24px' }}
                                        />
                                        <Box>
                                            {typeof formik5.errors.email !== "undefined" && formik5.touched.email
                                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik5.errors.email}</span>
                                                : null
                                            }
                                        </Box>
                                    </Box>
                                </Box>

                                <Box display='flex' mt='16px' >
                                    <Box marginRight='24px'>
                                        <CustomTextField
                                            id='phone'
                                            placeholder="Phone Number"
                                            variant="outlined"
                                            value={formik5.values.phoneNumber}
                                            onChange={(e) => { formik5.setFieldValue('phoneNumber', e.target.value) }}
                                        />
                                        <Box>
                                            {typeof formik5.errors.phoneNumber !== "undefined" && formik5.touched.phoneNumber
                                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik5.errors.phoneNumber}</span>
                                                : null
                                            }
                                        </Box>
                                    </Box>

                                    <CustomTextField
                                        id='profession'
                                        placeholder="Profession (optional)"
                                        variant="outlined"
                                        value={formik5.values.profession}
                                        onChange={formik5.handleChange}
                                    />
                                    <Box>
                                        {typeof formik5.errors.profession !== "undefined" && formik5.touched.profession
                                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik5.errors.profession}</span>
                                            : null
                                        }
                                    </Box>
                                </Box>

                                <Box mt='16px' display='flex' justifyContent='center'>
                                    <Button
                                        type="submit"
                                        variant='contained'
                                        sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                                    >
                                        {loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Save employee'}
                                    </Button>
                                </Box>
                            </form>


                            {
                                employeesData.length > 0
                                    ? (
                                        <>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '56.5px' }}>
                                                <Typography sx={{ marginTop: '10.25px', fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                                    Company employee
                                                </Typography>

                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                                                    <Button
                                                        variant='text'
                                                        sx={{ marginRight: '38.5px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#8D55A2', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                                                    >
                                                        Download template
                                                    </Button>
                                                    <Button
                                                        onClick={handleOpen}
                                                        variant='outlined' sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}>
                                                        Bulk add
                                                    </Button>
                                                </Box >
                                            </Box>
                                            <Box mt='24px'>
                                                {employeesData.map((value, index) => (
                                                    <EmployeeCard
                                                        key={index}
                                                        name={`${value.firstName.en} ${value.lastName.en}`}
                                                        email={value.email}
                                                        id={value._id}
                                                        profession={value.profession.en}
                                                        profileImage={value.profilePicture}
                                                        companyName={value.company.name}
                                                        status={value.isActive ? 'Active' : 'Deactivated'}
                                                        handleOpenEmpProfile={props.handleOpenEmpProfile}
                                                        handleOpenComProfile={props.handleOpenComProfile}
                                                    />
                                                ))}
                                            </Box>
                                        </>
                                    ) : (
                                        <Box mt='82px'>
                                            <Box display='flex' justifyContent='center' marginLeft='-35px'>
                                                <Empty />
                                            </Box>
                                            <Box display='flex' justifyContent='center' mt='24px'>
                                                <Typography sx={{ marginTop: '10.25px', fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                                    You didn't invite any employee yet
                                                </Typography>
                                            </Box>
                                            <Box display='flex' justifyContent='center' mt='24px'>
                                                <Button
                                                    onClick={handleOpen}
                                                    variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}>
                                                    Bulk add
                                                </Button>
                                            </Box>
                                        </Box>

                                    )
                            }




                            {/* <Box sx={{ marginTop: '100px', display: 'flex', justifyContent: 'flex-end' }} >
                                <Button
                                    onClick={handleBack}
                                    variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}>
                                    Back
                                </Button>
                                <Button
                                    variant='contained'
                                    sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                                >
                                    Save
                                </Button>
                            </Box > */}
                        </Box >





                        <Modal
                            open={open}
                        >
                            <Box sx={style}>
                                <Box sx={{ display: 'flex', justifyContent: "space-between", padding: '16px 40px', borderBottom: '1px solid #C6C7C5' }}>
                                    <Typography sx={{ fontWeight: "700", fontSize: '23px', lineHeight: '40px', color: '#020001' }}>
                                        Bulk Add
                                    </Typography>
                                    <Cross style={{ cursor: 'pointer' }} onClick={() => setOpen(false)} />
                                </Box>

                                <Box sx={{ marginTop: '24px', marginLeft: "40px" }}>
                                    <Typography sx={{ fontWeight: "500", fontSize: '23px', lineHeight: '40px', color: '#565556' }}>
                                        Upload the file after filling the template with required info
                                    </Typography>


                                    {bulkAddFile
                                        ? (
                                            <>
                                                <Box sx={{
                                                    width: '847px',
                                                    height: '177px',
                                                    backgroundColor: '#EEE5F1',
                                                    border: '1px dashed #8D55A2',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginTop: '24px',
                                                    cursor: 'pointer'
                                                }}
                                                >
                                                    <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: '#8D55A2' }}>
                                                        {bulkAddFile.name}
                                                    </Typography>
                                                    <FileCross style={{ marginTop: '-10px', marginLeft: '4.83px' }} onClick={() => { setBulkAddFile(null) }} />
                                                </Box>

                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    id="icon-button-file"
                                                    type="file"
                                                    accept="text/csv"
                                                    multiple={false}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => { setBulkAddFile(e.target.files[0]) }}
                                                />
                                                <label htmlFor="icon-button-file">
                                                    <Box sx={{
                                                        width: '847px',
                                                        height: '177px',
                                                        backgroundColor: '#EEE5F1',
                                                        border: '1px dashed #8D55A2',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        marginTop: '24px',
                                                        cursor: 'pointer'
                                                    }}
                                                    >

                                                        <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: '#8D55A2' }}>
                                                            Upload  Attchments
                                                        </Typography>
                                                    </Box>
                                                </label>
                                            </>
                                        )
                                    }
                                </Box>
                                <Box borderTop='1px solid #C6C7C5' padding='20px 28.33px 28.33px 0px' display='flex' justifyContent='flex-end' mt='109.34px'>
                                    <Button
                                        onClick={() => setOpen(false)}
                                        variant='outlined'
                                        sx={{
                                            marginRight: '16px',
                                            padding: '0px 24px',
                                            width: '152px',
                                            height: '40px',
                                            borderRadius: '51px',
                                            textTransform: 'none',
                                            fontWeight: '500',
                                            fontSize: '16px',
                                            lineHeight: '28px',
                                        }}
                                    >Cancel</Button>
                                    <Button variant='contained' disabled={bulkAddFile ? false : true}
                                        sx={{
                                            marginRight: '16px',
                                            padding: '0px 24px',
                                            width: '152px',
                                            height: '40px',
                                            borderRadius: '51px',
                                            textTransform: 'none',
                                            fontWeight: '500',
                                            fontSize: '16px',
                                            lineHeight: '28px'
                                        }}
                                        onClick={() => {
                                            setBulkAddLoader(true)
                                            handleBulkAddEmployees()
                                        }}
                                    >
                                        {bulkAddLoader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Save'}
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                    </>
                )
            }


        </>
    )
}

export default AddCompanyDrawer