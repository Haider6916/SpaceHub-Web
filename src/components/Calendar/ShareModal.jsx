import { Box, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import MyCalendar from './MyCalendar'
import OtherCalendar from './OtherCalendar'
import { ReactComponent as SmallCloseCircle } from '../../Assets/SVGs/SmallCloseCircle.svg';
import { closeShareModal } from '../../Redux/calendarSlice';
import { useDispatch } from 'react-redux';

const ShareModal = () => {

    const dispatch = useDispatch()
    const [value, setValue] = useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '641px',
            height: '491px',
            background: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
        }}>

            <Tabs value={value} onChange={handleChange}
                sx={{
                    '& .MuiTabs-flexContainer': {
                        borderBottom: '3px solid #E9EAE9',
                        width: '100%'
                    },
                }}
            >
                <Tab label="My Calendar" sx={{ fontWeight: 500, fontSize: '16px', lineHeight: '28px', textTransform: 'none', mt: '10px' }} />
                <Tab label="Other Calendar" sx={{ fontWeight: 500, fontSize: '16px', lineHeight: '28px', textTransform: 'none', mt: '10px' }} />
            </Tabs>

            <Box sx={{ position: 'absolute', top: "18.75px", right: '22.39px', zIndex: 9999, cursor: 'pointer' }} onClick={() => { console.log('should close') }}>
                <SmallCloseCircle onClick={() => dispatch(closeShareModal())} />
            </Box>

            <Box sx={{ width: '100%', height: 'calc(100% - 65px )' }}>
                {value === 0 ? (
                    <MyCalendar />

                ) : (
                    <OtherCalendar />
                )}
            </Box>
        </Box>
    )
}

export default ShareModal