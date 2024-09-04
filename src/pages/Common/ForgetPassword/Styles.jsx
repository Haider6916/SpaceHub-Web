import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
    submitButton: {
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

}));