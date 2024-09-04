import { Avatar, Box, Button, ClickAwayListener, Menu, MenuItem, Paper, Popper, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../ApiMethods';
import { useSelector } from 'react-redux';
import { ReactComponent as OtherCalendarLine } from '../../Assets/SVGs/OtherCalendarLine.svg';
import { ReactComponent as Dots } from '../../Assets/SVGs/DotsThree.svg';
import { ReactComponent as Empty } from '../../Assets/SVGs/Empty.svg';
import SkeletonLoader from '../SkeletonLoader.jsx/SkeletonLoader';


const MyCalendar = () => {
    const userCompany = useSelector((state) => state.auth.userDetails.company)
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeList, setEmployeeList] = useState([])

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [sharedUsersList, setSharedUsersList] = useState([]);
    const [firstRender, setFirstRender] = useState(true)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);


    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchQuery(value);

        if (value === '') {
            // If the search field is empty, show all employees
            setFilteredEmployees(employeeList);
        } else {
            // Filter employees based on the search query
            const filtered = employeeList.filter(
                (employee) =>
                    `${employee.firstName.en} ${employee.lastName.en}`.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredEmployees(filtered);
        }
    };


    const sendInvite = async (userID) => {
        privateRequest.put(`/calendar/send-invite/${userID}`).then((res) => {
            toast.success(res.data.message);
            fetchMyCalendar()
            setSelectedEmployee(null)
            setFilteredEmployees(employeeList)
            setSearchQuery('')
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const handleMenuItemClick = (employee) => {
        setIsDropdownOpen(false);
        setSearchQuery(`${employee.firstName.en} ${employee.lastName.en}`);
        setSelectedEmployee(employee);
        setFilteredEmployees([]);
        console.log('handleMenuItemClick');
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const fetchEmployees = () => {
        privateRequest.get(`/company/${userCompany}/users`, {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 99999999
            }
        }).then((res) => {
            console.log('employeeData', res.data.docs);
            setEmployeeList(res.data.docs)
            setFilteredEmployees(res.data.docs)
            setFirstRender(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const fetchMyCalendar = () => {
        privateRequest.get(`/calendar/my-invites`).then((res) => {
            setSharedUsersList(res.data);
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    useEffect(() => {
        fetchEmployees()
        fetchMyCalendar()
    }, [])

    return (

        <div style={{ overflow: 'hidden' }}>

            <div style={{ position: 'relative', display: "flex", alignItems: 'center', margin: '17px 20.5px 0px 40px' }}>
                <ClickAwayListener onClickAway={() => { setIsDropdownOpen(false) }}>
                    <TextField
                        placeholder="Select an employee"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearch}
                        onClick={() => { setIsDropdownOpen(true) }}
                        sx={{
                            '& .MuiInputBase-root': {
                                height: '56px',
                                fontSize: '16px',
                                fontFamily: "'DM Sans', sans-serif ",
                                lineHeight: '28px',
                                color: '#7D7B7C',
                                borderRadius: '8px',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #F5F6F4', // set the border width when the input is focused
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #F5F6F4', // remove the border by default
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '0px solid #F5F6F4', // set the border width on hover
                            },
                            width: "461px",
                            backgroundColor: '#FAFAFA',
                            borderRadius: '8px',
                        }}
                        InputProps={{
                            startAdornment: selectedEmployee && (
                                <Avatar sx={{ marginRight: '8px' }} />
                            ),
                        }}
                    />
                </ClickAwayListener>

                {isDropdownOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '461px',
                            borderRadius: '8px',
                            background: 'rgb(250, 250, 250)',
                            border: '1px solid rgb(245, 246, 244)',
                            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px',
                            zIndex: 1,
                            maxHeight: '300px',
                            overflow: 'auto'
                        }}
                    >
                        {filteredEmployees.map((employee) => (
                            <MenuItem
                                key={employee.id}
                                onClick={() => { handleMenuItemClick(employee) }}
                                sx={{
                                    fontSize: '16px',
                                    lineHeight: '28px',
                                    color: '#444344',
                                    maxHeight: '300px',
                                    overflow: 'auto',
                                    '&:hover': {
                                        backgroundColor: "#EEE5F1"
                                    }
                                }}
                            >
                                <Avatar sx={{ height: '30px', width: '30px', marginRight: '8px' }} /> {employee.firstName.en} {employee.lastName.en}
                            </MenuItem>
                        ))}
                    </div>
                )}


                <Button variant='contained' onClick={() => { sendInvite(selectedEmployee._id); }} sx={{ height: '40px', padding: '0px 24px', borderRadius: '51px', marginLeft: '18px', fontSize: '16px', fontWeight: '500' }}>Share</Button>
            </div>

            {firstRender === true &&
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
                    <SkeletonLoader userHeight={'320px'} />
                </Box>
            }

            {(sharedUsersList.length === 0 && firstRender === false) &&

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: '20px' }}>
                    <Empty />
                    <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556', mt: '24px' }}>
                        No shared calendars available.
                    </Typography>
                </Box>
            }

            <div style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden', marginTop: "10px", height: '310px' }}>
                {
                    sharedUsersList.map((employee, index) => (
                        <>
                            <OtherCalendarLine />
                            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0px 28px 0px 24px', height: '48px' }}>

                                <div style={{ display: 'flex', alignItems: 'center', }}>
                                    <Avatar
                                        alt="Avatar"
                                        src={employee.receivedInvites.user.profilePicture}
                                        sx={{ width: '40px', height: '40px', mr: '10px' }}
                                    />
                                    <Typography sx={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px', color: '#444344' }}>
                                        {employee.receivedInvites.user.firstName.en} {employee.receivedInvites.user.lastName.en} {employee.receivedInvites.status === 'Pending' && '(Pending)'}
                                    </Typography>
                                </div>

                                <Box onClick={handleClick}
                                    sx={{
                                        marginTop: '9px',
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
                                            boxShadow: '0px 10px 41px 0px rgba(0,0,0,0.07)'
                                        },
                                    }}
                                >

                                    <MenuItem onClick={() => {
                                        setAnchorEl(null)
                                    }}
                                    >
                                        Remove Invitee
                                    </MenuItem>


                                </Menu >
                            </div>

                        </>
                    ))
                }
            </div>

        </div >

    )
}

export default MyCalendar