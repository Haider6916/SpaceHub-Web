import { Box, Button, Chip, IconButton, Typography, } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import EmployeeCard from './EmployeeCard';
import CustomDropdown from '../CustomDropdown/CustomDropdown';
import { ArrowUpward, FilterAltOff } from '@mui/icons-material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { privateRequest } from '../../ApiMethods';
import { toast } from 'react-hot-toast';
import { ReactComponent as Empty } from '../../Assets/SVGs/Empty.svg';
import { useDispatch, useSelector } from 'react-redux';
import { employeeReloadFalse } from '../../Redux/directorySlice';
function EmployeeDirectory(props) {

    const shouldReload = useSelector((state) => state.directory.shouldEmployeeReload)
    const dispatch = useDispatch()

    const [employeeData, setEmployeeData] = useState([])
    const [hasNextPage, setHasNextPage] = useState(null)
    const [nextPage, setNextPage] = useState(0)
    const [firstRender, setFirstRender] = useState(true)
    const [isFiltered, setIsFiltered] = useState(false)
    const [professionsList, setProfessionsList] = useState([])

    const [filterOptions, setFilterOptions] = useState(
        {
            status: "",
            profession: { en: "" },
            sortBy: "",
            sortOrder: ""
        }
    )
    const [dropdownOptions, setDropdownOptions] = useState(
        {
            status: "",
            profession: "",
            sortBy: "",
            sortOrder: ""
        }
    )

    const fetchProfessions = () => {
        privateRequest.get('/user/professions').then((res) => {
            setProfessionsList(res.data.professions)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })


    }
    const fetchEmployees = () => {
        privateRequest.get('/user?type=employee', {
            headers: {
                'x-pagination-skip': 1,
                'x-pagination-limit': 10
            }
        }).then((res) => {
            setEmployeeData(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
            setFirstRender(false)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchMoreEmployees = () => {
        let searchUrl = sessionStorage.getItem("searchURL");
        privateRequest
            .get(searchUrl === '' ? '/user?type=employee' : searchUrl, {
                headers: {
                    'x-pagination-skip': nextPage,
                    'x-pagination-limit': 10
                }
            })
            .then((res) => {
                let tempArray = [...employeeData];
                tempArray = tempArray.concat(res.data.docs)
                setEmployeeData(tempArray);
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

    useEffect(() => {
        if (firstRender) {
            fetchEmployees()
            fetchProfessions()
        } else {
            if (isFiltered) {
                fetchEmployeeByFilter()
            } else {
                fetchEmployees()
            }
        }
    }, [filterOptions])


    const resetFilters = () => {

        const emptyFilterOptions = {
            status: "",
            profession: { en: "" },
            sortBy: "",
            sortOrder: ""
        };

        const emptyDropdownOptions = {
            status: "",
            profession: "",
            sortBy: "",
            sortOrder: ""
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

    const handleSearch = (apiResponse) => {
        setEmployeeData(apiResponse.docs)
        setHasNextPage(apiResponse.hasNextPage)
        setNextPage(apiResponse.nextPage)
        resetFilters()
    }


    const fetchEmployeeByFilter = () => {
        const apiObject = {}

        Object.keys(filterOptions).forEach((key) => {
            if (key !== 'profession') {
                if (filterOptions[key] !== '') {
                    apiObject[key] = filterOptions[key];
                }
            }
        });

        if (filterOptions.profession.en !== '') {
            apiObject.profession = {
                ...apiObject.profession,
                en: filterOptions.profession.en
            };
        }

        console.log('apiObject of filter', apiObject);
        privateRequest.get('/user/filter', apiObject).then((res) => {
            setEmployeeData(res.data.docs)
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })
    }

    const fetchMoreEmployeeByFilter = () => {

        const apiObject = {}

        Object.keys(filterOptions).forEach((key) => {
            if (key !== 'profession') {
                if (filterOptions[key] !== '') {
                    apiObject[key] = filterOptions[key];
                }
            }
        });

        if (filterOptions.profession.en !== '') {
            apiObject.profession = {
                ...apiObject.profession,
                en: filterOptions.profession.en
            };
        }

        const headers = {
            'x-pagination-skip': nextPage,
            'x-pagination-limit': 10
        };

        privateRequest.get('/user/filter', apiObject, { headers }).then((res) => {
            let tempArray = [...employeeData];
            tempArray = tempArray.concat(res.data.docs)
            setEmployeeData(tempArray);
            setHasNextPage(res.data.hasNextPage)
            setNextPage(res.data.nextPage)
        }).catch((error) => {
            toast.error(error.response.data.error.message)
        })

    }

    useEffect(() => {
        if (shouldReload) {
            fetchEmployees()
            dispatch(employeeReloadFalse())
        }
    }, [shouldReload])

    return (
        <>
            <Box sx={{ marginTop: '34px' }}>
                <SearchBar placeholderValue='Search Employee' handleSetValue={(value) => handleSearch(value)} />
            </Box>



            <Box display='flex' mt='16.55px'>

                <Box mr='24px'>
                    <CustomDropdown
                        placeholderValue='Profession'
                        menuItems={professionsList}
                        value={dropdownOptions.profession}
                        handleDropdownValue={(value) => {
                            setFilterOptions((prevOptions) => ({
                                ...prevOptions,
                                profession: {
                                    ...prevOptions.profession,
                                    en: value.toLowerCase()
                                }
                            }));
                            setDropdownOptions((prevOptions) => ({
                                ...prevOptions,
                                profession: value
                            }));
                            setIsFiltered(true);
                        }}
                    />
                </Box>

                <Box mr='24px'>
                    <CustomDropdown
                        placeholderValue='Status'
                        menuItems={['Active', 'In-Active']}
                        value={dropdownOptions.status}
                        handleDropdownValue={(value) => {
                            let newValue = false
                            if (value === 'Active') newValue = true
                            setFilterOptions((prevOptions) => ({
                                ...prevOptions,
                                status: newValue
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
                        menuItems={['joinedOn', 'Name']}
                        value={dropdownOptions.sortBy}
                        handleDropdownValue={(value) => {
                            setFilterOptions((prevOptions) => ({
                                ...prevOptions,
                                sortBy: value === 'Name' ? value.toLowerCase() : value
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
                        menuItems={['Asc', 'Desc']}
                        value={dropdownOptions.sortOrder}
                        handleDropdownValue={(value) => {
                            setFilterOptions((prevOptions) => ({
                                ...prevOptions,
                                sortOrder: value.toLowerCase()
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

            <Box sx={{ marginTop: '16.8px' }}>
                {
                    employeeData.length !== 0 && (
                        <InfiniteScroll
                            dataLength={employeeData.length}
                            next={isFiltered ? fetchMoreEmployeeByFilter : fetchMoreEmployees}
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
                            {employeeData.map((value, index) => (
                                <EmployeeCard
                                    handleOpenEmpProfile={props.handleOpenEmpProfile}
                                    handleOpenComProfile={props.handleOpenComProfile}
                                    key={index}
                                    id={value._id}
                                    name={`${value.firstName.en} ${value.lastName.en}`}
                                    email={value.email}
                                    profession={value.profession.en}
                                    profileImage={value.profilePicture}
                                    companyName={value.company ? value.company.name : 'NULL'}
                                    status={value.isActive ? 'Active' : 'Deactivated'}
                                />
                            ))}
                        </InfiniteScroll>
                    )
                }

                {(employeeData.length === 0 && firstRender === false) && (
                    <Box display='flex' justifyContent='center' flexDirection='column' alignItems='center' mt='50px'>
                        <Empty />
                        <Typography>No data to display</Typography>
                    </Box>
                )}




            </Box>





        </>
    )
}

export default EmployeeDirectory