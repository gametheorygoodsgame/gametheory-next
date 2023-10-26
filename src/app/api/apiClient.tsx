import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:30167', // Replace with your API URL
  timeout: 5000, // Set a suitable timeout
});

export default apiClient;
