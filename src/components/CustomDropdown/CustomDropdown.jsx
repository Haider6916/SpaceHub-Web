import { Box, Button, FormControl, InputLabel, Menu, MenuItem, Select, Typography, } from '@mui/material'
import { ReactComponent as Dropdown } from '../../Assets/SVGs/FieldDropdown.svg';
import './CustomDropdown.css';
import React, { useEffect, useState } from 'react'


function CustomDropdown(props) {


    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value) => {
        setAnchorEl(null);
        props.handleDropdownValue(value)
    }


    return (

        <>
            <Button
                onClick={handleClick}
                endIcon={<Dropdown />}
                sx={{
                    padding: '10px 16px',
                    gap: '12px',
                    width:
                        props.placeholderValue === 'All Desks' ||
                            props.placeholderValue === 'Sort' ||
                            props.placeholderValue === 'All Rooms' ||
                            props.placeholderValue === 'All Offices' ||
                            props.placeholderValue === 'Sort by' ||
                            props.placeholderValue === 'Profession' ||
                            props.placeholderValue === 'Status' ||
                            props.placeholderValue === 'Category' ||
                            props.placeholderValue === 'Sort order' ||
                            props.placeholderValue === 'Company' ||
                            props.placeholderValue === 'All Companies' ||
                            props.placeholderValue === 'Select To' ||
                            props.placeholderValue === 'Select From' ||
                            props.placeholderValue === 'Calendar'
                            ? '188px'
                            : props.placeholderValue === 'From' ||
                                props.placeholderValue === 'Start Time' ||
                                props.placeholderValue === 'Duration' ||
                                props.placeholderValue === 'To'
                                ? '180px'
                                : '546px',
                    height: '56px',
                    background: props.value !== "" ? '#EEE5F1' : '#FAFAFA',
                    border: '1px solid #F5F6F4',
                    borderRadius: '8px',
                    textTransform: 'none',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '28px',
                    color: '#7D7B7C',
                    '&:hover': {
                        backgroundColor: "#e8e1eb"
                    }
                }}
            >
                {props.value === '' ? props.placeholderValue : props.value}
            </Button >
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    style: {
                        width:
                            props.placeholderValue === 'All Desks' ||
                                props.placeholderValue === 'Sort' ||
                                props.placeholderValue === 'All Rooms' ||
                                props.placeholderValue === 'All Offices' ||
                                props.placeholderValue === 'Sort by' ||
                                props.placeholderValue === 'Profession' ||
                                props.placeholderValue === 'Status' ||
                                props.placeholderValue === 'Category' ||
                                props.placeholderValue === 'Sort order' ||
                                props.placeholderValue === 'Company' ||
                                props.placeholderValue === 'All Companies' ||
                                props.placeholderValue === 'Select To' ||
                                props.placeholderValue === 'Select From' ||
                                props.placeholderValue === 'Calendar'
                                ? '188px'
                                : props.placeholderValue === 'From' ||
                                    props.placeholderValue === 'To' ||
                                    props.placeholderValue === 'Start Time' ||
                                    props.placeholderValue === 'Duration'
                                    ? '180px'
                                    : '546px',
                        background: '#FAFAFA',
                        border: '1px solid #F5F6F4',
                        borderRadius: '8px',
                        // padding: '16px 24px',
                        fontSize: '16px',
                        lineHeight: '28px',
                        color: '#7D7B7C',
                        maxHeight: '300px',
                        overflow: 'auto',
                    }
                }}
            >
                {props.menuItems.map((value, index) => (
                    <MenuItem sx={{
                        '&:hover': {
                            backgroundColor: "#EEE5F1"
                        }
                    }} key={index} onClick={() => handleClose(value)}>{value}</MenuItem>
                ))}
            </Menu >
        </>
    )
}

export default CustomDropdown