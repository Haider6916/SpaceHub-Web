import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    weekNumber: 0,
    dayNumber: 0,
    monthNumber: 0,
    viewType: 'Month',
    shouldBookingDrawerOpen: false,
    shouldTaskDrawerOpen: false,
    shouldCalendarReload: false,
    shouldShareModalOpen: false,
    shouldBookingModalOpen: false,
    shouldTaskModalOpen: false,
    shouldEventModalOpen: false,
    modal_ID_for_API: null
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        setModalID: (state, action) => {
            state.modal_ID_for_API = action.payload;
            // state.viewType = 'Month';
        },
        openBookingModal: (state) => {
            state.shouldBookingModalOpen = true;
        },
        closeBookingModal: (state) => {
            state.shouldBookingModalOpen = false;
            state.modal_ID_for_API = null;
        },
        openTaskModal: (state) => {
            state.shouldTaskModalOpen = true;
        },
        closeTaskModal: (state) => {
            state.shouldTaskModalOpen = false;
            state.modal_ID_for_API = null;
        },
        openEventModal: (state) => {
            state.shouldEventModalOpen = true;
        },
        closeEventModal: (state) => {
            state.shouldEventModalOpen = false;
            state.modal_ID_for_API = null;
        },
        openShareModal: (state) => {
            state.shouldShareModalOpen = true;
        },
        closeShareModal: (state) => {
            state.shouldShareModalOpen = false;
        },
        calendarReloadTrue: (state) => {
            state.shouldCalendarReload = true;
        },
        calendarReloadFalse: (state) => {
            state.shouldCalendarReload = false;
        },
        openTaskDrawer: (state) => {
            state.shouldTaskDrawerOpen = true;
        },
        closeTaskDrawer: (state) => {
            state.shouldTaskDrawerOpen = false;
        },
        openBookingDrawer: (state) => {
            state.shouldBookingDrawerOpen = true;
        },
        closeBookingDrawer: (state) => {
            state.shouldBookingDrawerOpen = false;
        },
        setMonth: (state, action) => {
            state.monthNumber = action.payload;
            // state.viewType = 'Month';
        },
        setDay: (state, action) => {
            state.dayNumber = action.payload;
            // state.viewType = 'Day';
        },
        setWeek: (state, action) => {
            state.weekNumber = action.payload;
            // state.viewType = 'Week';
        },
        dayIncrement: (state) => {
            state.dayNumber += 1;
        },
        dayDecrement: (state) => {
            state.dayNumber -= 1;
        },
        weekIncrement: (state) => {
            state.weekNumber += 1;
        },
        weekDecrement: (state) => {
            state.weekNumber -= 1;
        },
        monthIncrement: (state) => {
            state.monthNumber += 1;
        },
        monthDecrement: (state) => {
            state.monthNumber -= 1;
        },
        changeViewType: (state, action) => {
            state.viewType = action.payload;
        },
    }
});

export const {
    calendarReloadTrue,
    calendarReloadFalse,
    setMonth,
    setDay,
    setWeek,
    dayIncrement,
    dayDecrement,
    weekIncrement,
    weekDecrement,
    monthIncrement,
    monthDecrement,
    changeViewType,
    openBookingDrawer,
    closeBookingDrawer,
    openTaskDrawer,
    closeTaskDrawer,
    openShareModal,
    closeShareModal,
    openBookingModal,
    openEventModal,
    openTaskModal,
    closeBookingModal,
    closeEventModal,
    closeTaskModal,
    setModalID,
} = calendarSlice.actions;


export default calendarSlice.reducer;
