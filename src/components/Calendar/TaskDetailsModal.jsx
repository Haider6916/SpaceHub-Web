import { Avatar, AvatarGroup, Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactComponent as SmallCloseCircle } from '../../Assets/SVGs/SmallCloseCircle.svg';
import { ArrowLeft, KeyboardBackspace } from '@mui/icons-material';
import CustomTextField from '../CustomDrawerTextField/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';
import { closeTaskModal } from '../../Redux/calendarSlice';
import { privateRequest } from '../../ApiMethods';
import { toast } from 'react-hot-toast';
import SkeletonLoader from '../SkeletonLoader.jsx/SkeletonLoader';

const TaskDetailsModal = () => {

    const dispatch = useDispatch()

    const userProfilePicture = useSelector((state) => state.auth.userDetails.profilePicture)
    const ID = useSelector((state) => state.calendar.modal_ID_for_API)

    const [sideBoxType, setSideBoxType] = useState('all')
    const [comment, setComment] = useState('')
    const [Task, setTask] = useState(null);

    const fetchTaskDetials = () => {
        privateRequest.get(`/task/${ID}`)
            .then((response) => {
                console.log('response.data', response.data);
                setTask(response.data)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message)
            })
    }

    const formatDate = (utcDateString) => {
        const utcDate = new Date(utcDateString);

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = utcDate.toLocaleDateString(undefined, options);

        return formattedDate;
    };

    useEffect(() => {
        fetchTaskDetials()
    }, [])


    if (Task === null) {
        return <Box
            onClick={() => { dispatch(closeTaskModal()) }}
            sx={{
                position: 'relative',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '958px',
                height: '694.311px',
                background: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
            <SkeletonLoader userHeight={'685px'} />
        </Box>
    }

    return (
        <Box
            sx={{
                position: 'relative',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '958px',
                height: '694.311px',
                background: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 22px', borderBottom: '1px solid #DBDBDA', height: '70px' }}>
                <Typography sx={{ fontWeight: "700", fontSize: '24px', lineHeight: '24px', color: '#020001' }}>
                    {Task.taskName}
                </Typography>
                <SmallCloseCircle style={{ cursor: 'pointer' }} onClick={() => { dispatch(closeTaskModal()) }} />
            </Box>

            <Box sx={{ display: 'flex', padding: '21.5px 35px 40px 34px', width: '100%' }}>
                <Box>
                    <Box sx={{ display: 'flex', flexDirection: "column", width: '573px', heigth: '100%', gap: "28.8px" }}>
                        <div>
                            <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                Start Date:
                            </Typography>
                            <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                {formatDate(Task.startDate)}
                            </Typography>
                        </div>

                        <div>
                            <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                Due Date :
                            </Typography>
                            <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                {formatDate(Task.dueDate)}
                            </Typography>
                        </div>

                        <div>
                            <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                Description:
                            </Typography>
                            <Typography mt='6px' width='433.104px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                {Task.description}
                            </Typography>
                        </div>
                    </Box>
                    <Box>
                        <Typography mt='28px' width='433.104px' sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627', mb: '2px' }}>
                            Comments:
                        </Typography>
                        <div style={{ display: 'flex', alignItems: "center", }}>
                            <Avatar src={userProfilePicture} sx={{ mr: '14px' }} />
                            <CustomTextField
                                id='comment'
                                placeholder="Write Comment"
                                variant="outlined"
                                value={comment}
                                onChange={(event) => { setComment(event.target.value) }}
                            />
                        </div>

                        <div style={{ width: '542px' }}>
                            <div style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between', marginTop: '19.5px' }}>
                                <div style={{ display: 'flex', alignItems: "center" }}>
                                    <Avatar sx={{ mr: '14px' }} />
                                    <Typography sx={{ fontWeight: "700", fontSize: '16px', lineHeight: '23px', color: '#272627', mb: '2px' }}>
                                        Jane Doe
                                    </Typography>
                                </div>
                                <div >
                                    <Typography sx={{ fontWeight: "700", fontSize: '14px', lineHeight: 'normal', color: 'rgba(0, 0, 0, 0.40)' }}>
                                        5 min ago
                                    </Typography>
                                    <Typography sx={{ fontWeight: "400", fontSize: '14px', lineHeight: 'normal', color: 'rgba(0, 0, 0, 0.40)' }}>
                                        22 Aug, 2022
                                    </Typography>
                                </div>
                            </div>


                            <Typography sx={{ fontWeight: "400", fontSize: '18px', lineHeight: 'normal', color: 'rgba(0, 0, 0, 0.60)', mt: '8px' }}>
                                I really appreciate the insights and perspective shared in this article. It's definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing!
                            </Typography>

                        </div>
                    </Box>
                </Box>
                <div style={{ height: "558px", width: '0px', border: '1px solid #DBDBDA', marginRight: "50px", marginTop: '10px' }} />

                {sideBoxType === 'all' &&
                    <Box Box sx={{ width: 'calc(100% - 573px)', heigth: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        <div>
                            <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                Organizer:
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                <Avatar src={Task.createdBy.profilePicture} sx={{ mr: '10px' }} />
                                <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                    {Task.createdBy.firstName.en} {Task.createdBy.lastName.en}
                                </Typography>
                            </div>
                        </div>

                        {Task.collaborators.length !== 0 && <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'start', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                    Collaborators ({Task.collaborators.length})
                                </Typography>

                                <Button variant='text' onClick={() => { setSideBoxType('collaborators') }}>View all</Button>
                            </div>
                            <AvatarGroup max={6}>
                                {Task.collaborators.map((attendee, index) => (
                                    <Avatar key={index} src={attendee.profilePicture} />
                                ))}
                            </AvatarGroup>
                        </div>
                        }

                    </Box>
                }


                {sideBoxType === 'collaborators' &&
                    <Box sx={{ ml: '-20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: "15px" }}>
                            <KeyboardBackspace sx={{ mr: '13px', color: '#8D55A2', cursor: 'pointer' }} onClick={() => { setSideBoxType('all') }} />
                            <Typography sx={{ fontWeight: "500", fontSize: '18px', lineHeight: '23px', color: '#272627' }}>
                                All Collaborators:
                            </Typography>
                        </div>
                        <div style={{ height: "315px", width: '100%', overflow: 'auto', }}>
                            {
                                Task.collaborators.map((value, index) => (
                                    <div key={value._id} style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                        <Avatar src={value.profilePicture} sx={{ mr: '10px' }} />
                                        <Typography mt='6px' sx={{ fontWeight: "400", fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                            {value.firstName.en} {value.lastName.en}
                                        </Typography>
                                    </div>
                                ))
                            }
                        </div>
                    </Box>
                }
            </Box>

        </Box >
    )
}

export default TaskDetailsModal