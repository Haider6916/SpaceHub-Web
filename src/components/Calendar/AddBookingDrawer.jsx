import React, { useEffect, useState } from 'react'
import { ReactComponent as CloseCircle } from '../../Assets/SVGs/CloseCircle.svg';
import { closeAddBookingDrawer, openSuccessModal } from '../../Redux/bookingsSlice';
import { useDispatch } from 'react-redux';
import Stepper from '../CustomStepper/Stepper';
import { Avatar, Box, Button, Chip, Typography, Menu, MenuItem, FormControl, InputLabel, Select, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomTextField from '../CustomDrawerTextField/CustomTextField';
import { Add, Close, ErrorOutline } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { ReactComponent as CalendarIcon } from '../../Assets/SVGs/Calendar.svg';
import { ReactComponent as LongArrow } from '../../Assets/SVGs/LongArrow.svg';
import { Calendar } from 'react-date-range';
import { format } from 'date-fns';
import moment from 'moment/moment';
import { ReactComponent as Dropdown } from '../../Assets/SVGs/FieldDropdown.svg';
import { privateRequest } from '../../ApiMethods';
import { toast } from 'react-hot-toast';
import { closeBookingDrawer } from '../../Redux/calendarSlice';

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
    dropdownBox: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: "#FAFAFA",
        padding: '10px 16px',
        gap: '12px',
        height: '56px',
        border: '1px solid #F5F6F4',
        borderRadius: '8px',
        alignItems: 'center',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '28px',
        // width: '100%',
        color: '#7D7B7C',
        cursor: "pointer",
        '&:hover': { backgroundColor: "#e8e1eb" },
    },
    dropdownMenu: {
        '& .MuiPaper-root': {
            margin: '0',
            padding: '0',
            backgroundColor: '#FAFAFA',
            width: '150px',
            maxHeight: '200px',
            overflow: 'auto'
        },
    },
    dropdownMenuItem: {
        padding: '5px 20px',
        margin: '0',
        backgroundColor: '#FAFAFA',
        '&:hover': { backgroundColor: '#EEE5F1' }
    }

}));

