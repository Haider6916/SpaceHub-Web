import { Box, Button, Checkbox, Chip, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactComponent as CloseCircle } from '../../Assets/SVGs/CloseCircle.svg';
import { ReactComponent as DocumentUpload } from '../../Assets/SVGs/DocumentUpload.svg';
import { ReactComponent as UnselectedWifi } from '../../Assets/SVGs/UnselectedWifi.svg';
import { ReactComponent as SelectedWifi } from '../../Assets/SVGs/SelectedWifi.svg';
import { ReactComponent as DocumentUploadWhite } from '../../Assets/SVGs/DocumentUploadWhite.svg';
import { ReactComponent as Add } from '../../Assets/SVGs/Add.svg';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import CustomTextField from '../CustomDrawerTextField/CustomTextField';
import { ErrorOutline } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { privateRequest } from '../../ApiMethods';
import { toast } from 'react-hot-toast';
import { listingReloadTrue } from '../../Redux/listingSlice';
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

function AddNewListing(props) {

    const classes = useStyles();
    const dispatch = useDispatch()

    const companiesList = ['Meeting Room', 'Desk', 'Private Office']
    const [listingImage1, setListingImage1] = useState(null)
    const [listingImage2, setListingImage2] = useState(null)
    const [listingImage3, setListingImage3] = useState(null)
    const [dropdownOption, setDropdownOption] = useState('Desk')
    const [isHovering1, setIsHovering1] = useState(false)
    const [isHovering2, setIsHovering2] = useState(false)
    const [isHovering3, setIsHovering3] = useState(false)
    const [ameneitiesList, setAmeneititiesList] = useState([])
    const [selectedAmeneities, setSelectedAmeneitites] = useState([])

    var validationSchema = yup.object({
        name: yup
            .string('Name')
            .required('Name is required'),
        type: yup
            .string('Type')
            .required('Type is required'),
        floorNumber: yup
            .string('Floor Number')
            .required('Floor Number is required'),
        capacity: yup
            .string('Capacity')
            .required('Capacity is required'),
        area: yup
            .string('Area')
            .required('Area is required'),
        description: yup
            .string('Description')
            .required('Description is required'),
    });

    const fetchAmeneitites = () => {
        privateRequest.get('/resource/amenities').then((res) => {
            setAmeneititiesList(res.data)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }


    useEffect(() => {
        fetchAmeneitites()
    }, [])

    useEffect(() => {
        if (dropdownOption !== 'Meeting Room') {
            formik.setFieldValue('area', '0')
        }
    }, [dropdownOption])

    const formik = useFormik({
        initialValues: {
            name: '',
            type: 'Desk',
            floorNumber: '',
            capacity: '',
            area: '',
            description: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            let tempType = '';

            if (dropdownOption === "Private Office") tempType = 'private_office'
            else if (dropdownOption === "Desk") tempType = 'desk'
            else tempType = 'meeting_room'

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('type', tempType);
            formData.append('floorNumber', values.floorNumber);
            formData.append('capacity', values.capacity);
            formData.append('area', values.area);
            formData.append('description', values.description);

            selectedAmeneities.forEach((value) => {
                formData.append('amenities', value);
            })

            if (listingImage1 !== null) {
                formData.append('resourceImages', listingImage1);
            }
            else if (listingImage2 !== null) {
                formData.append('resourceImages', listingImage2);
            }
            else if (listingImage3 !== null) {
                formData.append('resourceImages', listingImage3);
            }
            privateRequest.post('/resource', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                toast.success(res.data.message);
                dispatch(listingReloadTrue())
                props.handleCloseDrawer(false)
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            });

        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>

            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography sx={{ fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                    Add New Listing
                </Typography>

                <CloseCircle onClick={() => props.handleCloseDrawer(false)} style={{ cursor: 'pointer' }} />

            </Box>

            <Box sx={{ marginTop: '60px', width: '100%' }}>
                <Box display='flex' >
                    <Box marginRight='24px'>
                        <CustomTextField
                            id='name'
                            placeholder="Name"
                            variant="outlined"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                        />
                        <Box>
                            {typeof formik.errors.name !== "undefined" && formik.touched.name
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.name}</span>
                                : null
                            }
                        </Box>
                    </Box>
                    <Box>
                        <CustomDropdown
                            placeholderValue='Listing Type'
                            menuItems={companiesList}
                            value={dropdownOption}
                            handleDropdownValue={(value) => {
                                setDropdownOption(value)
                                formik.setFieldValue('type', value)
                            }}
                        />
                        <Box>
                            {typeof formik.errors.type !== "undefined" && formik.touched.type
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.type}</span>
                                : null
                            }
                        </Box>
                    </Box>

                </Box>

                <Box display='flex' mt='16px' >
                    <Box marginRight='24px'>
                        <CustomTextField
                            id='floorNumber'
                            placeholder="Floor Number"
                            variant="outlined"
                            value={formik.values.floorNumber}
                            onChange={formik.handleChange}
                            style={{ marginRight: '24px' }}
                        />
                        <Box>
                            {typeof formik.errors.floorNumber !== "undefined" && formik.touched.floorNumber
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.floorNumber}</span>
                                : null
                            }
                        </Box>
                    </Box>

                    {dropdownOption === 'Meeting Room' ? <>
                        <Box marginRight='24px'>
                            <CustomTextField
                                id='capacity'
                                placeholder="Capacity"
                                variant="outlined"
                                value={formik.values.capacity}
                                onChange={(event) => formik.setFieldValue('capacity', event.target.value)}
                            />
                            <Box>
                                {typeof formik.errors.capacity !== "undefined" && formik.touched.capacity
                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.capacity}</span>
                                    : null
                                }
                            </Box>
                        </Box>

                        <Box>
                            <CustomTextField
                                id='area'
                                placeholder="Area"
                                variant="outlined"
                                value={formik.values.area}
                                onChange={formik.handleChange}
                                style={{ marginRight: '24px' }}
                            />
                            <Box>
                                {typeof formik.errors.area !== "undefined" && formik.touched.area
                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.area}</span>
                                    : null
                                }
                            </Box>
                        </Box>
                    </> : dropdownOption === 'Desk' || dropdownOption === 'Private Office' ?
                        <Box>
                            <CustomTextField
                                id='capacityFullWidth'
                                placeholder="Capacity"
                                variant="outlined"
                                value={formik.values.capacity}
                                onChange={(event) => formik.setFieldValue('capacity', event.target.value)}
                            />
                            <Box>
                                {typeof formik.errors.capacity !== "undefined" && formik.touched.capacity
                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.capacity}</span>
                                    : null
                                }
                            </Box>
                        </Box>
                        : null
                    }

                </Box>

                <Box mt='16px' >
                    <CustomTextField
                        id='description'
                        placeholder="Description"
                        variant="outlined"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    <Box>
                        {typeof formik.errors.description !== "undefined" && formik.touched.description
                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.description}</span>
                            : null
                        }
                    </Box>
                </Box>
            </Box>

            <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#444344', marginBottom: '8px', mt: '24px' }}>
                Add images
            </Typography>

            <Box sx={{ display: 'flex' }}>
                {listingImage1
                    ? (
                        <>
                            <input accept="image/*" id="image1"
                                type="file" style={{ display: 'none' }}
                                onChange={(e) => {
                                    setListingImage1(e.target.files[0])
                                }} />
                            <label htmlFor="image1">
                                <Box
                                    onMouseEnter={() => setIsHovering1(true)}
                                    onMouseLeave={() => setIsHovering1(false)}
                                    display="flex"
                                    alignItems="center"
                                    position="relative"
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={URL.createObjectURL(listingImage1)}
                                        alt="Company Logo"
                                        style={{
                                            borderRadius: '8px',
                                            width: '342px',
                                            height: '140px',
                                            filter: isHovering1 ? 'brightness(50%)' : 'none',
                                            transition: 'opacity 0.3s',
                                        }}

                                    />
                                    {isHovering1 && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                zIndex: 1,
                                                top: '55%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                backgroundColor: 'transparent',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <DocumentUploadWhite />

                                            <Typography sx={{ fontWeight: "400", fontSize: '14px', lineHeight: '28px', color: '#FFFFFF', mt: '5.25px' }}>
                                                Replace image
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </label>
                        </>


                    ) : (
                        <>
                            <input accept="image/*" id="image2"
                                type="file" style={{ display: 'none' }} onChange={(e) => { setListingImage1(e.target.files[0]) }} />
                            <label htmlFor="image2">
                                <Box sx={{ cursor: 'pointer' }}  >
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
                            </label>
                        </>
                    )
                }
                <Box ml='24px' mr='24px'>
                    {listingImage2
                        ? (
                            <>
                                <input accept="image/*" id="image3"
                                    type="file" style={{ display: 'none' }} onChange={(e) => { setListingImage2(e.target.files[0]) }} />
                                <label htmlFor="image3">
                                    <Box
                                        onMouseEnter={() => setIsHovering2(true)}
                                        onMouseLeave={() => setIsHovering2(false)}
                                        display="flex"
                                        alignItems="center"
                                        position="relative"
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={URL.createObjectURL(listingImage2)}
                                            alt="Company Logo"
                                            style={{
                                                borderRadius: '8px',
                                                width: '342px',
                                                height: '140px',
                                                filter: isHovering2 ? 'brightness(50%)' : 'none',
                                                transition: 'opacity 0.3s',
                                            }}

                                        />
                                        {isHovering2 && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    zIndex: 1,
                                                    top: '55%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    backgroundColor: 'transparent',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <DocumentUploadWhite />

                                                <Typography sx={{ fontWeight: "400", fontSize: '14px', lineHeight: '28px', color: '#FFFFFF', mt: '5.25px' }}>
                                                    Replace image
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </label>
                            </>


                        ) : (
                            <>
                                <input accept="image/*" id="icon-button-file"
                                    type="file" style={{ display: 'none' }} onChange={(e) => { setListingImage2(e.target.files[0]) }} />
                                <label htmlFor="icon-button-file">
                                    <Box sx={{ cursor: 'pointer' }}  >
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
                                </label>
                            </>
                        )
                    }
                </Box>

                {listingImage3
                    ? (
                        <>
                            <input accept="image/*" id="icon-button-file"
                                type="file" style={{ display: 'none' }} onChange={(e) => { setListingImage3(e.target.files[0]) }} />
                            <label htmlFor="icon-button-file">
                                <Box
                                    onMouseEnter={() => setIsHovering3(true)}
                                    onMouseLeave={() => setIsHovering3(false)}
                                    display="flex"
                                    alignItems="center"
                                    position="relative"
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={URL.createObjectURL(listingImage3)}
                                        alt="Company Logo"
                                        style={{
                                            borderRadius: '8px',
                                            width: '342px',
                                            height: '140px',
                                            filter: isHovering3 ? 'brightness(50%)' : 'none',
                                            transition: 'opacity 0.3s',
                                        }}

                                    />
                                    {isHovering3 && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                zIndex: 1,
                                                top: '55%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                backgroundColor: 'transparent',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <DocumentUploadWhite />

                                            <Typography sx={{ fontWeight: "400", fontSize: '14px', lineHeight: '28px', color: '#FFFFFF', mt: '5.25px' }}>
                                                Replace image
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </label>
                        </>


                    ) : (
                        <>
                            <input accept="image/*" id="icon-button-file"
                                type="file" style={{ display: 'none' }} onChange={(e) => { setListingImage3(e.target.files[0]) }} />
                            <label htmlFor="icon-button-file">
                                <Box sx={{ cursor: 'pointer' }}  >
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
                            </label>
                        </>
                    )
                }

            </Box >

            <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#444344', marginBottom: '8px', mt: '24px' }}>
                Select Ameneities
            </Typography>

            <Box maxWidth="1100px">
                <Grid container>
                    {
                        ameneitiesList.map((value, index) => (
                            <Grid item >
                                {/* <Checkbox
                                    icon={<UnselectedWifi />}
                                    checkedIcon={<SelectedWifi />}
                                    sx={{
                                        padding: "0px",
                                        mb: '24px',
                                        '&:hover': {
                                            backgroundColor: '#FFFFFF', // Change to your desired hover color
                                            padding: '0px', // Change to your desired padding value
                                        },
                                    }}
                                /> */}
                                <Chip
                                    key={index}
                                    onClick={() => {
                                        if (selectedAmeneities.includes(value)) {
                                            setSelectedAmeneitites(selectedAmeneities.filter((ameneityName) => ameneityName !== value))
                                        }
                                        else {
                                            setSelectedAmeneitites([...selectedAmeneities, value])
                                        }
                                    }}
                                    label={value} sx={{
                                        border: selectedAmeneities.includes(value) ? '1px solid #8D55A2' : '1px solid #E9EAE9',
                                        backgroundColor: selectedAmeneities.includes(value) ? '#EEE5F1' : '#FFFFFF',
                                        mr: '24px',
                                        mb: '24px',
                                        height: '40px',
                                        padding: '8px 16px',
                                        borderRadius: '999px',
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        lineHeight: '18px',
                                        letterSpacing: '-0.03em',
                                        color: selectedAmeneities.includes(value) ? '#8D55A2' : '#9F9D9E',
                                        cursor: 'pointer'
                                    }} />
                            </Grid>
                        ))
                    }

                </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '8.46px' }}>
                <Button
                    variant='outlined' sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', borderRadius: '51px', color: '#8D55A2', width: '220px', height: '40px' }}>
                    <Add />
                    Add new Ameneities
                </Button >
            </Box>

            <Box sx={{ marginTop: '166.55px', display: 'flex', justifyContent: 'flex-end' }} >
                <Button
                    onClick={() => props.handleCloseDrawer(false)}
                    variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px' }}> Back </Button>
                <Button
                    type='submit'
                    variant='contained'
                    sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px' }}
                >
                    Save
                </Button>
            </Box >

        </form>
    )
}

export default AddNewListing