import React, { useState } from 'react'
import Header from '../../../components/Header/Header'
import { Box, Button, Drawer, Tab, Tabs, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import ReceivedTickets from '../../../components/Support/ReceivedTickets/ReceivedTickets';
import MyTickets from '../../../components/Support/MyTickets/MyTickets';
import AddNewTicket from '../../../components/Support/AddNewTicket/AddNewTicket';
import { openAddTicketDrawer } from '../../../Redux/supportSlice';
import TicketDetailsDrawer from '../../../components/Support/TicketDetailsDrawer/TicketDetailsDrawer';
function Support() {

    const openAddDrawer = useSelector((state) => state.support.shouldAddTicketOpen)
    const openTicketDetailsDrawer = useSelector((state) => state.support.shouldViewDrawerOpen)

    const dispatch = useDispatch()

    const [activeTab, setActiveTab] = useState(0)

    const handleChangeTab = (event, value) => {
        setActiveTab(value);
    };

    return (
        <>
            <Header />
            <Box sx={{
                padding: "32px",

            }}>
                <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                    <Box>
                        <Typography sx={{ fontWeight: "700", fontSize: '32px', lineHeight: '41.66px', color: '#272627' }}>
                            Support
                        </Typography>
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23.44px', color: '#565556', mt: '8.87px' }}>
                            Add companies tickets and add your own tickets
                        </Typography>
                    </Box>
                    <Button
                        onClick={() => dispatch(openAddTicketDrawer())}
                        variant='contained'
                        sx={{ fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', mt: '18.21px' }}
                    >
                        Add Ticket
                    </Button>
                </Box>




                <Box sx={{ width: 'calc(100%)' }}>
                    <Tabs value={activeTab} onChange={handleChangeTab}
                        sx={{
                            '& .MuiTabs-flexContainer': {
                                borderBottom: '3px solid #E9EAE9',
                                // width: 'calc(100% - 31.86px)'
                                width: '100%'
                            },
                        }}
                    >
                        <Tab label="Received Tickets" sx={{ fontWeight: 500, fontSize: '18px', lineHeight: '23px', textTransform: 'none' }} />
                        <Tab label="My Tickets" sx={{ fontWeight: 500, fontSize: '18px', lineHeight: '23px', textTransform: 'none' }} />
                    </Tabs>
                    <Box sx={{ width: '100%', marginTop: '24px' }}>
                        {activeTab === 0 ? (
                            <ReceivedTickets />

                        ) : (
                            <MyTickets />
                        )}
                    </Box>
                </Box>
            </Box >

            {/* Add New Listing */}
            < Drawer
                anchor={'right'}
                open={openAddDrawer}
                PaperProps={{
                    sx: { width: "calc(100% - 260px)" },
                }
                }
            >
                <Box sx={{ width: '100%', padding: '48px 32.2px' }}>
                    <AddNewTicket />
                </Box>
            </Drawer >

            {/* Add New Listing */}
            < Drawer
                anchor={'right'}
                open={openTicketDetailsDrawer}
                PaperProps={{
                    sx: { width: "calc(100% - 260px)" },
                }
                }
            >
                <Box sx={{ width: '100' }}>
                    <TicketDetailsDrawer />
                </Box>
            </Drawer >

        </>
    )
}

export default Support