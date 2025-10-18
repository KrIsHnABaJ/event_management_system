import axios from 'axios';

const api = axios.create({
  baseURL: 'https://event-mangement-backend-ten.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const profilesApi = {
  getAll: () => api.get('/profiles'),
  create: (data) => api.post('/profiles', data),
  update: (id, data) => api.patch(`/profiles/${id}`, data)
};

export const eventsApi = {
  getAll: () => api.get('/events'),
  getByProfile: (profileId) => api.get(`/events/profile/${profileId}`), 
  create: (data) => api.post('/events', data),
  update: (id, data) => api.patch(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getLogs: (eventId) => api.get(`/events/${eventId}/logs`)
};

export default api;