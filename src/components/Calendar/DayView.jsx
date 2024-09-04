import React, { useEffect, useState } from 'react'
import dayjs from "dayjs";
import { Box, Grid, Paper, Typography } from '@mui/material';
import HorizantallyStackedCards from './HorizantalStackedCards';
import DailyStackedCards from './DailyStackedCards';

const events = [
    {
        time: '4 AM',
        day: '03-10-23',
        startTime: '4 AM',
        endTime: '5 AM',
        title: 'Event 1',
        backgroundColor: '#FFC0CB', // Example background color (pink)
    },
    {
        time: '5 AM',
        day: '03-10-23',
        startTime: '7 AM',
        endTime: '8 AM',
        title: 'Event 2',
        backgroundColor: '#87CEEB', // Example background color (sky blue)
    },
    {
        time: '2 AM',
        day: '03-10-23',
        startTime: '1 PM',
        endTime: '2 PM',
        title: 'Event 2',
        backgroundColor: '#87CEEB', // Example background color (sky blue)
    },
    // Add more event data here...
];

function DayView() {
    const timeSlots = ['GMT', '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM',]

    const [specficRow, setSpecficRow] = useState(["02-07-23", "03-07-23", "07-07-23", "05-07-23", "06-07-23", "07-07-23", "08-07-23"])

    const [skippedSlots, setSkippedSLots] = useState([])

    const convertTimeToNumber = (time) => {
        // Convert time strings like '4 AM' to corresponding integer values like 4
        const hour = parseInt(time.split(' ')[0]);
        if (time.endsWith('PM') && hour !== 12) {
            return hour + 12;
        }
        return hour;
    };

    const getEventCellAttributes = (time) => {
        const day = '03-10-23';
        const specificEvents = events.filter(
            (event) => event.startTime === time
        )

        // console.log('specificEvents', specificEvents.length);

        if (specificEvents.length > 0) {

            const mergedEvent = {
                colSpan: 1,
                rowSpan: 1,
                backgroundColor: specificEvents[0].backgroundColor,
                title: specificEvents.map((event) => event.title).join(', '), // Merge titles of multiple events
            };

            // Calculate rowSpan for the merged event
            const startHour = convertTimeToNumber(specificEvents[0].startTime);
            const endHour = convertTimeToNumber(specificEvents[0].endTime);



            for (let i = 1; i < specificEvents.length; i++) {
                const eventStartHour = convertTimeToNumber(specificEvents[i].startTime);
                const eventEndHour = convertTimeToNumber(specificEvents[i].endTime);
                if (eventStartHour < startHour) startHour = eventStartHour;
                if (eventEndHour > endHour) endHour = eventEndHour;
            }

            // console.log('endHour', endHour);
            // console.log('startHour', startHour);
            mergedEvent.rowSpan = ((endHour - startHour));



            return mergedEvent;
        }


        return {
            colSpan: 1,
            rowSpan: 1,
            backgroundColor: 'transparent',
            title: '',
        };
    };

    useEffect(() => {
        setSkippedSLots([
            // { time: '3 AM' },
            // // { time: '4 AM'},
            // { time: '5 AM' },
            // { time: '6 AM'},
        ]);
    }, []);

    return (
        <>





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
                    {timeSlots.map((time, rowIndex) => {

                        const { backgroundColor, rowSpan, title } = getEventCellAttributes(time);
                        const shouldRenderCell = !skippedSlots.some(
                            (value) => time === value.time
                        );
                        // console.log('rowSpan', rowSpan);
                        return (
                            <>
                                {
                                    shouldRenderCell ? <Grid container item key={rowIndex} width='100%'>
                                        <Grid Grid item xs={12} >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: "flex-start",
                                                width: "100%",
                                                // background: backgroundColor,
                                                borderColor: '#DBDBDA',
                                                borderStyle: 'solid',
                                                borderWidth: rowIndex === 0 ? '0px 2px 1px 2px' : rowIndex === timeSlots.length - 1 ? '1px 2px 2px 2px' : '1px 2px 1px 2px',
                                                height: `calc(56px * ${rowSpan})`
                                            }}>
                                                {title === '' ? title : <DailyStackedCards />}
                                            </div>
                                        </Grid>
                                    </Grid >
                                        : null
                                }
                            </>
                        )
                    })
                    }
                </div >
            </div >
        </>
    )
}

export default DayView