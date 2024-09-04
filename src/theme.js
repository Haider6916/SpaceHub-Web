import { createTheme } from "@mui/material";
export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#8D55A2', //400
            dark: '#703A8B', //600
            light: '#522F76', //800 pressed
            focus: '#603481' //700 focus
        },
        secondary: {
            main: '#27A38B'//400
        },
        error: {
            main: '#E84F3C'//400
        },
        warning: {
            main: '#FAA21E'//400
        },
        info: {
            main: '#7B93AC'//400
        },
        success: {
            main: '#43BB84' //400
        },
        neutral: {
            main: '#A0A19F', //400
        }
    },
    typography: {
        fontFamily: "'DM Sans', sans-serif",
        h1: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "4.75rem",
            lineHeight: 1.5,
            letterSpacing: "0px"
        },
        h2: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "4rem",
            lineHeight: 1.5,
            letterSpacing: "0px"
        },
        h3: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "3.5rem",
            lineHeight: 1.5,
            letterSpacing: "0px"
        },
        h4: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "3rem",
            lineHeight: 1.5,
            letterSpacing: "0px"
        },
        h5: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "2.5rem",
            lineHeight: 1.5,
            letterSpacing: "0px"
        },
        h6: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "1.25rem",
            lineHeight: '2rem',
            letterSpacing: "0px"
        },
        megaTitle1: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "bold",
            fontSize: "4.313rem",
            lineHeight: '7rem',
            letterSpacing: "0px"
        },
        megaTitle2: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "bold",
            fontSize: "3.563rem",
            lineHeight: '5.75rem',
            letterSpacing: "0px"
        },
        bodyLarge: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "regular",
            fontSize: "1.188rem",
            lineHeight: '2rem',
            letterSpacing: "0px"
        },
        bodyDefault: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "regular",
            fontSize: "1rem",
            lineHeight: '1.75rem',
            letterSpacing: "0px"
        },
        bodySmall: {
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "regular",
            fontSize: "0.938rem",
            lineHeight: '1.5rem',
            letterSpacing: "0px"
        },

    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none', // Set box shadow to none for all buttons
                    textTransform: 'none'
                },
            },
        },
    }
})