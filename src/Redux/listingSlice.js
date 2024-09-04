import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    shouldListingReload: false,
}

const listingSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        listingReloadTrue: (state) => {
            state.shouldListingReload = true;
        },
        listingReloadFalse: (state) => {
            state.shouldListingReload = false;
        },
    }
})
export const { listingReloadTrue, listingReloadFalse } = listingSlice.actions;

export default listingSlice.reducer
