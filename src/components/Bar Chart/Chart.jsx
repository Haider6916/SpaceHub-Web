
import { Box, Tooltip, Typography } from '@mui/material';
import React from 'react'

const data = [200, 20, 30, 40, 100, 50, 80]
const time = ['1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM']

const maxVal = Math.max(...data);

function Chart() {

    return (
        <Box>

            <Box
                sx={{
                    transform: 'rotateX(180deg) scaleX(1) scaleY(1)',
                    marginTop: '48px',
                    marginLeft: '35px',
                    display: 'flex'
                }}
            >
                {
                    data.map((value, index) => (
                        <Box>
                            <Box sx={{ display: 'flex' }}>
                                {/* Actual Bar */}
                                <Tooltip
                                    title={
                                        <Box sx={{ backgroundColor: '#272627', width: '58px', height: '38px', boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.14)', borderRadius: '5px', padding: '0px', margin: '-10px -10px' }}>
                                            <Typography sx={{
                                                fontFamily: 'Poppins',
                                                fontStyle: 'normal',
                                                fontWeight: '700',
                                                fontSize: '10px',
                                                lineHeight: '15px',
                                                marginTop: '2px',
                                                marginLeft: '8px'
                                            }}>
                                                {time[index]}
                                            </Typography>

                                            <Box sx={{ display: 'flex' }}>
                                                <Box sx={{
                                                    marginTop: '10px',
                                                    marginLeft: '8px',
                                                    width: '6px',
                                                    height: '6px',
                                                    backgroundColor: '#8D55A2',
                                                    borderRadius: '100%'
                                                }}> </Box>
                                                <Typography sx={{
                                                    marginLeft: '3px',
                                                    marginTop: '5px',
                                                    fontFamily: 'Poppins',
                                                    fontStyle: 'normal',
                                                    fontWeight: '700',
                                                    fontSize: '10px',
                                                    lineHeight: '15px',
                                                }}> {value}</Typography>
                                            </Box>
                                        </Box>
                                    }
                                    PopperProps={{
                                        modifiers: [
                                            {
                                                name: "offset",
                                                options: {
                                                    offset: [30, -30],
                                                },
                                            },
                                        ],

                                    }}
                                    placement="top"
                                    centered
                                >
                                    <Box
                                        key={index}
                                        sx={{
                                            height: `${(value / maxVal) * 198}px`,
                                            width: '28px',
                                            display: 'inline-block',
                                            backgroundColor: '#D5BFDE',
                                            borderRadius: '4px',
                                            marginRight: '18px',
                                            '&:hover': { backgroundColor: '#8D55A2' } // change hover color to a darker purple
                                        }}
                                    >
                                    </Box>
                                </Tooltip>
                                {/* Line after bar */}
                                {index !== (data.length - 1) && (
                                    <Box sx={{ height: '198px', width: '1px', backgroundColor: '#7D7B7C', opacity: 0.2, marginRight: '18px' }}> </Box>
                                )
                                }
                            </Box>
                        </Box>
                    ))
                }
            </Box>
            <Box sx={{ display: 'flex', marginLeft: '35px', marginTop: '7px' }}>
                {time.map((value, index) => (
                    <Typography
                        key={index}
                        sx={{
                            color: '#7D7B7C',
                            marginRight: index !== (time.length - 1) ? '33.17px' : '0px',
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: '14px',
                            lineHeight: '21px',
                        }}
                    >
                        {value}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
}

export default Chart