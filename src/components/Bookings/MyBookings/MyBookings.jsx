import React, { useEffect, useState } from 'react'
import BooikingDetails from '../BookingDetails/BookingDetails'
import { Box, Chip, IconButton, Modal, Typography, Menu, MenuItem, Button } from '@mui/material'
import UsersModal from '../UsersModal/UsersModal'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { privateRequest } from '../../../ApiMethods'
import SkeletonLoader from '../../SkeletonLoader.jsx/SkeletonLoader'
import InfiniteScroll from 'react-infinite-scroll-component'
import SearchBar from '../../SearchBar/SearchBar'
import { ArrowUpward, FilterAltOff } from '@mui/icons-material'
import { ReactComponent as Empty } from '../../../Assets/SVGs/Empty.svg';
import { format } from 'date-fns'
import { Calendar } from 'react-date-range'
import { ReactComponent as CalendarIcon } from '../../../Assets/SVGs/Calendar.svg';
import CustomDropdown from '../../CustomDropdown/CustomDropdown'
import moment from 'moment'

const MyBookings = (props) => {

    const shouldUsersListOpen = useSelector((state) => state.booking.shouldUsersListOpen)

    const [hasNextPage, setHasNextPage] = useState(null)
    const [nextPage, setNextPage] = useState(0)
    const [allBookings, setAllBookings] = useState([])
    const [firstRender, setFirstRender] = useState(true)

    const [startShownDate, setStartShownDate] = useState(new Date());
    const [openStartDate, setOpenStartDate] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterValue, setFilterValue] = useState(null)
    const [timeSlotFrom, setTimeSlotFrom] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [isFiltered, setIsFiltered] = useState(false)
    const [filterObj, setFilterObj] = useState({
        date: '',
        startTime: '',
        endTime: ''
    })

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };



    const fetchMyBookings = () => {

        privateRequest.get('/booking/my-bookings', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            setAllBookings(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
            props.setTopInfo(res.data.totalDocs)
            setFirstRender(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })


    }


    const resetFilters = () => {
        setIsFiltered(false)
        setFilterObj({
            date: '',
            startTime: '',
            endTime: ''
        })
    }


    const makeTimeArray = (selectedStartTime = undefined) => {
        const timeSlots = [];
        const startTime = new Date();
        startTime.setHours(0, 0, 0, 0); // Set start time to 00:00:00
        const endTime = new Date();
        endTime.setHours(23, 45, 0, 0); // Set end time to 23:45:00

        const interval = 15; // Interval in minutes

        while (startTime <= endTime) {

            let tempTimeSlot = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            if (selectedStartTime === undefined) {
                timeSlots.push(tempTimeSlot);
            } else {
                if (moment(selectedStartTime, 'hh:mm A').isBefore(moment(tempTimeSlot, 'hh:mm A'))) {
                    timeSlots.push(tempTimeSlot);
                }
            }
            startTime.setMinutes(startTime.getMinutes() + interval);
        }

        return timeSlots
    }

    const fetchMoreMyBookings = () => {
        let searchUrl = sessionStorage.getItem("searchURL");


        privateRequest.get(searchUrl === '' ? '/booking/my-bookings' : searchUrl, {
            headers: {
                'x-pagination-skip': nextPage,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            let tempArray = [...allBookings];
            tempArray = tempArray.concat(res.data.docs)
            setAllBookings(tempArray)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    };

    const fetchMyBookingsByFilter = () => {

        const apiObject = {
            startTime: convertToISO(filterObj.date, filterObj.startTime),
            endTime: convertToISO(filterObj.date, filterObj.endTime)
        }

        privateRequest.post('/booking/my-bookings', apiObject, {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            setAllBookings(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const fetchMoreMyBookingsByFilter = () => {

        const apiObject = {
            startTime: convertToISO(filterObj.date, filterObj.startTime),
            endTime: convertToISO(filterObj.date, filterObj.endTime)
        }

        privateRequest.post('/booking/my-bookings', apiObject, {
            headers: {
                'x-pagination-skip': nextPage,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            let tempArray = [...allBookings];
            tempArray = tempArray.concat(res.data.docs)
            setAllBookings(tempArray)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })

    }

    const convertToISO = (date, time) => {

        let formattedDate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
        const formattedTime = moment(time, "hh:mm A").format("HH:mm:ss.sssZ")

        const dtObject = new Date(`${formattedDate}T${formattedTime}`);
        const isoStr = dtObject.toISOString();
        return isoStr;
    }

    const handleSearch = (apiResponse) => {
        setAllBookings(apiResponse.docs);
        setHasNextPage(apiResponse.hasNextPage)
        setNextPage(apiResponse.nextPage)
    }

    // useEffect(() => {
    //     fetchMyBookings()
    // }, [])


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (firstRender === false && isFiltered) {
            fetchMyBookingsByFilter()
        } else {
            fetchMyBookings()
        }
    }, [isFiltered])

    if (firstRender === true) {
        return <SkeletonLoader />
    }

    return (
        <>

            <Box sx={{ marginBottom: '16.8px' }}  >
                <SearchBar placeholderValue='Search My Bookings' handleSetValue={(value) => handleSearch(value)} />
            </Box>

            <Box sx={{ marginBottom: '16px', width: '100%', display: 'flex', alignItems: 'center', gap: '24px' }}>

                <div>
                    <Box onClick={(event) => { setOpenStartDate(!openStartDate); handleClick(event) }} sx={{ position: 'relative', alignItems: "center", width: '354px', backgroundColor: filterObj.date === '' ? '#FAFAFA' : '#EEE5F1', borderRadius: '8px', height: '56px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', '&:hover': { backgroundColor: '#EEE5F1' } }}>
                        <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: isLoading === '' ? '#c6c5c5' : '#7D7B7C' }}>
                            {filterObj.date === '' ? 'Select Date' : filterObj.date}
                        </Typography>
                        <CalendarIcon />
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
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
                                        setFilterObj({ ...filterObj, date: format(date, 'yyyy-MM-dd') })
                                        setStartShownDate(date)
                                        setIsFiltered(false)
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

                <Typography sx={{ fontSize: '20px', lineHeight: '26.04px', color: '#272627' }}>From</Typography>


                <CustomDropdown
                    placeholderValue='Select From'
                    menuItems={makeTimeArray()}
                    value={filterObj.startTime}
                    handleDropdownValue={(value) => {
                        setFilterObj({ ...filterObj, startTime: value })
                        setIsFiltered(false)
                    }}
                />

                <Typography sx={{ fontSize: '20px', lineHeight: '26.04px', color: '#272627' }}>To</Typography>


                <CustomDropdown
                    placeholderValue='Select To'
                    menuItems={makeTimeArray(filterObj.startTime)}
                    value={filterObj.endTime}
                    handleDropdownValue={(value) => {
                        setFilterObj({ ...filterObj, endTime: value })
                        setIsFiltered(false)
                    }}
                />

                {isFiltered === true &&
                    <Button variant='contained' sx={{ height: '56px', borderRadius: '8px', minWidth: '117px', fontSize: '16px' }} onClick={resetFilters}>
                        Clear Filters <FilterAltOff />
                    </Button>
                }

                {isFiltered === false &&
                    <Button onClick={() => setIsFiltered(true)} disabled={(filterObj.date === '' || filterObj.startTime === '' || filterObj.endTime === '')} variant='contained' sx={{ height: '56px', borderRadius: '8px', minWidth: '117px', fontSize: '16px' }} >
                        Apply Filter
                    </Button>
                }
            </Box>

            <InfiniteScroll
                dataLength={allBookings.length}
                next={isFiltered ? fetchMoreMyBookingsByFilter : fetchMoreMyBookings}
                hasMore={hasNextPage} // Replace with a condition based on your data source
                loader={
                    <Box sx={{ mt: '20px', mb: '20px', display: 'flex', justifyContent: 'center' }}>
                        <Chip label='Loading...' sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556', }} />
                    </Box>}
                endMessage={
                    <Box sx={{ mt: '20px', mb: '20px', display: 'flex', justifyContent: 'space-around' }}>
                        {allBookings.length !== 0 && (
                            <>
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
                            </>

                        )}
                    </Box>
                }
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {allBookings.map((value, index) => (
                        <BooikingDetails
                            key={index}
                            bookingDetails={value}
                            reloadData={() => { fetchMyBookings() }}
                        />
                    ))}
                </Box>
            </InfiniteScroll>

            {(allBookings.length === 0 && firstRender === false) && (
                <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center' mt='50px'>
                    <Empty />
                    <Typography>No data to display</Typography>
                </Box>
            )}


            {/* Users Modal*/}
            <Modal open={shouldUsersListOpen} >
                <UsersModal />
            </Modal >
        </>
    )
}

export default MyBookings