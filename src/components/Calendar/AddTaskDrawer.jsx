import React, { useEffect, useState } from 'react'
import { ReactComponent as CloseCircle } from '../../Assets/SVGs/CloseCircle.svg';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Button, Chip, Typography, Menu, MenuItem, Checkbox, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomTextField from '../CustomDrawerTextField/CustomTextField';
import { Add, ErrorOutline } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { format } from 'date-fns';
import moment from 'moment/moment';
import { toast } from 'react-hot-toast';
import { ReactComponent as AddCircle } from '../../Assets/SVGs/AddCircle.svg';
import { ReactComponent as SmallPaperclip } from '../../Assets/SVGs/SmallPaperclip.svg';
import { ReactComponent as Cross } from '../../Assets/SVGs/Cross.svg';
import { ReactComponent as CalendarIcon } from '../../Assets/SVGs/Calendar.svg';
import { Calendar } from 'react-date-range';

import { ReactComponent as Dropdown } from '../../Assets/SVGs/FieldDropdown.svg';
import { privateRequest } from '../../ApiMethods';
import { calendarReloadTrue, closeTaskDrawer } from '../../Redux/calendarSlice';


const useStyles = makeStyles((theme) => ({
    errorIcon: {
        marginRight: '16px',
        fontSize: '24px !important',
        color: '#CB2C17',
    },
    errorMessage: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'DM Sans', sans-serif !important",
        fontSize: '14px !important',
        color: '#CB2C17',
        marginTop: '3px'
    },
}));

