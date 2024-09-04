import { Box, Button, Typography, Menu, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactComponent as Dots } from '../../Assets/SVGs/DotsThree.svg';
import './CompanyCard.css'
function CompanyCard(props) {


    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const [status, setStatus] = useState("");
    const [endDate, setEndDate] = useState("");


    const getDaysLeft = () => {
        var currentDate = new Date();
        var expiryDate = new Date(props.planEndDate);
        var timeDiff = expiryDate.getTime() - currentDate.getTime();
        var daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) {
            setStatus("Expired");
            setEndDate(expiryDate.toLocaleDateString("en-GB"));
        } else {
            setStatus(daysLeft + " days left");
            setEndDate(expiryDate.toLocaleDateString("en-GB"));
        }
    }

    useEffect(() => {
        getDaysLeft();
    }, []);

    return (
        <Box
            sx={{
                boxShadow: '0px 2px 8px rgba(2, 0, 1, 0.1)',
                padding: '16px 42px',
                // width: '1117px',
                width: '100%',
                height: '165.29px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #F5F6F4',
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >


            <Box
                width='202.39px'
                height='133.29px'
                display='flex'
                justifyContent='center'
                alignItems='center'
            >
                <img
                    src={props.logo}
                    alt="Corrupt Photo Link"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: '1px solid #DBDBDA',
                        borderRadius: '8px',
                    }}
                />
            </Box>

            <Box sx={{
                // marginLeft: '23px',
                marginTop: '40.64px',
                height: '48px',
                // marginTop: '28.62px',
                // width: '142.47'
            }}>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '18px', lineHeight: '24px', color: '#7C3F92' }}>
                    {props.name}
                </Typography>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#9F9D9E', mt: '4px' }}>
                    {props.totalEmployees} employees
                </Typography>
            </Box>

            <Box sx={{
                // marginLeft: '56.03px',
                marginTop: '40.64px',
                // width: '263px',
            }}>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#444344' }}>
                    {status}
                </Typography>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#7D7B7C', mt: '4px' }}>
                    Ends on: {endDate}
                </Typography>
            </Box>

            <Box sx={{
                // marginLeft: '56.04px',
                marginTop: '40.64px',
                // width: '284px'
            }}>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#444344' }}>
                    {props.meetingRoom} hours meeting room
                </Typography>
                {
                    props.resources.map((value, index) => {
                        return (
                            <Box key={index} display='flex'>
                                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#7D7B7C', mt: '4px' }}>
                                    {value.name}
                                </Typography>
                                {
                                    index !== props.resources.length - 1 && (
                                        <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#7D7B7C', mt: '4px' }}>
                                            -
                                        </Typography>
                                    )
                                }

                            </Box>
                        )
                    })
                }

            </Box>

            <Box
                sx={{
                    // marginLeft: '56.04px',
                    marginTop: '50.64px',
                    backgroundColor: props.isActive === true ? '#E5F5ED' : '#FEF2DF',
                    borderRadius: '44px',
                    width: 'fit-content',
                    height: '32px',
                    padding: '4px 12px',
                }}
            >
                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: props.isActive === true ? '#00AF6F' : '#F99200', }}>
                    {props.isActive === true ? 'Active' : 'Deactivated'}
                </Typography>
            </Box>

            <Box >
                <Box onClick={handleClick}
                    sx={{
                        marginTop: '42.64px',
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

                    <MenuItem
                        onClick={() => {
                            props.handleOpenComProfile()
                            sessionStorage.setItem("specficCompanyID", props.id)
                            setAnchorEl(null)
                        }}
                    >
                        View
                    </MenuItem>
                    <MenuItem >Edit</MenuItem>

                </Menu >
            </Box>





        </Box >
    )
}

export default CompanyCard