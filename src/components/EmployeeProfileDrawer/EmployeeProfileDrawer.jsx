import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Dialog, Drawer, Grid, Slide, Stack, Tab, Tabs, Typography } from '@mui/material';
import { ReactComponent as CloseCircle } from '../../Assets/SVGs/CloseCircle.svg';
import { ReactComponent as Cross } from '../../Assets/SVGs/Cross.svg';
import { privateRequest } from '../../ApiMethods';
import { toast } from 'react-hot-toast';
import styled from '@emotion/styled';
import DeskCard from './DeskCard';
import EditEmployeeDrawer from '../EditEmployeeDrawer/EditEmployeeDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { employeeReloadFalse } from '../../Redux/directorySlice';
import SkeletonLoader from '../SkeletonLoader.jsx/SkeletonLoader';
import { closeEmpProfileDrawer } from '../../Redux/eventsSlice';

const PurpleButton = styled(Button)({
    padding: '0px 24px',
    width: '200px',
    height: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '51px',
    textTransform: 'none',
    border: '1px solid #8D55A2',
    color: "#8D55A2",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '28px',
    marginTop: '16px'
});

const YellowButton = styled(Button)({
    padding: '0px 24px',
    width: '200px',
    height: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '51px',
    textTransform: 'none',
    border: '1px solid #F99200',
    color: "#F99200",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '28px',
    marginTop: '16px'
});

const RedButton = styled(Button)({
    padding: '0px 24px',
    width: '200px',
    height: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '51px',
    textTransform: 'none',
    border: '1px solid #EA411B',
    color: "#EA411B",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '28px',
    marginTop: '16px'
});

const GreenTagBox = styled(Box)({
    padding: '4px 12px',
    width: '69px',
    height: '32px',
    backgroundColor: '#E5F5ED',
    borderRadius: '44px',
    color: '#00AF6F',
    fontWeight: '400', fontSize: '16px', lineHeight: '24px',

});

const DeactivateButton = styled(Button)({
    padding: '0px 24px',
    width: '152px',
    height: '40px',
    backgroundColor: '#F99200',
    borderRadius: '51px',
    textTransform: 'none',
    color: "#FFFFFF",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '28px',
    transition: 'background-color 0.3s', // Add a transition for smoother color change
    '&:hover': {
        backgroundColor: '#D87800', // Darker color on hover
    },
    '&:active': {
        backgroundColor: '#B65B00', // Even darker color on click/pressed
    },
});

