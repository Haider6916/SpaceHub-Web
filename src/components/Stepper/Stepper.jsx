import React, { useState } from "react";

const Stepper = ({ steps, onChange }) => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        onChange(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        onChange(activeStep - 1);
    };

    return (
        <div>
            <div>
                <button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                </button>
                <button disabled={activeStep === steps.length - 1} onClick={handleNext}>
                    Next
                </button>
            </div>
            <div>
                {steps[activeStep]}
            </div>
        </div>
    );
};

export default Stepper;