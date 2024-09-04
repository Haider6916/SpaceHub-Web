import React, { useEffect } from 'react'
import { ReactComponent as SearchButton } from '../../Assets/SVGs/Search_Button.svg';
import { Box } from '@mui/material';
import { privateRequest } from '../../ApiMethods';
import { toast } from 'react-hot-toast';

function SearchBar(props) {

    const { placeholderValue } = props

    const searchFunction = (value) => {

        let originalURLObj = {
            'Search Announcements': '/announcement?latest=false',
            'Search Visitors': '/user/visitor',
            'Search Company': '/company',
            'Search Employee': '/user',
            'Search Desks': '/resource?resourceType=desk',
            'Search Meeting Rooms': '/resource?resourceType=meeting_room',
            'Search Private Offices': '/resource?resourceType=private_office',
            'Search My Ticket': '/ticket/my-tickets',
            'Search Received Ticket': '/ticket',
            'Search Events': '/event',
            'Search All Bookings': '/booking/all-bookings',
            'Search My Bookings': '/booking/my-bookings',

        }

        let searchURLObj = {
            'Search Announcements': `/announcement/search?searchString=${value}`,
            'Search Visitors': `/user/visitor/search?searchQuery=${value}`,
            'Search Company': `/company/search?searchQuery=${value}`,
            'Search Employee': `/user/search?searchQuery=${value}`,
            'Search Desks': `/resource/search?searchString=${value}&type=desk`,
            'Search Meeting Rooms': `/resource/search?searchString=${value}&type=meeting_room`,
            'Search Private Offices': `/resource/search?searchString=${value}&type=private_office`,
            'Search My Ticket': `/ticket/my-tickets?search=${value}`,
            'Search Received Ticket': `/ticket?search=${value}`,
            'Search Events': `/event?search=${value}`,
            'Search All Bookings': `/booking/all-bookings?search=${value}`,
            'Search My Bookings': `/booking/my-bookings?search=${value}`,

        }

        let url = value === '' ? originalURLObj[placeholderValue] : searchURLObj[placeholderValue];

        privateRequest.get(url, {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            props.handleSetValue(res.data)
            sessionStorage.setItem("searchURL", value === '' ? '' : url);
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })

    }

    useEffect(() => {
        sessionStorage.setItem("searchURL", '');
    }, [])

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            background: '#FFFFFF',
            // width: '1116px',
            width: '100%',
            height: '48px',
            border: '0.6px solid #DBDBDA',
            borderRadius: '8px'
        }}>

            <input
                placeholder={placeholderValue}
                onChange={(e) => searchFunction(e.target.value)}
                style={{
                    marginLeft: '31.89px',
                    width: '500px',
                    // height: '28px',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    border: '0px',
                    outline: 'none',
                    boxShadow: 'none',
                    color: '#9F9D9E'
                }}
            />
            <SearchButton style={{ marginTop: '-1px', marginRight: "-2px" }} />
        </Box>
    )
}

export default SearchBar