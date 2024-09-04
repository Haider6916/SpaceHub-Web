import React, { useState, useEffect } from 'react'
import CustomTextField from '../CustomDrawerTextField/CustomTextField'
import { Box, Button, Chip, CircularProgress, Typography } from '@mui/material'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ReactComponent as CloseCircle } from '../../Assets/SVGs/CloseCircle.svg';
import { Stack } from '@mui/system';
import { privateRequest } from '../../ApiMethods';
import { toast } from 'react-hot-toast';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { makeStyles } from '@mui/styles';
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

function AddAnnouncement(props) {
    const classes = useStyles();
    const [tags, setTags] = useState([])
    const [loader, setLoader] = useState(false)


    useEffect(() => {
        formik.setFieldValue('tagsArray', tags);
    }, [tags])

    var validationSchema = yup.object({
        title: yup
            .string('Title')
            .required('Title is required'),
        description: yup
            .string('Description')
            .required('Description is required'),
        tag: yup
            .string('Tag'),
        tagsArray: yup.array().min(1, 'At least one tag is required'),
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            tag: '',
            description: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (tags.length !== 0) {
                setLoader(true);

                let apiObject = {
                    "title": formik.values.title,
                    "description": formik.values.description,
                    "tags": tags
                };

                privateRequest.post('/announcement', apiObject)
                    .then((res) => {
                        toast.success(res.data.message);
                        props.handleCloseDrawer(false)
                        props.handleReload()
                    })
                    .catch((error) => {
                        toast.error(error.response.data.error.message);
                    })
                    .finally(() => {
                        setLoader(false);
                    });
            } else {
                toast.error("Please enter at least one tag");
            }
        }
    });

    const handleDelete = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    };

    const handleTagKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setTags([...tags, formik.values.tag]);
            formik.setFieldValue('tag', '');
        }
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography sx={{ marginTop: '8.87px', fontStyle: 'normal', fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                        Add Announcement
                    </Typography>

                    <CloseCircle onClick={() => props.handleCloseDrawer(false)} style={{ cursor: 'pointer' }} />

                </Box>


                <Box sx={{ marginRight: '26px', mt: '24px' }} >
                    <CustomTextField
                        id='title'
                        placeholder="Title"
                        variant="outlined"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        style={{ marginRight: '26px' }}
                    />
                    <Box>
                        {typeof formik.errors.title !== "undefined" && formik.touched.title
                            ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.title}</span>
                            : null
                        }
                    </Box>
                </Box>

                <Box mt='24px'>
                    <CustomTextField
                        id='description'
                        placeholder="Description"
                        variant="outlined"
                        multiline
                        rows={3}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    <Box>
                        {typeof formik.errors.description !== "undefined" && formik.touched.description
                            ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.description}</span>
                            : null
                        }
                    </Box>
                </Box>

                {tags.length < 5 && (
                    <Box mt='24px'>
                        <CustomTextField
                            id='tag'
                            placeholder="Tag"
                            variant="outlined"
                            value={formik.values.tag}
                            onChange={formik.handleChange}
                            onEnter={handleTagKeyPress}
                        />
                        <Box>
                            {typeof formik.errors.tagsArray !== "undefined" && formik.touched.tagsArray
                                ? <span className={classes.errorMessage}><ErrorOutlineIcon className={classes.errorIcon} />{formik.errors.tagsArray}</span>
                                : null
                            }
                        </Box>
                    </Box>
                )}

                <Box mt='10px'>
                    <Typography sx={{ marginTop: '8.87px', fontStyle: 'normal', fontWeight: '300', fontSize: '14px', lineHeight: '42px', color: '#272627' }}>
                        Maximum 5 tags allowed
                    </Typography>
                </Box>

                <Stack mt='5px' direction="row" spacing={1}>
                    {
                        tags.map((value, index) => (
                            <Chip key={index} label={value} style={{ backgroundColor: '#EEE5F1' }} onDelete={() => { handleDelete(value) }} />
                        ))
                    }
                </Stack>


                <Box sx={{ marginTop: '100px', display: 'flex', justifyContent: 'flex-end' }} >
                    <Button
                        onClick={() => props.handleCloseDrawer(false)}
                        variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#272627', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}> Back </Button>
                    <Button
                        type="submit"
                        variant='contained'
                        sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}
                    >
                        {loader ? <CircularProgress sx={{ color: 'white' }} size={23} /> : 'Save'}
                    </Button>

                </Box >
            </form>

        </>
    )
}

export default AddAnnouncement