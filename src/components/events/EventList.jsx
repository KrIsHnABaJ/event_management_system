import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsByProfile, deleteEvent } from '../../features/events/eventsSlice';
import { fetchProfiles } from '../../features/profiles/profilesSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import TimezoneSelect from '../common/TimezoneSelect';
import EventLogs from './EventLogs'; // ADD THIS IMPORT
import { 
  formatInTimezone, 
  formatTimeRange, 
  getUserTimezone, 
  getTimezoneAbbr,
  convertTimezone 
} from '../../utils/timezone';
import './EventList.css';

const EventList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { events = [], loading = false, error = null } = useSelector((state) => state.events || {});
  const { profiles = [], loading: profilesLoading } = useSelector((state) => state.profiles || {});
  const userTimezone = getUserTimezone();
  const [selectedTimezone, setSelectedTimezone] = useState(userTimezone);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [showLogs, setShowLogs] = useState(null); // ADD THIS STATE

  useEffect(() => {
    console.log('EventList: Fetching profiles...');
    dispatch(fetchProfiles());
  }, [dispatch]);

  useEffect(() => {
    console.log('EventList: Profiles from Redux:', profiles);
    console.log('EventList: Number of profiles:', profiles.length);
  }, [profiles]);

  useEffect(() => {
    if (selectedProfile) {
      console.log('EventList: Fetching events for profile:', selectedProfile);
      dispatch(fetchEventsByProfile(selectedProfile));
    }
  }, [dispatch, selectedProfile]);

  useEffect(() => {
    console.log('EventList: Events from Redux:', events);
    console.log('EventList: Number of events:', events.length);
    console.log('EventList: Events array:', JSON.stringify(events, null, 2));
  }, [events]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await dispatch(deleteEvent(id));
      if (selectedProfile) {
        dispatch(fetchEventsByProfile(selectedProfile));
      }
    }
  };

  const handleTimezoneChange = (timezone) => {
    setSelectedTimezone(timezone);
  };

  const handleProfileChange = (e) => {
    const profileId = e.target.value;
    console.log('EventList: Profile selected:', profileId);
    setSelectedProfile(profileId);
  };

  // ADD THIS FUNCTION
  const handleViewLogs = (eventId) => {
    setShowLogs(eventId);
  };

  // ADD THIS FUNCTION
  const handleCloseLogs = () => {
    setShowLogs(null);
  };

  const renderEventTime = (event) => {
    if (!event.startDate || !event.endDate) {
      return <span>Time not specified</span>;
    }

    const eventTimezone = event.timezone || 'UTC';
    const displayTimezone = selectedTimezone;
    
    try {
      const startDate = selectedTimezone !== eventTimezone
        ? convertTimezone(event.startDate, eventTimezone, selectedTimezone)
        : new Date(event.startDate);
      
      const endDate = selectedTimezone !== eventTimezone
        ? convertTimezone(event.endDate, eventTimezone, selectedTimezone)
        : new Date(event.endDate);

      const timeRange = formatTimeRange(
        startDate, 
        endDate, 
        displayTimezone, 
        true
      );

      return (
        <div className="event-time-container">
          <div className="event-time-main">
            {timeRange}
          </div>
          {selectedTimezone !== eventTimezone && (
            <div className="event-time-original">
              Original: {formatTimeRange(event.startDate, event.endDate, eventTimezone, true)}
            </div>
          )}
        </div>
      );
    } catch (error) {
      console.error('Error rendering event time:', error);
      return <span>Invalid date</span>;
    }
  };

  const getProfileNames = (eventProfiles) => {
    if (!eventProfiles || eventProfiles.length === 0) return 'Unknown';
    
    return eventProfiles.map(profile => {
      if (typeof profile === 'object' && profile.name) {
        return profile.name;
      }
      const foundProfile = profiles.find(p => p._id === profile);
      return foundProfile ? foundProfile.name : 'Unknown';
    }).join(', ');
  };

  if (profilesLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // ADD THIS: Show logs modal if showLogs is set
  if (showLogs) {
    return <EventLogs eventId={showLogs} onClose={handleCloseLogs} />;
  }

  console.log('EventList RENDER - selectedProfile:', selectedProfile);
  console.log('EventList RENDER - loading:', loading);
  console.log('EventList RENDER - events.length:', events.length);
  console.log('EventList RENDER - Should show events?', selectedProfile && !loading && events.length > 0);

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h2>Events</h2>
        <div className="event-filters">
          <div className="filter-group">
            <label htmlFor="profile-select">Select User/Profile: <span className="required">*</span></label>
            <select
              id="profile-select"
              value={selectedProfile}
              onChange={handleProfileChange}
              className="profile-select"
            >
              <option value="">-- Select a Profile --</option>
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <option key={profile._id} value={profile._id}>
                    {profile.name}
                  </option>
                ))
              ) : (
                <option disabled>No profiles available</option>
              )}
            </select>
          </div>
          
          {selectedProfile && (
            <div className="filter-group">
              <label htmlFor="timezone-select">Display timezone:</label>
              <TimezoneSelect
                value={selectedTimezone}
                onChange={handleTimezoneChange}
                showUserTimezone={true}
              />
            </div>
          )}
        </div>
      </div>

      {!selectedProfile ? (
        <div className="no-selection">
          <div className="no-selection-icon">👤</div>
          <h3>Select a Profile to View Events</h3>
          <p>Please select a user/profile from the dropdown above to see their events.</p>
        </div>
      ) : (
        <>
          <div className="event-summary">
            <p>
              Showing <strong>{events.length}</strong> event{events.length !== 1 ? 's' : ''}
              {' '}for <strong>{profiles.find(p => p._id === selectedProfile)?.name}</strong>
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : events.length === 0 ? (
            <div className="no-events">
              <div className="no-events-icon">📅</div>
              <h3>No Events Found</h3>
              <p>This user doesn't have any events yet.</p>
            </div>
          ) : (
            <div className="event-grid">
              {events.map((event) => (
                <div key={event._id} className="event-card">
                  <div className="event-card-header">
                    <h3>{event.title || 'Untitled Event'}</h3>
                    <span className={`event-status status-${event.status || 'draft'}`}>
                      {event.status || 'draft'}
                    </span>
                  </div>

                  <div className="event-card-body">
                    <p className="event-description">{event.description || 'No description provided'}</p>
                    
                    <div className="event-details">
                      <div className="event-detail">
                        <strong>Time:</strong>
                        {renderEventTime(event)}
                      </div>

                      {event.profiles && event.profiles.length > 0 && (
                        <div className="event-detail">
                          <strong>Organizer{event.profiles.length > 1 ? 's' : ''}:</strong> {getProfileNames(event.profiles)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="event-card-footer">
                    {/* ADD VIEW LOGS BUTTON */}
                    <button
                      onClick={() => handleViewLogs(event._id)}
                      className="btn btn-info"
                    >
                      View Logs
                    </button>
                    <button
                      onClick={() => onEdit(event)}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventList;