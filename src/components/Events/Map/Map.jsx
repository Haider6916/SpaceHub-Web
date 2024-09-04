import { useState, useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'
import { Box, ClickAwayListener, Fab, Menu, MenuItem } from '@mui/material';
import { TrainRounded } from '@mui/icons-material';

const Map = (props) => {

    const [showMenuItems, setShowMenuItems] = useState(false)
    const [markerPosition, setMarkerPosition] = useState(null);
    const [searchResponse, setSearchResponse] = useState([])
    const [center, setCenter] = useState([33.52264990544185, 73.09423775915467])
    const [text, setText] = useState('')
    const handleMapClick = (event) => {
        setMarkerPosition(event.latlng);
    };

    console.log('markerPosition', markerPosition)

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
        // setShowMenuItems(true)
        setText(searchValue)
        if (searchValue) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchValue}`)
                .then((response) => response.json())
                .then((data) => {
                    setSearchResponse(data)
                    console.log('data', data);
                    if (data.length > 0) {
                        const { lat, lon } = data[0];
                        setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
                    }
                })
                .catch((error) => {
                    console.log('Error occurred while searching:', error);
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
        <Box sx={{ height: "100%", width: '100%', position: "relative" }}>

            <MapContainer center={center} zoom={13} scrollWheelZoom={true} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CustomMapComponent />
                <MapClickHandler />
                {markerPosition && (
                    <Marker position={markerPosition} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                )}

                <ZoomControl position="bottomleft" />

            </MapContainer>

            <Box sx={{ position: 'absolute', bottom: 20, right: 15, }}>

                <Fab variant="extended" size="medium" color="primary" sx={{ mr: GoogleMapsURL ? '20px' : '0px', width: '100px' }} onClick={props.handleCloseMap}>
                    Back
                </Fab>


                {
                    GoogleMapsURL && (
                        <Fab variant="extended" size="medium" color="primary" sx={{ width: '100px' }}>
                            Confirm
                        </Fab>
                    )
                }

            </Box>


            <Box sx={{ position: 'absolute', top: 20, left: '50px', margin: 'auto', zIndex: 999 }}>
                <input type="text" value={text} onClick={() => { setShowMenuItems(true) }} onChange={(e) => { handleSearch(e.target.value); }} placeholder="Search location"
                    style={{
                        border: '0px solid black',
                        height: '56px',
                        fontSize: '16px',
                        fontFamily: "'DM Sans', sans-serif ",
                        lineHeight: '28px',
                        color: '#7D7B7C',
                        borderRadius: '8px',
                        backgroundColor: '#FAFAFA',
                        width: '546px',
                        padding: '20px'
                    }}
                />

                {
                    showMenuItems && (
                        <ClickAwayListener onClickAway={() => setShowMenuItems(false)}>
                            <Box
                                sx={{
                                    width: '546px',
                                    background: '#FAFAFA',
                                    border: '1px solid #F5F6F4',
                                    borderRadius: '8px',
                                    padding: '0px',
                                    fontSize: '16px',
                                    lineHeight: '28px',
                                    color: '#7D7B7C',
                                    overflow: 'hidden',
                                }}
                            >
                                {searchResponse.map((value, index) => (
                                    <MenuItem
                                        sx={{
                                            width: '500px',
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
                                        {value.display_name}
                                    </MenuItem>
                                ))}
                            </Box>
                        </ClickAwayListener>
                    )

                }
            </Box>

        </Box >
    );
};

export default Map;
