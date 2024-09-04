import { Box, Chip, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'



function AnnouncementCard(props) {

    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [day, setDay] = useState('')

    const calculateDate = () => {
        const dateParts = props.createdAt.split("T")[0].split("-");
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        const formattedDate = `${day}/${month}/${year}`;
        setDate(formattedDate)
    }

    const calculateTime = () => {

    }

    const calculateDay = () => {

    }
    useEffect(() => {
        calculateDay()
        calculateTime()
        calculateDate()
    }, [])

    return (
        <Box sx={{ height: '124px', display: "flex", alignItems: 'center', }}>
            <Box>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '18px', lineHeight: '28px', color: '#565556' }}>Today</Typography>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '18px', lineHeight: '28px', color: '#565556', marginTop: '4px' }}>{date}</Typography>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '18px', lineHeight: '28px', color: '#565556', marginTop: '4px' }}>24 hrs ago</Typography>
            </Box>



            <Box sx={{ backgroundColor: '#E9EAE9', height: '124px', width: '2px', marginLeft: '24px' }}></Box>

            <Box sx={{ marginLeft: '24px' }}>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '20px', lineHeight: '28px', color: '#272627' }}>{props.title}</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    {props.tags.map((value, index) => (
                        <Chip
                            label={value}
                            sx={{
                                backgroundColor: '#EAE8E9',
                                color: '#565556',
                                fontWeight: '400',
                                fontSize: '16px',
                                lineHeight: '28px',
                                margin: '4px 0px 4px 0px',
                            }}
                            key={index}
                        />
                    ))}
                </Stack>
                <Typography
                    sx={{
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: '18px',
                        lineHeight: '28px',
                        color: '#565556',
                        marginTop: '8px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        '-webkit-line-clamp': '2',
                        '-webkit-box-orient': 'vertical',
                        width: '782px',
                    }}
                >
                    {props.description}
                </Typography>

            </Box>
        </Box >
    )
}

export default AnnouncementCard