import React, { useState } from 'react';
// import './SliderCarousel.css'
import { Box, ClickAwayListener, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { openBookingModal, openEventModal, openTaskModal, setModalID } from '../../Redux/calendarSlice';
const VerticallyStackedCards = ({ eventsArray }) => {
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
            setActiveCard((prev) => (prev === null ? 0 : prev < eventsArray.length - 1 ? prev + 1 : prev));
        }
    };

    console.log('eventsArray', eventsArray);

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
        <div >
            <ClickAwayListener onClickAway={() => { setActiveCard(null) }}>
                <div style={{ display: 'flex', position: 'relative', width: '100%', maxHeight: '100px', minHeight: '100px', overflowY: 'auto', }}>
                    {eventsArray.map((item, index) => {

                        return <Box
                            key={index}
                            sx={{
                                // height: "54px",
                                // maxHeight: `calc((100% / ${arrayLength})`,
                                // minHeight: `calc((100% / ${arrayLength - 1})  )`,
                                minHeight: "54px",
                                width: `100%`,
                                // width: `calc(100% / ${arrayLength})`,
                                // top: `calc(${index} * 3px - ${index} * 10px)`,
                                // top: `${Math.min((arrayLength - index) * 3, 100 - 56)}px`,
                                // top: `${Math.min(index * 8, (arrayLength - 1) * 8)}px`,
                                top: eventsArray.length === 2 ? `${index * 30}px` : `${(index * (100 - 56)) / (eventsArray.length - 1)}px`,
                                position: 'absolute',
                                // zIndex: index === activeCard ? '3' : index === (activeCard + 1) ? '2' : '1',
                                zIndex: index === activeCard ? '3' : '2',
                                transform: index === activeCard ? 'scale(0.81) translateY(0) translateX(-15px)' : 'scale(0.8) translateY(0) translateX(0)',
                                cursor: 'pointer',
                                pointerEvents: 'auto',
                                background: item.colorCode?.backgroundColor ? item.colorCode.backgroundColor : '#EEE5F1',
                                // transition: '0.5s',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'black',
                                fontWeight: '400',
                                flexWrap: 'auto',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid white',
                                '&::before': {
                                    content: '""', //Empty string
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    width: '6px',
                                    backgroundColor: item.colorCode?.borderColor ? item.colorCode.borderColor : '#8D55A2',
                                    borderRadius: '8px',
                                },
                            }}
                            onClick={() => {
                                handleCardClick(index)
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
                                <Typography> {item.title ? item.title : item.name ? item.name : item.taskName}</Typography>
                                <Typography> {item.startDate ? formatDate(item.startDate) : convertToStartTime(item.startTime)} </Typography>
                            </Box>

                        </Box>
                    })}
                </div>
            </ClickAwayListener>
        </div >
    );
};

export default VerticallyStackedCards;