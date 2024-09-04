import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header/Header'
import { Box, Button, Chip, ClickAwayListener, Drawer, IconButton, Menu, MenuItem, Modal, Slide, Typography } from '@mui/material'
import { ReactComponent as Empty } from '../../../Assets/SVGs/Empty.svg';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../../ApiMethods';
import { ArrowUpward, FilterAltOff } from '@mui/icons-material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { eventsReloadFalse, openAddEventDrawer } from '../../../Redux/eventsSlice';
import AddNewEvents from '../../../components/Events/AddEventsDrawer/AddNewEvents';
import EventCard from '../../../components/Events/EventCard/EventCard';
import UsersList from '../../../components/Events/UsersList/UsersList';
import SkeletonLoader from '../../../components/SkeletonLoader.jsx/SkeletonLoader';
import EmployeeProfileDrawer from '../../../components/EmployeeProfileDrawer/EmployeeProfileDrawer';
import EditEventsDrawer from '../../../components/Events/EditEventsDrawer/EditEventsDrawer';
import { ReactComponent as CalendarIcon } from '../../../Assets/SVGs/Calendar.svg';
import { Calendar } from 'react-date-range';
import { format } from 'date-fns';

function Events() {

    const shouldReload = useSelector((state) => state.event.shouldEventsReload)
    const shouldAddEventOpen = useSelector((state) => state.event.shouldAddEventOpen)
    const shouldEditEventOpen = useSelector((state) => state.event.shouldEditEventOpen)
    const shouldUsersListOpen = useSelector((state) => state.event.shouldUsersListOpen)
    const shouldEmpProfileOpen = useSelector((state) => state.event.shouldEmpProfileOpen)

    const dispatch = useDispatch()
    const [eventsData, setEventsData] = useState([])
    const [firstRender, setFirstRender] = useState(true)
    const [hasNextPage, setHasNextPage] = useState(null)
    const [nextPage, setNextPage] = useState(0)
    const [isFiltered, setIsFiltered] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [openEmpProfile, setOpenEmpProfile] = useState(false);
    const [startShownDate, setStartShownDate] = useState(new Date());
    const [openStartDate, setOpenStartDate] = useState(false);
    const [filterValue, setFilterValue] = useState(null)

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSearch = (apiResponse) => {
        setEventsData(apiResponse.docs);
        setHasNextPage(apiResponse.hasNextPage)
        setNextPage(apiResponse.nextPage)
    }

    const fetchEvents = () => {
        privateRequest.get('/event', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            setFirstRender(false)
            setEventsData(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
            setIsLoading(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })

    }

    const fetchMoreEvents = () => {
        let searchUrl = sessionStorage.getItem("searchURL");
        privateRequest
            .get(searchUrl === '' ? '/event' : searchUrl, {
                headers: {
                    'x-pagination-skip': nextPage,
                    'x-pagination-limit': 10
                }
            })
            .then((res) => {
                let tempArray = [...eventsData];
                tempArray = tempArray.concat(res.data.docs)
                setEventsData(tempArray);
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message);
            });
    };

    const fetchEventsByFilter = () => {
        privateRequest.get(`event?filter=${filterValue}`, {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            setEventsData(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchMoreEventsByFilter = () => {

        privateRequest.get(`event?filter=${filterValue}`, {
            headers: {
                'x-pagination-skip': nextPage,
                'x-pagination-limit': 10
            }
        })
            .then((res) => {
                let tempArray = [...eventsData];
                tempArray = tempArray.concat(res.data.docs)
                setEventsData(tempArray);
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message);
            });
    }

    const resetFilters = () => {
        setIsFiltered(false)
        setFilterValue(null)
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (firstRender === false && isFiltered) {
            fetchEventsByFilter()
        } else {
            fetchEvents()
        }
    }, [isFiltered, filterValue])

    useEffect(() => {
        if (shouldReload) {
            fetchEvents()
            dispatch(eventsReloadFalse())
        }
    }, [shouldReload])

    useEffect(() => {
        setOpenEmpProfile(shouldEmpProfileOpen)
    }, [shouldEmpProfileOpen])



    return (
        <>
            <Header />
            <Box sx={{
                padding: "32px",

            }}>
                <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                    <Box>
                        <Typography sx={{ fontWeight: "700", fontSize: '32px', lineHeight: '41.66px', color: '#272627' }}>
                            Events
                        </Typography>
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23.44px', color: '#565556', mt: '8.87px' }}>
                            Add events for your companies and their employees
                        </Typography>
                    </Box>
                    <Button
                        onClick={() => dispatch(openAddEventDrawer())}
                        variant='contained'
                        sx={{ fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', mt: '18.21px' }}
                    >
                        Add Event
                    </Button>
                </Box>

                <Box sx={{ width: '100%', marginTop: '24px' }}>
                    <Box sx={{ marginBottom: '25px' }}  >
                        <SearchBar placeholderValue='Search Events' handleSetValue={(value) => handleSearch(value)} />
                    </Box>

                    <Box sx={{ marginBottom: '16px', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '20px', lineHeight: '26.04px', color: '#272627', mr: '15px' }}>Date Filter:</Typography>
                        <div>
                            <Box onClick={(event) => { setOpenStartDate(!openStartDate); handleClick(event) }} sx={{ position: 'relative', width: '354px', backgroundColor: filterValue === null ? '#FAFAFA' : '#EEE5F1', borderRadius: '8px', height: '48px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', '&:hover': { backgroundColor: '#EEE5F1' } }}>
                                <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: isLoading === '' ? '#c6c5c5' : '#7D7B7C' }}>
                                    {filterValue === null ? 'Select Date' : filterValue}
                                </Typography>
                                <CalendarIcon />
                            </Box>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={() => setAnchorEl(null)}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                                sx={{
                                    '& .MuiPaper-root': {
                                        margin: '0',
                                        padding: '0',
                                        backgroundColor: '#FAFAFA',
                                        width: '354px'
                                    },
                                }}
                            >
                                <MenuItem
                                    disableRipples
                                    disableTouchRipple
                                    autoFocus={true}
                                    sx={{
                                        padding: '0',
                                        margin: '0',
                                        backgroundColor: '#FAFAFA',
                                        '&:hover': { backgroundColor: '#FAFAFA' }
                                    }} >
                                    <Box sx={{ width: "100%", backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Calendar
                                            date={startShownDate}
                                            className='calendarElement'
                                            onChange={(date) => {
                                                setIsFiltered(true)
                                                setFilterValue(format(date, 'yyyy-MM-dd'))
                                                setStartShownDate(date)
                                                setOpenStartDate(false)
                                                setAnchorEl(null);
                                            }}
                                            // minDate={new Date()}
                                            color="#8D55A2"
                                            colorPrimary="#8D55A2"
                                        />
                                    </Box>
                                </MenuItem>
                            </Menu>
                        </div>
                        <Button variant='contained' sx={{ height: '48px', borderRadius: '8px', ml: '15px' }} onClick={resetFilters}>
                            Clear Filters <FilterAltOff />
                        </Button>
                    </Box>
                    {isLoading &&
                        <SkeletonLoader />
                    }

                    {
                        eventsData.length !== 0 && (
                            <InfiniteScroll
                                dataLength={eventsData.length}
                                next={isFiltered ? fetchMoreEventsByFilter : fetchMoreEvents}
                                hasMore={hasNextPage} // Replace with a condition based on your data source
                                loader={
                                    <Box sx={{ mt: '20px', mb: '20px', display: 'flex', justifyContent: 'center' }}>
                                        <Chip label='Loading...' sx={{
                                            fontWeight: '400',
                                            fontSize: '16px',
                                            lineHeight: '28px',
                                            color: '#565556',
                                        }} />
                                    </Box>}
                                endMessage={
                                    <Box sx={{ mt: '20px', mb: '20px', display: 'flex', justifyContent: 'space-around' }}>
                                        <Box></Box>
                                        <Chip label='No more data to load.' sx={{
                                            fontWeight: '400',
                                            fontSize: '16px',
                                            lineHeight: '28px',
                                            color: '#565556',
                                        }} />
                                        <IconButton
                                            sx={{
                                                backgroundColor: '#EAE8E9',
                                                color: '#565556',
                                                width: "32px",
                                                height: '32px'
                                            }}
                                            onClick={() => scrollToTop()}
                                        >
                                            <ArrowUpward />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                {eventsData.map((value, index) => (
                                    <Box key={index} sx={{ mt: index !== 0 ? '20px' : '0px' }}>
                                        <EventCard
                                            key={index}
                                            eventDetails={value}
                                        />
                                    </Box>
                                ))}
                            </InfiniteScroll>
                        )
                    }

                    {(eventsData.length === 0 && firstRender === false) &&
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '135.63px' }} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Empty />
                                <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556', mt: '24px' }}>
                                    No events found yet add new
                                </Typography>
                                <Button
                                    onClick={() => dispatch(openAddEventDrawer())}
                                    variant='contained'
                                    sx={{ fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', mt: "24px" }}
                                >
                                    Add Event
                                </Button>
                            </Box>
                        </Box>
                    }

                </Box>
            </Box >


            {/* Add New Event */}
            < Drawer
                anchor={'right'}
                open={shouldAddEventOpen}
                PaperProps={{
                    sx: { width: "611px" },
                }
                }
            >
                <Box sx={{ width: '100%', padding: '48px 32.2px' }}>
                    <AddNewEvents />
                </Box>
            </Drawer >

            {/* Edit Event */}
            < Drawer
                anchor={'right'}
                open={shouldEditEventOpen}
                PaperProps={{
                    sx: { width: "611px" },
                }
                }
            >
                <Box sx={{ width: '100%', padding: '48px 32.2px' }}>
                    <EditEventsDrawer />
                </Box>
            </Drawer >


            {/* Users List Modal*/}
            <Modal open={shouldUsersListOpen} >
                <UsersList />
            </Modal >


            <Drawer
                anchor={'right'}
                open={openEmpProfile}
                PaperProps={{
                    sx: { width: "calc(100% - 260px)" },
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <EmployeeProfileDrawer
                        handleCloseEmpProfile={() => { setOpenEmpProfile(false) }}
                    />
                </Box>
            </Drawer>
        </>
    )
}

export default Events