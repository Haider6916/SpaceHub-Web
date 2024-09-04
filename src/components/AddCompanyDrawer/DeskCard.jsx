import { Box, Checkbox, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

function DeskCard(props) {
    const [checked, setChecked] = useState(props.isChecked);

    useEffect(() => {
        setChecked(props.isChecked)
    }, [props.isChecked])


    const handleChange = () => {
        setChecked(!checked);
        if (!checked === true) {
            props.handleSetID()
        }
        else {
            props.handleRemoveID(props.id)
        }
    };

    return (
        <Box
            sx={{
                width: '173px',
                height: '229px',
                backgroundColor: checked ? '#EEE5F1' : '#fafafa',
                border: checked ? '1px solid #8D55A2' : '1px solid #C6C7C5',
                borderRadius: '12px',
                cursor: 'pointer'
            }}
            onClick={handleChange}
        >

            <Checkbox sx={{ padding: '0px', margin: '10.5px  10.5px 6.5px 10.5px', height: "15px", width: '15px', borderColor: '#7D7B7C' }} checked={checked} onChange={handleChange} />

            <Box marginLeft='8px'>
                < Box sx={{ borderRadius: '8px', width: '155px', height: '120px' }}>
                    <img src="https://media.istockphoto.com/id/1342421368/photo/modern-bright-office-space.webp?s=2048x2048&w=is&k=20&c=7qKGX_-vmdItDsWeptQcq8VyRCM91exCWaMFinTCN6U=" alt="Desk Image" style={{ width: "100%", height: '100%', borderRadius: "8px" }} />
                </Box>
                <Typography sx={{ marginTop: '4px', fontWeight: "400", fontSize: '16px', lineHeight: '21px', color: '#565556' }}>
                    {props.name}
                </Typography>
                <Typography sx={{ marginTop: '4px', fontWeight: "400", fontSize: '14px', lineHeight: '18px', color: '#565556' }}>
                    Capacity : {props.capacity}
                </Typography>
                <Typography sx={{ marginTop: '4px', fontWeight: "400", fontSize: '14px', lineHeight: '18px', color: '#565556' }}>
                    Floor number : {props.floorNumber}
                </Typography>
            </Box>
        </Box>
    )
}

export default DeskCard