import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventsByProfile = createAsyncThunk(
  'events/fetchEventsByProfile',
  async (profileId, { rejectWithValue }) => {
    try {
      console.log('eventsSlice: Fetching events for profile:', profileId);
      const response = await api.get(`/events/profile/${profileId}`);
      console.log('eventsSlice: Events fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('eventsSlice: Error fetching events by profile:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('eventsSlice: Updating event:', id, data);
      const response = await api.patch(`/events/${id}`, data); 
      console.log('eventsSlice: Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('eventsSlice: Update error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearEvents: (state) => {
      state.events = [];
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload || [];
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.events = [];
      })

      .addCase(fetchEventsByProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.events = [];
      })
      .addCase(fetchEventsByProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload || [];
        console.log('eventsSlice reducer: Events set to:', state.events.length);
      })
      .addCase(fetchEventsByProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.events = [];
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(event => event._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedEvent, clearError, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;