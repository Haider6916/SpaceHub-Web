import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import { ReactComponent as SmallCloseCircle } from '../../../Assets/SVGs/SmallCloseCircle.svg';
import LinkPasteTab from '../LinkPasteTab/LinkPasteTab';
import ChooseOnMapTab from '../ChooseOnMapTab/ChooseOnMapTab';

function MapModal(props) {

    const [value, setValue] = useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClose = () => {
        props.handleClose()
    };

    const handleUrlLink = (value) => {
        props.handleUrlLink(value)
    };


    return (

        <Box sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '641px',
            height: '664px',
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
                <Tab label="Choose on Map" sx={{ fontWeight: 500, fontSize: '16px', lineHeight: '28px', textTransform: 'none', mt: '10px' }} />
                <Tab label="Add Link" sx={{ fontWeight: 500, fontSize: '16px', lineHeight: '28px', textTransform: 'none', mt: '10px' }} />
            </Tabs>

            <Box sx={{ position: 'absolute', top: "18.75px", right: '22.39px', zIndex: 9999, cursor: 'pointer' }} onClick={handleClose}>
                <SmallCloseCircle />
            </Box>

            <Box sx={{ width: '100%', padding: '0px 27px 0px 27px', height: 'calc(100% - 65px )' }}>
                {value === 0 ? (
                    <ChooseOnMapTab
                        handleClose={handleClose}
                        handleUrlLink={handleUrlLink}
                    />

                ) : (
                    <LinkPasteTab
                        handleClose={handleClose}
                        handleUrlLink={handleUrlLink}
                    />

                )}
            </Box>
        </Box>

    )
}

export default MapModal