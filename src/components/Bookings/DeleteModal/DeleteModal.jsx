import React from 'react'
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/styles';
import { ReactComponent as Cross } from '../../../Assets/SVGs/Cross.svg';
import { privateRequest } from '../../../ApiMethods';
import { toast } from 'react-hot-toast';



const DeleteButton = styled(Button)({
    padding: '0px 24px',
    width: '152px',
    height: '40px',
    backgroundColor: '#CB2C17',
    borderRadius: '51px',
    textTransform: 'none',
    color: "#FFFFFF",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '28px',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: '#CB2C17',
    },
    '&:active': {
        backgroundColor: '#CB2C17',
    },
});

const CancelButton = styled(Button)({
    padding: '0px 24px',
    width: '152px',
    height: '40px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #8D55A2',
    borderRadius: '51px',
    textTransform: 'none',
    color: "#8D55A2",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '28px',
});
const DeleteModal = (props) => {

    const handleDelete = () => {
        privateRequest.delete(`/booking/${props.id}`).then((res) => {
            props.closeModal()
            props.refetchData()
            toast.success(res.data.message);
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }


    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #C6C7C5', padding: '16px 40px' }} >
                <Typography sx={{ fontWeight: '700', fontSize: '24px', lineHeight: '40px', color: '#020001' }}>Delete Booking</Typography>
                <Cross onClick={() => { props.closeModal() }} style={{ marginRight: '5px', margonTop: '13px', cursor: 'pointer' }} />
            </Box>
            <Box ml="40px">
                <Typography sx={{ fontWeight: '700', fontSize: '23px', lineHeight: '40px', color: '#020001', mt: '24px' }}>
                    Are you sure you want to delete the booking?
                </Typography>
                <Typography sx={{ fontWeight: '400', fontSize: '20px', lineHeight: '32px', color: '#7D7B7C', mt: '5px' }}>
                    {/* {
                userRole === 'space_owner' ?
                    'You couldn’t revert this change' :
                    10 === 10 ?
                        'Your credits will be deducted because the remaining time till the start is less than 2 hours.'
                        :
                        "No credits will be deducted as the remaining time till the start is more than 2 hours."
            } */}
                    You couldn't revert this change
                </Typography>
            </Box>
            <Box borderTop='1px solid #C6C7C5' padding='23px 40px' display='flex' justifyContent='flex-end' mt='40px'>
                <DeleteButton onClick={handleDelete} sx={{ marginRight: '16px' }}>Delete</DeleteButton>
                <CancelButton onClick={() => { props.closeModal() }}>Cancel</CancelButton>
            </Box>
        </>
    )
}

export default DeleteModal