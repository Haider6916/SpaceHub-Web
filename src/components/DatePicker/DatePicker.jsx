import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'react-date-range';
import format from 'date-fns/format';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { InputAdornment, TextField } from '@mui/material';
import { ReactComponent as CalendarIcon } from '../../Assets/SVGs/Calendar.svg';

import './DatePicker.css'

function DatePicker(props) {

    const [calendar, setCalendar] = useState('');
    const [shownDate, setShownDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const refOne = useRef(null);

    var minDate = new Date();
    props.dateType === 'End' ? minDate = new Date(props.dateLimit)
        : minDate.setMonth(minDate.getMonth() - 1);



    useEffect(() => {
        document.addEventListener("click", hideOnClickOutside, true)
        // setCalendar(format(new Date(), 'yyyy-MM-dd'))
        props.handleDate(format(new Date(), 'yyyy-MM-dd'))
        // eslint-disable-next-line
    }, [])


    const handleSelect = (date) => {
        setCalendar(format(date, 'yyyy-MM-dd'))
        setShownDate(date)
        props.handleDate(format(date, 'yyyy-MM-dd'))
    }

    const hideOnClickOutside = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setOpen(false)
        }
    }

    return (
        <>

            <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                <TextField
                    id="dateDisplay"
                    value={calendar}
                    placeholder={props.placeholder}
                    // size="small"
                    InputProps={{
                        readOnly: true,

                        endAdornment: (
                            <InputAdornment position="end">
                                < CalendarIcon />
                            </InputAdornment>
                        ),
                    }}
                    // onChange={(e) => setCalendar(e.target.value)}
                    onClick={() => setOpen(!open)}
                    sx={{
                        '& .MuiInputBase-root': {
                            height: '56px',
                            fontSize: '16px',
                            fontFamily: "'DM Sans', sans-serif ",
                            lineHeight: '28px',
                            color: '#7D7B7C',
                            borderRadius: '8px',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #F5F6F4', // set the border width when the input is focused
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #F5F6F4', // remove the border by default
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: '0px solid #F5F6F4', // set the border width on hover
                        },
                        width: '261px',
                        backgroundColor: '#FAFAFA',
                        borderRadius: '8px',
                    }}


                />
            </div>


            <div ref={refOne} style={{ display: 'flex', justifyContent: 'center', background: '#FAFAFA', width: "261px", marginTop: "10px" }} >
                {open &&
                    <Calendar
                        date={shownDate}
                        className='calendarElement'
                        onChange={handleSelect}
                        minDate={minDate}
                        maxDate={new Date()}
                        color="#8D55A2" // Set the color for the hover date
                        colorPrimary="#8D55A2"
                    />
                }

            </div>
        </ >
    )
}

export default DatePicker