import { Avatar, AvatarGroup, Box, Button, Dialog, Menu, MenuItem, Modal, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as Dots } from '../../../Assets/SVGs/DotsThree.svg';
import { useDispatch } from 'react-redux';
import { privateRequest } from '../../../ApiMethods';
import { toast } from 'react-hot-toast';
import { openUsersList } from '../../../Redux/bookingsSlice';
import DeleteModal from '../DeleteModal/DeleteModal';

function BooikingDetails({ bookingDetails, reloadData }) {

    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null);

    const textRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [showFullText, setShowFullText] = useState(false);
    const [avatars, setAvatars] = useState([])
    const [openDelete, setOpenDelete] = useState(false)
    const [bookingId, setBookingID] = useState(null)

    const handleReadMore = () => {
        setShowFullText(!showFullText);
    };

    function formatDate(dateString) {
        const date = new Date(dateString).toLocaleDateString();
        // const day = date.getDate();
        // const month = date.getMonth() + 1;
        // const year = date.getFullYear();
        // const formattedDay = day < 10 ? `0${day}` : day;
        // const formattedMonth = month < 10 ? `0${month}` : month;

        // return `${formattedDay}/${formattedMonth}/${year}`;
        return date;
    }

    function formatDuration(startTimeReceived, endTimeReceived) {

        // let [, startTime] = startTimeReceived.split('T')
        // let [, endTime] = endTimeReceived.split('T')
        // const startHours = parseInt(startTime.slice(0, 2));
        // const endHours = parseInt(endTime.slice(0, 2));
        // const formattedStartTime = formatTime(startHours);
        // const formattedEndTime = formatTime(endHours);
        const formattedStartTime = new Date(startTimeReceived).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const formattedEndTime = new Date(endTimeReceived).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return `From: ${formattedStartTime} to ${formattedEndTime}`;
    }

    function formatTime(hours) {
        // Convert 24-hour format to AM/PM format
        if (hours === 0) {
            return '12 AM';
        } else if (hours < 12) {
            return `${hours} AM`;
        } else if (hours === 12) {
            return '12 PM';
        } else {
            return `${hours - 12} PM`;
        }
    }

    function calculateDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const duration = end - start;

        const millisecondsPerMinute = 1000 * 60;
        const minutes = Math.floor(duration / millisecondsPerMinute);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        let durationString = "";
        if (hours > 0) {
            durationString += hours + " hrs ";
        }
        if (remainingMinutes > 0) {
            durationString += remainingMinutes + " mins";
        }

        return durationString.trim();
    }



    useEffect(() => {
        const element = textRef.current;
        if (element) {
            const { clientHeight, scrollHeight } = element;
            setIsOverflowing(scrollHeight > clientHeight);
        }

    }, [bookingDetails.description]);

    useEffect(() => {
        let tempArray = [...bookingDetails.attendees, ...bookingDetails.visitors]
        tempArray.slice(0, Math.min(4, bookingDetails.attendees.length))
        setAvatars(tempArray)
    }, [])



    return (
        <Box sx={{ width: "100%", display: 'flex', borderBottom: '1px solid #DBDBDA', }}>

            < Box sx={{ borderRadius: '8px', width: '261px', height: isOverflowing ? '218px' : '196px', mr: '24px', }}>
                <img
                    src={bookingDetails.resource.images[0]}
                    alt="Event Image"
                    style={{ width: "100%", height: '100%', borderRadius: "8px" }} />
            </Box>


            <Box sx={{ width: 'calc(100% - 275px)' }} >
                {/* Title and location */}
                <Box display='flex' justifyContent='space-between' width='100%' >
                    <Box>
                        <Typography sx={{ fontWeight: '500', fontSize: '24px', lineHeight: '28px', color: ' #8D55A2' }}>{bookingDetails.name}</Typography>
                        <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556' }}>{bookingDetails.company?.name}</Typography>
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

                        {/* <MenuItem onClick={() => { dispatch(openEditEventDrawer(bookingDetails)); setAnchorEl(null) }} >Edit</MenuItem> */}
                        <MenuItem
                            onClick={() => {
                                setOpenDelete(true)
                                setBookingID(bookingDetails._id)
                                setAnchorEl(null)
                                // deleteEvent()
                            }}
                        >
                            Delete
                        </MenuItem>

                    </Menu >
                </Box>
                {/* Start Date , Duration , Hours */}
                <Box display='flex' justifyContent='space-between' width='100%' mt='8px'>
                    <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556' }}>Start date: {formatDate(bookingDetails.startTime)}</Typography>
                    <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556' }}>Duration : {calculateDuration(bookingDetails.startTime, bookingDetails.endTime)}</Typography>
                    <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556' }}>{formatDuration(bookingDetails.startTime, bookingDetails.endTime)}</Typography>
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
                        {bookingDetails.description}
                    </Typography>

                    {isOverflowing && (
                        <Typography onClick={handleReadMore} sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#8D55A2', cursor: 'pointer' }}>
                            {showFullText ? 'Read Less' : '...Read More'}
                        </Typography>
                    )}

                </Box>
                {/* Seats Left, Image Group, View All */}
                <Box display='flex' justifyContent='flex-end' alignItems='center' width='100%' mb='20px' sx={{ mt: isOverflowing ? '0px' : '8px' }}>


                    <Box display='flex' alignItems='center'>
                        <AvatarGroup sx={{
                            mr: '10px',
                            "& .MuiAvatarGroup-more": { display: 'none' }
                        }}>
                            {avatars.map((value, index) => (
                                index < 4 ? (
                                    <Avatar
                                        key={index}
                                        sx={{ width: '40px', height: '40px' }}
                                        alt="Name"
                                        src={value.profilePicture}
                                    />
                                ) : null
                            ))}
                        </AvatarGroup>
                        <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556', mr: '10px' }}>
                            {((bookingDetails.attendees.length + bookingDetails.visitors.length) > 4 ? `+${((parseInt(bookingDetails.attendees.length) + parseInt(bookingDetails.visitors.length)) - 4)}` : '')}
                        </Typography>

                        <Typography onClick={() => dispatch(openUsersList({ attendees: bookingDetails.attendees, visitors: bookingDetails.visitors }))} sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#8D55A2', width: '65px', cursor: 'pointer' }}>
                            {bookingDetails.attendees.length !== 0 && 'view all'}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Dialog
                open={openDelete}
                // TransitionComponent={Transition}
                keepMounted
                sx={{
                    '& .MuiPaper-root': {
                        width: '920px',
                        height: 'auto',
                        maxHeight: 'none',
                        maxWidth: 'none',
                        overflow: 'unset'
                    }
                }}

            >
                <DeleteModal id={bookingId} closeModal={() => { setOpenDelete(false) }} refetchData={() => { reloadData() }} />
            </Dialog>


        </Box >


    )
}

export default BooikingDetails