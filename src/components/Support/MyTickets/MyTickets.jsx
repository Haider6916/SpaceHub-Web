import { Box, Chip, Grid, IconButton, Typography, Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchBar from '../../SearchBar/SearchBar'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ArrowUpward, FilterAltOff } from '@mui/icons-material'
import { ReactComponent as Empty } from '../../../Assets/SVGs/Empty.svg';
import SkeletonLoader from '../../SkeletonLoader.jsx/SkeletonLoader'
import SupportCard from '../SupportCard/SupportCard'
import { myTicketsReloadFalse, openAddTicketDrawer } from '../../../Redux/supportSlice'
import { useDispatch, useSelector } from 'react-redux'
import CustomDropdown from '../../CustomDropdown/CustomDropdown'
import { toast } from 'react-hot-toast'
import { privateRequest } from '../../../ApiMethods'
import MyTicketCard from '../SupportCard/MyTicketCard'

function MyTickets() {

    const dispatch = useDispatch()
    const shouldReload = useSelector((state) => state.support.shouldMyTicketsReload)

    const [isLoading, setIsLoading] = useState(true)
    const [myTickets, setMyTickets] = useState([])
    const [firstRender, setFirstRender] = useState(true)
    const [hasNextPage, setHasNextPage] = useState(null)
    const [nextPage, setNextPage] = useState(0)
    const [isFiltered, setIsFiltered] = useState(false)

    //To set dropdown values
    const [dropdownOptions, setDropdownOptions] = useState(
        {
            sortBy: '',
            sortOrder: '',
            status: ''
        }
    )


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSearch = (apiResponse) => {
        setMyTickets(apiResponse.docs);
        setHasNextPage(apiResponse.hasNextPage)
        setNextPage(apiResponse.nextPage)
    }


    const fetchTickets = () => {
        privateRequest.get('/ticket/my-tickets', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            setMyTickets(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
            setFirstRender(false)
            setIsLoading(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchMoreTicekts = () => {
        let searchUrl = sessionStorage.getItem("searchURL");
        privateRequest
            .get(searchUrl === '' ? '/ticket/my-tickets' : searchUrl, {
                headers: {
                    'x-pagination-skip': nextPage,
                    'x-pagination-limit': 10
                }
            })
            .then((res) => {
                let tempArray = [...myTickets];
                tempArray = tempArray.concat(res.data.docs)
                setMyTickets(tempArray);
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message);
            });
    }

    const fetchTicketsByFilter = () => {

        let obj = {
            'Ticket Number': 'ticketNum',
            'Subject': 'title',
            'Created At': 'createdAt',
            'Last Updated': 'updatedAt',
            'status': 'status'
        }

        let apiObject = {}

        Object.keys(dropdownOptions).forEach((key) => {
            if (dropdownOptions[key] !== '') {
                apiObject[key] = dropdownOptions[key];
            }
        });

        if (apiObject.sortBy) {
            apiObject.sortBy = obj[dropdownOptions.sortBy]
        }

        if (apiObject.sortOrder) {
            apiObject.sortOrder = dropdownOptions.sortOrder === 'Desc' ? 0 : 1
        }

        privateRequest.post('ticket/my-tickets/filter', apiObject, {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            setMyTickets(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchMoreTicketsByFilter = () => {

        let obj = {
            'Ticket Number': 'ticketNum',
            'Subject': 'title',
            'Created At': 'createdAt',
            'Last Updated': 'updatedAt',
        }

        let apiObject = {}

        Object.keys(dropdownOptions).forEach((key) => {
            if (dropdownOptions[key] !== '') {
                apiObject[key] = dropdownOptions[key];
            }
        });

        if (apiObject.sortBy) {
            apiObject.sortBy = obj[dropdownOptions.sortBy]
        }

        if (apiObject.sortOrder) {
            apiObject.sortOrder = dropdownOptions.sortOrder === 'Desc' ? 0 : 1
        }

        privateRequest.post('ticket/my-tickets/filter', apiObject, {
            headers: {
                'x-pagination-skip': nextPage,
                'x-pagination-limit': 10
            }
        })
            .then((res) => {
                let tempArray = [...myTickets];
                tempArray = tempArray.concat(res.data.docs)
                setMyTickets(tempArray);
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message);
            });
    }

    const resetFilters = () => {
        const emptyDropdownOptions = {
            sortBy: '',
            sortOrder: '',
            status: ''
        };

        if (
            JSON.stringify(dropdownOptions) === JSON.stringify(emptyDropdownOptions)
        ) {
            return;
        }

        setDropdownOptions(emptyDropdownOptions);
        setIsFiltered(false)
    }


    useEffect(() => {
        if (firstRender) {
            fetchTickets()
        } else {
            if (isFiltered) {
                fetchTicketsByFilter()
            } else {
                fetchTickets()
            }
        }
    }, [dropdownOptions])


    useEffect(() => {
        if (shouldReload) {
            fetchTickets()
            dispatch(myTicketsReloadFalse())
        }
    }, [shouldReload])


    if (isLoading) {
        return <SkeletonLoader />
    }

    return (



        <Box sx={{ width: '100%', marginTop: '24px' }}>
            <Box sx={{ marginBottom: '16.55px' }}  >
                <SearchBar placeholderValue='Search My Ticket' handleSetValue={(value) => handleSearch(value)} />
            </Box>

            <Stack mb='34.6px' direction='row' spacing={1}>

                <Box>
                    <CustomDropdown
                        placeholderValue='Status'
                        menuItems={['Pending', 'Done']}
                        value={dropdownOptions.status}
                        handleDropdownValue={(value) => {
                            setDropdownOptions((prevOptions) => ({
                                ...prevOptions,
                                status: value
                            }))
                            setIsFiltered(true)
                        }}
                    />
                </Box>

                <Box>
                    <CustomDropdown
                        placeholderValue='Sort by'
                        menuItems={['Ticket Number', 'Subject', 'Created At', 'Last Updated']}
                        value={dropdownOptions.sortBy}
                        handleDropdownValue={(value) => {
                            setDropdownOptions((prevOptions) => ({
                                ...prevOptions,
                                sortBy: value
                            }))

                            setIsFiltered(true)
                        }}
                    />
                </Box>

                <Box>
                    <CustomDropdown
                        placeholderValue='Sort order'
                        menuItems={["Asc", "Desc"]}
                        value={dropdownOptions.sortOrder}
                        handleDropdownValue={(value) => {
                            setDropdownOptions((prevOptions) => ({
                                ...prevOptions,
                                sortOrder: value
                            }))

                            setIsFiltered(true)
                        }}
                    />
                </Box>

                <Button variant='contained' sx={{ height: '55px', borderRadius: '8px' }} onClick={resetFilters}>
                    Clear Filters <FilterAltOff />
                </Button>

            </Stack>

            <Box sx={{ marginBottom: '16px', height: '48px', width: '100%', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-around', borderRadius: '8px', padding: '12px 42px' }}  >

                <Grid container>
                    <Grid item xs={4}>
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#444344' }}>
                            Subject
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#444344' }}>
                            Status
                        </Typography>
                    </Grid>

                    <Grid item xs={4} >
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#444344' }}>
                            Date sent
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {
                myTickets.length !== 0 && (
                    <InfiniteScroll
                        dataLength={myTickets.length}
                        next={isFiltered ? fetchMoreTicketsByFilter : fetchMoreTicekts}
                        hasMore={hasNextPage}
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
                        {myTickets.map((value, index) => (
                            <MyTicketCard
                                ticketDetails={value}
                                key={index}
                            />
                        ))}
                    </InfiniteScroll>
                )
            }
            {(myTickets.length === 0 && firstRender === false) &&
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: '135.63px' }} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Empty />
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556', mt: '24px' }}>
                            No tickets found yet add new
                        </Typography>
                        <Button
                            onClick={() => { dispatch(openAddTicketDrawer()) }}
                            variant='contained'
                            sx={{ fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', mt: "24px" }}
                        >
                            Add Ticket
                        </Button>
                    </Box>
                </Box>}
        </Box>

    )
}

export default MyTickets