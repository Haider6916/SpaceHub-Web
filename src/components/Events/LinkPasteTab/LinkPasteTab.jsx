import { Box, Button } from '@mui/material'
import React, { useState } from 'react'
import CustomTextField from '../../CustomDrawerTextField/CustomTextField'

function LinkPasteTab(props) {

    const [url, setUrl] = useState('')

    return (
        <Box sx={{ marginTop: '30.5px' }}>
            <CustomTextField
                id='link'
                placeholder="Paste Link Here"
                variant="outlined"
                value={url}
                onChange={(event) => { setUrl(event.target.value) }}
                style={{ marginRight: '24px' }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '451px' }}>
                <Button variant='outlined' sx={{ width: '113px', borderRadius: '51px', fontSize: '16px', lineHeight: '28px', mr: '16px' }}
                    onClick={props.handleClose}
                >
                    Back</Button>
                <Button variant='contained' sx={{ width: '113px', borderRadius: '51px', fontSize: '16px', lineHeight: '28px' }}
                    onClick={() => {
                        props.handleClose();
                        props.handleUrlLink(url)
                    }}
                >Confirm</Button>
            </Box>
        </Box>
    )
}

export default LinkPasteTab