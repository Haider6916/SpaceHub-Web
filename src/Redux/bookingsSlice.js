import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shouldBookingsReload: false,
    shouldAddBookingOpen: false,
    shouldEditBookingOpen: false,
    shouldSuccessOpen: false,

    shouldUsersListOpen: false,
    shouldEmpProfileOpen: false,
    usersData: null
}

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        bookingsReloadTrue: (state) => {
            state.shouldBookingsReload = true;
        },
        bookingsReloadFalse: (state) => {
            state.shouldBookingsReload = false;
        },

        openAddBookingDrawer: (state) => {
            state.shouldAddBookingOpen = true;
        },
        closeAddBookingDrawer: (state) => {
            state.shouldAddBookingOpen = false;
        },

        openEmpProfileDrawer: (state) => {
            state.shouldEmpProfileOpen = true;
        },
        closeEmpProfileDrawer: (state) => {
            state.shouldEmpProfileOpen = false;
        },

        openUsersList: (state, action) => {
            state.shouldUsersListOpen = true;
            state.usersData = action.payload
        },
        closeUsersList: (state) => {
            state.shouldUsersListOpen = false;
            state.usersData = null
        },

        openSuccessModal: (state) => {
            state.shouldSuccessOpen = true;
        },
        closeSuccessModal: (state) => {
            state.shouldSuccessOpen = false;
        },



    }
})
export const { bookingsReloadFalse, bookingsReloadTrue, openAddBookingDrawer, closeAddBookingDrawer, openUsersList, closeUsersList, openEmpProfileDrawer, closeEmpProfileDrawer, openSuccessModal, closeSuccessModal } = bookingsSlice.actions;

export default bookingsSlice.reducer
