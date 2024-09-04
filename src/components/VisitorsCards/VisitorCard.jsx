import { Box, Typography, Button, Stack, Chip, Grid } from '@mui/material'
import React from 'react'
import Profile from '../../Assets/SVGs/Profile.png'
import { ReactComponent as Building } from '../../Assets/SVGs/Building.svg';
import { ReactComponent as Dots } from '../../Assets/SVGs/DotsThree.svg';
import { ElectricalServices, FitnessCenter, Print, Wifi, Flatware } from '@mui/icons-material';
function VisitorCard(props) {
    let number = 4;

    let iconsArray = ['Flatware', 'ElectricalServices', 'FitnessCenter', 'Wifi', 'Print']

    let tagChipColor = {
        'Checked-in': '#00AF6F',
        'Pending': '#F99200',
        'Expired': '#EA411B',
    }


    let tagChipBackgroundColor = {
        'Checked-in': '#E5F5ED',
        'Pending': '#FEF2DF',
        'Expired': '#FFEAEB',
    }

    const iconMapping = {
        Flatware: Flatware,
        Wifi: Wifi,
        Print: Print,
        ElectricalServices: ElectricalServices,
        FitnessCenter: FitnessCenter
    };
    return (
        <Box
            sx={{
                boxShadow: '0px 2px 8px rgba(2, 0, 1, 0.1)',
                padding: '16px 42px',
                width: '100%',
                height: '96px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #F5F6F4',
            }}
        >
            <Grid container >

                <Grid item xs={3.5}>
                    <Box display='flex'>
                        <Box sx={{ mr: '23px' }}>
                            <img src={'https://media.istockphoto.com/id/1398385367/photo/happy-millennial-business-woman-in-glasses-posing-with-hands-folded.jpg?b=1&s=170667a&w=0&k=20&c=YaXYAUQu3wpM2xiFJgorwMvK5pNnrrdnFeHd1lTVwCs='} alt="Profile" style={{
                                width: '64px',
                                height: '64px',
                                border: '1px solid #DBDBDA',
                                borderRadius: '16px',
                            }} />
                        </Box>

                        <Box sx={{
                            marginTop: '6px'
                        }}>
                            <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '18px', lineHeight: '24px', color: '#7C3F92' }}>
                                {props.name}
                            </Typography>
                            <Typography
                                sx={{
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    color: '#9F9D9E',
                                    mt: '4px',
                                }}
                            >
                                Host :  {props.hostName}
                            </Typography>
                        </Box>
                    </Box>

                </Grid>


                <Grid item xs={3.3} >

                    <Box sx={{
                        marginTop: '20px'
                    }}>
                        <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#444344' }}>
                            {props.visitReason}
                        </Typography>
                    </Box>
                </Grid>


                <Grid item xs={2.4} >

                    <Box width='90px' >
                        <Chip label={props.tag} sx={{
                            backgroundColor: tagChipBackgroundColor[props.tag],
                            color: tagChipColor[props.tag],
                            mt: '16px'
                        }} />
                    </Box>
                </Grid>

                <Grid item xs={2}>

                    <Box sx={{
                        marginTop: '20px'
                    }}>
                        <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#444344' }}>
                            {props.visitDuration} days
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={0.8} sx={{ display: 'flex', justifyContent: 'center' }}>

                    <div className="dropdown" style={{ width: '15px', }}>
                        <Box
                            sx={{
                                // marginLeft: '100px',
                                marginTop: '8px',
                                backgroundColor: '#FFFFFF',
                                boxShadow: '0px 1px 4px rgba(2, 0, 1, 0.1)',
                                width: '48px',
                                height: '48px',
                                borderRadius: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',

                            }}
                        >
                            <Dots />
                        </Box>
                        <div className="dropdown-content">
                            <Box>
                                <Box sx={{ borderBottom: ' 1px solid #E9EAE9', padding: '16px 24px', cursor: 'pointer' }}>
                                    <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '28px', color: '#565556', }}>
                                        Edit
                                    </Typography>
                                </Box>

                                <Box sx={{ padding: '16px 24px', cursor: 'pointer' }}>
                                    <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#565556', }}>
                                        Delete
                                    </Typography>
                                </Box>

                            </Box>
                        </div>
                    </div>
                </Grid>



            </Grid>
        </Box >
    )
}

export default VisitorCard