import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shouldReceivedTicketsReload: false,
    shouldMyTicketsReload: false,
    shouldAddTicketOpen: false,
    shouldViewDrawerOpen: false,
    ticketID: null,
}

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {
        receivedTicketsReloadTrue: (state) => {
            state.shouldReceivedTicketsReload = true;
        },
        receivedTicketsReloadFalse: (state) => {
            state.shouldReceivedTicketsReload = false;
        },
        myTicketsReloadTrue: (state) => {
            state.shouldMyTicketsReload = true;
        },
        myTicketsReloadFalse: (state) => {
            state.shouldMyTicketsReload = false;
        },
        openAddTicketDrawer: (state) => {
            state.shouldAddTicketOpen = true;
        },
        closeAddTicketDrawer: (state) => {
            state.shouldAddTicketOpen = false;
        },
        openViewDrawer: (state) => {
            state.shouldViewDrawerOpen = true;
        },
        closeViewDrawer: (state) => {
            state.shouldViewDrawerOpen = false;
        },
        setTicketID: (state, action) => {
            console.log('action.payload', action.payload);
            state.ticketID = action.payload;
        },
        removeTicketID: (state) => {
            state.ticketID = null;
        },


    }
})
export const { receivedTicketsReloadFalse, receivedTicketsReloadTrue, myTicketsReloadFalse, myTicketsReloadTrue, openAddTicketDrawer, closeAddTicketDrawer, openViewDrawer, closeViewDrawer, setTicketID, removeTicketID } = supportSlice.actions;

export default supportSlice.reducer
