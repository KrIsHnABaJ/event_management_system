import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profilesApi } from '../../services/api';

export const fetchProfiles = createAsyncThunk(
  'profiles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('profilesSlice: Fetching profiles...');
      const response = await profilesApi.getAll();
      console.log('profilesSlice: Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('profilesSlice: Error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profiles');
    }
  }
);

const profilesSlice = createSlice({
  name: 'profiles',
  initialState: {
    profiles: [],  // Changed from 'items' to 'profiles'
    loading: false,  // Changed from 'status' to 'loading'
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        console.log('profilesSlice: Pending...');
        state.loading = true;  // Changed from status = 'loading'
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        console.log('profilesSlice: Fulfilled with:', action.payload);
        state.loading = false;  // Changed from status = 'succeeded'
        state.profiles = action.payload;  // Changed from 'items'
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        console.log('profilesSlice: Rejected:', action.payload);
        state.loading = false;  // Changed from status = 'failed'
        state.error = action.payload || action.error.message;
      });
  }
});

export const { clearError } = profilesSlice.actions;
export default profilesSlice.reducer;