import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userRole: null,
    userToken: null, // for storing the JWT
    isAuthenticated: false,
    userDetails: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            // let authtoken = action.payload.data.authToken.split(" ");
            state.userRole = 'space_owner';
            state.userToken = action.payload.data.authToken;
            state.userDetails = action.payload.data.user;
            state.isAuthenticated = true;
        },
        logoutSuccess: (state) => {
            state.userRole = null;
            state.userToken = null;
            state.isAuthenticated = false
            state.userDetails = null
        }
    }
})
export const { logoutSuccess, loginSuccess } = authSlice.actions;

export default authSlice.reducer

// export const selectCurrentToken = (state) => initialState.userToken 
export const userToken = initialState.userToken;