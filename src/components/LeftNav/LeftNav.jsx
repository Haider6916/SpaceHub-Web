import { Box, Radio, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState } from 'react'

import { ReactComponent as DirectoryIcon } from "../../Assets/SVGs/Directory.svg"
import { ReactComponent as DashboardIcon } from "../../Assets/SVGs/Dashboard.svg"
import { ReactComponent as ListingIcon } from "../../Assets/SVGs/Listing.svg"
import { ReactComponent as BookingIcon } from "../../Assets/SVGs/Booking.svg"
import { ReactComponent as PlansIcon } from "../../Assets/SVGs/Plans.svg"
import { ReactComponent as VisitorsIcon } from "../../Assets/SVGs/Visitors.svg"
import { ReactComponent as EventsIcon } from "../../Assets/SVGs/Events.svg"

import { ReactComponent as SidebarCalendarIcon } from "../../Assets/SVGs/SidebarCalendar.svg"
import { ReactComponent as TasksIcon } from "../../Assets/SVGs/Tasks.svg"

import { ReactComponent as SettingsIcon } from "../../Assets/SVGs/Settings.svg"
import { ReactComponent as PerksAndBenefitsIcon } from "../../Assets/SVGs/Perks&Benefits.svg"
import { ReactComponent as SupportIcon } from "../../Assets/SVGs/Support.svg"
import { ReactComponent as LanguageIcon } from "../../Assets/SVGs/Language.svg"
import { ReactComponent as PaymentAndBillingIcon } from "../../Assets/SVGs/PaymentAndBilling.svg"
import { ReactComponent as IntegrationIcon } from "../../Assets/SVGs/Integrations.svg"

import { ReactComponent as US_Flag } from "../../Assets/SVGs/US_FLAG.svg"
import { ReactComponent as SA_FLag } from "../../Assets/SVGs/SA_FLAG.svg"

import { useLocation, useNavigate } from 'react-router-dom'
import './LeftNav.css'


