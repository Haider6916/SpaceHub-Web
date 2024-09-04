import { Checkbox, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';

const Plans = () => {
    const [companyAnchorEl, setCompanyAnchorEl] = useState(null);
    const [employeeAnchorEl, setEmployeeAnchorEl] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const handleCompanyClick = (event) => {
        setCompanyAnchorEl(event.currentTarget);
    };

    const handleCompanyClose = () => {
        setCompanyAnchorEl(null);
    };

    const handleEmployeeClick = (event) => {
        setEmployeeAnchorEl(event.currentTarget);
    };

    const handleEmployeeClose = () => {
        setEmployeeAnchorEl(null);
    };

    const handleEmployeeToggle = (employee) => () => {
        const selectedIndex = selectedEmployees.indexOf(employee);
        let newSelected = [...selectedEmployees];

        if (selectedIndex === -1) {
            newSelected.push(employee);
        } else {
            newSelected.splice(selectedIndex, 1);
        }

        setSelectedEmployees(newSelected);
    };

    const isEmployeeSelected = (employee) => {
        return selectedEmployees.some((selectedEmployee) => selectedEmployee.id === employee.id);
    };


    useEffect(() => {
        console.log('Employees', selectedEmployees);
    }, [selectedEmployees])


    return (
        <div>
            {/* Company Dropdown */}
            <div onClick={handleCompanyClick}>
                {/* Display selected company */}
                Selected Company: {selectedCompany ? selectedCompany.name : 'None'}
            </div>
            <Menu
                anchorEl={companyAnchorEl}
                open={Boolean(companyAnchorEl)}
                onClose={handleCompanyClose}
            >
                {companies.map((company) => (
                    <MenuItem
                        key={company.id}
                        onClick={() => {
                            // setSelectedEmployees([]); // Clear selected employees on company change
                            setSelectedCompany(company);
                            handleCompanyClose();
                        }}
                    >
                        {company.name}
                    </MenuItem>
                ))}
            </Menu>

            {/* Employee Dropdown with Checkboxes */}
            <div onClick={handleEmployeeClick}>
                Select Employees
            </div>
            <Menu
                anchorEl={employeeAnchorEl}
                open={Boolean(employeeAnchorEl)}
                onClose={handleEmployeeClose}
            >
                {selectedCompany &&
                    employeesByCompany[selectedCompany.id].map((employee) => (
                        <MenuItem key={employee.id} onClick={handleEmployeeToggle(employee)}>
                            <Checkbox
                                checked={isEmployeeSelected(employee)}
                                tabIndex={-1}
                                disableRipple
                            />
                            {employee.name}
                        </MenuItem>
                    ))}
            </Menu>
        </div>
    );
};

export default Plans;


const companies = [
    { id: 1, name: 'Company A' },
    { id: 2, name: 'Company B' },
    // Add more companies as needed
];

const employeesByCompany = {
    1: [
        { id: 101, name: 'John Smith' },
        { id: 102, name: 'Jane Doe' },
        // Employees of Company A
    ],
    2: [
        { id: 201, name: 'John Smith' },
        { id: 202, name: 'Alice Johnson' },
        // Employees of Company B
    ],
    // Add more companies and their employees as needed
};
