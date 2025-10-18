import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import dayjs from 'dayjs';
import './CreateEvent.css';

const EventLogs = ({ eventId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${eventId}/logs`);
        console.log('EventLogs: Fetched logs:', response.data);
        setLogs(response.data);
        setError(null);
      } catch (err) {
        console.error('EventLogs: Error fetching logs:', err);
        setError('Failed to load event logs');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchLogs();
    }
  }, [eventId]);

  const formatFieldName = (field) => {
    return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    
    // Check if it's a date string
    if (typeof value === 'string' && !isNaN(Date.parse(value)) && value.includes('T')) {
      return dayjs(value).format('MMM DD, YYYY hh:mm A');
    }
    
    return value;
  };

  if (loading) {
    return (
      <div className="create-event-container">
        <div className="create-event-header">
          <h2>Event Logs</h2>
          <button onClick={onClose} className="btn btn-secondary">
            Back to List
          </button>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <h2>Event Update History</h2>
        <button onClick={onClose} className="btn btn-secondary">
          Back to List
        </button>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : logs.length === 0 ? (
        <div className="no-events">
          <div className="no-events-icon">📋</div>
          <h3>No Update History</h3>
          <p>This event hasn't been updated yet.</p>
        </div>
      ) : (
        <div className="event-logs-list">
          {logs.map((log, index) => (
            <div key={log._id || index} className="event-log-card">
              <div className="event-log-header">
                <strong>Update #{logs.length - index}</strong>
                <span className="event-log-date">
                  {dayjs(log.createdAt).format('MMM DD, YYYY hh:mm A')}
                </span>
              </div>
              
              {log.updatedBy && (
                <div className="event-log-user">
                  Updated by: <strong>{log.updatedBy}</strong>
                </div>
              )}

              <div className="event-log-changes">
                {log.changes && log.changes.length > 0 ? (
                  log.changes.map((change, idx) => (
                    <div key={idx} className="event-log-change">
                      <div className="change-field">{formatFieldName(change.field)}:</div>
                      <div className="change-values">
                        <div className="old-value">
                          <span className="value-label">Old:</span>
                          <span className="value-content">{formatValue(change.oldValue)}</span>
                        </div>
                        <div className="arrow">→</div>
                        <div className="new-value">
                          <span className="value-label">New:</span>
                          <span className="value-content">{formatValue(change.newValue)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No changes recorded</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventLogs;