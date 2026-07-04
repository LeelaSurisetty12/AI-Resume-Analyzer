// Centralized Axios instance.
// Every service module (authService, resumeService, etc.) should import
// this instead of calling axios directly, so base URL, headers, and
// interceptors (auth tokens, error handling) stay in one place.

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Placeholder for future request interceptor (e.g. attaching Firebase auth token)
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Placeholder for future response interceptor (e.g. global error normalization)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default apiClient;
