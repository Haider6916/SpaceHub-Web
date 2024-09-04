import { Typography } from '@mui/material';
import { daysInWeek, } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import HorizantalStackedCards from './HorizantalStackedCards';
import DailyStackedCards from './DailyStackedCards';
import { useSelector } from 'react-redux';
import { getMonth } from '../../Utils/util';
import { privateRequest } from '../../ApiMethods';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';


const timeSlots = [
    'GMT', '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM',
];

const WeeklyCalendar = () => {


    const [skippedSlots, setSkippedSlots] = useState([])
    const [days, setDays] = useState([])
    const [Tasks, setTasks] = useState([]);
    const [Events, setEvents] = useState([]);
    const [Bookings, setBookings] = useState([]);
    const weekNumber = useSelector((state) => state.calendar.weekNumber)
    const monthNumber = useSelector((state) => state.calendar.monthNumber)

    useEffect(() => {
        const weekDateObjectArray = getMonth(monthNumber)[weekNumber];
        const tempArray = weekDateObjectArray.map(date => date.format("DD-MM-YY"));
        setDays(tempArray);
    }, [monthNumber, weekNumber]);

    const fetchCalendarDetails = () => {
        let startDate = getMonth(monthNumber)[weekNumber][0].format("YYYY-MM-DD");
        let endDate = getMonth(monthNumber)[weekNumber][6].format("YYYY-MM-DD");
        privateRequest.get(`calendar?startDate=${startDate}&endDate=${endDate}`)
            .then((response) => {
                // setTasks(response.data.data.tasks)
                setBookings(response.data.data.bookings)

                const adjustedEvents = [];
                const adjustedTasks = [];

                response.data.data.events.forEach(event => {
                    const eventStartDate = dayjs(event.startDate);
                    const eventEndDate = dayjs(event.endDate);

                    if (eventEndDate.diff(eventStartDate, 'day') > 0) {
                        let currentDay = eventStartDate;

                        while (eventEndDate.diff(currentDay, 'day') >= 0) {
                            const adjustedEvent = {
                                ...event,
                                startDate: currentDay.toISOString(),
                            };
                            adjustedEvents.push(adjustedEvent);
                            currentDay = currentDay.add(1, 'day');
                        }
                    } else {
                        adjustedEvents.push(event);
                    }
                });

                response.data.data.tasks.forEach(task => {
                    const taskStartDate = dayjs(task.startDate);
                    const taskEndDate = dayjs(task.dueDate);

                    if (taskEndDate.diff(taskStartDate, 'day') > 0) {
                        let currentDay = taskStartDate;

                        while (taskEndDate.diff(currentDay, 'day') >= 0) {
                            const adjustedTask = {
                                ...task,
                                startDate: currentDay.toISOString(),
                            };
                            adjustedTasks.push(adjustedTask);
                            currentDay = currentDay.add(1, 'day');
                        }
                    } else {
                        adjustedTasks.push(task);
                    }
                });

                console.log('adjusted tasks', adjustedTasks);
                setEvents(adjustedEvents)
                setTasks(adjustedTasks)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message)
            })
    }


    useEffect(() => {
        fetchCalendarDetails()
    }, [days])


    // const convertTimeToNumber = (time = '12 PM') => {
    const convertTimeToNumber = (time) => {
        const hour = parseInt(time?.split(' ')[0]);
        if (time.endsWith('PM') && hour !== 12) {
            return hour + 12;
        }
        return hour;
    };

    //Event Dhas ho raha ay
    // const EventTimeConverter = (time = '00:00:00.000+00:00') => {
    const EventTimeConverter = (time) => {
        const startTimeParts = time?.split(":");
        const hours = parseInt(startTimeParts[0]);
        const minutes = parseInt(startTimeParts[1]);
        const timeSlot = timeSlots[hours];
        return timeSlot
    }


    const BookingTimeConverter = (time) => {
        const eventTime = new Date(time);
        const eventHours = eventTime.getUTCHours();
        const eventMinutes = eventTime.getUTCMinutes();

        const timeSlot = timeSlots[eventHours + 1];
        return timeSlot
    }

    const getEventCellAttributes = useCallback((day, time) => {
        const matchingDateEvents = Events.filter(event => {
            const eventStartDate = dayjs(event.startDate);
            const formattedDate = eventStartDate.format("DD-MM-YY");
            return formattedDate === day && EventTimeConverter(event.startTime) === time;
        });

        const matchingDateBookings = Bookings.filter(booking => {
            const bookingStartTime = dayjs(booking.startTime);
            const formattedDate = bookingStartTime.format("DD-MM-YY");
            return formattedDate === day && BookingTimeConverter(booking.startTime) === time;
        });

        const mergedItems = [...matchingDateEvents, ...matchingDateBookings]

        if (mergedItems.length > 0 || Tasks.length > 0) {
            const finalMergedObj = {
                colSpan: 1,
                rowSpan: 1,
                backgroundColor: 'transparent',
                events: mergedItems, // Array of filtered events
            };

            let maxRowSpan = 1;
            let maxColSpan = 1;

            for (const event of mergedItems) {
                let eventStartHour;
                let eventEndHour;
                if (event.title) {
                    eventStartHour = convertTimeToNumber(EventTimeConverter(event.startTime));
                    eventEndHour = convertTimeToNumber(EventTimeConverter(event.endTime));
                } else {
                    eventStartHour = convertTimeToNumber(BookingTimeConverter(event.startTime));
                    eventEndHour = convertTimeToNumber(BookingTimeConverter(event.endTime));
                }

                if ((eventEndHour - eventStartHour) > maxRowSpan) {
                    maxRowSpan = eventEndHour - eventStartHour;
                }

                // if (maxColSpan < mergedItems.length) {
                //     maxColSpan = mergedItems.length;
                // }
            }


            const matchingDateTask = Tasks.filter(event => {
                const eventStartDate = dayjs(event.startDate);
                const formattedDate = eventStartDate.format("DD-MM-YY");
                return formattedDate === day && time === 'GMT';
            });

            let newTempArray = [...finalMergedObj.events];
            matchingDateTask.forEach(event => {
                newTempArray.push(event);
            })

            finalMergedObj.events = newTempArray

            finalMergedObj.rowSpan = maxRowSpan;
            finalMergedObj.colSpan = maxColSpan;

            return finalMergedObj;
        }

        return {
            colSpan: 1,
            rowSpan: 1,
            backgroundColor: 'transparent',
            events: [],
        };
    }, [Events, Bookings, Tasks, weekNumber]);

    useEffect(() => {
        const newSkippedSlots = [];
        const tempArray = [...Events, ...Bookings]

        tempArray.forEach(event => {
            let eventStartHour;
            let eventEndHour;
            let formattedStartDate;


            if (event.title) {

                eventStartHour = convertTimeToNumber(EventTimeConverter(event.startTime));
                eventEndHour = convertTimeToNumber(EventTimeConverter(event.endTime));
                const eventStartDate = dayjs(event.startDate);
                formattedStartDate = eventStartDate.format("DD-MM-YY");
            } else {
                eventStartHour = convertTimeToNumber(BookingTimeConverter(event.startTime));
                eventEndHour = convertTimeToNumber(BookingTimeConverter(event.endTime));
                const bookingStartTime = dayjs(event.startTime);
                formattedStartDate = bookingStartTime.format("DD-MM-YY");
            }

            for (let i = eventStartHour + 2; i <= eventEndHour; i++) {
                newSkippedSlots.push({ time: timeSlots[i], day: formattedStartDate });
            }
        });
        setSkippedSlots(newSkippedSlots);
    }, [Events, Bookings, weekNumber]);

    return (

        <div style={{ display: 'flex', width: '100%', overflow: 'auto', marginLeft: '-10px' }}>

            <div style={{ width: '70px' }}>
                {timeSlots.map((time, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex', justifyContent: "flex-end", height: '56px' }}>
                        <Typography sx={{ fontSize: '10px', color: '#7D7B7C', mt: rowIndex === 0 ? '0px' : '-8px', mr: '4.03px' }}>
                            {time}
                        </Typography>
                        <div style={{ width: '5px', height: '1.5px', backgroundColor: rowIndex !== 0 ? '#DBDBDA' : 'transparent', marginTop: '-1px' }} />

                    </div>
                ))}
            </div>
            <div style={{ width: 'calc(100% - 70px)' }}>
                {/* <table style={{ borderCollapse: 'collapse', border: '0px solid #DBDBDA', width: '100%', tableLayout: 'fixed', overflow: 'auto' }}> */}
                <table style={{ borderSpacing: 0, width: '100%', tableLayout: 'fixed' }}>
                    {/* <table style={{ borderCollapse: 'collapse', border: '0px solid #DBDBDA', width: '90%', }}> */}

                    {timeSlots.map((time, rowIndex) => (
                        <tr key={time} style={{ width: '100%' }}>
                            {days.map((day, colIndex) => {
                                const eventCellAttributes = getEventCellAttributes(day, time);
                                const { colSpan, rowSpan, backgroundColor, events } = eventCellAttributes;
                                const shouldRenderCell = !skippedSlots.some(
                                    (value) => value.day === day && time === value.time
                                );

                                return shouldRenderCell ? (
                                    <td
                                        key={`${rowIndex}-${colIndex}`}
                                        rowSpan={rowSpan}
                                        colSpan={colSpan}
                                        style={{
                                            minWidth: 'calc(100%/7)',
                                            borderColor: '#DBDBDA',
                                            borderStyle: 'solid',
                                            borderWidth: rowIndex === 0 && colIndex === 0
                                                ? '0px 1px 1px 2px'
                                                : rowIndex === 0 && colIndex === days.length - 1
                                                    ? '0px 2px 1px 1px'
                                                    : rowIndex === 0
                                                        ? '0px 1px 1px 1px'
                                                        : colIndex === 0
                                                            ? '1px 1px 1px 2px'
                                                            : colIndex === days.length - 1
                                                                ? '1px 2px 1px 1px'
                                                                : '1px 1px 1px 1px',
                                            // backgroundColor: backgroundColor,
                                            height: '56px',
                                            textAlign: 'center',
                                            verticalAlign: 'middle',
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        {/* <HorizantallyStackedCards /> */}
                                        {events.length !== 0 && <HorizantalStackedCards calendarItems={events} />}
                                        {/* {events.length !== 0 ? <DailyStackedCards calendarItems={events} /> : 'No Event'} */}
                                    </td>
                                )
                                    : null

                            })}
                        </tr>
                    ))}
                </table >
            </div>
        </div >
    );
};

export default WeeklyCalendar;