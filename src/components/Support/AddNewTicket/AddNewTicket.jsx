import React, { useEffect, useState } from 'react'
import CustomTextField from '../../CustomDrawerTextField/CustomTextField'
import { Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ReactComponent as CloseCircle } from '../../../Assets/SVGs/CloseCircle.svg';
import { ReactComponent as Cross } from '../../../Assets/SVGs/Cross.svg';
import { ReactComponent as Paperclip } from '../../../Assets/SVGs/Paperclip.svg';
import { ReactComponent as SmallPaperclip } from '../../../Assets/SVGs/SmallPaperclip.svg';
import { ErrorOutline } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { privateRequest } from '../../../ApiMethods';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { closeAddTicketDrawer, myTicketsReloadTrue, receivedTicketsReloadTrue } from '../../../Redux/supportSlice';
import CustomDropdown from '../../CustomDropdown/CustomDropdown';

const useStyles = makeStyles(() => ({
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


function AddNewTicket() {

    const dispatch = useDispatch()
    const classes = useStyles();

    const [loader, setLoader] = useState(false)
    const [attachedFiles, setAttachedFiles] = useState([])
    const [relatedTo, setRelatedTo] = useState([])

    const removeFile = (fileToRemove) => {
        setAttachedFiles(attachedFiles.filter((file) => file !== fileToRemove))
    }

    const fetchRelatedTo = () => {
        privateRequest.get('/ticket/relatedto',).then((res) => {
            setRelatedTo(res.data)
        }).catch((error) => {
            toast.error(error.response.data.error.message);
        })
    }

    useEffect(() => {
        fetchRelatedTo()
    }, [])

    var validationSchema = yup.object({
        title: yup
            .string('Title')
            .required('Title is required')
            .max(30),
        relatedTo: yup
            .string('Related To')
            .required('Please select a value'),
        description: yup
            .string('Description')
            .required('Description is required'),
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            relatedTo: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setLoader(true)
            const formData = new FormData();

            attachedFiles.forEach((value) => {
                formData.append('files', value);
            });
            // formData.append('files', attachedFiles);
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('relatedTo', values.relatedTo);

            privateRequest.post(`/ticket`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                toast.success(res.data.message)
                dispatch(myTicketsReloadTrue())
                dispatch(receivedTicketsReloadTrue())
                dispatch(closeAddTicketDrawer())
            }).catch((error) => {
                toast.error(error.response.data.error.message);
            }).finally(() => {
                setLoader(false)
            })
        }
    });

    return (
        <>

            <form onSubmit={formik.handleSubmit}>

                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography sx={{ marginTop: '8.87px', fontStyle: 'normal', fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                        Add Ticket
                    </Typography>

                    <CloseCircle onClick={() => dispatch(closeAddTicketDrawer())} style={{ cursor: 'pointer' }} />

                </Box>


                <Box display='flex' mt='24.23px' >
                    <Box mr='24px'>
                        <CustomTextField
                            id='title'
                            placeholder="Title"
                            variant="outlined"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                        />
                        <Box>
                            {typeof formik.errors.title !== "undefined" && formik.touched.title
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.title}</span>
                                : null
                            }
                        </Box>

                    </Box>

                    <Box >
                        <CustomDropdown
                            placeholderValue='Related To'
                            menuItems={relatedTo}
                            value={formik.values.relatedTo}
                            handleDropdownValue={(value) => {
                                formik.setFieldValue('relatedTo', value)
                            }}
                        />
                        <Box>
                            {typeof formik.errors.relatedTo !== "undefined" && formik.touched.relatedTo
                                ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.relatedTo}</span>
                                : null
                            }
                        </Box>

                    </Box>
                </Box>

                <Box sx={{ backgroundColor: '#FAFAFA', mt: '16px', borderRadius: '8px', width: '1116px', paddingBottom: '8px' }}>
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
                        id='description'
                        placeholder='Description'
                        variant="outlined"
                        value={formik.values.description}
                        onChange={(event) => { formik.setFieldValue('description', event.target.value) }}
                        multiline={true}
                        rows={3}
                        inputProps={{ maxLength: 500 }}
                    />

                    <Box sx={{ backgroundColor: '#FAFAFA', width: 'calc(100% - 16px)', margin: '0px 8px', display: 'flex', justifyContent: 'space-between', }}>

                        <Stack gap={1} >
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
                            <Paperclip style={{ cursor: 'pointer' }} />
                        </label>
                    </Box>
                </Box >
                <Box>
                    {typeof formik.errors.description !== "undefined" && formik.touched.description
                        ? <span className={classes.errorMessage}><ErrorOutline className={classes.errorIcon} />{formik.errors.description}</span>
                        : null
                    }
                </Box>

                <Box sx={{ marginTop: '33.77px', display: 'flex', justifyContent: 'flex-end' }} >
                    <Button
                        onClick={() => dispatch(closeAddTicketDrawer())}
                        variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#272627', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}> Back </Button>

                    <Button
                        type="submit"
                        variant='contained'
                        sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                    >
                        {loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Save'}
                    </Button>

                </Box >
            </form >

        </>
    )
}

export default AddNewTicket


