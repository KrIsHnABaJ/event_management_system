import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, TextField, Button, Snackbar, Alert } from '@mui/material';
import { profilesApi } from '../../services/api';
import { fetchProfiles } from '../../features/profiles/profilesSlice';

const CreateProfile = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profilesApi.create({ name });
      dispatch(fetchProfiles());
      setName('');
      setFeedback({
        open: true,
        message: 'Profile created successfully',
        severity: 'success'
      });
    } catch (error) {
      setFeedback({
        open: true,
        message: error.message || 'Failed to create profile',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Profile Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Profile
        </Button>
      </form>

      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert 
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.severity}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateProfile;