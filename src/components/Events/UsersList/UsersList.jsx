import React from 'react'
import { closeUsersList, openEmpProfileDrawer } from '../../../Redux/eventsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@mui/system'
import { ReactComponent as CloseCircle } from '../../../Assets/SVGs/CloseCircle.svg';
import { Avatar, Button, Drawer, Typography } from '@mui/material';
function UsersList() {
    const dispatch = useDispatch()
    const usersData = useSelector((state) => state.event.usersData)

    return (
        <>

            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '641px',
                height: '491.33px',
                background: '#fff',
                borderRadius: '20px',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E9EAE9', }}>
                    <Typography sx={{ fontWeight: '400', fontSize: '24px', lineHeight: '28px', color: '#272627', mt: '43px', ml: '24px', mb: '43px' }}>
                        People in event
                    </Typography>
                    <CloseCircle onClick={() => dispatch(closeUsersList())} style={{ marginTop: "28.75px", marginRight: '22.35px', cursor: "pointer" }} />
                </Box>

                <Box sx={{
                    overflow: 'auto',
                    height: '360px'
                }}>
                    {
                        usersData.map((value, index) => (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E9EAE9', height: '67.82px' }}>
                                <Box display='flex' alignItems='center' ml='23.94px' width='250px'>
                                    <Avatar
                                        sx={{ width: '40px', height: '40px', border: '1px solid #444344' }}
                                        alt="Agnes Walker"
                                        src={value.profilePicture}
                                    />

                                    <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#444344', ml: '16px' }}>
                                        {value.firstName.en} {value.lastName.en}
                                    </Typography>
                                </Box>

                                <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#444344', width: '200px' }}>
                                    {value.company.name}
                                </Typography>

                                <Button variant='text'
                                    sx={{ marginRight: '20.06px', fontSize: '16px', }}
                                    onClick={() => {
                                        sessionStorage.setItem("employeeID", value._id)
                                        dispatch(openEmpProfileDrawer())
                                        dispatch(closeUsersList())
                                    }}
                                >
                                    View Profile
                                </Button>
                            </Box >
                        ))

                    }
                </Box>
            </Box>

        </>
    )
}

export default UsersList