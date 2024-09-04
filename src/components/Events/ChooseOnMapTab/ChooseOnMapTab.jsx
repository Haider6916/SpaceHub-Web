import { useState, useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'
import { Box, Button, ClickAwayListener, Fab, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { TrainRounded } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const ChooseOnMapTab = (props) => {

    const [showMenuItems, setShowMenuItems] = useState(false)
    const [markerPosition, setMarkerPosition] = useState(null);
    const [searchResponse, setSearchResponse] = useState([])
    const [center, setCenter] = useState([33.52264990544185, 73.09423775915467])
    const [text, setText] = useState('')
    const handleMapClick = (event) => {
        setMarkerPosition(event.latlng);
    };

    const GoogleMapsURL = markerPosition
        ? `https://www.google.com/maps/search/?api=1&query=${markerPosition.lat},${markerPosition.lng}`
        : '';

    const MapClickHandler = () => {
        useMapEvents({
            click: handleMapClick,
        });

        return null;
    };

    const handleSearch = (searchValue) => {
        setText(searchValue)
        if (searchValue) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchValue}`)
                .then((response) => response.json())
                .then((data) => {
                    setSearchResponse(data)
                    if (data.length > 0) {
                        const { lat, lon } = data[0];
                        setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
                    }
                })
                .catch((error) => {
                    toast.error('Error occurred while searching');
                });
        }
    };

    const CustomMapComponent = () => {
        const map = useMap();

        useEffect(() => {
            if (center) {
                map.setView(center);
            }
        }, [center, map]);

        return null;
    };

    return (


        <Box sx={{ position: 'relative' }}>

            <TextField
                sx={{

                    '& .MuiInputBase-root': {
                        height: '56px',
                        fontSize: '16px',
                        fontFamily: "'DM Sans', sans-serif ",
                        lineHeight: '28px',
                        color: '#7D7B7C',
                        borderRadius: '8px',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #F5F6F4', // set the border width when the input is focused
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #F5F6F4', // remove the border by default
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: '0px solid #F5F6F4', // set the border width on hover
                    },
                    width: '587px',
                    backgroundColor: '#FAFAFA',
                    borderRadius: '8px',
                    mt: '19px',
                    mb: '19px'
                }}
                id='searchLocation'
                placeholder='Search Location'
                variant="outlined"
                value={text}
                onClick={() => { setShowMenuItems(true) }}
                onChange={(e) => { handleSearch(e.target.value); }}

            />

            {
                showMenuItems && (
                    <ClickAwayListener onClickAway={() => setShowMenuItems(false)}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '80px',
                                width: '587px',
                                maxHeight: '220px',
                                background: '#FAFAFA',
                                border: '1px solid #F5F6F4',
                                borderRadius: '8px',
                                padding: '0px',
                                fontSize: '16px',
                                lineHeight: '28px',
                                color: '#7D7B7C',
                                overflow: 'auto',
                                zIndex: 999
                            }}
                        >
                            {searchResponse.map((value, index) => (
                                <MenuItem
                                    sx={{
                                        width: '100%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    key={index}
                                    onClick={() => {
                                        setMarkerPosition({ lat: value.lat, lng: value.lon });
                                        setCenter([parseFloat(value.lat), parseFloat(value.lon)]);
                                        setText(value.display_name);
                                        setShowMenuItems(false);
                                    }}
                                >
                                    <Typography
                                        noWrap
                                        sx={{
                                            width: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {value.display_name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Box>
                    </ClickAwayListener>
                )

            }


            <Box sx={{ height: "423px", width: '585px' }}>

                <MapContainer center={center} zoom={13} scrollWheelZoom={true} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <CustomMapComponent />
                    <MapClickHandler />
                    {markerPosition && (
                        <Marker position={markerPosition} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                            {/* <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup> */}
                        </Marker>
                    )}

                    <ZoomControl position="bottomleft" />

                </MapContainer>

            </Box >

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '21px' }}>
                <Button
                    variant='outlined'
                    sx={{ width: '113px', borderRadius: '51px', fontSize: '16px', lineHeight: '28px', mr: '16px' }}
                    onClick={() => { props.handleClose() }}
                >
                    Back
                </Button>
                <Button
                    variant='contained'
                    sx={{ width: '113px', borderRadius: '51px', fontSize: '16px', lineHeight: '28px' }}
                    onClick={() => {
                        props.handleClose();
                        props.handleUrlLink(GoogleMapsURL)
                    }}
                >
                    Confirm
                </Button>

            </Box>




        </Box>
    );
};

export default ChooseOnMapTab;
