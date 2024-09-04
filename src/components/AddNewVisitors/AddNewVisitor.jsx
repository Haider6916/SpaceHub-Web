import { Avatar, Box, Button, Checkbox, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactComponent as CloseCircle } from '../../Assets/SVGs/CloseCircle.svg';
import { ReactComponent as Dropdown } from '../../Assets/SVGs/FieldDropdown.svg';

import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import CustomTextField from '../CustomDrawerTextField/CustomTextField';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../ApiMethods';
import { makeStyles } from '@mui/styles';
import { ErrorOutline } from '@mui/icons-material';
import { visitorsReloadTrue } from '../../Redux/visitorsSlice';
import { useDispatch } from 'react-redux';

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

function AddNewVisitor(props) {

    const classes = useStyles();
    const dispatch = useDispatch()
    const [dropdownOptions, setDropdownOptions] = useState('')
    const [selectedUser, setSelectedUser] = useState('')
    const [hostData, setHostData] = useState([])
    const [Profile, setProfile] = useState('')


    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value) => {
        let name = `${value.firstName.en} ${value.lastName.en}`
        setSelectedUser(name);
        setProfile(value.profilePicture)
        setAnchorEl(null);
        formik.setFieldValue('hostID', value._id)
    }

    var validationSchema = yup.object({
        name: yup
            .string('Name')
            .required('Name is required'),
        hostID: yup
            .string('HostID')
            .required('Host is required'),
        reason: yup
            .string('Reason')
            .required('Reason is required'),
        duration: yup
            .string('Duration')
            .required('Duration is required'),
        email: yup
            .string('Email')
            .email('Enter a valid email')
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email')
            .required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            hostID: '',
            email: '',
            reason: '',
            duration: '',

        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            let apiObject = {
                "name": values.name,
                "host": values.hostID,
                "visitReason": values.reason,
                "email": values.email,
                "visitDuration": values.duration
            }

            privateRequest.post('/user/visitor', apiObject).then((res) => {
                toast.success(res.data.message)
                dispatch(visitorsReloadTrue())
                props.handleCloseDrawer(false)
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            })

        }
    });

    const handleFetchHosts = () => {
        privateRequest.get('/user?type=employee', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 100000
            }
        }).then((res) => {
            console.log('res.data', res.data);
            setHostData(res.data.docs)
            // let tempArray = []
            // res.data.docs.forEach((value, index) => {
            //     tempArray.push(value.name)
            // })
            // setHostsName(tempArray)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    useEffect(() => {
        handleFetchHosts()
    }, [])


    return (
        <form onSubmit={formik.handleSubmit}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography sx={{ fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                    Add Visitor
                </Typography>

                <CloseCircle onClick={() => props.handleCloseDrawer(false)} style={{ cursor: 'pointer' }} />

            </Box>


            <Box marginTop='24px'>
                <CustomTextField
                    id='name'
                    placeholder="Name"
                    variant="outlined"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                />
                <Box>
                    {typeof formik.errors.name !== "undefined" && formik.touched.name
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.name}</span>
                        : null
                    }
                </Box>
            </Box>


            <Box marginTop='24px' display='flex' alignItems='center'>

                <Typography sx={{ fontWeight: '400', fontSize: '16px', lineHeight: '21px', color: '#565556', mr: '30px' }}>
                    Host:
                </Typography>

                <Box width='100%'>
                    <Button
                        onClick={handleClick}
                        endIcon={<Dropdown />}
                        sx={{
                            padding: '10px 16px',
                            gap: '12px',
                            // width: '480px',
                            width: '290px',
                            height: '56px',
                            // background: '#FAFAFA',
                            // border: '1px solid #F5F6F4',
                            background: 'transparent',
                            borderRadius: '8px',
                            textTransform: 'none',
                            justifyContent: 'space-between',
                            // justifyContent: 'flex-start',
                            alignItems: 'center',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '28px',
                            color: '#7D7B7C'
                        }}
                    >
                        {selectedUser === '' ? 'Select a host' : (
                            <Box display='flex' alignItems='center'>
                                <Avatar
                                    alt="Avatar"
                                    src={Profile}
                                    sx={{ width: '40px', height: '40px', mr: '10px' }}
                                />
                                {`${selectedUser} (current user)`}
                            </Box>
                        )}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{
                            style: {
                                // width: '480px',
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

            </Box >
            <Box>
                {typeof formik.errors.hostID !== "undefined" && formik.touched.hostID
                    ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.hostID}</span>
                    : null
                }
            </Box>


            <Box marginTop='24px'>
                <CustomTextField
                    id='email'
                    placeholder="Email"
                    variant="outlined"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
                <Box>
                    {typeof formik.errors.email !== "undefined" && formik.touched.email
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.email}</span>
                        : null
                    }
                </Box>
            </Box>

            <Box marginTop='24px'>
                <CustomTextField
                    id='visitDuration'
                    placeholder="Visit duration (maximum 14 hours)"
                    variant="outlined"
                    value={formik.values.duration}
                    onChange={(event) => { formik.setFieldValue('duration', event.target.value) }}
                    style={{ marginRight: '24px' }}
                />
                <Box>
                    {typeof formik.errors.duration !== "undefined" && formik.touched.duration
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.duration}</span>
                        : null
                    }
                </Box>
            </Box>

            <Box marginTop='24px'>
                <CustomDropdown
                    placeholderValue='Custom'
                    value={dropdownOptions}
                    menuItems={['Option 1', 'Option 2', 'Option 3']}
                    handleDropdownValue={(value) => {
                        setDropdownOptions(value)
                    }}
                />
            </Box>

            <Box marginTop='24px'>
                <CustomTextField
                    id='visitReason'
                    placeholder="Visit Reason"
                    variant="outlined"
                    value={formik.values.reason}
                    onChange={(event) => { formik.setFieldValue('reason', event.target.value) }}
                    style={{ marginRight: '24px' }}
                />
                <Box>
                    {typeof formik.errors.reason !== "undefined" && formik.touched.reason
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.reason}</span>
                        : null
                    }
                </Box>
            </Box>



            <Box sx={{ marginTop: '382px', display: 'flex', justifyContent: 'flex-end' }} >
                <Button
                    onClick={() => props.handleCloseDrawer(false)}
                    variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px' }}> Back </Button>
                <Button
                    type='submit'
                    variant='contained'
                    sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px' }}
                >
                    Save
                </Button>
            </Box >

        </form>
    )

}

export default AddNewVisitor