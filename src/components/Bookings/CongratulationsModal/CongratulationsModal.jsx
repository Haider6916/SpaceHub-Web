import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@mui/system'
import { ReactComponent as SmallCloseCircle } from '../../../Assets/SVGs/SmallCloseCircle.svg';
import { ReactComponent as Success } from '../../../Assets/SVGs/Success.svg';

import { Avatar, Button, Drawer, Typography } from '@mui/material';
import { closeSuccessModal } from '../../../Redux/bookingsSlice';
function CongratulationsModal() {

    const dispatch = useDispatch()

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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'

            }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', }}>
                    <SmallCloseCircle onClick={() => dispatch(closeSuccessModal())} style={{ marginTop: "27.5px", marginRight: '21.14px', cursor: "pointer" }} />
                </div>
                <Success style={{ marginBottom: '24px', marginTop: '19.5px', }} />

                <Typography sx={{ fontWeight: "700", fontSize: '24px', lineHeight: 'normal', color: '#272627', mb: '10px' }}>
                    Booking Confirmed!
                </Typography>

                <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '32px', color: '#565556', width: '356px', textAlign: 'center', mb: '44px' }}>
                    Your Booking has been confirmed.check your email for details.
                </Typography>

                <Button variant='contained' onClick={() => dispatch(closeSuccessModal())} sx={{ height: '40px', width: '409px', borderRadius: '51px', padding: '0px 24px', fontSize: '16px', fontWeight: '500' }}>OK</Button>


            </Box >

        </>
    )
}

export default CongratulationsModal