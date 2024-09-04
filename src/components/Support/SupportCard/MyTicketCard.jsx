import { Box, Chip, Grid, Menu, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import { ReactComponent as Dots } from '../../../Assets/SVGs/DotsThree.svg';
import { openViewDrawer, setTicketID } from '../../../Redux/supportSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../../ApiMethods';
function MyTicketCard(props) {

    let chipColor = {
        'Done': '#00AF6F',
        'Pending': '#F99200',
        'pending': '#F99200',
    }


    let chipBackgroundColor = {
        'Done': '#E5F5ED',
        'Pending': '#FEF2DF',
        'pending': '#FEF2DF',
    }

    const { ticketDetails } = props
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const formatDate = () => {
        const date = new Date(ticketDetails.createdAt);
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        const formattedDate = `${month} ${day}`;

        return formattedDate;
    }

    const handleEscalate = () => {
        privateRequest.put(`/ticket/escalate/${ticketDetails._id}`).then((res) => {
            toast.success(res.data.message)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    return (
        <Box sx={{ width: '100%', height: '96px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #F5F6F4', boxShadow: '0px 1px 4px rgba(2, 0, 1, 0.1)' }}>
            <Grid container sx={{ padding: '0px 42px' }}>
                <Grid item xs={4} >
                    <Box sx={{ width: '100%' }}>
                        <Typography sx={{
                            fontWeight: '500', fontSize: '18px', lineHeight: '24px', color: '#444344', mt: '36px', width: '90%',
                            // wordWrap: 'break-word',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                            {ticketDetails.title}
                        </Typography>
                    </Box>
                </Grid>


                <Grid item xs={4}>
                    <Box sx={{ width: '100%' }}>
                        <Chip label={ticketDetails.status} sx={{ backgroundColor: chipBackgroundColor[ticketDetails.status], borderRadius: '44px', padding: '4px 12px', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: chipColor[ticketDetails.status], fontFamily: "'DM Sans', sans-serif", mt: '32px', }} />
                    </Box>
                </Grid>

                <Grid item xs={3.2} >
                    <Box sx={{ width: '100%' }}>
                        <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#444344', mt: '36px' }}>
                            {formatDate()}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={0.8} >
                    <Box onClick={handleClick}
                        sx={{
                            marginTop: '24px',
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
                                dispatch(openViewDrawer());
                                dispatch(setTicketID(ticketDetails._id));
                                setAnchorEl(null)
                            }}
                        >
                            Open Ticket
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleEscalate()
                            setAnchorEl(null)
                        }}>
                            Escalate to Spacehub
                        </MenuItem>

                    </Menu >

                </Grid>
            </Grid>
        </Box>
    )
}

export default MyTicketCard