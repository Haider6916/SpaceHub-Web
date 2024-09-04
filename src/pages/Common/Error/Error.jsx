import React from 'react'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box } from '@mui/material';


function Error() {
    return (
        <Box
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Box >
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ErrorOutlineOutlinedIcon style={{
                        fontSize: 150,
                        color: '#5A5A5A'
                    }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: 40, color: '#5A5A5A' }}>404</Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 500, fontSize: 25, marginTop: 3, color: '#5A5A5A' }}>Page not found</Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, color: '#5A5A5A' }}>This page you are looking for doesn't exist or some other error occured.</Box>
            </Box>
        </Box >
    )
}

export default Error