import React, { useEffect, useState } from 'react'
import { closeViewDrawer, myTicketsReloadTrue, receivedTicketsReloadTrue } from '../../../Redux/supportSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Box, Button, Chip, CircularProgress, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { ReactComponent as CloseCircle } from '../../../Assets/SVGs/CloseCircle.svg';
import { ReactComponent as Dropdown } from '../../../Assets/SVGs/FieldDropdown.svg';
import { ReactComponent as SmallPaperclip } from '../../../Assets/SVGs/SmallPaperclip.svg';
import { ReactComponent as Paperclip } from '../../../Assets/SVGs/Paperclip.svg';
import { ReactComponent as Cross } from '../../../Assets/SVGs/Cross.svg';
import { ReactComponent as PendingGray } from '../../../Assets/SVGs/Pending_Gray.svg';
import { ReactComponent as DoneGray } from '../../../Assets/SVGs/Done_Gray.svg';
import { ReactComponent as PendingWhite } from '../../../Assets/SVGs/Pending_White.svg';
import { ReactComponent as DoneWhite } from '../../../Assets/SVGs/Done_White.svg';
import { ReactComponent as Line } from '../../../Assets/SVGs/Line.svg';
import { ReactComponent as CarpetDown } from '../../../Assets/SVGs/CaretDown.svg';
import { privateRequest } from '../../../ApiMethods';
import { toast } from 'react-hot-toast';
import SkeletonLoader from '../../SkeletonLoader.jsx/SkeletonLoader';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    ticketDone: {
        height: '436px',
        overflow: "auto"
    }
}));

