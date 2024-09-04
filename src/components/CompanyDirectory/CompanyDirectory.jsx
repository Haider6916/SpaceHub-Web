import { Box, Button, Chip, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import CompanyCard from './CompanyCard';
import { toast } from 'react-hot-toast';
import { privateRequest } from '../../ApiMethods';
import { ArrowUpward, FilterAltOff } from '@mui/icons-material';
import InfiniteScroll from 'react-infinite-scroll-component';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { ReactComponent as Empty } from '../../Assets/SVGs/Empty.svg';
import { useDispatch, useSelector } from 'react-redux';
import { comapanyReloadFalse } from '../../Redux/directorySlice';

function CompanyDirectory(props) {

    const shouldReload = useSelector((state) => state.directory.shouldCompanyReload)
    const dispatch = useDispatch()

    const [firstRender, setFirstRender] = useState(true)
    const [companyData, setCompanyData] = useState([])
    const [companyCategory, setCompanyCategory] = useState([])
    const [hasNextPage, setHasNextPage] = useState(null)
    const [nextPage, setNextPage] = useState(0)
    const [isFiltered, setIsFiltered] = useState(false)
    //TO DISPLAY DATA IN DROPDOWN
    const [dropdownOptions, setDropdownOptions] = useState(
        {
            category: '',
            status: '',
            sortBy: '',
            sortOrder: ''
        }
    )
    //FOR FILTER API
    const [filterOptions, setFilterOptions] = useState(
        {
            category: '',
            status: '',
            sortBy: '',
            sortOrder: ''
        }
    )


    useEffect(() => {
        if (firstRender === true) {
            fetchCompanies()
            fetchCompanyCategories()
        } else {
            if (isFiltered) {
                fetchCompanyByFilter()
            } else {
                fetchCompanies()
            }
        }
    }, [filterOptions])

    useEffect(() => {
        if (shouldReload) {
            fetchCompanies()
            dispatch(comapanyReloadFalse())
        }
    }, [shouldReload])

    const resetFilters = () => {

        const emptyFilterOptions = {
            category: '',
            status: '',
            sortBy: '',
            sortOrder: ''
        };

        const emptyDropdownOptions = {
            category: '',
            status: '',
            sortBy: '',
            sortOrder: ''
        };

        if (
            JSON.stringify(filterOptions) === JSON.stringify(emptyFilterOptions) &&
            JSON.stringify(dropdownOptions) === JSON.stringify(emptyDropdownOptions)
        ) {
            return;
        }

        setFilterOptions(emptyFilterOptions);
        setDropdownOptions(emptyDropdownOptions);
        setIsFiltered(false)

    }

    const fetchCompanyByFilter = () => {
        let apiObject = {}
        Object.keys(filterOptions).forEach((key) => {
            if (filterOptions[key] !== '') {
                apiObject[key] = filterOptions[key];
            }
        });

        privateRequest.post('/company/filter', apiObject).then((res) => {
            setCompanyData(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchMoreCompanyByFilter = () => {
        let apiObject = {}
        Object.keys(filterOptions).forEach((key) => {
            if (filterOptions[key] !== '') {
                apiObject[key] = filterOptions[key];
            }
        });

        const headers = {
            'x-pagination-skip': nextPage,
            'x-pagination-limit': 10
        };

        privateRequest.post('/company/filter', apiObject, { headers }).then((res) => {
            let tempArray = [...companyData];
            tempArray = tempArray.concat(res.data.docs)
            setCompanyData(tempArray);
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchCompanyCategories = () => {

        privateRequest.get('/company/categories').then((res) => {
            setCompanyCategory(res.data.categories)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchCompanies = () => {
        privateRequest.get('/company', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            setCompanyData(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
            setFirstRender(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchMoreCompanies = () => {
        let searchUrl = sessionStorage.getItem("searchURL");
        privateRequest
            .get(searchUrl === '' ? '/company' : searchUrl, {
                headers: {
                    'x-pagination-skip': nextPage,
                    'x-pagination-limit': 10
                }
            })
            .then((res) => {
                let tempArray = [...companyData];
                tempArray = tempArray.concat(res.data.docs)
                setCompanyData(tempArray);
                setHasNextPage(res.data.hasNextPage)
                setNextPage(res.data.nextPage)
            })
            .catch((error) => {
                toast.error(error.response.data.error.message);
            });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSearch = (apiResponse) => {
        setCompanyData(apiResponse.docs)
        setHasNextPage(apiResponse.hasNextPage)
        setNextPage(apiResponse.nextPage)
        resetFilters()
    }


    return (
        <>
            <Box sx={{ marginTop: '34px' }}>
                <SearchBar placeholderValue='Search Company' handleSetValue={(value) => handleSearch(value)} />
            </Box>

            <Box display='flex' mt='16.55px'>

                <Box mr='24px'>
                    <CustomDropdown
                        placeholderValue='Category'
                        menuItems={companyCategory}
                        value={dropdownOptions.category}
                        handleDropdownValue={(value) => {
                            setFilterOptions((prevOptions) => ({
                                ...prevOptions,
                                category: value
                            }))
                            setDropdownOptions((prevOptions) => ({
                                ...prevOptions,
                                category: value
                            }))
                            setIsFiltered(true)
                        }}
                    />
                </Box>

                <Box mr='24px'>
                    <CustomDropdown
                        placeholderValue='Status'
                        menuItems={['Active', 'In-Active']}
                        value={dropdownOptions.status}
                        handleDropdownValue={(value) => {
                            let booleanValue = false
                            if (value === 'Active') booleanValue = true
                            setFilterOptions((prevOptions) => ({
                                ...prevOptions,
                                status: booleanValue
                            }))
                            setDropdownOptions((prevOptions) => ({
                                ...prevOptions,
                                status: value
                            }))
                            setIsFiltered(true)
                        }}
                    />
                </Box>

                <Box mr='24px'>
                    <CustomDropdown
                        placeholderValue='Sort by'
                        menuItems={['RegisteredOn', 'Name']}
                        value={dropdownOptions.sortBy}
                        handleDropdownValue={(value) => {
                            setFilterOptions((prevOptions) => ({
                                ...prevOptions,
                                sortBy: value
                            }))
                            setDropdownOptions((prevOptions) => ({
                                ...prevOptions,
                                sortBy: value
                            }))
                            setIsFiltered(true)
                        }}
                    />
                </Box>

                <Box mr='24px'>
                    <CustomDropdown
                        placeholderValue='Sort order'
                        menuItems={['Asc', 'Dsc',]}
                        value={dropdownOptions.sortOrder}
                        handleDropdownValue={(value) => {
                            let intValue = 1
                            if (value === 'Dsc') intValue = -1
                            setFilterOptions((prevOptions) => ({
                                ...prevOptions,
                                sortOrder: intValue
                            }))
                            setDropdownOptions((prevOptions) => ({
                                ...prevOptions,
                                sortOrder: value
                            }))
                            setIsFiltered(true)
                        }}
                    />
                </Box>

                <Button variant='contained' sx={{ height: '55px', borderRadius: '8px' }} onClick={resetFilters}>
                    Clear Filters <FilterAltOff />
                </Button>

            </Box>

            <Box sx={{ marginTop: '16.8px', width: '100%' }}>

                {companyData.length !== 0 && (
                    <Box sx={{ marginTop: '24px' }}>
                        <InfiniteScroll
                            dataLength={companyData.length}
                            next={isFiltered ? fetchMoreCompanyByFilter : fetchMoreCompanies}
                            hasMore={hasNextPage} // Replace with a condition based on your data source
                            loader={
                                <Box sx={{ mt: '20px', mb: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <Chip label='Loading...' sx={{
                                        fontWeight: '400',
                                        fontSize: '16px',
                                        lineHeight: '28px',
                                        color: '#565556',
                                    }} />
                                </Box>}
                            endMessage={
                                <Box sx={{ mt: '20px', mb: '20px', display: 'flex', justifyContent: 'space-around' }}>
                                    <Box></Box>
                                    <Chip label='No more data to load.' sx={{
                                        fontWeight: '400',
                                        fontSize: '16px',
                                        lineHeight: '28px',
                                        color: '#565556',
                                    }} />
                                    <IconButton
                                        sx={{
                                            backgroundColor: '#EAE8E9',
                                            color: '#565556',
                                            width: "32px",
                                            height: '32px'
                                        }}
                                        onClick={() => scrollToTop()}
                                    >
                                        <ArrowUpward />
                                    </IconButton>
                                </Box>
                            }
                        >
                            {companyData.map((value, index) => (
                                <CompanyCard
                                    key={index}
                                    id={value._id}
                                    totalEmployees={value.employees.length}
                                    logo={value.logo}
                                    name={value.name}
                                    meetingRoom={value.plan.meetingRoomHours}
                                    planEndDate={value.planEndDate}
                                    handleOpenComProfile={props.handleOpenComProfile}
                                    isActive={value.isActive}
                                    resources={value.resources}
                                />
                            ))}
                        </InfiniteScroll>
                    </Box>
                )}

                {(companyData.length === 0 && firstRender === false) && (
                    <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center' mt='50px'>
                        <Empty />
                        <Typography>No data to display</Typography>
                    </Box>
                )}

            </Box>





        </>
    )
}

export default CompanyDirectory