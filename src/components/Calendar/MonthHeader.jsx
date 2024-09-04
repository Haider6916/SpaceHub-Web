import { Grid, Typography } from '@mui/material'
import React from 'react'

function MonthHeader({ month }) {
    return (

        <Grid container sx={{ width: "100%", mt: '9px', borderBottom: '1px solid #DBDBDA' }}>
            {month.map((row, i) => (
                row.map((day) => (
                    <Grid
                        item
                        xs={1.7142857142857142}
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        {i === 0 &&
                            <Typography sx={{ fontSize: '14px', color: '#9F9D9E', fontWeight: "400", lineHeight: '28px', }}>
                                {day.format("ddd").toUpperCase()}
                            </Typography>
                        }
                    </Grid>
                )
                )
            ))
            }
        </Grid >


    )
}

export default MonthHeader