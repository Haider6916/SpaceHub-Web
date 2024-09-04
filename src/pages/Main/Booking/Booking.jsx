import React, { useState } from 'react'
import Header from '../../../components/Header/Header'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as MeetingBoard } from '../../../Assets/SVGs/MeetingBoard.svg';
import { ReactComponent as BookingsCalendar } from '../../../Assets/SVGs/BookingsCalendar.svg';
import AllBookings from '../../../components/Bookings/All Bookings/AllBookings';
import MyBookings from '../../../components/Bookings/MyBookings/MyBookings';
import BookMeetingRooms from '../../../components/Bookings/BookMeetingRoom/BookMeetingRooms';
function Booking() {
    // const openAddDrawer = useSelector((state) => state.support.shouldAddTicketOpen)
    // const openTicketDetailsDrawer = useSelector((state) => state.support.shouldViewDrawerOpen)

    // const dispatch = useDispatch()

    const [activeTab, setActiveTab] = useState(0)
    const [number, setNumber] = useState(0)


    const handleChangeTab = (event, value) => {
        setActiveTab(value);
    };

    return (
        <>
            <Header />
            <Box sx={{ padding: "32px" }}>
                <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                    <Box>
                        <Typography sx={{ fontWeight: "700", fontSize: '32px', lineHeight: '41.66px', color: '#272627' }}>
                            Bookings
                        </Typography>
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23.44px', color: '#565556', mt: '8.87px' }}>
                            {activeTab === 0 ? (
                                'Book Meeting Rooms'
                            ) : activeTab === 1 ? (
                                'Manage All Bookings'
                            ) : (
                                'Manage My Bookings'
                            )}

                        </Typography>
                    </Box>
                    <Box sx={{ mt: '15px', display: 'flex', alignItems: 'center', backgroundColor: '#EEE5F1', padding: '0px 10px', gap: '10px', borderRadius: '8px', height: '36px' }}>
                        {(activeTab === 0 || activeTab === 1) ? (
                            <MeetingBoard />
                        ) : (
                            <BookingsCalendar />
                        )}

                        <Typography sx={{ fontWeight: '700', fontSize: '18px', lineHeight: 'normal', color: '#565556' }}>
                            {activeTab === 0 ? (
                                'Available Meeting Rooms:'
                            ) : activeTab === 1 ? (
                                'Occupied Meeting Rooms:'
                            ) : (
                                'Total Bookings:'
                            )}
                        </Typography>

                        <Typography sx={{ fontWeight: '400', fontSize: '18px', lineHeight: 'normal', color: '#565556' }}>
                            {/* {activeTab === 0 ? (
                                '12'
                            ) : activeTab === 1 ? (
                                '88'
                            ) : (
                                '99'
                            )} */}
                            {number}
                        </Typography>
                    </Box>
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
                        <Tab label="Meeting rooms" sx={{ fontWeight: 500, fontSize: '18px', lineHeight: '23px', textTransform: 'none' }} />
                        <Tab label="All Bookings" sx={{ fontWeight: 500, fontSize: '18px', lineHeight: '23px', textTransform: 'none' }} />
                        <Tab label="My Bookings" sx={{ fontWeight: 500, fontSize: '18px', lineHeight: '23px', textTransform: 'none' }} />
                    </Tabs>
                    <Box sx={{ width: '100%', marginTop: '24px' }}>
                        {activeTab === 0 ? (
                            <BookMeetingRooms setTopInfo={(value) => { setNumber(value) }} />
                        ) : activeTab === 1 ? (
                            <AllBookings setTopInfo={(value) => { setNumber(value) }} />
                        ) : (
                            <MyBookings setTopInfo={(value) => { setNumber(value) }} />
                        )}
                    </Box>
                </Box>
            </Box >


        </>
    )
}

export default Booking