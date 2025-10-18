import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEvent } from '../../features/events/eventsSlice';
import { fetchProfiles } from '../../features/profiles/profilesSlice';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TimezoneSelect from '../common/TimezoneSelect';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import './CreateEvent.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const EditEvent = ({ event, onClose, onUpdateSuccess }) => {
  const dispatch = useDispatch();
  const { profiles = [], loading: profilesLoading } = useSelector((state) => state.profiles || {});
  const { loading: eventsLoading } = useSelector((state) => state.events || {});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedProfiles: [],
    timezone: 'UTC',
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  useEffect(() => {
    if (event) {
      console.log('EditEvent: Loading event data:', event);

      const profileIds = event.profiles?.map(p => 
        typeof p === 'object' ? p._id : p
      ) || [];

      setFormData({
        title: event.title || '',
        description: event.description || '',
        selectedProfiles: profileIds,
        timezone: event.timezone || 'UTC',
        startDate: event.startDate ? dayjs(event.startDate) : null,
        endDate: event.endDate ? dayjs(event.endDate) : null
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      selectedProfiles: prev.selectedProfiles.includes(value)
        ? prev.selectedProfiles.filter(id => id !== value)
        : [...prev.selectedProfiles, value]
    }));
  };

  const handleTimezoneChange = (timezone) => {
    setFormData(prev => ({
      ...prev,
      timezone
    }));
  };

  const handleStartDateChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      startDate: newValue
    }));
  };

  const handleEndDateChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      endDate: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.selectedProfiles.length === 0) {
      alert('Please select at least one profile');
      return;
    }

    if (formData.endDate.isBefore(formData.startDate)) {
      alert('End date must be after start date');
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      profiles: formData.selectedProfiles,
      timezone: formData.timezone,
      startDate: formData.startDate.tz(formData.timezone).toISOString(),
      endDate: formData.endDate.tz(formData.timezone).toISOString(),
      updatedBy: 'Admin' 
    };

    try {
      await dispatch(updateEvent({ 
        id: event._id, 
        data: eventData 
      })).unwrap();
      
      alert('Event updated successfully!');
      onUpdateSuccess?.();
    } catch (error) {
      console.error('Failed to update event:', error);
      alert(`Failed to update event: ${error}`);
    }
  };

  if (profilesLoading) {
    return <div>Loading profiles...</div>;
  }

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <h2>Edit Event</h2>
        <button onClick={onClose} className="btn btn-secondary">
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-group">
          <label htmlFor="title">
            Event Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter event title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter event description"
          />
        </div>

        <div className="form-group">
          <label>
            Select Profiles <span className="required">*</span>
          </label>
          <div className="profile-checkboxes">
            {profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <label key={profile._id} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={profile._id}
                    checked={formData.selectedProfiles.includes(profile._id)}
                    onChange={handleProfileChange}
                  />
                  {profile.name}
                </label>
              ))
            ) : (
              <p>No profiles available. Please create a profile first.</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="timezone">
            Timezone <span className="required">*</span>
          </label>
          <TimezoneSelect
            value={formData.timezone}
            onChange={handleTimezoneChange}
            showUserTimezone={true}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Start Date & Time <span className="required">*</span>
            </label>
            <DateTimePicker
              value={formData.startDate}
              onChange={handleStartDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true
                }
              }}
            />
          </div>

          <div className="form-group">
            <label>
              End Date & Time <span className="required">*</span>
            </label>
            <DateTimePicker
              value={formData.endDate}
              onChange={handleEndDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true
                }
              }}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={eventsLoading}
          >
            {eventsLoading ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;