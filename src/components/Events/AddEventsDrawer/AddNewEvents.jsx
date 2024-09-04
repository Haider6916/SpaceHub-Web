import { Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactComponent as CloseCircle } from '../../../Assets/SVGs/CloseCircle.svg';
import { ReactComponent as Location } from '../../../Assets/SVGs/Location.svg';
import { ReactComponent as Clock } from '../../../Assets/SVGs/Clock.svg';
import { ReactComponent as CalendarIcon } from '../../../Assets/SVGs/Calendar.svg';
import { ReactComponent as DocumentUploadWhite } from '../../../Assets/SVGs/DocumentUploadWhite.svg';
import { Calendar } from 'react-date-range';
import format from 'date-fns/format';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomTextField from '../../CustomDrawerTextField/CustomTextField';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../../ApiMethods';
import { makeStyles } from '@mui/styles';
import { ErrorOutline } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { closeAddEventDrawer, eventsReloadTrue } from '../../../Redux/eventsSlice';
import { ReactComponent as DocumentUpload } from '../../../Assets/SVGs/DocumentUpload.svg';
import { LocalizationProvider, MobileTimePicker, StaticTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import MapModal from '../MapModal/MapModal';
import './AddNewEvents.css'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

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


function AddNewEvents(props) {

    const classes = useStyles();
    const dispatch = useDispatch()

    const [loader, setLoader] = useState(false)
    const [shouldMapOpen, setShouldMapOpen] = useState(false)

    const [imageError, setImageError] = useState(false)

    // Location Error
    const [locationError, setLocationError] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    //Image Upload
    const [image, setImage] = useState(null)
    const [isHovering, setIsHovering] = useState(null)

    //States for Date
    const [startShownDate, setStartShownDate] = useState(new Date());
    const [endShownDate, setEndShownDate] = useState(new Date());
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [dateError, setDateError] = useState(false)

    //States for Time
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)
    const [timeError, setTimeError] = useState(false)

    var validationSchema = yup.object({
        title: yup
            .string('Title')
            .required('Title is required')
            .max(30, 'Title can have at most 30 characters'),
        startDate: yup
            .string('Start Date')
            .required('Start date is required'),
        endDate: yup
            .string('End Date')
            .required('End date is required'),
        from: yup
            .string('From')
            .required('Start time is required'),
        to: yup
            .string('To')
            .required('End time is required'),
        description: yup
            .string('Description')
            .required('Description is required')
            .max(500, 'Description can have at most 500 characters'),
        where: yup
            .string('Where'),
        link: yup
            .string('Link'),
        seats: yup
            .number('Seats')
            .required('Seats are required')
            .typeError('Seats must be a number'),

    });

    const formik = useFormik({
        initialValues: {
            title: '',
            startDate: '',
            endDate: '',
            from: '',
            to: '',
            description: '',
            where: '',
            link: '',
            seats: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            setLoader(true)
            if (timeError || dateError || locationError) {
                return
            }

            if (image === null) {
                return
            }

            const startTime = moment(formik.values.from, 'h:mm A').format('HH:mm:ss.SSSZ');
            const endTime = moment(formik.values.to, 'h:mm A').format('HH:mm:ss.SSSZ');


            const startDate = formik.values.startDate.split('-')
            const endDate = formik.values.endDate.split('-')

            let link = formik.values.link
            if (!link.includes("//")) {
                link = `//${formik.values.link}`
            }

            const formData = new FormData();
            formData.append('picture', image);
            formData.append('title', formik.values.title);
            formData.append('description', formik.values.description);
            formData.append('seatsLimit', formik.values.seats);
            formData.append('startDate', `${startDate[2]}-${startDate[1]}-${startDate[0]}`);
            formData.append('endDate', `${endDate[2]}-${endDate[1]}-${endDate[0]}`);
            formData.append('startTime', startTime);
            formData.append('endTime', endTime);
            formData.append('location', formik.values.where);
            formData.append('locationLink', link);

            privateRequest.post('/event', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                dispatch(eventsReloadTrue())
                toast.success(res.data.message);
                dispatch(closeAddEventDrawer())
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            }).finally(() => {
                setLoader(false)
            });
        }
    });


    useEffect(() => {
        if ((formik.values.from !== '' && formik.values.to !== '')) {
            const start_time = new Date(`2000/01/01 ${formik.values.from}`);
            const end_time = new Date(`2000/01/01 ${formik.values.to}`);
            if (end_time < start_time) {
                setTimeError(true)
            } else {
                setTimeError(false)
            }
        }
    }, [formik.values.to, formik.values.from])

    useEffect(() => {
        if ((formik.values.startDate !== '' && formik.values.endDate !== '')) {
            const startParts = formik.values.startDate.split("-");
            const endParts = formik.values.endDate.split("-");
            const start = new Date(startParts[2], startParts[1] - 1, startParts[0]);
            const end = new Date(endParts[2], endParts[1] - 1, endParts[0]);
            if (end < start) {
                setDateError(true)
            } else {
                setDateError(false)
            }
        }
    }, [formik.values.startDate, formik.values.endDate])

    useEffect(() => {
        if (isSubmitted) {
            if ((formik.values.link === '' && formik.values.where === '')) {
                setLocationError(true)
            }
            else {
                setLocationError(false)
            }
        }
    }, [formik.values.link, formik.values.where, isSubmitted])

    useEffect(() => {
        if (isSubmitted) {
            if (image === null) {
                setImageError(true)
            }
            else {
                setImageError(false)
            }
        }
    }, [image, isSubmitted])



    return (
        <form onSubmit={formik.handleSubmit}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography sx={{ fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                    Add Event
                </Typography>

                <CloseCircle onClick={() => dispatch(closeAddEventDrawer())} style={{ cursor: 'pointer' }} />

            </Box>


            <Box marginTop='24px'>
                <CustomTextField
                    id='title'
                    placeholder="Title of the event"
                    variant="outlined"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                />
                <Box>
                    {typeof formik.errors.title !== "undefined" && formik.touched.title
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.title}</span>
                        : null
                    }
                </Box>
            </Box>


            <Box marginTop='24px' sx={{ display: 'flex', justifyContent: 'space-between' }}>

                <Box sx={{ maxWidth: '261px' }}>
                    <Box
                        onClick={() => {
                            setOpenStartDate(true)
                            setOpenEndDate(false)

                        }}
                        sx={{ width: '261px', height: '56px', background: '#FAFAFA', border: '1px solid #F5F6F4', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 16px' }}>
                        <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: formik.values.startDate === '' ? '#c6c5c5' : '#7D7B7C' }}>
                            {formik.values.startDate === '' ? 'Start Date' : formik.values.startDate}
                        </Typography>
                        < CalendarIcon />
                    </Box>
                    {typeof formik.errors.startDate !== "undefined" && formik.touched.startDate
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.startDate}</span>
                        : null
                    }
                </Box>
                <Box sx={{ maxWidth: '261px' }}>
                    <Box
                        onClick={() => {
                            setOpenEndDate(true)
                            setOpenStartDate(false)
                        }}
                        sx={{ width: '261px', height: '56px', background: '#FAFAFA', border: '1px solid #F5F6F4', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 16px' }}>
                        <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: formik.values.endDate === '' ? '#c6c5c5' : '#7D7B7C' }}>
                            {formik.values.endDate === '' ? 'End Date' : formik.values.endDate}
                        </Typography>
                        < CalendarIcon />

                    </Box>
                    {dateError
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} /> End date cannot be earlier than start date.</span>
                        : null
                    }
                    {typeof formik.errors.endDate !== "undefined" && formik.touched.endDate
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.endDate}</span>
                        : null
                    }
                </Box>
            </Box>

            <Box sx={{ display: 'flex', backgroundColor: "#FAFAFA", justifyContent: 'center', width: "100%", mt: '4px' }}>
                {openStartDate &&
                    <Calendar
                        date={startShownDate}
                        className='calendarElement'
                        onChange={(date) => {
                            formik.setFieldValue('startDate', (format(date, 'dd-MM-yyyy')))
                            setStartShownDate(date)
                            setOpenStartDate(false)
                        }}
                        minDate={new Date()}
                        color="#8D55A2"
                        colorPrimary="#8D55A2"
                    />
                }

                {openEndDate &&
                    <Calendar
                        date={endShownDate}
                        className='calendarElement'
                        onChange={(date) => {
                            formik.setFieldValue('endDate', (format(date, 'dd-MM-yyyy')))
                            setEndShownDate(date)
                            setOpenEndDate(false)

                        }}
                        minDate={startShownDate}
                        color="#8D55A2"
                        colorPrimary="#8D55A2"
                    />
                }

            </Box>

            <Box mt="24px" display='flex' justifyContent='space-between'>

                <Box sx={{ maxWidth: '261px' }}>
                    <Box
                        onClick={() => {
                            setOpenFrom(true);
                            if (openTo === true) {
                                setOpenTo(false);
                                formik.setFieldValue('to', '')
                            }
                        }}
                        sx={{ width: '261px', height: '56px', background: '#FAFAFA', border: '1px solid #F5F6F4', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 16px' }}>
                        <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: formik.values.from === '' ? '#c6c5c5' : '#7D7B7C' }}>
                            {formik.values.from === '' ? 'From' : formik.values.from}
                        </Typography>
                        <Clock />
                    </Box>
                    {typeof formik.errors.from !== "undefined" && formik.touched.from
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.from}</span>
                        : null
                    }
                </Box>

                <Box sx={{ maxWidth: "261px" }}>
                    <Box
                        onClick={() => {
                            setOpenTo(true);
                            if (openFrom === true) {
                                setOpenFrom(false);
                                formik.setFieldValue('from', '')
                            }
                        }}
                        sx={{ width: '261px', height: '56px', background: '#FAFAFA', border: '1px solid #F5F6F4', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 16px' }}>
                        <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: formik.values.to === '' ? '#c6c5c5' : '#7D7B7C' }}>
                            {formik.values.to === '' ? 'To' : formik.values.to}
                        </Typography>
                        <Clock />
                    </Box>
                    {timeError
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} /> End time cannot be earlier than start time.</span>
                        : null
                    }
                    {typeof formik.errors.to !== "undefined" && formik.touched.to
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.to}</span>
                        : null
                    }
                </Box>

            </Box>

            <Box >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {openFrom && (
                        <StaticTimePicker
                            orientation="landscape"
                            open={openFrom}
                            value={formik.values.from}
                            onChange={(event) => {
                                if (typeof event === 'object') {
                                    formik.setFieldValue('from', event.format('hh:mm A'))
                                } else {
                                    formik.setFieldValue('from', '')
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                />
                            )}
                            onClose={() => { setOpenFrom(false) }}
                            displayStaticWrapperAs="mobile"
                        />
                    )}
                </LocalizationProvider>
                <Box>
                    {typeof formik.errors.duration !== "undefined" && formik.touched.duration
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.duration}</span>
                        : null
                    }
                </Box>
            </Box>


            <Box >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {openTo && (
                        <StaticTimePicker
                            orientation="landscape"
                            open={openTo}
                            value={formik.values.to}
                            onChange={(event) => {
                                if (typeof event === 'object') {
                                    formik.setFieldValue('to', event.format('hh:mm A'))
                                } else {
                                    formik.setFieldValue('to', '')
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                />
                            )}
                            onClose={() => { setOpenTo(false) }}
                            displayStaticWrapperAs="mobile"
                        />
                    )}
                </LocalizationProvider>
                <Box>
                    {typeof formik.errors.duration !== "undefined" && formik.touched.duration
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.duration}</span>
                        : null
                    }
                </Box>
            </Box>


            <Box marginTop='24px'>
                <CustomTextField
                    id='description'
                    placeholder="Description"
                    variant="outlined"
                    value={formik.values.description}
                    onChange={(event) => { formik.setFieldValue('description', event.target.value) }}
                    style={{ marginRight: '24px' }}
                />
                <Box>
                    {typeof formik.errors.description !== "undefined" && formik.touched.description
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.description}</span>
                        : null
                    }
                </Box>
            </Box>

            <Box marginTop='24px'>
                <CustomTextField
                    id='where'
                    placeholder="Where in the building"
                    variant="outlined"
                    value={formik.values.where}
                    onChange={(event) => { formik.setFieldValue('where', event.target.value) }}
                    style={{ marginRight: '24px' }}
                />
                <Box>
                    {locationError
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />You must provide either the 'Event Venue' or the 'Map Link' information to proceed.</span>
                        : null
                    }
                </Box>
            </Box>

            <Box marginTop='24px'>
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #F5F6F4', backgroundColor: '#FAFAFA', borderRadius: '8px', width: '546px', height: '56px', alignItems: 'center', padding: '0px 16px', }}
                    onClick={() => { setShouldMapOpen(true) }}
                >
                    <Typography sx={{ color: formik.values.link === '' ? '#c6c5c5' : '#7D7B7C', width: '450px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>
                        {
                            formik.values.link === '' ? 'Link for the location on the map' : formik.values.link
                        }
                    </Typography>
                    <Location />
                </Box>
                <Box>
                    {locationError
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />You must provide either the 'Event Venue' or the 'Map Link' information to proceed.</span>
                        : null
                    }
                </Box>
            </Box>

            <Box marginTop='24px'>
                <CustomTextField
                    id='seatLimit'
                    placeholder="Seat Limit"
                    variant="outlined"
                    value={formik.values.seats}
                    onChange={(event) => { formik.setFieldValue('seats', event.target.value) }}
                    style={{ marginRight: '24px' }}
                />
                <Box>
                    {typeof formik.errors.seats !== "undefined" && formik.touched.seats
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.seats}</span>
                        : null
                    }
                </Box>
            </Box>


            {image
                ? (
                    <Box sx={{ width: "261px" }}>
                        <input accept="image/*" id="icon-button-file"
                            type="file" style={{ display: 'none' }} onChange={(e) => { setImage(e.target.files[0]) }} />
                        <label htmlFor="icon-button-file">
                            <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#444344', marginBottom: '8px', mt: '24.17px' }}>
                                Add image
                            </Typography>
                            <Box
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                display="flex"
                                alignItems="center"
                                position="relative"
                                sx={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Company Logo"
                                    style={{
                                        borderRadius: '8px',
                                        width: '261px',
                                        height: '114.61px',
                                        filter: isHovering ? 'brightness(50%)' : 'none',
                                        transition: 'opacity 0.3s',
                                    }}

                                />
                                {isHovering && (
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
                    </Box>


                ) : (
                    <>
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#444344', marginBottom: '8px', mt: '24.17px' }}>
                            Add image
                        </Typography>
                        <input accept="image/*" id="icon-button-file"
                            type="file" style={{ display: 'none' }} onChange={(e) => { setImage(e.target.files[0]) }} />
                        <label htmlFor="icon-button-file">
                            <Box sx={{ cursor: 'pointer' }}  >
                                <Box sx={{
                                    backgroundColor: '#EEE5F1',
                                    border: '1px dashed #BB96C9',
                                    borderRadius: '8px',
                                    width: '261px',
                                    height: '114.61px',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>

                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <DocumentUpload />
                                        </Box>

                                        <Typography sx={{ marginTop: '10.25px', fontWeight: "400", fontSize: '14px', lineHeight: '28px', color: '#8D55A2' }}>
                                            Add image
                                        </Typography>

                                    </Box>
                                </Box>
                            </Box>
                        </label>
                        {imageError
                            && <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />Please select an image</span>
                        }
                    </>
                )
            }



            <Box sx={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }} >
                <Button
                    onClick={() => dispatch(closeAddEventDrawer())}
                    variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px' }}> Back </Button>
                <Button
                    type='submit'
                    onClick={() => {
                        setIsSubmitted(true)
                    }}
                    variant='contained'
                    sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px' }}
                >
                    {loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Save'}
                </Button>
            </Box >




            <Modal open={shouldMapOpen} >
                <MapModal
                    handleClose={() => { setShouldMapOpen(false) }}
                    handleUrlLink={(value) => { formik.setFieldValue('link', value) }} />
            </Modal>


        </form >
    )

}

export default AddNewEvents