import { Box, Menu, MenuItem, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CountryList from 'country-list-with-dial-code-and-flag';
import dummyPhoneData from '../../Utils/dummyPhoneNumbers.json'
function CustomPhoneInput(props) {

    const allCountries = CountryList.getAll()
    const [filteredCountries, setFilteredCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(CountryList.findOneByDialCode('+92').data)
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        props.selectedCountry(selectedCountry)
    }, [selectedCountry])


    useEffect(() => {
        if (searchQuery === '') {
            setFilteredCountries(allCountries)
        }
    }, [searchQuery])


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event, value) => {
        setAnchorEl(null);
        console.log('value', value);
        if (value.includes("+")) {
            setSelectedCountry(CountryList.findOneByDialCode(value).data)
        }
    };

    const handlePhoneInput = (e) => {
        const input = e.target.value;
        const pattern = /^\d+$/;

        if (e.target.value === '') {
            props.handlePhone('')
        }

        if (pattern.test(input)) {
            if (input.length <= dummyPhoneData[selectedCountry.code].length) {
                props.handlePhone(input)
            }
        }
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setFilteredCountries(allCountries.filter((country) =>
            country.data.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));
        console.log('search is alled');
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '540px', height: '48px', backgroundColor: '#F6F5F5', borderRadius: "8px" }}>
            <Box
                onClick={handleClick}
                sx={{ margin: '10px 16px', padding: '0px, 14px', backgroundColor: '#EEE5F1', width: '97px', height: '28px', borderRadius: "8px", cursor: 'pointer' }}>
                <span style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Typography sx={{ margin: '6px 8px 7px 14px' }}>
                        {selectedCountry.flag}
                    </Typography>
                    <Typography sx={{ color: "#565556", fontSize: '16px', lineHeight: '28px' }}>
                        {selectedCountry.dial_code}
                    </Typography>
                </span>
            </Box>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: '200px',
                        overflow: 'auto'
                    }
                }}
            >
                <div style={{ padding: '0px 10px' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{
                            padding: '5px',
                            width: '100%',
                            height: '28px',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '28px',
                            border: '0px',
                            backgroundColor: '#F6F5F5',
                            outline: 'none',
                            boxShadow: 'none'
                        }}
                        autoFocus
                    />
                </div>
                {filteredCountries.map((country) => (
                    <MenuItem onClick={(event) => handleClose(event, country.data.dial_code)} sx={{ '&:hover': { backgroundColor: '#EEE5F1' } }}>
                        <span>
                            {country.data.flag}
                        </span>
                        <span style={{ marginLeft: '10px' }}>
                            {country.data.name}
                        </span>
                    </MenuItem>
                ))}

            </Menu>
            <Box>
                <input type="text"
                    placeholder='Phone Number'
                    style={{
                        width: '289px',
                        height: '28px',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '28px',
                        border: '0px',
                        backgroundColor: '#F6F5F5',
                        outline: 'none',
                        boxShadow: 'none'
                    }}
                    value={props.value}
                    name="phone"
                    pattern="\d+"
                    onChange={handlePhoneInput}
                />
            </Box>

        </Box >

    )
}

export default CustomPhoneInput