import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from '../features/events/eventsSlice';
import profilesReducer from '../features/profiles/profilesSlice';

const store = configureStore({
  reducer: {
    events: eventsReducer,
    profiles: profilesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {

        ignoredActions: ['events/createEvent/fulfilled', 'events/updateEvent/fulfilled'],

        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],

        ignoredPaths: ['events.selectedEvent']
      }
    })
});

export default store;