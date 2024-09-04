import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header/Header'
import Chart from '../../../components/Bar Chart/Chart'
import { privateRequest } from '../../../ApiMethods';
import { ReactComponent as AddedCompany } from '../../../Assets/SVGs/AddedCompany.svg';
import { ReactComponent as TotalVisitors } from '../../../Assets/SVGs/TotalVisitors.svg';
import { ReactComponent as ArrowRight } from '../../../Assets/SVGs/ArrowRight.svg';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { toast } from 'react-hot-toast';
function Dashboard() {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([])
    const [dashboardData, setDashboardData] = useState(
        {
            "totalCompanies": 0,
            "totalUsers": 0,
            "totalResources": 0,
            "totalVisitors": 0
        }
    )

    const fetchAnnouncemnts = () => {
        privateRequest.get('/announcement?latest=true', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 5
            }
        }).then((res) => {
            setAnnouncements(res.data.docs)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchDashboard = () => {
        privateRequest.get('/dashboard', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 5
            }
        }).then((res) => {
            setDashboardData(res.data)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    useEffect(() => {
        fetchAnnouncemnts()
        fetchDashboard()
    }, [])

    const convertDateFormat = (dateTimeString) => {

        const date = new Date(dateTimeString);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();

        return `${day}/${month}/${year}`;
    }

    return (
        <Box>
            <Header />

            <Box sx={{
                marginLeft: '22px',
                marginTop: '29.37px',
            }}>


                <Carousel>
                    {announcements.map((value, index) => {
                        let date = convertDateFormat(value.createdAt)

                        return (<Box key={index} sx={{
                            // width: '1094px',
                            width: 'calc( 100% - 22px )',
                            height: '200.63px',
                            background: '#8D55A2',
                            border: '1px solid #DBDBDA',
                            borderRadius: '8px',
                            display: 'flex'
                        }}>
                            <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80" alt="Image" style={{ width: '271px', height: '198.63px', borderRadius: '8px' }} />
                            <Box sx={{ margin: '26.31px 17px 26.31px 24px', width: '100%' }}>

                                <Box sx={{ display: "flex", justifyContent: 'space-between', width: '100%' }}>
                                    <Box>
                                        <Typography sx={{
                                            fontSize: '20px', lineHeight: '28px', color: '#FFFFFF',
                                            width: '100%',// wordWrap: 'break-word',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                        }}>
                                            {value.title}
                                        </Typography>
                                    </Box>

                                    <Typography onClick={() => { navigate('/dashboard/announcements') }} sx={{ fontSize: '20px', lineHeight: '28px', color: '#FFFFFF', cursor: 'pointer' }}>See all</Typography>

                                </Box>

                                <Typography sx={{ fontSize: '16px', lineHeight: '28px', color: '#FFFFFF' }}>{date}</Typography>

                                <Box width='100%' >
                                    <Typography
                                        sx={{
                                            fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', maxWidth: 'inherit', wordWrap: 'anywhere'
                                        }}>
                                        {value.description}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>)
                    })}
                </Carousel>



                <Box sx={{ display: 'flex', marginTop: '24px', justifyContent: 'space-between', width: 'calc( 100% - 22px )', }}>

                    <Box sx={{ width: '488px', height: '336px', border: '1px solid #DBDBDA', borderRadius: '8px' }}>
                        <Typography sx={{
                            fontFamily: 'Poppins',
                            fontStyle: "normal",
                            fontWeight: "700",
                            fontSize: "24px",
                            lineHeight: "36px",
                            color: "#272627",
                            marginTop: '16px',
                            marginLeft: '35px'
                        }}>Visitors per day</Typography>
                        <Chart />
                    </Box>

                    <Box>
                        {/* Companies Added */}
                        <Box sx={{
                            width: '580.73px',
                            height: '113.22px',
                            background: '#F5F6F4',
                            borderRadius: '4px',
                            marginLeft: '25.27px'
                        }}>
                            <Box sx={{ marginLeft: '40.73px', display: 'flex', }}>
                                {/* Logo */}
                                <AddedCompany style={{ marginTop: '26.61px' }} />
                                {/* Texts */}
                                <Box sx={{ marginLeft: '15px', marginTop: '26.61px', width: '155px' }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '24px',
                                            lineHeight: '28px',
                                            color: '#272627'
                                        }}
                                    >
                                        {dashboardData.totalCompanies}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 400,
                                            fontSize: '18px',
                                            lineHeight: '28px',
                                            color: '#565556'
                                        }}
                                    >
                                        Added comapanies
                                    </Typography>
                                </Box>
                                {/* View All */}
                                <Box onClick={() => { navigate('/directory', { state: { value: 1 } }) }} sx={{ cursor: 'pointer', display: 'flex', marginLeft: '153.34px', padding: '0', marginTop: '42.61px' }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '16px',
                                            lineHeight: '28px',
                                            color: '#8D55A2'
                                        }}
                                    >
                                        View all
                                    </Typography>
                                    <ArrowRight style={{ marginLeft: '24px' }} />
                                </Box>
                            </Box>
                        </Box>

                        {/* Total Visitor */}
                        <Box sx={{
                            width: '580.73px',
                            height: '113.22px',
                            background: '#F5F6F4',
                            borderRadius: '4px',
                            marginLeft: '25.27px',
                            marginTop: '19.31px'
                        }}>
                            <Box sx={{ marginLeft: '40.73px', display: 'flex', }}>
                                {/* Logo */}
                                <TotalVisitors style={{ marginTop: '26.61px' }} />
                                {/* Texts */}
                                <Box sx={{ marginLeft: '15px', marginTop: '26.61px', width: '155px' }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '24px',
                                            lineHeight: '28px',
                                            color: '#272627'
                                        }}
                                    >
                                        {dashboardData.totalVisitors}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 400,
                                            fontSize: '18px',
                                            lineHeight: '28px',
                                            color: '#565556'
                                        }}
                                    >
                                        Total Visitors
                                    </Typography>
                                </Box>
                                {/* View All */}
                                <Box onClick={() => { navigate('/visitors') }} sx={{ cursor: 'pointer', display: 'flex', marginLeft: '153.34px', padding: '0', marginTop: '42.61px' }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '16px',
                                            lineHeight: '28px',
                                            color: '#8D55A2'
                                        }}
                                    >
                                        View all
                                    </Typography>
                                    <ArrowRight style={{ marginLeft: '24px' }} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>



            </Box>



        </Box >
    )
}

export default Dashboard