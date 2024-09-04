import { Box, Checkbox, Typography } from '@mui/material'
import React, { useState } from 'react'

function DeskCard(props) {
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    return (
        <Box sx={{
            width: '173px',
            height: '205px',
            backgroundColor: '#F5F6F4',
            border: '1px solid #FAFAFA',
            borderRadius: '12px',
            padding: "8px"
        }}>
            < Box sx={{ borderRadius: '8px', width: '157px', height: '120px' }}>
                <img src="https://media.istockphoto.com/id/1342421368/photo/modern-bright-office-space.webp?s=2048x2048&w=is&k=20&c=7qKGX_-vmdItDsWeptQcq8VyRCM91exCWaMFinTCN6U=" alt="Desk Image" style={{ width: "100%", height: '100%', borderRadius: "8px" }} />
            </Box>
            <Typography sx={{ marginTop: '4px', fontWeight: "500", fontSize: '16px', lineHeight: '21px', color: ' #8D55A2' }}>
                {props.name}
            </Typography>
            <Typography sx={{ marginTop: '4px', fontWeight: "400", fontSize: '14px', lineHeight: '18px', color: '#7D7B7C' }}>
                Capacity : {props.capacity}
            </Typography>
            <Typography sx={{ marginTop: '4px', fontWeight: "400", fontSize: '14px', lineHeight: '18px', color: '#7D7B7C' }}>
                Floor Number : {props.floorNumber}
            </Typography>

        </Box>
    )
}

export default DeskCard