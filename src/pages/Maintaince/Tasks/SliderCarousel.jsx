import React, { useState } from 'react';
import './SliderCarousel.css'; // Import the CSS file with styles if needed

const SliderCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(1);

    const handleSlideChange = (event) => {
        setCurrentSlide(Number(event.target.id.slice(1)));
    };

    return (
        <div className="container">
            <div className="cards">
                <div className="card">
                    {/* Slide 1 */}
                    <input
                        type="radio"
                        name="slider"
                        id="s1"
                        checked={currentSlide === 1}
                        onChange={handleSlideChange}
                        className="d-none"
                    />
                    <label htmlFor="s1" id="slide1">
                        <div className="image">
                            <img src="img/Nike SuperRep Go.jpg" alt="" />
                            <div className="dots">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                        {/* Rest of the slide content */}
                        {/* ... */}
                    </label>

                    {/* Slide 2 */}
                    <input
                        type="radio"
                        name="slider"
                        id="s2"
                        checked={currentSlide === 2}
                        onChange={handleSlideChange}
                        className="d-none"
                    />
                    <label htmlFor="s2" id="slide2">
                        {/* Slide 2 content */}
                        {/* ... */}
                    </label>

                    {/* Slide 3 */}
                    <input
                        type="radio"
                        name="slider"
                        id="s3"
                        checked={currentSlide === 3}
                        onChange={handleSlideChange}
                        className="d-none"
                    />
                    <label htmlFor="s3" id="slide3">
                        {/* Slide 3 content */}
                        {/* ... */}
                    </label>

                    {/* Slide 4 */}
                    <input
                        type="radio"
                        name="slider"
                        id="s4"
                        checked={currentSlide === 4}
                        onChange={handleSlideChange}
                        className="d-none"
                    />
                    <label htmlFor="s4" id="slide4">
                        {/* Slide 4 content */}
                        {/* ... */}
                    </label>

                    {/* Slide 5 */}
                    <input
                        type="radio"
                        name="slider"
                        id="s5"
                        checked={currentSlide === 5}
                        onChange={handleSlideChange}
                        className="d-none"
                    />
                    <label htmlFor="s5" id="slide5">
                        {/* Slide 5 content */}
                        {/* ... */}
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SliderCarousel;
