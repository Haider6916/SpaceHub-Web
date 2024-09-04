import React, { useState } from 'react';
import { Box } from '@mui/material';

const DailyStackedCards = ({ totalWidth, arrayLength }) => {
    const [activeCard, setActiveCard] = useState(null);

    const handleCardClick = (index) => {
        setActiveCard(index);
    };

    const handleKeyPress = (e) => {
        if (e.keyCode === 37) {
            // Left arrow key
            setActiveCard((prev) => (prev === null ? 0 : prev > 0 ? prev - 1 : prev));

        } else if (e.keyCode === 39) {
            // Right arrow key
            setActiveCard((prev) => (prev === null ? 0 : prev < 15 ? prev + 1 : prev));
        }
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
        <div style={{ display: 'flex', position: 'relative', width: '100%', height: '50px', overflowX: 'auto' }}>
            {colorsArray.map((value, index) => (
                <Box
                    key={index}
                    sx={{
                        width: '40px',
                        height: '53px',
                        position: 'absolute',
                        left: `calc(${index} * (100% - 40px) / ${colorsArray.length - 1})`,
                        background: value.backgroundColor,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        zIndex: index === activeCard ? '3' : '2',
                        transform: index === activeCard ? 'scale(0.9)' : 'scale(0.8)',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'black',
                        fontWeight: '400',
                        borderRadius: '8px',
                        transition: 'transform 1s',
                        border: '1px solid white',
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
                    testing
                </Box>
            ))}
        </div>
    );
};

export default DailyStackedCards;
