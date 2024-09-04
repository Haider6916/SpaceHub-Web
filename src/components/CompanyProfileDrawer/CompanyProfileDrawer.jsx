import styled from '@emotion/styled';
import { Box, Button, Dialog, Drawer, Grid, Slide, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { ReactComponent as CloseCircle } from '../../Assets/SVGs/CloseCircle.svg';
import { ReactComponent as InfoCircle } from '../../Assets/SVGs/InfoCircle.svg';
import { ReactComponent as DollarCircle } from '../../Assets/SVGs/DollarCircle.svg';
import { ReactComponent as Globe } from '../../Assets/SVGs/Globe.svg';
import { ReactComponent as Facebook } from '../../Assets/SVGs/Facebook.svg';
import { ReactComponent as Instagram } from '../../Assets/SVGs/Instagram.svg';
import { ReactComponent as Linkedin } from '../../Assets/SVGs/LinkedinLogo.svg';
import { ReactComponent as Cross } from '../../Assets/SVGs/Cross.svg';
import EmployeeCard from '../EmployeeDirectory/EmployeeCard';
import DeskCard from '../EmployeeProfileDrawer/DeskCard';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../ApiMethods';
import EditCompanyDrawer from '../EditCompanyDrawer/EditCompanyDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { comapanyReloadFalse } from '../../Redux/directorySlice';
import EmployeeProfileDrawer from '../EmployeeProfileDrawer/EmployeeProfileDrawer';

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
    marginTop: '22px'
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
    marginTop: '22px'
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

function CompanyProfileDrawer(props) {

    const shouldReload = useSelector((state) => state.directory.shouldCompanyReload)
    const dispatch = useDispatch()

    const [value, setValue] = useState(0);
    const [subcription, setSubcription] = useState('')
    const [joinDate, setJoinDate] = useState('')
    const [deleteProfile, setDeleteProfile] = useState(false);
    const [deactivate, setDeactivate] = useState(false);
    const [companyData, setCompanyData] = useState(null)
    const [employees, setEmployees] = useState()
    const [resouces, setResources] = useState()
    const [isError, setIsError] = useState(null)
    const [openEditCompany, setOpenEditCompany] = useState(false)
    const [openEmpProfile, setOpenEmpProfile] = useState(false)


    const fetchCompanyData = () => {
        const id = sessionStorage.getItem("specficCompanyID");
        privateRequest.get(`/company/${id}`).then((res) => {
            console.log('res.data', res.data);
            setCompanyData(res.data)
            setEmployees(res.data.employees)
            setResources(res.data.resources)
            formatJoinDate(res.data.registeredOn)
            formatSubscriptionDuration(res.data.planEndDate)
        }).catch((error) => {
            console.log('in error');
            toast.error(error.response.data.error.message)
            setIsError(error.response.data.error.message)
        })
    }



    const formatSubscriptionDuration = (endDate) => {
        const end = new Date(endDate);
        const today = new Date();
        const durationMs = end.getTime() - today.getTime();
        const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
        const durationMonths = Math.floor(durationDays / 30);
        const durationYears = Math.floor(durationMonths / 12);
        const remainingDays = durationDays % 30;
        let durationString = "";
        if (durationYears > 0) {
            durationString += `${durationYears} ${durationYears === 1 ? "year" : "years"}`;
        }
        if (durationMonths > 0) {
            durationString += ` ${durationMonths} ${durationMonths === 1 ? "month" : "months"}`;
        }
        if (remainingDays > 0) {
            durationString += ` and ${remainingDays} ${remainingDays === 1 ? "day" : "days"}`;
        }
        setSubcription(`Subscription ends after ${durationString.trim()}`)

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

    const handleDeactivate = () => {
        const id = sessionStorage.getItem("specficCompanyID");
        privateRequest.put(`/company/${id}`, { "isActive": false }).then((res) => {
            toast.success(res.data.message)
            setDeactivate(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const handleDelete = () => {
        const id = sessionStorage.getItem("specficCompanyID");
        privateRequest.delete(`/company/${id}`).then((res) => {
            toast.success(res.data.message)
            setDeleteProfile(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    useEffect(() => {
        fetchCompanyData()
    }, [])

    useEffect(() => {
        if (shouldReload) {
            fetchCompanyData()
            dispatch(comapanyReloadFalse())
        }
    }, [shouldReload])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (isError !== null) {
        return <>
            <Box display='flex' justifyContent='space-between' padding='40px 36px 0px 30px'>
                <Typography>
                    {isError}
                </Typography>
                <CloseCircle style={{ cursor: 'pointer' }} onClick={props.handleCloseComProfile} />
            </Box>
        </>
    }

    if (companyData === null) {
        return <>
            <Box display='flex' justifyContent='space-between' padding='40px 36px 0px 30px'>
                <Typography>
                    Loading....
                </Typography>
                <CloseCircle style={{ cursor: 'pointer' }} onClick={props.handleCloseComProfile} />
            </Box>
        </>
    }



    return (
        <>
            {
                companyData !== null && (
                    <Box>
                        <Box sx={{ padding: '40px 36px 0px 30px', display: 'flex', justifyContent: 'space-between' }}>

                            <Box display='flex'>
                                <img src={companyData.logo} alt="Profile Image" style={{ border: '1px solid #9F9D9E', borderRadius: '16px', width: '212.29px', height: '223.45px' }} />

                                <Box ml='15.71px'>

                                    <Typography sx={{ fontStyle: 'normal', fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627', mt: '16.59px' }}>
                                        {companyData.name}
                                    </Typography>

                                    <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '18px', lineHeight: '24px', color: '#7D7B7C', mt: '8px' }}>
                                        {companyData.bio}
                                    </Typography>


                                    <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#565556', mt: '16px' }}>
                                        Phone : {companyData.phone}
                                    </Typography>

                                    <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#565556', mt: '4px' }}>
                                        Email : {companyData.email}
                                    </Typography>

                                    <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#565556', mt: '24.28px' }}>
                                        {/* Joined on August 19,2023 1:01 AM  */}
                                        {joinDate}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box display='flex' >
                                <Box sx={{ border: '1px solid #E9EAE9', height: '212px', mr: '32px', mt: '15.72px' }} />
                                <Stack sx={{ mr: '50.55px', mt: '35.72px' }}>
                                    <Button onClick={() => { setOpenEditCompany(true) }} variant='contained' sx={{ padding: '0px 24px', width: '200px', height: '40px', borderRadius: '51px', textTransform: 'none', fontWeight: '500', fontSize: '16px', lineHeight: '28px', }}>Edit</Button>
                                    <YellowButton onClick={() => setDeactivate(true)}>Deactivate</YellowButton>
                                    <RedButton onClick={() => { setDeleteProfile(true) }} >Delete</RedButton>
                                </Stack>
                                <CloseCircle style={{ marginTop: '24.67px', cursor: 'pointer' }} onClick={props.handleCloseComProfile} />
                            </Box>
                        </Box>



                        <Box sx={{ display: 'flex', mt: '24.55px', ml: '29.73px' }}>
                            <InfoCircle style={{ marginRight: '16px' }} />
                            <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#565556', mr: '104px' }}>
                                {companyData.name}
                            </Typography>

                            <DollarCircle style={{ marginRight: '16px' }} />
                            <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#565556', mr: '104px' }}>
                                {companyData.plan.title}
                            </Typography>

                            <InfoCircle style={{ marginRight: '16px' }} />
                            <Typography sx={{ fontStyle: 'normal', fontWeight: '400', fontSize: '16px', lineHeight: '24px', color: '#565556' }}>
                                {subcription}
                            </Typography>

                        </Box>


                        <Box sx={{ display: 'flex', mt: '17.25px', ml: '29.73px' }}>
                            <Globe style={{ marginRight: '17.25px' }} />
                            <a href={companyData.website} target="_blank" style={{ marginRight: '114.25px' }} rel="noreferrer">
                                <Typography component="span" style={{ color: '#8D55A2', textDecoration: 'underline' }}>
                                    Website link
                                </Typography>
                            </a>

                            <Instagram style={{ marginRight: '17.25px' }} />
                            <a href={companyData.instagram} target="_blank" style={{ marginRight: '114.25px' }} rel="noreferrer">
                                <Typography component="span" style={{ color: '#8D55A2', textDecoration: 'underline' }}>
                                    Instagram link
                                </Typography>
                            </a>

                            <Facebook style={{ marginRight: '17.25px' }} />
                            <a href={companyData.facebook} target="_blank" style={{ marginRight: '114.25px' }} rel="noreferrer">
                                <Typography component="span" style={{ color: '#8D55A2', textDecoration: 'underline' }}>
                                    Facebook link
                                </Typography>
                            </a>

                            <Linkedin style={{ marginRight: '17.25px' }} />
                            <a href={companyData.linkedin} target="_blank" style={{ marginRight: '114.25px' }} rel="noreferrer">
                                <Typography component="span" style={{ color: '#8D55A2', textDecoration: 'underline' }}>
                                    Linkedin link
                                </Typography>
                            </a>
                        </Box>

                        <Box sx={{ width: 'calc(100% - 32.6px)', ml: '32.6px', borderBottom: '3px solid #E9EAE9', mt: '27.33px' }}>
                            <Tabs value={value} onChange={handleChange}
                                sx={{
                                    '& .MuiTabs-flexContainer': {
                                        borderBottom: '3px solid #E9EAE9',
                                        width: 'calc(100% - 31.86px)'
                                    },
                                }}
                            >
                                <Tab label="Company Allocation" />
                                <Tab label={`Employees (${companyData.employees.length})`} />
                                <Tab label="Booking History" />
                            </Tabs>
                            <Box sx={{ width: '100%' }}>
                                {value === 0 ?
                                    <>
                                        <Box mt='16.92px'>
                                            <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '24px', lineHeight: '28px', color: 'black', mb: '12.19px' }}>
                                                Desks
                                            </Typography>
                                            <Grid container>
                                                {
                                                    resouces.map((value, index) => (
                                                        <Grid item xs={2} sx={{ marginBottom: '16px' }}>
                                                            <DeskCard key={index}
                                                                name={value.name}
                                                                capacity={value.capacity}
                                                                floorNumber={value.floorNumber}
                                                                image={value.image}
                                                            />
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                        </Box>
                                    </>

                                    : value === 1 ?
                                        <>
                                            <Box mt='24.11px' width='calc(100% - 32.6px)'>
                                                {
                                                    employees.map((value, index) => (
                                                        <EmployeeCard key={index}
                                                            handleOpenEmpProfile={() => { setOpenEmpProfile(true) }}
                                                            id={value._id}
                                                            name={`${value.firstName.en} ${value.lastName.en}`}
                                                            email={value.email}
                                                            profession={value.profession.en}
                                                            profileImage={value.profilePicture}
                                                            companyName={companyData.name}
                                                            status={value.isActive ? 'Active' : 'Deactivated'}
                                                            shouldVisible={false}
                                                        />
                                                    ))
                                                }
                                            </Box>
                                        </> :
                                        <>
                                            <Box mt='23.92px'>
                                                <Typography sx={{ fontStyle: 'normal', fontWeight: '500', fontSize: '24px', lineHeight: '28px', color: 'black', mb: '8px' }}>
                                                    Meeting rooms
                                                </Typography>
                                                <Grid container>
                                                    {
                                                        resouces.map((value, index) => (
                                                            <Grid item xs={2} sx={{ marginBottom: '16px' }}>
                                                                <DeskCard key={index}
                                                                    name={value.name}
                                                                    capacity={value.capacity}
                                                                    floorNumber={value.floorNumber}
                                                                    image={value.image}
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
                            open={deactivate}
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
                                <Typography sx={{ fontWeight: '700', fontSize: '20px', lineHeight: '32px', color: '#020001' }}>Deactivate company account</Typography>
                                <Cross style={{ marginRight: '5px', margonTop: '13px', cursor: 'pointer' }} onClick={() => setDeactivate(false)} />
                            </Box>
                            <Box ml="40px">
                                <Typography sx={{ fontWeight: '700', fontSize: '23px', lineHeight: '40px', color: '#020001', mt: '24px' }}>
                                    Are you sure you want to deactivate the company account?
                                </Typography>
                                <Typography sx={{ fontWeight: '400', fontSize: '20px', lineHeight: '32px', color: '#7D7B7C', mt: '5px' }}>
                                    You cannot revert this change.
                                </Typography>
                            </Box>
                            <Box borderTop='1px solid #C6C7C5' padding='23px 40px' display='flex' justifyContent='flex-end' mt='40px'>
                                <DeactivateButton onClick={handleDeactivate} sx={{ marginRight: '16px' }}>Deactivate</DeactivateButton>
                                <CancelButton onClick={() => setDeactivate(false)}>Cancel</CancelButton>
                            </Box>
                        </Dialog>


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
                                <Typography sx={{ fontWeight: '700', fontSize: '20px', lineHeight: '32px', color: '#020001' }}>Delete company account</Typography>
                                <Cross style={{ marginRight: '5px', margonTop: '13px', cursor: 'pointer' }} onClick={() => setDeleteProfile(false)} />
                            </Box>
                            <Box ml="40px">
                                <Typography sx={{ fontWeight: '700', fontSize: '23px', lineHeight: '40px', color: '#020001', mt: '24px' }}>
                                    Are you sure you want to delete the company account?
                                </Typography>
                                <Typography sx={{ fontWeight: '400', fontSize: '20px', lineHeight: '32px', color: '#7D7B7C', mt: '5px' }}>
                                    You cannot revert this change.
                                </Typography>
                            </Box>
                            <Box borderTop='1px solid #C6C7C5' padding='23px 40px' display='flex' justifyContent='flex-end' mt='40px'>
                                <DeleteButton onClick={handleDelete} sx={{ marginRight: '16px' }}>Delete</DeleteButton>
                                <CancelButton onClick={() => setDeleteProfile(false)}>Cancel</CancelButton>
                            </Box>
                        </Dialog>


                        {/* Edit Company Drawer */}
                        <Drawer
                            anchor={'right'}
                            open={openEditCompany}
                            PaperProps={{
                                sx: { width: "calc(100% - 260px)" },
                            }}
                        >
                            <Box sx={{ width: '100%', padding: '48px 32.2px' }}>
                                <EditCompanyDrawer
                                    companyData={companyData}
                                    handleCloseEditCompany={() => { setOpenEditCompany(false) }}

                                />
                            </Box>
                        </Drawer>

                        {/* View Employee Profile */}
                        <Drawer
                            anchor={'right'}
                            open={openEmpProfile}
                            PaperProps={{
                                sx: { width: "calc(100% - 260px)" },
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <EmployeeProfileDrawer
                                    handleCloseEmpProfile={() => { setOpenEmpProfile(false) }}
                                />
                            </Box>
                        </Drawer>


                    </Box >
                )
            }
        </>
    )
}

export default CompanyProfileDrawer