import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header/Header'
import { Box, Button, Chip, Drawer, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material'
import { ReactComponent as Empty } from '../../../Assets/SVGs/Empty.svg';
import AddNewListing from '../../../components/NewListingDrawer/AddNewListing';
import DeskCard from '../../../components/ListingCards/DeskCard';
import SearchBar from '../../../components/SearchBar/SearchBar';
import CustomDropdown from '../../../components/CustomDropdown/CustomDropdown';
import { privateRequest } from '../../../ApiMethods';
import { toast } from 'react-hot-toast';
import { ArrowUpward, FilterAltOff } from '@mui/icons-material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { listingReloadFalse } from '../../../Redux/listingSlice';


const sortOrder = ['Asc', 'Desc']
const sortBy = ['Capacity', 'Name', 'Area']

function Listing() {

    const shouldReload = useSelector((state) => state.listing.shouldListingReload)
    const dispatch = useDispatch()

    const [openDrawer, setOpenDrawer] = useState(false)
    const [value, setValue] = useState(0)
    const [firstRender, setFirstRender] = useState(true)
    const [isFiltered, setIsFiltered] = useState(false)
    const [desks, setDesks] = useState([])
    const [meetingRooms, setMeetingRooms] = useState([])
    const [privateOffices, setPrivateOffices] = useState([])
    const [hasNextPage, setHasNextPage] = useState(null)
    const [nextPage, setNextPage] = useState(0)

    //To set dropdown values
    const [dropdownOptions, setDropdownOptions] = useState(
        {
            sortBy: '',
            sortOrder: ''
        }
    )
    //To set Filter API
    const [filterOptions, setFilterOptions] = useState(
        {
            type: '',
            sortBy: '',
            sortOrder: ''
        }
    )

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
        setFirstRender(true)
        setDropdownOptions({
            sortBy: '',
            sortOrder: ''
        })
    };

    const resetFilters = () => {

        const emptyFilterOptions = {
            type: '',
            sortBy: '',
            sortOrder: ''
        };

        const emptyDropdownOptions = {
            sortBy: '',
            sortOrder: ''
        };

        if (
            JSON.stringify(filterOptions) === JSON.stringify(emptyFilterOptions) &&
            JSON.stringify(dropdownOptions) === JSON.stringify(emptyDropdownOptions)
        ) {
            return;
        }

        setFilterOptions(emptyFilterOptions);
        setDropdownOptions(emptyDropdownOptions);
        setIsFiltered(false)
    }

    const handleFetchListings = () => {
        if (value === 0) {
            privateRequest.get('/resource?resourceType=desk', {
                headers: {
                    'x-pagination-skip': 1,
                    'x-pagination-limit': 10
                }
            }).then((res) => {
                setDesks(res.data.docs)
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
                setFirstRender(false)
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            })
        }
        else if (value === 1) {
            privateRequest.get('/resource?resourceType=meeting_room', {
                headers: {
                    'x-pagination-skip': 1,
                    'x-pagination-limit': 10
                }
            }).then((res) => {
                setMeetingRooms(res.data.docs)
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
                setFirstRender(false)
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            })
        } else {
            privateRequest.get('/resource?resourceType=private_office', {
                headers: {
                    'x-pagination-skip': 1,
                    'x-pagination-limit': 10
                }
            }).then((res) => {
                setPrivateOffices(res.data.docs)
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
                setFirstRender(false)
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            })
        }

    }

    const fetchMoreListings = () => {
        let searchUrl = sessionStorage.getItem("searchURL");
        if (value === 0) {
            privateRequest.get(searchUrl === '' ? '/resource?resourceType=desk' : searchUrl, {
                headers: {
                    'x-pagination-skip': nextPage,
                    'x-pagination-limit': 10
                }
            }).then((res) => {
                let tempArray = [...desks];
                tempArray = tempArray.concat(res.data.docs)
                setDesks(tempArray)
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            })
        }
        else if (value === 1) {
            privateRequest.get(searchUrl === '' ? '/resource?resourceType=meeting_room' : searchUrl, {
                headers: {
                    'x-pagination-skip': nextPage,
                    'x-pagination-limit': 10
                }
            }).then((res) => {
                let tempArray = [...meetingRooms];
                tempArray = tempArray.concat(res.data.docs)
                setMeetingRooms(tempArray)
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            })
        } else {
            privateRequest.get(searchUrl === '' ? '/resource?resourceType=private_office' : searchUrl, {
                headers: {
                    'x-pagination-skip': nextPage,
                    'x-pagination-limit': 10
                }
            }).then((res) => {
                let tempArray = [...privateOffices];
                tempArray = tempArray.concat(res.data.docs)
                setPrivateOffices(tempArray)
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            })
        }

    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSearch = (apiResponse) => {

        if (value === 0) {
            setDesks(apiResponse.docs);
        }
        else if (value === 1) {
            setMeetingRooms(apiResponse.docs);
        } else {
            setPrivateOffices(apiResponse.docs);
        }
        setHasNextPage(apiResponse.hasNextPage)
        setNextPage(apiResponse.nextPage)
        resetFilters()
    }

    const fetchListingsByFilter = () => {
        let apiObject = {}
        Object.keys(filterOptions).forEach((key) => {
            if (filterOptions[key] !== '') {
                apiObject[key] = filterOptions[key];
            }
        });

        console.log('APIObeject', apiObject);
        privateRequest.post('/resource/filter', apiObject).then((res) => {
            if (value === 0) {
                setDesks(res.data.docs)
            }
            else if (value === 1) {
                setMeetingRooms(res.data.docs)
            } else {
                setPrivateOffices(res.data.docs)
            }
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchMoreListingsByFilter = () => {
        let apiObject = {}
        Object.keys(filterOptions).forEach((key) => {
            if (filterOptions[key] !== '') {
                apiObject[key] = filterOptions[key];
            }
        });

        const headers = {
            'x-pagination-skip': nextPage,
            'x-pagination-limit': 10
        };

        privateRequest.post('/resource/filter', apiObject, { headers }).then((res) => {
            if (value === 0) {
                setDesks(res.data.docs)
            }
            else if (value === 1) {
                setMeetingRooms(res.data.docs)
            } else {
                setPrivateOffices(res.data.docs)
            }
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    useEffect(() => {
        if (shouldReload) {
            handleFetchListings()
            dispatch(listingReloadFalse())
        }
    }, [shouldReload])

    useEffect(() => {
        handleFetchListings()
    }, [value])

    useEffect(() => {
        if (firstRender === false && isFiltered) {
            fetchListingsByFilter()
        } else {
            handleFetchListings()
        }
    }, [filterOptions])



    if (firstRender === true) {
        return <>
            <Box display='flex' justifyContent='space-between' padding='40px 36px 0px 30px'>
                <Typography>
                    Fetching data from API ....
                </Typography>
            </Box>
        </>
    }

    return (
        <>
            <Header />
            <Box sx={{
                padding: "32px",

            }}>
                <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                    <Box>
                        <Typography sx={{ fontWeight: "700", fontSize: '32px', lineHeight: '41.66px', color: '#272627' }}>
                            Listing
                        </Typography>
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23.44px', color: '#565556', mt: '8.87px' }}>
                            Add co-working to assign companies to it
                        </Typography>
                    </Box>
                    <Button
                        onClick={() => setOpenDrawer(true)}
                        variant='contained'
                        sx={{ fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', mt: '18.21px' }}
                    >
                        Add new
                    </Button>
                </Box>



                <Tabs value={value} onChange={handleChangeTab}
                    sx={{
                        '& .MuiTabs-flexContainer': {
                            borderBottom: '3px solid #E9EAE9',
                            // width: 'calc(100% - 31.86px)'
                            width: '100%',
                            mt: '23.88px',
                        }
                    }}
                >
                    <Tab label="Desks" sx={{ fontWeight: 500, fontSize: '18px', lineHeight: '23px', textTransform: 'none' }} />
                    <Tab label="Meeting rooms" sx={{ fontWeight: 500, fontSize: '18px', lineHeight: '23px', textTransform: 'none' }} />
                    <Tab label="Private offices" sx={{ fontWeight: 500, fontSize: '18px', lineHeight: '23px', textTransform: 'none' }} />
                </Tabs>
                <Box sx={{ width: '100%', marginTop: '24px' }}>
                    {value === 0 ? (
                        <>
                            <Box sx={{ marginBottom: '16.8px' }}  >
                                <SearchBar placeholderValue='Search Desks' handleSetValue={(value) => handleSearch(value)} />
                            </Box>
                            <Stack mb='16.8px' direction='row' spacing={1}>
                                <Box width='188px'>

                                    <CustomDropdown
                                        placeholderValue='Sort by'
                                        menuItems={sortBy}
                                        value={dropdownOptions.sortBy}
                                        handleDropdownValue={(value) => {
                                            setDropdownOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortBy: value
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortBy: value.toLowerCase()
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                type: 'desk'
                                            }))
                                            setIsFiltered(true)
                                        }}
                                    />
                                </Box>

                                <Box>

                                    <CustomDropdown
                                        placeholderValue='Sort order'
                                        menuItems={sortOrder}
                                        value={dropdownOptions.sortOrder}
                                        handleDropdownValue={(value) => {
                                            setDropdownOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortOrder: value
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortOrder: value.toLowerCase()
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                type: 'desk'
                                            }))
                                            setIsFiltered(true)
                                        }}
                                    />
                                </Box>

                                <Button variant='contained' sx={{ height: '55px', borderRadius: '8px' }} onClick={resetFilters}>
                                    Clear Filters <FilterAltOff />
                                </Button>

                            </Stack>
                            <InfiniteScroll
                                dataLength={desks.length}
                                next={isFiltered ? fetchMoreListingsByFilter : fetchMoreListings}
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
                                        {desks.length !== 0 && (
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
                                {desks.map((value, index) => (
                                    <DeskCard key={index}
                                        photo={value.images[0]}
                                        name={value.name}
                                        description={value.description}
                                        floorNumber={value.floorNumber}
                                        capacity={value.capacity}
                                        value={value}
                                    />
                                ))}
                            </InfiniteScroll>
                            {(desks.length === 0 && firstRender === false) && (
                                <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center' mt='50px'>
                                    <Empty />
                                    <Typography>No data to display</Typography>
                                </Box>
                            )}
                        </>
                    ) : value === 1 ? (
                        <>
                            <Box sx={{ marginBottom: '16.8px' }}  >
                                <SearchBar placeholderValue='Search Meeting Rooms' handleSetValue={(value) => handleSearch(value)} />
                            </Box>
                            <Stack mb='16.8px' direction='row' spacing={1}>

                                <Box width='188px'>
                                    <CustomDropdown
                                        placeholderValue='Sort by'
                                        menuItems={sortBy}
                                        value={dropdownOptions.sortBy}
                                        handleDropdownValue={(value) => {
                                            setDropdownOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortBy: value
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortBy: value.toLowerCase()
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                type: 'meeting_room'
                                            }))
                                            setIsFiltered(true)
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <CustomDropdown
                                        placeholderValue='Sort order'
                                        menuItems={sortOrder}
                                        value={dropdownOptions.sortOrder}
                                        handleDropdownValue={(value) => {
                                            setDropdownOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortOrder: value
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortOrder: value.toLowerCase()
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                type: 'meeting_room'
                                            }))
                                            setIsFiltered(true)
                                        }}
                                    />
                                </Box>

                                <Button variant='contained' sx={{ height: '55px', borderRadius: '8px' }} onClick={resetFilters}>
                                    Clear Filters <FilterAltOff />
                                </Button>

                            </Stack>
                            <InfiniteScroll
                                dataLength={meetingRooms.length}
                                next={isFiltered ? fetchMoreListingsByFilter : fetchMoreListings}
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
                                        {meetingRooms.length !== 0 && (
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
                                {meetingRooms.map((value, index) => (
                                    <DeskCard key={index}
                                        photo={value.images[0]}
                                        name={value.name}
                                        description={value.description}
                                        floorNumber={value.floorNumber}
                                        capacity={value.capacity}
                                        value={value}
                                    />
                                ))}
                            </InfiniteScroll>
                            {(meetingRooms.length === 0 && firstRender === false) && (
                                <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center' mt='50px'>
                                    <Empty />
                                    <Typography>No data to display</Typography>
                                </Box>
                            )}
                        </>
                    ) : (
                        <>
                            <Box sx={{ marginBottom: '16.8px' }}  >
                                <SearchBar placeholderValue='Search Private Offices' handleSetValue={(value) => handleSearch(value)} />
                            </Box>
                            <Stack mb='16.8px' direction='row' spacing={1}>

                                <Box width='188px'>
                                    <CustomDropdown
                                        placeholderValue='Sort by'
                                        menuItems={sortBy}
                                        value={dropdownOptions.sortBy}
                                        handleDropdownValue={(value) => {
                                            setDropdownOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortBy: value
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortBy: value.toLowerCase()
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                type: 'private_office'
                                            }))
                                            setIsFiltered(true)
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <CustomDropdown
                                        placeholderValue='Sort order'
                                        menuItems={sortOrder}
                                        value={dropdownOptions.sortOrder}
                                        handleDropdownValue={(value) => {
                                            setDropdownOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortOrder: value
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                sortOrder: value.toLowerCase()
                                            }))
                                            setFilterOptions((prevOptions) => ({
                                                ...prevOptions,
                                                type: 'private_office'
                                            }))
                                            setIsFiltered(true)
                                        }}
                                    />
                                </Box>

                                <Button variant='contained' sx={{ height: '55px', borderRadius: '8px' }} onClick={resetFilters}>
                                    Clear Filters <FilterAltOff />
                                </Button>

                            </Stack>
                            <InfiniteScroll
                                dataLength={privateOffices.length}
                                next={isFiltered ? fetchMoreListingsByFilter : fetchMoreListings}
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
                                        {privateOffices.length !== 0 && (
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
                                {privateOffices.map((value, index) => (
                                    <DeskCard key={index}
                                        photo={value.images[0]}
                                        name={value.name}
                                        description={value.description}
                                        floorNumber={value.floorNumber}
                                        capacity={value.capacity}
                                        value={value}
                                    />
                                ))}
                            </InfiniteScroll>

                            {(privateOffices.length === 0 && firstRender === false) && (
                                <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center' mt='50px'>
                                    <Empty />
                                    <Typography>No data to display</Typography>
                                </Box>
                            )}
                        </>
                    )
                    }
                </Box>


            </Box >


            {/* Add New Listing */}
            < Drawer
                anchor={'right'}
                open={openDrawer}
                PaperProps={{
                    sx: { width: "calc(100% - 260px)" },
                }
                }
            >
                <Box sx={{ width: '100%', padding: '48px 32.2px' }}>
                    <AddNewListing
                        handleCloseDrawer={() => { setOpenDrawer(false) }}
                    />
                </Box>
            </Drawer >

        </>
    )
}

export default Listing