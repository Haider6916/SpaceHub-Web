import React, { useEffect, useState } from 'react'
import CustomTextField from '../CustomDrawerTextField/CustomTextField'
import { Box, Button, Checkbox, CircularProgress, Grid, IconButton, Modal, Radio, Step, StepConnector, StepLabel, Stepper, Typography } from '@mui/material'
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ReactComponent as CloseCircle } from '../../Assets/SVGs/CloseCircle.svg';
import { ReactComponent as Check } from '../../Assets/SVGs/Check.svg';
import { ReactComponent as DocumentUpload } from '../../Assets/SVGs/DocumentUpload.svg';
import { Delete, ErrorOutline } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../ApiMethods';
import EditDeskCard from './EditDeskCard'
import { comapanyReloadTrue } from '../../Redux/directorySlice';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
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

const steps = ['General Details', 'Contract Plan', 'Allocation',]




function EditCompanyDrawer(props) {

    const { companyData } = props
    const dispatch = useDispatch()


    const classes = useStyles();

    const [activeStep, setActiveStep] = useState(0);
    const [plans, setPlans] = useState([])
    const [selectedPlan, setSelectedPlan] = useState(companyData.plan._id);
    const [companyLogo, setCompanyLogo] = useState(null)
    const [imageURL, setImageURL] = useState(companyData.logo)
    const [companyCategories, setCompanyCategories] = useState([])
    const [resources, setResources] = useState([])
    const [loader, setLoader] = useState(false)
    const [resourcesIDs, setResourcesIDs] = useState([])

    const [apiObject, setApiObject] = useState({
        name: companyData.name,
        bio: companyData.bio,
        email: companyData.email,
        phone: companyData.phone,
        category: companyData.category,
        website: companyData.website,
        instagram: companyData.instagram,
        linkedin: companyData.linkedin,
        facebook: companyData.facebook,
        logo: companyData.logo,
        plan: companyData.plan,
    })

    const handleResourceIDs = () => {
        let tempArr = []
        companyData.resources.forEach((value) => {
            tempArr.push(value._id)
        })
        setResourcesIDs(tempArr)
    }

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

    const handleChangePlan = (value) => {
        setSelectedPlan(value);
    };

    useEffect(() => {
        handleResourceIDs()
        handleFetchPlans()
        handleFetchResources()
        fetchCompanyCategories()
    }, [])

    //   -----------------------------------------


    const validationSchemaStep1 = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email address').required('Email is required').matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email'),
        phoneNumber: yup.string('Phone Number').required('Phone Number is required'),
        bio: yup.string('Invalid email address'),
        category: yup.string('Category'),
        website: yup.string('Website'),
        facebook: yup.string('Facebook'),
        linkedin: yup.string('Linkedin'),
        instagram: yup.string('Instagram'),
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
        },
        validationSchema: validationSchemaStep1,
        onSubmit: (values) => {


            setApiObject((prevApiObject) => ({
                ...prevApiObject,
                bio: values.bio,
            }));

            setApiObject((prevApiObject) => ({
                ...prevApiObject,
                linkedin: values.linkedin,
            }));

            setApiObject((prevApiObject) => ({
                ...prevApiObject,
                linkedin: values.linkedin,
            }));

            setApiObject((prevApiObject) => ({
                ...prevApiObject,
                facebook: values.facebook,
            }));
            setApiObject((prevApiObject) => ({
                ...prevApiObject,
                website: values.website,
            }));
            setApiObject((prevApiObject) => ({
                ...prevApiObject,
                category: values.category,
            }));
            setApiObject((prevApiObject) => ({
                ...prevApiObject,
                phone: values.phoneNumber,
            }));
            setApiObject((prevApiObject) => ({
                ...prevApiObject,
                email: values.email,
            }));
            setApiObject((prevApiObject) => ({
                ...prevApiObject,
                name: values.name,
            }));


            handleNext()
        }
    });

    const handleEditCompanyDetails = () => {

        const formData = new FormData();
        resourcesIDs.forEach((value) => {
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
        formData.append('plan', selectedPlan);
        if (companyLogo !== null) {
            formData.append('logo', companyLogo);
        }

        privateRequest.put(`/company/${companyData._id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            toast.success(res.data.message)
            dispatch(comapanyReloadTrue())
            props.handleCloseEditCompany(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        }).finally(() => {
            setLoader(false)
        })
    }



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
                        width: '320px',
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
                    Edit Company
                </Typography>

                <CloseCircle onClick={() => props.handleCloseEditCompany(false)} style={{ cursor: 'pointer' }} />
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


                    {imageURL
                        ? (
                            <Box display='flex' alignItems='center'>
                                <img src={imageURL} alt="Company Logo" style={{ borderRadius: '8px', width: '342px', height: '140px', marginTop: '24.17px', border: '1px solid #D3D3D3' }} />

                                <Box onClick={() => { setCompanyLogo(null); setImageURL(null) }} sx={{ marginTop: "10px", marginLeft: '20px', border: '1px solid #8D55A2', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: "center", justifyContent: "center", cursor: 'pointer' }}>
                                    <Delete style={{ color: "#8D55A2", }} />
                                </Box>
                            </Box>
                        ) : (
                            <>
                                <input accept="image/*" id="icon-button-file"
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
                            onClick={() => props.handleCloseEditCompany(false)}
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
                                    <EditDeskCard
                                        key={index}
                                        id={value._id}
                                        name={value.name}
                                        capacity={value.capacity}
                                        floorNumber={value.floorNumber}
                                        isChecked={resourcesIDs.includes(value._id.toString())}
                                        handleSetID={() => {
                                            setResourcesIDs([...resourcesIDs, value._id.toString()]);
                                        }}
                                        handleRemoveID={(idToBeRemoved) => {
                                            setResourcesIDs(resourcesIDs.filter((allocationID) => allocationID !== idToBeRemoved))
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
                                    if (resourcesIDs.length !== 0) {
                                        setLoader(true)
                                        console.log('API Object before final function call ', apiObject);
                                        handleEditCompanyDetails()
                                    }
                                    else {
                                        toast.error('Please Allocation Resources.');
                                    }
                                }}
                                variant='contained'
                                sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                            >
                                {loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Save'}
                            </Button>
                        </Box >
                    </Box >
                </>
            )}

        </>
    )
}

export default EditCompanyDrawer