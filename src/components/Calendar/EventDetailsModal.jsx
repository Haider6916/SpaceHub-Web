import { Avatar, AvatarGroup, Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactComponent as SmallCloseCircle } from '../../Assets/SVGs/SmallCloseCircle.svg';
import { ArrowLeft, KeyboardBackspace } from '@mui/icons-material';
import { closeEventModal } from '../../Redux/calendarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { privateRequest } from '../../ApiMethods';
import { toast } from 'react-hot-toast';
import SkeletonLoader from '../SkeletonLoader.jsx/SkeletonLoader';

const EventDetailsModal = () => {

    const dispatch = useDispatch()
    const ID = useSelector((state) => state.calendar.modal_ID_for_API)
    const [Event, setEvent] = useState(null);


    const fetchEventDetials = () => {

        privateRequest.get(`event/${ID}`)
            .then((response) => {
                console.log('response.data', response.data);
                setEvent(response.data)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message)
            })
    }


    useEffect(() => {
        fetchEventDetials()
    }, [])

    const formatDates = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const startMonth = start.toLocaleString('default', { month: 'short' });
        const endMonth = end.toLocaleString('default', { month: 'short' });

        const formattedStartDate = `${start.getDate()} ${startMonth}`;
        const formattedEndDate = `${end.getDate()} ${endMonth}`;

        const startYear = start.getFullYear();
        const endYear = end.getFullYear();

        if (startYear === endYear) {
            return `${formattedStartDate} - ${formattedEndDate}, ${startYear}`;
        } else {
            return `${formattedStartDate}, ${startYear} - ${formattedEndDate}, ${endYear}`;
        }
    };

    const convertTimeFormat = (startTime, endTime) => {
        const start = parseTime(startTime);
        const end = parseTime(endTime);

        const formattedStartTime = formatTime(start.hours, start.minutes, start.isPM);
        const formattedEndTime = formatTime(end.hours, end.minutes, end.isPM);

        return `${formattedStartTime} - ${formattedEndTime}`;
    };

    const parseTime = (timeString) => {
        const timeParts = timeString.match(/(\d+):(\d+)/);
        const hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);
        const isPM = hours >= 12;
        return { hours, minutes, isPM };
    };

    const formatTime = (hours, minutes, isPM) => {
        const formattedHours = isPM ? hours - 12 : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const period = isPM ? 'PM' : 'AM';

        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    if (Event === null) {
        return <Box sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '958px',
            height: '575px',
            background: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
        }}>
            <SkeletonLoader userHeight={'570px'} />
        </Box>
    }


    return (
        <Box sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '958px',
            height: '575px',
            background: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 22px', borderBottom: '1px solid #DBDBDA', height: '70px' }}>
                <Typography sx={{ fontWeight: "700", fontSize: '24px', lineHeight: '24px', color: '#020001' }}>
                    {Event.title}
                </Typography>
                <SmallCloseCircle style={{ cursor: 'pointer' }} onClick={() => { dispatch(closeEventModal()) }} />
            </Box>

            <Box sx={{ display: 'flex', padding: '21.5px 35px 40px 34px', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: "column", width: '573px', height: '440px', gap: "28.8px", overflowY: 'auto' }}>
                    <div>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                            Address:
                        </Typography>
                        <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                            {Event.location}
                        </Typography>
                        {
                            Event.locationLink !== "//" && (
                                <a href={Event.locationLink} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                                    <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#8D55A2', cursor: 'pointer' }}>
                                        View on map
                                    </Typography>
                                </a>
                            )
                        }

                    </div>

                    <div>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                            Date:
                        </Typography>
                        <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                            {/* 22 Aug - 28 Aug, 2022 */}
                            {formatDates(Event.startDate, Event.endDate)}
                        </Typography>
                    </div>

                    <div>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                            When :
                        </Typography>
                        <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                            {convertTimeFormat(Event.startTime, Event.endTime)}
                        </Typography>
                    </div>

                    <div>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                            Seat Limit :
                        </Typography>
                        <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                            {Event.seatsLimit}
                        </Typography>
                    </div>

                    <div>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                            Description:
                        </Typography>
                        <Typography mt='6px' width='433.104px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                            {Event.description}
                        </Typography>
                    </div>
                </Box>

                <div style={{ height: "433.77px", width: '0px', border: '1px solid #DBDBDA', marginRight: "50px", marginTop: '10px' }} />


                <Box Box sx={{ width: 'calc(100% - 573px)', heigth: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                            Organizer:
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                            <Avatar src={Event.createdBy.profilePicture} sx={{ mr: '10px' }} />
                            <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                {Event.createdBy.firstName.en} {Event.createdBy.lastName.en}
                            </Typography>
                        </div>
                    </div>
                </Box>

            </Box>

        </Box >
    )
}

export default EventDetailsModal