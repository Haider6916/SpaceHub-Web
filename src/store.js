import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import authSlice from './Redux/authSlice'
import directorySlice from './Redux/directorySlice'
import listingSlice from './Redux/listingSlice'
import visitorsSlice from './Redux/visitorsSlice'
import supportSlice from './Redux/supportSlice'
import eventsSlice from './Redux/eventsSlice'
import bookingsSlice from './Redux/bookingsSlice'
import calendarSlice from './Redux/calendarSlice'

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    auth: authSlice,
    directory: directorySlice,
    listing: listingSlice,
    visitor: visitorsSlice,
    support: supportSlice,
    event: eventsSlice,
    booking: bookingsSlice,
    calendar: calendarSlice,

});

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
})

const persistor = persistStore(store)

export { store, persistor }