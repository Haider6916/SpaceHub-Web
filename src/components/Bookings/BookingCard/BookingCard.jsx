import { Box, Typography, Button, Stack, Drawer } from '@mui/material'
import React from 'react'
import { ReactComponent as Building } from '../../../Assets/SVGs/Building.svg';
import { ReactComponent as CalendarCircle } from '../../../Assets/SVGs/CalendarCircle.svg';
import { ElectricalServices, FitnessCenter, Print, Wifi, Flatware } from '@mui/icons-material';
import { openAddBookingDrawer } from '../../../Redux/bookingsSlice';
import { useDispatch } from 'react-redux';

const BookingCard = (props) => {

    const dispatch = useDispatch()
    let number = props.floorNumber;
    let iconsArray = ['Flatware', 'ElectricalServices', 'FitnessCenter', 'Wifi', 'Print']

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
                height: '165.29px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid #F5F6F4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >

            <Box display='flex'>
                <Box sx={{ mr: '23px' }}>
                    <img src={props.photo ? props.photo : 'https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'} alt="Profile" style={{
                        width: '202.39px',
                        height: '133.29px',
                        border: '1px solid #9F9D9E',
                        borderRadius: '8px',
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
                            width: '255px',
                            height: '77px',
                            WebkitLineClamp: 3,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {props.description}
                    </Typography>
                </Box>
            </Box>

            <Box >
                <Box display='flex' alignItems='center'>
                    <Building />
                    <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '24px', color: '#444344', ml: '9.29px', mb: '4px' }}>
                        {
                            number === '1' ? `${number}'st floor`
                                : number === '2' ? `${number}'nd floor`
                                    : number === '3' ? `${number}'rd floor` :
                                        `${number}'th floor`
                        }
                    </Typography>
                </Box>
                <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '24px', color: '#444344' }}>
                    {props.capacity === 1 ? `${props.capacity} seat` : `${props.capacity} seats`}
                </Typography>

            </Box>

            <Stack direction='row'>
                {iconsArray.map((value, index) => {
                    const IconComponent = iconMapping[value]; // Get the corresponding icon component
                    if (IconComponent) {
                        return <IconComponent key={index} style={{ marginRight: '10.5px', color: '#444344' }} />;
                    }
                    return null; // Render nothing if there is no corresponding icon component
                })}
            </Stack>

            <Button
                variant='outlined'
                sx={{ height: '40px', width: '166px', gap: '8px', padding: "0px 24px", borderRadius: '51px' }}
                onClick={() => {
                    sessionStorage.setItem("bookingRoomID", props.id);
                    sessionStorage.setItem("bookingRoomPhoto", props.photo);
                    sessionStorage.setItem("bookingRoomCapacity", props.capacity);
                    sessionStorage.setItem("bookingRoomName", props.name)
                    dispatch(openAddBookingDrawer())
                }}
            >
                <CalendarCircle />
                Book
            </Button>

        </Box >
    )
}

export default BookingCard


