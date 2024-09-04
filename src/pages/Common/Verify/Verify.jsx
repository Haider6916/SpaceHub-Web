import { Box, Button, Card } from '@mui/material'
import React, { useEffect, useState } from 'react'
import LinearProgress from '@mui/material/LinearProgress';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useNavigate, useParams } from 'react-router-dom';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { Toaster, toast } from 'react-hot-toast';
import { publicRequest } from '../../../ApiMethods';

function Verify() {
    const navigate = useNavigate()

    const [verified, setVerified] = useState('waiting')

    const handleNavigate = () => {
        navigate('/login')
    }
    const handleResend = () => {
        var email = sessionStorage.getItem("userEmail");
        let apiObj = { 'email': email }
        publicRequest.post('/user/verification/resend', apiObj)
            .then((res) => {
                toast.success("Verification email has been re-sent.")
            })
            .catch((error) => {
                toast.error(error.response.data.error.message)
            });
    }

    let { id } = useParams();

    useEffect(() => {
        publicRequest.post(`/user/verify/${id}`).then(() => {
            setVerified('verified')
            sessionStorage.removeItem('userEmail');
        }).catch((error) => {
            setVerified('notVerified')
        })
        // eslint-disable-next-line 
    }, [])


    return (
        <>
            <Box>
                <Toaster />
            </Box>

            {
                verified === 'waiting' && (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <Card sx={{ minWidth: '800px', minHeight: '400px', borderRadius: '25px', background: '#F5F6F4', border: '1px solid #DBDBDA', display: "flex", justifyContent: "center", alignItems: "center", }}>
                            <Box sx={{ width: '100%', padding: '0px 20px' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: 40, alignItems: "center", }}>
                                    Verifing your email
                                </Box>
                                <LinearProgress style={{ width: '100%', marginTop: "10px" }} />
                            </Box>


                        </Card>
                    </Box>
                )}
            {verified === 'verified' && (
                <Box
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <Box >
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <MarkEmailReadIcon style={{
                                fontSize: 150,
                                color: '#5A5A5A'
                            }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: 40, color: '#5A5A5A' }}>Welcome</Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 500, fontSize: 25, marginTop: 3, color: '#5A5A5A' }}>Your account has been verified.</Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, color: '#5A5A5A' }}>
                            <Button variant='contained' onClick={handleNavigate}> Go to Login</Button>
                        </Box>
                    </Box>
                </Box >
            )}
            {verified === 'notVerified' && (
                <Box
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <Box >
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <NoAccountsIcon style={{
                                fontSize: 150,
                                color: '#5A5A5A'
                            }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: 40, color: '#5A5A5A' }}>Account Verification Failed</Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: 500, fontSize: 25, marginTop: 3, color: '#5A5A5A' }}>Click on the button below to receive another email. </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, color: '#5A5A5A' }}>
                            <Button variant='contained' onClick={handleResend}> Resend Email</Button>
                        </Box>
                    </Box>
                </Box >
            )
            }
        </>
    )
}

export default Verify