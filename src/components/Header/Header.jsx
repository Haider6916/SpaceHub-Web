import { Box, Badge, Typography, Grid, Button, Select, Menu, MenuItem, Avatar } from '@mui/material'
import React, { useState } from 'react'
import { ReactComponent as HeaderLines } from '../../Assets/SVGs/Header1.svg';
import { ReactComponent as Dropdown } from '../../Assets/SVGs/Dropdown.svg';
import { ReactComponent as Message } from '../../Assets/SVGs/Message.svg';
import { ReactComponent as Notification } from '../../Assets/SVGs/Notification.svg';
import { ReactComponent as Search } from '../../Assets/SVGs/Search.svg';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from "../../Redux/authSlice.js";
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userDetails);


    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAPI = () => {
        console.log('i am API Calling function');
    }

    const handleLogout = () => {
        dispatch(logoutSuccess())
        navigate('/login')
    }

    return (
        <Box sx={{
            width: 'auto',
            // maxWidth: '1180px',
            height: '106px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E9EAE9'
        }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                <Box sx={{
                    marginLeft: '34.67px',
                }}>
                    <HeaderLines />
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '88.67px',
                    background: '#FFFFFF',
                    border: '0.6px solid #9F9D9E',
                    borderRadius: '444px',
                    width: '329px',
                    height: '58px',
                }}>
                    <Search style={{ marginLeft: '32.5px', marginRight: '4px' }} />
                    <input
                        placeholder="Search for anything"
                        onChange={handleAPI}
                        style={{
                            height: '28px',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '24px',
                            border: '0px',
                            outline: 'none',
                            boxShadow: 'none',
                            color: '#9F9D9E'
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge badgeContent={10} color="primary" sx={{ marginRight: '48px' }}>
                    <Message color="action" />
                </Badge>

                <Badge badgeContent={1} color="primary" sx={{ marginRight: '48px' }}>
                    <Notification color="action" />
                </Badge>


                <Box onClick={handleClick} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <Avatar
                        alt="Profile"
                        src={userData.profilePicture}
                        sx={{ width: '40px', height: '40px', marginRight: '8px', border: '1px solid #9F9D9E' }}
                    />
                    <Typography sx={{ marginRight: '23px' }}> {userData.firstName.en} {userData.lastName.en}</Typography>
                    <Dropdown style={{ width: '15px', marginRight: '71px' }} />
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
                            color: '#7D7B7C'
                        },
                    }}
                >

                    <MenuItem >Option 1</MenuItem>
                    <MenuItem >Option 2</MenuItem>
                    <MenuItem onClick={() => { handleLogout(); setAnchorEl(null) }}>Logout</MenuItem>

                </Menu >

                {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={Avatar} alt="Avatar" style={{ marginRight: '8px' }} />
                    <Typography sx={{ marginRight: '23px' }}> Uzair Muaz</Typography>

                    <div class="dropdown" style={{ width: '15px', marginRight: '71px' }}>
                        <Dropdown />
                        <div class="dropdown-content">
                            <Box>
                                <Button variant='text' >Option XYZ</Button>
                                <Button variant='text' >Option XYZ</Button>
                                <Button variant='text'>Option XYZ</Button>
                                <Button variant='text' onClick={handleLogout}>Logout</Button>
                            </Box>
                        </div>
                    </div>

                </Box> */}

            </Box>

            {/* <Box>
                <Button variant='outlined' onClick={handleLogout}>Temporary Logout</Button>
            </Box> */}

        </Box >
    )
}

export default Header