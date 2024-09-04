import React, { useState } from 'react';
import { Box, ClickAwayListener, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { openBookingModal, openEventModal, openTaskModal, setModalID } from '../../Redux/calendarSlice';

const HorizontalStackedCards = ({ calendarItems }) => {

    // console.log('calendarItems', calendarItems);

    const dispatch = useDispatch()
    const [activeCard, setActiveCard] = useState(null);

    const handleCardClick = (index) => {
        setActiveCard(index);
    };

    const handleKeyPress = (e) => {
        if (e.keyCode === 37) {
            // Left arrow key
            setActiveCard((prev) => (prev === null ? 0 : prev > 0 ? prev - 1 : prev));

        } else if (e.keyCode === 39) {
            // Right arrow key
            setActiveCard((prev) => (prev === null ? 0 : prev < calendarItems.length - 1 ? prev + 1 : prev));
        }
    };

    // const calendarItems = [
    //     { backgroundColor: '#A8DADC', borderColor: '#63AAB6' },
    //     { backgroundColor: '#FFDDA1', borderColor: '#D4AF37' },
    //     { backgroundColor: '#54C6EB', borderColor: '#3498BA' },
    //     { backgroundColor: '#FF8E8A', borderColor: '#E5736E' },
    //     { backgroundColor: '#FFA07A', borderColor: '#E58559' },
    //     { backgroundColor: '#7FE6D3', borderColor: '#3FB9AF' },
    //     { backgroundColor: '#7AF0C3', borderColor: '#3AB39E' },
    //     { backgroundColor: '#FF6B6B', borderColor: '#C72C41' }, // Changed
    //     // { backgroundColor: '#76B4BD', borderColor: '#4F9098' },
    //     // { backgroundColor: '#FF8B6A', borderColor: '#F4694C' },// Changed
    //     // { backgroundColor: '#C6BEDA', borderColor: '#7D7093' },
    //     // { backgroundColor: '#D29DDE', borderColor: '#A452B8' },
    //     // { backgroundColor: '#79A8E9', borderColor: '#5489B1' },
    //     // { backgroundColor: '#E89282', borderColor: '#C55D4E' },
    //     // { backgroundColor: '#53D77A', borderColor: '#2DBD57' },
    // ];

    const formatDate = (utcDateString) => {
        const utcDate = new Date(utcDateString);

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = utcDate.toLocaleDateString(undefined, options);

        return formattedDate;
    };

    const convertToStartTime = (utcDateString) => {
        const utcDate = new Date(utcDateString);

        const hours = utcDate.getUTCHours();
        const minutes = utcDate.getUTCMinutes();

        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `Start Time: ${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    return (
        <ClickAwayListener onClickAway={() => { setActiveCard(null) }}>
            <div style={{ display: 'flex', position: 'relative', width: '100%', height: '50px', overflowX: 'auto' }}>
                {calendarItems.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: '80px',
                            height: '50px',
                            position: 'absolute',
                            left: `calc(${index} * (100% - 80px) / ${calendarItems.length - 1})`,
                            // background: '#EEE5F1',
                            background: item.colorCode?.backgroundColor ? item.colorCode.backgroundColor : '#EEE5F1',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            zIndex: index === activeCard ? '3' : '2',
                            transform: index === activeCard ? 'scale(0.9)' : 'scale(0.8)',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'black',
                            fontWeight: '400',
                            borderRadius: '8px',
                            transition: 'transform 1s',
                            border: '1px solid white',
                            '&::before': {
                                content: '""', //Empty string
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                width: '3px',
                                backgroundColor: item.colorCode?.borderColor ? item.colorCode.borderColor : '#8D55A2',
                                borderRadius: '8px',
                            },
                        }}
                        onClick={() => {
                            handleCardClick(index)
                            console.log('item._id', item);
                            dispatch(setModalID(item._id))
                            if (item.title) {
                                dispatch(openEventModal())
                            } else if (item.name) {
                                dispatch(openBookingModal())
                            } else {
                                dispatch(openTaskModal())
                            }
                        }}
                        tabIndex={0}
                        onKeyDown={handleKeyPress}
                    >
                        <Box>
                            {/* <Typography> {item.title ? item.title : item.name ? item.name : item.taskName}</Typography>
                        <Typography> {item.startDate ? formatDate(item.startDate) : convertToStartTime(item.startTime)} </Typography> */}
                            {item.title ? 'Event' : item.name ? 'Booking' : 'Task'}
                        </Box>
                    </Box>
                ))}
            </div>
        </ClickAwayListener>
    );
};

export default HorizontalStackedCards;