function TicketDetailsDrawer() {
    const classes = useStyles();

    const hostData = [1, 2, 3, 4, 5]
    const value = {
        name: "Dummy file name.PNG",
        size: 1231232
    }

    const dispatch = useDispatch()
    const ticketID = useSelector((state) => state.support.ticketID)

    const [anchorEl, setAnchorEl] = useState(null);
    const [dropdownAnchor, setDropdownAnchor] = useState(null);

    const [selectedUser, setSelectedUser] = useState('Select a user');
    const [btnLoader, setBtnLoader] = useState(false)
    const [buttonType, setButtonType] = useState('Pending');
    const [Profile, setProfile] = useState(null);
    const [reply, setReply] = useState('')
    const [attachedFiles, setAttachedFiles] = useState([])
    const [ticketDetails, setTicketDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const removeFile = (fileToRemove) => {
        setAttachedFiles(attachedFiles.filter((file) => file !== fileToRemove))
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value) => {
        // let name = `${value.firstName.en} ${value.lastName.en}`
        let name = 'Hard Coded'
        setSelectedUser(name);
        setProfile(value.profilePicture)
        setAnchorEl(null);
    }

    const fetchTicketDetails = () => {
        privateRequest.get(`/ticket/${ticketID}`).then((res) => {
            setTicketDetails(res.data)
            setIsLoading(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const handleReplyUser = () => {
        const formData = new FormData();
        attachedFiles.forEach((value) => {
            formData.append('files', value);
        });
        formData.append('messageContent', reply);
        privateRequest.put(`/ticket/reply/${ticketID}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            setTicketDetails(res.data)
            setAttachedFiles([])
            setReply('')
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        }).finally(() => {
            setBtnLoader(false)
        })

    }

    const handleChangeStatus = () => {
        let apiObject = {
            status: buttonType
        }
        privateRequest.put(`/ticket/${ticketID}`, apiObject).then((res) => {
            toast.success('Status Changed Successfully.')
            dispatch(myTicketsReloadTrue())
            dispatch(receivedTicketsReloadTrue())
            dispatch(closeViewDrawer())
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    const handleReopenTicket = async () => {
        await setBtnLoader(true)
        let apiObject = {
            status: 'Pending'
        }
        privateRequest.put(`/ticket/${ticketID}`, apiObject).then(async () => {
            await fetchTicketDetails()
            toast.success('Status Changed Successfully.')
            dispatch(myTicketsReloadTrue())
            dispatch(receivedTicketsReloadTrue())
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        }).finally(() => {
            setBtnLoader(false)
        })
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const timeDiff = now - date;

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        let timeAgo = "";
        if (years > 0) {
            return timeAgo += `${years} ${years === 1 ? "year" : "years"} ago`;
        }
        else if (months > 0) {
            return timeAgo += `${months} ${months === 1 ? "month" : "months"} ago`;
        }
        else if (days > 0) {
            return timeAgo += `${days} ${days === 1 ? "day" : "days"} ago`;
        }
        else if (hours > 0) {
            return timeAgo += `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        }
        else if (minutes > 0) {
            return timeAgo += `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
        }
        else {
            return timeAgo += `less than a minute ago`
        }

    }

    const formatDate = (givenDate) => {
        const date = new Date(givenDate);
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        const formattedDate = `${month} ${day}`;

        return formattedDate;
    }

    const handleFileDownload = (event, url, fileName) => {
        event.preventDefault();
        event.stopPropagation();
        const link = document.createElement('a');
        link.href = url;
        link.rel = 'noreferrer';
        link.target = '_blank';
        link.download = fileName;
        link.click();
    };

    const handleEscalate = () => {
        privateRequest.put(`/ticket/escalate/${ticketID}`).then((res) => {
            toast.success(res.data.message)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    useEffect(() => {
        fetchTicketDetails()
    }, [])

    if (isLoading) {
        return <SkeletonLoader />
    }

    const DownloadFile = ({ fileDetails, index }) => {
        return <>
            <Box
                onClick={(event) => { handleFileDownload(event, fileDetails, `Attchment ${index}`) }}
                sx={{ display: 'flex', backgroundColor: '#FAFAFA', height: '42px', cursor: 'pointer', width: '300px' }}
            >
                <SmallPaperclip style={{ margin: '11.1px 20.6px 0px 0px' }} />

                <Box sx={{ display: 'flex', mt: '10px', }}>
                    <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#8D55A2', }}>
                        attachment {index}.png <span style={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#565556' }}>
                            (
                            {1060 > 1000000 ? (10231 / 1000000).toFixed(2) + " MB" : (1230 / 1024).toFixed(2) + " KB"}
                            {/* {fileDetails.size > 1000000 ? (fileDetails.size / 1000000).toFixed(2) + " MB" : (fileDetails.size / 1024).toFixed(2) + " KB"} */}

                            )
                        </span>
                    </Typography>

                </Box>
            </Box>
        </>
    }

    const Chat = ({ profilePicture, firstName, lastName, company, createdAt, message, attachments }) => {

        return <Box sx={{ borderTop: '1px solid #DBDBDA', width: '100%', padding: '24px 127px 50px 31px' }}>

            {/* Profile , Time , Employee And Company Details */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                    <img src={profilePicture} alt="Profile" style={{
                        width: '70px',
                        height: '64px',
                        border: '1px solid #DBDBDA',
                        borderRadius: '16px',
                        marginRight: '23px'
                    }} />
                    <Box>
                        <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '24px', color: '#444344', mt: '7px' }}>
                            {firstName} {lastName}
                        </Typography>
                        <Typography sx={{ fontWeight: "500", fontSize: '14px', lineHeight: '24px', color: '#444344', mt: '2px' }}>
                            {company?.name}
                        </Typography>
                    </Box>
                </Box>

                <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '20.83px', color: '#565556', mt: '21.5px' }}>
                    {formatTime(createdAt)}
                </Typography>
            </Box>

            <Box sx={{ mt: '31.2px', ml: '93.77px' }}>
                {/* Message */}
                <Typography sx={{
                    fontWeight: "400", fontSize: '16px', lineHeight: '26px', color: '#565556', width: '100%', wordWrap: 'break-word',
                }}>
                    {message}
                </Typography>

                {/* Attachment files */}
                <Stack gap={1} mt='29.8px'>
                    {
                        attachments.map((value, index) => (
                            <Box key={index}>
                                <DownloadFile fileDetails={value} index={index + 1} />
                            </Box>
                        ))
                    }
                </Stack>
            </Box>

        </Box>
    }

    return (
        <Box sx={{ position: 'relative', height: ticketDetails.status === 'Pending' ? "100%" : '100vh' }}>
            {/* Header */}
            <Box width='100%'>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '48px 35.39px 0px 30.64px', width: '100%' }}>
                    <Typography sx={{
                        fontWeight: '700', fontSize: '32px', lineHeight: '41.66px', color: '#272627',
                        width: '90%',// wordWrap: 'break-word',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                        {ticketDetails.title}
                    </Typography>

                    <CloseCircle onClick={() => dispatch(closeViewDrawer())} style={{ cursor: 'pointer', marginTop: '6.67px' }} />
                </Box>


                <Box display='flex' justifyContent='space-between' mt="18px" mb='48px' padding='0px 124px 0px 30.64px'  >
                    <Box display='flex'>
                        <Typography sx={{ fontWeight: '400', fontSize: '24px', lineHeight: '24px', color: '#444344', mr: '40px' }}>
                            {formatDate(ticketDetails.createdAt)}
                        </Typography>

                        <Typography sx={{ fontWeight: '400', fontSize: '24px', lineHeight: '24px', color: '#444344', }}>
                            Related to: {ticketDetails.relatedTo}
                        </Typography>

                        {ticketDetails.status === 'Pending' &&
                            <Box Box display='flex' alignItems='center' mt="-16px" ml='130px'>

                                <Typography sx={{ fontWeight: '400', fontSize: '24px', lineHeight: '24px', color: '#444344', mr: '18px' }}>
                                    Assign to:
                                </Typography>

                                <Box >
                                    <Button
                                        onClick={handleClick}
                                        endIcon={<Dropdown />}
                                        sx={{
                                            padding: '10px 16px',
                                            gap: '12px',
                                            width: '290px',
                                            height: '56px',
                                            background: 'transparent',
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontWeight: 400,
                                            fontSize: '16px',
                                            lineHeight: '28px',
                                            color: '#7D7B7C'
                                        }}
                                    >
                                        {selectedUser === '' ? 'Select a user' : (
                                            <Box display='flex' alignItems='center'>
                                                {/* <Avatar
                                            alt="Avatar"
                                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx1XXbNrro4ayDXSkp_W-dEU2XLhcANNZAaA&usqp=CAU'
                                            sx={{ width: '40px', height: '40px', mr: '10px' }}
                                        /> */}
                                                {`${selectedUser}`}
                                            </Box>
                                        )}
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={() => setAnchorEl(null)}
                                        PaperProps={{
                                            style: {
                                                width: '290px',
                                                background: '#FAFAFA',
                                                border: '1px solid #F5F6F4',
                                                borderRadius: '8px',
                                            },
                                        }}
                                    >
                                        {
                                            hostData.map((value, index) => (
                                                <MenuItem key={{ index }} onClick={() => handleClose(value)}>
                                                    <>
                                                        <Avatar
                                                            alt="Avatar"
                                                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx1XXbNrro4ayDXSkp_W-dEU2XLhcANNZAaA&usqp=CAU'
                                                            sx={{ width: '40px', height: '40px', mr: '10px' }}
                                                        />

                                                        hard coded
                                                    </>
                                                </MenuItem>
                                            ))
                                        }

                                    </Menu>
                                </Box>

                            </Box >
                        }
                    </Box>

                    {ticketDetails.status === 'Done' &&
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: '400', fontSize: '24px', lineHeight: '24px', color: '#444344', mr: '8px' }}>
                                Status
                            </Typography>
                            <Chip label="Done" sx={{ backgroundColor: '#858484', fontSize: '16px', lineHeight: '28px', padding: '2px 16px', color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", }} />
                        </Box>
                    }




                </Box>
            </Box >

            {/* Chat Body */}
            <Box sx={{
                // ...(ticketDetails.status === 'Done' && classes.ticketDone) 
                height: ticketDetails.status === 'Done' ? '436px' : 'auto',
                overflow: ticketDetails.status === 'Done' && 'auto'
            }}>
                < Chat
                    firstName={ticketDetails.createdBy.firstName.en}
                    lastName={ticketDetails.createdBy.lastName.en}
                    profilePicture={ticketDetails.createdBy.profilePicture}
                    company={ticketDetails.createdBy.company}
                    createdAt={ticketDetails.createdAt}
                    message={ticketDetails.description}
                    attachments={ticketDetails.attachments}
                />

                {
                    ticketDetails.conversation.length !== 0 && (
                        <>
                            {
                                ticketDetails.conversation.map((value, index) => (
                                    <Chat key={index}
                                        firstName={value.sender.firstName.en}
                                        lastName={value.sender.lastName.en}
                                        profilePicture={value.sender.profilePicture}
                                        company={value.sender.company}
                                        createdAt={value.sentTime}
                                        message={value.messageContent}
                                        attachments={value.messageAttachments}
                                    />
                                ))
                            }

                        </>
                    )
                }
            </Box>

            {/* Footer */}
            {ticketDetails.status === 'Pending' &&
                <Box sx={{ mt: '32px', padding: '0px 87px 136px 32px', display: 'flex' }}>

                    <img src={ticketDetails.assignedTo.profilePicture} alt="Profile" style={{
                        width: '70px',
                        height: '64px',
                        border: '1px solid #DBDBDA',
                        borderRadius: '16px',
                        marginRight: '17.24px'
                    }} />

                    <Box sx={{ width: '100%', border: '1px solid #DBDBDA', borderRadius: '8px', padding: '23px' }}>
                        <TextField
                            sx={{
                                '& .MuiInputBase-root': {

                                    height: '100px',
                                    fontSize: '16px',
                                    fontFamily: "'DM Sans', sans-serif ",
                                    lineHeight: '28px',
                                    color: '#7D7B7C',
                                    borderRadius: '8px',
                                },
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    border: '0px solid #F5F6F4', // set the border width when the input is focused
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: '0px solid #F5F6F4', // remove the border by default
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    border: '0px solid #F5F6F4', // set the border width on hover
                                },
                                width: '100%',
                                backgroundColor: '#FAFAFA',
                                borderRadius: '8px',
                            }}
                            id='reply'
                            placeholder='Send your reply'
                            variant="outlined"
                            value={reply}
                            onChange={(event) => { setReply(event.target.value) }}
                            multiline={true}
                            rows={3}
                            inputProps={{ maxLength: 500 }}
                        />

                        <Box sx={{ backgroundColor: '#FAFAFA', width: '100%', display: 'flex', justifyContent: 'space-between', borderBottomLeftRadius: '8px', borderBottomRightRadius: "8px" }}>

                            <Stack gap={1} mb="18px" ml="16px" >
                                {
                                    attachedFiles.map((value, index) => (
                                        <Box key={index} sx={{ display: 'flex', backgroundColor: '#EAEAEA', height: '42px', width: '510px' }}>
                                            <SmallPaperclip style={{ margin: '11.1px 20.6px 0px 11.75px' }} />

                                            <Box sx={{ display: 'flex', width: '414px', mt: '10px', }}>
                                                <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#8D55A2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}>
                                                    {value.name} <span style={{ color: '#EAEAEA' }}>.</span>
                                                </Typography>
                                                <span style={{ fontWeight: "400", fontSize: '18px', lineHeight: '24px', color: '#565556', marginRight: '48px' }}>
                                                    ({value.size > 1000000 ? (value.size / 1000000).toFixed(2) + " MB" : (value.size / 1024).toFixed(2) + " KB"})
                                                </span>

                                            </Box>
                                            <Cross style={{ marginTop: '9px', cursor: 'pointer' }} onClick={() => removeFile(value)} />
                                        </Box>
                                    ))
                                }
                            </Stack>

                            <input
                                id="icon-button-file"
                                type="file"
                                accept="*/*"
                                multiple={false}
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    if (attachedFiles.length <= 2) {
                                        setAttachedFiles(oldFiles => [...oldFiles, e.target.files[0]])
                                    } else {
                                        toast.error('Maximum file attachment limit exceeded.')
                                    }
                                }}
                            />
                            <label htmlFor="icon-button-file">
                                <Paperclip style={{ cursor: 'pointer', marginLeft: '-51px', marginBottom: '18px' }} />
                            </label>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: 'space-between', mt: '24px' }}>
                            <Button onClick={handleEscalate} variant='outlined' sx={{ padding: '0px 24px', borderRadius: '51px', fontSize: '16px' }}> Escalate to Spacehub</Button>
                            <Box display='flex'>


                                < Button variant='contained'
                                    onClick={handleChangeStatus}
                                    sx={{
                                        borderRadius: '51px 0px 0px 51px', fontSize: '16px', width: '130px',
                                        // '&:hover': {
                                        //     backgroundColor: '#EEE5F1',
                                        // }
                                    }}>
                                    {buttonType === 'Pending' ?
                                        <PendingWhite style={{ marginRight: '12px' }} />
                                        : <DoneWhite style={{ marginRight: '12px', marginLeft: '-20px' }} />

                                    }
                                    {buttonType}
                                </Button>
                                <Box backgroundColor='#8D55A2'>
                                    <Line style={{ marginTop: '5.5px' }} />
                                </Box>
                                < Button variant='contained' sx={{ borderRadius: '0px 51px 51px 0px', fontSize: '16px' }} onClick={(event) => setDropdownAnchor(event.currentTarget)}>
                                    <CarpetDown />
                                </Button>

                                <Button variant='outlined'
                                    onClick={() => { setBtnLoader(true); handleReplyUser() }}
                                    sx={{
                                        width: '145px',
                                        padding: '0px 24px',
                                        borderRadius: '51px',
                                        backgroundColor: '#EEE5F1',
                                        ml: '24px',
                                        fontSize: '16px',
                                        '&:hover': {
                                            backgroundColor: '#EEE5F1',
                                        }
                                    }}>
                                    {btnLoader ? <CircularProgress sx={{ color: '#8D55A2' }} size={23} /> : 'Comment'}
                                </Button>
                            </Box>
                        </Box>

                    </Box >



                </Box >
            }
            {ticketDetails.status === 'Done' &&
                <Box sx={{ width: '100%', backgroundColor: '#FFFFFF', zIndex: 999, position: 'absolute', bottom: '0px', display: 'flex', borderTop: "1px solid #DBDBDA", justifyContent: 'flex-end', padding: "21px 45px 42px 0px" }}>
                    <Button onClick={() => { dispatch(closeViewDrawer()) }} variant='outlined' sx={{ borderRadius: '51px', fontSize: '16px', fontWeight: 500, lineHeight: '28px', width: '166px', mr: '16px' }}>Back</Button>
                    <Button onClick={handleReopenTicket} variant='contained' sx={{ borderRadius: '51px', fontSize: '16px', fontWeight: 500, lineHeight: '28px', width: '166px', mr: '16px' }}>
                        {btnLoader ? <CircularProgress sx={{ color: '#FFFFFF' }} size={23} /> : 'Reopen Ticket'}
                    </Button>
                </Box >
            }


            <Menu
                anchorEl={dropdownAnchor}
                open={Boolean(dropdownAnchor)}
                onClose={() => setDropdownAnchor(null)}
                PaperProps={{
                    style: {
                        width: '220px',
                        background: '#FAFAFA',
                        border: '1px solid #F5F6F4',
                        borderRadius: '8px',
                        padding: '0px',
                        fontSize: '16px',
                        lineHeight: '28px',
                        color: '#7D7B7C',
                        marginLeft: '-160px'
                    },
                }}
            >

                <MenuItem
                    onClick={() => {
                        setButtonType('Done')
                        setDropdownAnchor(null)
                    }}
                >
                    <DoneGray style={{ marginRight: '12px' }} />
                    As Done
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setButtonType('Pending')
                        setDropdownAnchor(null)
                    }}
                >
                    <PendingGray style={{ marginRight: '12px' }} />
                    As Pending
                </MenuItem>

            </Menu >

        </Box>
    )
}

export default TicketDetailsDrawer