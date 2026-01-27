import axios from 'axios';

// Replace with your actual backend URL
// For Android Emulator, use 'http://10.0.2.2:3000'
// For iOS Simulator, use 'http://localhost:3000'
// For physical device, use your machine's local IP, e.g., 'http://192.168.1.5:3000'
const BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // TODO: Get token from AsyncStorage
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors like 401 Unauthorized here
    if (error.response && error.response.status === 401) {
      // Navigate to login or clear session
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default api;
