import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // أو http://127.0.0.1:5000
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
