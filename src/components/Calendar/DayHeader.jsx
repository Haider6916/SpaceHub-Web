import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import dayjs from "dayjs";
import { useSelector } from 'react-redux';
import { getMonth } from '../../Utils/util';
function DayHeader() {

    const [daysArray, setDaysArray] = useState([])
    const monthNumber = useSelector((state) => state.calendar.monthNumber)
    const dayNumber = useSelector((state) => state.calendar.dayNumber)


    const makeFlatArray = async () => {
        let tempArray = getMonth(monthNumber).flat()
        setDaysArray(tempArray)
    }
    useEffect(() => {
        makeFlatArray()
    }, [monthNumber])

    if (daysArray.length !== getMonth(monthNumber).flat().length) {
        return <div></div>
    }

    return (
        <Box mt='15px' ml='45px' width='100px' mb='10px'>

            < Typography sx={{ color: '#9F9D9E', fontWeight: "400", lineHeight: '28px', mb: '2px' }}>
                {daysArray[dayNumber].format("ddd").toUpperCase()}
            </Typography>

            <Typography
                sx={{

                    color: '#565556',
                    fontSize: '22px',
                    width: 'auto',
                    fontWeight: 500,
                    lineHeight: '28px'

                }}
            >
                {daysArray[dayNumber].format("DD")}
            </Typography>


        </Box >
    )
}

export default DayHeader