import React, { useEffect, useState } from 'react'
import dayjs from "dayjs";
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getMonth } from '../../Utils/util';
function Week() {
    const time = ['GMT', '1 AM', ' 2 AM', ' 3 AM', ' 4 AM', ' 5 AM', ' 6 AM', ' 7 AM', ' 8 AM', ' 9 AM', ' 10 AM', ' 11 AM', ' 12 PM', '1 PM', '2 PM', ' 3 PM', ' 4 PM', ' 5 PM', ' 6 PM', ' 7 PM', ' 8 PM', ' 9 PM', ' 10 PM', ' 11 PM', ' 12 AM']

    const [specficRow, setSpecficRow] = useState([])
    const weekNumber = useSelector((state) => state.calendar.weekNumber)
    const monthNumber = useSelector((state) => state.calendar.monthNumber)

    useEffect(() => {

        const weekDateObjectArray = getMonth(monthNumber)[weekNumber]
        let tempArray = []
        weekDateObjectArray.atforEach((date) => {
            tempArray.push(date.format("DD-MM-YY"))
        })

        setSpecficRow(getMonth(monthNumber)[weekNumber])
    }, [weekNumber])

    // useEffect(() => {
    //     props.month.forEach((row, idx) => {
    //         row.forEach((date) => {
    //             if (date.format("DD-MM-YY") === dayjs().format("DD-MM-YY")) {
    //                 setRowIndex(idx)
    //             }
    //         })
    //     })
    // }, [])

    // useEffect(() => {
    //     if (typeof (rowIndex) !== 'undefined') {
    //         for (let i = 0; i < props.month[rowIndex].length; i++) {
    //             setSpecficRow(prevArray => [...prevArray, props.month[rowIndex][i].format("DD-MM-YY")]);
    //         }
    //     }
    // }, [rowIndex])

    return (
        <>


            {time.map((time, rowIndex) => (
                <Grid container item key={rowIndex}>

                    {/* Time label */}
                    <Grid item xs={0.5} >
                        <div style={{ display: 'flex', justifyContent: "flex-end", }}>
                            <Typography sx={{ fontSize: '10px', color: '#7D7B7C', mt: '-8px', mr: '4.03px' }}>
                                {time}
                            </Typography>
                            <div style={{ width: '5px', height: '1.5px', backgroundColor: rowIndex !== 0 ? '#DBDBDA' : 'transparent', marginTop: '-2px' }} />

                        </div>
                    </Grid>


                    {/* Cells */}
                    {specficRow.map((day, columnIndex) => (
                        <Grid
                            item xs={1.6285714285714286} key={columnIndex}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                borderColor: '#DBDBDA',
                                borderStyle: 'solid',
                                borderWidth:
                                    columnIndex === 0 ?
                                        '0px 1px 2px 2px' :
                                        columnIndex === specficRow.length - 1 ?
                                            '0px 2px 2px 1px' :
                                            '0px 1px 2px 1px',
                                minHeight: '56px',
                            }}
                        >
                            <Box>
                                <Box>
                                    {
                                        time === ' 4 AM' && day === '03-07-23' ? 'event 1' : ''
                                    }
                                </Box>
                            </Box>

                        </Grid>
                    ))}
                </Grid >
            ))
            }

        </>
    )
}

export default Week