const AddTaskDrawer = () => {

    var validationSchema = yup.object({
        taskName: yup
            .string('Task Name')
            .required('Task Name is required')
            .max(30, 'Name can have at most 30 characters'),
        status: yup
            .string('Start Date')
            .required('Status is required'),
        dueDate: yup
            .string('DueDate')
            .required('Due date is required'),
        startDate: yup
            .string('StartDate')
            .required('Start date is required'),
        assigneeID: yup
            .string('Assignee ID')
            .required('Assigne ID is required'),
        assigneeName: yup
            .string('Assignee Name')
            .required('Assigne Name is required'),
        description: yup
            .string('Description')
            .required('Description is required')
            .max(300, 'Description can have at most 300 characters'),
    });


    const formik = useFormik({
        initialValues: {
            taskName: '',
            status: '',
            dueDate: '',
            startDate: '',
            description: '',
            assigneeName: '',
            assigneeID: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            console.log('reasada');

            const formData = new FormData();
            formData.append('taskName', values.taskName);
            formData.append('description', values.description);
            formData.append('startDate', values.startDate);
            formData.append('dueDate', values.dueDate);
            formData.append('status', values.status);
            formData.append('assignee', values.assigneeID);
            attachedFiles.forEach((singleFile) => {
                formData.append('file', singleFile);
            })
            selectedEmployees.forEach((employee) => {
                formData.append('collaborators', employee._id);
            })
            privateRequest.post('/task', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                toast.success(res.data.message);
                dispatch(calendarReloadTrue())
                dispatch(closeTaskDrawer())
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            });

        }
    })




    const classes = useStyles();
    const dispatch = useDispatch()
    const [attachedFiles, setAttachedFiles] = useState([])
    const [startShownDate, setStartShownDate] = useState(new Date());
    const [openStartDate, setOpenStartDate] = useState(false);
    const [dueShownDate, setDueShownDate] = useState(new Date());
    const [openDueDate, setOpenDueDate] = useState(false);
    const [assigneList, setAssigneList] = useState([])
    const [assigneePicture, setAssignePicture] = useState(null)
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employeeAnchorEl, setEmployeeAnchorEl] = useState(null);
    const userCompany = useSelector((state) => state.auth.userDetails.company)



    const handleDeleteAttendee = (idToRemove) => {
        setSelectedEmployees(selectedEmployees.filter(employeeDetail => employeeDetail._id !== idToRemove))
    };

    const handleEmployeeToggle = (employee) => () => {
        const selectedIndex = selectedEmployees.indexOf(employee);
        let newSelected = [...selectedEmployees];

        if (selectedIndex === -1) {
            // Employee is not selected, check capacity before adding
            if (newSelected.length < 5) {
                newSelected.push(employee);
            } else {
                toast.error('Maximum 5 collaborators allowed');
            }
        } else {
            // Employee is already selected, remove them from the selection
            newSelected.splice(selectedIndex, 1);
        }

        setSelectedEmployees(newSelected);
    };


    const handleEmployeeClick = (event) => {
        setEmployeeAnchorEl(event.currentTarget);
    };

    const handleEmployeeClose = () => {
        setEmployeeAnchorEl(null);
    };

    const isEmployeeSelected = (employee) => {
        return selectedEmployees.some((selectedEmployee) => selectedEmployee._id === employee._id);
    };


    const removeFile = (fileToRemove) => {
        setAttachedFiles(attachedFiles.filter((file) => file !== fileToRemove))
    }

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value) => {
        let name = `${value.firstName.en} ${value.lastName.en}`
        setAssignePicture(value.profilePicture)
        setAnchorEl(null);
        formik.setFieldValue('assigneeName', name)
        formik.setFieldValue('assigneeID', value._id)
    }

    const fetchEmployees = () => {
        privateRequest.get(`/company/${userCompany}/users`, {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 99999999
            }
        }).then((res) => {
            setAssigneList(res.data.docs)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    useEffect(() => {
        fetchEmployees()
    }, [])


    useEffect(() => {

        let tempArray = [...selectedEmployees]
        tempArray = tempArray.filter((employee) => employee._id !== formik.values.assigneeID)
        setSelectedEmployees(tempArray)

    }, [formik.values.assigneeID])


    return (

        <>

            {/* {Object.keys(formik.errors).length > 0 && (
                <div>
                    {Object.keys(formik.errors).map((fieldName) => (
                        <div key={fieldName}>{formik.errors[fieldName]}</div>
                    ))}
                </div>
            )} */}




            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: "24px" }}>
                <Typography sx={{ color: '#272627', fontSize: '32px', fontWeight: "700", lineHeight: 'normal', }}>
                    Add Task
                </Typography>
                <CloseCircle onClick={() => { dispatch(closeTaskDrawer()) }} style={{ cursor: 'pointer' }} />
            </div>


            <form onSubmit={formik.handleSubmit}>
                <div style={{ gap: '24px', display: 'flex', flexDirection: 'column', width: '546px' }}>

                    <div>
                        <CustomTextField
                            id='taskName'
                            placeholder="Task name"
                            variant="outlined"
                            value={formik.values.taskName}
                            onChange={(event) => { formik.setFieldValue('taskName', event.target.value) }}
                            style={{ marginRight: '24px' }}
                        />
                        <Box>
                            {typeof formik.errors.taskName !== "undefined" && formik.touched.taskName
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.taskName}</span>
                                : null
                            }
                        </Box>
                    </div>

                    <div>
                        <Box sx={{ display: 'flex', width: '100%', alignItems: "center" }}>
                            <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: 'noraml', color: '#565556', mr: '57px' }}>
                                Assignee
                            </Typography>
                            <Button
                                onClick={handleClick}
                                endIcon={<Dropdown />}
                                sx={{ padding: '10px 16px', gap: '12px', width: '290px', height: '56px', background: 'transparent', borderRadius: '8px', textTransform: 'none', justifyContent: 'space-between', alignItems: 'center', fontWeight: 400, fontSize: '16px', lineHeight: '28px', color: '#7D7B7C' }}
                            >
                                {formik.values.assigneeName === '' ? 'Select a assignee' : (
                                    <Box display='flex' alignItems='center'>
                                        <Avatar
                                            alt="Avatar"
                                            src={assigneePicture}
                                            sx={{ width: '40px', height: '40px', mr: '10px' }}
                                        />
                                        {formik.values.assigneeName}
                                    </Box>
                                )}
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                                sx={{
                                    maxHeight: '100xpx', overflow: 'auto'
                                }}
                                PaperProps={{
                                    style: {
                                        width: '290px', background: '#FAFAFA', border: '1px solid #F5F6F4', borderRadius: '8px', maxHeight: '300px',
                                        overflow: 'auto',
                                    },
                                }
                                }
                            >
                                {
                                    assigneList.map((value, index) => (
                                        <MenuItem key={{ index }} onClick={() => handleClose(value)}>
                                            <>
                                                <Avatar
                                                    alt="Avatar"
                                                    src={value.profilePicture}
                                                    sx={{ width: '40px', height: '40px', mr: '10px' }}
                                                />
                                                {`${value.firstName.en} ${value.lastName.en}`}
                                            </>
                                        </MenuItem>
                                    ))
                                }

                            </Menu>
                        </Box>
                        <Box>
                            {typeof formik.errors.assigneeName !== "undefined" && formik.touched.assigneeName
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.assigneeName}</span>
                                : null
                            }
                        </Box>
                    </div>


                    <div>
                        <Box onClick={(event) => { setOpenStartDate(!openStartDate) }} sx={{ position: 'relative', alignItems: "center", width: 'inherit', backgroundColor: formik.values.startDate === '' ? '#FAFAFA' : '#EEE5F1', borderRadius: '8px', height: '56px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', '&:hover': { backgroundColor: '#EEE5F1' } }}>
                            <Typography sx={{
                                fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: formik.values.startDate === '' ? '#c6c5c5' : '#7D7B7C'
                            }}>
                                {formik.values.startDate === '' ? 'Start Date' : formik.values.startDate}
                            </Typography>
                            <CalendarIcon />
                        </Box>
                        {typeof formik.errors.startDate !== "undefined" && formik.touched.startDate
                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.startDate}</span>
                            : null
                        }

                        {openStartDate && <div style={{ width: "inherit", backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
                            <Calendar
                                date={startShownDate}
                                className='calendarElement'
                                onChange={(date) => {
                                    setStartShownDate(date)
                                    formik.setFieldValue('startDate', format(date, 'yyyy-MM-dd'))
                                    setOpenStartDate(false)
                                }}
                                minDate={new Date()}
                                color="#8D55A2"
                                colorPrimary="#8D55A2"
                            />
                        </div>
                        }
                    </div>

                    <div>
                        <Box onClick={(event) => { setOpenDueDate(!openDueDate) }} sx={{ position: 'relative', alignItems: "center", width: 'inherit', backgroundColor: formik.values.dueDate === '' ? '#FAFAFA' : '#EEE5F1', borderRadius: '8px', height: '56px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', '&:hover': { backgroundColor: '#EEE5F1' } }}>
                            <Typography sx={{
                                fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: formik.values.dueDate === '' ? '#c6c5c5' : '#7D7B7C'
                            }}>
                                {formik.values.dueDate === '' ? 'Due Date' : formik.values.dueDate}
                            </Typography>
                            <CalendarIcon />
                        </Box>
                        {typeof formik.errors.dueDate !== "undefined" && formik.touched.dueDate
                            ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.dueDate}</span>
                            : null
                        }

                        {openDueDate && <div style={{ width: "inherit", backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
                            <Calendar
                                date={dueShownDate}
                                className='calendarElement'
                                onChange={(date) => {
                                    setDueShownDate(date)
                                    formik.setFieldValue('dueDate', format(date, 'yyyy-MM-dd'))
                                    setOpenDueDate(false)
                                }}
                                minDate={startShownDate}
                                color="#8D55A2"
                                colorPrimary="#8D55A2"
                            />
                        </div>
                        }
                    </div>

                    <div>
                        <CustomDropdown
                            placeholderValue='Task status'
                            menuItems={['Todo', 'In Progress', 'Done']}
                            value={formik.values.status}
                            handleDropdownValue={(value) => {
                                formik.setFieldValue('status', value)
                            }}
                        />
                        <Box>
                            {typeof formik.errors.status !== "undefined" && formik.touched.status
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.status}</span>
                                : null
                            }

                        </Box>
                    </div>

                    <div>
                        <Box width='100%' sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: "#FAFAFA", padding: '10px 16px', height: '56px', border: '1px solid #F5F6F4', borderRadius: '8px', alignItems: 'center', fontWeight: 400, fontSize: '16px', lineHeight: '28px', width: '100%', color: '#7D7B7C', cursor: "pointer", '&:hover': { backgroundColor: "#e8e1eb" }, }} onClick={handleEmployeeClick}>
                            Select Collaborators
                            <Dropdown />
                        </Box>
                        <Menu
                            anchorEl={employeeAnchorEl}
                            open={Boolean(employeeAnchorEl)}
                            onClose={handleEmployeeClose}
                            sx={{
                                '& .MuiPaper-root': {
                                    margin: '0',
                                    padding: '0',
                                    backgroundColor: '#FAFAFA',
                                    width: '546px',
                                    maxHeight: '300px',
                                    overflow: 'auto'
                                },
                            }}
                        >
                            {
                                assigneList.filter((assignee) => assignee._id !== formik.values.assigneeID).map((employee) => (
                                    <MenuItem
                                        className={classes.dropdownMenuItem}
                                        key={employee._id} onClick={handleEmployeeToggle(employee)}>
                                        <Checkbox
                                            checked={isEmployeeSelected(employee)}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                        <Avatar
                                            alt="Avatar"
                                            src={employee.profilePicture}
                                            sx={{ width: '40px', height: '40px', mr: '10px' }}
                                        />
                                        {`${employee.firstName.en} ${employee.lastName.en}`}
                                    </MenuItem>
                                ))}
                        </Menu>

                        {
                            selectedEmployees.length > 0 &&
                            <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: 'normal', color: '#565556', mb: '8px', mt: '8px' }}>
                                Collaborators
                            </Typography>
                        }

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%', }}>

                            {selectedEmployees.map((value, index) => (
                                <Chip key={index} onDelete={() => { handleDeleteAttendee(value._id) }} sx={{ borderRadius: '8px' }} label={`${value.firstName.en} ${value.lastName.en}`} avatar={<Avatar src={value.profilePicture} />} />
                            ))}

                        </div>

                    </div>

                    <div>
                        <CustomTextField
                            id='description'
                            placeholder="Description"
                            variant="outlined"
                            value={formik.values.description}
                            onChange={(event) => { formik.setFieldValue('description', event.target.value) }}
                            style={{ marginRight: '24px' }}
                        />
                        <Box>
                            {typeof formik.errors.description !== "undefined" && formik.touched.description
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.description}</span>
                                : null
                            }
                        </Box>
                    </div>


                    <input
                        id="icon-button-file"
                        type="file"
                        accept="*/*"
                        multiple={true}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const filesArray = [...e.target.files];
                            if ((filesArray.length + attachedFiles.length) <= 5) {
                                const tempArray = [...attachedFiles]
                                filesArray.forEach((file) => {
                                    tempArray.push(file)
                                })
                                setAttachedFiles(tempArray)
                            }
                            else {
                                toast.error('Maximum 5 files allowed for attachment.')
                            }
                        }}
                    />
                    <label htmlFor="icon-button-file">
                        <div style={{ width: '100%', height: '52px', backgroundColor: '#EEE5F1', border: ' 1px dashed #8D55A2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: "pointer" }}>
                            <Typography sx={{ fontWeight: "400", fontSize: '16px', lineHeight: '28px', color: '#8D55A2', }}>
                                Upload Attchments
                            </Typography>
                        </div>
                    </label>

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

                    <div style={{ marginTop: '56px', display: 'flex', justifyContent: 'flex-end', gap: '24px' }}>
                        <Button variant='outlined' sx={{ height: '40px', width: '166px', borderRadius: '51px', padding: '0px 24px', fontSize: '16px', fontWeight: '500' }}>Back</Button>
                        <Button type='submit' variant='contained' sx={{ height: '40px', width: '166px', borderRadius: '51px', padding: '0px 24px', fontSize: '16px', fontWeight: '500' }}>Save</Button>
                    </div>
                </div>
            </form >


        </>

    )
}

export default AddTaskDrawer