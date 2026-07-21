import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Outgoing interceptor injecting auth state tokens
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access') || localStorage.getItem('access_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- AUTH & DATA RETRIEVAL FUNCTIONS ---

/**
 * Handles user login, stores tokens and user info in localStorage.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} Response data containing tokens and user info
 */
export const loginUser = async (username, password) => {
  try {
    const response = await API.post('/accounts/login/', { username, password });
    const data = response.data;

    // Save tokens and user details to localStorage
    if (data.tokens && data.tokens.access) {
      localStorage.setItem('access', data.tokens.access);
      localStorage.setItem('refresh', data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error during login');
  }
};

/**
 * Fetches protected student records. Automatically uses the token from interceptor.
 * @returns {Promise<Array>} List of students
 */
export const fetchStudents = async () => {
  try {
    const response = await API.get('/students/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch students data');
  }
};

/**
 * Creates a new student record in the database.
 * @param {Object} studentData
 * @returns {Promise<Object>} Created student object
 */
export const createStudent = async (studentData) => {
  try {
    const response = await API.post('/students/', studentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create student record');
  }
};

export default API;