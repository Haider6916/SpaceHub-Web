import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@mui/system'
import { ReactComponent as SmallCloseCircle } from '../../../Assets/SVGs/SmallCloseCircle.svg';
import { Avatar, Button, Drawer, Typography, Grid } from '@mui/material';
import { closeUsersList } from '../../../Redux/bookingsSlice';
function UsersModal() {
    const dispatch = useDispatch()


    const usersData = useSelector((state) => state.booking.usersData)


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
                borderRadius: '8px',
            }}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E9EAE9', }}>
                    <Typography sx={{ fontWeight: '400', fontSize: '24px', lineHeight: '28px', color: '#272627', mt: '20px', ml: '26px', mb: '16px' }}>
                        Invited Attendees
                    </Typography>
                    <SmallCloseCircle onClick={() => dispatch(closeUsersList())} style={{ marginRight: '22.35px', cursor: "pointer" }} />
                </Box>

                <Box sx={{
                    overflow: 'auto',
                    height: '420px',
                    width: '100%',
                }}>
                    {
                        usersData.attendees.map((value, index) => (
                            <Box sx={{ display: 'flex', padding: "0px 60px 0px 40px", alignItems: 'center', borderBottom: '1px solid #E9EAE9', height: '67.82px', width: '100%' }}>
                                <Grid container>
                                    <Grid item xs={5.5}>
                                        <Box display='flex' alignItems='center'>
                                            <Avatar
                                                sx={{ width: '40px', height: '40px', border: '1px solid #444344', mr: '8px', }}
                                                alt="Agnes Walker"
                                                src={value.profilePicture}
                                            />

                                            <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#444344', }}>
                                                {value.firstName.en} {value.lastName.en}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4.5}>
                                        <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#7D7B7C', }}>
                                            {value.company?.name}
                                        </Typography>

                                    </Grid>
                                    <Grid item xs={2}>

                                        <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#7C3F92', }}>
                                            Member
                                        </Typography>

                                    </Grid>
                                </Grid>





                            </Box >
                        ))

                    }
                    {
                        usersData.visitors.map((value, index) => (
                            <Box sx={{ display: 'flex', padding: "0px 60px 0px 40px", alignItems: 'center', borderBottom: '1px solid #E9EAE9', height: '67.82px', width: '100%' }}>
                                <Grid container >
                                    <Grid item xs={5.5}>
                                        <Box display='flex' alignItems='center' >
                                            <Avatar
                                                sx={{ width: '40px', height: '40px', border: '1px solid #444344', mr: '8px' }}
                                                alt="Agnes Walker"
                                                src={value.profilePicture}
                                            />

                                            <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#7D7B7C' }}>
                                                {value.name}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4.5}>
                                        <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#7D7B7C' }}>
                                            N/A
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#7C3F92', }}>
                                            Visitor
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box >
                        ))

                    }

                </Box>
            </Box>

        </>
    )
}

export default UsersModal