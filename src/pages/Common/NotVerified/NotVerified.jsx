import { Box } from '@mui/system'
import React from 'react'
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { Toaster, toast } from 'react-hot-toast';
import { publicRequest } from '../../../ApiMethods';
import { Button } from '@mui/material';
function NotVerified() {

    const handleResend = () => {
        var email = sessionStorage.getItem("userEmail");
        let apiObj = { 'email': email }
        publicRequest.post('/user/verification/resend', apiObj)
            .then((res) => {
                toast.success('Verification email has been re-sent.')
            })
            .catch((error) => {
                toast.error(error.response.data.error.message)
            });
    }

    return (
        <>

            <Box>
                <Toaster />
            </Box>

            <Box
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Box >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <NoAccountsIcon style={{
                            fontSize: 150,
                            color: '#5A5A5A'
                        }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: 40, color: '#5A5A5A' }}> We encountered a problem while validating your account.</Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 500, fontSize: 25, marginTop: 3, color: '#5A5A5A' }}>To proceed, please click the button below to request a new verification email.</Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, color: '#5A5A5A' }}>
                        <Button variant='contained' onClick={handleResend}> Resend Email</Button>
                    </Box>
                </Box>
            </Box >
        </>
    )
}

export default NotVerified