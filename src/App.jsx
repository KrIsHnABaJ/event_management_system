import { useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Container, Box, Divider } from '@mui/material';
import CreateProfile from './components/profiles/CreateProfile';
import CreateEvent from './components/events/CreateEvent';
import EventList from './components/events/EventList';
import EditEvent from './components/events/EditEvent';
import './App.css';

function App() {
  const [editingEvent, setEditingEvent] = useState(null);

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  const handleCloseEdit = () => {
    setEditingEvent(null);
  };

  const handleUpdateSuccess = () => {
    setEditingEvent(null);
  };

  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container>
          <h1>Event Management System</h1>
          
          {editingEvent ? (
            <EditEvent 
              event={editingEvent} 
              onClose={handleCloseEdit}
              onUpdateSuccess={handleUpdateSuccess}
            />
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                <CreateProfile />
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Box>
                <CreateEvent />
                <EventList onEdit={handleEdit} />
              </Box>
            </>
          )}
        </Container>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;