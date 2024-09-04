import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shouldVisitorsReload: false,
}

const visitorsSlice = createSlice({
    name: 'visitors',
    initialState,
    reducers: {
        visitorsReloadTrue: (state) => {
            state.shouldVisitorsReload = true;
        },
        visitorsReloadFalse: (state) => {
            state.shouldVisitorsReload = false;
        },
    }
})
export const { visitorsReloadTrue, visitorsReloadFalse } = visitorsSlice.actions;

export default visitorsSlice.reducer
