import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfiles } from '../../features/profiles/profilesSlice';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const ProfileList = () => {
  const dispatch = useDispatch();
  const { items: profiles, status, error } = useSelector(state => state.profiles);

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Profiles
      </Typography>
      <List>
        {profiles.map(profile => (
          <ListItem key={profile._id}>
            <ListItemText 
              primary={profile.name}
              secondary={`Timezone: ${profile.timezone}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProfileList;