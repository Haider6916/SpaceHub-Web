import { InputAdornment, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import { ReactComponent as Email } from '../../Assets/SVGs/Email.svg';
import { ReactComponent as Phone } from '../../Assets/SVGs/Call.svg';
import { ReactComponent as InfoCircle } from '../../Assets/SVGs/InfoCircle.svg';

import { ReactComponent as Instagram } from '../../Assets/SVGs/Instagram.svg';
import { ReactComponent as Facebook } from '../../Assets/SVGs/Facebook.svg';
import { ReactComponent as Globe } from '../../Assets/SVGs/Globe.svg';
import { ReactComponent as LinkedIn } from '../../Assets/SVGs/LinkedinLogo.svg';

import { ReactComponent as Sqm } from '../../Assets/SVGs/Sqm.svg';
import { ReactComponent as Armchair } from '../../Assets/SVGs/Armchair.svg';
import { ReactComponent as Building } from '../../Assets/SVGs/Building.svg';
import { ReactComponent as Calendar } from '../../Assets/SVGs/Calendar.svg';
import { ReactComponent as CommentSend } from '../../Assets/SVGs/CommentSend.svg';

function CustomTextField(props) {

    return (
        <TextField
            sx={{
                '& .MuiInputBase-root': {
                    height: props.id === 'description' ? '84px ' : '56px',
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
                width:
                    props.id === 'firstName' || props.id === 'lastName' ? "260px"
                        : props.id === 'capacity' || props.id === 'area' ? '261px'
                            : props.id === 'link' ? '587px'
                                : props.id === 'comment' ? '495px'
                                    : "546px",

                backgroundColor: '#FAFAFA',
                borderRadius: '8px',
            }}
            id={props.id}
            placeholder={props.placeholder}
            variant="outlined"
            value={props.value}
            onChange={props.onChange}
            onKeyDown={(ev) => {
                if ((ev.key === 'Enter' || ev.code === 'Enter') && props.id === 'tag') {
                    props.onEnter(ev);
                }
            }}
            multiline={props.id === 'description' ? true : false}
            rows={3}
            inputProps={{ maxLength: 500 }}

            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">

                        {
                            props.id === 'email'
                                ? <Email />
                                : props.id === "phone"
                                    ? <Phone />
                                    : props.id === "profession"
                                        ? <InfoCircle />
                                        : props.id === "visitReason"
                                            ? <InfoCircle />
                                            : props.id === "instagram"
                                                ? <Instagram />
                                                : props.id === "facebook"
                                                    ? <Facebook />
                                                    : props.id === 'linkedin'
                                                        ? <LinkedIn />
                                                        : props.id === 'website'
                                                            ? <Globe />
                                                            : props.id === 'capacity'
                                                                ? <Armchair />
                                                                : props.id === 'capacityFullWidth'
                                                                    ? <Armchair />
                                                                    : props.id === 'seatLimit'
                                                                        ? <Armchair />
                                                                        : props.id === 'floorNumber'
                                                                            ? <Building />
                                                                            : props.id === 'area'
                                                                                ? <Sqm />
                                                                                : props.id === 'visitDuration'
                                                                                    ? < Calendar />
                                                                                    : props.id === 'comment'
                                                                                        ? < CommentSend style={{ cursor: 'pointer' }} onClick={() => { alert('kuch ho ga') }} />
                                                                                        : null
                        }


                    </InputAdornment>
                ),
            }}
        />
    )
}

export default CustomTextField