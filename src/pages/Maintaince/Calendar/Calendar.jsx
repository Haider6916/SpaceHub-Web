import { Box, Button, Drawer, Fab, Menu, MenuItem, Typography, fabClasses, Modal } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import CalendarHeader from '../../../components/Calendar/CalendarHeader';
import MonthHeader from '../../../components/Calendar/MonthHeader';
import Month from '../../../components/Calendar/Month';
import WeekHeader from '../../../components/Calendar/WeekHeader';
import Week from '../../../components/Calendar/Week';
import { NewGetMonth, getMonth } from '../../../Utils/util';
import AddTaskDrawer from '../../../components/Calendar/AddTaskDrawer';
import Header from '../../../components/Header/Header';
import { ReactComponent as Share } from '../../../Assets/SVGs/Share.svg';
import { ReactComponent as FabAdd } from '../../../Assets/SVGs/FabAdd.svg';
import { ReactComponent as FabCross } from '../../../Assets/SVGs/FabCross.svg';
import { useDispatch, useSelector } from 'react-redux';
import { openShareModal, openTaskDrawer, setDay, setMonth, setWeek } from '../../../Redux/calendarSlice';
import DayHeader from '../../../components/Calendar/DayHeader';
import DayView from '../../../components/Calendar/DayView';
import AddBookingDrawer from '../../../components/Calendar/AddBookingDrawer';
import { Add } from '@mui/icons-material';
import ShareModal from '../../../components/Calendar/ShareModal';
import WeeklyCalendar from '../../../components/Calendar/WeeklyCalendar';
import DailyCalendar from '../../../components/Calendar/DailyCalendar';
import { openBookingDrawer } from '../../../Redux/calendarSlice';
import BookingDetailsModal from '../../../components/Calendar/BookingDetailsModal';
import EventDetailsModal from '../../../components/Calendar/EventDetailsModal';
import TaskDetailsModal from '../../../components/Calendar/TaskDetailsModal';
import { privateRequest } from '../../../ApiMethods';
import { toast } from 'react-hot-toast';
import { AvatarGroup, Avatar } from '@mui/material';
import { red, blue, green, orange, purple, pink, teal } from '@mui/material/colors';

const avatars = [
    'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Isabella',
    'Jack', 'Karen', 'Liam', 'Mia', 'Nora', 'Oliver'
];

const borderColors = [
    red[500], blue[500], green[500], orange[500], purple[500], pink[500], teal[500]
];

