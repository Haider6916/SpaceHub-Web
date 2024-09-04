import { Avatar, Box, Typography, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { ReactComponent as OtherCalendarLine } from '../../Assets/SVGs/OtherCalendarLine.svg';
import { ReactComponent as RedCross } from '../../Assets/SVGs/RedCross.svg';
import { ReactComponent as PurpleTick } from '../../Assets/SVGs/PurpleTick.svg';
import { ReactComponent as Empty } from '../../Assets/SVGs/Empty.svg';
import { ReactComponent as Dots } from '../../Assets/SVGs/DotsThree.svg';

import SkeletonLoader from '../SkeletonLoader.jsx/SkeletonLoader';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../ApiMethods';


const OtherCalendar = () => {

    const [sharedUsersList, setSharedUsersList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(true)

    const fetchOtherCalendar = () => {
        privateRequest.get(`/calendar/others-invites`).then((res) => {
            setSharedUsersList(res.data);
            setIsLoading(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const handleAcceptInvite = (employee) => {
        privateRequest.put(`/calendar/accept-invite/${employee.user._id}`).then((res) => {
            toast.success(res.data.message);
            fetchOtherCalendar()
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const handleRejectInvite = (employee) => {
        privateRequest.put(`/calendar/reject-invite/${employee.user._id}`).then((res) => {
            toast.success(res.data.message);
            fetchOtherCalendar()
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleRemoveInviter = () => {
        alert('Make API CAll')
        setAnchorEl(null);
    }

    useEffect(() => {
        fetchOtherCalendar()
    }, [])

    if (isLoading) {
        return <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
            <SkeletonLoader userHeight={'420px'} />
        </Box>
    }

    return (

        <>
            <div style={{ width: '100%', height: '100%', marginTop: "10px" }}>
                {
                    sharedUsersList.map((employee, index) => (
                        <>
                            <div key={employee.user._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0px 28px 0px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', }}>
                                    <Avatar
                                        alt="Avatar"
                                        src={employee.user.assigneePicture}
                                        sx={{ width: '40px', height: '40px', mr: '10px' }}
                                    />
                                    <Typography sx={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px', color: "#444344" }}>
                                        {employee.user.firstName.en} {employee.user.lastName.en}
                                    </Typography>
                                </div>

                                {
                                    employee.status === 'Pending' && <div style={{ display: 'flex', alignItems: 'center', gap: "24px" }}>
                                        <PurpleTick onClick={() => { handleAcceptInvite(employee) }} style={{ cursor: "pointer" }} />
                                        <RedCross onClick={() => { handleRejectInvite(employee) }} style={{ cursor: "pointer" }} />
                                    </div>
                                }
                                {
                                    employee.status === 'Accepted' &&
                                    <>
                                        <Box onClick={handleClick}
                                            sx={{
                                                backgroundColor: '#FFFFFF',
                                                boxShadow: '0px 1px 4px rgba(2, 0, 1, 0.1)',
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                cursor: 'pointer'

                                            }}
                                        >
                                            <Dots />
                                        </Box>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={() => setAnchorEl(null)}
                                            PaperProps={{
                                                style: {
                                                    width: '188px',
                                                    background: '#FAFAFA',
                                                    border: '1px solid #F5F6F4',
                                                    borderRadius: '8px',
                                                    padding: '0px',
                                                    fontSize: '16px',
                                                    lineHeight: '28px',
                                                    color: '#7D7B7C',
                                                    marginLeft: '-140px',
                                                    marginTop: "0px",
                                                    boxShadow: '0px 10px 41px 0px rgba(0,0,0,0.3)'
                                                },
                                            }}
                                        >

                                            <MenuItem onClick={() => {
                                                handleRemoveInviter()
                                            }}
                                            >
                                                Remove Request
                                            </MenuItem>
                                        </Menu >
                                    </>
                                }
                            </div>
                            {sharedUsersList.length - 1 !== index &&
                                <OtherCalendarLine />
                            }
                        </>
                    ))
                }

            </div>

            {(sharedUsersList.length === 0 && isLoading === false) &&

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Empty />
                    <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556', mt: '24px' }}>
                        No request at this moment
                    </Typography>
                </Box>

            }


        </>
    )
}

export default OtherCalendar