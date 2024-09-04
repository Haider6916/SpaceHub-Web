import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header/Header'
import { Box, Button, Chip, Drawer, Grid, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material'
import { ReactComponent as Empty } from '../../../Assets/SVGs/Empty.svg';
import AddNewListing from '../../../components/NewListingDrawer/AddNewListing';
import CustomDropdown from '../../../components/CustomDropdown/CustomDropdown';
import SearchBar from '../../../components/SearchBar/SearchBar';
import VisitorCard from '../../../components/VisitorsCards/VisitorCard';
import AddNewVisitor from '../../../components/AddNewVisitors/AddNewVisitor';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../../ApiMethods';
import { ArrowUpward } from '@mui/icons-material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { visitorsReloadFalse } from '../../../Redux/visitorsSlice';
import { useDispatch, useSelector } from 'react-redux';
function Visitors() {

    const shouldReload = useSelector((state) => state.visitor.shouldVisitorsReload)
    const dispatch = useDispatch()

    const [openDrawer, setOpenDrawer] = useState(false)
    const [visitorsData, setVisitorsData] = useState([])
    const [firstRender, setFirstRender] = useState(true)
    const [hasNextPage, setHasNextPage] = useState(null)
    const [nextPage, setNextPage] = useState(0)

    const handleSearch = (apiResponse) => {
        setVisitorsData(apiResponse.docs);
        setHasNextPage(apiResponse.hasNextPage)
        setNextPage(apiResponse.nextPage)
    }

    const fetchVisitors = () => {
        privateRequest.get('/user/visitor', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            console.log('res.data', res.data);
            setFirstRender(false)
            setVisitorsData(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })

    }

    const fetchMoreVisitors = () => {
        let searchUrl = sessionStorage.getItem("searchURL");
        privateRequest
            .get(searchUrl === '' ? '/user/visitor' : searchUrl, {
                headers: {
                    'x-pagination-skip': nextPage,
                    'x-pagination-limit': 10
                }
            })
            .then((res) => {
                let tempArray = [...visitorsData];
                tempArray = tempArray.concat(res.data.docs)
                setVisitorsData(tempArray);
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message);
            });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        fetchVisitors()
    }, [])

    useEffect(() => {
        if (shouldReload) {
            fetchVisitors()
            dispatch(visitorsReloadFalse())
        }
    }, [shouldReload])

    return (
        <>
            <Header />
            <Box sx={{
                padding: "32px",

            }}>
                <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                    <Box>
                        <Typography sx={{ fontWeight: "700", fontSize: '32px', lineHeight: '41.66px', color: '#272627' }}>
                            Visitors
                        </Typography>
                        <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23.44px', color: '#565556', mt: '8.87px' }}>
                            Add visitors your co-working space
                        </Typography>
                    </Box>
                    <Button
                        onClick={() => setOpenDrawer(true)}
                        variant='contained'
                        sx={{ fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', mt: '18.21px' }}
                    >
                        Add visitors
                    </Button>
                </Box>









                <Box sx={{ width: '100%', marginTop: '24px' }}>
                    <Box sx={{ marginBottom: '25px' }}  >
                        <SearchBar placeholderValue='Search Visitors' handleSetValue={(value) => handleSearch(value)} />
                    </Box>

                    <Box sx={{ marginBottom: '16px', height: '48px', width: '100%', backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'space-around', borderRadius: '8px', padding: '12px 42px' }}  >

                        <Grid container>
                            <Grid item xs={3.5}>
                                <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#444344' }}>
                                    Guests
                                </Typography>
                            </Grid>


                            <Grid item xs={3.3}>
                                <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#444344' }}>
                                    Visit reason
                                </Typography>
                            </Grid>

                            <Grid item xs={2.4}>
                                <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#444344' }}>
                                    Status
                                </Typography>
                            </Grid>

                            <Grid item xs={2.8} >
                                <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#444344' }}>
                                    Visit Time
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {
                        visitorsData.length !== 0 && (
                            <InfiniteScroll
                                dataLength={visitorsData.length}
                                next={fetchMoreVisitors}
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
                                {visitorsData.map((value, index) => (
                                    <VisitorCard
                                        name={value.name}
                                        visitDuration={value.visitDuration}
                                        visitReason={value.visitReason}
                                        tag={'Pending'}
                                        hostName={`${value.host.firstName.en} ${value.host.lastName.en}`}
                                    />
                                ))}
                            </InfiniteScroll>
                        )
                    }
                    {(visitorsData.length === 0 && firstRender === false) &&
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '135.63px' }} >
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Empty />
                                <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556', mt: '24px' }}>
                                    No visitors found yet add new
                                </Typography>
                                <Button
                                    onClick={() => setOpenDrawer(true)}
                                    variant='contained'
                                    sx={{ fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', mt: "24px" }}
                                >
                                    Add visitors
                                </Button>
                            </Box>
                        </Box>
                    }
                </Box>

            </Box >


            {/* Add New Listing */}
            < Drawer
                anchor={'right'}
                open={openDrawer}
                PaperProps={{
                    sx: { width: "611px" },
                }
                }
            >
                <Box sx={{ width: '100%', padding: '48px 32.2px' }}>
                    <AddNewVisitor
                        handleCloseDrawer={() => { setOpenDrawer(false) }}
                    />
                </Box>
            </Drawer >

        </>
    )
}

export default Visitors