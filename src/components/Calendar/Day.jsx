import { Box, Chip, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import VerticallyStackedCards from "./VerticallyStackedCards";

export default function Day({ day, Events, Tasks, Bookings }) {


  const monthNumber = useSelector((state) => state.calendar.monthNumber)
  const [paddedMonthNumber, setPaddedMonthNumber] = useState('');

  const [dayEvents, setDayEvents] = useState([1])
  const [dataUpdated, setDataUpdated] = useState(false)


  const [matchedEvents, setMatchedEvents] = useState([])

  const boxRef = useRef(null);

  // useEffect(() => {
  //   setDataUpdated(true)
  // }, [calendarData])

  useEffect(() => {
    let newMonthNumber = monthNumber % 12 + 1
    setPaddedMonthNumber(String(newMonthNumber).padStart(2, '0'))
  }, [monthNumber])

  useEffect(() => {

    // const combinedData = [...Events, ...Bookings, ...Tasks]

    const adjustedEvents = [];

    Events.forEach(event => {
      const eventStartDate = dayjs(event.startDate);
      const eventEndDate = dayjs(event.endDate);
      if (eventEndDate.diff(eventStartDate, 'day') > 0) {
        // Event spans multiple days, create copies with adjusted dates
        let currentDay = eventStartDate;
        let count = 1;
        while (eventEndDate.diff(currentDay, 'day') >= 0) {
          // console.log("count", count);
          count++;
          const adjustedEvent = {
            ...event,
            startDate: currentDay.toISOString(),
            // startTime: currentDay.toISOString(),
            // endTime: event.endTime,
          };
          adjustedEvents.push(adjustedEvent);
          currentDay = currentDay.add(1, 'day');
        }
      } else {
        adjustedEvents.push(event);
      }
    });

    const matchingDateEvents = adjustedEvents.filter(event => {
      const eventStartDate = dayjs(event.startDate);
      const formattedDate = eventStartDate.format("DD-MM-YY");
      return formattedDate === day.format("DD-MM-YY");
    });

    const matchingDateBookings = Bookings.filter(booking => {
      const bookingStartTime = dayjs(booking.startTime);
      const formattedDate = bookingStartTime.format("DD-MM-YY");
      return formattedDate === day.format("DD-MM-YY");
    });

    const matchingDateTasks = Tasks.filter(task => {
      const taskStartDate = dayjs(task.startDate);
      const formattedDate = taskStartDate.format("DD-MM-YY");
      return formattedDate === day.format("DD-MM-YY");
    });


    const combinedData = [...matchingDateEvents, ...matchingDateBookings, ...matchingDateTasks]

    setMatchedEvents(combinedData)

  }, [day, Events, Tasks, Bookings])



  return (
    <>
      <Box ref={boxRef} sx={{
        border: '1px solid #E9EAE9', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '138.779px', width: '100%', padding: '10px 15px',
      }}>

        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: paddedMonthNumber == day.format("MM") ? 'normal' : 'lighter',
              lineHeight: '28px',
              textAlign: 'center',
              width: 'auto',
              height: day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") && '28px',
              backgroundColor: day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? '#8D55A2' : 'transparent',
              color: day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? '#F5F6F4'
                : day.format("MM") === paddedMonthNumber ? '#565556'
                  : '#9F9D9E',
              borderRadius: day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? '4px' : '0px',
              padding: day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") && '1px 8px',
            }}
          >
            {
              day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
                ? `${day.format("DD")} Today`
                : day.format("DD") === '01'
                  ? `${day.format("MMM").toUpperCase()} ${day.format("DD")}`
                  : `${day.format("DD")}`
            }
          </Typography>
        </div >

        <Box sx={{ flex: '1', pointer: 'cursor', mt: '5px', width: '100%', position: 'relative', overflow: 'auto' }}>
          {dayEvents.map((evt, idx) => (
            <VerticallyStackedCards eventsArray={matchedEvents} />
          ))}
        </Box>
      </Box >
    </>
  );
}
