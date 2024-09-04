import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shouldEventsReload: false,
    shouldAddEventOpen: false,
    shouldEditEventOpen: false,
    shouldUsersListOpen: false,
    shouldEmpProfileOpen: false,
    eventDetailsForEdit: null,
    usersData: null
}

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        eventsReloadTrue: (state) => {
            state.shouldEventsReload = true;
        },
        eventsReloadFalse: (state) => {
            state.shouldEventsReload = false;
        },

        openAddEventDrawer: (state) => {
            state.shouldAddEventOpen = true;
        },
        closeAddEventDrawer: (state) => {
            state.shouldAddEventOpen = false;
        },

        openEditEventDrawer: (state, action) => {
            state.shouldEditEventOpen = true;
            state.eventDetailsForEdit = action.payload
        },
        closeEditEventDrawer: (state) => {
            state.shouldEditEventOpen = false;
            state.eventDetails = null
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



    }
})
export const { eventsReloadFalse, eventsReloadTrue, openAddEventDrawer, closeAddEventDrawer, openUsersList, closeUsersList, openEmpProfileDrawer, closeEmpProfileDrawer, closeEditEventDrawer, openEditEventDrawer } = eventSlice.actions;

export default eventSlice.reducer
