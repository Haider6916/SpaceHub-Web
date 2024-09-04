import { Box, Breadcrumbs, Link, Typography, Button, Drawer, Chip, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import AnnouncementCard from '../../../components/AnnouncementCard/AnnouncementCard';
import SearchBar from '../../../components/SearchBar/SearchBar';
import AddAnnouncement from '../../../components/AddAnnouncement/AddAnnouncement';
import { privateRequest } from '../../../ApiMethods';
import { toast } from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ArrowUpward } from '@mui/icons-material';
import { ReactComponent as Empty } from '../../../Assets/SVGs/Empty.svg';

function Announcements() {


    const breadcrumbs = [
        <Link underline="hover" key="1" href="/dashboard" sx={{ color: "#8D55A2", fontStyle: 'normal', fontWeight: '400', fontSize: '18px', lineHeight: '23px' }}>
            Dashboard
        </Link>,
        <Typography key="2" sx={{ color: "#7D7B7C", fontStyle: 'normal', fontWeight: '400', fontSize: '18px', lineHeight: '23px' }} >
            Announcements
        </Typography>,
    ];

    const [announcement, setAnnouncement] = useState([])
    const [firstRender, setFirstRender] = useState(true)
    const [addAnnouncement, setAddAnnouncement] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(null)
    const [nextPage, setNextPage] = useState(0)

    useEffect(() => {
        fetchAnnouncemnts()
    }, [])


    const fetchAnnouncemnts = () => {

        console.log('fetch announcement is running');

        privateRequest.get('/announcement?latest=false', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            setAnnouncement(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
            setFirstRender(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })

    }

    const fetchMoreAnnouncemnts = () => {
        let searchUrl = sessionStorage.getItem("searchURL");
        privateRequest
            .get(searchUrl === '' ? '/announcement?latest=false' : searchUrl, {
                headers: {
                    'x-pagination-skip': nextPage,
                    'x-pagination-limit': 10
                }
            })
            .then((res) => {
                let tempArray = [...announcement];
                tempArray = tempArray.concat(res.data.docs)
                setAnnouncement(tempArray);
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

    const handleSearch = (apiResponse) => {
        setAnnouncement(apiResponse.docs);
        setHasNextPage(apiResponse.hasNextPage)
        setNextPage(apiResponse.nextPage)
    }

    return (
        <>

            <Header />

            <Box sx={{ marginLeft: '31.93px', marginTop: '48.62px' }}>

                <Box>
                    <Breadcrumbs separator={<span style={{ color: '#444344' }}>›</span>} aria-label="breadcrumb" sx={{
                    }}>
                        {breadcrumbs}
                    </Breadcrumbs>
                </Box>

                <Box sx={{ marginTop: '24.2px' }}>
                    <Typography sx={{ fontStyle: 'normal', fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                        Announcements
                    </Typography>
                </Box>

                <Box sx={{ marginTop: '8.87px', display: 'flex', justifyContent: "space-between", width: 'calc(100% - 31.93px )' }}>
                    <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                        Look with us for the latest news
                    </Typography>

                    <Button
                        variant='contained'
                        sx={{
                            fontWeight: '500',
                            fontSize: '16px',
                            lineHeight: '28px',
                            marginTop: '22px',
                            padding: '0 20px',
                            height: '40px'
                        }}
                        onClick={() => setAddAnnouncement(true)}
                    >
                        Add Announcement
                    </Button>
                </Box>

                <Box sx={{ marginTop: '24.22px', width: 'calc(100% - 31.93px )' }} >
                    <SearchBar placeholderValue='Search Announcements' handleSetValue={(value) => handleSearch(value)} />
                </Box>

                {announcement.length !== 0 && (
                    <Box sx={{ marginTop: '24px' }}>
                        <InfiniteScroll
                            dataLength={announcement.length}
                            next={fetchMoreAnnouncemnts}
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
                            {
                                announcement.map((value, index) => (
                                    <Box key={index} sx={{ marginTop: index !== 0 ? '40px' : '0px', }}>
                                        <AnnouncementCard
                                            title={value.title}
                                            description={value.description}
                                            tags={value.tags}
                                            createdAt={value.createdAt}
                                        />
                                    </Box>
                                ))
                            }
                        </InfiniteScroll>

                    </Box>
                )}
                {(announcement.length === 0 && firstRender === false) && (
                    <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center' mt='50px' ml='-31.93px'>
                        <Empty />
                        <Typography>No data to display</Typography>
                    </Box>
                )}
            </Box>


            <Drawer
                anchor={'right'}
                open={addAnnouncement}
            >
                <Box sx={{ width: '611px', padding: '48px 32.2px' }}>
                    <AddAnnouncement
                        handleCloseDrawer={() => { setAddAnnouncement(false) }}
                        handleReload={() => { fetchAnnouncemnts() }}
                    />
                </Box>
            </Drawer>
        </>
    )
}

export default Announcements