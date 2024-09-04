import { Box, Button, Chip, Grid, Menu, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import Profile from '../../Assets/SVGs/Profile.png'
import { ReactComponent as MessagePurple } from '../../Assets/SVGs/MessagePurple.svg';
import { ReactComponent as Dots } from '../../Assets/SVGs/DotsThree.svg';
import './EmployeeCard.css'
function EmployeeCard(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <Grid container
            sx={{
                boxShadow: '0px 2px 8px rgba(2, 0, 1, 0.1)',
                padding: '16px 42px',
                width: '100%',
                height: '96px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #F5F6F4',
            }}
        >


            <Grid item xs={1}>
                <img
                    src={props.profileImage}
                    alt="Profile" style={{
                        width: '64px',
                        height: '64px',
                        border: '1px solid #9F9D9E',
                        borderRadius: '16px',
                    }} />
            </Grid>

            <Grid item xs={2.5} sx={{
                // marginLeft: '23px',
                marginTop: '6px'
            }}>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '18px', lineHeight: '24px', color: '#7C3F92' }}>
                    {props.name}
                </Typography>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#9F9D9E', mt: '4px' }}>
                    {props.email}
                </Typography>
            </Grid>

            <Grid item xs={2.5} sx={{
                // marginLeft: '99px',
                marginTop: '6px'
            }}>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '24px', color: '#444344' }}>
                    {props.profession}
                </Typography>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#7D7B7C', mt: '4px' }}>
                    {props.companyName}
                </Typography>
            </Grid>

            <Grid item xs={2}>
                <Chip label={props.status} sx={{ marginTop: '16px', backgroundColor: props.status === 'Active' ? '#E5F5ED' : '#FEF2DF', fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: props.status === 'Active' ? '#00AF6F' : '#F99200', }} />
            </Grid>

            <Grid item xs={3} sx={{
                marginTop: '16px',
                width: '166px'
            }}>
                <Button variant='outlined'
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '51px',
                        width: '166px',
                        height: '40px',
                        fontWeight: '500',
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#8D55A2'
                    }}>
                    <MessagePurple style={{ marginRight: '8px' }} />
                    Chat
                </Button>
            </Grid>

            <Grid item xs={1}>
                <Box onClick={handleClick}
                    sx={{
                        // marginLeft: '100px',
                        marginTop: '9px',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 1px 4px rgba(2, 0, 1, 0.1)',
                        width: '48px',
                        height: '48px',
                        borderRadius: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer'

                    }}
                >
                    <Dots />
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                        style: {
                            width: '188px',
                            background: '#FAFAFA',
                            border: '1px solid #F5F6F4',
                            borderRadius: '8px',
                            padding: '0px',
                            fontSize: '16px',
                            lineHeight: '28px',
                            color: '#7D7B7C'
                        },
                    }}
                >

                    <MenuItem onClick={() => {
                        props.handleOpenEmpProfile()
                        sessionStorage.setItem("employeeID", props.id)
                        setAnchorEl(null)
                    }}
                    >
                        View Profile
                    </MenuItem>
                    {props.shouldVisible !== false && (
                        <MenuItem >View Company Profile</MenuItem>
                    )}

                </Menu >
            </Grid>



        </Grid>
    )
}

export default EmployeeCard