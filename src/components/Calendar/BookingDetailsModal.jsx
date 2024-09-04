import { Avatar, AvatarGroup, Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactComponent as SmallCloseCircle } from '../../Assets/SVGs/SmallCloseCircle.svg';
import { ArrowLeft, KeyboardBackspace } from '@mui/icons-material';
import { closeBookingModal } from '../../Redux/calendarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../ApiMethods';
import SkeletonLoader from '../SkeletonLoader.jsx/SkeletonLoader';

const BookingDetailsModal = () => {
    const dispatch = useDispatch()
    const ID = useSelector((state) => state.calendar.modal_ID_for_API)
    const [sideBoxType, setSideBoxType] = useState('all')
    const [Booking, setBooking] = useState(null);

    const fetchBookingDetials = () => {

        privateRequest.get(`booking/details/${ID}`)
            .then((response) => {
                console.log('response.data', response.data);
                setBooking(response.data)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message)
            })
    }

    const formatDate = (dateString) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const date = new Date(dateString);
        const dayOfWeek = daysOfWeek[date.getUTCDay()];
        const day = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();

        const formattedDate = `${dayOfWeek} ${day} ${month}, ${year}`;
        return formattedDate;
    };

    const convertTimeFormat = (startTime, endTime) => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };

        const formattedStartTime = new Date(startTime).toLocaleTimeString(undefined, options);
        const formattedEndTime = new Date(endTime).toLocaleTimeString(undefined, options);

        return `${formattedStartTime} - ${formattedEndTime}`;
    };

    useEffect(() => {
        fetchBookingDetials()
    }, [])

    if (Booking === null) {
        return <Box sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '958px',
            height: '504px',
            background: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
        }}>
            <SkeletonLoader userHeight={'495px'} />
        </Box>
    }

    return (
        <Box sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '958px',
            height: '504px',
            background: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 22px', borderBottom: '1px solid #DBDBDA', height: '70px' }}>
                <Typography sx={{ fontWeight: "700", fontSize: '24px', lineHeight: '24px', color: '#020001' }}>
                    {Booking.name}
                </Typography>
                <SmallCloseCircle style={{ cursor: 'pointer' }} onClick={() => { dispatch(closeBookingModal()) }} />
            </Box>

            <Box sx={{ display: 'flex', padding: '21.5px 35px 40px 34px', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: "column", width: '573px', heigth: '100%', gap: "28.8px" }}>
                    <div>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                            Company Name:
                        </Typography>
                        <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                            {Booking.company.name ? Booking.comapany.name : 'Dummy Company'}
                        </Typography>
                    </div>

                    <div>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                            Date:
                        </Typography>
                        <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                            {formatDate(Booking.createdAt)}
                        </Typography>
                    </div>

                    <div>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                            When :
                        </Typography>
                        <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                            {convertTimeFormat(Booking.startTime, Booking.endTime)}
                        </Typography>
                    </div>

                    <div>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                            Description:
                        </Typography>
                        <Typography mt='6px' width='433.104px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                            {Booking.description}
                        </Typography>
                    </div>
                </Box>

                <div style={{ height: "361.357px", width: '0px', border: '1px solid #DBDBDA', marginRight: "50px", marginTop: '10px' }} />

                {sideBoxType === 'all' &&
                    <Box Box sx={{ width: 'calc(100% - 573px)', heigth: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        <div>
                            <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                Organizer:
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                <Avatar src={Booking.createdBy.profilePicture} sx={{ mr: '10px' }} />
                                <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                    {Booking.createdBy.firstName.en} {Booking.createdBy.lastName.en}
                                </Typography>
                            </div>
                        </div>

                        {Booking.attendees.length !== 0 &&
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'start', width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                        Attendees ({Booking.attendees.length})
                                    </Typography>

                                    <Button variant='text' onClick={() => { setSideBoxType('attendees') }}>View all</Button>
                                </div>
                                <AvatarGroup max={6}>
                                    {Booking.attendees.map((attendee, index) => (
                                        <Avatar key={index} src={attendee.profilePicture} />
                                    ))}
                                </AvatarGroup>
                            </div>
                        }

                        {Booking.visitors.length !== 0 &&
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'start', width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                        Visitors ({Booking.visitors.length})
                                    </Typography>

                                    <Button variant='text' onClick={() => { setSideBoxType('visitors') }} >View all</Button>
                                </div>
                                <AvatarGroup max={6}>
                                    {Booking.visitors.map((value, index) => (
                                        <Avatar key={index} />
                                    ))}
                                </AvatarGroup>
                            </div>
                        }
                    </Box>
                }


                {sideBoxType === 'attendees' &&
                    <Box sx={{ ml: '-20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: "15px" }}>
                            <KeyboardBackspace sx={{ mr: '13px', color: '#8D55A2', cursor: 'pointer' }} onClick={() => { setSideBoxType('all') }} />
                            <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                All Attendees:
                            </Typography>
                        </div>
                        <div style={{ height: "315px", width: '100%', overflow: 'auto', }}>
                            {
                                Booking.attendees.map((value, index) => (
                                    <div key={value._id} style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                        <Avatar src={value.profilePicture} sx={{ mr: '10px' }} />
                                        <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                            {value.firstName.en} {value.lastName.en}
                                        </Typography>
                                    </div>
                                ))
                            }
                        </div>
                    </Box>
                }

                {sideBoxType === 'visitors' &&
                    <Box sx={{ ml: '-20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: "15px" }}>
                            <KeyboardBackspace sx={{ mr: '13px', color: '#8D55A2', cursor: 'pointer' }} onClick={() => { setSideBoxType('all') }} />
                            <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                All Visitors:
                            </Typography>
                        </div>
                        <div style={{ height: "315px", width: '100%', overflow: 'auto', }}>
                            {
                                Booking.visitors.map((value, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                        <Avatar sx={{ mr: '10px' }} />
                                        <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                            {value.name}
                                        </Typography>
                                    </div>
                                ))
                            }
                        </div>
                    </Box>
                }
            </Box>

        </Box >
    )
}

export default BookingDetailsModal