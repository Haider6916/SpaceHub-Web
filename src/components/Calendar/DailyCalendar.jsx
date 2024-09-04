import { Typography } from '@mui/material';
import { daysInWeek } from 'date-fns';
import React, { useEffect, useState } from 'react';


const timeSlots = [
    'GMT', '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM',
];
const days = [
    '03-07-23', '03-08-23', '03-09-23', '03-10-23', '03-11-23', '03-12-23', '03-13-23',
];

const events = [
    {
        time: '4 AM',
        day: '03-07-23',
        startTime: '4 AM',
        endTime: '6 AM',
        title: 'Event 1',
        backgroundColor: '#FFC0CB', // Example background color (pink)
    },
    {
        time: '2 AM',
        day: '03-10-23',
        startTime: '2 AM',
        endTime: '4 AM',
        title: 'Event 2',
        backgroundColor: '#87CEEB', // Example background color (sky blue)
    },
    // Add more event data here...
];


const DailyCalendar = () => {


    const [skippedSlots, setSkippedSLots] = useState([])
    // Sample event data

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
            (event) => event.day === day && event.startTime === time
        )

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
            { time: '3 AM' },
            // { time: '4 AM'},
            { time: '5 AM' },
            // { time: '6 AM'},
        ]);
    }, []);




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
                {/* <table style={{ borderSpacing: 0, width: '100%', tableLayout: 'fixed' }}>
                    {timeSlots.map((time, rowIndex) => {
                        const { rowSpan, colSpan, backgroundColor } = getEventCellAttributes(time);
                        const shouldRenderCell = !skippedSlots.some(
                            (value) => time === value.time
                        );
                        // const shouldRenderCell = true
                        console.log('rowSpan', rowSpan);
                        return (
                            <tr key={time} style={{ width: '100%' }}>
                                {shouldRenderCell ?
                                    <td
                                        rowSpan={rowSpan}
                                        colSpan={colSpan}
                                        style={{
                                            width: '100%',
                                            borderColor: '#DBDBDA',
                                            borderStyle: 'solid',
                                            borderWidth: rowIndex === 0 ? '0px 2px 1px 2px' : rowIndex === timeSlots.length - 1 ? '1px 2px 2px 2px' : '1px 2px 1px 2px',
                                            height: '56px',
                                            textAlign: 'center',
                                            verticalAlign: 'middle',
                                            boxSizing: 'border-box',
                                            background: backgroundColor,
                                        }}
                                    >
                                        {time}
                                    </td>
                                    : null
                                }
                            </tr>
                        );
                    })}
                </table> */}
                <table>
                    <tr >
                        <td style={{ border: "1px solid black" }}>1</td>
                    </tr>
                    <tr >
                        <td rowSpan={2} style={{ border: "1px solid red" }}>2</td>
                    </tr>
                    <tr >
                        <td style={{ border: "1px solid blue" }}>3</td>
                    </tr>
                </table>


            </div>
        </div >
    );
};

export default DailyCalendar;