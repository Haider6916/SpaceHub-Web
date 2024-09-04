import React, { useState } from 'react';
import './SliderCarousel.css'
import { Box } from '@mui/material';
const Tasks = () => {
    const num = 9; // Number of cards (change this if you want more or fewer cards)
    const [activeCard, setActiveCard] = useState(Math.floor(num / 2));

    const handleCardClick = (index) => {
        setActiveCard(index);
    };

    const handleKeyPress = (e) => {
        if (e.keyCode === 37) {
            // Left arrow key
            setActiveCard((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.keyCode === 39) {
            // Right arrow key
            setActiveCard((prev) => (prev < num - 1 ? prev + 1 : prev));
        }
    };

    const widthExact = 1000 / 9

    const cardStyle = {
        height: '12rem',
        width: `${widthExact}px`,
        position: 'relative',
        zIndex: '1',
        transform: 'scale(0.3) translateY(-2rem)',
        opacity: '0',
        cursor: 'pointer',
        pointerEvents: 'none',
        background: 'linear-gradient(to top, #2e5266, #6e8898)',
        transition: '1s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontWeight: '300',
    };

    const activeCardStyle = {
        zIndex: '3',
        // transform: 'scale(1) translateY(0) translateX(0)',
        opacity: '1',
        pointerEvents: 'auto',
        transition: '1s',
    };

    const prevNextCardStyle = {
        zIndex: '2',
        transform: 'scale(0.8) translateY(0) translateX(0)',
        opacity: '0.6',
        pointerEvents: 'auto',
        transition: '1s',
    };

    const colorsArray = [
        { backgroundColor: '#A8DADC', borderColor: '#63AAB6' },
        { backgroundColor: '#FFDDA1', borderColor: '#D4AF37' },
        { backgroundColor: '#54C6EB', borderColor: '#3498BA' },
        { backgroundColor: '#FF8E8A', borderColor: '#E5736E' },
        { backgroundColor: '#FFA07A', borderColor: '#E58559' },
        { backgroundColor: '#7FE6D3', borderColor: '#3FB9AF' },
        { backgroundColor: '#7AF0C3', borderColor: '#3AB39E' },
        { backgroundColor: '#FF6B6B', borderColor: '#C72C41' }, // Changed
        { backgroundColor: '#76B4BD', borderColor: '#4F9098' },
        { backgroundColor: '#FF8B6A', borderColor: '#F4694C' },// Changed
        { backgroundColor: '#C6BEDA', borderColor: '#7D7093' },
        { backgroundColor: '#D29DDE', borderColor: '#A452B8' },
        { backgroundColor: '#79A8E9', borderColor: '#5489B1' },
        { backgroundColor: '#E89282', borderColor: '#C55D4E' },
        { backgroundColor: '#53D77A', borderColor: '#2DBD57' },
    ];

    return (
        <div >
            <h1>Custom Carousel</h1>
            <div style={{ display: 'flex', width: '900px', position: 'relative' }}>
                {colorsArray.map((value, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: '12rem',
                            width: `${widthExact}px`,
                            left: `calc(${index} * 50px)`,
                            position: 'absolute',
                            zIndex: index === activeCard ? '3' : '2',
                            transform: index === activeCard ? 'scale(0.9) translateY(0) translateX(0)' : 'scale(0.8) translateY(0) translateX(0)',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                            background: value.backgroundColor,
                            transition: '1s',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'black',
                            fontWeight: '400',
                            flexWrap: 'auto',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""', //Empty string
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                width: '6px',
                                backgroundColor: value.borderColor,
                                borderRadius: '8px',
                            },
                        }}
                        onClick={() => handleCardClick(index)}
                        tabIndex={0}
                        onKeyDown={handleKeyPress}
                    >
                        https://meet.google.com/vmg-vvpe-gaq
                    </Box>

                ))}
            </div>
        </div>
        // <div className="container">
        //     <div className="overlap-div red"></div>
        //     <div className="overlap-div blue"></div>
        //     <div className="overlap-div green"></div>
        // </div>
    );
};

export default Tasks;

// import React, { useState } from 'react';

// const Tasks = () => {
//     const num = 9; // Number of cards (change this if you want more or fewer cards)
//     const [activeCard, setActiveCard] = useState(0);

//     const handleCardClick = (index) => {
//         setActiveCard(index);
//     };

//     const handleKeyPress = (e) => {
//         if (e.keyCode === 37) {
//             // Left arrow key
//             setActiveCard((prev) => (prev > 0 ? prev - 1 : num - 1));
//         } else if (e.keyCode === 39) {
//             // Right arrow key
//             setActiveCard((prev) => (prev < num - 1 ? prev + 1 : 0));
//         }
//     };

//     const containerStyle = {
//         marginLeft: "50px",
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         overflowX: 'hidden',
//         height: '20rem',
//         width: '100%', // Adjust the width to fit your design
//         position: 'relative',
//         perspective: '1000px',
//     };

//     const cardStyle = {
//         height: '20rem',
//         width: '12rem',
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         cursor: 'pointer',
//         background: 'linear-gradient(to top, #2e5266, #6e8898)',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         color: '#fff',
//         fontWeight: '300',
//         boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//         borderRadius: '8px',
//         transition: '1s',
//         zIndex: 0,
//     };

//     const activeCardStyle = {
//         zIndex: 1,
//         transform: 'translate(-50%, -50%) scale(1.2)',
//         opacity: 1,
//     };

//     const calculatePosition = (index) => {
//         const distance = Math.abs(index - activeCard);
//         return distance === 0 ? 0 : 10 * distance;
//     };

//     return (
//         <div className="carousel-container">
//             <h1>Custom Carousel</h1>
//             <div className="container" style={containerStyle}>
//                 {[...Array(num)].map((_, index) => (
//                     <div
//                         key={index}
//                         className={`ui-card`}
//                         style={{
//                             ...cardStyle,
//                             ...(index === activeCard && activeCardStyle),
//                             left: `${50 - calculatePosition(index)}%`,
//                         }}
//                         onClick={() => handleCardClick(index)}
//                         tabIndex={0}
//                         onKeyDown={handleKeyPress}
//                     >
//                         {index}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Tasks;


// import React from 'react'
// import SliderCarousel from './SliderCarousel'

// const Tasks = () => {
//     return (
//         <div>
//             {/* Other components and content */}
//             <SliderCarousel />
//         </div>
//     )
// }

// export default Tasks