const AddBookingDrawer = () => {

    var validationSchema = yup.object({
        name: yup
            .string('Name')
            .required('Name is required')
            .max(30, 'Name can have at most 30 characters'),
        company: yup
            .string('Start Date')
            .required('Company is required'),
        date: yup
            .string('Date')
            .required('Date is required'),
        startTime: yup
            .string('From')
            .required('Start time is required'),
        endTime: yup
            .string('To')
            .required('End time is required'),
        description: yup
            .string('Description')
            .required('Description is required')
            .max(300, 'Description can have at most 300 characters'),
        resource: yup
            .string('Resource')
            .required('Resource is required'),
    });

    const visitorValidation = yup.object({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        email: yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email').required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            company: '',
            date: '',
            startTime: '',
            endTime: '',
            description: '',
            resource: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {

            let apiObject = {
                "startTime": convertToISO(formik.values.date, formik.values.startTime),
                "endTime": convertToISO(formik.values.date, formik.values.endTime),
            }

            privateRequest.post(`/booking/${selectedMeetingRoom._id}`, apiObject).then((res) => {
                const availability = res.data.availability
                if (availability) {
                    setActiveStep(2)
                } else {
                    toast.error('Slot not available')
                }
            }).catch((error) => {
                toast.error(error.response.data.error.message)
            })
        }
    });

    const formik1 = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        validationSchema: visitorValidation,
        onSubmit: (values, { resetForm }) => {
            if (parseInt((selectedEmployees.length + visitors.length)) < parseInt(selectedMeetingRoom.capacity)) {
                const tempObj = {
                    name: `${formik1.values.firstName} ${formik1.values.lastName}`,
                    email: values.email
                }
                setVisitors([...visitors, tempObj])
                setShowField(false)
                resetForm();
            } else {
                toast.error('Capacity limit reached')
            }


        }
    });


    const classes = useStyles();
    const dispatch = useDispatch()
    const [startShownDate, setStartShownDate] = useState(new Date());
    const [openStartDate, setOpenStartDate] = useState(false);
    const [endTimeError, setEndTimeError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [startTimeError, setStartTimeError] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [activeStep, setActiveStep] = useState(1)
    const [showField, setShowField] = useState(false)
    const [meetingRoomsNames, setMeetingRoomsNames] = useState([])
    const [meetingRoomsData, setMeetingRoomsData] = useState([])
    const [selectedMeetingRoom, setSelecteMeetingRoom] = useState(null)
    const [companiesData, setCompaniesData] = useState([])
    const [companiesName, setCompaniesName] = useState([])
    const [visitors, setVisitors] = useState([])
    const [employeesData, setEmployeesData] = useState([])
    const [selectedCompany, setSelectedCompany] = useState('')
    const [bookedSlots, setBookedSlots] = useState([])
    const [anchorElStartTime, setAnchorElStartTime] = useState(null);
    const [anchorElEndTime, setAnchorElEndTime] = useState(null);

    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employeeAnchorEl, setEmployeeAnchorEl] = useState(null);

    const openStartTime = Boolean(anchorElStartTime);
    const openEndTime = Boolean(anchorElEndTime)


    const fetchBookings = (bookingRoomName) => {
        let id
        meetingRoomsData.map((value) => {
            if (value.name === bookingRoomName) {
                id = value._id
                setSelecteMeetingRoom(value)
                return
            }
        })
        privateRequest.get(`/booking/${id}`).then((res) => {
            setBookings(res.data)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchCompanies = () => {
        privateRequest.get(`/company`, {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 99999999999
            }
        }).then((res) => {
            setCompaniesData(res.data.docs);
            let companiesName = []
            res.data.docs.forEach((value) => {
                companiesName.push(value.name)
            })

            setCompaniesName(companiesName)

        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchEmployees = (companyName) => {
        companiesData.forEach((value) => {
            if (value.name === companyName) {
                setEmployeesData(value.employees)
            }
        })
    }
    const fetchListings = () => {
        privateRequest.get('/resource?resourceType=meeting_room', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 99999
            }
        }).then((res) => {
            setMeetingRoomsData(res.data.docs)
            let tempArray = []
            res.data.docs.forEach((value) => {
                tempArray.push(value.name)
            })
            setMeetingRoomsNames(tempArray)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const makeBookedSlots = (selectedDate) => {

        let tempArray = []

        bookings.forEach((value) => {
            var localStartDateTime = moment.utc(value.startTime).local();
            var formattedStartDate = localStartDateTime.format('DD-MM-YYYY');
            var formattedStartTime = localStartDateTime.format('hh:mm A');
            var localEndDateTime = moment.utc(value.endTime).local();
            var formattedEndDate = localEndDateTime.format('DD-MM-YYYY');
            var formattedEndTime = localEndDateTime.format('hh:mm A');
            if (formattedEndDate === formattedStartDate && formattedEndDate === selectedDate) {
                tempArray.push({
                    startTime: formattedStartTime,
                    endTime: formattedEndTime
                })
            } else if (formattedEndDate === selectedDate || formattedStartDate === selectedDate) {
                var [startDate, ,] = formattedStartDate.split('-')
                var [endDate, ,] = formattedEndDate.split('-')
                var [selectedDateOnly, ,] = selectedDate.split('-')
                if (parseInt(startDate) < parseInt(selectedDateOnly)) {
                    formattedStartTime = '12:00 AM'
                } else if (parseInt(selectedDate) < parseInt(endDate)) {
                    formattedEndTime = '11:45 PM'
                }
                tempArray.push({
                    startTime: formattedStartTime,
                    endTime: formattedEndTime
                })
            }

        })
        tempArray = tempArray.sort((a, b) => {
            const startTimeA = a.startTime;
            const startTimeB = b.startTime;
            if (startTimeA < startTimeB) {
                return -1;
            }
            if (startTimeA > startTimeB) {
                return 1;
            }
            return 0;
        })
        setBookedSlots(tempArray)
    }

    const filterStartSlots = (value) => {
        let isBooked = false
        for (let i = 0; i < bookedSlots.length; i++) {
            const bookingStartTime = moment(bookedSlots[i].startTime, "hh:mm A");
            const bookingEndTime = moment(bookedSlots[i].endTime, "hh:mm A");
            if (moment(value, 'hh:mm A').isBetween(bookingStartTime, bookingEndTime, null, '[)')) {
                isBooked = true
            }
        }
        return isBooked

    }

    const filterEndSlots = (value, selectedStartTime) => {
        let isBooked = false
        let lastBooking = false
        let index = 0;
        const tempBookingArray = []
        tempBookingArray.push({
            startTime: '12:00 AM',
            endTime: selectedStartTime
        })


        if (bookedSlots.length > 0) {

            for (let i = 0; i < bookedSlots.length; i++) {

                if (bookedSlots.length === 1) {
                    lastBooking = true
                }
                else if (i > 0) {
                    lastBooking = true
                }
                if (moment(selectedStartTime, 'hh:mm A').isBefore(moment(bookedSlots[i].startTime, 'hh:mm A'))) {
                    console.log('Check Passed');
                    index = i;
                    break;
                }

            }

            if (!(lastBooking && index === 0)) {
                tempBookingArray.push({
                    startTime: bookedSlots[index].startTime,
                    endTime: '11:45 PM'
                })
            }

        }

        for (let i = 0; i < tempBookingArray.length; i++) {
            const bookingStartTime = moment(tempBookingArray[i].startTime, "hh:mm A");
            const bookingEndTime = moment(tempBookingArray[i].endTime, "hh:mm A");
            if (moment(value, 'hh:mm A').isBetween(bookingStartTime, bookingEndTime, null, '(]')) {
                isBooked = true
            }
        }
        if (value === '12:00 AM') {
            if (!(lastBooking && index === 0)) {
                return true
            } else {
                return false
            }

        } else {
            return isBooked
        }
    }

    const makeTimeSlots = () => {
        const timeArray = [];
        const startTime = moment().hour(parseInt(0)).minute(0).second(0);

        for (let i = 0; i < 24 * 4; i++) {
            const time = startTime.clone().add(15 * i, 'minutes').format('hh:mm A');
            timeArray.push(time);
        }

        return timeArray
    }

    const handleDeleteAttendee = (idToRemove) => {
        setSelectedEmployees(selectedEmployees.filter(employeeDetail => employeeDetail._id !== idToRemove))
    };

    const handleDeleteVisitor = (emailToRemove) => {
        setVisitors(visitors.filter(visitorDetail => visitorDetail.email !== emailToRemove))
    };

    const handleClickStartTime = (event) => {
        setAnchorElStartTime(event.currentTarget);
    };

    const handleClickEndTime = (event) => {
        setAnchorElEndTime(event.currentTarget);
    };

    const handleEmployeeClick = (event) => {
        setEmployeeAnchorEl(event.currentTarget);
    };

    const handleEmployeeClose = () => {
        setEmployeeAnchorEl(null);
    };

    const handleEmployeeToggle = (employee) => () => {

        const selectedIndex = selectedEmployees.indexOf(employee);
        let newSelected = [...selectedEmployees];

        if (selectedIndex === -1) {
            if (parseInt((selectedEmployees.length + visitors.length)) < parseInt(selectedMeetingRoom.capacity)) {
                newSelected.push(employee);
            }
            else {
                toast.error('Capacity limit reached')
            }
        } else {
            newSelected.splice(selectedIndex, 1);
        }

        setSelectedEmployees(newSelected);

    };

    const isEmployeeSelected = (employee) => {
        return selectedEmployees.some((selectedEmployee) => selectedEmployee._id === employee._id);
    };

    const convertToISO = (date, time) => {

        let formattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formattedTime = moment(time, "hh:mm A").format("HH:mm:ss.sssZ")
        const dtObject = new Date(`${formattedDate} ${formattedTime}`);
        const isoStr = dtObject.toISOString();
        return isoStr;
    }


    const bookMeetingRoom = () => {


        let companyID = ''
        companiesData.forEach((value) => {
            if (formik.values.company === value.name) {
                companyID = value._id
            }
        })

        const tempAttendees = []

        selectedEmployees.forEach((value) => {
            tempAttendees.push(value._id)
        })

        const apiObject = {
            "name": formik.values.name,
            "description": formik.values.description,
            "company": companyID,
            "startTime": convertToISO(formik.values.date, formik.values.startTime),
            "endTime": convertToISO(formik.values.date, formik.values.endTime),
            "resource": selectedMeetingRoom._id,
            "attendees": tempAttendees,
            "visitorsDetails": visitors
        }

        privateRequest.post(`/booking`, apiObject).then((res) => {
            dispatch(closeBookingDrawer())
            toast.success(res.data.message)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })

    }

    useEffect(() => {
        fetchListings()
        fetchCompanies()
    }, [])



    return (

        <>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{
                    color: '#272627',
                    fontSize: '32px',
                    fontWeight: "700",
                    lineHeight: 'normal',
                }}>
                    Book a room
                </Typography>
                <CloseCircle onClick={() => { dispatch(closeBookingDrawer()) }} style={{ cursor: 'pointer' }} />
            </div>
            <Box sx={{ display: 'flex', gap: '53px', alignItems: 'center', mt: '39px', mb: '54.36px' }}>
                <Stepper number={1} status={activeStep === 1 ? 'active' : 'completed'} label={'Room Details'} />
                <div style={{ height: '2px', width: "222px", backgroundColor: activeStep === 1 ? '#C6C7C5' : '#8D55A2' }} />
                <Stepper number={2} status={activeStep === 1 ? 'in-active' : 'active'} label={'Attendees'} />
            </Box>
            {
                (activeStep === 1) &&
                < >

                    <form onSubmit={formik.handleSubmit}>
                        <div style={{ gap: '24px', display: 'flex', flexDirection: 'column', width: '546px' }}>

                            <div >
                                <CustomDropdown
                                    placeholderValue='Select Resource'
                                    menuItems={meetingRoomsNames}
                                    value={formik.values.resource}
                                    handleDropdownValue={(value) => {
                                        formik.setFieldValue('resource', value)
                                        fetchBookings(value)
                                        setDateError(false)
                                    }}
                                />
                                <Box>
                                    {typeof formik.errors.resource !== "undefined" && formik.touched.resource
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.resource}</span>
                                        : null
                                    }
                                </Box>
                            </div>

                            <div>
                                <CustomTextField
                                    id='name'
                                    placeholder="Name"
                                    variant="outlined"
                                    value={formik.values.name}
                                    onChange={(event) => { formik.setFieldValue('name', event.target.value) }}
                                    style={{ marginRight: '24px' }}
                                />
                                <Box>
                                    {typeof formik.errors.name !== "undefined" && formik.touched.name
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.name}</span>
                                        : null
                                    }
                                </Box>
                            </div>

                            <div>
                                <CustomDropdown
                                    placeholderValue='Select Company'
                                    menuItems={companiesName}
                                    value={formik.values.company}
                                    handleDropdownValue={(value) => {
                                        formik.setFieldValue('company', value)
                                    }}
                                />
                                <Box>
                                    {typeof formik.errors.company !== "undefined" && formik.touched.company
                                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.company}</span>
                                        : null
                                    }

                                </Box>
                            </div>

                            <div>
                                <Box onClick={(event) => {
                                    if (formik.values.resource === '') {
                                        setDateError(true)
                                    }
                                    else {
                                        setDateError(false)
                                        setOpenStartDate(!openStartDate)
                                    }


                                }} sx={{ position: 'relative', alignItems: "center", width: 'inherit', backgroundColor: formik.values.date === '' ? '#FAFAFA' : '#EEE5F1', borderRadius: '8px', height: '56px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', '&:hover': { backgroundColor: '#EEE5F1' } }}>
                                    <Typography sx={{
                                        fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: formik.values.date === '' ? '#c6c5c5' : '#7D7B7C'
                                    }}>
                                        {formik.values.date === '' ? 'Select Date' : formik.values.date}
                                    </Typography>
                                    <CalendarIcon />
                                </Box>
                                {typeof formik.errors.date !== "undefined" && formik.touched.date
                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.date}</span>
                                    : null
                                }

                                {dateError &&
                                    <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />Resource is required</span>
                                }

                                {openStartDate && <div style={{ width: "inherit", backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
                                    <Calendar
                                        date={startShownDate}
                                        className='calendarElement'
                                        onChange={(date) => {
                                            setStartShownDate(date)
                                            formik.setFieldValue('date', format(date, 'dd-MM-yyyy'))
                                            setOpenStartDate(false)
                                            makeBookedSlots(format(date, 'dd-MM-yyyy'))
                                        }}
                                        minDate={new Date()}
                                        color="#8D55A2"
                                        colorPrimary="#8D55A2"
                                    />
                                </div>
                                }
                            </div>

                            <div>
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>

                                    <Box width='160px' className={classes.dropdownBox}
                                        onClick={(event) => {
                                            if (formik.values.date === '') {
                                                setStartTimeError(true)
                                            }
                                            else {
                                                handleClickStartTime(event)
                                                setStartTimeError(false)
                                            }
                                        }}
                                    >
                                        {formik.values.startTime === '' ? 'Start Time' : formik.values.startTime}
                                        <Dropdown />
                                    </Box>

                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorElStartTime}
                                        open={openStartTime}
                                        onClose={() => setAnchorElStartTime(null)}
                                        className={classes.dropdownMenu}
                                    >
                                        {
                                            makeTimeSlots().map((value) => (
                                                <MenuItem
                                                    key={`${value}  start`}
                                                    disabled={filterStartSlots(value)}
                                                    autoFocus={false}
                                                    onClick={() => { formik.setFieldValue('startTime', value); setAnchorElStartTime(null) }}
                                                    className={classes.dropdownMenuItem}
                                                >
                                                    {value}
                                                </MenuItem>
                                            ))
                                        }

                                    </Menu>

                                    <LongArrow />

                                    <Box onClick={(event) => {
                                        if (formik.values.startTime === '') {
                                            setEndTimeError(true)
                                        }
                                        else {
                                            handleClickEndTime(event)
                                            setEndTimeError(false)
                                        }
                                    }} width='160px' className={classes.dropdownBox}>
                                        {formik.values.endTime === '' ? 'End Time' : formik.values.endTime}
                                        <Dropdown />
                                    </Box>



                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorElEndTime}
                                        open={openEndTime}
                                        onClose={() => setAnchorElEndTime(null)}
                                        // MenuListProps={{
                                        //     'aria-labelledby': 'basic-button',
                                        // }}
                                        className={classes.dropdownMenu}
                                    >
                                        {
                                            makeTimeSlots().map((value) => (
                                                <MenuItem
                                                    key={`${value}  end`}
                                                    disabled={filterEndSlots(value, formik.values.startTime)}
                                                    autoFocus={false}
                                                    onClick={() => { formik.setFieldValue('endTime', value); setAnchorElEndTime(null) }}
                                                    className={classes.dropdownMenuItem}
                                                >
                                                    {value}
                                                </MenuItem>
                                            ))
                                        }

                                    </Menu>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        {startTimeError &&
                                            <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />Date is required</span>
                                        }


                                        {typeof formik.errors.endTime !== "undefined" && formik.touched.endTime && startTimeError === false
                                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.endTime}</span>
                                            : null
                                        }

                                    </Box>

                                    <Box>

                                        {endTimeError &&
                                            <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />Start time is required</span>
                                        }


                                        {typeof formik.errors.endTime !== "undefined" && formik.touched.endTime && endTimeError === false
                                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.endTime}</span>
                                            : null
                                        }

                                    </Box>

                                </div>


                            </div>



                            <div>
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
                            </div>

                            <div style={{ marginTop: '56px', display: 'flex', justifyContent: 'flex-end', gap: '24px' }}>
                                <Button variant='outlined' sx={{ height: '40px', width: '166px', borderRadius: '51px', padding: '0px 24px', fontSize: '16px', fontWeight: '500' }}>Back</Button>
                                <Button type='submit' variant='contained' sx={{ height: '40px', width: '166px', borderRadius: '51px', padding: '0px 24px', fontSize: '16px', fontWeight: '500' }}>Next</Button>
                            </div>
                        </div>
                    </form>
                </>
            }

            {
                activeStep === 2 &&
                <>
                    <Typography sx={{ fontWeight: "400", fontSize: '18px', color: '#272627' }}>
                        Attendees: {selectedEmployees.length + visitors.length}/{selectedMeetingRoom.capacity}
                    </Typography>

                    <div style={{ marginTop: '32px', gap: "24px", display: 'flex', flexDirection: 'column', }}>
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', color: '#272627' }}>
                            Attendees
                        </Typography>

                        <div>
                            <CustomDropdown
                                placeholderValue='Select Company'
                                menuItems={companiesName}
                                value={selectedCompany}
                                handleDropdownValue={(value) => {
                                    setSelectedCompany(value)
                                    fetchEmployees(value)
                                }}
                            />
                        </div>


                        <Box width='100%' className={classes.dropdownBox} onClick={handleEmployeeClick}>
                            Select Employees
                            <Dropdown />
                        </Box>
                        <Menu
                            anchorEl={employeeAnchorEl}
                            open={Boolean(employeeAnchorEl)}
                            onClose={handleEmployeeClose}
                            sx={{
                                '& .MuiPaper-root': {
                                    margin: '0',
                                    padding: '0',
                                    backgroundColor: '#FAFAFA',
                                    width: '546px',
                                    maxHeight: '300px',
                                    overflow: 'auto'
                                },
                            }}
                        >
                            {selectedCompany &&
                                employeesData.map((employee) => (
                                    <MenuItem
                                        className={classes.dropdownMenuItem}
                                        key={employee._id} onClick={handleEmployeeToggle(employee)}>
                                        <Checkbox
                                            checked={isEmployeeSelected(employee)}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                        {`${employee.firstName.en} ${employee.lastName.en}`}
                                    </MenuItem>
                                ))}
                        </Menu>


                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%', }}>

                            {selectedEmployees.map((value, index) => (
                                <Chip key={index} onDelete={() => { handleDeleteAttendee(value._id) }} sx={{ borderRadius: '8px' }} label={`${value.firstName.en} ${value.lastName.en}`} avatar={<Avatar src={value.profilePicture} />} />
                            ))}

                        </div>
                    </div>

                    <div style={{ marginTop: '32px', gap: "16px", display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontWeight: "400", fontSize: '18px', color: '#272627' }}>
                                Visitors
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{
                                    height: '32px',
                                    width: '32px',
                                    borderRadius: '50%',
                                    minWidth: 'unset',
                                    minHeight: 'unset',
                                    transition: 'background-color 0.5s, transform 0.5s',
                                    backgroundColor: showField ? '#aeaeae' : '#A070B2',
                                    transform: showField ? 'rotate(45deg)' : 'rotate(0deg)',

                                    '&:hover': {
                                        backgroundColor: showField ? '#7D7B7C' : '#8D55A2',
                                    },
                                }}
                                onClick={() => { setShowField(!showField) }}
                            >
                                <Add />
                            </Button>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%', }}>

                            {visitors.map((value, index) => (
                                <Chip key={index} onDelete={() => { handleDeleteVisitor(value.email) }} sx={{ borderRadius: '8px' }} label={`${value.name}`} avatar={<Avatar src={'https://i.fbcd.co/products/resized/resized-750-500/d4c961732ba6ec52c0bbde63c9cb9e5dd6593826ee788080599f68920224e27d.jpg'} />} />
                            ))}

                        </div>

                        {
                            showField &&
                            <form onSubmit={formik1.handleSubmit} >
                                <div style={{ marginTop: '16px', gap: '24px', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', }}>
                                        <Box sx={{ marginRight: '26px' }} >
                                            <CustomTextField
                                                id='firstName'
                                                placeholder="First name"
                                                variant="outlined"
                                                value={formik1.values.firstName}
                                                onChange={formik1.handleChange}
                                                style={{ marginRight: '26px' }}
                                            />
                                            <Box>
                                                {typeof formik1.errors.firstName !== "undefined" && formik1.touched.firstName
                                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.firstName}</span>
                                                    : null
                                                }
                                            </Box>
                                        </Box>

                                        <Box>
                                            <CustomTextField
                                                id='lastName'
                                                placeholder="Last name"
                                                variant="outlined"
                                                value={formik1.values.lastName}
                                                onChange={formik1.handleChange}
                                            />
                                            <Box>
                                                {typeof formik1.errors.lastName !== "undefined" && formik1.touched.lastName
                                                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.lastName}</span>
                                                    : null
                                                }
                                            </Box>
                                        </Box>
                                    </div>


                                    <div >
                                        <CustomTextField
                                            id='email'
                                            placeholder="Email"
                                            variant="outlined"
                                            value={formik1.values.email}
                                            onChange={formik1.handleChange}
                                        />
                                        <Box>
                                            {typeof formik1.errors.email !== "undefined" && formik1.touched.email
                                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik1.errors.email}</span>
                                                : null
                                            }
                                        </Box>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px', }}>
                                        <Button type='submit' variant='contained' sx={{ height: '29.5px', width: '123.203px', borderRadius: '38px', padding: '0px 17.813px' }}>Add</Button>
                                    </div>

                                </div>
                            </form>
                        }

                        <div style={{ marginTop: '61.31px', display: 'flex', justifyContent: 'flex-end', gap: '24px' }}>
                            <Button variant='outlined' onClick={() => { setActiveStep(1); setShowField(false) }} sx={{ height: '40px', width: '166px', borderRadius: '51px', padding: '0px 24px', fontSize: '16px', fontWeight: '500' }}>Back</Button>
                            <Button variant='contained' onClick={() => { bookMeetingRoom() }} sx={{ height: '40px', width: '166px', borderRadius: '51px', padding: '0px 24px', fontSize: '16px', fontWeight: '500' }}>Confirm</Button>
                        </div>
                    </div>
                </>
            }
        </>

    )
}

export default AddBookingDrawer