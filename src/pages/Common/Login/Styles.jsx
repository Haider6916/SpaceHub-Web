import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
    signInButton: {
        textTransform: "none",
        marginTop: "30px !important",
        padding: "0px 24px  !important",
        width: "540px  !important",
        height: "40px  !important",
        backgroundColor: "#8D55A2",
        borderRadius: "51px !important",
        fontWeight: "500 !important",
        fontSize: '16px !important',
        boxShadow: 'none !important'
        // [theme.breakpoints.up('sm')]: {
        //     width: '200px',
        // },
        // [theme.breakpoints.up('md')]: {
        //     width: '300px',
        // },
        // [theme.breakpoints.up('lg')]: {
        //     width: '400px',
        // },
    },
    signUpButton: {
        textTransform: "none",
        borderRadius: '51px !important',
        width: '142px',
        padding: "0px 24px !important",
        height: '40px',
        fontWeight: "500 !important",
        fontSize: '16px !important',
        boxShadow: 'none !important'
    },
    itemCenter: {
        display: 'flex',
        justifyContent: 'center'
    },
    itemEnd: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    verticallyCenter: {
        display: 'flex',
        alignItems: 'center'
    },
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
    forgetName: {
        fontSize: '16px !important',
        marginTop: '16px !important',
        color: '#603481 !important',
        lineHeight: '21px !important',
        cursor: 'pointer'
    },
    mainHeading: {
        marginTop: '64px !important ',
        fontFamily: "'DM Sans', sans-serif !important",
        fontWeight: 700,
        fontSize: "56px !important ",
        lineHeight: "64px !important ",
        color: '#020001 !important'
    },
    subHeading: {
        marginTop: '24px !important ',
        fontFamily: "'DM Sans', sans-serif !important",
        fontWeight: 400,
        fontSize: "24px !important ",
        lineHeight: "32px !important ",
        color: '#565556 !important'
    },
}));