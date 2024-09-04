import { Box, Button, Drawer, Grid, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import Header from '../../../components/Header/Header'
import EmployeeDirectory from '../../../components/EmployeeDirectory/EmployeeDirectory';
import CompanyDirectory from '../../../components/CompanyDirectory/CompanyDirectory';
import AddEmployeeDrawer from '../../../components/AddEmployeeDrawer/AddEmployeeDrawer';
import AddCompanyDrawer from '../../../components/AddCompanyDrawer/AddCompanyDrawer';
import EmployeeProfileDrawer from '../../../components/EmployeeProfileDrawer/EmployeeProfileDrawer';
import CompanyProfileDrawer from '../../../components/CompanyProfileDrawer/CompanyProfileDrawer';
import { useLocation } from 'react-router-dom';



function Directory() {

    const location = useLocation();
    const [value, setValue] = useState(location.state.value);
    const [openAddEmployee, setOpenAddEmployee] = useState(false);
    const [openAddCompany, setOpenAddCompany] = useState(false);
    const [openEmpProfile, setOpenEmpProfile] = useState(false);
    const [openComProfile, setOpenComProfile] = useState(false);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{
            // maxWidth: '1180px',
            width: '100%'
        }}>
            <Header />


            <Box sx={{ marginLeft: '31.86px', marginTop: '32.76px', }}>
                <Grid conatiner>
                    <Grid item  >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box >
                                <Typography sx={{ fontStyle: 'normal', fontWeight: '700', fontSize: '32px', lineHeight: '42px', color: '#272627' }}>
                                    Directory
                                </Typography>
                                <Typography sx={{ marginTop: '8.87px', fontStyle: 'normal', fontWeight: '400', fontSize: '18px', lineHeight: '23px', color: '#565556' }}>
                                    Add and Manage companies, employees and more
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', marginTop: '16.93px' }}>
                                <Button onClick={() => setOpenAddEmployee(true)} variant='outlined' sx={{ marginRight: '22.64px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#272627', borderRadius: '51px', color: '#8D55A2', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}> Add employee</Button>
                                <Button onClick={() => setOpenAddCompany(true)} variant='contained' sx={{ marginRight: '31.86px', fontStyle: 'normal', fontWeight: '500', fontSize: '16px', lineHeight: '28px', color: '#FFFFFF', borderRadius: '51px', width: '166px', height: '40px', boxShadow: 'none', textTransform: 'none' }}> Add comapny</Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ width: 'calc(100% - 31.86px)' }}>
                    <Tabs value={value} onChange={handleChange}
                        sx={{
                            '& .MuiTabs-flexContainer': {
                                borderBottom: '3px solid #E9EAE9',
                                // width: 'calc(100% - 31.86px)'
                                width: '100%'
                            },
                        }}
                    >
                        <Tab label="Employees" sx={{ fontWeight: 500, fontSize: '18px', lineHeight: '23px', textTransform: 'none' }} />
                        <Tab label="Companies" sx={{ fontWeight: 500, fontSize: '18px', lineHeight: '23px', textTransform: 'none' }} />
                    </Tabs>
                    <Box sx={{ width: '100%', marginTop: '24px' }}>
                        {value === 0 ? (
                            <EmployeeDirectory
                                handleOpenEmpProfile={() => { setOpenEmpProfile(true) }}
                                handleOpenComProfile={() => { setOpenComProfile(true) }}
                            />

                        ) : (
                            <CompanyDirectory
                                handleOpenComProfile={() => { setOpenComProfile(true) }}
                            />
                        )}
                    </Box>
                </Box>


                {/* Add Employee Drawer */}
                <Drawer
                    anchor={'right'}
                    open={openAddEmployee}
                //   onClose={toggleDrawer(anchor, false)}
                >
                    <Box sx={{ width: '611px', padding: '48px 32.2px' }}>
                        <AddEmployeeDrawer
                            handleCloseAddEmployee={() => { setOpenAddEmployee(false) }}
                        />
                    </Box>
                </Drawer>

                {/* Add Company Drawer */}
                <Drawer
                    anchor={'right'}
                    open={openAddCompany}
                    onClose={() => { setOpenAddEmployee(false) }}
                    PaperProps={{
                        sx: { width: "calc(100% - 260px)" },
                    }}
                >
                    <Box sx={{ width: '100%', padding: '48px 32.2px' }}>
                        <AddCompanyDrawer
                            handleCloseAddCompany={() => { setOpenAddCompany(false) }}
                            handleOpenEmpProfile={() => { setOpenEmpProfile(true) }}
                            handleOpenComProfile={() => { setOpenComProfile(true) }}
                        />
                    </Box>
                </Drawer>

                {/* View Employee Profile */}
                <Drawer
                    anchor={'right'}
                    open={openEmpProfile}
                    PaperProps={{
                        sx: { width: "calc(100% - 260px)" },
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <EmployeeProfileDrawer
                            handleCloseEmpProfile={() => { setOpenEmpProfile(false) }}
                        />
                    </Box>
                </Drawer>

                {/* View Company Profile */}
                <Drawer
                    anchor={'right'}
                    open={openComProfile}
                    PaperProps={{
                        sx: { width: "calc(100% - 260px)" },
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <CompanyProfileDrawer
                            handleCloseComProfile={() => { setOpenComProfile(false) }}
                        />
                    </Box>
                </Drawer>

            </Box>
        </Box >
    )
}

export default Directory