function LeftNav({ children }) {
    const navigate = useNavigate()

    const main = ['Dashboard', 'Directory', 'Listing', 'Booking', 'Plans', 'Visitors', 'Events']
    const management = ['Calendar', 'Tasks']
    const other = ['Perks & Benefits', 'Support']

    const [expandSettings, setExpandSettings] = useState(false);
    const [expandLanguage, setExpandLanguage] = useState(false);



    const mainIcons = {
        Dashboard: DashboardIcon,
        Directory: DirectoryIcon,
        Listing: ListingIcon,
        Booking: BookingIcon,
        Plans: PlansIcon,
        Visitors: VisitorsIcon,
        Events: EventsIcon
    };

    const managementIcons = {
        Calendar: SidebarCalendarIcon,
        Tasks: TasksIcon
    }

    const otherIcons = {
        'Perks & Benefits': PerksAndBenefitsIcon,
        Support: SupportIcon
    }


    const scrollToBottom = () => {
        let sidebar = document.getElementById("sidebar");
        console.log('sidebar', sidebar);
        sidebar.scrollTo({
            top: sidebar.scrollHeight,
            behavior: 'smooth',
        });
    };

    const location = useLocation();
    const activeTab = location.pathname.substring(1);

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#FFFFFF', }}>

            <Box
                id='sidebar'
                sx={{
                    width: '260px',
                    border: '1px solid rgb(233, 234, 233)',
                    boxSizing: 'border-box',
                    padding: '0px',
                    margin: '0px',
                    position: 'fixed',
                    overflow: 'auto',
                    height: '100vh',
                    // scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                }}
            >
                <Box
                    sx={{
                        marginTop: '24.5px',
                        marginBottom: '60px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <img src="/Logo.png" alt="Logo" />
                </Box>


                {/* Main */}
                <Box>
                    <Typography
                        sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontStyle: 'normal',
                            fontWeight: '500',
                            fontSize: '20px',
                            lineHeight: '28px',
                            color: '#444344',
                            marginBottom: '16.28px',
                            marginLeft: '32px',
                        }}
                    >
                        Main
                    </Typography>
                    {main.map((item) => {
                        const Icon = mainIcons[item]
                        const isActive = activeTab && activeTab.toLowerCase() === item.toLowerCase();
                        return (
                            <Box
                                className={
                                    (isActive && item === 'Plans') ? 'PurpleStrokeStyle'
                                        : (isActive && item !== 'Plans') ? 'PurpleIconStyle'
                                            : item === 'Plans' ? 'StrokeStyle'
                                                : 'IconStyle'}
                                key={item}
                                onClick={() => {
                                    navigate(`/${item.toLowerCase()}`, { state: { value: 0 } });
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontStyle: 'normal',
                                    fontWeight: isActive ? '500' : '400',
                                    fontSize: '18px',
                                    lineHeight: '28px',
                                    padding: '10px 0px',
                                    color: isActive ? '#8D55A2' : '#7D7B7C',
                                    backgroundColor: isActive ? '#EEE5F1' : 'transparent',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""', //Empty string
                                        position: 'absolute',
                                        top: 0,
                                        bottom: 0,
                                        right: 0,
                                        width: '4px', // border bar width
                                        backgroundColor: isActive ? '#8D55A2' : 'transparent',
                                        borderRadius: '8px',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#EEE5F1',
                                        color: '#8D55A2',
                                        fontWeight: '500',
                                        padding: '10px 0px',
                                    },
                                }}
                            >
                                <Icon
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        marginLeft: '32px',
                                        marginRight: '16px',
                                    }}
                                />
                                {item}
                            </Box>
                        );
                    })}
                </Box>

                {/* Divider */}
                <Box sx={{ background: '#DBDBDA', height: '1px', width: '100%', mt: '12.17px' }}></Box>

                {/* Management */}
                <Box>
                    <Typography
                        sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontStyle: 'normal',
                            fontWeight: '500',
                            fontSize: '20px',
                            lineHeight: '28px',
                            color: '#444344',
                            marginBottom: '16.28px',
                            marginLeft: '32px',
                            marginTop: "29.5px"
                        }}
                    >
                        Management
                    </Typography>
                    {management.map((item) => {
                        const Icon = managementIcons[item]

                        const isActive = activeTab && activeTab.toLowerCase() === item.toLowerCase();
                        return (
                            <Box
                                className={
                                    (isActive && item === 'Calendar') ? 'PurpleStrokeStyle'
                                        : (isActive && item !== 'Calendar') ? 'PurpleIconStyle'
                                            : item === 'Calendar' ? 'StrokeStyle'
                                                : 'IconStyle'}
                                key={item}
                                onClick={() => {
                                    navigate(`/${item.toLowerCase()}`, { state: { value: 0 } });
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontStyle: 'normal',
                                    fontWeight: isActive ? '500' : '400',
                                    fontSize: '18px',
                                    lineHeight: '28px',
                                    padding: '10px 0px',
                                    color: isActive ? '#8D55A2' : '#7D7B7C',
                                    backgroundColor: isActive ? '#EEE5F1' : 'transparent',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""', //Empty string
                                        position: 'absolute',
                                        top: 0,
                                        bottom: 0,
                                        right: 0,
                                        width: '4px', // border bar width
                                        backgroundColor: isActive ? '#8D55A2' : 'transparent',
                                        borderRadius: '8px',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#EEE5F1',
                                        color: '#8D55A2',
                                        fontWeight: '500',
                                        padding: '10px 0px',
                                    },
                                }}
                            >
                                <Icon
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        marginLeft: '32px',
                                        marginRight: '16px',
                                    }}
                                />
                                {item}
                            </Box>
                        );
                    })}
                </Box>

                {/* Divider */}
                <Box sx={{ background: '#DBDBDA', height: '1px', width: '100%', mt: '12.17px' }}></Box>

                {/* Other */}
                <Box sx={{ marginBottom: '43.65px' }}>
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontStyle: 'normal',
                                fontWeight: '500',
                                fontSize: '20px',
                                lineHeight: '28px',
                                color: '#444344',
                                marginBottom: '16.28px',
                                marginLeft: '32px',
                                marginTop: "29.5px"
                            }}
                        >
                            Other
                        </Typography>
                        {other.map((item) => {
                            const Icon = otherIcons[item]
                            const isActive = activeTab && (activeTab.toLowerCase() === (item === 'Perks & Benefits' ? 'perks&benefits' : item.toLowerCase()))
                            return (
                                <Box
                                    className={
                                        (isActive && item === 'Perks & Benefits') ? 'PurpleStrokeStyle'
                                            : (isActive && item === 'Support') ? 'PurpleIconStyle'
                                                : item === 'Perks & Benefits' ? 'StrokeStyle'
                                                    : 'IconStyle'}
                                    key={item}
                                    onClick={() => {
                                        navigate(item === 'Perks & Benefits' ? '/perks&benefits' : `/${item.toLowerCase()}`, { state: { value: 0 } });
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontStyle: 'normal',
                                        fontWeight: isActive ? '500' : '400',
                                        fontSize: '18px',
                                        lineHeight: '28px',
                                        padding: '10px 0px',
                                        color: isActive ? '#8D55A2' : '#7D7B7C',
                                        backgroundColor: isActive ? '#EEE5F1' : 'transparent',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""', //Empty string
                                            position: 'absolute',
                                            top: 0,
                                            bottom: 0,
                                            right: 0,
                                            width: '4px', // border bar width
                                            backgroundColor: isActive ? '#8D55A2' : 'transparent',
                                            borderRadius: '8px',
                                        },
                                        '&:hover': {
                                            backgroundColor: '#EEE5F1',
                                            color: '#8D55A2',
                                            fontWeight: '500',
                                            padding: '10px 0px',
                                        },
                                    }}
                                >
                                    <Icon
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            marginLeft: '32px',
                                            marginRight: '16px',
                                        }}
                                    />
                                    {item}
                                </Box>
                            );
                        })}
                    </Box>

                    <Box
                        onClick={async () => {
                            await setExpandSettings(!expandSettings)
                            scrollToBottom()
                        }}
                        className={activeTab.includes('settings') ? 'PurpleIconStyle' : 'IconStyle'}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',

                            padding: '10px 0px',
                            color: activeTab.includes('settings') ? '#8D55A2' : '#7D7B7C',
                            backgroundColor: activeTab.includes('settings') ? '#EEE5F1' : '#FFFFFF',
                            position: 'relative',
                            '&::before': {
                                content: '""', //Empty string
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                width: '4px', // border bar width
                                backgroundColor: activeTab.includes('settings') ? '#8D55A2' : 'transparent',
                                borderRadius: '8px',
                            },
                            '&:hover': {
                                backgroundColor: '#EEE5F1',
                                color: '#8D55A2',
                                fontWeight: '500',
                            },
                        }}
                    >
                        <SettingsIcon
                            style={{
                                width: '24px',
                                height: '24px',
                                marginLeft: '32px',
                                marginRight: '16px',
                            }}
                        />

                        <span style={{
                            fontWeight: activeTab.includes('settings') ? '500' : '400',
                            fontSize: '18px',
                            lineHeight: '28px',
                            width: '127.61px',
                        }}>Settings</span>

                        <ExpandMoreIcon style={{ transform: expandSettings && 'rotate(180deg)' }} />
                    </Box>

                    {expandSettings &&
                        <Box sx={{ backgroundColor: '#F5F6F4', height: '128px', padding: '12px 0px 23px 0px' }}>

                            <Box
                                onClick={() => navigate('/settings/integrations')}
                                className={activeTab.includes('integrations') ? 'PurpleStrokeStyle' : 'StrokeStyle'}
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontStyle: 'normal',
                                    fontWeight: activeTab.includes('integrations') ? '500' : '400',
                                    fontSize: '18px',
                                    lineHeight: '28px',
                                    padding: '10px 0px',
                                    color: activeTab.includes('integrations') ? '#8D55A2' : '#7D7B7C',
                                    '&:hover': {
                                        color: '#8D55A2',
                                        fontWeight: '500',
                                        padding: '10px 0px',
                                    },
                                }}
                            >
                                <IntegrationIcon
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        marginLeft: '32px',
                                        marginRight: '16px',
                                    }}
                                />
                                Integrations
                            </Box>
                            <Box
                                onClick={() => navigate('/settings/payment&billing')}
                                className={activeTab.includes('payment&billing') ? 'PurpleStrokeStyle' : 'StrokeStyle'}
                                sx={{
                                    mt: "5px",
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontStyle: 'normal',
                                    fontWeight: activeTab.includes('payment&billing') ? '500' : '400',
                                    fontSize: '18px',
                                    lineHeight: '28px',
                                    padding: '10px 0px',
                                    color: activeTab.includes('payment&billing') ? '#8D55A2' : '#7D7B7C',
                                    '&:hover': {
                                        color: '#8D55A2',
                                        fontWeight: '500',
                                        padding: '10px 0px',
                                    },
                                }}
                            >
                                <PaymentAndBillingIcon
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        marginLeft: '32px',
                                        marginRight: '16px',
                                    }}
                                />
                                Payment & Billing
                            </Box>
                        </Box>
                    }

                    <Box
                        onClick={async () => {
                            await setExpandLanguage(!expandLanguage)
                            scrollToBottom()
                        }}
                        className={expandLanguage ? 'PurpleStrokeStyle' : 'StrokeStyle'}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 0px',
                            color: expandLanguage ? '#8D55A2' : '#7D7B7C',
                            backgroundColor: expandLanguage ? '#EEE5F1' : '#FFFFFF',
                            position: 'relative',
                            '&::before': {
                                content: '""', //Empty string
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                width: '4px', // border bar width
                                backgroundColor: expandLanguage ? '#8D55A2' : 'transparent',
                                borderRadius: '8px',
                            },
                            '&:hover': {
                                backgroundColor: '#EEE5F1',
                                color: '#8D55A2',
                                fontWeight: '500',
                            },
                        }}
                    >
                        <LanguageIcon
                            style={{
                                width: '24px',
                                height: '24px',
                                marginLeft: '32px',
                                marginRight: '16px',
                            }}
                        />
                        <span style={{
                            fontWeight: activeTab.includes('settings') ? '500' : '400',
                            fontSize: '18px',
                            lineHeight: '28px',
                            width: '127.61px',
                        }}>
                            Language
                        </span>

                        <ExpandMoreIcon style={{ transform: expandLanguage && 'rotate(180deg)', stroke: "none" }} />
                    </Box>

                    {expandLanguage &&
                        <Box sx={{ height: '128px', padding: '12px 0px 23px 0px', }}>
                            <Box sx={{ mt: '21.99px', display: 'flex', alignItems: "center" }}>
                                <US_Flag style={{ marginLeft: "32.61px", marginRight: '16px' }} />
                                <span style={{ color: '#7D7B7C', width: '127.61px', marginRight: '8.4px', fontSize: '18px', lineHeight: "28px", fontWeight: '400px', fontFamily: "'DM Sans', sans-serif" }}>
                                    English
                                </span>
                                <Radio />
                            </Box>

                            <Box sx={{ mt: '42px', display: 'flex', alignItems: "center", marginBottom: '43.65px' }}>
                                <SA_FLag style={{ marginLeft: "32.61px", marginRight: '16px' }} />
                                <span style={{ color: '#7D7B7C', width: '127.61px', marginRight: '8.4px', fontSize: '18px', lineHeight: "28px", fontWeight: '400px', fontFamily: "'DM Sans', sans-serif" }}>
                                    Arabic
                                </span>
                                <Radio />
                            </Box>

                        </Box>
                    }
                </Box>




            </Box>




            <Box sx={{ width: 'calc(100vw - 260px)', minHeight: '100vh', marginLeft: '260px' }}>
                {children}
            </Box>


        </Box >
    )
}

export default LeftNav