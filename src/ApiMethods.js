// import axios from "axios";
// import { store } from "./store";

// const BASEURL = process.env.REACT_APP_BASEURL.toString()

// //console.log('store.getState', store.getState());

// //subscribes to the store and listens to the changes to its values
// let authToken = store.getState().auth.userToken


// console.log('authToken', authToken);

// export const publicRequest = axios.create({
//     baseURL: BASEURL,
// });

// export const privateRequest = axios.create({
//     baseURL: BASEURL,
//     headers: {
//         'Content-Type': 'application/json',
//         Authorization: authToken,
//     },
//     timeout: 60000
// });

// console.log('header', privateRequest.defaults.headers);


import axios from "axios";
import { store } from "./store";

const BASEURL = process.env.REACT_APP_BASEURL.toString()

export const publicRequest = axios.create({
    baseURL: BASEURL,
});

export const privateRequest = axios.create({
    baseURL: BASEURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000
});

// Subscribe to changes in the token value
store.subscribe(() => {
    const state = store.getState();
    const authToken = state.auth.userToken;
    privateRequest.defaults.headers.Authorization = authToken || '';
});

// Initial setup of Authorization header
const initialState = store.getState();
const initialAuthToken = initialState.auth.userToken;
privateRequest.defaults.headers.Authorization = initialAuthToken || '';

console.log('header', privateRequest.defaults.headers);