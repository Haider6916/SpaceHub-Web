import { Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import dayjs from "dayjs";
import { useSelector } from 'react-redux';
import { getMonth } from '../../Utils/util';
function WeekHeader(props) {

    const [specficRow, setSpecficRow] = useState([])
    const weekNumber = useSelector((state) => state.calendar.weekNumber)
    const monthNumber = useSelector((state) => state.calendar.monthNumber)

    useEffect(() => {

        setSpecficRow(getMonth(monthNumber)[weekNumber])
    }, [weekNumber])


    return (
        <div style={{ marginLeft: '-15px' }}>
            <Grid container sx={{ width: "100%", mt: "18px", }}>
                <Grid item xs={0.6}></Grid>
                {specficRow.map((day) => (
                    <Grid
                        key={day}
                        item
                        xs={1.6285714285714286}
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        < Typography sx={{ color: '#9F9D9E', fontWeight: "400", lineHeight: '28px', }}>
                            {day.format("ddd").toUpperCase()}
                        </Typography>

                    </Grid>
                )

                )
                }
            </Grid >
            <Grid container>
                <Grid item xs={0.6}></Grid>
                {
                    specficRow.map((date) => (
                        <Grid key={date} item xs={1.6285714285714286} sx={{ display: 'flex', justifyContent: 'center', }}>
                            <Typography
                                sx={{

                                    backgroundColor: date.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? '#A070B2' : 'transparent',
                                    color: date.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? '#FFF' : '#565556',
                                    borderRadius: date.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? '999999px' : '0px',
                                    padding: date.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? '10px 8px' : '0px',
                                    fontSize: '22px',
                                    width: 'auto',
                                    fontWeight: 500,
                                    lineHeight: '28px'

                                }}
                            >
                                {date.format("DD")}
                            </Typography>
                        </Grid>
                    ))
                }

            </Grid >
        </div>
    )
}

export default WeekHeader