const DeleteButton = styled(Button)({
    padding: '0px 24px',
    width: '152px',
    height: '40px',
    backgroundColor: '#EA411B',
    borderRadius: '51px',
    textTransform: 'none',
    color: "#FFFFFF",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '28px',
    transition: 'background-color 0.3s', // Add a transition for smoother color change
    '&:hover': {
        backgroundColor: '#FF473C', // Darker color on hover
    },
    '&:active': {
        backgroundColor: '#8D160D', // Even darker color on click/pressed
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function EmployeeProfileDrawer(props) {

    const shouldReload = useSelector((state) => state.directory.shouldEmployeeReload)
    const dispatch = useDispatch()

    const [employeeData, setEmployeeData] = useState(null)
    const [allocations, setAllocations] = useState([])
    const [joinDate, setJoinDate] = useState('')
    const [value, setValue] = useState(0);
    const [deactivateProfile, setDeactivateProfile] = useState(false)
    const [deleteProfile, setDeleteProfile] = useState(false)
    const [openEditEmployee, setOpenEditEmployee] = useState(false)
    const [dialogueLoader, setDialogueLoader] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const fetchEmployeeData = () => {
        const id = sessionStorage.getItem("employeeID");
        privateRequest.get(`/user/${id}`).then((res) => {
            console.log('res.data', res.data);
            setEmployeeData(res.data)
            setAllocations(res.data.allocation)
            formatJoinDate(res.data.joinedOn)
            setIsLoading(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const handleDeactivate = () => {
        const id = sessionStorage.getItem("employeeID");
        privateRequest.put(`/user/${id}`, { "isActive": false }).then((res) => {
            toast.success(res.data.message)
            setDialogueLoader(false)
            setDeactivateProfile(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const handleDelete = () => {
        const id = sessionStorage.getItem("employeeID");
        privateRequest.delete(`/user/${id}`).then((res) => {
            toast.success(res.data.message)
            setDialogueLoader(false)
            setDeactivateProfile(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const formatJoinDate = (timestamp) => {
        const date = new Date(timestamp);
        const months = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];

        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        const formattedMinute = String(minute).padStart(2, "0");

        setJoinDate(`Joined on ${month} ${day}, ${year} ${formattedHour}:${formattedMinute} ${period}`)
    }

    useEffect(() => {
        fetchEmployeeData()
    }, [])

    useEffect(() => {
        if (shouldReload) {
            fetchEmployeeData()
            dispatch(employeeReloadFalse())
        }
    }, [shouldReload])


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (isLoading) {
        return <SkeletonLoader />
    }

    return (
        <>
            {employeeData !== null && (
                <Box>
                    <Box sx={{ padding: '40px 32px 0px 32px', display: 'flex', justifyContent: 'space-between' }}>

                        <Box display='flex'>
                            <img src={employeeData.profilePicture} alt="Profile Image" style={{ border: '1px solid #9F9D9E', borderRadius: '16px', width: '166px', height: '198px' }} />
                            <Box ml='24px'>
                                <Box display="flex">
                                    <Typography sx={{ fontStyle: 'normal', fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                                        {employeeData.firstName.en} {employeeData.lastName.en}
                                    </Typography>

                                    <GreenTagBox sx={{ ml: "39px", mt: '11px' }}>online</GreenTagBox>



                                </Box>

                                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#7D7B7C', mt: '8px' }}>
                                    Part of : <span style={{ color: '#8D55A2', textDecoration: 'underline' }}> {employeeData.company.name}</span>
                                </Typography>

                                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#565556', mt: '24.8px' }}>
                                    {joinDate}
                                </Typography>

                                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#565556', mt: '10px' }}>
                                    Email : {employeeData.email}
                                </Typography>

                                <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#565556', mt: '10px' }}>
                                    Phone : {employeeData.phoneNumber}
                                </Typography>
                            </Box>
                        </Box>

                        <Box display='flex' >
                            <Box sx={{ border: '1px solid #E9EAE9', height: '212px', mr: '64px', mt: '8px' }} />
                            <Stack sx={{ mr: '45px', mt: '13px' }}>
                                <Button onClick={() => { setOpenEditEmployee(true) }} variant='contained' sx={{ padding: '0px 24px', width: '200px', height: '40px', borderRadius: '51px', textTransform: 'none' }}>Edit</Button>
                                <PurpleButton >Chat</PurpleButton>
                                <YellowButton onClick={() => { setDeactivateProfile(true) }}>Deactivate</YellowButton>
                                <RedButton onClick={() => { setDeleteProfile(true) }} >Delete</RedButton>
                            </Stack>
                            <CloseCircle style={{ marginTop: '14.67px', cursor: 'pointer' }}
                                onClick={() => {
                                    props.handleCloseEmpProfile();
                                    dispatch(closeEmpProfileDrawer())
                                }} />
                        </Box>
                    </Box>

                    <Box sx={{ width: 'calc(100% - 31.86px)', ml: '31.86px', borderBottom: '3px solid #E9EAE9' }}>
                        <Tabs value={value} onChange={handleChange}
                            sx={{
                                '& .MuiTabs-flexContainer': {
                                    borderBottom: '3px solid #E9EAE9',
                                    width: 'calc(100% - 31.86px)'
                                },
                            }}
                        >
                            <Tab label="Allocation" />
                            <Tab label="Booking History" />
                        </Tabs>
                        <Box sx={{ width: '100%', mt: '30px', display: 'flex' }}>
                            {value === 0 ?
                                <>
                                    <Box width='100%'>
                                        <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '24px', lineHeight: '28px', color: 'black', mb: '8px' }}>
                                            Desk allocation
                                        </Typography>
                                        <Grid container >
                                            {
                                                allocations.map((value, index) => (
                                                    <Grid item xs={2} sx={{ marginBottom: '16px' }}>
                                                        <DeskCard key={index}
                                                            name={value.name}
                                                            floorNumber={value.floorNumber}
                                                            capacity={value.capacity}
                                                        />
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                    </Box>
                                </>

                                :
                                <>
                                    <Box width='100%'>
                                        <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '24px', lineHeight: '28px', color: 'black', mb: '8px' }}>
                                            Meeting rooms
                                        </Typography>
                                        <Grid container>
                                            {
                                                allocations.map((value, index) => (
                                                    <Grid item xs={2} sx={{ marginBottom: '16px' }}>
                                                        <DeskCard key={index}
                                                            name={value.name}
                                                            floorNumber={value.floorNumber}
                                                            capacity={value.capacity}
                                                        />
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                    </Box>
                                </>
                            }
                        </Box>
                    </Box>



                    {/* Deactivate Company */}
                    <Dialog
                        open={deactivateProfile}
                        TransitionComponent={Transition}
                        keepMounted
                        sx={{
                            '& .MuiPaper-root': {
                                width: '920px',
                                height: 'auto',
                                maxHeight: 'none',
                                maxWidth: 'none',
                                overflow: 'unset'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #C6C7C5', padding: '16px 40px' }} >
                            <Typography sx={{ fontWeight: '700', fontSize: '20px', lineHeight: '32px', color: '#020001' }}>Deactivate employee account</Typography>
                            <Cross style={{ marginRight: '5px', margonTop: '13px', cursor: 'pointer' }} onClick={() => setDeactivateProfile(false)} />
                        </Box>
                        <Box ml="40px">
                            <Typography sx={{ fontWeight: '700', fontSize: '23px', lineHeight: '40px', color: '#020001', mt: '24px' }}>
                                Are you sure you want to deactivate the employee account?
                            </Typography>
                            <Typography sx={{ fontWeight: '400', fontSize: '20px', lineHeight: '32px', color: '#7D7B7C', mt: '5px' }}>
                                You cannot revert this change.
                            </Typography>
                        </Box>
                        <Box borderTop='1px solid #C6C7C5' padding='23px 40px' display='flex' justifyContent='flex-end' mt='40px'>
                            <DeactivateButton onClick={() => { setDialogueLoader(true); handleDeactivate() }} sx={{ marginRight: '16px' }}>
                                {dialogueLoader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Deactivate'}
                            </DeactivateButton>
                            <CancelButton onClick={() => setDeactivateProfile(false)}>Cancel</CancelButton>
                        </Box>
                    </Dialog>

                    {/* Delete Employee */}
                    <Dialog
                        open={deleteProfile}
                        TransitionComponent={Transition}
                        keepMounted
                        sx={{
                            '& .MuiPaper-root': {
                                width: '920px',
                                height: 'auto',
                                maxHeight: 'none',
                                maxWidth: 'none',
                                overflow: 'unset'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #C6C7C5', padding: '16px 40px' }} >
                            <Typography sx={{ fontWeight: '700', fontSize: '20px', lineHeight: '32px', color: '#020001' }}>Delete employee account</Typography>
                            <Cross style={{ marginRight: '5px', margonTop: '13px', cursor: 'pointer' }} onClick={() => setDeleteProfile(false)} />
                        </Box>
                        <Box ml="40px">
                            <Typography sx={{ fontWeight: '700', fontSize: '23px', lineHeight: '40px', color: '#020001', mt: '24px' }}>
                                Are you sure you want to delete the employee account?
                            </Typography>
                            <Typography sx={{ fontWeight: '400', fontSize: '20px', lineHeight: '32px', color: '#7D7B7C', mt: '5px' }}>
                                You cannot revert this change.
                            </Typography>
                        </Box>
                        <Box borderTop='1px solid #C6C7C5' padding='23px 40px' display='flex' justifyContent='flex-end' mt='40px'>
                            <DeleteButton onClick={() => { setDialogueLoader(true); handleDelete() }} sx={{ marginRight: '16px' }}>
                                {dialogueLoader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Delete'}
                            </DeleteButton>
                            <CancelButton onClick={() => setDeleteProfile(false)}>Cancel</CancelButton>
                        </Box>
                    </Dialog>

                    {/* Edit Employee Drawer */}
                    <Drawer
                        anchor={'right'}
                        open={openEditEmployee}
                    >
                        <Box sx={{ width: '611px', padding: '48px 32.2px' }}>
                            <EditEmployeeDrawer
                                employeeData={employeeData}
                                handleCloseEditEmployee={() => { setOpenEditEmployee(false) }}
                            />
                        </Box>
                    </Drawer>

                </Box >
            )
            }
        </>
    )
}

export default EmployeeProfileDrawer