import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://stayfinder-5062.onrender.com/api/v1",
    withCredentials: true, 
});

export default axiosInstance;