function Calendar() {
    const dispatch = useDispatch()

    //Array of weeks with sub array of days object
    const monthNumber = useSelector((state) => state.calendar.monthNumber)
    const viewType = useSelector((state) => state.calendar.viewType)
    const shouldBookingDrawerOpen = useSelector((state) => state.calendar.shouldBookingDrawerOpen)
    const shouldTaskDrawerOpen = useSelector((state) => state.calendar.shouldTaskDrawerOpen)

    const shouldCalendarReload = useSelector((state) => state.calendar.shouldCalendarReload)
    const shouldShareModalOpen = useSelector((state) => state.calendar.shouldShareModalOpen)
    const shouldBookingModalOpen = useSelector((state) => state.calendar.shouldBookingModalOpen)
    const shouldTaskModalOpen = useSelector((state) => state.calendar.shouldTaskModalOpen)
    const shouldEventModalOpen = useSelector((state) => state.calendar.shouldEventModalOpen)

    const [currentMonth, setCurrentMonth] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [shouldTransition, setShouldTransition] = useState(false);

    const [usersData, setUsersData] = useState([])


    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
        setShouldTransition(!shouldTransition)

    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setShouldTransition(!shouldTransition)
    };

    const calculateWeek = () => {
        let index = 0;
        const weeksArray = getMonth(dayjs().month())
        weeksArray.map((row, idx) => {
            row.map((date) => {
                if (date.format("DD-MM-YY") === dayjs().format("DD-MM-YY")) {
                    index = idx;
                    return;
                }
            });
        });
        return index;
    };

    const calculateDay = () => {
        let index = 0;
        let daysArray = getMonth(dayjs().month()).flat()
        daysArray.map((date, idx) => {
            if (date.format("DD-MM-YY") === dayjs().format("DD-MM-YY")) {
                index = idx;
                return;
            }
        });
        return index
    }


    useEffect(() => {
        dispatch(setMonth(dayjs().month()))
        dispatch(setWeek(calculateWeek()))
        dispatch(setDay(calculateDay()))
    }, [])

    const handleToggleAvatar = (id) => {
        privateRequest.put(`/calendar/toggle-active/${id}`)
            .then((response) => {
                toast.success(response.data.message)
                setUsersData(response.data.users)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message)
            })
    }

    const fetchSharedEmployees = () => {
        privateRequest.get(`calendar/active-invites`)
            .then((response) => {
                setUsersData(response.data.users)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message)
            })
    }

    useEffect(() => {
        setCurrentMonth(getMonth(monthNumber))
    }, [monthNumber])

    useEffect(() => {
        fetchSharedEmployees()
    }, [])

    return (
        <>
            <Header />
            <Box sx={{
                padding: "22px 32px",

            }}>
                <Box sx={{ display: "flex", justifyContent: 'space-between', borderBottom: '1px solid #DBDBDA', alignItems: 'center', paddingBottom: "17px" }}>
                    <Box>
                        <Typography sx={{ fontWeight: "700", fontSize: '32px', lineHeight: 'normal', color: '#272627' }}>
                            Calendar
                        </Typography>
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: 'normal', color: '#565556', mt: '10px' }}>
                            View your calendar
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                        <Button
                            onClick={() => dispatch(openShareModal())}
                            variant='contained'
                            sx={{ width: "fit-content", fontWeight: '500', padding: '0px 24px', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', height: '40px', gap: '8px' }}
                        >
                            <Share />Share
                        </Button>
                        <AvatarGroup max={15} sx={{ mt: '6.5px' }}>
                            {usersData.map((user, index) => (
                                <Avatar
                                    key={index}
                                    src={user.user.profilePicture}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        border: `4px solid ${(user.isActive && user.status === 'Accepted') ? user.colorCode.borderColor : '#E3E3E3'}`,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => { handleToggleAvatar(user.user._id) }}
                                />
                            ))}
                        </AvatarGroup>
                    </Box>
                </Box>



                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                    <CalendarHeader />

                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ width: '100%' }}>

                            {viewType === 'Month' &&
                                <>
                                    <MonthHeader month={currentMonth} />
                                    <Month month={currentMonth} />
                                </>
                            }

                            {viewType === 'Week' &&
                                <>
                                    {/* <WeekHeader month={currentMonth} />
                                    <Week /> */}
                                    <WeekHeader month={currentMonth} />
                                    <WeeklyCalendar />
                                </>
                            }

                            {viewType === 'Day' &&
                                <>
                                    <DayHeader />
                                    <DayView />
                                    {/* <DailyCalendar /> */}
                                </>
                            }
                        </Box>
                    </Box>

                    <div>
                        <Fab
                            color="primary"
                            sx={{
                                flex: 9999,
                                position: 'absolute',
                                bottom: viewType === 'Month' ? '20px' : '20px',
                                right: '20px',
                                height: '100px',
                                width: '100px',
                                transition: 'background-color 0.5s, transform 0.5s',
                                backgroundColor: shouldTransition ? '#EEE5F1' : '#A070B2',
                                transform: shouldTransition ? 'rotate(45deg)' : 'rotate(0deg)',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: shouldTransition ? '#7D7B7C' : '#8D55A2',
                                    // boxShadow: 'none'
                                },
                            }}
                            onClick={handleOpenMenu}
                        >
                            {
                                shouldTransition ? <FabCross /> : <FabAdd />

                            }
                        </Fab>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            getContentAnchorEl={null} // Add this line to remove default vertical shift
                            sx={{
                                '& .MuiPaper-root': {
                                    marginTop: '-10px', // Add your desired margin top here
                                    padding: '0',
                                    backgroundColor: '#FAFAFA',
                                    width: '230px',
                                },
                            }}
                        >
                            <MenuItem onClick={() => { dispatch(openBookingDrawer()); handleCloseMenu() }}>Book meeting room</MenuItem>
                            <MenuItem onClick={() => { dispatch(openTaskDrawer()); handleCloseMenu() }}>Create new task</MenuItem>
                        </Menu>
                    </div>


                </div >



            </Box >




            < Drawer
                anchor={'right'}
                open={shouldTaskDrawerOpen}
                PaperProps={{
                    sx: { width: "611px" },
                }
                }
            >
                <Box sx={{ width: '100%', padding: '48px 32.2px' }}>
                    <AddTaskDrawer />
                </Box>
            </Drawer >

            {/* Add New Booking */}
            < Drawer
                anchor={'right'}
                open={shouldBookingDrawerOpen}
                PaperProps={{
                    sx: { width: "611px" },
                }
                }
            >
                <Box sx={{ width: '100%', padding: '48px 32.2px' }}>
                    <AddBookingDrawer />
                </Box>
            </Drawer >


            <Modal open={shouldShareModalOpen} >
                <ShareModal />
            </Modal>

            <Modal open={shouldBookingModalOpen} >
                <BookingDetailsModal />
            </Modal>

            <Modal open={shouldEventModalOpen} >
                <EventDetailsModal />
            </Modal>

            <Modal open={shouldTaskModalOpen} >
                <TaskDetailsModal />
            </Modal>
        </>
    )
}

export default Calendar