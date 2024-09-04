import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shouldEmployeeReload: false,
    shouldCompanyReload: false,
}

const directorySlice = createSlice({
    name: 'directory',
    initialState,
    reducers: {
        employeeReloadTrue: (state) => {
            state.shouldEmployeeReload = true;
        },
        employeeReloadFalse: (state) => {
            state.shouldEmployeeReload = false;
        },
        comapanyReloadTrue: (state) => {
            state.shouldCompanyReload = true;
        },
        comapanyReloadFalse: (state) => {
            state.shouldCompanyReload = false;
        },
    }
})
export const { employeeReloadTrue, employeeReloadFalse, comapanyReloadFalse, comapanyReloadTrue } = directorySlice.actions;

export default directorySlice.reducer
