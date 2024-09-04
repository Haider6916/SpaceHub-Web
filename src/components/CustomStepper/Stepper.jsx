import React from 'react'
import CheckIcon from '@mui/icons-material/Check';
import { Typography } from '@mui/material';

const Stepper = ({ number, status, label }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'max-content', }}>
            <div style={{
                display: 'flex',
                justifyContent: "center",
                alignItems: 'center',
                width: '58.082px',
                height: '58.082px',
                borderRadius: "58.082px",
                backgroundColor: status === 'completed' ? "#8D55A2" : 'white',
                border: status === 'in-active' ? '2.64px solid #C6C7C5' : '2.64px solid #8D55A2',
            }}>

                {status === 'completed'
                    ? <CheckIcon style={{ color: '#FFFFFF' }} />
                    : <Typography sx={{
                        color: status === 'in-active' ? '#9F9D9E' : '#8D55A2',
                        fontSize: '24px',
                        lineHeight: '36.962px',
                    }}>
                        {number}
                    </Typography>}
            </div>
            <Typography sx={{
                color: status === 'in-active' ? '#9F9D9E' : '#8D55A2',
                fontSize: '18px',
                mt: '10px'
            }}>
                {label}
            </Typography>
        </div>
    )
}



export default Stepper