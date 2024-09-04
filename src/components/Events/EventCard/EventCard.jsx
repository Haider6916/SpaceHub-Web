import { Avatar, AvatarGroup, Box, Menu, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as Dots } from '../../../Assets/SVGs/DotsThree.svg';
import { useDispatch } from 'react-redux';
import { eventsReloadTrue, openEditEventDrawer, openUsersList } from '../../../Redux/eventsSlice';
import './EventCard.css'
import { privateRequest } from '../../../ApiMethods';
import { toast } from 'react-hot-toast';
import moment from 'moment';

function EventCard({ eventDetails }) {
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null);

    const textRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [showFullText, setShowFullText] = useState(false);

    const handleReadMore = () => {
        setShowFullText(!showFullText);
    };

    const deleteEvent = () => {
        privateRequest.delete(`/event/${eventDetails._id}`).then((res) => {
            toast.success(res.data.message)
            dispatch(eventsReloadTrue())
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}/${formattedMonth}/${year}`;
    }

    function formatDuration(startTime, endTime) {

        const formattedStartTime = moment(startTime, 'HH:mm:ss.SSSZ').local().format('hh A')
        const formattedEndTime = moment(endTime, 'HH:mm:ss.SSSZ').local().format('hh A')

        return `Duration: ${formattedStartTime} to ${formattedEndTime}`;
    }

    useEffect(() => {
        const element = textRef.current;
        if (element) {
            const { clientHeight, scrollHeight } = element;
            setIsOverflowing(scrollHeight > clientHeight);
        }
    }, [eventDetails.description]);

    return (
        <Box sx={{ width: "100%", display: 'flex', borderBottom: '1px solid #DBDBDA' }}>

            < Box sx={{ borderRadius: '8px', width: '261px', height: isOverflowing ? '218px' : '196px', mr: '24px', }}>
                <img
                    src={eventDetails.eventPicture}
                    alt="Event Image"
                    style={{ width: "100%", height: '100%', borderRadius: "8px" }} />
            </Box>


            <Box sx={{ width: 'calc(100% - 275px)' }} >
                {/* Title and location */}
                <Box display='flex' justifyContent='space-between' width='100%' >
                    <Box>
                        <Typography sx={{ fontWeight: '500', fontSize: '24px', lineHeight: '28px', color: ' #8D55A2' }}>{eventDetails.title}</Typography>
                        <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556' }}>{eventDetails.location}</Typography>
                    </Box>
                    <Box onClick={(event) => { setAnchorEl(event.currentTarget) }}
                        sx={{
                            // marginTop: '42.64px',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0px 1px 4px rgba(2, 0, 1, 0.1)',
                            width: '48px',
                            height: '48px',
                            borderRadius: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Dots />
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{
                            style: {
                                width: '188px',
                                background: '#FAFAFA',
                                border: '1px solid #F5F6F4',
                                borderRadius: '8px',
                                padding: '0px',
                                fontSize: '16px',
                                lineHeight: '28px',
                                color: '#7D7B7C'
                            },
                        }}
                    >

                        <MenuItem onClick={() => { dispatch(openEditEventDrawer(eventDetails)); setAnchorEl(null) }} >Edit</MenuItem>
                        <MenuItem
                            onClick={() => {
                                setAnchorEl(null)
                                deleteEvent()
                            }}
                        >
                            Delete
                        </MenuItem>

                    </Menu >
                </Box>
                {/* Start Date , Duration , Hours */}
                <Box display='flex' justifyContent='space-between' width='100%' mt='8px'>
                    <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556' }}>Start date: {formatDate(eventDetails.startDate)}</Typography>
                    <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556' }}>{formatDuration(eventDetails.startTime, eventDetails.endTime)}</Typography>
                    <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556' }}>End date: {formatDate(eventDetails.endDate)}</Typography>
                </Box>
                {/* Description */}
                <Box width='calc(100% - 140px)' mt='8px'>
                    <Typography
                        ref={textRef}
                        sx={{
                            minHeight: '56px',
                            fontWeight: '400',
                            fontSize: '16px',
                            lineHeight: '28px',
                            color: '#565556',
                            width: '100%',
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitLineClamp: showFullText ? 'unset' : 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {eventDetails.description}
                    </Typography>

                    {isOverflowing && (
                        <Typography onClick={handleReadMore} sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#8D55A2', cursor: 'pointer' }}>
                            {showFullText ? 'Read Less' : '...Read More'}
                        </Typography>
                    )}

                </Box>
                {/* Seats Left, Image Group, View All */}
                <Box display='flex' justifyContent='space-between' alignItems='center' width='100%' mb='20px' sx={{ mt: isOverflowing ? '0px' : '8px' }}>
                    <Box display='flex'>
                        <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556', mr: '34px' }}>
                            Seats left: {(parseInt(eventDetails.seatsLimit) - eventDetails.attendees.length)}/{eventDetails.seatsLimit}
                        </Typography>

                        <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556' }}>
                            <a href={eventDetails.locationLink !== null ? eventDetails.locationLink : '#'} target="_blank" className="custom-link">Link on map</a>
                        </Typography>
                    </Box>

                    <Box display='flex' alignItems='center'>
                        <AvatarGroup sx={{ mr: '10px', }}>
                            {
                                eventDetails.attendees.slice(0, Math.min(4, eventDetails.attendees.length)).map((value, index) => (
                                    <Avatar
                                        key={index}
                                        sx={{ width: '40px', height: '40px' }}
                                        alt="Name"
                                        src={value.profilePicture}
                                    />
                                ))
                            }
                        </AvatarGroup>
                        <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556', mr: '10px' }}>
                            {(eventDetails.attendees.length >= 4 ? `+${(eventDetails.attendees.length - 4)}` : '')}
                        </Typography>

                        <Typography onClick={() => dispatch(openUsersList(eventDetails.attendees))} sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#8D55A2', width: '65px', cursor: 'pointer' }}>
                            {eventDetails.attendees.length !== 0 && 'view all'}
                        </Typography>
                    </Box>
                </Box>


            </Box>

        </Box >
    )
}

export default EventCard