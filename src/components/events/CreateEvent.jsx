import { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Alert,
  Snackbar 
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import TimezoneSelect from '../common/TimezoneSelect';
import { eventsApi } from '../../services/api';
import { fetchEvents } from '../../features/events/eventsSlice';
import { fetchProfiles } from '../../features/profiles/profilesSlice';

const CreateEvent = () => {
  const dispatch = useDispatch();
  const profiles = useSelector(state => state.profiles.profiles || []); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    profiles: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, 
    startDate: dayjs(),
    endDate: dayjs().add(1, 'hour')
  });

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.endDate.isBefore(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      const eventData = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString()
      };

      await eventsApi.create(eventData);
      dispatch(fetchEvents());
      
     
      setFormData({
        title: '',
        description: '',
        profiles: [],
        timezone: formData.timezone,
        startDate: dayjs(),
        endDate: dayjs().add(1, 'hour')
      });
      
      setSuccess(true);
    } catch (error) {
      setError(error.message || 'Failed to create event');
    }
  };

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => setSuccess(false);

  return (
    <Box sx={{ maxWidth: 600, margin: '20px auto', p: 3, boxShadow: 1, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Create New Event
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          margin="normal"
          multiline
          rows={3}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Profiles</InputLabel>
          <Select
            multiple
            value={formData.profiles}
            onChange={(e) => setFormData({ ...formData, profiles: e.target.value })}
            required
          >
            {profiles.map(profile => (
              <MenuItem key={profile._id} value={profile._id}>
                {profile.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TimezoneSelect
          value={formData.timezone}
          onChange={(newValue) => setFormData({ ...formData, timezone: newValue })}
        />

        <DateTimePicker
          label="Start Date & Time"
          value={formData.startDate}
          onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
          sx={{ mt: 2, width: '100%' }}
        />

        <DateTimePicker
          label="End Date & Time"
          value={formData.endDate}
          onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
          sx={{ mt: 2, width: '100%' }}
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Create Event
        </Button>
      </form>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success">
          Event created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateEvent;